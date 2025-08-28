
export type Theme = 'light' | 'dark';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface FileAttachment {
    name: string;
    type: string;
    // In a real app, this might be a URL or ID from a storage service.
    // For this demo, we'll just store the name and type.
}

export interface AppEvent {
  id: string;
  title: string;
  type: 'class' | 'deadline' | 'exam' | 'office-hours' | 'work' | 'personal';
  startTime: string; // ISO string
  endTime: string;   // ISO string
  description?: string;
  attachments?: FileAttachment[];
  classId?: string; // To link recurring events to a class
}

export interface Task {
  id:string;
  text: string;
  emoji?: string;
  completed: boolean;
  tag: string;
  dueDate?: string; // ISO string
  completedAt?: string; // ISO string for tracking when it was completed
}

export interface SyllabusData {
  recipeName: string;
  ingredients: string[];
}

export interface ExtractedEvent {
    eventName: string;
    date: string; // "YYYY-MM-DD"
    time: string; // "HH:MM"
    eventType: 'class' | 'deadline' | 'exam' | 'office-hours';
}

export interface ClassInfo {
    id: string;
    name: string;
    professor: string;
    location: string;
    days: ('sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat')[];
    startTime: string; // "HH:MM"
    endTime: string;   // "HH:MM"
    semesterStart: string; // "YYYY-MM-DD"
    semesterEnd: string;   // "YYYY-MM-DD"
}