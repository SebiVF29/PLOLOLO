
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
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, Arial, sans-serif',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <h2>Loading Chronofy...</h2>
          <p>Initializing your smart student agenda</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: theme === 'dark' ? '#0f172a' : '#f1f5f9',
      color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
      minHeight: '100vh',
      fontFamily: 'Inter, Arial, sans-serif',
      transition: 'all 0.5s ease'
    }}>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/*" element={isAuthenticated ? <ProtectedRoutes /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

// Simple dashboard component with your design
const SimpleDashboard = () => (
  <div style={{
    padding: '40px',
    maxWidth: '1200px',
    margin: '0 auto'
  }}>
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px',
      borderRadius: '20px',
      color: 'white',
      textAlign: 'center',
      marginBottom: '30px'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🎉 Welcome to Chronofy!</h1>
      <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>Your Smart Student Agenda</p>
    </div>

    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '30px',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)'
      }}>
        <h3>📅 Calendar</h3>
        <p>Manage your schedule and events</p>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '30px',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)'
      }}>
        <h3>✅ Tasks</h3>
        <p>Track your assignments and todos</p>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '30px',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)'
      }}>
        <h3>🎓 Classes</h3>
        <p>Organize your class schedule</p>
      </div>
    </div>
  </div>
);

const ProtectedRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<SimpleDashboard />} />
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