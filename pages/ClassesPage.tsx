
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
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Your Classes</h1>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Icon name="book-open" className="w-5 h-5"/> Add Class
                </Button>
            </div>

            <Card>
                <h2 className="text-2xl font-bold mb-4">Semester Schedule</h2>
                {classes.length > 0 ? (
                    <ul className="space-y-4">
                        {classes.map(cls => (
                            <li key={cls.id} className="p-4 bg-background rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-primary">{cls.name}</h3>
                                    <p className="text-sm text-foreground/80"><strong>Prof:</strong> {cls.professor}</p>
                                    <p className="text-sm text-foreground/80"><strong>Location:</strong> {cls.location}</p>
                                    <p className="text-sm text-foreground/80">
                                        <strong>Schedule:</strong> {formatDays(cls.days)} at {formatTime(cls.startTime)} - {formatTime(cls.endTime)}
                                    </p>
                                </div>
                                <Button variant="ghost" className="text-accent self-start sm:self-center" onClick={() => handleRemoveClass(cls.id)}>
                                    <Icon name="trash" className="w-5 h-5"/> Remove
                                </Button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-12">
                        <Icon name="book-open" className="w-16 h-16 mx-auto text-primary mb-4" />
                        <h2 className="text-xl font-bold">No Classes Added Yet</h2>
                        <p className="mt-2 text-foreground/70">Add your classes to automatically populate your calendar.</p>
                    </div>
                )}
            </Card>

            {isModalOpen && <AddClassModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default ClassesPage;
