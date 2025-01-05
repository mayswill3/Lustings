// File: supabase/functions/delete-user-profile/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json'
  }

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify method
    if (req.method !== 'POST') {
      throw new Error(`Method ${req.method} not allowed`)
    }

    // Safely parse the request body
    let body;
    try {
      const text = await req.text(); // Get raw body text
      console.log('Raw request body:', text); // Log the raw body
      
      if (!text) {
        throw new Error('Request body is empty');
      }
      
      body = JSON.parse(text);
    } catch (e) {
      throw new Error(`Invalid JSON body: ${e.message}`);
    }

    // Validate userId
    const { userId } = body;
    if (!userId) {
      throw new Error('userId is required in request body');
    }

    console.log('Processing delete request for user:', userId);

    // Initialize Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Call the database function
    const { error: dbError } = await supabaseAdmin.rpc('delete_user_profile', {
      user_id: userId
    })

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    // Delete auth user
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)
    if (authError) {
      throw new Error(`Auth deletion error: ${authError.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Profile deleted successfully'
      }),
      { 
        status: 200,
        headers: corsHeaders
      }
    )

  } catch (error) {
    console.error('Function failed:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        errorDetails: error instanceof Error ? error.stack : undefined
      }),
      { 
        status: 400,
        headers: corsHeaders
      }
    )
  }
})