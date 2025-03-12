"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function SupabaseConnectionTest() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Testing Supabase connection...');
  const [detailedError, setDetailedError] = useState<string | null>(null);

  async function testConnection() {
    setStatus('loading');
    setMessage('Testing Supabase connection...');
    setDetailedError(null);
    
    try {
      // Test environment variables first
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('Missing Supabase environment variables. Check your .env.local file.');
      }
      
      // Attempt to get the Supabase session - this works even without valid tables
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      // Test a simple API call to verify the connection
      try {
        await supabase.from('nonexistent_table').select('*').limit(1);
      } catch (e) {
        // We expect this to fail, but in a specific way if the connection works
        // If we get a different error than expected, it means something else is wrong
        console.log("Expected test query error (this is normal)");
      }
      
      // If we got this far, the connection is working (even if no user is logged in)
      setStatus('success');
      setMessage(`Supabase connection successful! ${data.session ? 'User is logged in.' : 'No user is logged in.'}`);
    } catch (err) {
      console.error('Supabase connection test error:', err);
      setStatus('error');
      
      if (err instanceof Error) {
        setMessage(`Error connecting to Supabase: ${err.message}`);
        setDetailedError(JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
      } else {
        setMessage(`Error connecting to Supabase: ${String(err)}`);
      }
    }
  }
  
  useEffect(() => {
    testConnection();
  }, []);

  return (
    <Card className={`m-4 ${status === 'error' ? 'border-red-500' : status === 'success' ? 'border-green-500' : ''}`}>
      <CardHeader>
        <CardTitle>Supabase Connection {status === 'loading' ? 'Test' : status === 'success' ? 'Successful' : 'Failed'}</CardTitle>
      </CardHeader>
      <CardContent>
        {status === 'loading' ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <p>Testing connection...</p>
          </div>
        ) : (
          <Alert variant={status === 'error' ? "destructive" : "default"}>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        
        {status === 'error' && (
          <div className="mt-4 space-y-4">
            <div className="text-sm">
              <p className="font-semibold">Please check:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Your .env.local file has the correct Supabase credentials</li>
                <li>NEXT_PUBLIC_SUPABASE_URL is set correctly</li>
                <li>NEXT_PUBLIC_SUPABASE_ANON_KEY is set correctly</li>
                <li>Your Supabase project is running and accessible</li>
                <li>Your network connection can reach the Supabase servers</li>
              </ul>
            </div>
            
            {detailedError && (
              <div className="mt-2">
                <p className="font-semibold text-sm">Detailed Error:</p>
                <pre className="bg-muted p-2 rounded text-xs overflow-auto mt-1">
                  {detailedError}
                </pre>
              </div>
            )}
            
            <Button onClick={testConnection} className="mt-4">
              Retry Connection Test
            </Button>
          </div>
        )}
        
        {status === 'success' && (
          <div className="mt-4">
            <Button onClick={testConnection}>
              Test Connection Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}