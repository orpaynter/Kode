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
        const { imageData, fileName, projectId } = await req.json();

        if (!imageData || !fileName) {
            throw new Error('Image data and filename are required');
        }

        console.log('Photo upload request received:', { fileName, projectId });

        // Validate file size (10MB limit)
        const base64Data = imageData.split(',')[1];
        if (!base64Data) {
            throw new Error('Invalid image data format');
        }
        
        const fileSize = (base64Data.length * 3) / 4; // Approximate file size
        console.log('File size:', fileSize, 'bytes');
        
        if (fileSize > 10 * 1024 * 1024) {
            throw new Error('File size exceeds 10MB limit');
        }

        // Get environment variables
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            console.error('Missing environment variables:', { serviceRoleKey: !!serviceRoleKey, supabaseUrl: !!supabaseUrl });
            throw new Error('Supabase configuration missing');
        }

        // Get user from auth header (optional for testing)
        let userId = 'anonymous';
        const authHeader = req.headers.get('authorization');
        if (authHeader) {
            try {
                const token = authHeader.replace('Bearer ', '');
                console.log('Attempting to verify token...');
                
                const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'apikey': serviceRoleKey
                    }
                });

                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    userId = userData.id;
                    console.log('User verified:', userId);
                } else {
                    console.log('Token verification failed, using anonymous upload');
                }
            } catch (error) {
                console.log('Auth error, proceeding as anonymous:', error.message);
            }
        }

        // Extract base64 data and mime type
        const mimeType = imageData.split(';')[0].split(':')[1];
        console.log('Mime type:', mimeType);
        
        // Validate image type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic'];
        if (!allowedTypes.includes(mimeType)) {
            throw new Error(`Invalid image type: ${mimeType}. Only JPEG, PNG, WebP, and HEIC are allowed.`);
        }

        // Convert base64 to binary
        const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        console.log('Binary data size:', binaryData.length);

        // Generate unique filename with timestamp
        const timestamp = Date.now();
        const extension = fileName.split('.').pop() || 'jpg';
        const uniqueFileName = `${userId}/${timestamp}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

        console.log('Uploading file:', uniqueFileName);

        // Upload to Supabase Storage
        const uploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/roof-photos/${uniqueFileName}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'Content-Type': mimeType,
                'x-upsert': 'true'
            },
            body: binaryData
        });

        console.log('Upload response status:', uploadResponse.status);

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            console.error('Upload failed:', errorText);
            throw new Error(`Upload failed: ${errorText}`);
        }

        // Get public URL
        const publicUrl = `${supabaseUrl}/storage/v1/object/public/roof-photos/${uniqueFileName}`;
        console.log('Upload successful, public URL:', publicUrl);

        const result = {
            data: {
                publicUrl,
                fileName: uniqueFileName,
                fileSize: binaryData.length,
                mimeType,
                userId,
                projectId
            }
        };

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Photo upload error:', error);

        const errorResponse = {
            error: {
                code: 'PHOTO_UPLOAD_FAILED',
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