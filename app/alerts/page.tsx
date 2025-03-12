import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bell, Filter, Globe, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Real-Time Alerts - Global Digital Nomad Safety Hub",
  description: "Stay informed with real-time safety alerts for digital nomads and travelers worldwide.",
  keywords: "travel alerts, safety notifications, digital nomad alerts, travel warnings, safety updates",
};

export default function AlertsPage() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col space-y-6 max-w-screen-lg mx-auto">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Real-Time Alerts</h1>
            <Badge variant="destructive" className="h-fit">LIVE</Badge>
          </div>
          <p className="text-muted-foreground max-w-[700px]">
            Stay informed with the latest safety alerts and travel advisories from around the world.
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              My Alerts
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              My Locations
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              All Regions
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          <Tabs defaultValue="alerts" className="w-full">
            <TabsList className="grid w-full max-w-[400px] grid-cols-3">
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="advisories">Advisories</TabsTrigger>
              <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            </TabsList>
            <TabsContent value="alerts" className="space-y-4 mt-4">
              {[
                {
                  id: 1,
                  type: "high",
                  location: "Barcelona, Spain",
                  title: "Increased Pickpocketing Reports",
                  description: "Multiple reports of pickpocketing incidents near La Rambla and Gothic Quarter. Keep valuables secure and remain vigilant.",
                  time: "2 hours ago"
                },
                {
                  id: 2,
                  type: "medium",
                  location: "Bali, Indonesia",
                  title: "Minor Earthquake Reported",
                  description: "5.2 magnitude earthquake detected offshore. No tsunami warning issued. No major damage reported in tourist areas.",
                  time: "5 hours ago"
                },
                {
                  id: 3,
                  type: "low",
                  location: "Lisbon, Portugal",
                  title: "Public Transportation Strike",
                  description: "Metro workers on 24-hour strike affecting all lines. Consider alternative transportation options.",
                  time: "12 hours ago"
                },
                {
                  id: 4,
                  type: "medium",
                  location: "Medellin, Colombia",
                  title: "Protests Scheduled Downtown",
                  description: "Peaceful demonstrations planned in El Centro from 2-6 PM. Expect traffic delays and increased police presence.",
                  time: "1 day ago"
                },
              ].map((alert) => (
                <Card key={alert.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {alert.title}
                          <Badge 
                            variant={
                              alert.type === "high" ? "destructive" : 
                              alert.type === "medium" ? "outline" : 
                              "secondary"
                            }
                          >
                            {alert.type === "high" ? "Urgent" : 
                             alert.type === "medium" ? "Important" : 
                             "Notice"}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="pt-1">{alert.location} • {alert.time}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{alert.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">Mark as Read</Button>
                    <Button size="sm">View Details</Button>
                  </CardFooter>
                </Card>
              ))}
              
              <Button variant="outline" className="w-full">Load More</Button>
            </TabsContent>

            <TabsContent value="advisories" className="space-y-4 mt-4">
              {[
                {
                  id: 1,
                  country: "Mexico",
                  advisory: "Exercise increased caution due to crime and kidnapping. Some areas have increased risk.",
                  updated: "Last updated: June 12, 2025"
                },
                {
                  id: 2,
                  country: "Thailand",
                  advisory: "Exercise normal precautions in Thailand. Some areas have increased risk.",
                  updated: "Last updated: June 5, 2025"
                },
                {
                  id: 3,
                  country: "South Africa",
                  advisory: "Exercise increased caution due to crime, civil unrest, and drought.",
                  updated: "Last updated: May 28, 2025"
                }
              ].map((advisory) => (
                <Card key={advisory.id}>
                  <CardHeader>
                    <CardTitle>{advisory.country} Travel Advisory</CardTitle>
                    <CardDescription>{advisory.updated}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{advisory.advisory}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline">View Full Advisory</Button>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="subscriptions" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Alert Subscriptions</CardTitle>
                  <CardDescription>Manage locations you want to receive alerts for</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    You are currently subscribed to alerts for the following locations:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="flex items-center gap-1">
                      Barcelona, Spain
                      <button className="ml-1 rounded-full hover:bg-accent h-4 w-4 inline-flex items-center justify-center">×</button>
                    </Badge>
                    <Badge className="flex items-center gap-1">
                      Lisbon, Portugal
                      <button className="ml-1 rounded-full hover:bg-accent h-4 w-4 inline-flex items-center justify-center">×</button>
                    </Badge>
                    <Badge className="flex items-center gap-1">
                      Bali, Indonesia  
                      <button className="ml-1 rounded-full hover:bg-accent h-4 w-4 inline-flex items-center justify-center">×</button>
                    </Badge>
                  </div>
                  <Button variant="outline" className="w-full">Add New Location</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="bg-muted p-6 rounded-lg mt-6">
          <h2 className="text-xl font-bold mb-4">About Our Alert System</h2>
          <p className="mb-2">
            Our real-time alert system aggregates information from multiple trusted sources:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-1 text-sm">
            <li>Government travel advisories</li>
            <li>Local news and emergency services</li>
            <li>Verified community reports</li>
            <li>Weather and natural disaster monitoring</li>
            <li>Health and disease tracking agencies</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Premium subscribers receive push notifications and SMS alerts for their saved locations.
            <Button variant="link" className="h-auto p-0 ml-1">Upgrade to Premium</Button>
          </p>
        </div>
      </div>
    </div>
  );
}