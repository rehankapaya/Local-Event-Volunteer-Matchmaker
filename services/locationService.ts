import { Event } from '../types';

export interface Coordinates {
  lat: number;
  lng: number;
}

export const locationService = {
  getUserLocation: (): Promise<Coordinates> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(new Error('Geolocation is not supported by your browser.'));
      }

      navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
        const handlePosition = (position: GeolocationPosition) => {
           resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
        };

        const handleError = (error: GeolocationPositionError) => {
            let message = 'An unknown error occurred.';
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    message = "Please allow location access to use distance-based filters. You may need to enable this in your browser's site settings.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    message = "Location information is unavailable.";
                    break;
                case error.TIMEOUT:
                    message = "The request to get user location timed out.";
                    break;
            }
            reject(new Error(message));
        };
        
        if (permissionStatus.state === 'granted') {
          navigator.geolocation.getCurrentPosition(handlePosition, handleError);
        } else if (permissionStatus.state === 'prompt') {
          navigator.geolocation.getCurrentPosition(handlePosition, handleError);
        } else if (permissionStatus.state === 'denied') {
          reject(new Error("Location access was denied. To use distance filters, please enable location permissions for this site in your browser settings."));
        }
      }).catch(() => {
          // Fallback for browsers that might not support Permissions API
           navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                });
            },
            (error) => {
                let message = 'An unknown error occurred.';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message = "Please allow location access to use distance-based filters.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message = "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        message = "The request to get user location timed out.";
                        break;
                }
                reject(new Error(message));
            }
            );
      });
    });
  },

  /**
   * Calculates the distance between two points in kilometers using the Haversine formula.
   */
  calculateDistance: (point1: Coordinates, point2: Coordinates): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (point2.lat - point1.lat) * (Math.PI / 180);
    const dLon = (point2.lng - point1.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(point1.lat * (Math.PI / 180)) *
      Math.cos(point2.lat * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  },
};