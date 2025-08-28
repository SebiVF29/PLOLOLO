
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Icon } from '../ui/Icon';

const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', icon: 'home', text: 'Dashboard' },
    { to: '/calendar', icon: 'calendar', text: 'Calendar' },
    { to: '/tasks', icon: 'check-circle', text: 'To-Do List' },
    { to: '/focus-hub', icon: 'clock', text: 'Focus Hub' },
    { to: '/classes', icon: 'book-open', text: 'Classes' },
    { to: '/exams', icon: 'academic-cap', text: 'Exams' },
    { to: '/work', icon: 'briefcase', text: 'Work' },
    { to: '/ai-assistant', icon: 'sparkles', text: 'AI Assistant' },
    { to: '/settings', icon: 'cog', text: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-card text-card-foreground p-4 flex flex-col shadow-lg">
      <div className="flex items-center gap-2 mb-8">
        <Icon name="academic-cap" className="w-8 h-8 text-primary"/>
        <h1 className="text-2xl font-bold text-primary">Chronofy</h1>
      </div>
      <nav className="flex-1">
        <ul>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 my-1 rounded-lg transition-colors duration-200 ${
                    isActive ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-foreground/5'
                  }`
                }
              >
                <Icon name={item.icon as any} className="w-5 h-5" />
                <span>{item.text}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto">
        <div className="p-3 mb-4 rounded-lg bg-background">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-foreground">{user?.name}</p>
              <p className="text-xs text-foreground/60">{user?.email}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
            <button onClick={toggleTheme} className="flex items-center gap-2 p-2 rounded-lg hover:bg-foreground/10">
                <Icon name={theme === 'dark' ? 'sun' : 'moon'} className="w-5 h-5"/>
                <span>{theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 p-2 rounded-lg hover:bg-foreground/10 text-accent">
              <Icon name="logout" className="w-5 h-5" />
              <span>Logout</span>
            </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;