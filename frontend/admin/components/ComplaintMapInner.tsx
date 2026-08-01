import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Create custom icons for incidents based on priority
const createIncidentIcon = (priority: string) => {
  const getColors = () => {
    if (priority === "CRITICAL") return "bg-red-600 border-red-400";
    if (priority === "HIGH") return "bg-orange-500 border-orange-300";
    return "bg-blue-600 border-blue-400";
  };

  return L.divIcon({
    className: "custom-leaflet-icon",
    html: `<div class="flex items-center justify-center w-8 h-8 rounded-full shadow-lg border-2 ${getColors()} text-white text-sm">🚨</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Create custom icon for officers
const officerIcon = L.divIcon({
  className: "custom-leaflet-icon",
  html: `<div class="flex items-center justify-center w-6 h-6 bg-indigo-600 text-white border-2 border-indigo-400 rounded-full shadow-md text-[10px]">👷</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Component to handle recentering the map when a pin is selected programmatically
const RecenterMap = ({ lat, lng }: { lat: number, lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 14, { animate: true });
  }, [lat, lng, map]);
  return null;
};

interface ComplaintMapInnerProps {
  incidents: any[];
  officers: any[];
  selectedPin: any | null;
  setSelectedPin: (pin: any | null) => void;
  selectedLayer: string;
}

const ComplaintMapInner: React.FC<ComplaintMapInnerProps> = ({ 
  incidents, 
  officers, 
  selectedPin, 
  setSelectedPin,
  selectedLayer 
}) => {
  
  // Center on Bengaluru or the first incident
  const defaultCenter: [number, number] = [12.9716, 77.5946];
  
  return (
    <MapContainer 
      center={defaultCenter} 
      zoom={12} 
      style={{ height: '100%', width: '100%', backgroundColor: '#f8fafc' }} 
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {selectedPin && (
        <RecenterMap lat={selectedPin.latitude} lng={selectedPin.longitude} />
      )}

      {incidents.map((item) => (
        <Marker
          key={`incident-${item.id}`}
          position={[item.latitude, item.longitude]}
          icon={createIncidentIcon(item.priority)}
          eventHandlers={{
            click: () => setSelectedPin(item),
          }}
        />
      ))}

      {officers.map((off) => (
        <Marker
          key={`officer-${off.id}`}
          position={[off.latitude, off.longitude]}
          icon={officerIcon}
        />
      ))}
    </MapContainer>
  );
};

export default ComplaintMapInner;
