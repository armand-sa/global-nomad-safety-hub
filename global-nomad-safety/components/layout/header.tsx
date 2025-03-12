"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield } from "lucide-react";
import { AuthButton } from "@/components/auth/AuthButton";

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
    <header className="bg-background sticky top-0 z-50 w-full border-b">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 text-xl font-bold">
            <span className="sr-only">Global Digital Nomad Safety Hub</span>
            Global Nomad Safety
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
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
              className={`text-sm font-semibold leading-6 ${
                pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              {item.name}
            </Link>
          ))}
          {/* Temporary Admin Link for Development */}
          <Link
            href="/admin"
            className="text-sm font-semibold leading-6 text-muted-foreground hover:text-primary flex items-center"
          >
            <Shield className="h-4 w-4 mr-1" />
            Admin
          </Link>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <ThemeToggle />
          <AuthButton />
        </div>
      </nav>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden" role="dialog" aria-modal="true">
          <div className="fixed inset-0 z-50 bg-background/80"></div>
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-border">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5 text-xl font-bold">
                <span className="sr-only">Global Digital Nomad Safety Hub</span>
                Global Nomad Safety
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-border">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 ${
                        pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-primary"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  {/* Temporary Admin Link for Development (Mobile) */}
                  <Link
                    href="/admin"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-muted-foreground hover:text-primary flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Shield className="h-5 w-5 mr-2" />
                    Admin Dashboard
                  </Link>
                </div>
                <div className="py-6 flex flex-col space-y-3">
                  <ThemeToggle />
                  <div onClick={() => setMobileMenuOpen(false)} className="w-full">
                    <Link href="/login" className="w-full">
                      <Button variant="outline" className="w-full">
                        Log in
                      </Button>
                    </Link>
                  </div>
                  <div onClick={() => setMobileMenuOpen(false)} className="w-full">
                    <Link href="/login?tab=register" className="w-full">
                      <Button className="w-full">
                        Sign up
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}