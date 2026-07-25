import { APP_NAME } from '../../constants/app';

export const Footer = () => (
  <footer className="mx-auto max-w-7xl px-4 pb-8 pt-4 text-center text-xs text-slate-600 dark:text-slate-300 sm:px-6 lg:px-8">
    <p>
      © {new Date().getFullYear()} {APP_NAME}. Weather data provided by
      OpenWeather.
    </p>
  </footer>
);
