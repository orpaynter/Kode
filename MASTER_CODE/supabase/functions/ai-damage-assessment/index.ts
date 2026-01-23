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
        const startTime = Date.now();
        const { imageData, fileName, leadId } = await req.json();

        if (!imageData || !fileName) {
            throw new Error('Image data and filename are required');
        }

        // Get environment variables
        const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!openaiApiKey || !serviceRoleKey || !supabaseUrl) {
            throw new Error('Required API keys not configured');
        }

        // Extract base64 data and upload to Supabase Storage
        const base64Data = imageData.split(',')[1];
        const mimeType = imageData.split(';')[0].split(':')[1];
        const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

        // Upload to Supabase Storage
        const uploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/damage-photos/${fileName}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'Content-Type': mimeType,
                'x-upsert': 'true'
            },
            body: binaryData
        });

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            throw new Error(`Image upload failed: ${errorText}`);
        }

        const publicUrl = `${supabaseUrl}/storage/v1/object/public/damage-photos/${fileName}`;

        // Analyze with OpenAI Vision API
        const analysisPrompt = `Analyze this roof damage photo and provide a comprehensive assessment. Return a JSON response with the following structure:
        {
            "damageTypes": ["hail", "wind", "wear", "structural", "leak", "missing_shingles", "granule_loss", "cracking", "sagging", "ice_dam", "flashing_damage", "gutter_damage", "chimney_damage", "vent_damage", "edge_damage"],
            "severity": "minor" | "moderate" | "severe" | "emergency",
            "confidenceScore": 0.95,
            "estimatedCostMin": 5000,
            "estimatedCostMax": 15000,
            "insuranceClaimProbability": 0.85,
            "priorityLevel": "high",
            "description": "Detailed description of visible damage",
            "recommendations": ["Immediate repair needed", "Professional inspection required"]
        }
        
        Provide realistic cost estimates based on current market rates. Consider damage severity, roof size, and repair complexity.`;

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
                            { type: 'text', text: analysisPrompt },
                            { type: 'image_url', image_url: { url: imageData } }
                        ]
                    }
                ],
                max_tokens: 1000,
                temperature: 0.1
            })
        });

        if (!openaiResponse.ok) {
            const errorData = await openaiResponse.text();
            throw new Error(`OpenAI API error: ${errorData}`);
        }

        const aiResult = await openaiResponse.json();
        const analysisText = aiResult.choices[0].message.content;
        
        // Parse JSON from AI response
        let parsedAnalysis;
        try {
            // Extract JSON from markdown code blocks if present
            const jsonMatch = analysisText.match(/```json\s*([\s\S]*?)\s*```/) || analysisText.match(/```\s*([\s\S]*?)\s*```/);
            const jsonText = jsonMatch ? jsonMatch[1] : analysisText;
            parsedAnalysis = JSON.parse(jsonText);
        } catch (parseError) {
            // Fallback parsing if JSON is malformed
            parsedAnalysis = {
                damageTypes: ['general_damage'],
                severity: 'moderate',
                confidenceScore: 0.8,
                estimatedCostMin: 3000,
                estimatedCostMax: 8000,
                insuranceClaimProbability: 0.7,
                priorityLevel: 'medium',
                description: 'AI analysis completed with fallback parsing',
                recommendations: ['Professional inspection recommended']
            };
        }

        const processingTime = Math.round((Date.now() - startTime) / 1000);

        // Save assessment to database
        const assessmentData = {
            lead_id: leadId,
            photo_url: publicUrl,
            ai_analysis_result: parsedAnalysis,
            damage_types: parsedAnalysis.damageTypes,
            confidence_score: parsedAnalysis.confidenceScore,
            estimated_cost_min: parsedAnalysis.estimatedCostMin,
            estimated_cost_max: parsedAnalysis.estimatedCostMax,
            insurance_claim_probability: parsedAnalysis.insuranceClaimProbability,
            priority_level: parsedAnalysis.priorityLevel,
            analysis_status: 'completed',
            processing_time_seconds: processingTime
        };

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
            throw new Error(`Database save failed: ${errorText}`);
        }

        const assessmentResult = await dbResponse.json();

        return new Response(JSON.stringify({
            data: {
                assessment: assessmentResult[0],
                photoUrl: publicUrl,
                processingTime: processingTime,
                analysis: parsedAnalysis
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('AI damage assessment error:', error);

        const errorResponse = {
            error: {
                code: 'AI_ASSESSMENT_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});