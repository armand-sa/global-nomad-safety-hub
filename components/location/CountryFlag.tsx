"use client";

import Image from "next/image";
import { useState } from "react";

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

  // Handle unknown country codes or errors by showing a globe emoji
  if (countryCode === "Unknown" || hasError) {
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
    // Convert ISO 3166-1 alpha-2 country code to regional indicator symbols
    const codePoints = Array.from(code.toUpperCase())
      .map(char => 127397 + char.charCodeAt(0))
      .map(codePoint => String.fromCodePoint(codePoint))
      .join("");
    
    return codePoints;
  };

  // Use flagcdn.com for high-quality SVG flags
  const flagUrl = `https://flagcdn.com/w${width * 2}/${countryCode.toLowerCase()}.png`;

  return (
    <div 
      className={`relative overflow-hidden shadow-md border border-black/10 dark:border-white/5 ${className}`}
      style={{ 
        width, 
        height,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)"
      }}
    >
      <Image
        src={flagUrl}
        alt={`Flag of ${countryName}`}
        width={width}
        height={height}
        onError={() => setHasError(true)}
        className="object-cover"
        style={{ 
          objectFit: "cover", 
          width: "100%", 
          height: "100%" 
        }}
      />
    </div>
  );
}