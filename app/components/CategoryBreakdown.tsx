import React, { useMemo } from 'react';
import { Expense } from './ExpenseForm';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface CategoryBreakdownProps {
  expenses: Expense[];
  totalExpenses: number;
}

const COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#6b7280'
];

const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  expenses,
  totalExpenses
}) => {

  const data = useMemo(() => {
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] =
        (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  if (!expenses.length || totalExpenses === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 mb-8">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">
          Spending Breakdown
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No category data available for this period.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 mb-8 relative overflow-hidden">
      
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6">
        Spending Breakdown
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">

        {/* Donut Chart */}
        <div className="relative h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={data.length === 1 ? 0 : 4}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="stroke-white dark:stroke-slate-900 stroke-2"
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value: number) =>
                  [`₹${value.toLocaleString()}`, 'Amount']
                }
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Total */}
          <div className="absolute flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs text-slate-400 uppercase tracking-wide">
              Total
            </span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              ₹{totalExpenses.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Category List */}
        <div className="space-y-4">
          {data.map((entry, index) => {
            const percent =
              totalExpenses > 0
                ? ((entry.value / totalExpenses) * 100).toFixed(1)
                : '0';

            return (
              <div
                key={entry.name}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full ring-2 ring-white dark:ring-slate-900"
                    style={{
                      backgroundColor:
                        COLORS[index % COLORS.length]
                    }}
                  />
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {entry.name}
                  </span>
                </div>

                <div className="text-right">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    ₹{entry.value.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {percent}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 dark:bg-slate-800/20 rounded-full blur-3xl -z-0 pointer-events-none" />
    </div>
  );
};

export default CategoryBreakdown;
