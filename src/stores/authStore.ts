import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isBiometricEnabled: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setBiometricEnabled: (enabled: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      isBiometricEnabled: false,
      
      setUser: (user) => set({ user, isLoading: false }),
      setLoading: (loading) => set({ isLoading: loading }),
      setBiometricEnabled: (enabled) => set({ isBiometricEnabled: enabled }),
      logout: () => set({ user: null, isLoading: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
