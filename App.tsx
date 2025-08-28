
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AppDataProvider, useAppData } from './contexts/AppContext';
import { FocusTimerProvider } from './contexts/FocusTimerContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CalendarPage from './pages/CalendarPage';
import TasksPage from './pages/TasksPage';
import ExamsPage from './pages/ExamsPage';
import WorkPage from './pages/WorkPage';
import AiAssistantPage from './pages/AiAssistantPage';
import SettingsPage from './pages/SettingsPage';
import Layout from './components/layout/Layout';
import ClassesPage from './pages/ClassesPage';
import { Icon } from './components/ui/Icon';
import FocusHubPage from './pages/FocusHubPage';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
          <AppDataProvider>
            <FocusTimerProvider>
              <MainApp />
            </FocusTimerProvider>
          </AppDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

const MainApp: React.FC = () => {
  const { theme } = useTheme();
  const { isAuthenticated, loading } = useAuth();
  
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.style.backgroundColor = theme === 'dark' ? '#0f172a' : '#f1f5f9';
  }, [theme]);

  if (loading) {
    return (
      <div className="bg-background text-foreground min-h-screen font-sans flex items-center justify-center">
        <Icon name="cog" className="w-16 h-16 text-primary animate-spin" />
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
}

const ProtectedRoutes: React.FC = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/tasks" element={<TasksPage />} />
      <Route path="/classes" element={<ClassesPage />} />
      <Route path="/exams" element={<ExamsPage />} />
      <Route path="/work" element={<WorkPage />} />
      <Route path="/ai-assistant" element={<AiAssistantPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/focus-hub" element={<FocusHubPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </Layout>
);


export default App;