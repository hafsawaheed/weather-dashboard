import { motion } from 'framer-motion';
import { FiHeart, FiMapPin } from 'react-icons/fi';
import { useCityClock } from '../../hooks/useCityClock';
import { useSettings } from '../../hooks/useSettings';
import { formatTemperature } from '../../utils/formatters';
import { GlassCard } from '../ui/GlassCard';
import { WeatherIcon } from './WeatherIcon';

export const CurrentWeatherCard = ({
  weather,
  isFavorite,
  onToggleFavorite,
  favoriteDisabled,
}) => {
  const { unitConfig } = useSettings();
  const { date, time } = useCityClock(weather.location.timezoneOffset);
  const { current, location } = weather;

  return (
    <GlassCard className="relative min-h-80 overflow-hidden p-6 sm:p-8">
      <div className="absolute -right-16 -top-20 size-64 rounded-full bg-white/25 blur-3xl dark:bg-sky-300/10" />
      <div className="relative flex h-full flex-col justify-between gap-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-200">
              <FiMapPin aria-hidden="true" />
              <span>Current weather</span>
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              {location.name}
              {location.country ? (
                <span className="ml-2 text-xl font-medium text-slate-500 dark:text-slate-300">
                  {location.country}
                </span>
              ) : null}
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {date} · {time}
            </p>
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleFavorite}
            disabled={!isFavorite && favoriteDisabled}
            aria-pressed={isFavorite}
            aria-label={
              isFavorite ? 'Remove city from favorites' : 'Add city to favorites'
            }
            className={`grid size-11 place-items-center rounded-xl border shadow-sm backdrop-blur-xl transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:cursor-not-allowed disabled:opacity-50 ${
              isFavorite
                ? 'border-rose-300/60 bg-rose-100/80 text-rose-600 dark:border-rose-300/20 dark:bg-rose-400/15 dark:text-rose-200'
                : 'border-white/30 bg-white/45 text-slate-700 hover:bg-white/70 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15'
            }`}
          >
            <FiHeart
              className={isFavorite ? 'fill-current' : ''}
              aria-hidden="true"
            />
          </motion.button>
        </div>

        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-7xl font-semibold tracking-[-0.08em] text-slate-950 dark:text-white sm:text-8xl">
              {formatTemperature(
                current.temperature,
                unitConfig.temperatureSymbol,
              )}
            </p>
            <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
              Feels like{' '}
              {formatTemperature(
                current.feelsLike,
                unitConfig.temperatureSymbol,
              )}
            </p>
          </div>

          <div className="flex items-center gap-3 sm:flex-col sm:items-end">
            <WeatherIcon
              weatherId={current.weatherId}
              isNight={current.isNight}
              className="size-20 text-sky-600 drop-shadow-sm dark:text-sky-200 sm:size-24"
            />
            <div className="sm:text-right">
              <p className="text-lg font-semibold capitalize text-slate-950 dark:text-white">
                {current.condition}
              </p>
              <p className="text-sm capitalize text-slate-600 dark:text-slate-300">
                {current.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
