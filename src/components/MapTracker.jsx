import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api';

// Map container sizing
const containerStyle = {
  width: '100%',
  height: '100%'
};

// Clean, dark, high-contrast map style focusing on streets (Premium UI for Safety)
const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ visibility: "off" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
  ]
};

/**
 * PRODUCTION-READY MAP INTEGRATION
 * How to integrate with Backend (Directions for Hackathon):
 * 
 * 1. Install socket.io-client: `npm install socket.io-client`
 * 2. In the useEffect below where `setPosition` is called, add:
 *    ```javascript
 *      socket.emit('location_update', { lat: lat, lng: lng, userId: 'user123' });
 *    ```
 * 3. On your NodeJS Backend:
 *    ```javascript
 *      io.on('connection', (socket) => {
 *        socket.on('location_update', (data) => {
 *          // Save to MongoDB here: db.locations.insert({...})
 *          // Forward to Guardians: socket.broadcast.to(data.userId + '_guardians').emit('guardian_update', data);
 *        });
 *      });
 *    ```
 */
export default function MapTracker({ sosActive = false }) {
  // Requires API Key to be configured in .env as VITE_GOOGLE_MAPS_KEY
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY || "YOUR_FALLBACK_API_KEY",
  });

  const [map, setMap] = useState(null);
  const [position, setPosition] = useState(null); // Will hold {lat, lng}

  const onLoad = useCallback(function callback(mapInstance) {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  // HTML5 Geolocation API Integration for Real-Time Tracking
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ lat: latitude, lng: longitude });
        
        // Optionally auto-pan map to new position if user is moving
        if (map) {
           map.panTo({ lat: latitude, lng: longitude });
        }
      },
      (error) => {
        console.error("Error watching location:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [map]);

  if (!isLoaded) return <div className="w-full h-full flex items-center justify-center text-white bg-[#242f3e]">Loading Secure Map...</div>;

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position || { lat: 28.6139, lng: 77.2090 }} // Fallback to Delhi if no location
        zoom={16}
        options={mapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* Child components, such as markers, info windows, etc. */}
        {position && (
          <>
            {/* User Location Marker */}
            <Marker 
               position={position}
               icon={{
                 path: window.google.maps.SymbolPath.CIRCLE,
                 scale: 8,
                 fillColor: "#4285F4",
                 fillOpacity: 1,
                 strokeColor: "#ffffff",
                 strokeWeight: 2,
               }}
            />
            
            {/* Emergency SOS Pulse Animation rendering as a Red Circle on the Map */}
            {sosActive && (
              <Circle 
                center={position}
                radius={200} // meters
                options={{
                  strokeColor: '#FF0000',
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: '#FF0000',
                  fillOpacity: 0.35,
                }}
              />
            )}
          </>
        )}
      </GoogleMap>
    </div>
  );
}
