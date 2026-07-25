export const readStorage = (key, fallbackValue) => {
  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue === null ? fallbackValue : JSON.parse(storedValue);
  } catch {
    return fallbackValue;
  }
};

export const writeStorage = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can fail in private browsing or when the quota is exceeded.
  }
};
