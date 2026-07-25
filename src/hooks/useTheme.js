import { use } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export const useTheme = () => {
  const context = use(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider.');
  return context;
};
