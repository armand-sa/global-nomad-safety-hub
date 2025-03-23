"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield } from "lucide-react";
import { AuthButton } from "@/components/auth/AuthButton";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Safety Map", href: "/map" },
  { name: "Alerts", href: "/alerts" },
  { name: "Pricing", href: "/pricing" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-999 w-full backdrop-blur-lg backdrop-saturate-150 bg-background/50 border-b border-white/10 dark:border-white/5 shadow-md">
      {/* Glassmorphism background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none"></div>
      <div className="absolute inset-0 backdrop-filter backdrop-blur-md bg-opacity-30 pointer-events-none"></div>
      
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-6 relative" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
            <span className="sr-only">Global Digital Nomad Safety Hub</span>
            <span className="flex items-center gap-1.5">
              <Shield className="h-5 w-5 text-primary" />
              Global Nomad Safety
            </span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-muted-foreground hover:bg-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-semibold leading-6 relative group py-2",
                pathname === item.href 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.name}
              {pathname === item.href && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full transform transition-all duration-200"></span>
              )}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary/70 rounded-full group-hover:w-full transform transition-all duration-300"></span>
            </Link>
          ))}
          {/* Temporary Admin Link for Development */}
          <Link
            href="/login?redirectTo=/admin&auth=true"
            className="text-sm font-semibold leading-6 text-muted-foreground hover:text-foreground flex items-center transition-colors relative group py-2"
          >
            <Shield className="h-4 w-4 mr-1" />
            Admin
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary/70 rounded-full group-hover:w-full transform transition-all duration-300"></span>
          </Link>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <ThemeToggle />
          <AuthButton />
        </div>
      </nav>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-background/70 backdrop-blur-xl transition-opacity opacity-100"></div>
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background/90 backdrop-blur-xl px-6 py-6 sm:max-w-sm transform transition-transform duration-300 ease-out opacity-100 translate-x-0 sm:ring-1 sm:ring-white/10">
            <div className="flex items-center justify-between mb-4">
              <Link href="/" className="-m-1.5 p-1.5 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
                <span className="sr-only">Global Digital Nomad Safety Hub</span>
                <span className="flex items-center gap-1.5">
                  <Shield className="h-5 w-5 text-primary" />
                  Global Nomad Safety
                </span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-muted-foreground hover:bg-white/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            
            <div className="-my-6 divide-y divide-white/10">
              <div className="space-y-1.5 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 transition-colors",
                      pathname === item.href 
                        ? "text-primary bg-primary/10" 
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                {/* Temporary Admin Link for Development (Mobile) */}
                <Link
                  href="/login?redirectTo=/admin&auth=true"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-muted-foreground hover:text-foreground hover:bg-white/5 flex items-center transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Shield className="h-5 w-5 mr-2" />
                  Admin Dashboard
                </Link>
              </div>
              <div className="py-6 flex items-center justify-between">
                <ThemeToggle />
                <AuthButton />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}