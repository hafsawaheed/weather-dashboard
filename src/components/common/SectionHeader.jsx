export const SectionHeader = ({ id, title, description, action }) => (
  <div className="mb-4 flex items-end justify-between gap-4">
    <div>
      <h2
        id={id}
        className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white sm:text-xl"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          {description}
        </p>
      ) : null}
    </div>
    {action}
  </div>
);
