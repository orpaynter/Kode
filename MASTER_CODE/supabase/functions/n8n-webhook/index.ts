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
        const webhookData = await req.json();
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        // Process different webhook types
        const { eventType, data } = webhookData;

        let response = {};

        switch (eventType) {
            case 'lead_qualified':
                // Send lead data to n8n workflow
                response = {
                    message: 'Lead qualification webhook processed',
                    leadId: data.leadId,
                    score: data.score,
                    timestamp: new Date().toISOString()
                };
                break;

            case 'emergency_callback':
                // Trigger immediate callback workflow
                response = {
                    message: 'Emergency callback webhook processed',
                    leadId: data.leadId,
                    urgencyLevel: data.urgencyLevel,
                    contactPhone: data.contactPhone,
                    timestamp: new Date().toISOString()
                };
                break;

            case 'assessment_completed':
                // AI assessment completion notification
                response = {
                    message: 'Assessment completion webhook processed',
                    leadId: data.leadId,
                    assessmentId: data.assessmentId,
                    severity: data.severity,
                    timestamp: new Date().toISOString()
                };
                break;

            case 'appointment_scheduled':
                // Appointment confirmation workflow
                response = {
                    message: 'Appointment scheduling webhook processed',
                    appointmentId: data.appointmentId,
                    leadId: data.leadId,
                    contractorId: data.contractorId,
                    appointmentDate: data.appointmentDate,
                    timestamp: new Date().toISOString()
                };
                break;

            default:
                throw new Error(`Unknown webhook event type: ${eventType}`);
        }

        // Log webhook activity
        const logData = {
            metric_name: 'webhook_processed',
            metric_value: 1,
            metric_type: 'count',
            period_start: new Date().toISOString(),
            period_end: new Date().toISOString(),
            metadata: {
                eventType,
                source: 'n8n_webhook',
                data: data
            }
        };

        await fetch(`${supabaseUrl}/rest/v1/analytics`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(logData)
        });

        return new Response(JSON.stringify({
            data: response
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('n8n webhook error:', error);

        const errorResponse = {
            error: {
                code: 'WEBHOOK_PROCESSING_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});