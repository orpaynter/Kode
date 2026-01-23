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
        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '20');
        const status = url.searchParams.get('status');
        const offset = (page - 1) * limit;
        
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        // Build query with filters
        let query = `${supabaseUrl}/rest/v1/leads?select=*&order=created_at.desc&limit=${limit}&offset=${offset}`;
        
        if (status && status !== 'all') {
            query += `&qualification_status=eq.${status}`;
        }

        const leadsResponse = await fetch(query, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'count=exact'
            }
        });

        if (!leadsResponse.ok) {
            throw new Error('Failed to fetch leads data');
        }

        const leads = await leadsResponse.json();
        const totalCount = leadsResponse.headers.get('Content-Range')?.split('/')[1] || '0';

        // Get summary statistics
        const statsResponse = await fetch(`${supabaseUrl}/rest/v1/leads?select=qualification_status,lead_score,created_at`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            }
        });

        let stats = {
            total: 0,
            new: 0,
            qualified: 0,
            hot: 0,
            converted: 0,
            averageScore: 0,
            todayCount: 0
        };

        if (statsResponse.ok) {
            const allLeads = await statsResponse.json();
            stats.total = allLeads.length;
            
            const today = new Date().toISOString().split('T')[0];
            stats.todayCount = allLeads.filter(lead => 
                lead.created_at?.startsWith(today)
            ).length;
            
            stats.new = allLeads.filter(lead => lead.qualification_status === 'new').length;
            stats.qualified = allLeads.filter(lead => lead.qualification_status === 'qualified').length;
            stats.hot = allLeads.filter(lead => lead.qualification_status === 'hot').length;
            stats.converted = allLeads.filter(lead => lead.qualification_status === 'converted').length;
            
            const totalScore = allLeads.reduce((sum, lead) => sum + (lead.lead_score || 0), 0);
            stats.averageScore = stats.total > 0 ? Math.round(totalScore / stats.total) : 0;
        }

        return new Response(JSON.stringify({
            data: {
                leads,
                pagination: {
                    page,
                    limit,
                    total: parseInt(totalCount),
                    pages: Math.ceil(parseInt(totalCount) / limit)
                },
                stats
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Get leads error:', error);

        return new Response(JSON.stringify({
            error: {
                code: 'GET_LEADS_FAILED',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});