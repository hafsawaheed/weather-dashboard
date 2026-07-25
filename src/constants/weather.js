export const WEATHER_ENDPOINTS = Object.freeze({
  geocoding: '/geo/1.0/direct',
  current: '/data/2.5/weather',
  forecast: '/data/2.5/forecast',
  oneCall: '/data/3.0/onecall',
});

export const UNIT_OPTIONS = Object.freeze({
  metric: {
    key: 'metric',
    temperatureSymbol: '°C',
    windUnit: 'm/s',
    label: 'Metric',
  },
  imperial: {
    key: 'imperial',
    temperatureSymbol: '°F',
    windUnit: 'mph',
    label: 'Imperial',
  },
});

export const WEATHER_BACKGROUNDS = Object.freeze({
  clearDay: 'weather-bg--clear-day',
  clearNight: 'weather-bg--clear-night',
  clouds: 'weather-bg--clouds',
  rain: 'weather-bg--rain',
  snow: 'weather-bg--snow',
  thunderstorm: 'weather-bg--thunderstorm',
  default: 'weather-bg--default',
});
