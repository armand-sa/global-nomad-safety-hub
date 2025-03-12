"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export default function SupabaseTest() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Testing Supabase connection...');
  const [networkStatus, setNetworkStatus] = useState<boolean>(true);
  const [hasCorsIssue, setHasCorsIssue] = useState<boolean>(false);
  const [detailedError, setDetailedError] = useState<string | null>(null);

  // Check network status
  useEffect(() => {
    const checkNetwork = () => {
      setNetworkStatus(navigator.onLine);
    };
    
    // Check immediately
    checkNetwork();
    
    // Add event listeners for network status changes
    window.addEventListener('online', checkNetwork);
    window.addEventListener('offline', checkNetwork);
    
    return () => {
      window.removeEventListener('online', checkNetwork);
      window.removeEventListener('offline', checkNetwork);
    };
  }, []);

  // Test Supabase connection
  const testConnection = async () => {
    setStatus('loading');
    setMessage('Testing Supabase connection...');
    setDetailedError(null);
    setHasCorsIssue(false);
    
    if (!networkStatus) {
      setStatus('error');
      setMessage('You are offline. Please check your internet connection.');
      return;
    }
    
    try {
      // Check environment variables
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('Missing Supabase environment variables. Check your .env.local file.');
      }
      
      // Test CORS with a simple fetch to Supabase
      try {
        const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
        await fetch(`${url.origin}/auth/v1/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          },
        });
      } catch (corsError) {
        console.warn("CORS pre-check failed:", corsError);
        setHasCorsIssue(true);
      }
      
      // Now try the actual Supabase Auth call
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      // If we got this far, the connection is working
      setStatus('success');
      setMessage(`Supabase connection successful! ${data.session ? 'User is logged in.' : 'No user is logged in.'}`);
    } catch (err) {
      console.error('Supabase connection test error:', err);
      setStatus('error');
      
      if (err instanceof Error) {
        setMessage(`Error connecting to Supabase: ${err.message}`);
        // Extract additional error information for debugging
        try {
          const errorObj = {
            name: err.name,
            message: err.message,
            stack: err.stack,
            ...(err as any)
          };
          setDetailedError(JSON.stringify(errorObj, null, 2));
        } catch (jsonError) {
          setDetailedError(err.toString());
        }
        
        // Check for common Supabase errors
        if (err.message.includes('Failed to fetch') || err.name === 'AuthRetryableFetchError') {
          setHasCorsIssue(true);
        }
      } else {
        setMessage(`Error connecting to Supabase: ${String(err)}`);
      }
    }
  };
  
  useEffect(() => {
    testConnection();
  }, [networkStatus]);

  return (
    <Card className={`m-4 ${status === 'error' ? 'border-red-500' : status === 'success' ? 'border-green-500' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Supabase Connection {status === 'loading' ? 'Test' : status === 'success' ? 'Successful' : 'Failed'}</CardTitle>
          <Badge variant={networkStatus ? "outline" : "destructive"} className="flex items-center gap-1">
            {networkStatus ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            <span>{networkStatus ? 'Online' : 'Offline'}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === 'loading' ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <p>Testing connection...</p>
          </div>
        ) : (
          <Alert variant={status === 'error' ? "destructive" : "default"}>
            <AlertDescription className="flex items-center gap-2">
              {status === 'success' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              {message}
            </AlertDescription>
          </Alert>
        )}
        
        {hasCorsIssue && (
          <Alert variant="warning" className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-700" />
            <AlertDescription className="text-amber-700">
              Possible CORS issue detected. Your browser may be blocking requests to Supabase.
            </AlertDescription>
          </Alert>
        )}
        
        {status === 'error' && (
          <div className="mt-4 space-y-4">
            <div className="text-sm">
              <p className="font-semibold">Troubleshooting suggestions:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Check if your .env.local file has correct Supabase credentials:
                  <pre className="bg-muted p-2 rounded text-xs mt-1 overflow-auto">
                    NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co{"\n"}
                    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
                  </pre>
                </li>
                <li>Verify network connectivity to Supabase servers</li>
                <li>Check if your browser is blocking third-party cookies</li>
                <li>Try disabling any extensions that block scripts or requests</li>
                <li>Make sure your Supabase project is active</li>
              </ul>
            </div>
            
            {detailedError && (
              <div className="mt-2">
                <p className="font-semibold text-sm">Detailed Error:</p>
                <pre className="bg-muted p-2 rounded text-xs overflow-auto mt-1 max-h-40">
                  {detailedError}
                </pre>
              </div>
            )}
            
            <Button onClick={testConnection} className="mt-4 w-full">
              Retry Connection Test
            </Button>
          </div>
        )}
        
        {status === 'success' && (
          <div className="mt-4">
            <Button variant="outline" onClick={testConnection} className="w-full">
              Test Connection Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}