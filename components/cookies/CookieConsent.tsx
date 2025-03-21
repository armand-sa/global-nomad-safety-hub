"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCookie, setCookie } from '@/lib/cookies';

type CookiePreferences = {
  essential: boolean; // Always true, cannot be disabled
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
};

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
    personalization: false,
  });

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
        className="fixed bottom-4 right-4 bg-gray-200 dark:bg-gray-800 text-sm p-2 rounded-full shadow-md hover:bg-gray-300 dark:hover:bg-gray-700 z-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Cookie Settings"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    );
  }

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-50 border-t border-gray-200 dark:border-gray-700"
      role="dialog"
      aria-labelledby="cookie-consent-title"
    >
      <div className="container mx-auto p-4">
        {showPreferences ? (
          <div className="max-w-4xl mx-auto">
            <h3 id="cookie-consent-title" className="text-xl font-bold mb-4">Cookie Preferences</h3>
            
            <div className="space-y-4 mb-6">
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
                <div className="flex justify-between items-center">
                  <label htmlFor="essential-checkbox" className="flex-1 cursor-not-allowed">
                    <h4 className="font-medium">Essential Cookies</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Required for the website to function. Cannot be disabled.</p>
                  </label>
                  <div className="relative">
                    <input 
                      id="essential-checkbox"
                      type="checkbox" 
                      checked={preferences.essential} 
                      disabled={true}
                      className="w-4 h-4 opacity-50 cursor-not-allowed" 
                      aria-describedby="essential-description"
                    />
                    <span id="essential-description" className="sr-only">Essential cookies are always enabled</span>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
                <div className="flex justify-between items-center">
                  <label htmlFor="analytics-checkbox" className="flex-1 cursor-pointer">
                    <h4 className="font-medium">Analytics Cookies</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400" id="analytics-description">Help us improve our website by collecting anonymous usage information.</p>
                  </label>
                  <div className="relative">
                    <input 
                      id="analytics-checkbox"
                      type="checkbox" 
                      checked={preferences.analytics} 
                      onChange={() => togglePreference('analytics')}
                      className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 focus:ring-2" 
                      aria-describedby="analytics-description"
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
                <div className="flex justify-between items-center">
                  <label htmlFor="marketing-checkbox" className="flex-1 cursor-pointer">
                    <h4 className="font-medium">Marketing Cookies</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400" id="marketing-description">Used to track visitors across websites to display relevant advertisements.</p>
                  </label>
                  <div className="relative">
                    <input 
                      id="marketing-checkbox"
                      type="checkbox" 
                      checked={preferences.marketing} 
                      onChange={() => togglePreference('marketing')}
                      className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 focus:ring-2" 
                      aria-describedby="marketing-description"
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
                <div className="flex justify-between items-center">
                  <label htmlFor="personalization-checkbox" className="flex-1 cursor-pointer">
                    <h4 className="font-medium">Personalization Cookies</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400" id="personalization-description">Remember your preferences to provide you with a personalized experience.</p>
                  </label>
                  <div className="relative">
                    <input 
                      id="personalization-checkbox"
                      type="checkbox" 
                      checked={preferences.personalization} 
                      onChange={() => togglePreference('personalization')}
                      className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 focus:ring-2" 
                      aria-describedby="personalization-description"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-end">
              <button
                onClick={() => setShowPreferences(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Back
              </button>
              <button
                onClick={handleRejectAll}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Reject All
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                Visit our <Link href="/cookies" className="text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500">Cookie Policy</Link> to learn more.
              </p>
              
              <div className="mt-2 text-sm">
                <p className="flex items-center">
                  <span className="mr-1">•</span>
                  <Link href="/privacy" className="text-blue-500 hover:underline mr-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Privacy Policy
                  </Link>
                  <span className="mr-1">•</span>
                  <Link href="/terms" className="text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Terms of Service
                  </Link>
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
              <button
                onClick={() => setShowPreferences(true)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Customize Settings
              </button>
              <button
                onClick={handleRejectAll}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Reject All
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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