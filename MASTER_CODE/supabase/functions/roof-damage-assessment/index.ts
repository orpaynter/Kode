Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const { imageUrl, projectId, userId } = await req.json();

        if (!imageUrl) {
            throw new Error('Image URL is required for analysis');
        }

        // Get environment variables
        const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!openaiApiKey) {
            throw new Error('OpenAI API key not configured');
        }

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        console.log('Starting roof damage analysis for image:', imageUrl);
        const analysisStartTime = Date.now();

        // Analyze image with OpenAI Vision API
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openaiApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: `Analyze this roof image for damage. Provide a detailed assessment including:
1. Damage types present (hail damage, wind damage, wear and tear, structural issues, leaks, missing shingles, etc.)
2. Severity score (1-10 scale)
3. Confidence in assessment (0-1 scale)
4. Estimated repair cost range
5. Insurance claim probability
6. Priority level (low/medium/high/emergency)
7. Detailed description of findings

Respond in JSON format with these exact fields: damageTypes (array), severityScore (number 1-10), confidenceScore (number 0-1), estimatedCostMin (number), estimatedCostMax (number), insuranceClaimProbability (number 0-1), priorityLevel (string), detailedFindings (string), recommendedActions (array of strings).`
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: imageUrl
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 1000,
                temperature: 0.1
            })
        });

        if (!openaiResponse.ok) {
            const errorData = await openaiResponse.text();
            console.error('OpenAI API error:', errorData);
            throw new Error(`OpenAI API error: ${errorData}`);
        }

        const openaiResult = await openaiResponse.json();
        console.log('OpenAI analysis completed');

        // Parse the AI response
        let analysisResult;
        try {
            const content = openaiResult.choices[0].message.content;
            // Try to extract JSON from the response
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                analysisResult = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No JSON found in response');
            }
        } catch (parseError) {
            console.error('Failed to parse OpenAI response:', parseError);
            // Fallback analysis structure
            analysisResult = {
                damageTypes: ['analysis_error'],
                severityScore: 5,
                confidenceScore: 0.1,
                estimatedCostMin: 1000,
                estimatedCostMax: 5000,
                insuranceClaimProbability: 0.5,
                priorityLevel: 'medium',
                detailedFindings: 'Analysis could not be completed due to parsing error.',
                recommendedActions: ['Contact a professional for manual inspection']
            };
        }

        const processingTimeSeconds = Math.round((Date.now() - analysisStartTime) / 1000);

        // Save assessment to database
        const assessmentData = {
            lead_id: projectId || userId, // Use projectId if available, fallback to userId
            photo_url: imageUrl,
            ai_analysis_result: analysisResult,
            damage_types: analysisResult.damageTypes,
            confidence_score: analysisResult.confidenceScore,
            estimated_cost_min: analysisResult.estimatedCostMin,
            estimated_cost_max: analysisResult.estimatedCostMax,
            insurance_claim_probability: analysisResult.insuranceClaimProbability,
            priority_level: analysisResult.priorityLevel,
            analysis_status: 'completed',
            processing_time_seconds: processingTimeSeconds,
            created_at: new Date().toISOString()
        };

        console.log('Saving assessment to database...');

        const dbResponse = await fetch(`${supabaseUrl}/rest/v1/damage_assessments`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(assessmentData)
        });

        if (!dbResponse.ok) {
            const errorText = await dbResponse.text();
            console.error('Database error:', errorText);
            throw new Error(`Database error: ${errorText}`);
        }

        const savedAssessment = await dbResponse.json();
        console.log('Assessment saved successfully:', savedAssessment[0].id);

        const result = {
            data: {
                assessmentId: savedAssessment[0].id,
                analysis: analysisResult,
                processingTime: processingTimeSeconds,
                confidenceScore: analysisResult.confidenceScore,
                priorityLevel: analysisResult.priorityLevel,
                estimatedCost: {
                    min: analysisResult.estimatedCostMin,
                    max: analysisResult.estimatedCostMax
                },
                damageTypes: analysisResult.damageTypes,
                insuranceClaimProbability: analysisResult.insuranceClaimProbability,
                recommendedActions: analysisResult.recommendedActions
            }
        };

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Roof damage assessment error:', error);

        const errorResponse = {
            error: {
                code: 'ASSESSMENT_FAILED',
                message: error.message,
                timestamp: new Date().toISOString()
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});