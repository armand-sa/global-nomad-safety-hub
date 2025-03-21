"use client";

import { useEffect, useState } from "react";
import { getFullLocationData, getAccuracyString } from "@/lib/geolocation";
import type { LocationData } from "@/lib/geolocation";
import { Loader2 } from "lucide-react";
import CountryFlag from "./CountryFlag";

export default function UserLocation() {
  // State for location data
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch location when component mounts
  useEffect(() => {
    let isMounted = true;

    const fetchLocation = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get the user's location
        const data = await getFullLocationData();
        
        // Only update state if component is still mounted
        if (isMounted) {
          setLocationData(data);
          setLoading(false);
        }
      } catch (err) {
        // Only update state if component is still mounted
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to get location");
          setLoading(false);
        }
      }
    };

    // Run immediately and set up a refresh timer
    fetchLocation();
    
    // Clean up on unmount
    return () => {
      isMounted = false;
    };
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 text-sm mt-2 mb-4 text-muted-foreground animate-pulse">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Getting your location...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center text-sm mt-2 mb-4 text-muted-foreground">
        <span>Location services unavailable</span>
      </div>
    );
  }

  // No data state (shouldn't happen, but just in case)
  if (!locationData) {
    return null;
  }

  // Create the accuracy string
  const accuracyString = getAccuracyString(locationData.accuracy);
  
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-2 text-sm mt-2 mb-4">
      <CountryFlag 
        countryCode={locationData.countryCode} 
        countryName={locationData.country} 
        size="md"
        className="mr-1"
      />
      <span className="font-medium text-primary">
        {locationData.suburb}, {locationData.state} ({accuracyString})
      </span>
    </div>
  );
} 