"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getCookie, setCookie } from '@/lib/cookies';

type CookiePreferences = {
  essential: boolean; // Always true, cannot be disabled
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
};

export default function CookieConsent() {
  const router = useRouter();
  const pathname = usePathname();
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
    personalization: false,
  });

  // Check if current page is a legal/policy page
  const isLegalPage = 
    pathname?.includes('/cookies') || 
    pathname?.includes('/privacy') || 
    pathname?.includes('/terms') || 
    pathname?.includes('/disclaimer') || 
    pathname?.includes('/acceptable-use');

  useEffect(() => {
    // Check if user has already made cookie choices
    const cookieConsent = getCookie('cookie-consent');
    if (!cookieConsent) {
      // If no consent is stored, show the banner
      setShowBanner(true);
    } else {
      try {
        // If consent exists, parse it
        const savedPreferences = JSON.parse(cookieConsent);
        setPreferences(savedPreferences);
      } catch (e) {
        // If parsing fails, show the banner again
        setShowBanner(true);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      personalization: true,
    };
    savePreferences(allAccepted);
  };

  const handleRejectAll = () => {
    const allRejected = {
      essential: true, // Essential cookies can't be rejected
      analytics: false,
      marketing: false,
      personalization: false,
    };
    savePreferences(allRejected);
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    // Save preferences as cookie
    setCookie('cookie-consent', JSON.stringify(prefs), 365); // Store for a year
    
    // Apply preferences
    if (prefs.analytics) {
      // Enable analytics cookies
      console.log('Analytics cookies enabled');
    }
    
    if (prefs.marketing) {
      // Enable marketing cookies
      console.log('Marketing cookies enabled');
    }
    
    if (prefs.personalization) {
      // Enable personalization cookies
      console.log('Personalization cookies enabled');
    }
    
    setPreferences(prefs);
    setShowBanner(false);
    setShowPreferences(false);
    
    // If we're on a legal page and the user accepts cookies, redirect to home
    if (isLegalPage) {
      // Small delay to ensure cookie is set before redirecting
      setTimeout(() => {
        router.push('/');
      }, 300);
    }
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'essential') return; // Essential cookies cannot be toggled
    
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!showBanner) {
    return (
      <button 
        onClick={() => setShowBanner(true)}
        className="fixed bottom-4 right-4 bg-primary/10 text-sm p-2 rounded-full shadow-md hover:bg-primary/20 z-50 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Cookie Settings"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    );
  }

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-card shadow-lg z-50 border-t border-border"
      role="dialog"
      aria-labelledby="cookie-consent-title"
    >
      <div className="container mx-auto p-4">
        {showPreferences ? (
          <div className="max-w-4xl mx-auto">
            <h3 id="cookie-consent-title" className="text-xl font-bold mb-4">Cookie Preferences</h3>
            
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h4 className="font-semibold">Essential Cookies</h4>
                    <p className="text-sm text-muted-foreground">Required for the website to function. Cannot be disabled.</p>
                  </div>
                  <div className="relative">
                    {/* Toggle Switch (always on and disabled) */}
                    <div className="w-11 h-6 bg-primary rounded-full transition-colors duration-200 pointer-events-none opacity-90">
                      <div className="absolute top-[2px] left-[2px] bg-white rounded-full w-5 h-5 transform translate-x-5 transition-transform duration-200"></div>
                    </div>
                    <span className="sr-only">Essential cookies are always enabled</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h4 className="font-semibold">Analytics Cookies</h4>
                    <p className="text-sm text-muted-foreground">Help us improve our website by collecting anonymous usage information.</p>
                  </div>
                  <div className="relative">
                    {/* Toggle Switch */}
                    <button 
                      onClick={() => togglePreference('analytics')}
                      className={`w-11 h-6 ${preferences.analytics ? 'bg-primary' : 'bg-neutral-300 dark:bg-neutral-600'} rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary`}
                      aria-checked="false"
                      data-state={preferences.analytics ? "checked" : "unchecked"}
                      role="switch"
                      aria-label="Toggle analytics cookies"
                    >
                      <span className={`absolute top-[2px] left-[2px] bg-white rounded-full w-5 h-5 transform transition-transform duration-200 ${preferences.analytics ? 'translate-x-5' : 'translate-x-0'}`}></span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h4 className="font-semibold">Marketing Cookies</h4>
                    <p className="text-sm text-muted-foreground">Used to track visitors across websites to display relevant advertisements.</p>
                  </div>
                  <div className="relative">
                    {/* Toggle Switch */}
                    <button 
                      onClick={() => togglePreference('marketing')}
                      className={`w-11 h-6 ${preferences.marketing ? 'bg-primary' : 'bg-neutral-300 dark:bg-neutral-600'} rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary`}
                      aria-checked="false"
                      data-state={preferences.marketing ? "checked" : "unchecked"}
                      role="switch"
                      aria-label="Toggle marketing cookies"
                    >
                      <span className={`absolute top-[2px] left-[2px] bg-white rounded-full w-5 h-5 transform transition-transform duration-200 ${preferences.marketing ? 'translate-x-5' : 'translate-x-0'}`}></span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h4 className="font-semibold">Personalization Cookies</h4>
                    <p className="text-sm text-muted-foreground">Remember your preferences to provide you with a personalized experience.</p>
                  </div>
                  <div className="relative">
                    {/* Toggle Switch */}
                    <button 
                      onClick={() => togglePreference('personalization')}
                      className={`w-11 h-6 ${preferences.personalization ? 'bg-primary' : 'bg-neutral-300 dark:bg-neutral-600'} rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary`}
                      aria-checked="false"
                      data-state={preferences.personalization ? "checked" : "unchecked"}
                      role="switch"
                      aria-label="Toggle personalization cookies"
                    >
                      <span className={`absolute top-[2px] left-[2px] bg-white rounded-full w-5 h-5 transform transition-transform duration-200 ${preferences.personalization ? 'translate-x-5' : 'translate-x-0'}`}></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-end">
              <button
                onClick={() => setShowPreferences(false)}
                className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                Back
              </button>
              <button
                onClick={handleRejectAll}
                className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                Reject All
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                Save Preferences
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 id="cookie-consent-title" className="text-lg font-bold mb-2">We Respect Your Privacy</h3>
              <p className="text-sm">
                We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. 
                Visit our <Link href="/cookies" className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary">Cookie Policy</Link> to learn more.
              </p>
              
              <div className="mt-2 text-sm">
                <p className="flex items-center">
                  <span className="mr-1">•</span>
                  <Link href="/privacy" className="text-primary hover:underline mr-3 focus:outline-none focus:ring-2 focus:ring-primary">
                    Privacy Policy
                  </Link>
                  <span className="mr-1">•</span>
                  <Link href="/terms" className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary">
                    Terms of Service
                  </Link>
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
              <button
                onClick={() => setShowPreferences(true)}
                className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                Customize Settings
              </button>
              <button
                onClick={handleRejectAll}
                className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                Reject All
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                Accept All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}