"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { Listbox } from "@headlessui/react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import type { Map as LeafletMapType } from "leaflet";
import 'leaflet/dist/leaflet.css';

// Dynamically import Leaflet components with no SSR
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import("react-leaflet").then((mod) => mod.Tooltip),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const ZoomControl = dynamic(
  () => import("react-leaflet").then((mod) => mod.ZoomControl),
  { ssr: false }
);

// Fix Leaflet default icon issue in Next.js
if (typeof window !== 'undefined') {
  // Only run on client side
  import('leaflet').then((L) => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  });
}

// Custom hook to get the current theme
const useCurrentTheme = () => {
  const { resolvedTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    setCurrentTheme((resolvedTheme as 'light' | 'dark') || 'light');
  }, [resolvedTheme]);
  
  return currentTheme;
};

// Function to fit map bounds to circle with padding
const fitMapToCircle = (map: LeafletMapType, center: [number, number], radius: number) => {
  // Convert radius from meters to degrees (approximate)
  const radiusInDegrees = radius / 111000; // 1 degree is roughly 111km

  // Create bounds with padding - adjusted for better mobile viewing
  const bounds = [
    [center[0] - radiusInDegrees * 1.8, center[1] - radiusInDegrees * 1.8],
    [center[0] + radiusInDegrees * 1.8, center[1] + radiusInDegrees * 1.8]
  ];
  
  // Fit the map to these bounds with animation
  map.fitBounds(bounds as any, {
    animate: true,
    duration: 1.0,
    padding: [30, 30] // Add padding in pixels
  });
};

// Language options
const languages = [
  { name: "English", code: "en" },
  { name: "Français", code: "fr" },
  { name: "Español", code: "es" },
  { name: "Deutsch", code: "de" },
  { name: "Italiano", code: "it" },
  { name: "Nederlands", code: "nl" },
  { name: "Português", code: "pt" },
  { name: "Polski", code: "pl" },
  { name: "Svenska", code: "sv" },
  { name: "Norsk", code: "no" },
  { name: "Dansk", code: "da" },
  { name: "Suomi", code: "fi" },
  { name: "Čeština", code: "cs" },
  { name: "Magyar", code: "hu" },
];

// Translations for the tooltip text
const translations = {
  en: { city: "Chiang Mai", safety: "Very Safe" },
  fr: { city: "Chiang Mai", safety: "Très Sûr" },
  es: { city: "Chiang Mai", safety: "Muy Seguro" },
  de: { city: "Chiang Mai", safety: "Sehr Sicher" },
  it: { city: "Chiang Mai", safety: "Molto Sicuro" },
  nl: { city: "Chiang Mai", safety: "Zeer Veilig" },
  pt: { city: "Chiang Mai", safety: "Muito Seguro" },
  pl: { city: "Chiang Mai", safety: "Bardzo Bezpieczne" },
  sv: { city: "Chiang Mai", safety: "Mycket Säkert" },
  no: { city: "Chiang Mai", safety: "Veldig Trygt" },
  da: { city: "Chiang Mai", safety: "Meget Sikkert" },
  fi: { city: "Chiang Mai", safety: "Erittäin Turvallinen" },
  cs: { city: "Chiang Mai", safety: "Velmi Bezpečné" },
  hu: { city: "Chiang Mai", safety: "Nagyon Biztonságos" },
};

// Zoom level options
const zoomLevels = [
  { name: "10 - Far", value: 10 },
  { name: "12 - Medium", value: 12 },
  { name: "13 - Circle Fit", value: 13 },
  { name: "14 - Close", value: 14 },
  { name: "16 - Street", value: 16 },
];

// MapEvents component to handle map events
const MapEvents = ({ map, onZoomChange }: { map: LeafletMapType | null, onZoomChange: (zoom: number) => void }) => {
  useEffect(() => {
    if (!map) return;
    
    const handleZoom = () => {
      const currentZoom = map.getZoom();
      onZoomChange(currentZoom);
    };
    
    map.on('zoom', handleZoom);
    
    return () => {
      map.off('zoom', handleZoom);
    };
  }, [map, onZoomChange]);
  
  return null;
};

const InteractiveMap = () => {
  const [mounted, setMounted] = useState(false);
  const currentTheme = useCurrentTheme();
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [selectedZoom, setSelectedZoom] = useState(zoomLevels[2]);
  const [isDraggable, setIsDraggable] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const mapRef = useRef<LeafletMapType | null>(null);
  const [windowWidth, setWindowWidth] = useState<number | undefined>(undefined);
  const [mapIsReady, setMapIsReady] = useState(false);
  
  // Map center and radius (Chiang Mai with 5km radius)
  const center: [number, number] = [18.7883, 98.9853]; // Chiang Mai coordinates
  const radius = 5000; // 5km in meters
  
  // Theme-based map tile URL
  const mapTileUrl = currentTheme === 'dark'
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  // Set mounted to true on client side and track window width
  useEffect(() => {
    setMounted(true);
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    // Set initial width
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter languages based on search query
  const filteredLanguages = searchQuery
    ? languages.filter(lang => 
        lang.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        lang.code.toLowerCase().includes(searchQuery.toLowerCase()))
    : languages;

  // Handle mobile double-tap to enable/disable dragging
  const handleMapDoubleClick = () => {
    setIsDraggable(!isDraggable);
  };

  // Handle map zoom change (from zoom control or programmatically)
  const handleZoomChange = (zoom: number) => {
    // Only update if the difference is significant to avoid flickering
    if (Math.abs(zoom - selectedZoom.value) >= 0.5) {
      const closestZoomLevel = zoomLevels.reduce((prev, curr) => 
        Math.abs(curr.value - zoom) < Math.abs(prev.value - zoom) ? curr : prev
      );
      setSelectedZoom(closestZoomLevel);
    }
  };

  // Handle zoom selector change
  const handleZoomSelectorChange = (zoom: typeof zoomLevels[0]) => {
    setSelectedZoom(zoom);
    if (mapRef.current) {
      if (zoom.value === 13) {
        // Special case for "Circle Fit"
        fitMapToCircle(mapRef.current, center, radius);
      } else if (zoom.value === 12) {
        // Medium zoom needs more specific handling
        mapRef.current.setView([center[0], center[1]], zoom.value, {
          animate: true,
          duration: 1.0
        });
      } else {
        mapRef.current.setView([center[0], center[1]], zoom.value, {
          animate: true,
          duration: 0.8
        });
      }
    }
  };

  // Handle language change
  const handleLanguageChange = (language: typeof languages[0]) => {
    setSelectedLanguage(language);
  };

  // Handle map ready event
  const handleMapReady = (event: any) => {
    setMapRef(event.target);
    setMapIsReady(true);
  };

  // Effect to apply the map ref when it's ready
  const setMapRef = (map: LeafletMapType) => {
    mapRef.current = map;
    
    // Initial fitting of map to properly show the circle
    if (selectedZoom.value === 13) {
      fitMapToCircle(map, center, radius);
    } else if (selectedZoom.value === 12) {
      // Medium zoom needs special handling
      map.setView([center[0], center[1]], selectedZoom.value, {
        animate: true,
        duration: 1.0
      });
    } else {
      map.setView([center[0], center[1]], selectedZoom.value, {
        animate: true,
        duration: 0.8
      });
    }
  };

  // Effect to apply zoom changes when selected zoom changes
  useEffect(() => {
    if (mapRef.current && mapIsReady) {
      if (selectedZoom.value === 13) {
        fitMapToCircle(mapRef.current, center, radius);
      } else if (selectedZoom.value === 12) {
        mapRef.current.setView([center[0], center[1]], selectedZoom.value, {
          animate: true,
          duration: 1.0
        });
      } else {
        mapRef.current.setView([center[0], center[1]], selectedZoom.value, {
          animate: true,
          duration: 0.8
        });
      }
    }
  }, [selectedZoom.value, mapIsReady]);

  // Get current translation based on selected language
  const currentTranslation = translations[selectedLanguage.code as keyof typeof translations] || translations.en;

  if (!mounted) return null;

  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-2 sm:px-4 mb-2">
        {/* Language Selector */}
        <div className="w-full sm:w-56">
          <label className="block text-sm font-medium mb-1.5 text-muted-foreground pl-3">
            Display Language
          </label>
          <Listbox value={selectedLanguage} onChange={handleLanguageChange}>
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-background border border-border/30 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/75 sm:text-sm transition-all hover:shadow-lg">
                <span className="block truncate">{selectedLanguage.name}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronsUpDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <AnimatePresence>
                <Listbox.Options as={motion.ul} 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-[1000] mt-1 max-h-60 w-full overflow-auto rounded-md bg-background border border-border/30 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                >
                  <div className="px-3 py-2">
                    <input
                      type="text"
                      className="w-full p-2 text-sm border border-border/30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/75"
                      placeholder="Search language..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  {filteredLanguages.map((language) => (
                    <Listbox.Option
                      key={language.code}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-primary/10 text-primary' : 'text-foreground'
                        }`
                      }
                      value={language}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? 'font-medium' : 'font-normal'
                            }`}
                          >
                            {language.name}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </AnimatePresence>
            </div>
          </Listbox>
        </div>

        {/* Zoom Level Selector */}
        <div className="w-full sm:w-56">
          <label className="block text-sm font-medium mb-1.5 text-muted-foreground pl-3">
            Zoom Level
          </label>
          <Listbox value={selectedZoom} onChange={handleZoomSelectorChange}>
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-background border border-border/30 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/75 sm:text-sm transition-all hover:shadow-lg">
                <span className="block truncate">{selectedZoom.name}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronsUpDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <AnimatePresence>
                <Listbox.Options as={motion.ul}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-[1000] mt-1 max-h-60 w-full overflow-auto rounded-md bg-background border border-border/30 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                >
                  {zoomLevels.map((zoom) => (
                    <Listbox.Option
                      key={zoom.value}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-primary/10 text-primary' : 'text-foreground'
                        }`
                      }
                      value={zoom}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? 'font-medium' : 'font-normal'
                            }`}
                          >
                            {zoom.name}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </AnimatePresence>
            </div>
          </Listbox>
        </div>
      </div>
      
      {/* Map Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full aspect-[16/9] rounded-xl overflow-hidden shadow-lg"
        onDoubleClick={handleMapDoubleClick}
      >
        {mounted && (
          <div className="h-full w-full relative">
            <MapContainer 
              key={`${currentTheme}-${windowWidth}-${selectedLanguage.code}-${selectedZoom.value}`} // Re-render map when theme, width, language or zoom changes
              style={{ height: '100%', width: '100%' }}
              center={center}
              zoom={selectedZoom.value}
              dragging={isDraggable}
              doubleClickZoom={false}
              attributionControl={false}
              zoomControl={false}
              // @ts-ignore - TypeScript doesn't have correct typings for react-leaflet
              whenReady={handleMapReady}
            >
              <TileLayer
                url={mapTileUrl}
              />
              
              <Circle 
                center={center}
                pathOptions={{ 
                  color: '#10b981', 
                  fillColor: '#10b981', 
                  fillOpacity: 0.2,
                  weight: 2,
                }}
                radius={radius}
              >
                <Tooltip 
                  permanent={true}
                  className={`bg-background/80 backdrop-blur-sm border-0 rounded-xl shadow-lg text-center px-3 py-2 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-800'}`}
                >
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  >
                    <p className="font-bold text-sm">{currentTranslation.city}</p>
                    <p className="text-xs opacity-80">{currentTranslation.safety}</p>
                  </motion.div>
                </Tooltip>
              </Circle>
              
              {/* Map Events Handler */}
              <MapEvents map={mapRef.current} onZoomChange={handleZoomChange} />
              
              {/* Attribution (styled and animated) */}
              <div className="absolute bottom-2 right-2 z-[400] text-xs text-gray-500 dark:text-gray-400 bg-background/70 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
                © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="hover:text-primary">OpenStreetMap</a> contributors | 
                © <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer" className="hover:text-primary">CARTO</a>
              </div>
            </MapContainer>
          </div>
        )}
      </motion.div>
      
      {/* Mobile gesture instructions */}
      <div className="text-center text-sm text-muted-foreground">
        <p>Double-tap to {isDraggable ? 'disable' : 'enable'} map dragging</p>
      </div>
    </div>
  );
};

export default InteractiveMap; 