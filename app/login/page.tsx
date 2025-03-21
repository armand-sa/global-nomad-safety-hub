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
import { Loader2, AlertCircle, Wifi, WifiOff, CheckCircle2, Lock } from "lucide-react";

// Main login page component
export default function LoginPage() {
  // Get user info and login functions from our auth system
  const { user, signIn, signUp, error, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const redirectTo = searchParams.get("redirectTo") || "/";
  
  // State for site password verification
  const [isVerified, setIsVerified] = useState(false);
  const [isCheckingVerification, setIsCheckingVerification] = useState(true);
  
  // States for the login/register forms
  const [activeTab, setActiveTab] = useState<string>(tabParam === "register" ? "register" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [networkStatus, setNetworkStatus] = useState<boolean>(true);
  const [sitePassword, setSitePassword] = useState("");
  const [sitePasswordError, setSitePasswordError] = useState<string | null>(null);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  // Check if site password is already verified when page loads
  useEffect(() => {
    const checkVerification = async () => {
      try {
        setIsCheckingVerification(true);
        console.log("Checking if site password is verified...");
        
        // Make a fetch call to verify password
        const response = await fetch('/api/verify-password', {
          method: 'GET',
          cache: 'no-store', // Prevent caching
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (!response.ok) {
          console.log("API response not ok:", response.status);
          setIsVerified(false);
          return;
        }
        
        const data = await response.json();
        console.log("Verification check response:", {
          status: response.status,
          verified: data.verified
        });
        
        if (data.verified === true) {
          console.log("Site password is verified");
          setIsVerified(true);
        } else {
          console.log("Site password is not verified");
          setIsVerified(false);
        }
      } catch (error) {
        console.error("Error checking verification:", error);
        setIsVerified(false);
      } finally {
        setIsCheckingVerification(false);
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

  // Site password handler
  const handleSitePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPassword(true);
    setSitePasswordError(null);

    try {
      console.log("Submitting site password form");
      
      // Create form data from the form submission
      const formData = new FormData(e.target as HTMLFormElement);
      
      // For testing - log what we're sending (but not the actual password!)
      console.log("Password form submitted:", {
        hasPassword: !!formData.get('password'),
        inputLength: formData.get('password') ? String(formData.get('password')).length : 0
      });
      
      // Send the password to our verification API
      const response = await fetch('/api/verify-password', {
        method: 'POST',
        body: formData,
        cache: 'no-store'
      });

      // Get the response data
      const data = await response.json();
      console.log("Password submission response:", {
        status: response.status,
        success: data.success
      });

      // Check if the request was successful
      if (response.ok && data.success) {
        console.log("Password verification successful!");
        // Password verified, refresh the page to apply cookie
        window.location.href = redirectTo || '/'; // Redirect to intended page or home
      } else {
        console.error("Password verification failed:", data.error);
        setSitePasswordError("The password you entered is incorrect. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting password:", error);
      setSitePasswordError("There was a problem verifying the password. Please try again.");
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  // Show loading spinner while checking verification
  if (isCheckingVerification) {
    return (
      <div className="container max-w-screen-xl mx-auto px-4 flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col items-center justify-center space-y-6 sm:w-[350px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-center text-muted-foreground">Checking site access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-screen-xl mx-auto px-4 flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome to Global Nomad Safety</h1>
          <p className="text-sm text-muted-foreground">
            {!isVerified 
              ? "This site is password protected during development" 
              : activeTab === "login" 
                ? "Sign in to access your account" 
                : "Create an account to get started"
            }
          </p>
        </div>

        {!isVerified ? (
          <Card className="mb-6 border-2 border-primary border-opacity-50 shadow-lg">
            <form onSubmit={handleSitePassword}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="mr-2 h-5 w-5 text-primary" />
                  Development Site Access
                </CardTitle>
                <CardDescription>
                  This site is currently in development and requires a password to access. Please enter the password provided to you.
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
                    autoFocus
                    className="border-2"
                  />
                  {sitePasswordError && (
                    <p className="text-sm font-medium text-destructive">{sitePasswordError}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  type="submit" 
                  disabled={isSubmittingPassword}
                >
                  {isSubmittingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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