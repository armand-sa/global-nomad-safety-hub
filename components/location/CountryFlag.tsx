"use client";

import Image from "next/image";
import { useState } from "react";

type CountryFlagProps = {
  countryCode: string;
  countryName: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export default function CountryFlag({
  countryCode,
  countryName,
  size = "md",
  className = "",
}: CountryFlagProps) {
  const [hasError, setHasError] = useState(false);
  
  // Handle unknown country code
  if (countryCode === "Unknown") {
    return (
      <span 
        className={`text-xl ${className}`} 
        role="img" 
        aria-label="World Globe"
      >
        🌍
      </span>
    );
  }
  
  // Map size to dimensions
  const dimensions = {
    sm: { width: 20, height: 15 },
    md: { width: 24, height: 18 },
    lg: { width: 32, height: 24 },
  };
  
  const { width, height } = dimensions[size];
  
  // If flag image fails to load, fall back to emoji
  if (hasError) {
    // Create flag emoji from country code
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    
    const flagEmoji = String.fromCodePoint(...codePoints);
    
    return (
      <span 
        className={`text-xl ${className}`} 
        role="img" 
        aria-label={`Flag of ${countryName}`}
      >
        {flagEmoji}
      </span>
    );
  }
  
  // Use flag icons from flagcdn.com (free service with SVG flags)
  return (
    <div 
      className={`overflow-hidden rounded-sm ${className}`}
      style={{ width, height }}
    >
      <Image
        src={`https://flagcdn.com/w80/${countryCode.toLowerCase()}.png`}
        alt={`Flag of ${countryName}`}
        width={width}
        height={height}
        onError={() => setHasError(true)}
        className="object-cover w-full h-full"
        priority
      />
    </div>
  );
} 