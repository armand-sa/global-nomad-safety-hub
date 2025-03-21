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
    
    // Set dark mode by default for all users
    if (typeof window !== 'undefined') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }, []);

  // Handle theme toggle
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <div className={cn(
        "w-9 h-9 rounded-md flex items-center justify-center bg-transparent transition-colors cursor-pointer",
        className
      )}>
        <div className="w-4 h-4 bg-muted-foreground/20 rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative w-9 h-9 rounded-md flex items-center justify-center",
        "bg-white/10 dark:bg-black/20 hover:bg-white/20 dark:hover:bg-black/30 transition-all duration-300",
        "backdrop-blur-md cursor-pointer",
        "shadow-sm border border-white/10 dark:border-white/5",
        className
      )}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 dark:from-white/5 dark:to-transparent pointer-events-none rounded-md"></div>
      
      {/* Sun icon - visible in dark mode */}
      <Sun 
        className={cn(
          "w-4 h-4 transition-all duration-300",
          theme === "dark" 
            ? "text-yellow-400 opacity-100" 
            : "opacity-0 absolute"
        )}
        strokeWidth={2.5}
      />
      
      {/* Moon icon - visible in light mode */}
      <Moon 
        className={cn(
          "w-4 h-4 transition-all duration-300",
          theme === "light" 
            ? "text-primary opacity-100" 
            : "opacity-0 absolute"
        )}
        strokeWidth={2.5}
      />
    </button>
  );
}