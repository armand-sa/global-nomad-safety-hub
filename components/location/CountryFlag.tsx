"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

type FlagSize = "xs" | "sm" | "md" | "lg" | "xl";

interface CountryFlagProps {
  countryCode: string;
  countryName: string;
  size?: FlagSize;
  className?: string;
}

export default function CountryFlag({
  countryCode,
  countryName,
  size = "md",
  className = "",
}: CountryFlagProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Reset error state if country code changes
  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
  }, [countryCode]);

  // Handle unknown country codes or errors by showing a globe emoji
  if (countryCode === "Unknown" || countryCode.length !== 2) {
    return <span className={`text-2xl ${className}`}>🌎</span>;
  }

  // Map size prop to dimensions
  const sizeMap: Record<FlagSize, { width: number; height: number }> = {
    xs: { width: 16, height: 12 },
    sm: { width: 24, height: 18 },
    md: { width: 32, height: 24 },
    lg: { width: 48, height: 36 },
    xl: { width: 64, height: 48 },
  };

  const { width, height } = sizeMap[size];

  // Create a flag emoji fallback from the country code (for when the image fails)
  const getFlagEmoji = (code: string) => {
    try {
      // Convert ISO 3166-1 alpha-2 country code to regional indicator symbols
      const codePoints = Array.from(code.toUpperCase())
        .map(char => 127397 + char.charCodeAt(0))
        .map(codePoint => String.fromCodePoint(codePoint))
        .join("");
      
      return codePoints;
    } catch (error) {
      console.error("Error creating flag emoji:", error);
      return "🌎";
    }
  };

  // Use flagcdn.com for high-quality SVG flags (primary source)
  const flagUrl = `https://flagcdn.com/w${width * 2}/${countryCode.toLowerCase()}.png`;
  
  // Fallback flag URL in case primary source fails
  const fallbackFlagUrl = `https://flagpedia.net/data/flags/w${width * 2}/${countryCode.toLowerCase()}.png`;

  return (
    <div 
      className={`relative overflow-hidden shadow-md border border-black/10 dark:border-white/5 rounded-sm ${className}`}
      style={{ 
        width, 
        height,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)"
      }}
    >
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
          {size === "lg" || size === "xl" ? (
            <span className="relative text-[8px] text-gray-500 dark:text-gray-400 font-medium z-10">Loading</span>
          ) : null}
        </div>
      )}
      
      {/* Primary flag image */}
      <Image
        src={flagUrl}
        alt={`Flag of ${countryName}`}
        width={width}
        height={height}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        onLoad={() => setIsLoading(false)}
        className="object-cover"
        style={{ 
          objectFit: "cover", 
          width: "100%", 
          height: "100%",
          display: hasError ? "none" : "block" 
        }}
        priority
      />
      
      {/* Fallback flag image (only shown if primary fails) */}
      {hasError && (
        <Image
          src={fallbackFlagUrl}
          alt={`Flag of ${countryName}`}
          width={width}
          height={height}
          onError={() => {
            // If both sources fail, we'll render the emoji in the next render
            setHasError(true);
            setIsLoading(false);
          }}
          onLoad={() => {
            // If fallback loads successfully, we're no longer in error state
            setIsLoading(false);
            setHasError(false);
          }}
          className="object-cover"
          style={{ 
            objectFit: "cover", 
            width: "100%", 
            height: "100%" 
          }}
        />
      )}
      
      {/* Emoji fallback (only shown if both image sources fail) */}
      {hasError && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800"
          style={{ fontSize: width * 0.6 }}
        >
          {getFlagEmoji(countryCode)}
        </div>
      )}
    </div>
  );
}