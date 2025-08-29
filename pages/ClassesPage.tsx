
import React, { useState } from 'react';
import { useAppData } from '../contexts/AppContext';
import { ClassInfo } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import AddClassModal from '../components/modals/AddClassModal';

const ClassesPage: React.FC = () => {
    const { classes, removeClass } = useAppData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleRemoveClass = (classId: string) => {
        if (window.confirm('Are you sure you want to remove this class? This will delete all its recurring events from your calendar.')) {
            removeClass(classId);
        }
    };

    const formatTime = (time: string) => {
        const [hour, minute] = time.split(':');
        const d = new Date();
        d.setHours(parseInt(hour), parseInt(minute));
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDays = (days: ClassInfo['days']) => {
        return days.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Your Classes</h1>
                    <p className="text-foreground/70 mt-1">Manage your semester schedule and class information</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                    <Icon name="plus" className="w-5 h-5"/> Add New Class
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Icon name="book-open" className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">{classes.length}</p>
                            <p className="text-sm text-foreground/70">Total Classes</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-secondary/10 rounded-lg">
                            <Icon name="calendar" className="w-6 h-6 text-secondary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">{classes.reduce((acc, cls) => acc + cls.days.length, 0)}</p>
                            <p className="text-sm text-foreground/70">Weekly Sessions</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent/10 rounded-lg">
                            <Icon name="clock" className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">
                                {classes.reduce((acc, cls) => {
                                    const start = new Date(`2000-01-01T${cls.startTime}`);
                                    const end = new Date(`2000-01-01T${cls.endTime}`);
                                    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                                    return acc + (duration * cls.days.length);
                                }, 0).toFixed(1)}h
                            </p>
                            <p className="text-sm text-foreground/70">Weekly Hours</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Classes List */}
            <Card>
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">Semester Schedule</h2>
                    {classes.length > 0 ? (
                        <div className="space-y-4">
                            {classes.map(cls => (
                                <div key={cls.id} className="p-4 bg-background/50 rounded-lg border border-border">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-primary mb-2">{cls.name}</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-foreground/80">
                                                <p><Icon name="user" className="w-4 h-4 inline mr-2"/><strong>Professor:</strong> {cls.professor}</p>
                                                <p><Icon name="map-pin" className="w-4 h-4 inline mr-2"/><strong>Location:</strong> {cls.location}</p>
                                                <p><Icon name="calendar" className="w-4 h-4 inline mr-2"/><strong>Days:</strong> {formatDays(cls.days)}</p>
                                                <p><Icon name="clock" className="w-4 h-4 inline mr-2"/><strong>Time:</strong> {formatTime(cls.startTime)} - {formatTime(cls.endTime)}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleRemoveClass(cls.id)}>
                                            <Icon name="trash" className="w-4 h-4 mr-2"/> Remove
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="mb-4">
                                <Icon name="book-open" className="w-16 h-16 mx-auto text-primary/50" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">No Classes Added Yet</h3>
                            <p className="text-foreground/70 mb-6 max-w-md mx-auto">
                                Start by adding your classes to automatically populate your calendar and track your schedule.
                            </p>
                            <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 mx-auto">
                                <Icon name="plus" className="w-5 h-5"/> Add Your First Class
                            </Button>
                        </div>
                    )}
                </div>
            </Card>

            {isModalOpen && <AddClassModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default ClassesPage;
