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
        const leadData = await req.json();
        console.log('=== QUALIFY LEAD FUNCTION START ===');
        console.log('1. Incoming request body:', JSON.stringify(leadData, null, 2));
        
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        console.log('2. Environment check - serviceRoleKey exists:', !!serviceRoleKey);
        console.log('2. Environment check - supabaseUrl exists:', !!supabaseUrl);

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        // Calculate BANT lead score (0-100)
        let score = 0;
        console.log('3. Starting BANT score calculation...');
        console.log('3. BANT Data - Budget:', leadData.budget_range);
        console.log('3. BANT Data - Authority (decision maker):', leadData.is_decision_maker);
        console.log('3. BANT Data - Need (damage severity):', leadData.damage_severity);
        console.log('3. BANT Data - Timeline (urgency level):', leadData.urgency_level);
        
        // Budget (25 points max)
        if (leadData.budget_range) {
            const budget = leadData.budget_range.toLowerCase();
            if (budget.includes('50000+') || budget.includes('unlimited')) score += 25;
            else if (budget.includes('20000-50000')) score += 20;
            else if (budget.includes('10000-20000')) score += 15;
            else if (budget.includes('5000-10000')) score += 10;
            else score += 5;
        }

        // Authority (25 points max)
        if (leadData.is_decision_maker) score += 25;
        else score += 10;

        // Need (25 points max)
        if (leadData.damage_severity === 'emergency') score += 25;
        else if (leadData.damage_severity === 'severe') score += 20;
        else if (leadData.damage_severity === 'moderate') score += 15;
        else score += 10;

        // Timeline (25 points max)
        if (leadData.urgency_level >= 8) score += 25;
        else if (leadData.urgency_level >= 6) score += 20;
        else if (leadData.urgency_level >= 4) score += 15;
        else score += 10;

        // Bonus points
        if (leadData.has_insurance) score += 10;
        if (leadData.claim_filed) score += 5;
        if (leadData.property_type === 'commercial') score += 5;

        // Determine qualification status
        let qualificationStatus = 'new';
        if (score >= 80) qualificationStatus = 'hot';
        else if (score >= 60) qualificationStatus = 'qualified';
        
        console.log('4. Score calculation complete:');
        console.log('4. Final lead score:', score);
        console.log('4. Qualification status:', qualificationStatus);

        // Add lead score to data
        const qualifiedLeadData = {
            ...leadData,
            lead_score: Math.min(score, 100),
            qualification_status: qualificationStatus
        };
        
        // Remove fields that don't exist in the database schema
        const { userType, ...dataForDatabase } = qualifiedLeadData;
        
        console.log('5. Prepared data for database insertion:');
        console.log('5. Qualified lead data (before filtering):', JSON.stringify(qualifiedLeadData, null, 2));
        console.log('5. Data for database (after filtering):', JSON.stringify(dataForDatabase, null, 2));

        // Save to database
        console.log('6. Attempting database save to URL:', `${supabaseUrl}/rest/v1/leads`);
        const dbResponse = await fetch(`${supabaseUrl}/rest/v1/leads`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(dataForDatabase)
        });

        console.log('7. Database response status:', dbResponse.status, dbResponse.statusText);
        
        if (!dbResponse.ok) {
            const errorText = await dbResponse.text();
            console.log('7. Database error response:', errorText);
            throw new Error(`Database save failed: ${errorText}`);
        }

        const savedLead = await dbResponse.json();
        console.log('8. Database save successful:');
        console.log('8. Saved lead data:', JSON.stringify(savedLead, null, 2));
        const leadId = savedLead[0].id;
        console.log('8. Extracted lead ID:', leadId);

        // Trigger emergency callback if needed
        if (leadData.damage_severity === 'emergency' || leadData.urgency_level >= 9) {
            // Log emergency callback request
            console.log(`Emergency callback requested for lead ${leadId}`);
        }

        const responseData = {
            data: {
                lead: savedLead[0],
                leadScore: score,
                qualificationStatus: qualificationStatus,
                emergencyCallback: leadData.damage_severity === 'emergency' || leadData.urgency_level >= 9
            }
        };
        
        console.log('9. SUCCESS - Sending response:');
        console.log('9. Response data:', JSON.stringify(responseData, null, 2));
        console.log('=== QUALIFY LEAD FUNCTION END (SUCCESS) ===');
        
        return new Response(JSON.stringify(responseData), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.log('=== QUALIFY LEAD FUNCTION ERROR ===');
        console.error('Lead qualification error:', error);
        console.error('Error stack:', error.stack);
        console.log('=== QUALIFY LEAD FUNCTION END (ERROR) ===');

        const errorResponse = {
            error: {
                code: 'LEAD_QUALIFICATION_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});