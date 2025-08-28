
import React, { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAppData } from '../contexts/AppContext';
import Card from '../components/ui/Card';
import { AppEvent, Task } from '../types';
import { Icon } from '../components/ui/Icon';
import QuickAdd from '../components/dashboard/QuickAdd';
import Gamification from '../components/dashboard/Gamification';
import { useTheme } from '../contexts/ThemeContext';
import { getTextColorForBackground } from '../utils/colorUtils';

const ProductivityTracker: React.FC = () => {
    const { tasks, events } = useAppData();
    const { eventColors } = useTheme();

    const stats = useMemo(() => {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const tasksCompletedThisWeek = tasks.filter(task => 
            task.completed && task.completedAt && new Date(task.completedAt) > oneWeekAgo
        ).length;

        const scheduledHoursByCategory = events.reduce((acc, event) => {
            const start = new Date(event.startTime);
            if (start < oneWeekAgo) return acc; // Only count events from the last week

            const duration = (new Date(event.endTime).getTime() - start.getTime()) / (1000 * 60 * 60);
            if(duration > 0) {
                acc[event.type] = (acc[event.type] || 0) + duration;
            }
            return acc;
        }, {} as Record<AppEvent['type'], number>);

        const totalHours = Object.values(scheduledHoursByCategory).reduce((sum, hours) => sum + hours, 0);

        return { tasksCompletedThisWeek, scheduledHoursByCategory, totalHours };
    }, [tasks, events]);

    return (
        <Card>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Icon name="sparkles" className="w-6 h-6 text-accent" /> Weekly Progress
            </h2>
            <div className="space-y-4">
                <div>
                    <p className="text-lg font-semibold">{stats.tasksCompletedThisWeek}</p>
                    <p className="text-sm text-foreground/70">Tasks completed this week</p>
                </div>
                <div>
                    <p className="text-lg font-semibold">{stats.totalHours.toFixed(1)} hours</p>
                    <p className="text-sm text-foreground/70">Scheduled this week</p>
                    {stats.totalHours > 0 && (
                        <div className="mt-2 w-full bg-background rounded-full h-4 flex overflow-hidden">
                            {Object.entries(stats.scheduledHoursByCategory).map(([type, hours]) => (
                                <div
                                    key={type}
                                    style={{ 
                                        width: `${(hours / stats.totalHours) * 100}%`,
                                        backgroundColor: eventColors[type as AppEvent['type']]
                                    }}
                                    title={`${type.charAt(0).toUpperCase() + type.slice(1)}: ${hours.toFixed(1)} hrs`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};


const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { events, tasks } = useAppData();
  const { eventColors } = useTheme();

  const today = new Date();
  
  const upcomingEvents = events
    .filter(event => new Date(event.startTime) >= today)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 3);
  
  const todaysTasks = tasks.filter(task => !task.completed).slice(0, 4);

  const getGreeting = () => {
    const hour = today.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const quotes = [
    "The secret of getting ahead is getting started.",
    "Believe you can and you're halfway there.",
    "The future depends on what you do today.",
    "Well done is better than well said."
  ];
  const dailyQuote = quotes[new Date().getDate() % quotes.length];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground">
          {getGreeting()}, {user?.name}!
        </h1>
        <p className="text-lg text-foreground/70 mt-1">
          Ready to conquer today? Here’s what’s on your plate.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Icon name="calendar" className="w-6 h-6 text-primary" /> Upcoming Events</h2>
          {upcomingEvents.length > 0 ? (
            <ul className="space-y-4">
              {upcomingEvents.map(event => {
                 const bgColor = eventColors[event.type];
                 const textColor = getTextColorForBackground(bgColor);
                return (
                <li key={event.id} className="flex items-center gap-4 p-3 rounded-lg bg-background">
                  <div 
                     className="flex-shrink-0 w-12 h-12 rounded-lg flex flex-col items-center justify-center"
                     style={{ backgroundColor: bgColor, color: textColor }}
                  >
                     <span className="text-xs font-bold uppercase">{new Date(event.startTime).toLocaleString('default', { month: 'short' })}</span>
                     <span className="text-lg font-bold">{new Date(event.startTime).getDate()}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{event.title}</p>
                    <p className="text-sm text-foreground/70">{formatDate(event.startTime)} - {formatDate(event.endTime)}</p>
                  </div>
                </li>
              )})}
            </ul>
          ) : (
            <p className="text-foreground/70">No upcoming events. Time to relax or get ahead!</p>
          )}
        </Card>

        <Card>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Icon name="check-circle" className="w-6 h-6 text-secondary" /> Today's To-Dos</h2>
          {todaysTasks.length > 0 ? (
            <ul className="space-y-3">
              {todaysTasks.map(task => (
                <li key={task.id} className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-secondary rounded-full" />
                  <p className="text-card-foreground">{task.text}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-foreground/70">All tasks are done. Great job!</p>
          )}
        </Card>
      </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuickAdd />
            <Gamification />
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-r from-secondary to-accent text-white">
              <h3 className="text-xl font-semibold">Quote of the Day</h3>
              <p className="text-2xl mt-2 italic">"{dailyQuote}"</p>
           </Card>
           <ProductivityTracker />
      </div>
    </div>
  );
};

export default DashboardPage;