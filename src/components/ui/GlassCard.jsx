export const GlassCard = ({ as: Component = 'div', className = '', children }) => (
  <Component className={`glass-card ${className}`.trim()}>{children}</Component>
);
