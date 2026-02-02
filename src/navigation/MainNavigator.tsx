import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../types';
import { DashboardScreen } from '../screens/Main/DashboardScreen';
import { CalendarScreen } from '../screens/Main/CalendarScreen';
import { TransactionsScreen } from '../screens/Main/TransactionsScreen';
import { ProfileScreen } from '../screens/Main/ProfileScreen';
import { AddTransactionScreen } from '../screens/Main/AddTransactionScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarLabel: '🏠 Home' }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{ tabBarLabel: '📅 Calendar' }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{ tabBarLabel: '💰 Money' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: '👤 Profile' }}
      />
    </Tab.Navigator>
  );
};

export const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen
        name="AddTransaction"
        component={AddTransactionScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
};
