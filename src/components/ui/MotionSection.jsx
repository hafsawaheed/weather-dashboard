import { motion, useReducedMotion } from 'framer-motion';

export const MotionSection = ({ children, className = '', ...sectionProps }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...sectionProps}
    >
      {children}
    </motion.section>
  );
};
