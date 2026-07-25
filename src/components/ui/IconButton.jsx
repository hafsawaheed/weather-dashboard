export const IconButton = ({
  label,
  children,
  className = '',
  type = 'button',
  ...buttonProps
}) => (
  <button
    type={type}
    aria-label={label}
    title={label}
    className={`icon-button ${className}`.trim()}
    {...buttonProps}
  >
    {children}
  </button>
);
