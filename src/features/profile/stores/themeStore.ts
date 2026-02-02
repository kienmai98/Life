import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MD3DarkTheme, MD3LightTheme, adaptNavigationTheme } from 'react-native-paper';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

// Custom theme colors
const customLightColors = {
  primary: '#6366F1',
  primaryContainer: '#E0E7FF',
  secondary: '#8B5CF6',
  secondaryContainer: '#EDE9FE',
  tertiary: '#EC4899',
  tertiaryContainer: '#FCE7F3',
  surface: '#FFFFFF',
  surfaceVariant: '#F1F5F9',
  background: '#F8FAFC',
  error: '#EF4444',
  errorContainer: '#FEE2E2',
  onPrimary: '#FFFFFF',
  onSecondary: '#FFFFFF',
  onSurface: '#1E293B',
  onSurfaceVariant: '#64748B',
  onBackground: '#1E293B',
  outline: '#CBD5E1',
  outlineVariant: '#E2E8F0',
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#1E293B',
  inverseOnSurface: '#F1F5F9',
  inversePrimary: '#A5B4FC',
  elevation: {
    level0: 'transparent',
    level1: '#F8FAFC',
    level2: '#F1F5F9',
    level3: '#E2E8F0',
    level4: '#CBD5E1',
    level5: '#94A3B8',
  },
};

const customDarkColors = {
  primary: '#818CF8',
  primaryContainer: '#4338CA',
  secondary: '#A78BFA',
  secondaryContainer: '#6D28D9',
  tertiary: '#F472B6',
  tertiaryContainer: '#BE185D',
  surface: '#1E293B',
  surfaceVariant: '#334155',
  background: '#0F172A',
  error: '#F87171',
  errorContainer: '#991B1B',
  onPrimary: '#1E1B4B',
  onSecondary: '#2E1065',
  onSurface: '#F1F5F9',
  onSurfaceVariant: '#94A3B8',
  onBackground: '#F1F5F9',
  outline: '#475569',
  outlineVariant: '#334155',
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#F1F5F9',
  inverseOnSurface: '#1E293B',
  inversePrimary: '#4F46E5',
  elevation: {
    level0: 'transparent',
    level1: '#1E293B',
    level2: '#334155',
    level3: '#475569',
    level4: '#64748B',
    level5: '#94A3B8',
  },
};

export const customLightTheme = {
  ...MD3LightTheme,
  ...LightTheme,
  colors: { ...MD3LightTheme.colors, ...customLightColors },
};

export const customDarkTheme = {
  ...MD3DarkTheme,
  ...DarkTheme,
  colors: { ...MD3DarkTheme.colors, ...customDarkColors },
};

interface ThemeState {
  isDarkMode: boolean;
  theme: typeof customLightTheme;
  navigationTheme: typeof LightTheme;
  
  // Actions
  toggleTheme: () => void;
  setDarkMode: (enabled: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDarkMode: false,
      theme: customLightTheme,
      navigationTheme: LightTheme,

      toggleTheme: () => {
        const newDarkMode = !get().isDarkMode;
        set({
          isDarkMode: newDarkMode,
          theme: newDarkMode ? customDarkTheme : customLightTheme,
          navigationTheme: newDarkMode ? DarkTheme : LightTheme,
        });
      },

      setDarkMode: (enabled) => {
        set({
          isDarkMode: enabled,
          theme: enabled ? customDarkTheme : customLightTheme,
          navigationTheme: enabled ? DarkTheme : LightTheme,
        });
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
    }
  )
);

export default useThemeStore;
