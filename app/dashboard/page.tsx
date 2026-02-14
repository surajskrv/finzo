"use client";

import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import Summary from '../components/Summary';
import CategoryBreakdown from '../components/CategoryBreakdown';
import ExpenseList from '../components/ExpenseList';
import ExportButton from '../components/ExportButton';
import { Expense } from '../components/ExpenseForm';
import { ArrowRight, TrendingUp, ShieldCheck, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import LoadingSpinner from '../components/LoadingSpinner';

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toLocaleString('default', { month: 'long' })
  );
  const [budget, setBudget] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const loadData = () => {
      try {
        const savedExpenses = localStorage.getItem('finzo_expenses');
        const savedBudget = localStorage.getItem('finzo_budget');

        if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
        if (savedBudget) setBudget(parseFloat(savedBudget));
      } catch (error) {
         console.error("Failed to load data:", error);
         // Fallback values are already defaults (expenses=[], budget=0)
      }
    };

    loadData();

    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    window.addEventListener('focus', loadData);

    setIsLoaded(true);

    return () => {
      window.removeEventListener('focus', loadData);
    };
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('finzo_budget', budget.toString());
    }
  }, [budget, isLoaded]);

  const filteredExpenses = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      const expenseMonth = expenseDate.toLocaleString('default', { month: 'long' });
      return expenseMonth === selectedMonth;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const budgetProgress = budget > 0 ? (totalExpenses / budget) * 100 : 0;
  const isSafeToSpend = budget > 0 && budgetProgress < 80;

  if (!isLoaded) return <LoadingSpinner />;

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">
              {greeting}, Sam
            </p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Financial Overview
            </h1>
          </div>

          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-2.5 px-4 pr-10 rounded-xl font-medium shadow-sm hover:border-violet-300 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            >
              {[
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
              ].map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </header>

        {/* Financial Health Widget */}
        <div className="bg-gradient-to-r from-violet-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-violet-500/20 relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                {isSafeToSpend ? <ShieldCheck size={32} /> : <AlertCircle size={32} />}
              </div>
              <div>
                <h3 className="font-bold text-lg opacity-90">
                  Financial Health Score
                </h3>
                <p className="opacity-80 text-sm">
                  {budget === 0
                    ? "Set a budget to see your score"
                    : isSafeToSpend
                    ? "You are doing great! Spending is within limits."
                    : "Warning: You are approaching your budget limit."}
                </p>
              </div>
            </div>

            {budget > 0 && (
              <div className="text-right">
                <p className="text-sm opacity-80 mb-1">Budget Used</p>
                <div className="text-3xl font-bold">
                  {budgetProgress.toFixed(0)}%
                </div>
              </div>
            )}
          </div>
        </div>

        <Summary
          totalExpenses={totalExpenses}
          transactionCount={filteredExpenses.length}
          budget={budget}
          onBudgetChange={setBudget}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CategoryBreakdown
              expenses={filteredExpenses}
              totalExpenses={totalExpenses}
            />
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-violet-500" />
                Quick Actions
              </h3>

              <div className="space-y-3">
                <Link
                  href="/expenses"
                  className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all group border border-transparent hover:border-violet-200 dark:hover:border-violet-800"
                >
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Add New Expense
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm group-hover:bg-violet-500 group-hover:text-white transition-colors">
                    <ArrowRight size={16} />
                  </div>
                </Link>

                {filteredExpenses.length > 0 && (
                  <div className="pt-2">
                    <ExportButton expenses={filteredExpenses} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <section>
          <div className="flex items-center justify-between mb-6 px-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Recent Transactions
            </h2>
            <Link
              href="/expenses"
              className="text-sm font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
            >
              View All
            </Link>
          </div>

          <ExpenseList
            expenses={filteredExpenses.slice(0, 5)}
            onDeleteExpense={(id) => {
              const newExpenses = expenses.filter(e => e.id !== id);
              setExpenses(newExpenses);
              localStorage.setItem('finzo_expenses', JSON.stringify(newExpenses));
            }}
            onEditExpense={() => {}}
          />
        </section>

      </div>
    </MainLayout>
  );
}
