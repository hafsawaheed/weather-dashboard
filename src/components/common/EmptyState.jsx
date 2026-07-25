import { FiCloud } from 'react-icons/fi';
import { GlassCard } from '../ui/GlassCard';

export const EmptyState = () => (
  <GlassCard className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
    <span className="mb-4 grid size-14 place-items-center rounded-2xl bg-white/60 text-2xl text-sky-600 shadow-sm dark:bg-white/10 dark:text-sky-300">
      <FiCloud aria-hidden="true" />
    </span>
    <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
      Search for a city
    </h2>
    <p className="mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
      View current conditions, forecast trends, and weather details for any
      supported location.
    </p>
  </GlassCard>
);
