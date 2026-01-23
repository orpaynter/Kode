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
        const { leadId, contractorId, appointmentDate, appointmentType, notes } = await req.json();
        
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        // Validate required fields
        if (!leadId || !contractorId || !appointmentDate || !appointmentType) {
            throw new Error('Missing required fields: leadId, contractorId, appointmentDate, appointmentType');
        }

        // Create appointment
        const appointmentData = {
            lead_id: leadId,
            contractor_id: contractorId,
            appointment_date: appointmentDate,
            appointment_type: appointmentType,
            notes: notes || null,
            status: 'scheduled'
        };

        const appointmentResponse = await fetch(`${supabaseUrl}/rest/v1/appointments`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(appointmentData)
        });

        if (!appointmentResponse.ok) {
            const errorText = await appointmentResponse.text();
            throw new Error(`Failed to create appointment: ${errorText}`);
        }

        const appointment = await appointmentResponse.json();

        // Get lead and contractor details for notifications
        const [leadResponse, contractorResponse] = await Promise.all([
            fetch(`${supabaseUrl}/rest/v1/leads?id=eq.${leadId}`, {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            }),
            fetch(`${supabaseUrl}/rest/v1/contractors?id=eq.${contractorId}`, {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            })
        ]);

        const [leadData, contractorData] = await Promise.all([
            leadResponse.json(),
            contractorResponse.json()
        ]);

        const lead = leadData[0];
        const contractor = contractorData[0];

        return new Response(JSON.stringify({
            data: {
                appointment: appointment[0],
                lead: {
                    name: lead.contact_name,
                    email: lead.contact_email,
                    phone: lead.contact_phone,
                    address: lead.property_address
                },
                contractor: {
                    name: contractor.contact_name,
                    business: contractor.business_name,
                    email: contractor.contact_email,
                    phone: contractor.contact_phone
                },
                appointmentDetails: {
                    date: appointmentDate,
                    type: appointmentType,
                    status: 'scheduled'
                }
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Appointment scheduling error:', error);

        const errorResponse = {
            error: {
                code: 'APPOINTMENT_SCHEDULING_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});