
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppDataProvider } from './contexts/AppContext';
import { FocusTimerProvider } from './contexts/FocusTimerContext';
import ErrorBoundary from './components/ErrorBoundary';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CalendarPage from './pages/CalendarPage';
import TasksPage from './pages/TasksPage';
import ExamsPage from './pages/ExamsPage';
import WorkPage from './pages/WorkPage';
import AiAssistantPage from './pages/AiAssistantPage';
import SettingsPage from './pages/SettingsPage';
import ClassesPage from './pages/ClassesPage';
import FocusHubPage from './pages/FocusHubPage';
import Layout from './components/layout/Layout';
import { Icon } from './components/ui/Icon';





const MainApp: React.FC = () => {
  const { theme } = useTheme();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    try {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      root.style.backgroundColor = theme === 'dark' ? '#0f172a' : '#f1f5f9';
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  }, [theme]);

  if (loading) {
    return (
      <div className="bg-background text-foreground min-h-screen font-sans flex items-center justify-center">
        <div className="text-center">
          <Icon name="cog" className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Loading Chronofy...</h2>
          <p className="text-foreground/70">Initializing your smart student agenda</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-foreground min-h-screen font-sans transition-colors duration-500">
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/*" element={isAuthenticated ? <ProtectedRoutes /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

// Minimal working dashboard with your exact design
const WorkingDashboard = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="h-screen w-full flex">
      {/* Your Sidebar */}
      <aside className="w-64 bg-card text-card-foreground p-4 flex flex-col shadow-lg">
        <div className="flex items-center gap-2 mb-8">
          <Icon name="academic-cap" className="w-8 h-8 text-primary"/>
          <h1 className="text-2xl font-bold text-primary">Chronofy</h1>
        </div>
        <nav className="flex-1">
          <div className="flex items-center gap-3 px-3 py-2.5 my-1 rounded-lg bg-primary/10 text-primary font-semibold">
            <Icon name="home" className="w-5 h-5" />
            <span>Dashboard</span>
          </div>
        </nav>
        <div className="mt-auto space-y-2">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-foreground/5 w-full text-left"
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} className="w-5 h-5" />
            <span>{theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
          </button>
          <div className="flex items-center gap-3 px-3 py-2.5">
            <Icon name="user" className="w-5 h-5" />
            <span className="text-sm">{user?.name}</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-background/80 dark:bg-background/90">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-foreground/70">Here's what's happening with your studies today.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Icon name="check-circle" className="w-5 h-5 text-primary" />
                Tasks
              </h3>
              <p className="text-2xl font-bold text-primary">0</p>
              <p className="text-sm text-foreground/70">Completed today</p>
            </div>

            <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Icon name="calendar" className="w-5 h-5 text-secondary" />
                Events
              </h3>
              <p className="text-2xl font-bold text-secondary">0</p>
              <p className="text-sm text-foreground/70">Scheduled today</p>
            </div>

            <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Icon name="academic-cap" className="w-5 h-5 text-accent" />
                Classes
              </h3>
              <p className="text-2xl font-bold text-accent">0</p>
              <p className="text-sm text-foreground/70">This week</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const ProtectedRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<WorkingDashboard />} />
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppDataProvider>
            <FocusTimerProvider>
              <MainApp />
            </FocusTimerProvider>
          </AppDataProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};


export default App;