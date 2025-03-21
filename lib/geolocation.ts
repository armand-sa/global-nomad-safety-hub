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
 * @returns Promise with coordinates and accuracy
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

    // Get current position with high accuracy
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
        enableHighAccuracy: true, // Get the best possible result
        timeout: 10000, // 10 seconds
        maximumAge: 0, // Don't use cached position
      }
    );
  });
};

/**
 * Converts coordinates to a human-readable address using reverse geocoding
 * @param latitude Latitude coordinate
 * @param longitude Longitude coordinate
 * @returns Promise with location details
 */
export const reverseGeocode = async (
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
      throw new Error("Failed to fetch location data");
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
    console.error("Error in reverse geocoding:", error);
    return {
      suburb: "Unknown",
      state: "Unknown",
      country: "Unknown",
      countryCode: "Unknown",
    };
  }
};

/**
 * Get a user-friendly string for location accuracy
 * @param accuracyInMeters Accuracy in meters from Geolocation API
 * @returns Human-readable accuracy string
 */
export const getAccuracyString = (accuracyInMeters: number): string => {
  // Get user's locale for number formatting
  const userLocale = navigator.language || "en-US";
  
  // Determine if we should use imperial (feet) or metric (meters)
  const useImperial = ["US", "GB", "LR", "MM"].includes(
    Intl.NumberFormat(userLocale).resolvedOptions().locale.split("-")[1] || ""
  );
  
  if (useImperial) {
    // Convert meters to feet (1m ≈ 3.28084ft)
    const accuracyInFeet = accuracyInMeters * 3.28084;
    
    // Format the number with appropriate rounding
    const formattedFeet = Math.round(accuracyInFeet).toLocaleString(userLocale);
    
    return `Accurate within ${formattedFeet} feet`;
  } else {
    // Round to nearest meter for cleaner display
    const formattedMeters = Math.round(accuracyInMeters).toLocaleString(userLocale);
    
    return `Accurate within ${formattedMeters} meters`;
  }
};

/**
 * Complete function to get location data including coordinates and address details
 * @returns Promise with complete location data
 */
export const getFullLocationData = async (): Promise<LocationData> => {
  try {
    // Step 1: Get coordinates from device
    const position = await getCurrentPosition();
    
    const { latitude, longitude, accuracy } = position.coords;
    
    // Step 2: Convert coordinates to address details
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