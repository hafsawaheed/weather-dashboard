import { createContext, useCallback, useMemo } from 'react';
import { MAX_FAVORITES, STORAGE_KEYS } from '../constants/app';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { createFavoriteId } from '../utils/weather';

export const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useLocalStorage(
    STORAGE_KEYS.favorites,
    [],
  );

  const addFavorite = useCallback(
    (city) => {
      setFavorites((currentFavorites) => {
        const favorite = { ...city, id: createFavoriteId(city) };
        const alreadyExists = currentFavorites.some(
          (item) => item.id === favorite.id,
        );

        if (alreadyExists || currentFavorites.length >= MAX_FAVORITES) {
          return currentFavorites;
        }

        return [...currentFavorites, favorite];
      });
    },
    [setFavorites],
  );

  const removeFavorite = useCallback(
    (favoriteId) => {
      setFavorites((currentFavorites) =>
        currentFavorites.filter((favorite) => favorite.id !== favoriteId),
      );
    },
    [setFavorites],
  );

  const isFavorite = useCallback(
    (city) => {
      if (!city) return false;
      const favoriteId = createFavoriteId(city);
      return favorites.some((favorite) => favorite.id === favoriteId);
    },
    [favorites],
  );

  const value = useMemo(
    () => ({
      favorites,
      addFavorite,
      removeFavorite,
      isFavorite,
      hasReachedLimit: favorites.length >= MAX_FAVORITES,
    }),
    [addFavorite, favorites, isFavorite, removeFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
