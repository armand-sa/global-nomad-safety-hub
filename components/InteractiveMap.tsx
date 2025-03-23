'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Tooltip } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
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

const defaultCenter: LatLngTuple = [18.7883, 98.9853]; // Chiang Mai coordinates

export default function InteractiveMap() {
  const { theme } = useTheme();

  // Fix for Leaflet icons in Next.js
  useEffect(() => {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    // @ts-ignore
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });
  }, []);

  // Get the appropriate tile layer URL based on theme
  const tileUrl = theme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={defaultCenter}
        zoom={14}
        scrollWheelZoom={false}
        dragging={true}
        tap={true}
        className="w-full h-full"
      >
        <TileLayer
          url={tileUrl}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={19}
        />
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
              <div className="bg-white text-gray-800 font-semibold text-base md:text-sm px-3 py-2 rounded-lg shadow-md border border-gray-200">
                {location.name}
                <div className="text-sm md:text-xs font-normal">{location.status}</div>
              </div>
            </Tooltip>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
}
