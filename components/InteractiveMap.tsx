'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Circle, Tooltip, useMap, AttributionControl } from 'react-leaflet';
import { LatLngTuple, Map as LeafletMap } from 'leaflet';
import { useTheme } from 'next-themes';
import 'leaflet/dist/leaflet.css';

// Add CSS for custom tooltips
import './map.css';

// Safety locations with their details
interface SafetyLocation {
  name: string;
  position: LatLngTuple;
  color: string;
  status: string;
  radius: number;
}

const safetyLocations: SafetyLocation[] = [
  {
    name: 'Chiang Mai',
    position: [18.7883, 98.9853],
    color: '#22c55e', // green
    status: 'Very Safe',
    radius: 5000
  },
  {
    name: 'Medellín',
    position: [6.2442, -75.5812],
    color: '#ef4444', // red
    status: 'Exercise Caution',
    radius: 5000
  },
  {
    name: 'Tbilisi',
    position: [41.7151, 44.8271],
    color: '#f97316', // orange
    status: 'Caution',
    radius: 5000
  }
];

// Zoom levels: higher number = closer view. Default (13) shows full safety circle.
const zoomLevels = [
  { value: 10, label: "Far" },
  { value: 12, label: "Medium" },
  { value: 13, label: "Circle Fit" }, // Default
  { value: 14, label: "Close" },
  { value: 16, label: "Street" }
];

// Component to control zoom level
function ZoomControl({ defaultZoom, theme }: { defaultZoom: number, theme: string | undefined }) {
  const [zoom, setZoom] = useState(defaultZoom);
  const map = useMap();

  // Update map zoom when dropdown changes
  const handleZoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newZoom = parseInt(e.target.value, 10);
    setZoom(newZoom);
    map.setZoom(newZoom);
  };

  return (
    <div className="absolute top-3 right-3 z-50 max-w-[140px] xs:max-w-none">
      <div className={`
        flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 
        ${theme === 'dark' ? 'bg-gray-800/90 text-gray-100' : 'bg-white/90 text-gray-800'} 
        rounded-xl shadow-lg backdrop-blur-sm
        border-[0.5px] ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
        text-xs sm:text-sm
      `}>
        <label htmlFor="zoom-select" className="font-medium whitespace-nowrap">Zoom:</label>
        <select 
          id="zoom-select"
          value={zoom}
          onChange={handleZoomChange}
          className={`
            rounded-lg px-1 sm:px-2 py-1 
            ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} 
            border text-xs sm:text-sm 
            focus:outline-none focus:ring-2 focus:ring-primary/50
            cursor-pointer hover:bg-opacity-90 transition-colors
            min-w-[70px] sm:min-w-[90px]
            touch-manipulation
          `}
        >
          {zoomLevels.map((level) => (
            <option key={level.value} value={level.value}>
              {level.value}{level.label ? ` - ${level.label}` : ''}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// Component to fit circle bounds
function FitCircleBounds() {
  const map = useMap();
  
  useEffect(() => {
    // Set zoom level to show the entire circle
    const chiangMaiPosition = [18.7883, 98.9853] as LatLngTuple;
    const radius = 5000; // meters
    
    // Create a circle and get its bounds
    import('leaflet').then((L) => {
      const circle = L.circle(chiangMaiPosition, radius);
      const bounds = circle.getBounds();
      
      // Fit the map to the circle bounds with padding
      map.fitBounds(bounds, {
        padding: [50, 50]
      });
    });
  }, [map]);
  
  return null;
}

const defaultCenter: LatLngTuple = [18.7883, 98.9853]; // Chiang Mai coordinates
const defaultZoom = 13; // Default zoom to show full safety circle

export default function InteractiveMap() {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const mapRef = useRef<LeafletMap | null>(null);

  // Only render component after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fix for Leaflet icons in Next.js
  useEffect(() => {
    if (isMounted) {
      // Only run on client side
      import('leaflet').then((L) => {
        // @ts-ignore - Leaflet's Icon has _getIconUrl but it's not in the type definitions
        delete L.Icon.Default.prototype._getIconUrl;
        
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });
      });
    }
  }, [isMounted]);

  // Get the appropriate tile layer URL based on theme
  const tileUrl = theme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  // Show loading state while component isn't mounted yet
  if (!isMounted) {
    return (
      <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-lg bg-muted/50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-primary/30 mb-4"></div>
          <div className="h-4 w-32 bg-primary/30 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-lg relative">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom={false}
        dragging={true}
        tap={true}
        className="w-full h-full"
        attributionControl={false} // Disable default attribution
        ref={(ref) => { if (ref) mapRef.current = ref; }}
      >
        <AttributionControl position="bottomright" prefix={false} />
        <TileLayer
          url={tileUrl}
          attribution='<a href="https://www.openstreetmap.org/copyright" class="map-attribution">© OSM</a> <a href="https://carto.com/attributions" class="map-attribution">© CARTO</a>'
          maxZoom={19}
        />
        <ZoomControl defaultZoom={defaultZoom} theme={theme} />
        <FitCircleBounds />
        {safetyLocations.map((location) => (
          <Circle
            key={location.name}
            center={location.position}
            pathOptions={{
              color: location.color,
              fillColor: location.color,
              fillOpacity: 0.2,
              weight: 2
            }}
            radius={location.radius}
          >
            <Tooltip 
              permanent
              direction="center"
              className="custom-tooltip"
              offset={[0, -20]}
            >
              <div className={`
                ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'} 
                font-semibold text-base md:text-sm 
                px-3 py-2 
                rounded-lg 
                shadow-lg 
                border-[0.5px] ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
                backdrop-blur-sm
                transition-colors duration-200
              `}>
                {location.name}
                <div className={`
                  text-sm md:text-xs font-normal 
                  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}
                `}>
                  {location.status}
                </div>
              </div>
            </Tooltip>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
}
