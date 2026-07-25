import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useId, useRef, useState } from 'react';
import { FiLoader, FiMapPin, FiNavigation, FiSearch } from 'react-icons/fi';
import {
  SEARCH_DEBOUNCE_MS,
  SEARCH_MIN_LENGTH,
} from '../../constants/app';
import { useDebounce } from '../../hooks/useDebounce';

export const SearchBar = ({
  suggestions,
  isSearching,
  isLoading,
  onQueryChange,
  onSelectLocation,
  onSubmitSearch,
  onUseLocation,
  onClearSuggestions,
}) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const listboxId = useId();
  const inputRef = useRef(null);
  const suppressNextSearchRef = useRef(false);
  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    const normalizedQuery = debouncedQuery.trim();

    if (suppressNextSearchRef.current) {
      suppressNextSearchRef.current = false;
      return;
    }

    if (normalizedQuery.length >= SEARCH_MIN_LENGTH) {
      onQueryChange(normalizedQuery);
    } else {
      onClearSuggestions();
    }
  }, [debouncedQuery, onClearSuggestions, onQueryChange]);

  useEffect(() => setActiveIndex(-1), [suggestions]);

  const selectLocation = (location) => {
    suppressNextSearchRef.current = true;
    setQuery(`${location.name}, ${location.country}`);
    onClearSuggestions();
    onSelectLocation(location);
    inputRef.current?.blur();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const highlightedLocation = suggestions[activeIndex];
    const firstLocation = suggestions[0];

    if (highlightedLocation || firstLocation) {
      selectLocation(highlightedLocation ?? firstLocation);
      return;
    }

    if (query.trim()) onSubmitSearch(query.trim());
  };

  const handleKeyDown = (event) => {
    if (!suggestions.length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((current) =>
        current >= suggestions.length - 1 ? 0 : current + 1,
      );
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((current) =>
        current <= 0 ? suggestions.length - 1 : current - 1,
      );
    }

    if (event.key === 'Escape') {
      onClearSuggestions();
      setActiveIndex(-1);
    }
  };

  const hasSuggestions = suggestions.length > 0;

  return (
    <div className="relative z-30 mx-auto w-full max-w-3xl">
      <form
        onSubmit={handleSubmit}
        className="glass-card flex items-center gap-2 p-2"
        role="search"
      >
        <div className="relative min-w-0 flex-1">
          <FiSearch
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-300"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search city or country"
            aria-label="Search city"
            aria-autocomplete="list"
            aria-controls={hasSuggestions ? listboxId : undefined}
            aria-expanded={hasSuggestions}
            aria-activedescendant={
              activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined
            }
            className="h-12 w-full rounded-xl bg-transparent pl-10 pr-10 text-sm font-medium text-slate-950 outline-none placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-white dark:placeholder:text-slate-300"
          />
          {isSearching ? (
            <FiLoader
              className="absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin text-slate-500 dark:text-slate-300"
              aria-label="Searching"
            />
          ) : null}
        </div>

        <button
          type="button"
          onClick={onUseLocation}
          disabled={isLoading}
          className="grid size-12 shrink-0 place-items-center rounded-xl border border-white/30 bg-white/55 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
          aria-label="Use current location"
          title="Use current location"
        >
          <FiNavigation aria-hidden="true" />
        </button>

        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="h-12 shrink-0 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 sm:px-5"
        >
          <span className="hidden sm:inline">Search</span>
          <FiSearch className="sm:hidden" aria-hidden="true" />
        </button>
      </form>

      <AnimatePresence>
        {hasSuggestions ? (
          <motion.ul
            id={listboxId}
            role="listbox"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-x-0 top-[calc(100%+0.5rem)] overflow-hidden rounded-2xl border border-white/30 bg-white/90 p-1.5 shadow-2xl shadow-slate-900/15 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/95"
          >
            {suggestions.map((location, index) => (
              <li
                id={`${listboxId}-${index}`}
                key={location.id}
                role="option"
                aria-selected={index === activeIndex}
              >
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectLocation(location)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition focus-visible:outline-2 focus-visible:outline-sky-500 ${
                    index === activeIndex
                      ? 'bg-sky-100 text-sky-950 dark:bg-sky-400/15 dark:text-sky-100'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5'
                  }`}
                >
                  <FiMapPin className="shrink-0" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">
                      {location.name}
                    </span>
                    <span className="block truncate text-xs opacity-70">
                      {[location.state, location.country]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
