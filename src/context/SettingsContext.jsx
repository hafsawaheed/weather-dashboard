import { createContext, useMemo } from 'react';
import { STORAGE_KEYS } from '../constants/app';
import { UNIT_OPTIONS } from '../constants/weather';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [units, setUnits] = useLocalStorage(
    STORAGE_KEYS.units,
    UNIT_OPTIONS.metric.key,
  );

  const value = useMemo(
    () => ({
      units,
      setUnits,
      unitConfig: UNIT_OPTIONS[units],
    }),
    [setUnits, units],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
