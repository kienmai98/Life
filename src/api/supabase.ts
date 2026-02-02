import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

// Initialize Supabase client
const supabaseUrl = SUPABASE_URL || '';
const supabaseKey = SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          photo_url: string | null;
          provider: string;
          settings: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          photo_url?: string | null;
          provider?: string;
          settings?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          photo_url?: string | null;
          provider?: string;
          settings?: any;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          currency: string;
          category: string;
          description: string;
          date: string;
          type: string;
          payment_method: string;
          receipt_url: string | null;
          location: any | null;
          tags: string[];
          created_at: string;
          updated_at: string;
          synced: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          currency: string;
          category: string;
          description: string;
          date: string;
          type: string;
          payment_method: string;
          receipt_url?: string | null;
          location?: any | null;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
          synced?: boolean;
        };
        Update: {
          amount?: number;
          currency?: string;
          category?: string;
          description?: string;
          date?: string;
          type?: string;
          payment_method?: string;
          receipt_url?: string | null;
          location?: any | null;
          tags?: string[];
          updated_at?: string;
          synced?: boolean;
        };
      };
    };
  };
};

// Helper functions for Supabase operations
export const supabaseApi = {
  // User operations
  async createUser(userData: Database['public']['Tables']['users']['Insert']) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateUser(userId: string, updates: Database['public']['Tables']['users']['Update']) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Transaction operations
  async createTransaction(transactionData: Database['public']['Tables']['transactions']['Insert']) {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transactionData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getTransactions(userId: string, options?: { startDate?: string; endDate?: string; limit?: number }) {
    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (options?.startDate) {
      query = query.gte('date', options.startDate);
    }
    if (options?.endDate) {
      query = query.lte('date', options.endDate);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async updateTransaction(transactionId: string, updates: Database['public']['Tables']['transactions']['Update']) {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', transactionId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteTransaction(transactionId: string) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transactionId);
    
    if (error) throw error;
  },

  // Get spending summary
  async getSpendingSummary(userId: string, startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('amount, category, type')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate);
    
    if (error) throw error;
    
    const summary = {
      totalIncome: 0,
      totalExpenses: 0,
      balance: 0,
      byCategory: {} as Record<string, number>,
    };
    
    data?.forEach(transaction => {
      if (transaction.type === 'income') {
        summary.totalIncome += transaction.amount;
      } else {
        summary.totalExpenses += transaction.amount;
        summary.byCategory[transaction.category] = (summary.byCategory[transaction.category] || 0) + transaction.amount;
      }
    });
    
    summary.balance = summary.totalIncome - summary.totalExpenses;
    return summary;
  },
};

export default supabaseApi;
