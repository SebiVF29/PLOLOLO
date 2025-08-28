
import React, { useState, useMemo, useCallback } from 'react';
import { useAppData } from '../contexts/AppContext';
import { AppEvent } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import EditEventModal from '../components/modals/EditEventModal';
import { exportToIcs } from '../utils/eventUtils';
import { useTheme } from '../contexts/ThemeContext';
import { getTextColorForBackground } from '../utils/colorUtils';

type ViewMode = 'month' | 'week' | 'day';

const EVENT_TYPES: AppEvent['type'][] = ['class', 'deadline', 'exam', 'office-hours', 'work', 'personal'];

const CalendarPage: React.FC = () => {
  const { events, addEvent, updateEvent, removeEvent } = useAppData();
  const { eventColors } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<AppEvent | null>(null);
  const [modalDate, setModalDate] = useState<Date | undefined>(undefined);
  const [typeFilters, setTypeFilters] = useState<AppEvent['type'][]>([]);

  const filteredEvents = useMemo(() => {
    if (typeFilters.length === 0) return events;
    return events.filter(event => typeFilters.includes(event.type));
  }, [events, typeFilters]);
  
  const handleToggleFilter = (type: AppEvent['type']) => {
    setTypeFilters(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleOpenModal = useCallback((event: AppEvent | null, date?: Date) => {
    setSelectedEvent(event);
    setModalDate(date);
    setIsModalOpen(true);
  }, []);


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setModalDate(undefined);
  };

  const handleSaveEvent = (eventData: AppEvent) => {
    if (selectedEvent) {
      updateEvent(eventData);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...newEventData } = eventData;
      addEvent(newEventData);
    }
    handleCloseModal();
  };

  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      removeEvent(eventId);
      handleCloseModal();
    }
  };

  const changeDate = (amount: number) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') newDate.setDate(newDate.getDate() + amount);
    if (viewMode === 'week') newDate.setDate(newDate.getDate() + amount * 7);
    if (viewMode === 'month') newDate.setMonth(newDate.getMonth() + amount);
    setCurrentDate(newDate);
  };

  const renderHeader = () => {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const weekTitle = startOfWeek.toLocaleDateString([], { month: 'short', day: 'numeric' });

      return (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div className="flex items-center gap-2 sm:gap-4">
                  <Button onClick={() => setCurrentDate(new Date())} variant="ghost">Today</Button>
                  <div className="flex items-center">
                      <button onClick={() => changeDate(-1)} className="p-2 rounded-md hover:bg-foreground/10" aria-label="Previous period"><Icon name="chevron-left" className="w-5 h-5"/></button>
                      <button onClick={() => changeDate(1)} className="p-2 rounded-md hover:bg-foreground/10" aria-label="Next period"><Icon name="chevron-right" className="w-5 h-5"/></button>
                  </div>
                  <h2 className="text-xl md:text-2xl font-semibold text-center w-36 sm:w-48">
                      {viewMode === 'day' && currentDate.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                      {viewMode === 'week' && `Week of ${weekTitle}`}
                      {viewMode === 'month' && currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </h2>
              </div>
              <div className="flex items-center gap-2">
                   <div className="p-1 bg-background rounded-full hidden sm:flex">
                        {(['month', 'week', 'day'] as ViewMode[]).map(v => (
                            <button key={v} onClick={() => setViewMode(v)} className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${viewMode === v ? 'bg-card shadow' : ''}`}>
                                {v}
                            </button>
                        ))}
                   </div>
                   <Button onClick={() => handleOpenModal(null, currentDate)} variant="primary">
                       <Icon name="plus-circle" className="w-5 h-5 hidden sm:block"/> Add Event
                   </Button>
              </div>
          </div>
      );
  };
  
  const renderFilterBar = () => (
      <div className="p-4 rounded-xl bg-card mb-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-semibold mr-2 shrink-0">Filter by:</span>
            {EVENT_TYPES.map(type => (
                <button
                    key={type}
                    onClick={() => handleToggleFilter(type)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all capitalize flex items-center gap-2 ${
                        !typeFilters.includes(type) && 'bg-background text-card-foreground hover:bg-foreground/10'
                    }`}
                     style={typeFilters.includes(type) ? {
                        backgroundColor: eventColors[type],
                        color: getTextColorForBackground(eventColors[type])
                    } : {}}
                >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: eventColors[type] }} />
                    {type.replace('-', ' ')}
                </button>
            ))}
            {typeFilters.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setTypeFilters([])} className="text-accent text-xs">
                    Clear Filters
                </Button>
            )}
        </div>
      </div>
  );
  
  const renderMonthView = useCallback(() => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - monthStart.getDay());
    const endDate = new Date(monthEnd);
    endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()));

    const days = [];
    let day = new Date(startDate);

    while (day <= endDate) {
      days.push(new Date(day));
      day.setDate(day.getDate() + 1);
    }
    const today = new Date();
    const todayDateString = today.toDateString();

    return (
        <div className="grid grid-cols-7 border-l border-t border-foreground/10">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="p-2 text-center font-bold text-foreground/70 text-sm bg-card">{d}</div>
            ))}
            {days.map((d, i) => {
                const isCurrentMonth = d.getMonth() === currentDate.getMonth();
                const isToday = d.toDateString() === todayDateString;
                const eventsOnDay = filteredEvents.filter(e => new Date(e.startTime).toDateString() === d.toDateString());

                return (
                    <div key={i} className={`relative min-h-[120px] p-2 border-r border-b border-foreground/10 ${isCurrentMonth ? 'bg-card' : 'bg-background'} transition-colors duration-300 hover:bg-foreground/5 cursor-pointer`} onClick={() => handleOpenModal(null, d)}>
                        <span className={`absolute top-2 right-2 text-xs sm:text-sm font-semibold ${isToday ? 'bg-primary text-white rounded-full flex items-center justify-center w-6 h-6' : isCurrentMonth ? 'text-foreground' : 'text-foreground/40'}`}>{d.getDate()}</span>
                        <div className="mt-8 space-y-1">
                            {eventsOnDay.slice(0, 3).map(event => (
                                <div key={event.id} onClick={(e) => { e.stopPropagation(); handleOpenModal(event);}} className="p-1 text-xs rounded truncate cursor-pointer" style={{ backgroundColor: eventColors[event.type], color: getTextColorForBackground(eventColors[event.type])}}>
                                    {event.title}
                                </div>
                            ))}
                            {eventsOnDay.length > 3 && <div className="text-xs text-foreground/60 mt-1">+{eventsOnDay.length - 3} more</div>}
                        </div>
                    </div>
                );
            })}
        </div>
    );
  }, [currentDate, filteredEvents, handleOpenModal, eventColors]);
  
  const renderWeekView = useCallback(() => {
    const today = new Date();
    const todayDateString = today.toDateString();
    
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - startOfWeek.getDay());

    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(startOfWeek);
        day.setDate(day.getDate() + i);
        return day;
    });

    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
        <div className="flex overflow-x-auto">
            <div className="w-16 text-right pr-2 sticky left-0 bg-card z-10 border-r border-foreground/10">
                <div className="h-20">&nbsp;</div> 
                {hours.map(hour => (
                    <div key={hour} className="h-[60px] text-xs text-foreground/50 relative -top-3">
                        {hour > 0 && `${hour % 12 === 0 ? 12 : hour % 12} ${hour < 12 ? 'AM' : 'PM'}`}
                    </div>
                ))}
            </div>
            <div className="flex-1 grid grid-cols-7" style={{minWidth: '800px'}}>
                {weekDays.map(day => {
                    const dayEvents = filteredEvents
                        .filter(e => new Date(e.startTime).toDateString() === day.toDateString())
                        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
                    const isToday = day.toDateString() === todayDateString;
                    
                    return (
                        <div key={day.toISOString()} className="border-r border-foreground/10">
                            <div className="h-20 text-center p-2 border-b-2 border-foreground/10 sticky top-0 bg-card z-10">
                                <span className="text-sm font-semibold text-foreground/70">{day.toLocaleDateString([], { weekday: 'short' })}</span>
                                <p className={`text-3xl font-bold ${isToday ? 'text-primary' : 'text-foreground'}`}>{day.getDate()}</p>
                            </div>
                            <div className="relative h-[1440px]">
                                {hours.map(hour => (
                                    <div key={hour} className="h-[60px] border-b border-foreground/10" onClick={() => {
                                        const newEventDate = new Date(day);
                                        newEventDate.setHours(hour);
                                        handleOpenModal(null, newEventDate);
                                    }}></div>
                                ))}
                                {dayEvents.map(event => {
                                    const start = new Date(event.startTime);
                                    const end = new Date(event.endTime);
                                    const top = (start.getHours() * 60 + start.getMinutes());
                                    const height = Math.max(20, (end.getTime() - start.getTime()) / (1000 * 60));
                                    
                                    return (
                                         <div
                                            key={event.id}
                                            className="absolute p-1.5 rounded cursor-pointer flex flex-col overflow-hidden text-xs"
                                            style={{ top: `${top}px`, height: `${height}px`, left: `5%`, width: `90%`, backgroundColor: eventColors[event.type], color: getTextColorForBackground(eventColors[event.type]) }}
                                            onClick={(e) => { e.stopPropagation(); handleOpenModal(event); }}
                                            title={`${event.title} (${new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`}
                                          >
                                            <strong className="font-semibold truncate">{event.title}</strong>
                                            <span className="opacity-80 truncate">{new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
  }, [currentDate, filteredEvents, handleOpenModal, eventColors]);

  const renderDayView = useCallback(() => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const dayEvents = filteredEvents
        .filter(e => new Date(e.startTime).toDateString() === currentDate.toDateString())
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    const positionedEvents = dayEvents.map((event) => {
        const start = new Date(event.startTime);
        const end = new Date(event.endTime);
        const top = (start.getHours() * 60 + start.getMinutes());
        const height = (end.getTime() - start.getTime()) / (1000 * 60);

        return { ...event, top, height: Math.max(20, height) };
    });

    return (
        <div className="flex">
            <div className="w-20 text-right pr-2">
                {hours.map(hour => (
                    <div key={hour} className="h-[60px] text-sm text-foreground/50 relative -top-3">
                        {hour > 0 && <strong>{hour % 12 === 0 ? 12 : hour % 12} {hour < 12 ? 'AM' : 'PM'}</strong>}
                    </div>
                ))}
            </div>
            <div className="flex-1 relative border-l-2 border-foreground/10 h-[1440px]">
                {hours.map(hour => (
                    <div key={hour} className="h-[60px] border-b border-foreground/10" onClick={() => {
                        const newEventDate = new Date(currentDate);
                        newEventDate.setHours(hour);
                        handleOpenModal(null, newEventDate);
                    }}></div>
                ))}
                {positionedEvents.map(event => (
                    <div
                        key={event.id}
                        className="absolute p-2 rounded-lg cursor-pointer flex flex-col overflow-hidden shadow-lg"
                        style={{
                            top: `${event.top}px`,
                            height: `${event.height}px`,
                            left: '10px',
                            right: '10px',
                            backgroundColor: eventColors[event.type], 
                            color: getTextColorForBackground(eventColors[event.type])
                        }}
                        onClick={(e) => { e.stopPropagation(); handleOpenModal(event); }}
                        title={`${event.title} (${new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`}
                    >
                        <strong className="text-sm font-semibold truncate">{event.title}</strong>
                        <span className="text-xs opacity-90 truncate">{new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                         {event.description && <p className="text-xs opacity-80 mt-1 truncate">{event.description}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
  }, [currentDate, filteredEvents, handleOpenModal, eventColors]);


  return (
    <div>
       <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <Button onClick={() => exportToIcs(events)} variant="secondary">
            <Icon name="upload" className="w-5 h-5"/> Export to iCal
        </Button>
      </div>

      <Card>
        {renderHeader()}
        {renderFilterBar()}
        <div className="mt-4">
            {viewMode === 'month' && renderMonthView()}
            {viewMode === 'week' && renderWeekView()}
            {viewMode === 'day' && renderDayView()}
        </div>
      </Card>
      
      {isModalOpen && (
        <EditEventModal
          event={selectedEvent}
          onClose={handleCloseModal}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          defaultDate={modalDate}
        />
      )}
    </div>
  );
};

export default CalendarPage;
