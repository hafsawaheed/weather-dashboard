import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getWeatherByCoordinates,
  getWeatherErrorMessage,
  searchLocations,
} from '../services/weatherService';
import { useSettings } from './useSettings';

export const useWeather = () => {
  const { units } = useSettings();
  const requestControllerRef = useRef(null);
  const searchControllerRef = useRef(null);
  const latestCoordinatesRef = useRef(null);
  const previousUnitsRef = useRef(units);
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const loadWeather = useCallback(
    async (coordinates) => {
      requestControllerRef.current?.abort();
      const controller = new AbortController();
      requestControllerRef.current = controller;
      latestCoordinatesRef.current = coordinates;

      setIsLoading(true);
      setError('');

      try {
        const nextWeather = await getWeatherByCoordinates(
          { ...coordinates, units },
          { signal: controller.signal },
        );
        setWeather(nextWeather);
        setSuggestions([]);
      } catch (requestError) {
        const message = getWeatherErrorMessage(requestError);
        if (message) setError(message);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    },
    [units],
  );

  const findLocations = useCallback(async (query) => {
    searchControllerRef.current?.abort();

    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    searchControllerRef.current = controller;
    setIsSearching(true);

    try {
      const results = await searchLocations(query.trim(), {
        signal: controller.signal,
      });
      setSuggestions(results);
    } catch (requestError) {
      if (requestError.code !== 'ERR_CANCELED') setSuggestions([]);
    } finally {
      if (!controller.signal.aborted) setIsSearching(false);
    }
  }, []);

  const searchCity = useCallback(
    async (query) => {
      setError('');

      try {
        const results = await searchLocations(query.trim());
        const firstResult = results[0];

        if (!firstResult) {
          setError('No matching city was found. Check the spelling and try again.');
          return;
        }

        await loadWeather(firstResult);
      } catch (requestError) {
        const message = getWeatherErrorMessage(requestError);
        if (message) setError(message);
      }
    },
    [loadWeather],
  );

  const clearError = useCallback(() => setError(''), []);
  const clearSuggestions = useCallback(() => setSuggestions([]), []);

  useEffect(() => {
    if (previousUnitsRef.current === units) return;

    previousUnitsRef.current = units;
    if (latestCoordinatesRef.current) {
      loadWeather(latestCoordinatesRef.current);
    }
  }, [loadWeather, units]);

  useEffect(
    () => () => {
      requestControllerRef.current?.abort();
      searchControllerRef.current?.abort();
    },
    [],
  );

  return {
    weather,
    isLoading,
    error,
    suggestions,
    isSearching,
    loadWeather,
    searchCity,
    findLocations,
    clearError,
    clearSuggestions,
  };
};
