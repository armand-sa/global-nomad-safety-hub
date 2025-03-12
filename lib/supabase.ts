import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if the environment variables are properly defined
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env.local file.');
}

// Create a Supabase client with proper error handling
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        detectSessionInUrl: true,
        autoRefreshToken: true,
        // Remove storage key which might be causing issues
        // storageKey: 'supabase.auth.token',
      },
      global: {
        // Add proper headers and fetch options
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
    })
  : {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: () => Promise.resolve({ data: { session: null, user: null }, error: { message: "No Supabase credentials configured" } }),
        signUp: () => Promise.resolve({ data: { session: null, user: null }, error: { message: "No Supabase credentials configured" } }),
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