import { createClient } from '@supabase/supabase-js';

// These environment variables are publicly accessible in the browser
// They should be the public anon key, not the service_role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://godremdqwajrwazhbrue.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Log the configuration to help diagnose issues
console.log("Supabase Client Config:", { 
  supabaseUrl: supabaseUrl || 'NOT DEFINED',
  hasAnonKey: !!supabaseAnonKey
});

// Log warnings if environment variables are missing
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn("Supabase environment variables are missing. Check your .env file.");
  console.warn('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'defined' : 'undefined');
  console.warn('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'defined' : 'undefined');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase; 