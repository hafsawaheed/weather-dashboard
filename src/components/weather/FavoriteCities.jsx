import { AnimatePresence, motion } from 'framer-motion';
import { FiMapPin, FiTrash2 } from 'react-icons/fi';
import { SectionHeader } from '../common/SectionHeader';
import { GlassCard } from '../ui/GlassCard';
import { MotionSection } from '../ui/MotionSection';

export const FavoriteCities = ({ favorites, onView, onRemove }) => (
  <MotionSection aria-labelledby="favorites-heading">
    <SectionHeader
      id="favorites-heading"
      title="Favorite Cities"
      description="Saved locally on this device"
    />

    {favorites.length === 0 ? (
      <GlassCard className="px-5 py-8 text-center">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
          No favorite cities yet.
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
          Use the heart button on the current weather card to add one.
        </p>
      </GlassCard>
    ) : (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence initial={false}>
          {favorites.map((favorite) => (
            <motion.div
              layout
              key={favorite.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
            >
              <GlassCard className="flex items-center gap-2 p-2">
                <button
                  type="button"
                  onClick={() => onView(favorite)}
                  className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-white/40 focus-visible:outline-2 focus-visible:outline-sky-500 dark:hover:bg-white/5"
                  aria-label={`View weather for ${favorite.name}`}
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/60 text-sky-700 dark:bg-white/10 dark:text-sky-200">
                    <FiMapPin aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-slate-950 dark:text-white">
                      {favorite.name}
                    </span>
                    <span className="block text-xs text-slate-500 dark:text-slate-300">
                      {favorite.country}
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(favorite.id)}
                  className="grid size-9 shrink-0 place-items-center rounded-xl text-slate-500 transition hover:bg-rose-100 hover:text-rose-600 focus-visible:outline-2 focus-visible:outline-rose-500 dark:text-slate-300 dark:hover:bg-rose-400/15 dark:hover:text-rose-200"
                  aria-label={`Remove ${favorite.name} from favorites`}
                >
                  <FiTrash2 aria-hidden="true" />
                </button>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    )}
  </MotionSection>
);
