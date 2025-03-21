"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Search, 
  BarChart, 
  Users, 
  FileText, 
  Bell, 
  Settings, 
  PlusCircle, 
  Edit, 
  Trash, 
  CheckCircle, 
  XCircle,
  LogOut,
  User
} from "lucide-react";

export default function AdminDashboard() {
  const [alertTab, setAlertTab] = useState("manage");
  const { user, signOut, isLoading } = useAuth();
  const router = useRouter();
  
  // Protect the admin route - redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Show loading state or no access message while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden lg:flex w-64 flex-col fixed inset-y-0 border-r bg-background z-50 pt-16">
        <div className="px-4 py-6">
          <h2 className="text-lg font-semibold">Admin Dashboard</h2>
          <p className="text-sm text-muted-foreground">Manage your safety platform</p>
        </div>
        <div className="px-4 py-4">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback>
                {user.email ? user.email.substring(0, 2).toUpperCase() : "UN"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user.user_metadata?.name || user.email?.split('@')[0]}</p>
              <p className="text-xs text-muted-foreground truncate max-w-[140px]">{user.email}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-2 space-y-1">
          {[
            { name: "Dashboard", icon: <BarChart className="h-5 w-5" /> },
            { name: "Users", icon: <Users className="h-5 w-5" /> },
            { name: "Content", icon: <FileText className="h-5 w-5" /> },
            { name: "Alerts", icon: <Bell className="h-5 w-5" /> },
            { name: "Settings", icon: <Settings className="h-5 w-5" /> },
          ].map((item, index) => (
            <Button
              key={item.name}
              variant={index === 3 ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </Button>
          ))}
        </nav>
        <div className="px-2 py-4 mt-auto border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
            onClick={() => signOut()}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col flex-1 pt-16">
        <div className="container max-w-screen-xl mx-auto px-4 py-8">
          <div className="flex flex-col space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Welcome to Global Nomad Safety</h1>
                <p className="text-xl text-primary font-semibold mb-2">Admin Access</p>
                <p className="text-muted-foreground">Create and manage safety alerts for your users</p>
              </div>
              
              {/* Mobile user menu */}
              <div className="flex items-center gap-4 lg:hidden">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarFallback>
                      {user.email ? user.email.substring(0, 2).toUpperCase() : "UN"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium">{user.user_metadata?.name || user.email?.split('@')[0]}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => signOut()}
                  className="text-red-500"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <Tabs 
                defaultValue="manage" 
                className="w-full"
                onValueChange={(value) => setAlertTab(value)}
              >
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="manage">Manage Alerts</TabsTrigger>
                  <TabsTrigger value="create">Create Alert</TabsTrigger>
                </TabsList>
                
                {/* Manage Alerts Tab */}
                <TabsContent value="manage" className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative max-w-sm w-full">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search alerts..." className="pl-9" />
                    </div>
                    <div className="flex gap-2">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Alerts</SelectItem>
                          <SelectItem value="high">High Priority</SelectItem>
                          <SelectItem value="medium">Medium Priority</SelectItem>
                          <SelectItem value="low">Low Priority</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Alert
                      </Button>
                    </div>
                  </div>

                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-xl">Current Alerts</CardTitle>
                      <CardDescription>
                        Showing 8 of 43 alerts
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[
                            { 
                              title: "Increased Pickpocketing Reports", 
                              location: "Barcelona, Spain", 
                              priority: "high", 
                              status: "active",
                              date: "Jun 15, 2025"
                            },
                            { 
                              title: "Minor Earthquake Reported", 
                              location: "Bali, Indonesia", 
                              priority: "medium", 
                              status: "active",
                              date: "Jun 14, 2025"
                            },
                            { 
                              title: "Public Transportation Strike", 
                              location: "Lisbon, Portugal", 
                              priority: "low", 
                              status: "active",
                              date: "Jun 12, 2025"
                            },
                            { 
                              title: "Protests Scheduled Downtown", 
                              location: "Medellin, Colombia", 
                              priority: "medium", 
                              status: "active",
                              date: "Jun 10, 2025"
                            },
                            { 
                              title: "Taxi Driver Strike", 
                              location: "Bangkok, Thailand", 
                              priority: "low", 
                              status: "inactive",
                              date: "Jun 08, 2025"
                            },
                            { 
                              title: "Flash Flooding in Northern Areas", 
                              location: "Chiang Mai, Thailand", 
                              priority: "high", 
                              status: "inactive",
                              date: "Jun 05, 2025"
                            },
                            { 
                              title: "Heatwave Warning", 
                              location: "Seville, Spain", 
                              priority: "medium", 
                              status: "scheduled",
                              date: "Jun 20, 2025"
                            },
                            { 
                              title: "Political Demonstration", 
                              location: "Berlin, Germany", 
                              priority: "low", 
                              status: "scheduled",
                              date: "Jun 22, 2025"
                            }
                          ].map((alert, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{alert.title}</TableCell>
                              <TableCell>{alert.location}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant={
                                    alert.priority === "high" ? "destructive" : 
                                    alert.priority === "medium" ? "outline" : 
                                    "secondary"
                                  }
                                >
                                  {alert.priority === "high" ? "High" : 
                                   alert.priority === "medium" ? "Medium" : 
                                   "Low"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {alert.status === "active" ? (
                                  <div className="flex items-center">
                                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                                    Active
                                  </div>
                                ) : alert.status === "inactive" ? (
                                  <div className="flex items-center">
                                    <span className="h-2 w-2 rounded-full bg-gray-400 mr-2"></span>
                                    Inactive
                                  </div>
                                ) : (
                                  <div className="flex items-center">
                                    <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                                    Scheduled
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>{alert.date}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Trash className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  <div className="flex items-center justify-end space-x-2 py-4">
                    <Button variant="outline" size="sm">
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </TabsContent>

                {/* Create Alert Tab */}
                <TabsContent value="create" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Create New Safety Alert</CardTitle>
                      <CardDescription>
                        This alert will be sent to all users subscribed to the selected location.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Alert Title</Label>
                        <Input id="title" placeholder="Enter a clear, concise title" />
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Select>
                            <SelectTrigger id="location">
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="barcelona">Barcelona, Spain</SelectItem>
                              <SelectItem value="bali">Bali, Indonesia</SelectItem>
                              <SelectItem value="lisbon">Lisbon, Portugal</SelectItem>
                              <SelectItem value="medellin">Medellin, Colombia</SelectItem>
                              <SelectItem value="bangkok">Bangkok, Thailand</SelectItem>
                              <SelectItem value="chiang-mai">Chiang Mai, Thailand</SelectItem>
                              <SelectItem value="berlin">Berlin, Germany</SelectItem>
                              <SelectItem value="mexico-city">Mexico City, Mexico</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="priority">Priority Level</Label>
                          <Select>
                            <SelectTrigger id="priority">
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">High - Urgent Safety Threat</SelectItem>
                              <SelectItem value="medium">Medium - Important Safety Information</SelectItem>
                              <SelectItem value="low">Low - General Notice</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Alert Description</Label>
                        <Textarea 
                          id="description" 
                          placeholder="Provide detailed information about the safety concern..." 
                          className="min-h-[100px]"
                        />
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="start-date">Start Date</Label>
                          <Input id="start-date" type="date" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="end-date">End Date (Optional)</Label>
                          <Input id="end-date" type="date" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="source">Information Source</Label>
                        <Input id="source" placeholder="e.g., Local News, Government Advisory, etc." />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch id="push-notification" />
                        <Label htmlFor="push-notification">Send push notification to premium users</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch id="sms-notification" />
                        <Label htmlFor="sms-notification">Send SMS alerts to premium users (urgent only)</Label>
                      </div>
                    </CardContent>
                    <div className="p-6 pt-0 flex justify-end gap-2">
                      <Button variant="outline">Save as Draft</Button>
                      <Button>Publish Alert</Button>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {alertTab === "manage" && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    title: "Total Alerts",
                    value: "43",
                    change: "+12% from last month",
                    icon: <Bell className="h-8 w-8" />
                  },
                  {
                    title: "Active Alerts",
                    value: "18",
                    change: "+5 in the last week",
                    icon: <CheckCircle className="h-8 w-8" />
                  },
                  {
                    title: "Inactive Alerts",
                    value: "25",
                    change: "-3 from last week",
                    icon: <XCircle className="h-8 w-8" />
                  },
                  {
                    title: "Alert Views",
                    value: "12.5k",
                    change: "+24% from last month",
                    icon: <Users className="h-8 w-8" />
                  }
                ].map((stat, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {stat.title}
                      </CardTitle>
                      {stat.icon}
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">
                        {stat.change}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}