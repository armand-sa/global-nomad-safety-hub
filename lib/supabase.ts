import { createClient } from '@supabase/supabase-js';

// Set default values for credentials
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Try to load credentials from file in development
if (process.env.NODE_ENV !== 'production') {
  // Skip trying to load from local files in deployment
  console.log('Using environment variables for Supabase credentials');
}

// Function to create the Supabase client with the current credentials
const createSupabaseClient = () => {
  // Check if the credentials are properly defined
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase credentials. Please check your credentials file or environment variables.');
    return createFallbackClient();
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      detectSessionInUrl: true,
      autoRefreshToken: true,
    },
    global: {
      headers: {
        'X-Client-Info': 'nextjs',
      },
      fetch: (url, options = {}) => {
        const timeout = 30000; // 30 seconds timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        return fetch(url, {
          ...options,
          signal: controller.signal,
          credentials: 'same-origin',
          mode: 'cors',
        }).finally(() => clearTimeout(timeoutId));
      },
    }
  });
};

// Create a fallback client for when credentials are missing
const createFallbackClient = () => {
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ 
        data: { session: null, user: null }, 
        error: { message: "No Supabase credentials configured" } 
      }),
      signUp: () => Promise.resolve({ 
        data: { session: null, user: null }, 
        error: { message: "No Supabase credentials configured" } 
      }),
      signOut: () => Promise.resolve({ error: null }),
      admin: {
        getUserById: () => Promise.resolve({ data: { user: null }, error: null })
      }
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
          limit: () => Promise.resolve({ data: [], error: null })
        }),
        or: () => ({
          order: () => ({
            limit: () => Promise.resolve({ data: [], error: null })
          })
        }),
        order: () => ({
          limit: () => Promise.resolve({ data: [], error: null })
        })
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: null })
        })
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: null })
          })
        })
      }),
      delete: () => ({
        eq: () => Promise.resolve({ error: null })
      })
    })
  } as unknown as ReturnType<typeof createClient>;
};

// Export the Supabase client
export const supabase = createSupabaseClient();