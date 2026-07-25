import { motion } from 'framer-motion';
import { FiDroplet } from 'react-icons/fi';
import { useSettings } from '../../hooks/useSettings';
import { formatWeekday } from '../../utils/date';
import {
  formatPercentage,
  formatTemperature,
} from '../../utils/formatters';
import { SectionHeader } from '../common/SectionHeader';
import { GlassCard } from '../ui/GlassCard';
import { MotionSection } from '../ui/MotionSection';
import { WeatherIcon } from './WeatherIcon';

export const DailyForecast = ({ weather }) => {
  const { unitConfig } = useSettings();
  const timezoneOffset = weather.location.timezoneOffset;

  return (
    <MotionSection aria-labelledby="daily-heading">
      <SectionHeader
        id="daily-heading"
        title="5-Day Forecast"
        description="Daily temperature range and rain probability"
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {weather.daily.map((day, index) => (
          <motion.div
            key={day.timestamp}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            whileHover={{ y: -4 }}
          >
            <GlassCard className="h-full p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3 lg:block">
                <div>
                  <p className="font-semibold text-slate-950 dark:text-white">
                    {index === 0
                      ? 'Today'
                      : formatWeekday(day.timestamp, timezoneOffset)}
                  </p>
                  <p className="mt-1 text-xs capitalize text-slate-600 dark:text-slate-300">
                    {day.description}
                  </p>
                </div>
                <WeatherIcon
                  weatherId={day.weatherId}
                  isNight={day.isNight}
                  className="size-12 text-sky-600 dark:text-sky-200 lg:mt-4 lg:size-14"
                />
              </div>

              <div className="mt-5 flex items-end justify-between gap-3">
                <p className="text-lg font-semibold text-slate-950 dark:text-white">
                  {formatTemperature(
                    day.maxTemperature,
                    unitConfig.temperatureSymbol,
                  )}
                  <span className="ml-1 text-sm font-medium text-slate-500 dark:text-slate-300">
                    /
                    {formatTemperature(
                      day.minTemperature,
                      unitConfig.temperatureSymbol,
                    )}
                  </span>
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-sky-700 dark:text-sky-200">
                  <FiDroplet aria-hidden="true" />
                  {formatPercentage(day.rainProbability)}
                </span>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </MotionSection>
  );
};
