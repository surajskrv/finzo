"use client";

import React, { useState, useEffect } from 'react';
import ExpenseForm, { Expense } from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import MainLayout from '../components/MainLayout';
import ExportButton from '../components/ExportButton';

import LoadingSpinner from '../components/LoadingSpinner';

import { toast } from 'sonner';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortOption, setSortOption] = useState('newest');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const categories = ['All', 'Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Travel', 'Other'];

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('finzo_expenses');
    if (saved) {
      try {
        setExpenses(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse", e);
        toast.error("Failed to load expenses data");
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('finzo_expenses', JSON.stringify(expenses));
      } catch (e) {
        toast.error("Failed to save expenses");
      }
    }
  }, [expenses, isLoaded]);

  const addExpense = (newExpenseData: Omit<Expense, 'id'>) => {
    try {
        const newExpense: Expense = { ...newExpenseData, id: crypto.randomUUID() };
        setExpenses(prev => [newExpense, ...prev]);
        toast.success("Expense added successfully");
    } catch (e) {
        toast.error("Failed to add expense");
    }
  };

  const updateExpense = (updated: Expense) => {
    try {
        setExpenses(prev => prev.map(e => e.id === updated.id ? updated : e));
        setEditingExpense(null);
        toast.success("Expense updated successfully");
    } catch (e) {
        toast.error("Failed to update expense");
    }
  };

  const deleteExpense = (id: string) => {
    try {
        setExpenses(prev => prev.filter(e => e.id !== id));
        if (editingExpense?.id === id) setEditingExpense(null);
        toast.success("Expense deleted successfully");
    } catch (e) {
        toast.error("Failed to delete expense");
    }
  };

  const filteredExpenses = expenses
    .filter(e => {
        const matchesSearch = 
            e.note.toLowerCase().includes(searchQuery.toLowerCase()) || 
            e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.amount.toString().includes(searchQuery);
        const matchesCategory = categoryFilter === 'All' || e.category === categoryFilter;
        return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        const amountA = a.amount;
        const amountB = b.amount;

        switch (sortOption) {
            case 'oldest': return dateA - dateB;
            case 'highest': return amountB - amountA;
            case 'lowest': return amountA - amountB;
            case 'newest': default: return dateB - dateA;
        }
    });

  if (!isLoaded) return <LoadingSpinner />;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
           <div>
               <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Expenses</h1>
               <p className="text-slate-500 dark:text-slate-400">Manage your transactions</p>
           </div>
           <ExportButton expenses={filteredExpenses} />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-8">
                 <ExpenseForm 
                   onAddExpense={addExpense}
                   editingExpense={editingExpense}
                   onUpdateExpense={updateExpense}
                   onCancelEdit={() => setEditingExpense(null)}
                 />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {/* Filter & Search Bar */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Search size={20} />
                  </span>
                  <input 
                    type="text" 
                    placeholder="Search expenses..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500/50 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </div>
                
                <div className="flex gap-4 overflow-x-auto pb-1 no-scrollbar">
                    {/* Category Filter */}
                    <div className="relative min-w-[140px]">
                        <select 
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full appearance-none pl-10 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/50 cursor-pointer"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <Filter size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Sort Option */}
                    <div className="relative min-w-[140px]">
                         <select 
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="w-full appearance-none pl-10 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/50 cursor-pointer"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="highest">Highest Amount</option>
                            <option value="lowest">Lowest Amount</option>
                        </select>
                        <ArrowUpDown size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 px-1">
                <span>Showing {filteredExpenses.length} transaction{filteredExpenses.length !== 1 ? 's' : ''}</span>
                {categoryFilter !== 'All' && (
                    <button onClick={() => {setCategoryFilter('All'); setSearchQuery('');}} className="text-violet-600 dark:text-violet-400 hover:underline">
                        Clear Filters
                    </button>
                )}
            </div>

            <ExpenseList 
              expenses={filteredExpenses} 
              onDeleteExpense={deleteExpense} 
              onEditExpense={(exp) => {
                setEditingExpense(exp);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
