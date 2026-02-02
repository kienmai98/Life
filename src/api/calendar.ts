import RNCalendarEvents from 'react-native-calendar-events';
import { CalendarEvent } from '../types';
import { Platform } from 'react-native';

class CalendarService {
  async requestPermission(): Promise<boolean> {
    try {
      const status = await RNCalendarEvents.checkPermissions();
      if (status !== 'authorized') {
        const newStatus = await RNCalendarEvents.requestPermissions();
        return newStatus === 'authorized';
      }
      return true;
    } catch (error) {
      console.error('Calendar permission error:', error);
      return false;
    }
  }

  async checkPermission(): Promise<boolean> {
    try {
      const status = await RNCalendarEvents.checkPermissions();
      return status === 'authorized';
    } catch (error) {
      console.error('Calendar check permission error:', error);
      return false;
    }
  }

  async fetchCalendars(): Promise<any[]> {
    try {
      const calendars = await RNCalendarEvents.findCalendars();
      return calendars;
    } catch (error) {
      console.error('Fetch calendars error:', error);
      throw error;
    }
  }

  async fetchEvents(startDate: Date, endDate: Date, calendarIds?: string[]): Promise<CalendarEvent[]> {
    try {
      const events = await RNCalendarEvents.fetchAllEvents(
        startDate.toISOString(),
        endDate.toISOString(),
        calendarIds
      );

      return events.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        location: event.location,
        isAllDay: event.allDay,
        calendarId: event.calendar?.id || '',
        color: event.calendar?.color,
      }));
    } catch (error) {
      console.error('Fetch events error:', error);
      throw error;
    }
  }

  async createEvent(event: Partial<CalendarEvent>): Promise<string> {
    try {
      const eventId = await RNCalendarEvents.saveEvent(event.title || '', {
        startDate: event.startDate,
        endDate: event.endDate,
        description: event.description,
        location: event.location,
        allDay: event.isAllDay,
        calendarId: event.calendarId,
      });
      return eventId;
    } catch (error) {
      console.error('Create event error:', error);
      throw error;
    }
  }

  async updateEvent(eventId: string, event: Partial<CalendarEvent>): Promise<string> {
    try {
      const updatedId = await RNCalendarEvents.saveEvent(event.title || '', {
        id: eventId,
        startDate: event.startDate,
        endDate: event.endDate,
        description: event.description,
        location: event.location,
        allDay: event.isAllDay,
        calendarId: event.calendarId,
      });
      return updatedId;
    } catch (error) {
      console.error('Update event error:', error);
      throw error;
    }
  }

  async deleteEvent(eventId: string): Promise<boolean> {
    try {
      await RNCalendarEvents.removeEvent(eventId);
      return true;
    } catch (error) {
      console.error('Delete event error:', error);
      throw error;
    }
  }

  // Google Calendar specific
  async syncWithGoogleCalendar(): Promise<void> {
    // This would integrate with Google Calendar API for two-way sync
    // Implementation depends on backend server for secure OAuth handling
    console.log('Google Calendar sync initiated');
  }
}

export const calendar = new CalendarService();
export default calendar;
