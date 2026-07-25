import { use } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';

export const useFavorites = () => {
  const context = use(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider.');
  }
  return context;
};
