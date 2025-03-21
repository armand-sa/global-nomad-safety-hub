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
import { Loader2, AlertCircle, Wifi, WifiOff, CheckCircle2, Lock, Eye, EyeOff } from "lucide-react";

// Main login page component
export default function LoginPage() {
  // Get user info and login functions from our auth system
  const { user, signIn, signUp, error, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const redirectTo = searchParams.get("redirectTo") || "/";
  const isAuthFlow = searchParams.get("auth") === "true"; // Check if this is direct auth flow
  const logoutMessage = searchParams.get("message");
  const shouldReload = searchParams.get("reload") === "true"; // Check if we should handle page reload
  
  // Check if the redirect is to admin page
  const isAdminRedirect = redirectTo.includes("/admin");
  
  // State for site password verification
  const [isVerified, setIsVerified] = useState(isAuthFlow); // Skip password check if auth=true
  const [isCheckingVerification, setIsCheckingVerification] = useState(!isAuthFlow);
  
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
  
  // Password visibility toggles
  const [showSitePassword, setShowSitePassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Check if site password is already verified when page loads - only if not direct auth flow
  useEffect(() => {
    // Skip verification check if auth=true
    if (isAuthFlow) {
      setIsVerified(true);
      setIsCheckingVerification(false);
      return;
    }
    
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
  }, [isAuthFlow]);

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
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push("/admin");
      }
    }
  }, [user, router, redirectTo]);

  // Update the active tab when the tab URL parameter changes
  useEffect(() => {
    if (tabParam === "register" || tabParam === "login") {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

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

  // Handle reload parameter to prevent flashing site password form after logout
  useEffect(() => {
    if (shouldReload) {
      // Remove the reload parameter from URL to prevent infinite reloads
      const url = new URL(window.location.href);
      url.searchParams.delete('reload');
      window.history.replaceState({}, '', url.toString());
    }
  }, [shouldReload]);

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
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to Global Nomad Safety
            {isAdminRedirect && isVerified && (
              <span className="block text-xl text-primary mt-1">Admin Portal Access</span>
            )}
          </h1>
          <p className="text-sm text-muted-foreground">
            {!isVerified 
              ? "This site is password protected during development" 
              : activeTab === "login" 
                ? isAdminRedirect 
                  ? <strong>Sign in to access your admin account</strong>
                  : <strong>Sign in to access your account</strong>
                : <strong>Create an account to get started</strong>
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
                  <div className="relative">
                    <Input
                      id="site-password"
                      name="password"
                      type={showSitePassword ? "text" : "password"}
                      placeholder="Enter site password"
                      value={sitePassword}
                      onChange={(e) => setSitePassword(e.target.value)}
                      required
                      autoFocus
                      className="border-2 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSitePassword(!showSitePassword)}
                      className="absolute inset-y-0 right-0 flex items-center px-3"
                    >
                      {showSitePassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
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

            {logoutMessage && (
              <Alert>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-500">
                  {logoutMessage}
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
              <TabsList className="grid w-full grid-cols-2 mb-4 p-1">
                <TabsTrigger value="login" className="text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Login
                </TabsTrigger>
                <TabsTrigger value="register" className="text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Register
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Card className="border-2">
                  <form onSubmit={handleLogin}>
                    <CardHeader>
                      <CardTitle className="text-xl">Login to Your Account</CardTitle>
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
                        <div className="relative">
                          <Input 
                            id="password" 
                            type={showLoginPassword ? "text" : "password"} 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                            className="absolute inset-y-0 right-0 flex items-center px-3"
                          >
                            {showLoginPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                        </div>
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
                          className="flex items-center justify-center gap-2 border-2 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-slate-50 transition-colors px-0 h-10"
                        >
                          <div className="flex items-center justify-center w-full space-x-2">
                            <svg viewBox="0 0 24 24" width="18" height="18">
                              <g transform="matrix(1, 0, 0, 1, 0, 0)">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                              </g>
                            </svg>
                            <span className="font-medium">Google</span>
                          </div>
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => handleOAuthLogin('apple')}
                          disabled={isLoading || !networkStatus}
                          className="flex items-center justify-center gap-2 border-2 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors px-0 h-10"
                        >
                          <div className="flex items-center justify-center w-full space-x-2">
                            <svg viewBox="0 0 24 24" width="18" height="18" className="text-slate-900 dark:text-white">
                              <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.94-3.08.5-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.47C2.72 15.19 3.68 7.04 9.04 6.61c1.36.06 2.47.98 3.3 1 1.26-.12 2.3-.97 3.49-.83 1.48.17 2.6.88 3.27 2.17-3.13 1.92-2.52 6.75.55 8.02-.61 1.25-1.39 2.49-2.6 3.31z"/>
                              <path fill="currentColor" d="M12.03 6.3C11.64 4.3 12.89 2.65 14.56 2c.4 2.98-2.67 4.92-2.53 4.3z"/>
                            </svg>
                            <span className="font-medium">Apple</span>
                          </div>
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
                <Card className="border-2">
                  <form onSubmit={handleSignUp}>
                    <CardHeader>
                      <CardTitle className="text-xl">Create an Account</CardTitle>
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
                        <div className="relative">
                          <Input 
                            id="new-password" 
                            type={showSignupPassword ? "text" : "password"} 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowSignupPassword(!showSignupPassword)}
                            className="absolute inset-y-0 right-0 flex items-center px-3"
                          >
                            {showSignupPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                        </div>
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
                          className="flex items-center justify-center gap-2 border-2 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-slate-50 transition-colors px-0 h-10"
                        >
                          <div className="flex items-center justify-center w-full space-x-2">
                            <svg viewBox="0 0 24 24" width="18" height="18">
                              <g transform="matrix(1, 0, 0, 1, 0, 0)">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                              </g>
                            </svg>
                            <span className="font-medium">Google</span>
                          </div>
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => handleOAuthLogin('apple')}
                          disabled={isLoading || !networkStatus}
                          className="flex items-center justify-center gap-2 border-2 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors px-0 h-10"
                        >
                          <div className="flex items-center justify-center w-full space-x-2">
                            <svg viewBox="0 0 24 24" width="18" height="18" className="text-slate-900 dark:text-white">
                              <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.94-3.08.5-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.47C2.72 15.19 3.68 7.04 9.04 6.61c1.36.06 2.47.98 3.3 1 1.26-.12 2.3-.97 3.49-.83 1.48.17 2.6.88 3.27 2.17-3.13 1.92-2.52 6.75.55 8.02-.61 1.25-1.39 2.49-2.6 3.31z"/>
                              <path fill="currentColor" d="M12.03 6.3C11.64 4.3 12.89 2.65 14.56 2c.4 2.98-2.67 4.92-2.53 4.3z"/>
                            </svg>
                            <span className="font-medium">Apple</span>
                          </div>
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