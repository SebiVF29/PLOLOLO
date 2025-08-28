
import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useTheme } from '../../contexts/ThemeContext';
import { useFocusTimer } from '../../contexts/FocusTimerContext';
import GlobalTimer from './GlobalTimer';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { background, isBackgroundBlurred } = useTheme();
  const { isActive, timeLeft } = useFocusTimer();
  const location = useLocation();
  const isDashboard = location.pathname === '/';

  const showGlobalTimer = isActive && timeLeft < 300; // 5 minutes

  const backgroundStyles = !isDashboard && background ? {
    backgroundImage: `url(${background})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed'
  } : {};

  return (
    <div className="h-screen w-full" style={backgroundStyles}>
      <div className={`flex h-full w-full ${!isDashboard && isBackgroundBlurred ? 'backdrop-blur-sm' : ''}`}>
        <Sidebar />
        <main className="relative flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-background/80 dark:bg-background/90">
          {showGlobalTimer && <GlobalTimer />}
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;