import { createClient } from '@supabase/supabase-js';

// Get credentials directly from environment variables - no imports
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a simple Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Export a simple helper function to check if Supabase is working
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    return { success: !error, data, error };
  } catch (err) {
    return { success: false, error: err };
  }
};