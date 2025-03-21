"use client";

import * as React from "react";
import { Moon, Sun, Stars } from "lucide-react";
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

  // Create a Stars icon component since it's not included in lucide-react
  const StarsIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <path d="M12 3a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Z" />
      <path d="M12 21a2 2 0 0 1 2 2H10a2 2 0 0 1 2-2Z" />
      <path d="M3 12a2 2 0 0 0-2-2v4a2 2 0 0 0 2-2Z" />
      <path d="M21 12a2 2 0 0 1 2-2v4a2 2 0 0 1-2-2Z" />
      <path d="m7.5 7.5-1-1" />
      <path d="m16.5 7.5 1-1" />
      <path d="m7.5 16.5-1 1" />
      <path d="m16.5 16.5 1 1" />
    </svg>
  );

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
        "bg-white/10 dark:bg-black/20 hover:bg-white/20 dark:hover:bg-black/30 transition-colors duration-300",
        "backdrop-blur-md group cursor-pointer overflow-hidden",
        "shadow-inner border border-white/10 dark:border-white/5",
        className
      )}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 dark:from-white/5 dark:to-transparent pointer-events-none"></div>
      
      {/* Sun icon - visible in dark mode */}
      <Sun 
        className={cn(
          "absolute w-5 h-5 transition-all duration-500 ease-spring",
          theme === "dark" 
            ? "text-yellow-300 opacity-100 rotate-0 scale-100" 
            : "text-yellow-300/0 opacity-0 rotate-90 scale-0"
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
      
      {/* Stars icon - partially visible in dark mode */}
      <div
        className={cn(
          "absolute transition-all duration-500 ease-spring",
          theme === "dark"
            ? "opacity-70 scale-150"
            : "opacity-0 scale-50"
        )}
      >
        <StarsIcon />
      </div>
      
      {/* Background effects */}
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-500",
          theme === "dark" 
            ? "opacity-0" 
            : "opacity-100"
        )}
      >
        <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-orange-300/40 rounded-full blur-sm" />
        <div className="absolute bottom-1 left-1 w-3 h-3 bg-yellow-300/30 rounded-full blur-sm" />
        <div 
          className="absolute inset-1 bg-gradient-to-br from-orange-100/10 to-yellow-200/5 rounded-full" 
          style={{
            background: "radial-gradient(circle, rgba(253,187,45,0.15) 0%, rgba(255,255,255,0) 70%)"
          }}
        />
      </div>
      
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-500",
          theme === "dark" 
            ? "opacity-100" 
            : "opacity-0"
        )}
      >
        <div className="absolute top-1 left-1 w-2 h-2 bg-blue-100/20 rounded-full blur-sm" />
        <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 bg-white/15 rounded-full blur-[1px]" />
        <div className="absolute top-2 right-2 w-1 h-1 bg-white/30 rounded-full" />
        <div className="absolute bottom-2 left-3 w-0.5 h-0.5 bg-white/30 rounded-full" />
        <div 
          className="absolute inset-1 bg-gradient-to-br from-blue-900/5 to-indigo-900/10 rounded-full" 
          style={{
            background: "radial-gradient(circle, rgba(30,64,175,0.05) 0%, rgba(0,0,0,0) 70%)"
          }}
        />
      </div>
      
      {/* Animated stars/sun rays */}
      <div 
        className={cn(
          "absolute inset-0 transition-transform duration-700 ease-spring",
          theme === "dark" 
            ? "scale-100 rotate-0 opacity-100" 
            : "scale-0 rotate-45 opacity-0"
        )}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={i}
            style={{ 
              transform: `rotate(${i * 45}deg)`, 
              transformOrigin: 'center',
              opacity: 0.3 + (i % 3) * 0.2
            }}
            className="absolute top-0 left-1/2 -translate-x-0.5 w-0.5 h-1 bg-white/30 rounded-full" 
          />
        ))}
      </div>
      
      {/* Sun rays effect for light mode */}
      <div 
        className={cn(
          "absolute inset-0 transition-transform duration-700 ease-spring",
          theme === "light" 
            ? "scale-100 rotate-0 opacity-100" 
            : "scale-0 rotate-45 opacity-0"
        )}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div 
            key={i}
            style={{ 
              transform: `rotate(${i * 60}deg)`, 
              transformOrigin: 'center',
              animation: 'pulse 3s infinite ease-in-out',
              animationDelay: `${i * 0.2}s`
            }}
            className="absolute top-0 left-1/2 -translate-x-0.5 h-4 w-0.5 bg-gradient-to-t from-transparent via-yellow-300/30 to-transparent rounded-full" 
          />
        ))}
      </div>
    </button>
  );
}