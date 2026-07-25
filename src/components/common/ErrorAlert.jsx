import { FiAlertTriangle, FiX } from 'react-icons/fi';

export const ErrorAlert = ({ message, onDismiss }) => (
  <div
    role="alert"
    className="flex items-start gap-3 rounded-2xl border border-rose-200/80 bg-rose-50/90 px-4 py-3 text-rose-900 shadow-sm backdrop-blur-xl dark:border-rose-400/20 dark:bg-rose-950/70 dark:text-rose-100"
  >
    <FiAlertTriangle className="mt-0.5 shrink-0" aria-hidden="true" />
    <p className="flex-1 text-sm leading-6">{message}</p>
    <button
      type="button"
      onClick={onDismiss}
      className="rounded-lg p-1 transition hover:bg-rose-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 dark:hover:bg-white/10"
      aria-label="Dismiss error"
    >
      <FiX aria-hidden="true" />
    </button>
  </div>
);
