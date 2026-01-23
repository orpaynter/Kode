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
        const { email, password } = await req.json();
        
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        // Check admin credentials
        const adminResponse = await fetch(`${supabaseUrl}/rest/v1/admin_users?email=eq.${email}&is_active=eq.true`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            }
        });

        if (!adminResponse.ok) {
            throw new Error('Failed to verify admin credentials');
        }

        const adminUsers = await adminResponse.json();
        
        if (adminUsers.length === 0) {
            throw new Error('Invalid admin credentials');
        }

        const adminUser = adminUsers[0];
        
        // Simple password check (in production, use proper password hashing)
        if (adminUser.password_hash !== password) {
            throw new Error('Invalid admin credentials');
        }

        // Update last login
        await fetch(`${supabaseUrl}/rest/v1/admin_users?id=eq.${adminUser.id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                last_login: new Date().toISOString()
            })
        });

        // Generate simple auth token (in production, use JWT)
        const authToken = `admin_${adminUser.id}_${Date.now()}`;

        return new Response(JSON.stringify({
            data: {
                success: true,
                token: authToken,
                user: {
                    id: adminUser.id,
                    email: adminUser.email,
                    full_name: adminUser.full_name,
                    role: adminUser.role
                }
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Admin login error:', error);

        return new Response(JSON.stringify({
            error: {
                code: 'ADMIN_LOGIN_FAILED',
                message: error.message
            }
        }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});