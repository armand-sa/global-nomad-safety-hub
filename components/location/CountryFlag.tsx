"use client";

import React, { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

// Map country codes to regions for region flags
const REGION_FLAGS: Record<string, string> = {
  "EU": "🇪🇺", // European Union
  "UN": "🇺🇳", // United Nations
  "PRIDE": "🏳️‍🌈", // Pride flag
  "PIRATE": "🏴‍☠️", // Pirate flag
  "TRANSGENDER": "🏳️‍⚧️", // Transgender flag
  "RAINBOW": "🏳️‍🌈", // Rainbow flag
};

// More reliable CDN flag sources
const FLAG_SOURCES = [
  // Primary: CountryFlags API
  (code: string) => `https://flagcdn.com/w160/${code.toLowerCase()}.png`,
  // Secondary: Flagsapi
  (code: string) => `https://flagsapi.com/${code.toUpperCase()}/flat/64.png`,
  // Tertiary: WorldFlags API
  (code: string) => `https://flagpedia.net/data/flags/h60/${code.toLowerCase()}.png`,
  // Quaternary: Flagpedia
  (code: string) => `https://flagpedia.net/data/flags/normal/${code.toLowerCase()}.png`,
];

interface CountryFlagProps {
  countryCode: string;
  countryName?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showBorder?: boolean;
}

export default function CountryFlag({
  countryCode,
  countryName = "",
  size = "md",
  className = "",
  showBorder = true,
}: CountryFlagProps) {
  const [loading, setLoading] = useState(true);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [flagError, setFlagError] = useState(false);
  const [normalizedCode, setNormalizedCode] = useState("");

  // Normalize and validate the country code on mount and when it changes
  useEffect(() => {
    if (!countryCode || countryCode === "Unknown" || countryCode === "??") {
      setNormalizedCode("");
      return;
    }

    // Reset state when country code changes
    setLoading(true);
    setFlagError(false);
    setCurrentSourceIndex(0);
    
    // Handle UK vs GB special case
    if (countryCode.toUpperCase() === "UK") {
      setNormalizedCode("GB");
    } else {
      // For all other codes, ensure uppercase for consistency
      setNormalizedCode(countryCode.toUpperCase());
    }
  }, [countryCode]);

  // Try next source when current one fails
  const tryNextSource = () => {
    if (currentSourceIndex < FLAG_SOURCES.length - 1) {
      setCurrentSourceIndex(prev => prev + 1);
    } else {
      // All sources failed, show emoji
      setFlagError(true);
      setLoading(false);
    }
  };

  // Map size to dimensions
  function getSizeClass(size: string) {
    switch (size) {
      case "sm":
        return { 
          container: "w-6 h-4.5", 
          img: "w-6 h-4.5", 
          icon: "w-4 h-4", 
          emoji: "text-lg" 
        };
      case "md":
        return { 
          container: "w-8 h-6", 
          img: "w-8 h-6", 
          icon: "w-5 h-5", 
          emoji: "text-2xl" 
        };
      case "lg":
        return { 
          container: "w-12 h-9", 
          img: "w-12 h-9", 
          icon: "w-7 h-7", 
          emoji: "text-3xl" 
        };
      case "xl":
        return { 
          container: "w-16 h-12", 
          img: "w-16 h-12", 
          icon: "w-9 h-9", 
          emoji: "text-4xl" 
        };
      default:
        return { 
          container: "w-8 h-6", 
          img: "w-8 h-6", 
          icon: "w-5 h-5", 
          emoji: "text-2xl" 
        };
    }
  }

  // Generate flag emoji from country code (as a fallback)
  function getFlagEmoji(countryCode: string) {
    try {
      // Handle special case for UK which is GB in ISO 3166-1
      if (countryCode.toUpperCase() === "UK") {
        countryCode = "GB";
      }
      
      // Convert to regional indicator symbols
      const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
      
      return String.fromCodePoint(...codePoints);
    } catch (error) {
      console.error("Error generating flag emoji:", error);
      return "🏳️";
    }
  }

  // Preload next flag source image
  useEffect(() => {
    if (!normalizedCode || normalizedCode in REGION_FLAGS) return;
    
    // Preload the next flag source if available
    if (currentSourceIndex < FLAG_SOURCES.length - 1) {
      const nextSourceIndex = currentSourceIndex + 1;
      const nextSrc = FLAG_SOURCES[nextSourceIndex](normalizedCode);
      const preloadImg = new Image();
      preloadImg.src = nextSrc;
    }
  }, [normalizedCode, currentSourceIndex]);

  // If code is invalid or unknown, show globe
  if (!normalizedCode) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-muted",
        getSizeClass(size).container,
        showBorder && "border border-white/10 dark:border-white/5",
        className
      )}>
        <Globe className={cn("text-muted-foreground", getSizeClass(size).icon)} />
      </div>
    );
  }
  
  // Handle special region flags
  if (normalizedCode in REGION_FLAGS) {
    return (
      <div className={cn(
        "flex items-center justify-center",
        getSizeClass(size).container,
        showBorder && "border border-white/10 dark:border-white/5",
        className
      )}>
        <span className={cn("leading-none", getSizeClass(size).emoji)}>{REGION_FLAGS[normalizedCode]}</span>
      </div>
    );
  }

  // Get current flag source URL
  const currentFlagUrl = FLAG_SOURCES[currentSourceIndex](normalizedCode);
  
  return (
    <div 
      className={cn(
        "relative overflow-hidden bg-background",
        getSizeClass(size).container,
        showBorder && "border border-white/10 dark:border-white/5",
        className
      )}
    >
      {/* Loading indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-[1px]">
          <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Flag image */}
      {!flagError && (
        <img
          src={currentFlagUrl}
          alt={countryName || `Flag of ${normalizedCode}`}
          className={cn(
            "object-cover object-center w-full h-full",
            getSizeClass(size).img,
            loading ? "opacity-0" : "opacity-100",
            "transition-opacity duration-300"
          )}
          onLoad={() => setLoading(false)}
          onError={() => tryNextSource()}
          style={{
            // Ensure proper aspect ratio and no blue highlighting
            aspectRatio: "4/3",
            backgroundColor: "transparent",
            borderRadius: 0 // Ensure no rounded corners on the flag
          }}
        />
      )}
      
      {/* Emoji fallback if all image sources fail */}
      {flagError && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <span className={cn("leading-none", getSizeClass(size).emoji)}>
            {getFlagEmoji(normalizedCode)}
          </span>
        </div>
      )}
    </div>
  );
}