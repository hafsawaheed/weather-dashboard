import { httpClient } from '../api/httpClient';
import { MAX_SEARCH_RESULTS } from '../constants/app';
import { WEATHER_ENDPOINTS } from '../constants/weather';
import { isNightAtLocation } from '../utils/weather';

const getApiKey = () => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY?.trim();

  if (!apiKey) {
    const error = new Error(
      'Missing OpenWeather API key. Add VITE_OPENWEATHER_API_KEY to your .env file.',
    );
    error.code = 'MISSING_API_KEY';
    throw error;
  }

  return apiKey;
};

const getLocalDateKey = (unixSeconds, timezoneOffsetSeconds) =>
  new Date((unixSeconds + timezoneOffsetSeconds) * 1000)
    .toISOString()
    .slice(0, 10);

const getLocalHour = (unixSeconds, timezoneOffsetSeconds) =>
  new Date((unixSeconds + timezoneOffsetSeconds) * 1000).getUTCHours();

const pickRepresentativeForecast = (items, timezoneOffsetSeconds) =>
  items.reduce((closest, item) => {
    const currentDistance = Math.abs(
      getLocalHour(item.dt, timezoneOffsetSeconds) - 12,
    );
    const closestDistance = Math.abs(
      getLocalHour(closest.dt, timezoneOffsetSeconds) - 12,
    );

    return currentDistance < closestDistance ? item : closest;
  });

const buildFallbackDailyForecast = (forecastItems, timezoneOffsetSeconds) => {
  const groupedForecasts = forecastItems.reduce((groups, item) => {
    const dateKey = getLocalDateKey(item.dt, timezoneOffsetSeconds);
    const dateItems = groups.get(dateKey) ?? [];
    dateItems.push(item);
    groups.set(dateKey, dateItems);
    return groups;
  }, new Map());

  return Array.from(groupedForecasts.values())
    .slice(0, 5)
    .map((items) => {
      const representative = pickRepresentativeForecast(
        items,
        timezoneOffsetSeconds,
      );

      return {
        timestamp: items[0].dt,
        minTemperature: Math.min(...items.map((item) => item.main.temp_min)),
        maxTemperature: Math.max(...items.map((item) => item.main.temp_max)),
        condition: representative.weather[0]?.main ?? 'Unknown',
        description: representative.weather[0]?.description ?? 'No description',
        weatherId: representative.weather[0]?.id ?? 800,
        rainProbability:
          Math.max(...items.map((item) => item.pop ?? 0)) * 100,
        isNight: representative.weather[0]?.icon?.endsWith('n') ?? false,
      };
    });
};

const buildFallbackHourlyForecast = (forecastItems) =>
  forecastItems.slice(0, 12).map((item) => ({
    timestamp: item.dt,
    temperature: item.main.temp,
    humidity: item.main.humidity,
    condition: item.weather[0]?.main ?? 'Unknown',
    description: item.weather[0]?.description ?? 'No description',
    weatherId: item.weather[0]?.id ?? 800,
    rainProbability: (item.pop ?? 0) * 100,
    isNight: item.weather[0]?.icon?.endsWith('n') ?? false,
  }));

const buildOneCallHourlyForecast = (hourlyItems = []) =>
  hourlyItems.slice(0, 24).map((item) => ({
    timestamp: item.dt,
    temperature: item.temp,
    humidity: item.humidity,
    condition: item.weather[0]?.main ?? 'Unknown',
    description: item.weather[0]?.description ?? 'No description',
    weatherId: item.weather[0]?.id ?? 800,
    rainProbability: (item.pop ?? 0) * 100,
    isNight: item.weather[0]?.icon?.endsWith('n') ?? false,
  }));

const buildOneCallDailyForecast = (dailyItems = []) =>
  dailyItems.slice(0, 5).map((item) => ({
    timestamp: item.dt,
    minTemperature: item.temp.min,
    maxTemperature: item.temp.max,
    condition: item.weather[0]?.main ?? 'Unknown',
    description: item.weather[0]?.description ?? 'No description',
    weatherId: item.weather[0]?.id ?? 800,
    rainProbability: (item.pop ?? 0) * 100,
    isNight: false,
  }));

const normalizeWeatherBundle = ({ current, forecast, oneCall }) => {
  const weather = current.weather[0] ?? {};
  const timezoneOffset = current.timezone ?? 0;
  const oneCallCurrent = oneCall?.current;
  const currentTimestamp = current.dt;
  const sunrise = current.sys?.sunrise;
  const sunset = current.sys?.sunset;

  return {
    location: {
      name: current.name,
      country: current.sys?.country ?? '',
      latitude: current.coord.lat,
      longitude: current.coord.lon,
      timezoneOffset,
    },
    current: {
      timestamp: currentTimestamp,
      temperature: current.main.temp,
      feelsLike: current.main.feels_like,
      condition: weather.main ?? 'Unknown',
      description: weather.description ?? 'No description',
      weatherId: weather.id ?? 800,
      isNight:
        weather.icon?.endsWith('n') ??
        isNightAtLocation(currentTimestamp, sunrise, sunset),
      humidity: current.main.humidity,
      pressure: current.main.pressure,
      visibility: current.visibility,
      windSpeed: current.wind?.speed,
      cloudCoverage: current.clouds?.all,
      sunrise,
      sunset,
      uvIndex: oneCallCurrent?.uvi ?? null,
    },
    hourly:
      oneCall?.hourly?.length > 0
        ? buildOneCallHourlyForecast(oneCall.hourly)
        : buildFallbackHourlyForecast(forecast.list),
    daily:
      oneCall?.daily?.length > 0
        ? buildOneCallDailyForecast(oneCall.daily)
        : buildFallbackDailyForecast(forecast.list, timezoneOffset),
    meta: {
      usedOneCall: Boolean(oneCall),
      hourlyResolution: oneCall ? '1 hour' : '3 hours',
    },
  };
};

export const searchLocations = async (query, { signal } = {}) => {
  const response = await httpClient.get(WEATHER_ENDPOINTS.geocoding, {
    params: {
      q: query,
      limit: MAX_SEARCH_RESULTS,
      appid: getApiKey(),
    },
    signal,
  });

  return response.data.map((location) => ({
    id: `${location.lat}:${location.lon}`,
    name: location.name,
    state: location.state ?? '',
    country: location.country,
    latitude: location.lat,
    longitude: location.lon,
  }));
};

export const getWeatherByCoordinates = async (
  { latitude, longitude, units = 'metric' },
  { signal } = {},
) => {
  const commonParams = {
    lat: latitude,
    lon: longitude,
    units,
    appid: getApiKey(),
  };

  const oneCallRequest = httpClient
    .get(WEATHER_ENDPOINTS.oneCall, {
      params: {
        ...commonParams,
        exclude: 'minutely,alerts',
      },
      signal,
    })
    .then((response) => response.data)
    .catch((error) => {
      if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
        throw error;
      }

      // One Call 3.0 can require a separate subscription. Standard endpoints
      // remain a complete fallback for current, hourly, and daily views.
      return null;
    });

  const [currentResponse, forecastResponse, oneCall] = await Promise.all([
    httpClient.get(WEATHER_ENDPOINTS.current, {
      params: commonParams,
      signal,
    }),
    httpClient.get(WEATHER_ENDPOINTS.forecast, {
      params: commonParams,
      signal,
    }),
    oneCallRequest,
  ]);

  return normalizeWeatherBundle({
    current: currentResponse.data,
    forecast: forecastResponse.data,
    oneCall,
  });
};

export const getWeatherErrorMessage = (error) => {
  if (error?.code === 'MISSING_API_KEY') return error.message;
  if (error?.code === 'ERR_CANCELED') return '';
  if (error?.code === 'ERR_NETWORK') {
    return 'Unable to reach the weather service. Check your connection and try again.';
  }

  const status = error?.response?.status;

  if (status === 401) {
    return 'The OpenWeather API key is invalid or not active yet.';
  }

  if (status === 404) {
    return 'No matching city was found. Check the spelling and try again.';
  }

  if (status === 429) {
    return 'The weather service rate limit was reached. Please try again shortly.';
  }

  if (status >= 500) {
    return 'The weather service is temporarily unavailable.';
  }

  return 'Something went wrong while loading the forecast.';
};
