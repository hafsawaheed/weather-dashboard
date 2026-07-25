import { lazy, Suspense, useEffect, useMemo, useRef } from 'react';
import { DEFAULT_LOCATION } from '../constants/app';
import { useFavorites } from '../hooks/useFavorites';
import { useGeolocation } from '../hooks/useGeolocation';
import { useWeather } from '../hooks/useWeather';
import { getWeatherBackground } from '../utils/weather';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { EmptyState } from '../components/common/EmptyState';
import { CurrentWeatherCard } from '../components/weather/CurrentWeatherCard';
import { DailyForecast } from '../components/weather/DailyForecast';
import { DashboardSkeleton } from '../components/weather/DashboardSkeleton';
import { FavoriteCities } from '../components/weather/FavoriteCities';
import { HourlyForecast } from '../components/weather/HourlyForecast';
import { SearchBar } from '../components/weather/SearchBar';
import { WeatherStatsGrid } from '../components/weather/WeatherStatsGrid';
import { Skeleton } from '../components/ui/Skeleton';
import { DashboardShell } from '../components/layout/DashboardShell';

const WeatherCharts = lazy(
  () => import('../components/weather/WeatherCharts'),
);

const ChartSkeleton = () => (
  <div className="grid gap-4 lg:grid-cols-2" aria-label="Loading charts">
    {Array.from({ length: 2 }, (_, index) => (
      <div className="glass-card p-5" key={index}>
        <Skeleton className="h-5 w-36" />
        <Skeleton className="mt-5 h-64 w-full rounded-2xl" />
      </div>
    ))}
  </div>
);

export const DashboardPage = () => {
  const initialLoadStartedRef = useRef(false);
  const {
    weather,
    isLoading,
    error,
    suggestions,
    isSearching,
    loadWeather,
    searchCity,
    findLocations,
    clearError,
    clearSuggestions,
  } = useWeather();
  const { requestLocation, geolocationError } = useGeolocation();
  const {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    hasReachedLimit,
  } = useFavorites();

  useEffect(() => {
    if (initialLoadStartedRef.current) return;
    initialLoadStartedRef.current = true;

    const loadInitialWeather = async () => {
      try {
        const coordinates = await requestLocation();
        await loadWeather(coordinates);
      } catch {
        await loadWeather(DEFAULT_LOCATION);
      }
    };

    loadInitialWeather();
  }, [loadWeather, requestLocation]);

  const currentCity = useMemo(() => {
    if (!weather) return null;

    return {
      name: weather.location.name,
      country: weather.location.country,
      latitude: weather.location.latitude,
      longitude: weather.location.longitude,
    };
  }, [weather]);

  const backgroundClass = weather
    ? getWeatherBackground({
        condition: weather.current.condition,
        isNight: weather.current.isNight,
      })
    : 'weather-bg--default';

  const handleUseLocation = async () => {
    clearError();
    try {
      const coordinates = await requestLocation();
      await loadWeather(coordinates);
    } catch {
      // The geolocation hook exposes the user-facing status message.
    }
  };

  const handleToggleFavorite = () => {
    if (!currentCity) return;

    if (isFavorite(currentCity)) {
      const favoriteId = favorites.find(
        (favorite) =>
          favorite.latitude === currentCity.latitude &&
          favorite.longitude === currentCity.longitude,
      )?.id;
      if (favoriteId) removeFavorite(favoriteId);
      return;
    }

    addFavorite(currentCity);
  };

  return (
    <DashboardShell backgroundClass={backgroundClass}>
      <main
        id="dashboard"
        className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10"
      >
        <SearchBar
          suggestions={suggestions}
          isSearching={isSearching}
          isLoading={isLoading}
          onQueryChange={findLocations}
          onSelectLocation={loadWeather}
          onSubmitSearch={searchCity}
          onUseLocation={handleUseLocation}
          onClearSuggestions={clearSuggestions}
        />

        <div className="mt-5 min-h-6" aria-live="polite">
          {isLoading && weather ? (
            <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/55 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
              <span className="size-1.5 animate-pulse rounded-full bg-sky-500" />
              Refreshing forecast
            </div>
          ) : geolocationError && !error ? (
            <p className="text-center text-xs text-slate-600 dark:text-slate-300">
              {geolocationError}
            </p>
          ) : null}
        </div>

        {error ? (
          <div className="mt-3">
            <ErrorAlert message={error} onDismiss={clearError} />
          </div>
        ) : null}

        <div className="mt-6">
          {!weather && isLoading ? <DashboardSkeleton /> : null}
          {!weather && !isLoading ? <EmptyState /> : null}

          {weather ? (
            <div className="space-y-8 lg:space-y-10">
              <section
                className="grid gap-4 lg:grid-cols-[1.1fr_1fr]"
                aria-label="Current conditions"
              >
                <CurrentWeatherCard
                  weather={weather}
                  isFavorite={isFavorite(currentCity)}
                  onToggleFavorite={handleToggleFavorite}
                  favoriteDisabled={hasReachedLimit}
                />
                <WeatherStatsGrid weather={weather} />
              </section>

              <HourlyForecast weather={weather} />
              <DailyForecast weather={weather} />

              <Suspense fallback={<ChartSkeleton />}>
                <WeatherCharts weather={weather} />
              </Suspense>

              <FavoriteCities
                favorites={favorites}
                onView={loadWeather}
                onRemove={removeFavorite}
              />
            </div>
          ) : null}
        </div>
      </main>
    </DashboardShell>
  );
};
