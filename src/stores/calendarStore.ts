import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CalendarEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  description?: string;
  location?: string;
  isAllDay: boolean;
}

interface CalendarState {
  events: CalendarEvent[];
  isGoogleConnected: boolean;
  
  // Actions
  setEvents: (events: CalendarEvent[]) => void;
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  setGoogleConnected: (connected: boolean) => void;
  getEventsForDate: (date: string) => CalendarEvent[];
  getUpcomingEvents: (limit?: number) => CalendarEvent[];
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      events: [],
      isGoogleConnected: false,
      
      setEvents: (events) => set({ events }),
      
      addEvent: (event) => {
        const newEvent: CalendarEvent = {
          ...event,
          id: Date.now().toString(),
        };
        set((state) => ({
          events: [...state.events, newEvent].sort(
            (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          ),
        }));
      },
      
      updateEvent: (id, updates) => {
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        }));
      },
      
      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        }));
      },
      
      setGoogleConnected: (connected) => set({ isGoogleConnected: connected }),
      
      getEventsForDate: (date) => {
        return get().events.filter((e) => {
          const eventDate = e.startDate.split('T')[0];
          return eventDate === date;
        });
      },
      
      getUpcomingEvents: (limit = 5) => {
        const now = new Date().toISOString();
        return get()
          .events.filter((e) => e.startDate >= now)
          .slice(0, limit);
      },
    }),
    {
      name: 'calendar-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
