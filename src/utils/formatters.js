export const roundValue = (value, fallback = '—') =>
  Number.isFinite(value) ? Math.round(value) : fallback;

export const formatTemperature = (value, symbol) =>
  Number.isFinite(value) ? `${Math.round(value)}${symbol}` : '—';

export const formatVisibility = (visibilityInMeters, units) => {
  if (!Number.isFinite(visibilityInMeters)) return '—';

  if (units === 'imperial') {
    const miles = visibilityInMeters / 1609.344;
    return `${miles.toFixed(1)} mi`;
  }

  return `${(visibilityInMeters / 1000).toFixed(1)} km`;
};

export const formatPressure = (pressure) =>
  Number.isFinite(pressure) ? `${Math.round(pressure)} hPa` : '—';

export const formatPercentage = (value) =>
  Number.isFinite(value) ? `${Math.round(value)}%` : '—';

export const formatWindSpeed = (speed, unit) =>
  Number.isFinite(speed) ? `${speed.toFixed(1)} ${unit}` : '—';
