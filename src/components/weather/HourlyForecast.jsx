import { motion } from 'framer-motion';
import { useSettings } from '../../hooks/useSettings';
import { formatHour } from '../../utils/date';
import {
  formatPercentage,
  formatTemperature,
} from '../../utils/formatters';
import { SectionHeader } from '../common/SectionHeader';
import { GlassCard } from '../ui/GlassCard';
import { MotionSection } from '../ui/MotionSection';
import { WeatherIcon } from './WeatherIcon';

export const HourlyForecast = ({ weather }) => {
  const { unitConfig } = useSettings();
  const timezoneOffset = weather.location.timezoneOffset;

  return (
    <MotionSection aria-labelledby="hourly-heading">
      <SectionHeader
        id="hourly-heading"
        title="Hourly Forecast"
        description={`Forecast intervals: ${weather.meta.hourlyResolution}`}
      />
      <div
        className="scrollbar-thin flex snap-x gap-3 overflow-x-auto pb-2"
        tabIndex="0"
        aria-label="Scrollable hourly weather forecast"
      >
        {weather.hourly.map((hour, index) => (
          <motion.div
            key={hour.timestamp}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Math.min(index * 0.035, 0.25) }}
            whileHover={{ y: -4 }}
            className="min-w-28 snap-start sm:min-w-32"
          >
            <GlassCard className="flex flex-col items-center px-3 py-4 text-center">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {index === 0
                  ? 'Now'
                  : formatHour(hour.timestamp, timezoneOffset)}
              </p>
              <WeatherIcon
                weatherId={hour.weatherId}
                isNight={hour.isNight}
                className="my-2 size-11 text-sky-600 dark:text-sky-200"
              />
              <p className="text-lg font-semibold text-slate-950 dark:text-white">
                {formatTemperature(
                  hour.temperature,
                  unitConfig.temperatureSymbol,
                )}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                {formatPercentage(hour.rainProbability)} rain
              </p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </MotionSection>
  );
};
