import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { sendWelcomeEmail } from './_services/email';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://sebkzfhpsgjzztidlsnr.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, role, companyStage, tools, chaosPoint } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    // 1. Save to Supabase (using a table called 'early_access' or 'leads')
    const { data, error } = await supabase
      .from('early_access')
      .insert([
        { 
          full_name: name, 
          email: email, 
          role: role, 
          company_stage: companyStage, 
          current_tools: tools, 
          chaos_point: chaosPoint,
          status: 'pending'
        }
      ]);

    if (error) {
      console.error('Supabase error:', error);
      // If table doesn't exist, we might want to fallback or log it
      // For now, we'll continue to send the email anyway if the database part fails
    }

    // 2. Send welcome email
    const emailResult = await sendWelcomeEmail(email, name);

    if (!emailResult.success) {
      console.error('Email sending failed:', emailResult.error);
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Early access request submitted successfully' 
    });
  } catch (error) {
    console.error('Error in early-access handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
