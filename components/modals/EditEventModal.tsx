
import React, { useState, useEffect, useRef } from 'react';
import { AppEvent, FileAttachment } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Icon } from '../ui/Icon';

interface EditEventModalProps {
  event: AppEvent | null;
  onClose: () => void;
  onSave: (event: AppEvent) => void;
  onDelete: (eventId: string) => void;
  defaultType?: AppEvent['type'];
  defaultDate?: Date;
}

const EditEventModal: React.FC<EditEventModalProps> = ({ event, onClose, onSave, onDelete, defaultType = 'personal', defaultDate }) => {
  const [formData, setFormData] = useState<Omit<AppEvent, 'id' | 'attachments'>>({
    title: '',
    type: defaultType,
    startTime: '',
    endTime: '',
    description: ''
  });
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        type: event.type,
        startTime: new Date(new Date(event.startTime).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
        endTime: new Date(new Date(event.endTime).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
        description: event.description || ''
      });
      setAttachments(event.attachments || []);
    } else {
        const baseDate = defaultDate ? new Date(defaultDate) : new Date();
        
        const start = new Date(baseDate);
        start.setHours(9, 0, 0, 0); // Default to 9 AM
        start.setMinutes(start.getMinutes() - start.getTimezoneOffset());
        
        const end = new Date(start);
        end.setHours(end.getHours() + 1);

        setFormData(prev => ({
            ...prev, 
            type: defaultType, 
            startTime: start.toISOString().slice(0,16), 
            endTime: end.toISOString().slice(0,16)
        }));
        setAttachments([]);
    }
  }, [event, defaultType, defaultDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({ name: file.name, type: file.type }));
      setAttachments(prev => [...prev, ...newFiles]);
    }
    // Reset file input to allow selecting the same file again
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (fileName: string) => {
    setAttachments(prev => prev.filter(f => f.name !== fileName));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.startTime || !formData.endTime) {
        alert("Please set a start and end time.");
        return;
    }
    const finalEvent: AppEvent = {
      ...formData,
      id: event ? event.id : new Date().toISOString(), // Use existing id or create new one
      startTime: new Date(formData.startTime).toISOString(),
      endTime: new Date(formData.endTime).toISOString(),
      attachments: formData.type === 'exam' ? attachments : [],
    };
    onSave(finalEvent);
  };
  
  const eventTypes: AppEvent['type'][] = ['class', 'deadline', 'exam', 'office-hours', 'work', 'personal'];

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-lg animate-fade-in-up"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{event ? 'Edit Event' : 'Add New Event'}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-foreground/10">
            <Icon name="close" className="w-6 h-6"/>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Event Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Start Time"
              name="startTime"
              type="datetime-local"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
            <Input
              label="End Time"
              name="endTime"
              type="datetime-local"
              value={formData.endTime}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-foreground/80 mb-1">Event Type</label>
            <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-3 bg-card border border-foreground/10 rounded-lg text-card-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            >
                {eventTypes.map(type => (
                    <option key={type} value={type} className="capitalize">{type.replace('-', ' ')}</option>
                ))}
            </select>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-foreground/80 mb-1">Description (Optional)</label>
            <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 bg-card border border-foreground/10 rounded-lg text-card-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            />
          </div>

          {formData.type === 'exam' && (
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">Exam Materials</label>
              <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>
                  <Icon name="paper-clip" className="w-5 h-5"/> Attach Files
              </Button>
              <ul className="mt-2 space-y-1 max-h-24 overflow-y-auto">
                  {attachments.map(file => (
                      <li key={file.name} className="flex items-center justify-between text-sm bg-background p-2 rounded-md">
                          <span className="truncate" title={file.name}>{file.name}</span>
                          <button type="button" onClick={() => removeAttachment(file.name)} className="text-accent ml-2 flex-shrink-0">
                              <Icon name="trash" className="w-4 h-4"/>
                          </button>
                      </li>
                  ))}
              </ul>
              <p className="text-xs text-foreground/60 mt-2">For demo purposes, only file names are stored.</p>
            </div>
          )}

          <div className="flex justify-between items-center pt-4">
             {event && (
              <Button type="button" variant="ghost" className="text-accent" onClick={() => onDelete(event.id)}>
                <Icon name="trash" className="w-5 h-5" /> Delete
              </Button>
            )}
            <div className="flex-grow" />
            <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="primary">Save</Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditEventModal;
