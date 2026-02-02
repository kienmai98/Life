// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Calendar: undefined;
  Transactions: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  AddTransaction: undefined;
};

// Store Types
export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  receiptImage?: string;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  description?: string;
  location?: string;
  isAllDay: boolean;
}
