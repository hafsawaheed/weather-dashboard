import { ErrorBoundary } from './components/common/ErrorBoundary';
import { FavoritesProvider } from './context/FavoritesContext';
import { SettingsProvider } from './context/SettingsContext';
import { ThemeProvider } from './context/ThemeContext';
import { DashboardPage } from './pages/DashboardPage';

const App = () => (
  <ErrorBoundary>
    <ThemeProvider>
      <SettingsProvider>
        <FavoritesProvider>
          <DashboardPage />
        </FavoritesProvider>
      </SettingsProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
