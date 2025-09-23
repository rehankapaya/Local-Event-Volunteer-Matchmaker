import React, { useRef, useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface MapProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  className?: string;
}

// Declare google as a global variable to satisfy TypeScript
declare const google: any;

const Map: React.FC<MapProps> = ({ center, zoom = 14, className = 'h-64 w-full' }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.GOOGLE_MAPS_API_KEY || "",
      version: "weekly",
    });

    loader.load().then(async () => {
      const { Map } = await google.maps.importLibrary("maps");
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

      if (mapRef.current) {
        const map = new Map(mapRef.current, {
          center,
          zoom,
          mapId: 'CONNECT_HUB_MAP_ID',
          disableDefaultUI: true,
          zoomControl: true,
        });

        new AdvancedMarkerElement({
          map,
          position: center,
        });
      }
    }).catch(e => {
        console.error("Failed to load Google Maps", e);
    });
  }, [center, zoom]);

  if (!process.env.GOOGLE_MAPS_API_KEY) {
    return (
        <div className={`${className} bg-gray-200 rounded-lg flex items-center justify-center`}>
            <p className="text-gray-500 text-center">Map requires a Google Maps API Key to be configured.</p>
        </div>
    );
  }

  return <div ref={mapRef} className={`${className} bg-gray-200 rounded-lg`} />;
};

export default Map;
