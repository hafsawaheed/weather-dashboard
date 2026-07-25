export const APP_NAME = "SkyCloudy";

export const STORAGE_KEYS = Object.freeze({
  theme: "skycloudy-theme",
  favorites: "skycloudy-favorite-cities",
  units: "skycloudy-units",
});

export const DEFAULT_LOCATION = Object.freeze({
  name: "Karachi",
  country: "PK",
  latitude: 24.8607,
  longitude: 67.0011,
});

export const SEARCH_MIN_LENGTH = 2;
export const SEARCH_DEBOUNCE_MS = 350;
export const MAX_SEARCH_RESULTS = 5;
export const MAX_FAVORITES = 8;
