"use client";

import React, { useState, useEffect, useMemo } from 'react';
import MainLayout from '../components/MainLayout';
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { Expense } from '../components/ExpenseForm';
import {
  TrendingUp, Award, ArrowUpRight,
  ArrowDownRight, Calendar, Clock, BarChart3
} from 'lucide-react';
import CategoryBreakdown from '../components/CategoryBreakdown';
import LoadingSpinner from '../components/LoadingSpinner';

type TimeRange = '1M' | '3M' | '6M' | '1Y';

export default function ReportsPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('6M');

  // --- Load & Sync Data ---
  useEffect(() => {
    const loadData = () => {
      try {
        const savedExpenses = localStorage.getItem('finzo_expenses');
        if (savedExpenses) {
           setExpenses(JSON.parse(savedExpenses));
        } else {
           setExpenses([]);
        }
      } catch (error) {
        console.error("Failed to load expenses:", error);
        setExpenses([]); // Fallback to empty
      }
    };

    loadData();
    window.addEventListener('focus', loadData);

    setIsLoaded(true);

    return () => {
      window.removeEventListener('focus', loadData);
    };
  }, []);

  // --- Filter Expenses ---
  const filteredExpenses = useMemo(() => {
    const now = new Date();
    const cutoff = new Date();

    switch (timeRange) {
      case '1M': cutoff.setMonth(now.getMonth() - 1); break;
      case '3M': cutoff.setMonth(now.getMonth() - 3); break;
      case '6M': cutoff.setMonth(now.getMonth() - 6); break;
      case '1Y': cutoff.setFullYear(now.getFullYear() - 1); break;
    }

    return expenses
      .filter(e => {
        const d = new Date(e.date);
        return !isNaN(d.getTime()) && d >= cutoff;
      })
      .sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
  }, [expenses, timeRange]);

  const totalExpenses = filteredExpenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );

  // --- Accurate Day Count ---
  const uniqueDays = new Set(
    filteredExpenses.map(e =>
      new Date(e.date).toDateString()
    )
  );
  const daysCount = uniqueDays.size || 1;

  const avgDailySpend = totalExpenses / daysCount;

  // --- Chart Data (Correct Sorting) ---
  const chartData = useMemo(() => {
    if (timeRange === '1M') {
      const dailyMap: Record<string, number> = {};

      filteredExpenses.forEach(e => {
        const key = new Date(e.date).toISOString().split('T')[0];
        dailyMap[key] = (dailyMap[key] || 0) + e.amount;
      });

      return Object.entries(dailyMap)
        .map(([date, amount]) => ({
          name: new Date(date).toLocaleDateString('default', {
            day: '2-digit',
            month: 'short'
          }),
          amount,
          rawDate: date
        }))
        .sort((a, b) =>
          new Date(a.rawDate).getTime() -
          new Date(b.rawDate).getTime()
        );

    } else {
      const monthlyMap: Record<string, number> = {};

      filteredExpenses.forEach(e => {
        const d = new Date(e.date);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        monthlyMap[key] = (monthlyMap[key] || 0) + e.amount;
      });

      return Object.entries(monthlyMap)
        .map(([key, amount]) => {
          const [year, month] = key.split('-').map(Number);
          const date = new Date(year, month);
          return {
            name: date.toLocaleString('default', {
              month: 'short',
              year: '2-digit'
            }),
            amount,
            rawDate: date
          };
        })
        .sort((a, b) =>
          a.rawDate.getTime() - b.rawDate.getTime()
        );
    }
  }, [filteredExpenses, timeRange]);

  // --- Highest Spend Day ---
  const highestDay = useMemo(() => {
    const dailyTotals: Record<string, number> = {};

    filteredExpenses.forEach(e => {
      const key = new Date(e.date).toISOString().split('T')[0];
      dailyTotals[key] = (dailyTotals[key] || 0) + e.amount;
    });

    const sorted = Object.entries(dailyTotals)
      .sort(([, a], [, b]) => b - a);

    if (!sorted.length) return null;

    return {
      amount: sorted[0][1],
      date: new Date(sorted[0][0])
        .toLocaleDateString('default', {
          day: 'numeric',
          month: 'short'
        })
    };
  }, [filteredExpenses]);

  // --- Top Category ---
  const topCategoryData = useMemo(() => {
    const map: Record<string, number> = {};

    filteredExpenses.forEach(e => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });

    const sorted = Object.entries(map)
      .sort(([, a], [, b]) => b - a);

    return sorted[0] || ['Uncategorized', 0];
  }, [filteredExpenses]);

  if (!isLoaded) return <LoadingSpinner />;

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-24">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Summary
            </h1>
            <p className="text-slate-500">
              Financial insights and trends
            </p>
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(['1M','3M','6M','1Y'] as TimeRange[]).map(r => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  timeRange === r
                    ? 'bg-white dark:bg-slate-700 text-violet-600 shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </header>

        {filteredExpenses.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border">
            <p>No expenses found for selected period.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Charts */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp size={20} /> Spending Trend
              </h2>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  {timeRange === '1M' ? (
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number | undefined) => [`₹${(value || 0).toLocaleString()}`, 'Spent']}
                      />
                      <Bar dataKey="amount" fill="#8b5cf6" />
                    </BarChart>
                  ) : (
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number | undefined) => [`₹${(value || 0).toLocaleString()}`, 'Spent']}
                      />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#8b5cf6"
                        fill="#c4b5fd"
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border shadow-sm">
                <h3 className="text-sm text-slate-500">Total Spending</h3>
                <p className="text-3xl font-bold">
                  ₹{totalExpenses.toLocaleString()}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border shadow-sm">
                <h3 className="text-sm text-slate-500">Avg Daily Spend</h3>
                <p className="text-2xl font-bold">
                  ₹{avgDailySpend.toFixed(0)}
                </p>
                <p className="text-xs text-slate-400">
                  Based on {daysCount} active days
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border shadow-sm">
                <h3 className="text-sm text-slate-500">Highest Spend Day</h3>
                <p className="text-xl font-bold">
                  ₹{highestDay?.amount.toLocaleString() || 0}
                </p>
                <p className="text-xs text-slate-400">
                  {highestDay?.date || 'N/A'}
                </p>
              </div>

              <CategoryBreakdown
                expenses={filteredExpenses}
                totalExpenses={totalExpenses}
              />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
