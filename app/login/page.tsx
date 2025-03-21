"use client";

// Import all the tools we need
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";
import { Loader2, AlertCircle, Wifi, WifiOff } from "lucide-react";

// Main page function
export default function LoginPage() {
  // Get user info and login functions from our auth system
  const { user, signIn, signUp, error, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  
  // NEW: Add state for site password verification
  const [isVerified, setIsVerified] = useState(false);
  
  // States for the login/register forms
  const [activeTab, setActiveTab] = useState<string>(tabParam === "register" ? "register" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [networkStatus, setNetworkStatus] = useState<boolean>(true);
  const [sitePassword, setSitePassword] = useState("");
  const [sitePasswordError, setSitePasswordError] = useState<string | null>(null);

  // NEW: Check if site password is already verified when page loads
  useEffect(() => {
    const checkVerification = async () => {
      try {
        const response = await fetch('/api/verify-password', {
          method: 'GET'
        });
        if (response.ok) {
          setIsVerified(true);
        }
      } catch (error) {
        console.error('Failed to check verification status');
      }
    };

    checkVerification();
  }, []);

  // Check if internet is working
  useEffect(() => {
    const checkNetwork = () => {
      setNetworkStatus(navigator.onLine);
    };
    
    // Check right away when page loads
    checkNetwork();
    
    // Keep checking if internet status changes
    window.addEventListener('online', checkNetwork);
    window.addEventListener('offline', checkNetwork);
    
    // Clean up when page closes
    return () => {
      window.removeEventListener('online', checkNetwork);
      window.removeEventListener('offline', checkNetwork);
    };
  }, []);

  // Send user to admin page if they're already logged in
  useEffect(() => {
    if (user) {
      router.push("/admin");
    }
  }, [user, router]);

  // Handle when someone tries to log in
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    
    // Make sure they filled out all fields
    if (!email || !password) {
      setLocalError("Please enter both email and password");
      return;
    }
    
    // Check internet connection
    if (!networkStatus) {
      setLocalError("You appear to be offline. Please check your internet connection.");
      return;
    }
    
    await signIn(email, password);
  };

  // Handle when someone tries to create an account
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    
    // Make sure they filled out all fields
    if (!email || !password) {
      setLocalError("Please enter both email and password");
      return;
    }
    
    if (!name) {
      setLocalError("Please enter your name");
      return;
    }
    
    // Check internet connection
    if (!networkStatus) {
      setLocalError("You appear to be offline. Please check your internet connection.");
      return;
    }
    
    await signUp(email, password);
  };

  // Handle social login (Google/Apple)
  const handleOAuthLogin = async (provider: 'google' | 'apple') => {
    try {
      if (!networkStatus) {
        setLocalError("You appear to be offline. Please check your internet connection.");
        return;
      }
      
      await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (error) {
      setLocalError("Failed to sign in with OAuth provider");
    }
  };

  // NEW: Updated site password handler
  const handleSitePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSitePasswordError(null);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const response = await fetch('/api/verify-password', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        setSitePasswordError("Invalid site password");
        return;
      }

      // Password is correct, refresh the page to apply cookie
      window.location.reload();
    } catch (error) {
      setSitePasswordError("Failed to verify password. Please try again.");
    }
  };

  return (
    <div className="container max-w-screen-xl mx-auto px-4 flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome to Global Nomad Safety</h1>
          <p className="text-sm text-muted-foreground">
            {!isVerified 
              ? "Please enter site password to continue" 
              : activeTab === "login" 
                ? "Sign in to access your account" 
                : "Create an account to get started"
            }
          </p>
        </div>

        {!isVerified ? (
          <Card className="mb-6">
            <form onSubmit={handleSitePassword}>
              <CardHeader>
                <CardTitle>Site Access Required</CardTitle>
                <CardDescription>
                  This site is currently in development. Please enter the site password to continue.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site-password">Site Password</Label>
                  <Input
                    id="site-password"
                    name="password"
                    type="password"
                    placeholder="Enter site password"
                    value={sitePassword}
                    onChange={(e) => setSitePassword(e.target.value)}
                    required
                  />
                  {sitePasswordError && (
                    <p className="text-sm text-destructive">{sitePasswordError}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit">
                  Access Site
                </Button>
              </CardFooter>
            </form>
          </Card>
        ) : (
          <>
            {!networkStatus && (
              <Alert variant="destructive">
                <WifiOff className="h-4 w-4" />
                <AlertDescription>
                  You are currently offline. Please check your internet connection.
                </AlertDescription>
              </Alert>
            )}

            {(error || localError) && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error || localError}
                </AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Card>
                  <form onSubmit={handleLogin}>
                    <CardHeader>
                      <CardTitle>Login</CardTitle>
                      <CardDescription>
                        Enter your email and password to log in to your account.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="name@example.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Password</Label>
                          <Link href="/forgot-password" className="text-xs text-primary underline-offset-4 hover:underline">
                            Forgot password?
                          </Link>
                        </div>
                        <Input 
                          id="password" 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required 
                        />
                      </div>
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => handleOAuthLogin('google')}
                          disabled={isLoading || !networkStatus}
                        >
                          Google
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => handleOAuthLogin('apple')}
                          disabled={isLoading || !networkStatus}
                        >
                          Apple
                        </Button>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" type="submit" disabled={isLoading || !networkStatus}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Log in
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
              
              <TabsContent value="register">
                <Card>
                  <form onSubmit={handleSignUp}>
                    <CardHeader>
                      <CardTitle>Create an account</CardTitle>
                      <CardDescription>
                        Enter your information to create a new account.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-name">Name</Label>
                        <Input 
                          id="new-name" 
                          placeholder="John Doe" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-email">Email</Label>
                        <Input 
                          id="new-email" 
                          type="email" 
                          placeholder="name@example.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Password</Label>
                        <Input 
                          id="new-password" 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required 
                        />
                      </div>
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => handleOAuthLogin('google')}
                          disabled={isLoading || !networkStatus}
                        >
                          Google
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => handleOAuthLogin('apple')}
                          disabled={isLoading || !networkStatus}
                        >
                          Apple
                        </Button>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" type="submit" disabled={isLoading || !networkStatus}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create account
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Having trouble signing in?</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Make sure you have a stable internet connection</li>
                <li>• Try disabling any VPN or proxy services</li>
                <li>• Clear your browser cache and cookies</li>
                <li>• If problems persist, try using a different browser</li>
              </ul>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </Link>
              .
            </p>
          </>
        )}
      </div>
    </div>
  );
}