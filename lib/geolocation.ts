"use client";

// Helper functions for working with geolocation

// Type for location data
export type LocationData = {
  latitude: number;
  longitude: number;
  suburb: string;
  city: string;
  state: string;
  country: string;
  countryCode: string;
  accuracy: number; // in meters
  accuracyString?: string;
};

export type GeolocationResult = {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
    heading: number | null;
    speed: number | null;
    altitude: number | null;
    altitudeAccuracy: number | null;
  };
  timestamp: number;
};

export type GeoError = {
  code: number;
  message: string;
  PERMISSION_DENIED?: number;
  POSITION_UNAVAILABLE?: number;
  TIMEOUT?: number;
};

export type ReverseGeocodingResult = {
  country: string;
  countryCode: string;
  state: string;
  city: string;
  suburb: string;
  street: string | null;
  postalCode: string | null;
};

// Type for location search results
export type LocationSearchResult = {
  city: string;
  state: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
};

// Constants for caching
const LOCATION_CACHE_KEY = 'gnsh_location_cache';
const LOCATION_CACHE_EXPIRY = 15 * 60 * 1000; // 15 minutes in milliseconds

/**
 * Gets the user's current position using the Geolocation API with enhanced accuracy
 */
export const getCurrentPosition = async (): Promise<GeolocationResult> => {
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported by this browser");
  }

  // First try high accuracy (may take longer but more precise)
  try {
    return await getPositionWithOptions({
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    });
  } catch (error: any) {
    // If high accuracy fails with timeout, try again with lower accuracy
    if (error.code === 3) { // TIMEOUT
      console.log("High accuracy position timed out, trying with lower accuracy...");
      return await getPositionWithOptions({
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000 // Allow cached positions up to 1 minute old
      });
    }
    // For other errors (permission denied, position unavailable), just throw
    throw error;
  }
};

/**
 * Helper function to get position with specific options
 */
const getPositionWithOptions = (options: PositionOptions): Promise<GeolocationResult> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
          },
          timestamp: position.timestamp,
        });
      },
      (error) => {
        let errorMessage = "Unknown error occurred";
        
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = "Location access denied. Please enable location permissions in your browser settings.";
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage = "Unable to determine your current location. Please try again later.";
            break;
          case 3: // TIMEOUT
            errorMessage = "Location request timed out. Please try again.";
            break;
        }
        
        reject({
          code: error.code,
          message: errorMessage,
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
        });
      },
      options
    );
  });
};

/**
 * Converts coordinates to a human-readable address using BigDataCloud API
 * This is used as a fallback when OpenStreetMap fails
 */
export const reverseGeocodeBigDataCloud = async (
  latitude: number,
  longitude: number
): Promise<ReverseGeocodingResult> => {
  try {
    // BigDataCloud offers a free reverse geocoding API that doesn't require an API key
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?` +
      `latitude=${latitude}&longitude=${longitude}&` +
      `localityLanguage=en`,
      {
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to reverse geocode with BigDataCloud: ${response.statusText}`);
    }

    const data = await response.json();
    
    const result: ReverseGeocodingResult = {
      country: data.countryName || "Unknown",
      countryCode: data.countryCode || "Unknown",
      state: data.principalSubdivision || data.administrativeArea || "Unknown",
      city: data.city || data.locality || "Unknown",
      suburb: data.locality || data.localityInfo?.informative?.find((i: any) => i.type === "suburb")?.name || "Unknown",
      street: data.road || null,
      postalCode: data.postcode || null,
    };

    // Console log for debugging
    console.log("BigDataCloud fallback result:", result);

    return result;
  } catch (error) {
    console.error("Error in BigDataCloud reverse geocoding:", error);
    throw error;
  }
};

/**
 * Converts coordinates to a human-readable address with fallback
 */
export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<ReverseGeocodingResult> => {
  try {
    try {
      // Try OpenStreetMap first (primary source)
      const osmResult = await reverseGeocodeOpenStreetMap(latitude, longitude);
      return osmResult;
    } catch (error) {
      console.log("OpenStreetMap geocoding failed, trying fallback...");
      // If OpenStreetMap fails, try BigDataCloud as fallback
      const bigDataCloudResult = await reverseGeocodeBigDataCloud(latitude, longitude);
      return bigDataCloudResult;
    }
  } catch (error) {
    console.error("All geocoding services failed:", error);
    // If all services fail, return a basic response with coordinates
    return {
      country: "Unknown",
      countryCode: "Unknown",
      state: "Unknown",
      city: "Unknown",
      suburb: "Unknown",
      street: null,
      postalCode: null,
    };
  }
};

/**
 * Converts coordinates to a human-readable address using OpenStreetMap
 */
export const reverseGeocodeOpenStreetMap = async (
  latitude: number,
  longitude: number
): Promise<ReverseGeocodingResult> => {
  try {
    // Use OpenStreetMap with enhanced settings for better accuracy
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?` +
      `lat=${latitude}&lon=${longitude}&` +
      `format=json&addressdetails=1&accept-language=en&` +
      `zoom=18&namedetails=1&extratags=1`,
      {
        headers: {
          "User-Agent": "GlobalNomadSafetyHub/1.0",
        },
        // Increase timeout for better results
        signal: AbortSignal.timeout(15000),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to reverse geocode: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Get suburb with fallbacks for more specific areas
    const suburb = 
      data.address.suburb || 
      data.address.neighbourhood || 
      data.address.residential || 
      data.address.quarter || 
      data.address.hamlet ||
      data.address.district ||
      "Unknown";
    
    // Get city with fallbacks for different administrative regions
    const city = 
      data.address.city || 
      data.address.town || 
      data.address.village || 
      data.address.municipality || 
      data.address.city_district || 
      "Unknown";
    
    // Get state with fallbacks for different regional divisions
    const state = 
      data.address.state || 
      data.address.province || 
      data.address.county || 
      data.address.region || 
      "Unknown";
    
    const result: ReverseGeocodingResult = {
      country: data.address.country || "Unknown",
      countryCode: data.address.country_code ? data.address.country_code.toUpperCase() : "Unknown",
      state,
      city,
      suburb,
      street: data.address.road || data.address.street || null,
      postalCode: data.address.postcode || null,
    };

    // Console log for debugging
    console.log("OpenStreetMap geocoding result:", result);

    return result;
  } catch (error) {
    console.error("Error in OpenStreetMap reverse geocoding:", error);
    throw error;
  }
};

/**
 * Search for locations by name
 */
export const searchLocationByName = async (query: string): Promise<LocationSearchResult[]> => {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=7&accept-language=en`,
      {
        headers: {
          "User-Agent": "GlobalNomadSafetyHub/1.0",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to search location: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Filter to only include places, not streets or buildings
    const relevantResults = data.filter((item: any) => {
      // Check if it's a place worth displaying
      return (
        (item.type === 'city' || 
        item.type === 'administrative' || 
        item.type === 'town' || 
        item.type === 'village' || 
        item.type === 'county' || 
        item.type === 'state' || 
        item.type === 'country') &&
        // Make sure there's a country code
        item.address && item.address.country_code
      );
    });
    
    const results: LocationSearchResult[] = relevantResults.map((item: any) => ({
      city: item.address.city || item.address.town || item.address.village || item.address.municipality || "Unknown",
      state: item.address.state || item.address.county || item.address.region || "Unknown",
      country: item.address.country || "Unknown",
      countryCode: item.address.country_code ? item.address.country_code.toUpperCase() : "Unknown",
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
    }));

    // Remove duplicates based on display name
    const uniqueResults = results.filter((result, index, self) => 
      index === self.findIndex((r) => 
        r.city === result.city && 
        r.state === result.state && 
        r.country === result.country
      )
    );

    return uniqueResults;
  } catch (error) {
    console.error("Error searching for location:", error);
    throw new Error("Failed to search for locations. Please try again later.");
  }
};

/**
 * Gets complete location data including reverse geocoding with caching
 */
export const getFullLocationData = async (): Promise<LocationData> => {
  try {
    // Check for cached location data first
    const cachedData = getCachedLocationData();
    if (cachedData) {
      console.log("Using cached location data");
      return cachedData;
    }
    
    console.log("Fetching fresh location data...");
    
    // Get user's coordinates
    const position = await getCurrentPosition();
    const { latitude, longitude, accuracy } = position.coords;
    
    // Get location details through reverse geocoding
    const locationDetails = await reverseGeocode(latitude, longitude);
    
    const locationData: LocationData = {
      suburb: locationDetails.suburb,
      city: locationDetails.city,
      state: locationDetails.state,
      country: locationDetails.country,
      countryCode: locationDetails.countryCode,
      latitude,
      longitude,
      accuracy,
      accuracyString: formatAccuracy(accuracy)
    };
    
    // Cache the location data
    cacheLocationData(locationData);
    
    return locationData;
  } catch (error) {
    console.error("Error getting full location data:", error);
    throw error;
  }
};

/**
 * Cache location data to localStorage with expiry
 */
const cacheLocationData = (data: LocationData): void => {
  try {
    const cacheEntry = {
      data,
      timestamp: Date.now()
    };
    
    localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(cacheEntry));
    console.log("Location data cached successfully");
  } catch (error) {
    console.error("Failed to cache location data:", error);
    // Non-critical error, so we just log it
  }
};

/**
 * Retrieve cached location data if it exists and is not expired
 */
const getCachedLocationData = (): LocationData | null => {
  try {
    const cachedEntry = localStorage.getItem(LOCATION_CACHE_KEY);
    if (!cachedEntry) return null;
    
    const { data, timestamp } = JSON.parse(cachedEntry);
    const now = Date.now();
    
    // Check if the cached data has expired
    if (now - timestamp > LOCATION_CACHE_EXPIRY) {
      console.log("Cached location data expired");
      localStorage.removeItem(LOCATION_CACHE_KEY);
      return null;
    }
    
    return data as LocationData;
  } catch (error) {
    console.error("Failed to retrieve cached location data:", error);
    return null;
  }
};

/**
 * Creates location data from a manual search result
 */
export const getLocationDataFromSearch = async (
  searchResult: LocationSearchResult
): Promise<LocationData> => {
  try {
    // For manually selected locations, we set a default accuracy
    // Since the user selected this location, we don't need precise accuracy
    const defaultAccuracy = 1000; // 1km accuracy for manual selections
    
    return {
      suburb: "Selected Location", // Generic for manual selections
      city: searchResult.city,
      state: searchResult.state,
      country: searchResult.country,
      countryCode: searchResult.countryCode,
      latitude: searchResult.latitude,
      longitude: searchResult.longitude,
      accuracy: defaultAccuracy,
      accuracyString: formatAccuracy(defaultAccuracy)
    };
  } catch (error) {
    console.error("Error processing manual location:", error);
    throw new Error("Failed to process location data");
  }
};

/**
 * Formats accuracy distance to be human-readable
 * Converts meters to feet for US users
 */
export const formatAccuracy = (accuracyInMeters: number): string => {
  // Detect if user is likely from the US based on language and region
  const isUS = navigator.language.includes("en-US") || 
               Intl.DateTimeFormat().resolvedOptions().timeZone.includes("America");
  
  if (isUS) {
    // Convert meters to feet (1 meter ≈ 3.28084 feet)
    const feet = Math.round(accuracyInMeters * 3.28084);
    
    if (feet >= 5280) {
      const miles = (feet / 5280).toFixed(1);
      return `±${miles} ${parseFloat(miles) === 1 ? 'mile' : 'miles'}`;
    }
    
    return `±${feet} ft`;
  } else {
    // Use meters for non-US users
    if (accuracyInMeters >= 1000) {
      const km = (accuracyInMeters / 1000).toFixed(1);
      return `±${km} km`;
    }
    
    return `±${Math.round(accuracyInMeters)} m`;
  }
}; 