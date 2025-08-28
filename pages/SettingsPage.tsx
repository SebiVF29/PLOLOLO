
import React, { useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAppData } from '../contexts/AppContext';
import { exportToIcs } from '../utils/eventUtils';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { AppEvent } from '../types';

const EVENT_TYPES: AppEvent['type'][] = ['class', 'deadline', 'exam', 'office-hours', 'work', 'personal'];

const SettingsPage: React.FC = () => {
  const { 
    theme, toggleTheme, background, setBackground, 
    eventColors, updateEventColor, isBackgroundBlurred, toggleBackgroundBlur 
  } = useTheme();
  const { events, tasks } = useAppData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackground(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleExportTasks = () => {
    const fileContent = "Chronofy To-Do List\n\n" +
        "To-Do:\n" +
        tasks.filter(t => !t.completed).map(t => `- [ ] ${t.emoji ? `${t.emoji} ` : ''}${t.text} (${t.tag})`).join('\n') +
        "\n\nCompleted:\n" +
        tasks.filter(t => t.completed).map(t => `- [x] ${t.emoji ? `${t.emoji} ` : ''}${t.text} (${t.tag})`).join('\n');
    
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'chronofy_todos.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const defaultBackgrounds = [
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1973&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
            <Card>
              <h2 className="text-2xl font-bold mb-4">Appearance</h2>
              <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-medium">Theme</p>
                    <div className="flex items-center gap-2 p-1 bg-background rounded-full">
                      <button onClick={() => theme === 'dark' && toggleTheme()} className={`px-4 py-1.5 rounded-full text-sm font-semibold ${theme === 'light' ? 'bg-card shadow' : ''}`}>Light</button>
                      <button onClick={() => theme === 'light' && toggleTheme()} className={`px-4 py-1.5 rounded-full text-sm font-semibold ${theme === 'dark' ? 'bg-card shadow' : ''}`}>Dark</button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-medium">Background Blur</p>
                     <button onClick={toggleBackgroundBlur} className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isBackgroundBlurred ? 'bg-primary' : 'bg-foreground/20'}`}>
                        <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${isBackgroundBlurred ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
              </div>
            </Card>
            <Card>
              <h2 className="text-2xl font-bold mb-4">Event Colors</h2>
               <div className="space-y-3">
                {EVENT_TYPES.map(type => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="capitalize font-medium">{type.replace('-', ' ')}</span>
                    <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full" style={{ backgroundColor: eventColors[type] }}></span>
                        <input
                            type="color"
                            value={eventColors[type]}
                            onChange={(e) => updateEventColor(type, e.target.value)}
                            className="w-10 h-8 p-0 border-none rounded cursor-pointer bg-transparent"
                            title={`Select color for ${type}`}
                        />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
        </div>

        <div className="space-y-6">
            <Card>
              <h2 className="text-2xl font-bold mb-4">Customize Background</h2>
              <div className="space-y-4">
                <div>
                  <input type="file" ref={fileInputRef} onChange={handleBackgroundUpload} accept="image/*" className="hidden" />
                  <Button onClick={() => fileInputRef.current?.click()} variant="secondary">
                    <Icon name="upload" className="w-5 h-5"/> Upload Your Own Image
                  </Button>
                </div>
                {background && (<Button onClick={() => setBackground(null)} variant="ghost" className="text-accent">Remove Background</Button>)}
                <div>
                  <p className="mb-2 text-foreground/80">Or choose one of our defaults:</p>
                  <div className="flex gap-4">
                    {defaultBackgrounds.map((url) => (
                      <button key={url} onClick={() => setBackground(url)} className={`w-24 h-16 rounded-lg overflow-hidden border-2 hover:border-primary focus:border-primary focus:outline-none ${background === url ? 'border-primary' : 'border-transparent'}`}>
                        <img src={url} alt="Default background option" className="w-full h-full object-cover"/>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
            <Card>
              <h2 className="text-2xl font-bold mb-4">Data & Export</h2>
              <div className="space-y-4">
                  <p className="text-foreground/70">Export your data to use in other applications.</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                      <Button onClick={() => exportToIcs(events)} variant="secondary">
                          <Icon name="calendar" className="w-5 h-5"/> Export Calendar (.ics)
                      </Button>
                      <Button onClick={handleExportTasks} variant="secondary">
                          <Icon name="check-circle" className="w-5 h-5"/> Export To-Do List (.txt)
                      </Button>
                  </div>
              </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
