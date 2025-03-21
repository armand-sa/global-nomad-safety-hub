"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, MapPin, Check, X } from "lucide-react";
import { searchLocationByName, type LocationSearchResult } from "@/lib/geolocation";

interface LocationSearchProps {
  onLocationSelect: (location: LocationSearchResult) => void;
  onCancel: () => void;
}

export default function LocationSearch({ onLocationSelect, onCancel }: LocationSearchProps) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LocationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle clicks outside the search results to close them
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node) && 
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        onCancel();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onCancel]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onCancel]);

  // Search after typing stops
  useEffect(() => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    // Use debounce to prevent too many requests
    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      setError(null);
      
      try {
        const results = await searchLocationByName(query);
        setSearchResults(results);
      } catch (err) {
        console.error("Error searching for location:", err);
        setError("Failed to search for location");
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleLocationClick = (location: LocationSearchResult) => {
    onLocationSelect(location);
  };

  const handleClearInput = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const renderLocationItem = (location: LocationSearchResult) => {
    const mainPart = location.city !== "Unknown" ? location.city : 
                    location.state !== "Unknown" ? location.state : 
                    location.country;
    
    const secondaryPart = location.state !== "Unknown" && location.city !== "Unknown" 
                         ? `, ${location.state}` 
                         : '';
    
    const displayText = `${mainPart}${secondaryPart}, ${location.country}`;
    
    return (
      <li 
        key={`${location.latitude}-${location.longitude}`}
        className="px-3 py-2 hover:bg-primary/10 cursor-pointer transition-colors flex items-center gap-2"
        onClick={() => handleLocationClick(location)}
      >
        <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
        <span className="text-sm truncate">{displayText}</span>
      </li>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto p-2 sm:p-4 fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
      <div className="w-full bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium mb-1">Search your location</h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Enter a city, region, or country to display safety data
            </p>
          </div>
          <button 
            onClick={onCancel}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        {/* Search input */}
        <div className="p-3 sm:p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Enter a location..."
              className="w-full py-2 pl-10 pr-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            
            {query.length > 0 && (
              <button
                onClick={handleClearInput}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label="Clear search"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
              </button>
            )}
            
            {isSearching && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
              </div>
            )}
          </div>
          
          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}
        </div>
        
        {/* Search results */}
        {searchResults.length > 0 ? (
          <div 
            ref={resultsRef}
            className="max-h-60 overflow-y-auto border-t border-gray-200 dark:border-gray-700 flex-1"
          >
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {searchResults.map(renderLocationItem)}
            </ul>
          </div>
        ) : query.length >= 2 && !isSearching && (
          <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
            No locations found. Try a different search term.
          </div>
        )}
        
        {/* Footer */}
        <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-750 flex justify-end gap-2 mt-auto">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onCancel()}
            className="px-4 py-2 text-sm bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors"
          >
            Try GPS Instead
          </button>
        </div>
      </div>
    </div>
  );
} 