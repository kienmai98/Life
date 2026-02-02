import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LogBox } from 'react-native';

import AppNavigator from './src/navigation/AppNavigator';
import { useAuthStore } from './src/stores/authStore';
import { useThemeStore } from './src/stores/themeStore';

// Ignore specific warnings
LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
]);

function App(): React.JSX.Element {
  const { checkAuthState } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    // Check authentication state on app start
    checkAuthState();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#0F172A' : '#F8FAFC'}
      />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

export default App;
