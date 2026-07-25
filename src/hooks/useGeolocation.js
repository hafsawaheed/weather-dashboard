import { useCallback, useState } from 'react';

const GEOLOCATION_OPTIONS = Object.freeze({
  enableHighAccuracy: false,
  timeout: 10000,
  maximumAge: 10 * 60 * 1000,
});

export const useGeolocation = () => {
  const [isLocating, setIsLocating] = useState(false);
  const [geolocationError, setGeolocationError] = useState('');

  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      const message = 'Geolocation is not supported by this browser.';
      setGeolocationError(message);
      throw new Error(message);
    }

    setIsLocating(true);
    setGeolocationError('');

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          GEOLOCATION_OPTIONS,
        );
      });

      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
    } catch (error) {
      const message =
        error.code === error.PERMISSION_DENIED
          ? 'Location access was denied. Showing the default city instead.'
          : 'Your location could not be determined.';
      setGeolocationError(message);
      throw error;
    } finally {
      setIsLocating(false);
    }
  }, []);

  return { requestLocation, isLocating, geolocationError };
};
