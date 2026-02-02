import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import BiometricSetupScreen from '../screens/Auth/BiometricSetupScreen';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  BiometricSetup: { userId: string };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen
        name="BiometricSetup"
        component={BiometricSetupScreen}
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
