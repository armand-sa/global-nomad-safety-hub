import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Filter } from "lucide-react";

export const metadata: Metadata = {
  title: "Safety Map - Global Digital Nomad Safety Hub",
  description: "Explore our interactive global safety map for digital nomads with real-time safety scores and alerts by location.",
  keywords: "travel safety map, digital nomad safety, global safety index, interactive safety map",
};

export default function MapPage() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col space-y-6 max-w-screen-lg mx-auto">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Safety Map</h1>
          <p className="text-muted-foreground">
            Explore global safety scores and alerts for digital nomads with our interactive map.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <div className="flex items-center w-full border rounded-md pl-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for a city or country..."
                className="flex w-full h-10 bg-transparent py-2 px-3 text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <Button variant="outline" className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        <Tabs defaultValue="map" className="w-full">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2">
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          <TabsContent value="map" className="border rounded-lg overflow-hidden mt-4">
            <div className="aspect-[16/9] bg-muted flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-muted-foreground mx-auto" />
                <p className="mt-4 text-lg font-medium">Interactive Map</p>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  This is a placeholder for the OpenStreetMap integration. The actual map will display safety scores and alerts globally.
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="list" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                { city: "Lisbon, Portugal", score: 92, description: "Very Safe" },
                { city: "Chiang Mai, Thailand", score: 87, description: "Generally Safe" },
                { city: "Medellin, Colombia", score: 71, description: "Exercise Caution" },
                { city: "Berlin, Germany", score: 89, description: "Generally Safe" },
                { city: "Bali, Indonesia", score: 82, description: "Generally Safe" },
                { city: "Mexico City, Mexico", score: 68, description: "Exercise Caution" },
              ].map((location) => (
                <Card key={location.city}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{location.city}</CardTitle>
                    <CardDescription>
                      Safety Score: <span className="font-medium">{location.score}/100</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{location.description}</p>
                    <Button variant="link" className="p-0 mt-2 h-auto">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-muted p-6 rounded-lg mt-6">
          <h2 className="text-xl font-bold mb-4">About Our Safety Map</h2>
          <p className="mb-4">
            Our safety map aggregates data from multiple trusted sources including government travel advisories, 
            crime statistics, health warnings, and real-time reports from our community of digital nomads.
          </p>
          <p className="mb-4">
            Safety scores are calculated using our proprietary algorithm that weighs factors like:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Crime rates (violent and non-violent)</li>
            <li>Political stability</li>
            <li>Healthcare quality and accessibility</li>
            <li>Natural disaster risks</li>
            <li>LGBTQ+ safety</li>
            <li>Women's safety</li>
            <li>Digital infrastructure security</li>
          </ul>
          <p>
            Scores are updated weekly, while alerts are processed in real-time to ensure you always have 
            the most current safety information for your travels.
          </p>
        </div>
      </div>
    </div>
  );
}