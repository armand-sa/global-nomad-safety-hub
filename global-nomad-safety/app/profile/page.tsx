"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Shield, CreditCard, Key, User } from "lucide-react";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Protect the profile route
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    } else if (user) {
      setName(user.user_metadata?.name || user.email?.split('@')[0] || "");
      setEmail(user.email || "");
    }
  }, [user, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col space-y-8 max-w-3xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground">Manage your profile and preferences</p>
        </div>

        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="text-xl">
              {user.email ? user.email.substring(0, 2).toUpperCase() : "UN"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">{user.user_metadata?.name || user.email?.split('@')[0]}</h2>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge variant="outline">Free Plan</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Member since {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full max-w-[600px] grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and how we can reach you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input id="phone" placeholder="+1 (555) 123-4567" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Reset</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Location Preferences</CardTitle>
                <CardDescription>
                  Manage your preferred locations for safety alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="mb-2 block">Saved Locations</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Barcelona, Spain", "Lisbon, Portugal", "Bali, Indonesia"].map((location) => (
                      <Badge key={location} className="flex items-center gap-1">
                        {location}
                        <button className="ml-1 rounded-full hover:bg-accent h-4 w-4 inline-flex items-center justify-center">×</button>
                      </Badge>
                    ))}
                    <Button variant="outline" size="sm" className="h-7">Add Location</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password or enable additional security options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Update Password</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">SMS Authentication</Label>
                    <p className="text-sm text-muted-foreground">Receive verification codes via text message</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Authenticator App</Label>
                    <p className="text-sm text-muted-foreground">Use an authentication app like Google Authenticator</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>
                  Manage devices where you're currently logged in
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Shield className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">This Device</p>
                        <p className="text-sm text-muted-foreground">Last active just now</p>
                      </div>
                    </div>
                    <Badge>Current</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Shield className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">iPhone 14 Pro</p>
                        <p className="text-sm text-muted-foreground">Last active 2 days ago</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Revoke</Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Sign Out From All Devices</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Control how and when you receive safety alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Label className="text-base">Email Notifications</Label>
                        <Badge>Free</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Receive safety alerts via email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Label className="text-base">Push Notifications</Label>
                        <Badge variant="outline">Premium</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Instant alerts on your device</p>
                    </div>
                    <Switch disabled />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Label className="text-base">SMS Notifications</Label>
                        <Badge variant="outline">Premium</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Urgent alerts delivered by text message</p>
                    </div>
                    <Switch disabled />
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">Alert Types</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="high-priority" className="flex items-center gap-2">
                        <Badge variant="destructive">High</Badge>
                        <span>High priority safety threats</span>
                      </Label>
                      <Switch id="high-priority" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="medium-priority" className="flex items-center gap-2">
                        <Badge variant="outline">Medium</Badge>
                        <span>Medium priority safety concerns</span>
                      </Label>
                      <Switch id="medium-priority" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="low-priority" className="flex items-center gap-2">
                        <Badge variant="secondary">Low</Badge>
                        <span>Low priority notices</span>
                      </Label>
                      <Switch id="low-priority" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="billing" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>
                  Manage your subscription and billing details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Free Plan</h3>
                    <p className="text-sm text-muted-foreground">Basic safety features</p>
                  </div>
                  <Button>Upgrade to Premium</Button>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">Premium Benefits</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <Bell className="h-4 w-4 mr-2 mt-0.5" />
                      <span>Real-time safety alerts for up to 20 locations</span>
                    </li>
                    <li className="flex items-start">
                      <Shield className="h-4 w-4 mr-2 mt-0.5" />
                      <span>24/7 emergency assistance hotline</span>
                    </li>
                    <li className="flex items-start">
                      <User className="h-4 w-4 mr-2 mt-0.5" />
                      <span>Priority support via email and chat</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Add or update your payment information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">No payment methods added</p>
                      <p className="text-sm text-muted-foreground">Add a card to upgrade to Premium</p>
                    </div>
                  </div>
                  <Button variant="outline">Add Payment Method</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}