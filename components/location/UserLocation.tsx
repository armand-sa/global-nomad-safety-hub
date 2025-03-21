"use client";

import { useEffect, useState } from "react";
import { MapPin, Loader2, RefreshCw } from "lucide-react";
import { getFullLocationData, getAccuracyString, type LocationData } from "@/lib/geolocation";
import CountryFlag from "./CountryFlag";

// CSS Animation keyframes for the animations
const animationKeyframes = `
@keyframes pulse-glow {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(var(--primary-rgb), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
  60% {
    transform: translateY(-4px);
  }
}
`;

export default function UserLocation() {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLocation, setShowLocation] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Add the CSS animation to the document head
  useEffect(() => {
    // Only add if it doesn't already exist
    if (!document.querySelector('#location-animations')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'location-animations';
      styleElement.innerHTML = animationKeyframes;
      document.head.appendChild(styleElement);
    }
    
    // Clean up on unmount
    return () => {
      const existingStyle = document.querySelector('#location-animations');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

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
          setIsRefreshing(false);
          
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
          setIsRefreshing(false);
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

  const handleRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setRetryCount(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full bg-black/5 dark:bg-white/5 backdrop-blur-sm rounded-md py-6 px-6 mt-4 mb-2 animate-pulse">
        <Loader2 className="h-6 w-6 text-primary mb-2 animate-spin" />
        <span className="text-sm font-medium">Locating you...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full bg-black/5 dark:bg-white/5 backdrop-blur-sm rounded-md py-6 px-6 mt-4 mb-2">
        <div className="flex items-center mb-2">
          <MapPin className="h-6 w-6 text-destructive mb-2" />
        </div>
        <span className="text-sm font-medium mb-1">Location access required</span>
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-2">
          Please allow location access to see safety data for your area
        </p>
        <button 
          onClick={handleRetry}
          className="text-xs font-medium bg-primary/20 hover:bg-primary/30 text-primary px-3 py-1.5 rounded-sm transition-colors mt-1"
        >
          Enable Location
        </button>
      </div>
    );
  }

  if (!locationData) {
    return null;
  }

  const { suburb, city, state, countryCode, country, accuracy } = locationData;
  const accuracyString = getAccuracyString(accuracy);
  
  // Determine best location name to display:
  // 1. Suburb if available (most precise)
  // 2. City if available
  // 3. Default to "Your Location" if neither are available
  const primaryLocation = suburb !== "Unknown" ? suburb : city !== "Unknown" ? city : "Your Location";

  return (
    <div 
      className={`
        relative w-full bg-white/10 dark:bg-black/20 backdrop-blur-md 
        rounded-md py-5 px-6 mt-4 mb-2 overflow-hidden transition-all duration-500 ease-in-out
        ${showLocation ? 'opacity-100 transform-none' : 'opacity-0 translate-y-2'}
        hover:bg-white/15 dark:hover:bg-black/25 transition-colors
      `}
      style={{
        animation: showLocation ? 'pulse-glow 2s infinite' : 'none',
        animationDelay: '0.5s'
      }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent opacity-50"></div>
      
      <div className="relative flex flex-col items-center">
        {/* Flag centered at the top with subtle bounce animation */}
        <div 
          className="mb-3 transform transition-transform hover:scale-105 duration-300"
          style={{
            animation: showLocation ? 'bounce 1s ease-in-out' : 'none',
          }}
        >
          <CountryFlag 
            countryCode={countryCode} 
            countryName={country} 
            size="xl" 
          />
        </div>
        
        {/* Location text centered */}
        <div className="flex flex-col items-center text-center">
          <h3 className="text-base font-semibold">
            {primaryLocation}
            {state !== "Unknown" && (
              <span className="font-normal">, {state}</span>
            )}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {accuracyString}
          </p>
          
          {/* Refresh button */}
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="mt-3 text-xs flex items-center justify-center gap-1 text-primary hover:text-primary/80 transition-colors group"
            aria-label="Refresh location"
          >
            <RefreshCw 
              className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : 'group-hover:animate-spin'}`} 
            />
            <span className="ml-1">Refresh</span>
          </button>
        </div>
      </div>
    </div>
  );
} 