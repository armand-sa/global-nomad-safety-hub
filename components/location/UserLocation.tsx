"use client";

import { useEffect, useState } from "react";
import { MapPin, Loader2, RefreshCw, Globe, Search } from "lucide-react";
import { 
  getFullLocationData, 
  formatAccuracy, 
  getLocationDataFromSearch,
  type LocationData, 
  type LocationSearchResult 
} from "@/lib/geolocation";
import CountryFlag from "./CountryFlag";
import LocationSearch from "./LocationSearch";

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

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
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
  const [showSearch, setShowSearch] = useState(false);
  const [isManualLocation, setIsManualLocation] = useState(false);

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
          setIsManualLocation(false);
          
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

  const handleEnterManually = () => {
    setShowSearch(true);
  };

  const handleSearchCancel = () => {
    setShowSearch(false);
  };

  const handleLocationSelect = async (location: LocationSearchResult) => {
    setIsLoading(true);
    setShowSearch(false);
    setShowLocation(false);
    
    try {
      const data = await getLocationDataFromSearch(location);
      setLocationData(data);
      setIsManualLocation(true);
      setError(null);
      setIsLoading(false);
      
      // Add animation delay
      setTimeout(() => {
        setShowLocation(true);
      }, 300);
    } catch (err) {
      console.error("Error processing manual location:", err);
      setError("Failed to process location data");
      setIsLoading(false);
    }
  };

  // Show location search modal when requested
  if (showSearch) {
    return (
      <LocationSearch 
        onLocationSelect={handleLocationSelect}
        onCancel={handleSearchCancel}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full bg-black/5 dark:bg-white/5 backdrop-blur-sm rounded-md py-6 px-6 mt-4 mb-2 animate-pulse">
        <div className="relative">
          <Globe className="h-8 w-8 text-primary/40" />
          <Loader2 className="h-8 w-8 text-primary absolute inset-0 animate-spin" />
        </div>
        <span className="text-sm font-medium mt-2">Locating you...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full bg-black/5 dark:bg-white/5 backdrop-blur-sm rounded-md py-6 px-6 mt-4 mb-2">
        <div className="text-destructive mb-2">
          <MapPin className="h-8 w-8 stroke-[1.5]" />
        </div>
        <span className="text-sm font-medium mb-1">Location access required</span>
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-2 max-w-[240px]">
          Please allow location access to see safety data for your area
        </p>
        <div className="flex flex-col sm:flex-row gap-2 w-full mt-1 max-w-[250px]">
          <button 
            onClick={handleRetry}
            className="text-xs font-medium bg-primary/20 hover:bg-primary/30 text-primary px-3 py-2 rounded-sm transition-colors"
          >
            Enable Location
          </button>
          <button 
            onClick={handleEnterManually}
            className="text-xs font-medium bg-transparent hover:bg-black/5 dark:hover:bg-white/5 px-3 py-2 rounded-sm transition-colors border border-gray-300 dark:border-gray-600"
          >
            Enter Location Manually
          </button>
        </div>
      </div>
    );
  }

  if (!locationData) {
    return null;
  }

  const { suburb, city, state, countryCode, country, accuracy } = locationData;
  const accuracyString = formatAccuracy(accuracy);
  
  // Determine best location name to display:
  // 1. Suburb if available (most precise)
  // 2. City if available
  // 3. Default to "Your Location" if neither are available
  const primaryLocation = suburb !== "Unknown" ? suburb : city !== "Unknown" ? city : "Your Location";

  return (
    <div 
      className={`
        relative w-full bg-white/15 dark:bg-black/30 backdrop-blur-md 
        rounded-md py-5 px-4 sm:px-6 mt-4 mb-2 overflow-hidden transition-all duration-500 ease-in-out
        ${showLocation ? 'opacity-100 transform-none' : 'opacity-0 translate-y-2'}
        hover:bg-white/20 dark:hover:bg-black/40 transition-colors
        border-t border-white/20 dark:border-white/5
      `}
      style={{
        animation: showLocation ? 'pulse-glow 2s infinite' : 'none',
        animationDelay: '0.5s'
      }}
    >
      {/* Background gradients for visual appeal */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/10 to-transparent opacity-70"></div>
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent opacity-70"></div>
      
      <div className="relative flex flex-col items-center">
        {/* Flag centered at the top with subtle bounce animation */}
        <div 
          className="mb-3 transform transition-transform hover:scale-105 duration-300"
          style={{
            animation: showLocation ? 'bounce 1s ease-in-out' : 'none',
            animationDelay: '0.2s',
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))',
          }}
        >
          <CountryFlag 
            countryCode={countryCode} 
            countryName={country} 
            size="xl" 
          />
        </div>
        
        {/* Location text centered with fade animation */}
        <div 
          className="flex flex-col items-center text-center"
          style={{
            animation: showLocation ? 'fade-in-up 0.7s ease-out' : 'none',
            animationDelay: '0.4s',
            animationFillMode: 'both'
          }}
        >
          <h3 className="text-base font-semibold tracking-wide">
            {primaryLocation}
            {state !== "Unknown" && (
              <span className="font-normal">, {state}</span>
            )}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {isManualLocation ? "Manually selected location" : accuracyString}
          </p>
          
          {/* Action buttons */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {/* Refresh button (only show if using GPS location) */}
            {!isManualLocation && (
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="text-xs flex items-center justify-center gap-1 text-primary hover:text-primary/80 transition-colors group
                          bg-primary/10 hover:bg-primary/15 px-3 py-1.5 rounded-sm"
                aria-label="Refresh location"
              >
                <RefreshCw 
                  className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : 'group-hover:animate-spin'}`} 
                />
                <span className="ml-1">Refresh</span>
              </button>
            )}
            
            {/* Manual search button */}
            <button 
              onClick={handleEnterManually}
              className="text-xs flex items-center justify-center gap-1 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors
                        bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 px-3 py-1.5 rounded-sm"
              aria-label="Enter location manually"
            >
              <Search className="h-3.5 w-3.5" /> 
              <span className="ml-1">Change Location</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 