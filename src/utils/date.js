const toUtcDate = (unixSeconds, timezoneOffsetSeconds = 0) =>
  new Date((unixSeconds + timezoneOffsetSeconds) * 1000);

export const formatCityDate = (unixSeconds, timezoneOffsetSeconds = 0) => {
  if (!Number.isFinite(unixSeconds)) return '—';

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(toUtcDate(unixSeconds, timezoneOffsetSeconds));
};

export const formatCityTime = (unixSeconds, timezoneOffsetSeconds = 0) => {
  if (!Number.isFinite(unixSeconds)) return '—';

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(toUtcDate(unixSeconds, timezoneOffsetSeconds));
};

export const formatHour = (unixSeconds, timezoneOffsetSeconds = 0) =>
  new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    timeZone: 'UTC',
  }).format(toUtcDate(unixSeconds, timezoneOffsetSeconds));

export const formatWeekday = (unixSeconds, timezoneOffsetSeconds = 0) =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    timeZone: 'UTC',
  }).format(toUtcDate(unixSeconds, timezoneOffsetSeconds));

export const formatSunTime = (unixSeconds, timezoneOffsetSeconds = 0) =>
  formatCityTime(unixSeconds, timezoneOffsetSeconds);

export const formatNavbarDate = (date = new Date()) =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date);
