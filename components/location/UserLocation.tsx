"use client";

import { useEffect, useState } from "react";
import { MapPin, Loader2, RefreshCw, Globe, Search, MapIcon, Navigation, Shield, AlertTriangle } from "lucide-react";
import { 
  getFullLocationData, 
  formatAccuracy, 
  getLocationDataFromSearch,
  getCurrentPosition,
  type LocationData, 
  type LocationSearchResult 
} from "@/lib/geolocation";
import CountryFlag from "./CountryFlag";
import LocationSearch from "./LocationSearch";
import { cn } from "@/lib/utils";

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

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    opacity: 0.8;
  }
  70% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.8;
  }
}

@keyframes ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2.4);
    opacity: 0;
  }
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}
`;

export default function UserLocation() {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStage, setLoadingStage] = useState<'initial' | 'gps' | 'geocoding'>('initial');
  const [error, setError] = useState<string | null>(null);
  const [accuracyError, setAccuracyError] = useState<boolean>(false);
  const [showLocation, setShowLocation] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isManualLocation, setIsManualLocation] = useState(false);
  const [isPrecise, setIsPrecise] = useState(false);
  const [highPrecision, setHighPrecision] = useState(false);
  const [showDynamicMap, setShowDynamicMap] = useState(false);

  // Add the CSS animation to the document head
  useEffect(() => {
    // Only add if it doesn't already exist
    if (!document.querySelector('#location-animations')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'location-animations';
      styleElement.innerHTML = animationKeyframes;
      document.head.appendChild(styleElement);
    }
    
    // Set dark mode by default for all users
    if (typeof window !== 'undefined') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
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
    setLoadingStage('initial');
    setError(null);
    setAccuracyError(false);
    setShowLocation(false);
    setShowDynamicMap(false);

    const fetchLocationData = async () => {
      try {
        setLoadingStage('gps');
        // Get position first
        const position = await getCurrentPosition();
        
        if (!isMounted) return;
        
        setLoadingStage('geocoding');
        // Then get full location data
        const data = await getFullLocationData();
        
        if (isMounted) {
          // Check if the accuracy is exceptional (less than 100m) or very high (less than 50m)
          setIsPrecise(data.accuracy < 100);
          setHighPrecision(data.accuracy < 50);
          
          setLocationData(data);
          setIsLoading(false);
          setIsRefreshing(false);
          setIsManualLocation(false);
          
          // Add animation delay
          setTimeout(() => {
            if (isMounted) {
              setShowLocation(true);
              
              // Show dynamic map after location is displayed
              setTimeout(() => {
                if (isMounted) {
                  setShowDynamicMap(true);
                }
              }, 800);
            }
          }, 300);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching location:", err);
          const errorMessage = err instanceof Error ? err.message : "Failed to get location";
          
          // Check if this is an accuracy-related error
          if (errorMessage.includes("accuracy")) {
            setAccuracyError(true);
          }
          
          setError(errorMessage);
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
    setShowDynamicMap(false);
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
    setShowDynamicMap(false);
    
    try {
      const data = await getLocationDataFromSearch(location);
      setLocationData(data);
      setIsManualLocation(true);
      setError(null);
      setIsLoading(false);
      setIsPrecise(true); // Manual locations are always considered precise
      setHighPrecision(true);
      
      // Add animation delay
      setTimeout(() => {
        setShowLocation(true);
        
        // Show dynamic map after location is displayed
        setTimeout(() => {
          setShowDynamicMap(true);
        }, 800);
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
      <div className="flex flex-col items-center justify-center w-full bg-background/80 backdrop-blur-sm rounded-xl py-8 px-6 mt-4 mb-2 border border-border shadow-lg">
        <div className="relative mb-3">
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-75" style={{animationDuration: "1.5s"}}></div>
          {loadingStage === 'initial' && <Globe className="h-12 w-12 text-primary/80 relative animate-pulse" />}
          {loadingStage === 'gps' && (
            <div className="relative">
              <MapPin className="h-12 w-12 text-primary/80 relative animate-bounce" />
              <div className="absolute inset-0 bg-primary/10 rounded-full animate-ripple" style={{animationDuration: "2s", animationIterationCount: "infinite"}}></div>
            </div>
          )}
          {loadingStage === 'geocoding' && (
            <div className="relative">
              <Loader2 className="h-12 w-12 text-primary/80 relative animate-spin" />
              <div className="absolute inset-[-2px] border-2 border-primary/20 rounded-full"></div>
            </div>
          )}
        </div>
        <span className="text-xl font-semibold mb-1 text-foreground animate-pulse">
          {loadingStage === 'initial' && "Preparing..."}
          {loadingStage === 'gps' && "Finding your location..."}
          {loadingStage === 'geocoding' && "Getting location details..."}
        </span>
        <p className="text-sm text-muted-foreground mb-5 text-center max-w-[280px]">
          {loadingStage === 'initial' && "Setting up geolocation services"}
          {loadingStage === 'gps' && "Accessing GPS for precise coordinates"}
          {loadingStage === 'geocoding' && "Converting coordinates to a readable location"}
        </p>
        <div className="w-72 h-2.5 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
            style={{ 
              width: loadingStage === 'initial' ? '10%' : 
                    loadingStage === 'gps' ? '50%' : '85%',
              backgroundImage: "linear-gradient(90deg, rgba(var(--primary-rgb), 0.7), rgba(var(--primary-rgb), 1))",
              boxShadow: "0 0 8px rgba(var(--primary-rgb), 0.5)"
            }}
          ></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full bg-background/80 backdrop-blur-sm rounded-xl py-8 px-6 mt-4 mb-4 border border-destructive/30 shadow-lg">
        <div className="relative text-destructive mb-3">
          <AlertTriangle className="h-12 w-12 stroke-[1.5]" />
          <div className="absolute inset-0 bg-destructive/10 rounded-full animate-pulse opacity-70" style={{animationDuration: "2s"}}></div>
        </div>
        
        {accuracyError ? (
          <>
            <span className="text-xl font-semibold mb-2 text-center">Location Not Accurate Enough</span>
            <p className="text-md text-center text-muted-foreground mb-5 max-w-[320px]">
              We require precise location (within 500m) to provide accurate safety data. Your current location accuracy doesn't meet this requirement.
            </p>
            <div className="flex flex-col space-y-3 mb-4 w-full max-w-[320px]">
              <div className="flex items-start space-x-2 text-sm">
                <div className="bg-destructive/10 p-1 rounded-full mt-0.5">
                  <Navigation className="h-4 w-4 text-destructive" />
                </div>
                <span>Move to an area with better GPS reception</span>
              </div>
              <div className="flex items-start space-x-2 text-sm">
                <div className="bg-destructive/10 p-1 rounded-full mt-0.5">
                  <MapPin className="h-4 w-4 text-destructive" />
                </div>
                <span>Make sure your device's location services are set to high accuracy</span>
              </div>
              <div className="flex items-start space-x-2 text-sm">
                <div className="bg-destructive/10 p-1 rounded-full mt-0.5">
                  <Search className="h-4 w-4 text-destructive" />
                </div>
                <span>Try searching for your location manually instead</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <span className="text-xl font-semibold mb-2">Location access required</span>
            <p className="text-md text-center text-muted-foreground mb-5 max-w-[320px]">
              Please allow location access to see safety data for your area and get personalized alerts
            </p>
          </>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 w-full mt-1 max-w-[320px]">
          <button 
            onClick={handleRetry}
            className="flex-1 font-medium bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:translate-y-[-2px]"
          >
            <MapPin className="h-5 w-5" />
            {accuracyError ? "Try Again" : "Enable Location"}
          </button>
          <button 
            onClick={handleEnterManually}
            className="flex-1 font-medium bg-muted hover:bg-muted/90 px-5 py-3 rounded-lg transition-all border border-border flex items-center justify-center gap-2 shadow-sm hover:shadow transform hover:translate-y-[-2px]"
          >
            <Search className="h-5 w-5" />
            Enter Manually
          </button>
        </div>
      </div>
    );
  }

  if (!locationData) {
    return null;
  }

  const { suburb, city, state, countryCode, country, accuracy, source } = locationData;
  const accuracyString = formatAccuracy(accuracy);
  
  // Determine best location name to display:
  // 1. Suburb if available (most precise)
  // 2. City if available
  // 3. Default to "Your Location" if neither are available
  const primaryLocation = suburb !== "Unknown" ? suburb : city !== "Unknown" ? city : "Your Location";

  // Create Google Maps static image URL for background
  const mapZoom = isPrecise ? 14 : 12;
  const mapSize = "400x200";
  const mapType = "roadmap";
  const mapStyle = "style=element:geometry%7Ccolor:0x212121&style=element:labels.icon%7Cvisibility:off&style=element:labels.text.fill%7Ccolor:0x757575&style=element:labels.text.stroke%7Ccolor:0x212121&style=feature:administrative%7Celement:geometry%7Ccolor:0x757575&style=feature:administrative.country%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:administrative.land_parcel%7Cvisibility:off&style=feature:administrative.locality%7Celement:labels.text.fill%7Ccolor:0xbdbdbd&style=feature:administrative.neighborhood%7Cvisibility:off&style=feature:poi%7Celement:labels.text%7Cvisibility:off&style=feature:poi%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:poi.business%7Cvisibility:off&style=feature:poi.park%7Celement:geometry%7Ccolor:0x181818&style=feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x616161&style=feature:poi.park%7Celement:labels.text.stroke%7Ccolor:0x1b1b1b&style=feature:road%7Celement:geometry.fill%7Ccolor:0x2c2c2c&style=feature:road%7Celement:labels%7Cvisibility:off&style=feature:road%7Celement:labels.text.fill%7Ccolor:0x8a8a8a&style=feature:road.arterial%7Cvisibility:off&style=feature:road.arterial%7Celement:geometry%7Ccolor:0x373737&style=feature:road.highway%7Celement:geometry%7Ccolor:0x3c3c3c&style=feature:road.highway%7Celement:labels%7Cvisibility:off&style=feature:road.highway.controlled_access%7Celement:geometry%7Ccolor:0x4e4e4e&style=feature:road.local%7Cvisibility:off&style=feature:road.local%7Celement:labels.text.fill%7Ccolor:0x616161&style=feature:transit%7Cvisibility:off&style=feature:transit%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:water%7Celement:geometry%7Ccolor:0x000000&style=feature:water%7Celement:labels.text%7Cvisibility:off&style=feature:water%7Celement:labels.text.fill%7Ccolor:0x3d3d3d";
  const mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${locationData.latitude},${locationData.longitude}&zoom=${mapZoom}&size=${mapSize}&maptype=${mapType}&markers=color:red%7C${locationData.latitude},${locationData.longitude}&key=AIzaSyAfYzCMTuCEAaH25KJFSE_b6A50OgdDz0g&${mapStyle}`;

  return (
    <div 
      className={cn(
        "relative w-full backdrop-blur-md rounded-xl py-8 px-5 mt-6 mb-6",
        "overflow-hidden transition-all duration-500 ease-in-out border shadow-lg",
        "bg-gradient-to-b from-background via-background to-background/90",
        showLocation ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4',
        isPrecise ? 'border-primary/40' : 'border-border',
        highPrecision ? 'shadow-xl' : 'shadow-md'
      )}
    >
      {/* Background effects - Animated gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-80 pointer-events-none"></div>
      {isPrecise && (
        <div className="absolute inset-0 bg-primary/5 opacity-50 pointer-events-none"></div>
      )}
      
      {/* Dynamic map background only if high precision and not mobile */}
      {showDynamicMap && isPrecise && (
        <div 
          className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none transition-opacity duration-1000 ease-in-out"
          style={{opacity: showDynamicMap ? "0.15" : "0"}}
        >
          <img 
            src={mapImageUrl} 
            alt="Location map"
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>
      )}
      
      {/* Animated Circles */}
      {highPrecision && (
        <>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-primary/20 animate-pulse opacity-40 pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full border border-primary/10 animate-pulse opacity-30 pointer-events-none" style={{animationDuration: "3s", animationDelay: "0.5s"}}></div>
        </>
      )}
      
      {/* Content container */}
      <div className="relative z-10">
        {/* Flag and location info */}
        <div className="flex flex-col items-center">
          {/* Country flag with animation */}
          <div 
            className={cn(
              "mb-4 p-1 rounded-xl overflow-hidden",
              isPrecise ? "ring-2 ring-primary/20 shadow-md" : "",
              highPrecision ? "animate-float" : ""
            )}
            style={{
              animation: showLocation ? 'fade-in-up 0.6s ease-out forwards, float 5s ease-in-out infinite' : 'none',
              animationDelay: '0.1s',
              background: "transparent"
            }}
          >
            <CountryFlag 
              countryCode={countryCode} 
              countryName={country} 
              size="xl" 
              className={highPrecision ? "shadow-lg" : "shadow-md"}
            />
          </div>
          
          {/* Location text */}
          <div 
            className="flex flex-col items-center text-center"
            style={{
              animation: showLocation ? 'fade-in-up 0.7s ease-out' : 'none',
              animationDelay: '0.3s',
              animationFillMode: 'both'
            }}
          >
            <h3 className="text-2xl font-bold tracking-wide text-foreground">
              {primaryLocation}
              {state !== "Unknown" && primaryLocation !== state && (
                <span className="font-normal text-muted-foreground">, {state}</span>
              )}
            </h3>
            
            {/* Country name */}
            <p className="text-md text-muted-foreground mt-1">{country}</p>
            
            {/* Location accuracy and source */}
            <div className="text-xs text-muted-foreground mt-3 mb-1 flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-1.5">
                {isManualLocation ? (
                  <span className="flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-primary/80" />
                    <span>Manually selected location</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-primary/80" />
                    <span className="flex items-center gap-1.5">
                      {accuracyString}
                      {isPrecise && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-primary/20 text-primary">
                          {highPrecision ? "Ultra Precision" : "High Precision"}
                        </span>
                      )}
                    </span>
                  </span>
                )}
              </div>
              
              {/* Show data source if available */}
              {source && source !== "None" && (
                <span className="text-[10px] text-muted-foreground/70">
                  Source: {source}
                </span>
              )}
            </div>
          </div>
          
          {/* Action buttons */}
          <div 
            className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
            style={{
              animation: showLocation ? 'fade-in-up 0.8s ease-out' : 'none',
              animationDelay: '0.5s',
              animationFillMode: 'both'
            }}
          >
            {/* Refresh button (only show if using GPS location) */}
            {!isManualLocation && (
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="text-xs sm:text-sm flex items-center justify-center gap-1.5 text-primary-foreground hover:text-primary-foreground transition-all
                         bg-primary hover:bg-primary/90 px-3.5 py-2 rounded-lg disabled:opacity-50 shadow-md hover:shadow-lg transform hover:scale-105"
                aria-label="Refresh location"
              >
                <RefreshCw 
                  className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} 
                />
                <span>Refresh Location</span>
              </button>
            )}
            
            {/* Manual search button */}
            <button 
              onClick={handleEnterManually}
              className="text-xs sm:text-sm flex items-center justify-center gap-1.5 text-foreground hover:text-foreground/90 transition-all
                       bg-muted hover:bg-muted/90 px-3.5 py-2 rounded-lg shadow-sm hover:shadow transform hover:scale-105"
              aria-label="Enter location manually"
            >
              <Search className="h-4 w-4" /> 
              <span>Change Location</span>
            </button>
            
            {/* Map button */}
            <button 
              onClick={() => window.location.href = '/map'}
              className="text-xs sm:text-sm flex items-center justify-center gap-1.5 text-foreground/80 hover:text-foreground/100 transition-all
                       bg-background border border-border hover:border-primary/30 px-3.5 py-2 rounded-lg shadow-sm hover:shadow transform hover:scale-105"
              aria-label="View on map"
            >
              <MapIcon className="h-4 w-4" /> 
              <span>View Safety Map</span>
            </button>
          </div>
          
          {/* Safety indicator */}
          {highPrecision && (
            <div 
              className="mt-5 w-full max-w-[320px] bg-background/50 backdrop-blur-sm rounded-lg border border-border shadow-sm p-3 flex items-center gap-3"
              style={{
                animation: showLocation ? 'fade-in-up 0.9s ease-out' : 'none',
                animationDelay: '0.7s',
                animationFillMode: 'both'
              }}
            >
              <div className="bg-green-500/20 p-2 rounded-full">
                <Shield className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">Ultra-Precise Location Active</h4>
                <p className="text-xs text-muted-foreground">Receiving real-time safety alerts for this exact location</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
} 