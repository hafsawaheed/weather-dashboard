import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const DashboardShell = ({ backgroundClass, children }) => (
  <div className={`weather-background ${backgroundClass}`}>
    <div className="min-h-screen bg-white/10 transition-colors duration-500 dark:bg-slate-950/25">
      <Navbar />
      {children}
      <Footer />
    </div>
  </div>
);
