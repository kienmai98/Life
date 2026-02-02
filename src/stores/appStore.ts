import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppState {
  isDarkMode: boolean;
  hasCompletedOnboarding: boolean;
  lastSyncTime: string | null;
  
  // Actions
  toggleDarkMode: () => void;
  setDarkMode: (enabled: boolean) => void;
  setOnboardingComplete: () => void;
  setLastSyncTime: (time: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      hasCompletedOnboarding: false,
      lastSyncTime: null,
      
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setDarkMode: (enabled) => set({ isDarkMode: enabled }),
      setOnboardingComplete: () => set({ hasCompletedOnboarding: true }),
      setLastSyncTime: (time) => set({ lastSyncTime: time }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
