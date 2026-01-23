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
        const { leadId, maxContractors = 3, specialtyRequired } = await req.json();
        
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        // Get lead details
        const leadResponse = await fetch(`${supabaseUrl}/rest/v1/leads?id=eq.${leadId}`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey
            }
        });

        if (!leadResponse.ok) {
            throw new Error('Lead not found');
        }

        const leads = await leadResponse.json();
        const lead = leads[0];

        if (!lead) {
            throw new Error('Lead not found');
        }

        // Build contractor query
        let contractorQuery = `${supabaseUrl}/rest/v1/contractors?is_active=eq.true&is_verified=eq.true`;
        
        if (specialtyRequired) {
            contractorQuery += `&specialties=cs.{"${specialtyRequired}"}`;
        }

        // Get available contractors
        const contractorResponse = await fetch(contractorQuery, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey
            }
        });

        if (!contractorResponse.ok) {
            throw new Error('Failed to fetch contractors');
        }

        const allContractors = await contractorResponse.json();

        // Calculate distance and match score for each contractor
        const scoredContractors = allContractors.map(contractor => {
            let matchScore = 0;
            
            // Base score for being verified and active
            matchScore += 20;
            
            // Rating score (0-25 points)
            matchScore += (contractor.rating / 5) * 25;
            
            // Experience score based on total jobs (0-15 points)
            matchScore += Math.min((contractor.total_jobs / 100) * 15, 15);
            
            // Response time score (0-15 points) - lower response time = higher score
            matchScore += Math.max(15 - contractor.response_time_hours, 0);
            
            // Availability bonus (0-10 points)
            if (contractor.availability_status === 'available') matchScore += 10;
            else if (contractor.availability_status === 'busy') matchScore += 5;
            
            // Specialty match bonus (0-15 points)
            if (specialtyRequired && contractor.specialties && contractor.specialties.includes(specialtyRequired)) {
                matchScore += 15;
            }
            
            // Location proximity bonus (simplified - same state gets points)
            if (contractor.state === lead.state) matchScore += 10;
            
            return {
                ...contractor,
                matchScore: Math.round(matchScore)
            };
        });

        // Sort by match score and limit results
        const topContractors = scoredContractors
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, maxContractors);

        // Update lead status to indicate contractor matching completed
        await fetch(`${supabaseUrl}/rest/v1/leads?id=eq.${leadId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                updated_at: new Date().toISOString()
            })
        });

        return new Response(JSON.stringify({
            data: {
                matchedContractors: topContractors,
                leadId: leadId,
                totalAvailable: allContractors.length,
                matchingCriteria: {
                    specialtyRequired,
                    maxContractors,
                    leadLocation: `${lead.city}, ${lead.state}`
                }
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Contractor matching error:', error);

        const errorResponse = {
            error: {
                code: 'CONTRACTOR_MATCHING_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});