
import React, { useState } from 'react';
import { useAppData } from '../../contexts/AppContext';
import { AppEvent, Task } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Icon } from '../ui/Icon';

type ActiveTab = 'task' | 'event';

const QuickAdd: React.FC = () => {
    const { addTask, addEvent } = useAppData();
    const [activeTab, setActiveTab] = useState<ActiveTab>('task');

    // Task state
    const [taskText, setTaskText] = useState('');
    const [taskTag, setTaskTag] = useState<Task['tag']>('study');

    // Event state
    const [eventTitle, setEventTitle] = useState('');
    const [eventType, setEventType] = useState<AppEvent['type']>('personal');
    const [eventStartTime, setEventStartTime] = useState('');
    const [eventEndTime, setEventEndTime] = useState('');

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!taskText.trim()) return;
        addTask({ text: taskText, tag: taskTag });
        setTaskText('');
    };

    const handleAddEvent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!eventTitle.trim() || !eventStartTime || !eventEndTime) return;
        addEvent({
            title: eventTitle,
            type: eventType,
            startTime: new Date(eventStartTime).toISOString(),
            endTime: new Date(eventEndTime).toISOString()
        });
        setEventTitle('');
        setEventType('personal');
        setEventStartTime('');
        setEventEndTime('');
    };

    const TabButton: React.FC<{ tab: ActiveTab; children: React.ReactNode }> = ({ tab, children }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`w-full text-center p-2 font-semibold transition-colors rounded-t-lg ${
                activeTab === tab ? 'bg-card text-primary' : 'bg-background hover:bg-foreground/5'
            }`}
        >
            {children}
        </button>
    );

    return (
        <Card className="flex flex-col">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Icon name="plus-circle" className="w-6 h-6 text-primary" /> Quick Add
            </h2>
            <div className="flex-grow flex flex-col">
                <div className="grid grid-cols-2 gap-1 bg-background rounded-t-lg">
                    <TabButton tab="task">Task</TabButton>
                    <TabButton tab="event">Event</TabButton>
                </div>
                
                {activeTab === 'task' ? (
                    <form onSubmit={handleAddTask} className="space-y-3 p-4 bg-card rounded-b-lg flex-grow flex flex-col">
                        <Input
                            placeholder="e.g., Read chapter 5"
                            value={taskText}
                            onChange={(e) => setTaskText(e.target.value)}
                            required
                        />
                        <select
                            value={taskTag}
                            onChange={(e) => setTaskTag(e.target.value as Task['tag'])}
                             className="w-full p-3 bg-background border border-foreground/10 rounded-lg text-card-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        >
                            {(['study', 'personal', 'group', 'urgent'] as Task['tag'][]).map(tag => (
                                <option key={tag} value={tag} className="capitalize">{tag}</option>
                            ))}
                        </select>
                        <Button type="submit" className="w-full mt-auto">Add Task</Button>
                    </form>
                ) : (
                    <form onSubmit={handleAddEvent} className="space-y-3 p-4 bg-card rounded-b-lg flex-grow flex flex-col">
                        <Input
                            placeholder="e.g., Study group meeting"
                            value={eventTitle}
                            onChange={(e) => setEventTitle(e.target.value)}
                            required
                        />
                        <select
                            value={eventType}
                            onChange={(e) => setEventType(e.target.value as AppEvent['type'])}
                             className="w-full p-3 bg-background border border-foreground/10 rounded-lg text-card-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        >
                            {(['class', 'deadline', 'exam', 'office-hours', 'work', 'personal'] as AppEvent['type'][]).map(type => (
                                <option key={type} value={type} className="capitalize">{type.replace('-', ' ')}</option>
                            ))}
                        </select>
                        <Input type="datetime-local" value={eventStartTime} onChange={(e) => setEventStartTime(e.target.value)} required />
                        <Input type="datetime-local" value={eventEndTime} onChange={(e) => setEventEndTime(e.target.value)} required />
                        <Button type="submit" className="w-full mt-auto">Add Event</Button>
                    </form>
                )}
            </div>
        </Card>
    );
};

export default QuickAdd;
