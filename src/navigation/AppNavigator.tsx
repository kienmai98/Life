import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';

const Stack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { theme, navigationTheme } = useThemeStore();

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
            <Stack.Screen name="Auth" component={AuthNavigator} />
          ) : (
            <Stack.Screen name="Main" component={MainNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default AppNavigator;
