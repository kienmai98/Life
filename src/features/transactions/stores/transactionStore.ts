import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  receiptImage?: string;
  createdAt: string;
}

interface TransactionState {
  transactions: Transaction[];
  categories: string[];
  
  // Actions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  getTransactionsByDateRange: (startDate: string, endDate: string) => Transaction[];
  getTotalSpent: (startDate?: string, endDate?: string) => number;
  getSpendingByCategory: (startDate?: string, endDate?: string) => Record<string, number>;
}

const DEFAULT_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Health & Fitness',
  'Travel',
  'Other',
];

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],
      categories: DEFAULT_CATEGORIES,
      
      addTransaction: (transaction) => {
        const newTransaction: Transaction = {
          ...transaction,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
        }));
      },
      
      updateTransaction: (id, updates) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));
      },
      
      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },
      
      getTransactionsByDateRange: (startDate, endDate) => {
        const { transactions } = get();
        return transactions.filter(
          (t) => t.date >= startDate && t.date <= endDate
        );
      },
      
      getTotalSpent: (startDate, endDate) => {
        const transactions = startDate && endDate
          ? get().getTransactionsByDateRange(startDate, endDate)
          : get().transactions;
        return transactions.reduce((sum, t) => sum + t.amount, 0);
      },
      
      getSpendingByCategory: (startDate, endDate) => {
        const transactions = startDate && endDate
          ? get().getTransactionsByDateRange(startDate, endDate)
          : get().transactions;
        
        return transactions.reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {} as Record<string, number>);
      },
    }),
    {
      name: 'transaction-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
