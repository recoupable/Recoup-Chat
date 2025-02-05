import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
