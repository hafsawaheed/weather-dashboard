import { WEATHER_BACKGROUNDS } from '../constants/weather';

export const isNightAtLocation = (currentUnix, sunriseUnix, sunsetUnix) =>
  currentUnix < sunriseUnix || currentUnix > sunsetUnix;

export const getWeatherBackground = ({ condition, isNight }) => {
  const normalizedCondition = condition?.toLowerCase() ?? '';

  if (isNight && normalizedCondition === 'clear') {
    return WEATHER_BACKGROUNDS.clearNight;
  }

  if (normalizedCondition === 'clear') {
    return WEATHER_BACKGROUNDS.clearDay;
  }

  if (normalizedCondition.includes('thunder')) {
    return WEATHER_BACKGROUNDS.thunderstorm;
  }

  if (
    normalizedCondition.includes('rain') ||
    normalizedCondition.includes('drizzle')
  ) {
    return WEATHER_BACKGROUNDS.rain;
  }

  if (normalizedCondition.includes('snow')) {
    return WEATHER_BACKGROUNDS.snow;
  }

  if (normalizedCondition.includes('cloud')) {
    return WEATHER_BACKGROUNDS.clouds;
  }

  return WEATHER_BACKGROUNDS.default;
};

export const getUvLabel = (uvIndex) => {
  if (!Number.isFinite(uvIndex)) return 'Unavailable';
  if (uvIndex < 3) return 'Low';
  if (uvIndex < 6) return 'Moderate';
  if (uvIndex < 8) return 'High';
  if (uvIndex < 11) return 'Very high';
  return 'Extreme';
};

export const createFavoriteId = ({ latitude, longitude }) =>
  `${Number(latitude).toFixed(3)}:${Number(longitude).toFixed(3)}`;
