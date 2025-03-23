'use client';

import { MapContainer, TileLayer, Circle, Tooltip } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full"
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        {safetyLocations.map((location) => (
          <Circle
            key={location.name}
            center={location.position}
            pathOptions={{
              color: location.color,
              fillColor: location.color,
              fillOpacity: 0.2
            }}
            radius={location.radius}
          >
            <Tooltip permanent direction="center" offset={[0, 0]}>
              <div className="font-semibold">
                {location.name}
                <div className="text-sm font-normal">{location.status}</div>
              </div>
            </Tooltip>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
}
