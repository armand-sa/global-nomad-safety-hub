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

/**
 * Gets the user's current position using the Geolocation API
 */
export const getCurrentPosition = async (): Promise<GeolocationResult> => {
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported by this browser");
  }

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
      { 
        enableHighAccuracy: true, 
        timeout: 10000, 
        maximumAge: 0 
      }
    );
  });
};

/**
 * Converts coordinates to a human-readable address using OpenStreetMap API
 */
export const reverseGeocodeOSM = async (
  latitude: number,
  longitude: number
): Promise<Partial<LocationData>> => {
  try {
    // Using OpenStreetMap Nominatim API for reverse geocoding (free and no API key required)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          "Accept-Language": navigator.language || "en-US", // Get results in user's language
          "User-Agent": "GlobalNomadSafetyHub/1.0", // Required by Nominatim
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch location data from OSM");
    }

    const data = await response.json();
    
    // Extract relevant address components
    const suburb = data.address.suburb || 
                  data.address.neighbourhood || 
                  data.address.quarter || 
                  data.address.hamlet ||
                  "Unknown";
                  
    const city = data.address.city || 
                data.address.town ||
                data.address.village || 
                data.address.city_district || 
                data.address.district ||
                "Unknown";
                
    const state = data.address.state || 
                 data.address.province || 
                 data.address.region || 
                 data.address.county ||
                 "Unknown";
                 
    const country = data.address.country || "Unknown";
    
    // Get the two-letter country code
    const countryCode = data.address.country_code ? 
                       data.address.country_code.toUpperCase() : 
                       "Unknown";

    return {
      suburb,
      city,
      state,
      country,
      countryCode,
    };
  } catch (error) {
    console.error("Error in OSM reverse geocoding:", error);
    throw error;
  }
};

/**
 * Converts coordinates to a human-readable address using BigDataCloud API
 */
export const reverseGeocodeBDC = async (
  latitude: number,
  longitude: number
): Promise<Partial<LocationData>> => {
  try {
    // Using BigDataCloud API as a secondary source (free tier with reasonable limits)
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=${navigator.language || "en"}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch location data from BigDataCloud");
    }

    const data = await response.json();
    
    return {
      suburb: data.locality || "Unknown",
      city: data.city || "Unknown",
      state: data.principalSubdivision || data.adminArea || "Unknown",
      country: data.countryName || "Unknown",
      countryCode: data.countryCode || "Unknown",
    };
  } catch (error) {
    console.error("Error in BigDataCloud reverse geocoding:", error);
    throw error;
  }
};

/**
 * Converts coordinates to a human-readable address using multiple services
 * This approach tries multiple geocoding services for better accuracy
 */
export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<ReverseGeocodingResult> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&accept-language=en`,
      {
        headers: {
          "User-Agent": "GlobalNomadSafetyHub/1.0",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to reverse geocode: ${response.statusText}`);
    }

    const data = await response.json();
    
    const result: ReverseGeocodingResult = {
      country: data.address.country || "Unknown",
      countryCode: data.address.country_code ? data.address.country_code.toUpperCase() : "Unknown",
      state: data.address.state || data.address.county || data.address.region || "Unknown",
      city: data.address.city || data.address.town || data.address.village || data.address.municipality || "Unknown",
      suburb: data.address.suburb || data.address.neighbourhood || data.address.district || "Unknown",
      street: data.address.road || null,
      postalCode: data.address.postcode || null,
    };

    return result;
  } catch (error) {
    console.error("Error in reverse geocoding:", error);
    throw new Error("Failed to get location details. Please try again later.");
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
 * Gets complete location data including reverse geocoding
 */
export const getFullLocationData = async (): Promise<LocationData> => {
  try {
    // Get user's coordinates
    const position = await getCurrentPosition();
    const { latitude, longitude, accuracy } = position.coords;
    
    // Get location details through reverse geocoding
    const locationDetails = await reverseGeocode(latitude, longitude);
    
    return {
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
  } catch (error) {
    console.error("Error getting full location data:", error);
    throw error;
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