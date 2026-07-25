import { memo, useMemo } from 'react';
import {
  FiCloud,
  FiCompass,
  FiDroplet,
  FiEye,
  FiSun,
  FiSunrise,
  FiSunset,
  FiWind,
} from 'react-icons/fi';
import { useSettings } from '../../hooks/useSettings';
import { formatSunTime } from '../../utils/date';
import {
  formatPercentage,
  formatPressure,
  formatVisibility,
  formatWindSpeed,
  roundValue,
} from '../../utils/formatters';
import { getUvLabel } from '../../utils/weather';
import { GlassCard } from '../ui/GlassCard';

const StatCard = ({ icon: Icon, label, value, detail }) => (
  <GlassCard className="group p-4 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10 sm:p-5">
    <div className="flex items-start justify-between gap-3">
      <span className="grid size-10 place-items-center rounded-xl bg-white/55 text-sky-700 shadow-sm transition group-hover:scale-105 dark:bg-white/10 dark:text-sky-200">
        <Icon aria-hidden="true" />
      </span>
      <span className="text-xs font-medium text-slate-500 dark:text-slate-300">
        {label}
      </span>
    </div>
    <p className="mt-5 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
      {value}
    </p>
    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{detail}</p>
  </GlassCard>
);

const WeatherStatsGridComponent = ({ weather }) => {
  const { units, unitConfig } = useSettings();
  const { current } = weather;
  const timezoneOffset = weather.location.timezoneOffset;

  const stats = useMemo(
    () => [
      {
        label: 'Humidity',
        value: formatPercentage(current.humidity),
        detail: 'Relative humidity',
        icon: FiDroplet,
      },
      {
        label: 'Pressure',
        value: formatPressure(current.pressure),
        detail: 'Sea-level reading',
        icon: FiCompass,
      },
      {
        label: 'Visibility',
        value: formatVisibility(current.visibility, units),
        detail: 'Horizontal visibility',
        icon: FiEye,
      },
      {
        label: 'Wind',
        value: formatWindSpeed(current.windSpeed, unitConfig.windUnit),
        detail: 'Sustained speed',
        icon: FiWind,
      },
      {
        label: 'Clouds',
        value: formatPercentage(current.cloudCoverage),
        detail: 'Sky coverage',
        icon: FiCloud,
      },
      {
        label: 'Sunrise',
        value: formatSunTime(current.sunrise, timezoneOffset),
        detail: 'Local time',
        icon: FiSunrise,
      },
      {
        label: 'Sunset',
        value: formatSunTime(current.sunset, timezoneOffset),
        detail: 'Local time',
        icon: FiSunset,
      },
      {
        label: 'UV index',
        value: roundValue(current.uvIndex),
        detail: getUvLabel(current.uvIndex),
        icon: FiSun,
      },
    ],
    [current, timezoneOffset, unitConfig.windUnit, units],
  );

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
};

export const WeatherStatsGrid = memo(WeatherStatsGridComponent);
