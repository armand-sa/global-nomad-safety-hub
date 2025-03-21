"use client";

import { useEffect, useState } from "react";
import { getFullLocationData, getAccuracyString } from "@/lib/geolocation";
import type { LocationData } from "@/lib/geolocation";
import { Loader2, MapPin } from "lucide-react";
import CountryFlag from "./CountryFlag";

export default function UserLocation() {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLocation, setShowLocation] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    setShowLocation(false);

    const fetchLocationData = async () => {
      try {
        const data = await getFullLocationData();
        
        if (isMounted) {
          setLocationData(data);
          setIsLoading(false);
          
          // Add animation delay
          setTimeout(() => {
            if (isMounted) {
              setShowLocation(true);
            }
          }, 300);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching location:", err);
          setError(err instanceof Error ? err.message : "Failed to get location");
          setIsLoading(false);
        }
      }
    };

    fetchLocationData();

    return () => {
      isMounted = false;
    };
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full bg-black/5 dark:bg-white/5 backdrop-blur-sm rounded-xl py-4 px-6 mt-4 mb-2 animate-pulse">
        <Loader2 className="h-5 w-5 text-primary mr-2 animate-spin" />
        <span className="text-sm font-medium">Locating you...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full bg-black/5 dark:bg-white/5 backdrop-blur-sm rounded-xl py-4 px-6 mt-4 mb-2">
        <div className="flex items-center mb-2">
          <MapPin className="h-5 w-5 text-destructive mr-2" />
          <span className="text-sm font-medium text-destructive">Location unavailable</span>
        </div>
        <button 
          onClick={handleRetry}
          className="text-xs text-primary hover:underline mt-1"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!locationData) {
    return null;
  }

  const { suburb, state, countryCode, country, accuracy } = locationData;
  const accuracyString = getAccuracyString(accuracy);

  return (
    <div 
      className={`
        relative w-full bg-white/10 dark:bg-black/20 backdrop-blur-md 
        rounded-xl shadow-md border border-white/10 dark:border-black/10 
        py-4 px-6 mt-4 mb-2 overflow-hidden transition-all duration-500 ease-in-out
        ${showLocation ? 'opacity-100 transform-none' : 'opacity-0 translate-y-2'}
      `}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/5 to-transparent opacity-50"></div>
      
      <div className="relative flex items-center">
        <div className="flex-shrink-0 mr-3">
          <CountryFlag 
            countryCode={countryCode} 
            countryName={country} 
            size="xl" 
          />
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold">
              {suburb !== "Unknown" ? suburb : "Your Location"}
              {state !== "Unknown" && suburb !== "Unknown" && (
                <span className="font-normal text-gray-500 dark:text-gray-400">, {state}</span>
              )}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {accuracyString}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 