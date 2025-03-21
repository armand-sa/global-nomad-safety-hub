"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  
  // Avoid hydration mismatch by only rendering after component has mounted
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Handle theme toggle
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center bg-transparent transition-colors cursor-pointer",
        className
      )}>
        <div className="w-5 h-5 bg-muted-foreground/20 rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative w-10 h-10 rounded-full flex items-center justify-center",
        "bg-primary/10 hover:bg-primary/20 transition-colors duration-300",
        "backdrop-blur-sm group cursor-pointer overflow-hidden",
        className
      )}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      {/* Sun icon - visible in dark mode */}
      <Sun 
        className={cn(
          "absolute w-5 h-5 transition-all duration-500 ease-spring",
          theme === "dark" 
            ? "text-primary opacity-100 rotate-0 scale-100" 
            : "text-primary/0 opacity-0 rotate-90 scale-0"
        )}
      />
      
      {/* Moon icon - visible in light mode */}
      <Moon 
        className={cn(
          "absolute w-5 h-5 transition-all duration-500 ease-spring",
          theme === "light" 
            ? "text-primary opacity-100 rotate-0 scale-100" 
            : "text-primary/0 opacity-0 -rotate-90 scale-0"
        )}
      />
      
      {/* Background effects */}
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-500",
          theme === "dark" 
            ? "opacity-0" 
            : "opacity-100 dark:opacity-0"
        )}
      >
        <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-orange-300/40 rounded-full blur-sm" />
        <div className="absolute bottom-1 left-1 w-3 h-3 bg-primary/30 rounded-full blur-sm" />
      </div>
      
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-500",
          theme === "dark" 
            ? "opacity-100" 
            : "opacity-0"
        )}
      >
        <div className="absolute top-1 left-1 w-3 h-3 bg-white/20 rounded-full blur-sm" />
        <div className="absolute bottom-0.5 right-0.5 w-2 h-2 bg-white/10 rounded-full blur-sm" />
      </div>
      
      {/* Animated stars/sun rays */}
      <div 
        className={cn(
          "absolute inset-0 transition-transform duration-700 ease-spring",
          theme === "dark" 
            ? "scale-100 rotate-0" 
            : "scale-0 rotate-45"
        )}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div 
            key={i}
            style={{ 
              transform: `rotate(${i * 60}deg)`, 
              transformOrigin: 'center' 
            }}
            className="absolute top-0 left-1/2 -translate-x-0.5 w-1 h-1 bg-white/30 rounded-full" 
          />
        ))}
      </div>
    </button>
  );
}