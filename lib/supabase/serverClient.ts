import { createClient } from "@supabase/supabase-js";

// Get environment variables with fallbacks to prevent undefined errors
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://godremdqwajrwazhbrue.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Log for debugging (will only show in server logs)
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('Supabase environment variables are missing. Check your .env file.');
  console.warn('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'defined' : 'undefined');
  console.warn('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'defined' : 'undefined');
}

// Create the Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
