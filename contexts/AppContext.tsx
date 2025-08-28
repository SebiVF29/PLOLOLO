

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { AppEvent, Task, ClassInfo } from '../types';

interface AppDataContextType {
  events: AppEvent[];
  tasks: Task[];
  classes: ClassInfo[];
  addEvent: (event: Omit<AppEvent, 'id'>) => void;
  updateEvent: (event: AppEvent) => void;
  removeEvent: (eventId: string) => void;
  addEvents: (newEvents: AppEvent[]) => void;
  addTask: (task: Omit<Task, 'id' | 'completed' | 'completedAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Omit<Task, 'id'>>) => void;
  toggleTask: (taskId: string) => void;
  removeTask: (taskId: string) => void;
  addClass: (classInfo: Omit<ClassInfo, 'id'>) => void;
  removeClass: (classId: string) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

const initialEvents: AppEvent[] = [];

const initialTasks: Task[] = [];

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<AppEvent[]>(() => {
    const saved = localStorage.getItem('chronofy-events');
    try {
      return saved ? JSON.parse(saved) : initialEvents;
    } catch {
      return initialEvents;
    }
  });
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('chronofy-tasks');
    try {
      return saved ? JSON.parse(saved) : initialTasks;
    } catch {
      return initialTasks;
    }
  });
  const [classes, setClasses] = useState<ClassInfo[]>(() => {
    const saved = localStorage.getItem('chronofy-classes');
    try {
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('chronofy-events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('chronofy-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('chronofy-classes', JSON.stringify(classes));
  }, [classes]);

  const addEvent = (event: Omit<AppEvent, 'id'>) => {
    const newEvent = { ...event, id: new Date().toISOString() + Math.random() };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (updatedEvent: AppEvent) => {
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };

  const removeEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const addEvents = (newEvents: AppEvent[]) => {
    setEvents(prev => [...prev, ...newEvents]);
  };

  const addTask = (task: Omit<Task, 'id' | 'completed' | 'completedAt'>) => {
    const newTask = { ...task, id: new Date().toISOString(), completed: false };
    setTasks(prev => [newTask, ...prev]);
  };
  
  const updateTask = (taskId: string, updates: Partial<Omit<Task, 'id'>>) => {
    setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, ...updates } : t
    ));
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const isCompleted = !t.completed;
        return { ...t, completed: isCompleted, completedAt: isCompleted ? new Date().toISOString() : undefined };
      }
      return t;
    }));
  };
  
  const removeTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const addClass = (classInfo: Omit<ClassInfo, 'id'>) => {
    const newClass = { ...classInfo, id: new Date().toISOString() + Math.random() };
    
    const generatedEvents: AppEvent[] = [];
    const dayMap = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
    
    let current = new Date(newClass.semesterStart);
    // Add timezone offset to avoid date shifting issues
    current.setMinutes(current.getMinutes() + current.getTimezoneOffset());
    const end = new Date(newClass.semesterEnd);
    end.setMinutes(end.getMinutes() + end.getTimezoneOffset());

    while (current <= end) {
        const dayOfWeek = current.getDay();
        const dayName = Object.keys(dayMap).find(key => dayMap[key as keyof typeof dayMap] === dayOfWeek) as keyof typeof dayMap;

        if (newClass.days.includes(dayName)) {
            const [startHour, startMinute] = newClass.startTime.split(':').map(Number);
            const [endHour, endMinute] = newClass.endTime.split(':').map(Number);
            
            const eventStart = new Date(current);
            eventStart.setHours(startHour, startMinute, 0, 0);

            const eventEnd = new Date(current);
            eventEnd.setHours(endHour, endMinute, 0, 0);

            generatedEvents.push({
                id: `${newClass.id}-${current.toISOString().split('T')[0]}`,
                classId: newClass.id,
                title: newClass.name,
                type: 'class',
                startTime: eventStart.toISOString(),
                endTime: eventEnd.toISOString(),
                description: `Professor: ${newClass.professor}\nLocation: ${newClass.location}`
            });
        }
        current.setDate(current.getDate() + 1);
    }
    
    setClasses(prev => [...prev, newClass]);
    addEvents(generatedEvents);
  };

  const removeClass = (classId: string) => {
    setClasses(prev => prev.filter(c => c.id !== classId));
    setEvents(prev => prev.filter(e => e.classId !== classId));
  };

  return (
    <AppDataContext.Provider value={{ events, tasks, classes, addEvent, updateEvent, removeEvent, addEvents, addTask, updateTask, toggleTask, removeTask, addClass, removeClass }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = (): AppDataContextType => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};
