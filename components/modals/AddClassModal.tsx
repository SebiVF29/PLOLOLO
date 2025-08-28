
import React, { useState } from 'react';
import { useAppData } from '../../contexts/AppContext';
import { ClassInfo } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Icon } from '../ui/Icon';

interface AddClassModalProps {
  onClose: () => void;
}

const AddClassModal: React.FC<AddClassModalProps> = ({ onClose }) => {
    const { addClass } = useAppData();
    const [formData, setFormData] = useState({
        name: '',
        professor: '',
        location: '',
        startTime: '09:00',
        endTime: '10:00',
        semesterStart: '',
        semesterEnd: ''
    });
    const [selectedDays, setSelectedDays] = useState<ClassInfo['days']>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDayChange = (day: ClassInfo['days'][0]) => {
        setSelectedDays(prev => 
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedDays.length === 0 || !formData.semesterStart || !formData.semesterEnd) {
            alert('Please select at least one day and set semester dates.');
            return;
        }
        addClass({ ...formData, days: selectedDays });
        onClose();
    };

    const daysOfWeek: ClassInfo['days'] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <Card className="w-full max-w-2xl animate-fade-in-up" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Add New Class</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-foreground/10">
                        <Icon name="close" className="w-6 h-6"/>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input label="Class Name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Intro to Psychology" required />
                        <Input label="Professor" name="professor" value={formData.professor} onChange={handleChange} placeholder="e.g., Dr. Smith" required />
                    </div>
                    <Input label="Location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., Building 5, Room 101" required />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input label="Start Time" name="startTime" type="time" value={formData.startTime} onChange={handleChange} required />
                        <Input label="End Time" name="endTime" type="time" value={formData.endTime} onChange={handleChange} required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground/80 mb-2">Days of the Week</label>
                        <div className="flex flex-wrap gap-2">
                            {daysOfWeek.map(day => (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => handleDayChange(day)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors border-2 ${
                                        selectedDays.includes(day) 
                                        ? 'bg-primary border-primary text-white' 
                                        : 'bg-transparent border-foreground/20 hover:border-primary'
                                    }`}
                                >
                                    {day.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input label="Semester Start Date" name="semesterStart" type="date" value={formData.semesterStart} onChange={handleChange} required />
                        <Input label="Semester End Date" name="semesterEnd" type="date" value={formData.semesterEnd} onChange={handleChange} required />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="primary">Add Class & Populate Calendar</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default AddClassModal;
