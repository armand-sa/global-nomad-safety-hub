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
  
  // Map center and radius (Chiang Mai with 5km radius)
  const center = [18.7883, 98.9853]; // Chiang Mai coordinates
  const radius = 5000; // 5km in meters
  
  // Theme-based map tile URL
  const mapTileUrl = currentTheme === 'dark'
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  // Set mounted to true on client side
  useEffect(() => {
    setMounted(true);
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
    const closestZoomLevel = zoomLevels.reduce((prev, curr) => 
      Math.abs(curr.value - zoom) < Math.abs(prev.value - zoom) ? curr : prev
    );
    setSelectedZoom(closestZoomLevel);
  };

  // Handle zoom selector change
  const handleZoomSelectorChange = (zoom: typeof zoomLevels[0]) => {
    setSelectedZoom(zoom);
    if (mapRef.current) {
      mapRef.current.setView([center[0], center[1]], zoom.value);
    }
  };

  // Effect to apply the map ref when it's ready
  const setMapRef = (map: LeafletMapType) => {
    mapRef.current = map;
    
    // Initial fitting of map to properly show the circle
    map.setView([center[0], center[1]], selectedZoom.value);
  };

  if (!mounted) return null;

  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-center px-4">
        {/* Language Selector */}
        <div className="w-full sm:w-56">
          <Listbox value={selectedLanguage} onChange={setSelectedLanguage}>
            <div className="relative mt-1">
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
          <Listbox value={selectedZoom} onChange={handleZoomSelectorChange}>
            <div className="relative mt-1">
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
              key={currentTheme} // Re-render map when theme changes
              style={{ height: '100%', width: '100%' }}
              center={[center[0], center[1]]}
              zoom={selectedZoom.value}
              dragging={isDraggable}
              doubleClickZoom={false}
              attributionControl={false}
              zoomControl={false}
              whenReady={({ target }: { target: LeafletMapType }) => setMapRef(target)}
            >
              <TileLayer
                url={mapTileUrl}
              />
              
              <Circle 
                center={[center[0], center[1]]}
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
                    <p className="font-bold text-sm">Chiang Mai</p>
                    <p className="text-xs opacity-80">Very Safe</p>
                  </motion.div>
                </Tooltip>
              </Circle>
              
              {/* Map Events Handler */}
              <MapEvents map={mapRef.current} onZoomChange={handleZoomChange} />
              
              {/* Attribution (styled and animated) */}
              <div className={`absolute bottom-2 right-2 z-[1000] text-xs ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'} bg-background/60 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm`}>
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