import { FiMoon, FiSun } from 'react-icons/fi';
import brandMark from '../../assets/brand-mark.svg';
import { APP_NAME } from '../../constants/app';
import { UNIT_OPTIONS } from '../../constants/weather';
import { useSettings } from '../../hooks/useSettings';
import { useTheme } from '../../hooks/useTheme';
import { formatNavbarDate } from '../../utils/date';
import { IconButton } from '../ui/IconButton';

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { units, setUnits } = useSettings();

  return (
    <header className="sticky top-0 z-40 border-b border-white/20 bg-white/35 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/35">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8"
        aria-label="Primary navigation"
      >
        <a
          href="#dashboard"
          className="flex items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-500"
        >
          <img src={brandMark} alt="" className="size-10" />
          <div>
            <p className="text-base font-bold tracking-tight text-slate-950 dark:text-white">
              {APP_NAME}
            </p>
            <p className="hidden text-xs text-slate-600 dark:text-slate-300 sm:block">
              {formatNavbarDate()}
            </p>
          </div>
        </a>

        <div className="flex items-center gap-2">
          <div
            className="flex rounded-xl border border-white/30 bg-white/45 p-1 text-xs font-semibold shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
            aria-label="Temperature units"
          >
            {Object.values(UNIT_OPTIONS).map((option) => (
              <button
                key={option.key}
                type="button"
                aria-pressed={units === option.key}
                onClick={() => setUnits(option.key)}
                className={`rounded-lg px-2.5 py-1.5 transition focus-visible:outline-2 focus-visible:outline-sky-500 ${
                  units === option.key
                    ? 'bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950'
                    : 'text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {option.temperatureSymbol}
              </button>
            ))}
          </div>

          <IconButton
            label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <FiSun aria-hidden="true" />
            ) : (
              <FiMoon aria-hidden="true" />
            )}
          </IconButton>
        </div>
      </nav>
    </header>
  );
};
