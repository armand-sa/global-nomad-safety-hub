import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Function to create the Supabase client
const createSupabaseClient = () => {
  // Check if credentials are available
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase credentials. Please check environment variables.');
    return createFallbackClient();
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  });
};

// Fallback client for when credentials are missing
const createFallbackClient = () => {
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ 
        data: { session: null, user: null }, 
        error: { message: "No Supabase credentials configured" } 
      }),
      signOut: () => Promise.resolve({ error: null })
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
          limit: () => Promise.resolve({ data: [], error: null })
        })
      })
    })
  } as unknown as ReturnType<typeof createClient>;
};

// Export the Supabase client
export const supabase = createSupabaseClient();