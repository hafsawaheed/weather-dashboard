import { useEffect, useMemo, useState } from 'react';
import { formatCityDate, formatCityTime } from '../utils/date';

export const useCityClock = (timezoneOffsetSeconds = 0) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(intervalId);
  }, []);

  return useMemo(() => {
    const unixSeconds = Math.floor(now / 1000);
    return {
      date: formatCityDate(unixSeconds, timezoneOffsetSeconds),
      time: formatCityTime(unixSeconds, timezoneOffsetSeconds),
    };
  }, [now, timezoneOffsetSeconds]);
};
