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
  source?: string; // Track which service provided the data
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
  source?: string;
};

// Type for location search results
export type LocationSearchResult = {
  city: string;
  state: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  displayName?: string; // Full location name
  placeType?: string; // Type of place (suburb, city, etc.)
};

// Constants for caching
const LOCATION_CACHE_KEY = 'gnsh_location_cache';
const LOCATION_CACHE_EXPIRY = 15 * 60 * 1000; // 15 minutes in milliseconds
const MAX_ACCEPTABLE_ACCURACY = 500; // Maximum acceptable accuracy in meters

/**
 * Gets the user's current position using the Geolocation API with enhanced accuracy
 */
export const getCurrentPosition = async (): Promise<GeolocationResult> => {
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported by this browser");
  }

  // Try to get the most accurate position possible with multiple attempts
  try {
    // First attempt: High accuracy mode with no cached positions
    const position = await getPositionWithOptions({
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    });
    
    // Check if accuracy is acceptable
    if (position.coords.accuracy > MAX_ACCEPTABLE_ACCURACY) {
      console.log(`Position accuracy (${position.coords.accuracy}m) exceeds maximum acceptable (${MAX_ACCEPTABLE_ACCURACY}m), trying again with higher accuracy...`);
      
      try {
        // Try again with extended timeout for higher accuracy
        const precisePosition = await getPositionWithOptions({
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0
        });
        
        // If new attempt is more accurate, use it
        if (precisePosition.coords.accuracy < position.coords.accuracy) {
          return precisePosition;
        }
      } catch (retryError) {
        // If retry fails, continue with original position
        console.warn("Retry for higher accuracy failed, using best available position");
      }
    }
    
    return position;
  } catch (error: any) {
    // If high accuracy fails, try with a more lenient timeout
    if (error.code === 3) { // TIMEOUT
      console.log("High accuracy position timed out, trying with a longer timeout...");
      try {
        return await getPositionWithOptions({
          enableHighAccuracy: true,
          timeout: 20000, // Longer timeout
          maximumAge: 0
        });
      } catch (secondError: any) {
        // If that still times out, try with lower accuracy
        if (secondError.code === 3) { // TIMEOUT
          console.log("Extended high accuracy timed out, falling back to lower accuracy...");
          const position = await getPositionWithOptions({
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 30000 // Allow cached positions up to 30 seconds old
          });
          
          // Check if even low accuracy position meets our requirements
          if (position.coords.accuracy > MAX_ACCEPTABLE_ACCURACY) {
            throw new Error(`Location accuracy of ${Math.round(position.coords.accuracy)}m exceeds maximum acceptable (${MAX_ACCEPTABLE_ACCURACY}m). Please try again in a better location with clearer GPS signal.`);
          }
          
          return position;
        }
        throw secondError;
      }
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
    
    // Get details from locality info if available
    let suburb = "Unknown";
    let street = null;
    
    if (data.localityInfo?.informative) {
      // Look for suburb-like entities
      const suburbInfo = data.localityInfo.informative.find(
        (i: any) => i.type === "suburb" || i.type === "hamlet" || i.type === "neighbourhood"
      );
      
      if (suburbInfo) {
        suburb = suburbInfo.name;
      }
      
      // Look for street info
      const streetInfo = data.localityInfo.informative.find(
        (i: any) => i.type === "road" || i.type === "street"
      );
      
      if (streetInfo) {
        street = streetInfo.name;
      }
    }
    
    const result: ReverseGeocodingResult = {
      country: data.countryName || "Unknown",
      countryCode: data.countryCode || "Unknown",
      state: data.principalSubdivision || data.administrativeArea || "Unknown",
      city: data.city || data.locality || "Unknown",
      suburb: suburb,
      street: street || data.road || null,
      postalCode: data.postcode || null,
      source: "BigDataCloud"
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
 * Try Geocode.xyz as another fallback (specialized in precise locations)
 */
export const reverseGeocodeXYZ = async (
  latitude: number,
  longitude: number
): Promise<ReverseGeocodingResult> => {
  try {
    // Geocode.xyz has a free tier that's good for specific locations
    const response = await fetch(
      `https://geocode.xyz/${latitude},${longitude}?geoit=json&auth=752648166254533445534x8187`,
      {
        signal: AbortSignal.timeout(12000),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to reverse geocode with Geocode.xyz: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Handle error response
    if (data.error) {
      throw new Error(`Geocode.xyz error: ${data.error.message || 'Unknown error'}`);
    }
    
    const result: ReverseGeocodingResult = {
      country: data.country || "Unknown",
      countryCode: data.prov || "Unknown", 
      state: data.region || data.state || "Unknown",
      city: data.city || data.town || "Unknown",
      suburb: data.suburb || data.neighborhood || data.staddress || "Unknown",
      street: data.staddress || null,
      postalCode: data.postal || null,
      source: "Geocode.xyz"
    };

    console.log("Geocode.xyz result:", result);
    return result;
  } catch (error) {
    console.error("Error in Geocode.xyz reverse geocoding:", error);
    throw error;
  }
};

/**
 * Converts coordinates to a human-readable address with multiple fallbacks
 */
export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<ReverseGeocodingResult> => {
  let errors = [];
  
  // Try all services and use the best result
  try {
    try {
      // Try OpenStreetMap first (primary source)
      const osmResult = await reverseGeocodeOpenStreetMap(latitude, longitude);
      return osmResult;
    } catch (error: any) {
      console.log("OpenStreetMap geocoding failed, trying fallbacks...");
      errors.push({ service: "OpenStreetMap", error });
      
      // Try parallel calls to both fallback services
      const [bigDataCloudPromise, geocodeXYZPromise] = [
        reverseGeocodeBigDataCloud(latitude, longitude).catch(e => ({ error: e })),
        reverseGeocodeXYZ(latitude, longitude).catch(e => ({ error: e }))
      ];
      
      const results = await Promise.all([bigDataCloudPromise, geocodeXYZPromise]);
      
      // Check which results succeeded
      const validResults = results.filter(r => !r.hasOwnProperty('error')) as ReverseGeocodingResult[];
      
      if (validResults.length > 0) {
        // If we have multiple valid results, prefer the one with more detailed data
        let bestResult = validResults[0];
        
        for (const result of validResults) {
          // Prefer results that have suburb information
          if (result.suburb !== "Unknown" && bestResult.suburb === "Unknown") {
            bestResult = result;
          }
        }
        
        return bestResult;
      }
      
      // If all fallbacks failed, throw comprehensive error
      throw new Error(`All geocoding services failed: ${errors.map(e => e.service).join(', ')}`);
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
      source: "None"
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
      source: "OpenStreetMap"
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
 * Search for locations by name with enhanced parameters for better coverage
 */
export const searchLocationByName = async (query: string): Promise<LocationSearchResult[]> => {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    // Enhanced search with better parameters
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
      `q=${encodeURIComponent(query)}&` +
      `format=json&addressdetails=1&limit=10&accept-language=en&` +
      `extratags=1&namedetails=1`,
      {
        headers: {
          "User-Agent": "GlobalNomadSafetyHub/1.0",
        },
        signal: AbortSignal.timeout(12000),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to search location: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Include all place types for broader coverage - don't filter out any places
    const results: LocationSearchResult[] = data.map((item: any) => {
      // Get more specific location info
      const displayParts = [];
      
      const city = item.address.city || 
                  item.address.town || 
                  item.address.village || 
                  item.address.municipality || 
                  "";
      
      if (city) displayParts.push(city);
      
      const state = item.address.state || 
                   item.address.county || 
                   item.address.region || 
                   "";
      
      if (state && !displayParts.includes(state)) displayParts.push(state);
      
      const country = item.address.country || "";
      if (country) displayParts.push(country);
      
      return {
        city: city || "Unknown",
        state: state || "Unknown",
        country: item.address.country || "Unknown",
        countryCode: item.address.country_code ? item.address.country_code.toUpperCase() : "Unknown",
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        displayName: item.display_name || displayParts.join(", "),
        placeType: item.type || "place"
      };
    });

    // Remove duplicates based on coordinates (more precise than names)
    const uniqueResults = results.filter((result, index, self) => 
      index === self.findIndex((r) => 
        Math.abs(r.latitude - result.latitude) < 0.00001 && 
        Math.abs(r.longitude - result.longitude) < 0.00001
      )
    );

    console.log("Search results:", uniqueResults);
    return uniqueResults;
  } catch (error) {
    console.error("Error searching for location:", error);
    
    // Try an alternative search API if OpenStreetMap fails
    try {
      return await searchLocationByNameFallback(query);
    } catch (fallbackError) {
      console.error("Fallback search also failed:", fallbackError);
      throw new Error("Failed to search for locations. Please try again later.");
    }
  }
};

/**
 * Fallback location search using alternative API
 */
export const searchLocationByNameFallback = async (query: string): Promise<LocationSearchResult[]> => {
  try {
    const response = await fetch(
      `https://geocode.xyz/${encodeURIComponent(query)}?json=1&auth=752648166254533445534x8187`,
      {
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!response.ok) {
      throw new Error(`Fallback search failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Handle error response
    if (data.error) {
      throw new Error(`Search error: ${data.error.message || 'Unknown error'}`);
    }
    
    // Handle single result vs multiple results
    if (data.latt && data.longt) {
      // Single result
      const result: LocationSearchResult = {
        city: data.city || data.standard?.city || "Unknown",
        state: data.region || data.standard?.region || "Unknown",
        country: data.country || data.standard?.country || "Unknown",
        countryCode: data.prov || "Unknown",
        latitude: parseFloat(data.latt),
        longitude: parseFloat(data.longt),
        displayName: data.standard?.addresst || query,
        placeType: "place"
      };
      
      return [result];
    } else if (data.results && Array.isArray(data.results)) {
      // Multiple results
      return data.results.map((item: any) => ({
        city: item.city || "Unknown",
        state: item.region || "Unknown",
        country: item.country || "Unknown",
        countryCode: item.prov || "Unknown",
        latitude: parseFloat(item.latitude || item.latt),
        longitude: parseFloat(item.longitude || item.longt),
        displayName: item.name || item.standard?.addresst || `${item.city}, ${item.country}`,
        placeType: "place"
      }));
    }
    
    return [];
  } catch (error) {
    console.error("Fallback search error:", error);
    throw error;
  }
};

/**
 * Get location data using IP address as fallback when GPS fails
 */
export const getIpLocationFallback = async (): Promise<LocationData> => {
  try {
    // Use ipinfo.io for IP-based geolocation
    const response = await fetch('https://ipinfo.io/json?token=6c59ed65be5cce', {
      signal: AbortSignal.timeout(8000),
    });
    
    if (!response.ok) {
      throw new Error(`IP location service failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Parse loc as "latitude,longitude"
    const [latitude, longitude] = data.loc.split(',').map(parseFloat);
    
    // Use best available location info
    const suburb = "Unknown";
    const city = data.city || "Unknown";
    const state = data.region || "Unknown";
    const country = data.country_name || "Unknown";
    const countryCode = data.country || "Unknown";
    
    // IP-based location is generally less accurate (hundreds of meters to kilometers)
    // We'll assign a reasonable accuracy estimate
    const accuracy = 1000; // 1km accuracy for IP-based location
    
    return {
      latitude,
      longitude,
      suburb,
      city,
      state,
      country,
      countryCode,
      accuracy,
      accuracyString: formatAccuracy(accuracy),
      source: "IP Address"
    };
  } catch (error) {
    console.error("Error getting IP location:", error);
    throw error;
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
      // Verify the cached data meets our accuracy standards
      if (cachedData.accuracy <= MAX_ACCEPTABLE_ACCURACY) {
        return cachedData;
      } else {
        console.log(`Cached location accuracy (${cachedData.accuracy}m) exceeds maximum acceptable (${MAX_ACCEPTABLE_ACCURACY}m), fetching fresh data...`);
        // Continue to fetch fresh data if cached data doesn't meet accuracy standards
      }
    }
    
    console.log("Fetching fresh location data...");
    
    try {
      // Get user's coordinates
      const position = await getCurrentPosition();
      const { latitude, longitude, accuracy } = position.coords;
      
      // If accuracy doesn't meet our requirements, throw an error
      if (accuracy > MAX_ACCEPTABLE_ACCURACY) {
        throw new Error(`Location accuracy of ${Math.round(accuracy)}m exceeds maximum acceptable (${MAX_ACCEPTABLE_ACCURACY}m). Please try again in a better location with clearer GPS signal.`);
      }
      
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
        accuracyString: formatAccuracy(accuracy),
        source: locationDetails.source
      };
      
      // Cache the location data
      cacheLocationData(locationData);
      
      return locationData;
    } catch (gpsError) {
      console.error("GPS location failed, trying IP fallback:", gpsError);
      
      // Check if the error is about accuracy - if so, pass it through
      if (gpsError instanceof Error && gpsError.message.includes("accuracy")) {
        throw gpsError;
      }
      
      // Fall back to IP-based location
      const ipLocation = await getIpLocationFallback();
      
      // Check if IP location meets accuracy requirements
      if (ipLocation.accuracy > MAX_ACCEPTABLE_ACCURACY) {
        throw new Error(`Unable to get sufficiently accurate location. IP-based location accuracy (${Math.round(ipLocation.accuracy)}m) exceeds maximum acceptable (${MAX_ACCEPTABLE_ACCURACY}m). Please enable GPS for better accuracy.`);
      }
      
      // Cache IP-based location (but with a shorter expiry)
      cacheLocationData(ipLocation, 5 * 60 * 1000); // 5 minutes
      
      return ipLocation;
    }
  } catch (error) {
    console.error("Error getting full location data:", error);
    throw error;
  }
};

/**
 * Cache location data to localStorage with expiry
 * @param expiryTime Override the default expiry time (in ms)
 */
const cacheLocationData = (data: LocationData, expiryTime = LOCATION_CACHE_EXPIRY): void => {
  try {
    const cacheEntry = {
      data,
      timestamp: Date.now(),
      expiryTime
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
    
    const { data, timestamp, expiryTime = LOCATION_CACHE_EXPIRY } = JSON.parse(cachedEntry);
    const now = Date.now();
    
    // Check if the cached data has expired
    if (now - timestamp > expiryTime) {
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
    // For manually selected locations, verify coordinates and look up more precise data
    if (searchResult.latitude === 0 && searchResult.longitude === 0) {
      throw new Error(`Invalid coordinates (0,0) for location: ${searchResult.displayName || searchResult.city}`);
    }
    
    // Check if this location has reasonable accuracy (manually selected locations are assumed accurate)
    // We set a specific accuracy value for manual searches that is well within our requirements
    const assignedAccuracy = 100; // 100m accuracy for manually selected locations
    
    // Use geocoding services to get more precise data for these coordinates
    let locationData: LocationData;
    
    try {
      // Try multiple geocoding services for higher accuracy
      // First try with OpenStreetMap
      let moreDetails: ReverseGeocodingResult;
      try {
        moreDetails = await reverseGeocode(searchResult.latitude, searchResult.longitude);
      } catch (osmError) {
        // If OSM fails, try BigDataCloud
        console.log("Primary geocoding failed, trying BigDataCloud...");
        moreDetails = await reverseGeocodeBigDataCloud(searchResult.latitude, searchResult.longitude);
      }
      
      // Create the location data with the more precise details
      locationData = {
        suburb: moreDetails.suburb !== "Unknown" ? moreDetails.suburb : searchResult.city,
        city: moreDetails.city !== "Unknown" ? moreDetails.city : searchResult.city,
        state: moreDetails.state !== "Unknown" ? moreDetails.state : searchResult.state,
        country: moreDetails.country !== "Unknown" ? moreDetails.country : searchResult.country,
        countryCode: moreDetails.countryCode !== "Unknown" ? moreDetails.countryCode : searchResult.countryCode,
        latitude: searchResult.latitude,
        longitude: searchResult.longitude,
        accuracy: assignedAccuracy, // Assign a standard high accuracy value for manual searches
        accuracyString: formatAccuracy(assignedAccuracy),
        source: `Manual Search (${moreDetails.source || "Search"})`
      };
    } catch (geocodingError) {
      // Use the search result as is if all reverse geocoding attempts fail
      console.log("All geocoding services failed, using search data directly");
      locationData = {
        suburb: searchResult.placeType === "suburb" ? searchResult.city : "Selected Location",
        city: searchResult.city,
        state: searchResult.state,
        country: searchResult.country,
        countryCode: searchResult.countryCode,
        latitude: searchResult.latitude,
        longitude: searchResult.longitude,
        accuracy: assignedAccuracy,
        accuracyString: formatAccuracy(assignedAccuracy),
        source: "Manual Search"
      };
    }
    
    // Verify minimum accuracy requirements
    if (assignedAccuracy > MAX_ACCEPTABLE_ACCURACY) {
      throw new Error(`Location accuracy cannot be guaranteed for "${locationData.city}, ${locationData.country}". Please try a more specific location.`);
    }
    
    // Cache this data
    cacheLocationData(locationData);
    
    return locationData;
  } catch (error) {
    console.error("Error processing manual location:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to process location data");
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