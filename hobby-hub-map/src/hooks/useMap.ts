
import { useState, useEffect, useRef } from 'react';

interface Location {
  lat: number;
  lng: number;
}

interface UseMapResult {
  userLocation: Location | null;
  isLoading: boolean;
  error: string | null;
  getUserLocation: () => Promise<Location | null>;
  setManualLocation: (location: Location) => void;
}

export function useMap(): UseMapResult {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const hasRequestedLocation = useRef<boolean>(false);

  // Try to get saved location from localStorage on initial load
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    
    if (savedLocation) {
      try {
        setUserLocation(JSON.parse(savedLocation));
      } catch (e) {
        console.error('Could not parse saved location');
      }
    }
  }, []);

  // Function to request user's geolocation
  const getUserLocation = async (): Promise<Location | null> => {
    if (hasRequestedLocation.current) {
      return userLocation;
    }
    
    hasRequestedLocation.current = true;
    setIsLoading(true);
    setError(null);
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });
      
      const newLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      
      setUserLocation(newLocation);
      localStorage.setItem('userLocation', JSON.stringify(newLocation));
      setIsLoading(false);
      return newLocation;
    } catch (err) {
      setIsLoading(false);
      setError('Could not access your location. Please enable location services.');
      console.error('Error getting user location:', err);
      return null;
    }
  };

  // Function to manually set location
  const setManualLocation = (location: Location): void => {
    setUserLocation(location);
    localStorage.setItem('userLocation', JSON.stringify(location));
  };

  return { 
    userLocation, 
    isLoading, 
    error, 
    getUserLocation, 
    setManualLocation
  };
}
