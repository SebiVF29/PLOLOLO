import { AppEvent } from '../types';

// Function to format date for iCalendar spec (YYYYMMDDTHHMMSSZ)
const toIcsDate = (isoString: string): string => {
  return new Date(isoString).toISOString().replace(/[-:.]/g, '').slice(0, -4) + 'Z';
};

export const exportToIcs = (events: AppEvent[]) => {
  const calHeader = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Chronofy//Smart Student Agenda//EN',
  ].join('\r\n');

  const calFooter = 'END:VCALENDAR';

  const eventItems = events.map(event => {
    return [
      'BEGIN:VEVENT',
      `UID:${event.id}@chronofy.app`,
      `DTSTAMP:${toIcsDate(new Date().toISOString())}`,
      `DTSTART:${toIcsDate(event.startTime)}`,
      `DTEND:${toIcsDate(event.endTime)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description || ''}`,
      'END:VEVENT'
    ].join('\r\n');
  }).join('\r\n');

  const icsString = `${calHeader}\r\n${eventItems}\r\n${calFooter}`;

  const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'chronofy_calendar.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
