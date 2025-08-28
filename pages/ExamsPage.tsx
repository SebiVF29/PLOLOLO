
import React, { useState } from 'react';
import { useAppData } from '../contexts/AppContext';
import { AppEvent } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import EditEventModal from '../components/modals/EditEventModal';
import { useTheme } from '../contexts/ThemeContext';
import { getTextColorForBackground } from '../utils/colorUtils';

const ExamsPage: React.FC = () => {
  const { events, addEvent, updateEvent, removeEvent } = useAppData();
  const { eventColors } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<AppEvent | null>(null);

  const examEvents = events.filter(e => e.type === 'exam').sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const handleOpenModal = (event: AppEvent | null) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleSaveEvent = (eventData: AppEvent) => {
    if (selectedEvent) {
      updateEvent(eventData);
    } else {
      // Ensure the type is set to 'exam' for new events from this page
      addEvent({ ...eventData, type: 'exam' });
    }
    handleCloseModal();
  };

  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this exam entry?')) {
      removeEvent(eventId);
      handleCloseModal();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tests & Exams</h1>
        <Button onClick={() => handleOpenModal(null)}>
          <Icon name="academic-cap" className="w-5 h-5"/> Add Exam
        </Button>
      </div>

      <Card>
        <h2 className="text-2xl font-bold mb-4">Your Upcoming Exams</h2>
        {examEvents.length > 0 ? (
          <ul className="space-y-3">
            {examEvents.map(event => {
                const bgColor = eventColors[event.type];
                const textColor = getTextColorForBackground(bgColor);
                return (
                  <li 
                    key={event.id} 
                    className="flex items-center justify-between p-4 rounded-lg"
                    style={{ backgroundColor: bgColor, color: textColor }}
                  >
                    <div>
                      <p className="font-bold text-lg">{event.title}</p>
                      <p className="text-sm opacity-90">
                        {new Date(event.startTime).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}
                      </p>
                      {event.description && <p className="text-sm mt-1">{event.description}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" className="p-2" style={{ color: textColor }} onClick={() => handleOpenModal(event)}>
                        <Icon name="pencil" className="w-5 h-5"/>
                      </Button>
                      <Button variant="ghost" className="p-2" style={{ color: textColor, opacity: 0.8 }} onClick={() => removeEvent(event.id)}>
                        <Icon name="trash" className="w-5 h-5"/>
                      </Button>
                    </div>
                  </li>
                )
            })}
          </ul>
        ) : (
          <div className="text-center py-12">
            <Icon name="academic-cap" className="w-16 h-16 mx-auto text-primary mb-4" />
            <h2 className="text-xl font-bold">No Exams Logged</h2>
            <p className="mt-2 text-foreground/70">Add your upcoming exams to start tracking them.</p>
          </div>
        )}
      </Card>
      
      {isModalOpen && (
        <EditEventModal
          event={selectedEvent}
          onClose={handleCloseModal}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          defaultType="exam"
        />
      )}
    </div>
  );
};

export default ExamsPage;
