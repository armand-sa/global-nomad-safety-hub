"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          throw error;
        }
        
        if (data?.session) {
          setSession(data.session);
          setUser(data.session.user);
          
          // Check if user is an admin
          setIsAdmin(data.session.user.app_metadata?.role === 'admin');
        }
      } catch (error: any) {
        console.error("Auth session error:", error);
        setError("An error occurred while fetching session");
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    try {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user || null);
        setIsAdmin(session?.user?.app_metadata?.role === 'admin' || false);
        setIsLoading(false);
      });

      return () => {
        if (data?.subscription) {
          data.subscription.unsubscribe();
        }
      };
    } catch (err) {
      console.error("Auth state change error:", err);
      setIsLoading(false);
      return () => {};
    }
  }, []);

  // Check if the network connection is available
  const checkNetworkConnection = async (): Promise<boolean> => {
    if (!navigator.onLine) {
      return false;
    }

    try {
      // Try to fetch a small resource to verify actual connectivity
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      // Try to connect to Supabase hostname only, not the full API
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
        const response = await fetch(`https://${url.hostname}/ping`, {
          method: 'HEAD',
          mode: 'no-cors', // This will allow us to at least try to connect
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return true; // If we got any response, assume connectivity
      }
      
      // If no Supabase URL is set, just check general connectivity
      const response = await fetch('https://www.google.com/generate_204', {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return true;
    } catch (error) {
      console.error("Network connectivity check failed:", error);
      return false;
    }
  };

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    setError(null);
    setIsLoading(true);
    try {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      // Check network connectivity first
      const isConnected = await checkNetworkConnection();
      if (!isConnected) {
        throw new Error("Network connectivity issue. Please check your internet connection and try again.");
      }

      // Check Supabase credentials
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error("Supabase configuration is missing. Please contact the administrator.");
      }

      // First, sign in with just email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      // If remember me is selected and signin was successful, update the session
      if (rememberMe && data?.session && !error) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token
        });
      }

      if (error) {
        console.error("Sign in error:", error);
        throw error;
      }

      if (data?.session) {
        setSession(data.session);
        setUser(data.user);
        setIsAdmin(data.user?.app_metadata?.role === 'admin' || false);
        
        if (data.user?.app_metadata?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      } else {
        throw new Error("No session returned from sign in");
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      
      // Handle specific error cases with user-friendly messages
      if (!navigator.onLine || error.message.includes("NetworkError") || error.message.includes("network")) {
        setError("Cannot connect to the internet. Please check your connection and try again.");
      } else if (error.message && error.message.includes("Failed to fetch")) {
        setError("Cannot connect to authentication service. Please try again later.");
      } else if (error.message && error.message.includes("Invalid login credentials")) {
        setError("Invalid email or password");
      } else if (error.name === "AuthRetryableFetchError") {
        setError("Authentication service temporarily unavailable. Please try again in a few moments.");
      } else if (error.message && error.message.includes("timed out")) {
        setError("Connection timed out. Please check your internet connection and try again.");
      } else {
        setError(error.message || "An error occurred during sign in");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      
      // Check network connectivity first
      const isConnected = await checkNetworkConnection();
      if (!isConnected) {
        throw new Error("Network connectivity issue. Please check your internet connection and try again.");
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error("Sign up error:", error);
        throw error;
      }

      if (data?.session) {
        setSession(data.session);
        setUser(data.user);
        setIsAdmin(false); // New users are never admins by default
      } else {
        // Supabase might not return a session immediately if email confirmation is enabled
        setError(null);
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      if (!navigator.onLine || error.message.includes("NetworkError") || error.message.includes("network")) {
        setError("Cannot connect to the internet. Please check your connection and try again.");
      } else if (error.message && error.message.includes("Failed to fetch")) {
        setError("Cannot connect to authentication service. Please try again later.");
      } else if (error.name === "AuthRetryableFetchError") {
        setError("Authentication service temporarily unavailable. Please try again in a few moments.");
      } else {
        setError(error.message || "An error occurred during sign up");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      // Get the current URL path to determine if we're coming from admin
      const isFromAdmin = window.location.pathname.includes("/admin");
      
      // Construct the redirect URL with all necessary parameters
      const loginUrl = isFromAdmin 
        ? '/login?message=Successfully+logged+out&redirectTo=/admin' 
        : '/login?message=Successfully+logged+out';
      
      // Clear auth state
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      
      // Clear state
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      
      // Force a hard page reload with our URL parameters
      window.location.href = loginUrl;
    } catch (error: any) {
      console.error("Sign out error:", error);
      setError(error.message || "An error occurred during sign out");
      
      // Even if there's an error, try to redirect to login
      const isFromAdmin = window.location.pathname.includes("/admin");
      const errorUrl = isFromAdmin
        ? '/login?error=logout&redirectTo=/admin'
        : '/login?error=logout';
      
      window.location.href = errorUrl;
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    error,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};