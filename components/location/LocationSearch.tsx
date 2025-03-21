"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2, Map, MapPin, Globe, Navigation } from "lucide-react";
import { type LocationSearchResult, searchLocationByName } from "@/lib/geolocation";
import { cn } from "@/lib/utils";
import CountryFlag from "./CountryFlag";

// Common place suggestions to help users
const COMMON_PLACES = [
  { name: "New York", country: "United States", countryCode: "US" },
  { name: "London", country: "United Kingdom", countryCode: "GB" },
  { name: "Paris", country: "France", countryCode: "FR" },
  { name: "Tokyo", country: "Japan", countryCode: "JP" },
  { name: "Sydney", country: "Australia", countryCode: "AU" },
  { name: "Berlin", country: "Germany", countryCode: "DE" },
  { name: "Rome", country: "Italy", countryCode: "IT" },
  { name: "Barcelona", country: "Spain", countryCode: "ES" },
  { name: "Amsterdam", country: "Netherlands", countryCode: "NL" },
  { name: "Dubai", country: "United Arab Emirates", countryCode: "AE" },
  { name: "Singapore", country: "Singapore", countryCode: "SG" },
  { name: "Bangkok", country: "Thailand", countryCode: "TH" },
  { name: "Istanbul", country: "Turkey", countryCode: "TR" },
  { name: "Mexico City", country: "Mexico", countryCode: "MX" },
  { name: "Cairo", country: "Egypt", countryCode: "EG" },
  { name: "Athens", country: "Greece", countryCode: "GR" },
  { name: "Beijing", country: "China", countryCode: "CN" },
  { name: "Toronto", country: "Canada", countryCode: "CA" },
  { name: "Madrid", country: "Spain", countryCode: "ES" },
  { name: "Seoul", country: "South Korea", countryCode: "KR" },
];

// Popular travel destinations for digital nomads
const NOMAD_HOTSPOTS = [
  { name: "Chiang Mai", country: "Thailand", countryCode: "TH" },
  { name: "Bali", country: "Indonesia", countryCode: "ID" },
  { name: "Lisbon", country: "Portugal", countryCode: "PT" },
  { name: "Medellin", country: "Colombia", countryCode: "CO" },
  { name: "Prague", country: "Czech Republic", countryCode: "CZ" },
  { name: "Budapest", country: "Hungary", countryCode: "HU" },
  { name: "Ho Chi Minh City", country: "Vietnam", countryCode: "VN" },
  { name: "Playa del Carmen", country: "Mexico", countryCode: "MX" },
];

export default function LocationSearch({ 
  onLocationSelect, 
  onCancel 
}: { 
  onLocationSelect: (location: LocationSearchResult) => void;
  onCancel: () => void; 
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noResults, setNoResults] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  // Get suggestions based on the active tab
  const getSuggestions = () => {
    const shuffled = selectedTabIndex === 0
      ? [...COMMON_PLACES].sort(() => 0.5 - Math.random()).slice(0, 6)
      : [...NOMAD_HOTSPOTS];
    return shuffled;
  };
  
  const [suggestions, setSuggestions] = useState(getSuggestions());

  // Update suggestions when tab changes
  useEffect(() => {
    setSuggestions(getSuggestions());
  }, [selectedTabIndex]);

  useEffect(() => {
    // Focus the search input when component mounts
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Debounce search to prevent too many API calls
  useEffect(() => {
    setNoResults(false);
    
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      try {
        const searchResults = await searchLocationByName(query);
        setResults(searchResults);
        setNoResults(searchResults.length === 0);
        setIsLoading(false);
      } catch (err) {
        console.error("Error searching location:", err);
        setError("Failed to search for locations. Please try again.");
        setIsLoading(false);
      }
    }, 400); // 400ms debounce

    // Cleanup on unmount or when query changes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

  // Handle selection of a location
  const handleSelectLocation = (location: LocationSearchResult) => {
    onLocationSelect(location);
  };

  // Handle clicks on suggestions
  const handleSuggestionClick = async (suggestion: typeof COMMON_PLACES[0]) => {
    try {
      setIsLoading(true);
      setError(null);
      // Add more specific search terms for better accuracy
      const searchQuery = `${suggestion.name}, ${suggestion.country}`;
      const searchResults = await searchLocationByName(searchQuery);
      
      // Find the best match from results with stricter matching
      const bestMatch = searchResults.find(result => {
        const displayName = result.displayName || result.city || "";
        const resultCity = result.city.toLowerCase();
        const suggestionName = suggestion.name.toLowerCase();
        
        // Try to exactly match the city name for better accuracy
        return (
          (resultCity === suggestionName || 
           resultCity.includes(suggestionName) || 
           displayName.toLowerCase().includes(suggestionName)) && 
          result.country.toLowerCase().includes(suggestion.country.toLowerCase())
        );
      }) || searchResults[0];
      
      if (bestMatch) {
        // Extra verification to ensure accurate coordinates
        if (bestMatch.latitude === 0 && bestMatch.longitude === 0) {
          setError("Could not get precise coordinates for this location. Please try another search.");
          setIsLoading(false);
          return;
        }
        
        handleSelectLocation(bestMatch);
      } else {
        setError("Couldn't find this location. Please try another search.");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error with suggestion:", err);
      setError("Failed to process suggestion. Please try typing your search.");
      setIsLoading(false);
    }
  };

  const formatLocationType = (type: string) => {
    return type
      .toLowerCase()
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="fixed inset-0 bg-background/95 dark:bg-background/95 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-card rounded-xl shadow-lg border border-border overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header with search input */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Find your location</h2>
            <button 
              onClick={onCancel}
              className="p-1.5 rounded-full hover:bg-muted transition-colors"
              aria-label="Close search"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary pointer-events-none">
              <Search className="h-4.5 w-4.5" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a city, region, or country..."
              className="w-full h-11 pl-10 pr-3 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors placeholder:text-muted-foreground/70 text-base"
              autoComplete="off"
            />
            {query && !isLoading && (
              <button 
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full hover:bg-muted transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-5 w-5 animate-spin text-primary/70" />
              </div>
            )}
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setSelectedTabIndex(0)}
            className={cn(
              "flex-1 py-2.5 text-sm font-medium transition-colors relative",
              selectedTabIndex === 0 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Popular Cities
            {selectedTabIndex === 0 && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>
            )}
          </button>
          <button
            onClick={() => setSelectedTabIndex(1)}
            className={cn(
              "flex-1 py-2.5 text-sm font-medium transition-colors relative",
              selectedTabIndex === 1 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Nomad Hotspots
            {selectedTabIndex === 1 && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>
            )}
          </button>
        </div>

        {/* Results section */}
        <div className="max-h-[60vh] overflow-y-auto overscroll-contain">
          {error && (
            <div className="p-4 text-center">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Loading state for initial load */}
          {isLoading && results.length === 0 && query && (
            <div className="p-8 flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary/70 mb-3" />
              <p className="text-sm text-muted-foreground">Searching for locations...</p>
            </div>
          )}

          {/* No results state */}
          {noResults && !error && !isLoading && (
            <div className="p-6 text-center">
              <div className="flex justify-center mb-3 text-muted-foreground">
                <MapPin className="h-10 w-10 opacity-50" />
              </div>
              <h3 className="text-base font-medium mb-2">No locations found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Try a different search term or select from suggestions below
              </p>
              <div className="grid grid-cols-2 gap-2">
                {suggestions.slice(0, 4).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="p-2.5 text-sm bg-muted/50 hover:bg-muted rounded-lg transition-colors text-left flex items-center space-x-2"
                  >
                    <CountryFlag countryCode={suggestion.countryCode} size="sm" />
                    <span className="truncate">{suggestion.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search results */}
          {results.length > 0 && !isLoading && (
            <ul className="divide-y divide-border">
              {results
                // Filter out results with 0,0 coordinates (invalid locations)
                .filter(result => !(result.latitude === 0 && result.longitude === 0))
                // Sort results by most relevant - cities first, then other types
                .sort((a, b) => {
                  // Prefer results with country codes
                  if (a.countryCode && !b.countryCode) return -1;
                  if (!a.countryCode && b.countryCode) return 1;
                  
                  // Prefer results that match search terms better
                  const aMatch = a.displayName?.toLowerCase().includes(query.toLowerCase()) || 
                                a.city.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
                  const bMatch = b.displayName?.toLowerCase().includes(query.toLowerCase()) || 
                                b.city.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
                  
                  return bMatch - aMatch;
                })
                .map((result, index) => (
                  <li 
                    key={`${result.displayName}-${result.latitude}-${result.longitude}-${index}`}
                    className={cn(
                      "hover:bg-muted/40 transition-colors cursor-pointer",
                      "border-l-2 border-l-transparent hover:border-l-primary"
                    )}
                    onClick={() => handleSelectLocation(result)}
                  >
                    <div className="p-3.5 sm:p-4 flex items-start space-x-3">
                      <div className="flex-shrink-0 pt-0.5">
                        {result.countryCode ? (
                          <CountryFlag countryCode={result.countryCode} size="sm" />
                        ) : (
                          <MapPin className="h-5 w-5 text-primary/70" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-foreground truncate">
                          {result.displayName || result.city}
                          {result.state && result.state !== result.city && (
                            <span className="text-muted-foreground">, {result.state}</span>
                          )}
                        </div>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-muted-foreground truncate">
                            {result.country}
                          </span>
                          {result.placeType && (
                            <span className="text-xs text-muted-foreground/70 ml-2 px-1.5 py-0.5 bg-muted rounded-full">
                              {formatLocationType(result.placeType)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0 self-center">
                        <Navigation className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          )}

          {/* Suggestions when no search */}
          {!query && (
            <div className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                {selectedTabIndex === 0 ? 'Popular cities around the world' : 'Popular digital nomad destinations'}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="p-3 text-sm bg-muted/30 hover:bg-muted rounded-lg transition-all border border-border/50 hover:border-primary/30 text-left flex items-center space-x-2.5 group"
                  >
                    <CountryFlag countryCode={suggestion.countryCode} size="sm" className="shadow-sm" />
                    <div className="flex flex-col">
                      <span className="font-medium group-hover:text-primary transition-colors">{suggestion.name}</span>
                      <span className="text-xs text-muted-foreground">{suggestion.country}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 