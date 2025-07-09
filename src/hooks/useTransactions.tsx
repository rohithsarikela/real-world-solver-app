import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "@/hooks/use-toast";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category_id: string | null;
  transaction_type: 'income' | 'expense';
  transaction_date: string;
  created_at: string;
  categories?: {
    name: string;
    color: string;
    icon: string;
  } | null;
}

interface RawTransaction extends Omit<Transaction, 'transaction_type'> {
  transaction_type: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          categories (
            name,
            color,
            icon
          )
        `)
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion to ensure proper typing
      const typedTransactions = (data || []).map(t => ({
        ...t,
        transaction_type: t.transaction_type as 'income' | 'expense'
      }));
      
      setTransactions(typedTransactions);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive",
      });
    }
  };

  const fetchCategories = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at' | 'categories'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .insert([{ ...transaction, user_id: user.id }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
      
      fetchTransactions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
      
      fetchTransactions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      Promise.all([fetchTransactions(), fetchCategories()]).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  return {
    transactions,
    categories,
    loading,
    addTransaction,
    deleteTransaction,
    refetch: () => Promise.all([fetchTransactions(), fetchCategories()]),
  };
};