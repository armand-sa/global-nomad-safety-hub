// Helper functions for working with geolocation

// Type for location data
export type LocationData = {
  latitude: number;
  longitude: number;
  suburb: string;
  state: string;
  country: string;
  countryCode: string;
  accuracy: number; // in meters
};

/**
 * Gets the user's current position using the browser's Geolocation API
 * Enhanced for better accuracy
 */
export const getCurrentPosition = (): Promise<{
  coords: { latitude: number; longitude: number; accuracy: number };
}> => {
  return new Promise((resolve, reject) => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    // Get current position with highest possible accuracy
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          },
        });
      },
      (error) => {
        let errorMessage = "Unknown error occurred";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "User denied the request for geolocation";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "The request to get user location timed out";
            break;
        }
        
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true, // Get the most accurate result possible
        timeout: 15000, // Wait up to 15 seconds
        maximumAge: 0, // Don't use cached position
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
                  data.address.town ||
                  data.address.village || 
                  data.address.city_district || 
                  data.address.district || 
                  data.address.quarter || 
                  data.address.hamlet ||
                  data.address.city ||
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
      suburb: data.locality || data.city || "Unknown",
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
): Promise<Partial<LocationData>> => {
  try {
    // Try OpenStreetMap first (most detailed for many regions)
    const osmData = await reverseGeocodeOSM(latitude, longitude).catch(() => null);
    
    // Also try BigDataCloud (often better for cities/suburbs)
    const bdcData = await reverseGeocodeBDC(latitude, longitude).catch(() => null);
    
    // Combine results, preferring OSM but filling gaps with BDC
    return {
      // For city/suburb, prefer BigDataCloud as it's often more accurate for city names
      suburb: (bdcData?.suburb !== "Unknown" ? bdcData?.suburb : osmData?.suburb) || "Unknown",
      
      // For state/province, OSM is typically more accurate
      state: (osmData?.state !== "Unknown" ? osmData?.state : bdcData?.state) || "Unknown",
      
      // For country info, both are reliable but OSM has better coverage
      country: osmData?.country || bdcData?.country || "Unknown",
      countryCode: osmData?.countryCode || bdcData?.countryCode || "Unknown",
    };
  } catch (error) {
    console.error("Error in combined reverse geocoding:", error);
    return {
      suburb: "Unknown",
      state: "Unknown",
      country: "Unknown",
      countryCode: "Unknown",
    };
  }
};

/**
 * Get a user-friendly string for location accuracy with human-readable values
 */
export const getAccuracyString = (accuracyInMeters: number): string => {
  // Get user's locale for number formatting
  const userLocale = navigator.language || "en-US";
  
  // Format number based on magnitude
  const formatWithUnit = (value: number, unit: string) => {
    // Round to nearest whole number for cleaner display
    const rounded = Math.round(value);
    return `Accurate within ${rounded.toLocaleString(userLocale)} ${unit}`;
  };
  
  // Determine if we should use imperial (feet) or metric (meters)
  const useImperial = ["US", "GB", "LR", "MM"].includes(
    Intl.NumberFormat(userLocale).resolvedOptions().locale.split("-")[1] || ""
  );
  
  if (useImperial) {
    // Convert meters to feet (1m ≈ 3.28084ft)
    const accuracyInFeet = accuracyInMeters * 3.28084;
    
    // Use yards for medium distances (3ft = 1yd)
    if (accuracyInFeet > 30) {
      return formatWithUnit(accuracyInFeet / 3, "yards");
    }
    
    return formatWithUnit(accuracyInFeet, "feet");
  } else {
    // For metric, use km for large distances
    if (accuracyInMeters >= 1000) {
      return formatWithUnit(accuracyInMeters / 1000, "kilometers");
    }
    
    return formatWithUnit(accuracyInMeters, "meters");
  }
};

/**
 * Complete function to get location data including coordinates and address details
 * Uses multiple sources to maximize accuracy
 */
export const getFullLocationData = async (): Promise<LocationData> => {
  try {
    // Step 1: Get coordinates from device
    const position = await getCurrentPosition();
    
    const { latitude, longitude, accuracy } = position.coords;
    
    // Step 2: Convert coordinates to address details using multiple services
    const addressData = await reverseGeocode(latitude, longitude);
    
    // Step 3: Combine the data
    return {
      latitude,
      longitude,
      accuracy,
      suburb: addressData.suburb || "Unknown",
      state: addressData.state || "Unknown",
      country: addressData.country || "Unknown",
      countryCode: addressData.countryCode || "Unknown",
    };
  } catch (error) {
    console.error("Error getting location data:", error);
    throw error;
  }
}; 