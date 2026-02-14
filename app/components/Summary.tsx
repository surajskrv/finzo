import React from 'react';
import { IndianRupee, CreditCard, PieChart } from 'lucide-react';

interface SummaryProps {
  totalExpenses: number;
  transactionCount: number;
  budget: number;
  onBudgetChange: (budget: number) => void;
}

const Summary: React.FC<SummaryProps> = ({ totalExpenses, transactionCount, budget, onBudgetChange }) => {
  const isOverBudget = budget > 0 && totalExpenses > budget;
  const percentage = budget > 0 ? Math.min((totalExpenses / budget) * 100, 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Expenses Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between relative overflow-hidden group">
        <div className="relative z-10">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Total Expenses</p>
          <p className={`text-3xl font-bold tracking-tight ${isOverBudget ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>
            ₹{totalExpenses.toFixed(2)}
          </p>
        </div>
        <div className="w-12 h-12 bg-violet-100 dark:bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform duration-300">
          <IndianRupee size={24} />
        </div>
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-violet-50 dark:bg-violet-500/5 rounded-full blur-2xl group-hover:bg-violet-100 dark:group-hover:bg-violet-500/10 transition-colors duration-500" />
      </div>

      {/* Transactions Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between relative overflow-hidden group">
        <div className="relative z-10">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Transactions</p>
          <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {transactionCount}
          </p>
        </div>
        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
          <CreditCard size={24} />
        </div>
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-50 dark:bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/10 transition-colors duration-500" />
      </div>

      {/* Budget Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between relative overflow-hidden group">
        <div className="relative z-10 w-full">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Budget Goal</p>
          <div className="flex items-center">
            <span className="text-slate-400 mr-1 text-xl">₹</span>
            <input 
              type="number" 
              value={budget || ''} 
              onChange={(e) => onBudgetChange(parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="bg-transparent text-3xl font-bold text-slate-900 dark:text-white outline-none w-full placeholder:text-slate-300 dark:placeholder:text-slate-700"
            />
          </div>
          <div className="mt-3 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
             <div 
               className={`h-full rounded-full transition-all duration-500 ${isOverBudget ? 'bg-rose-500' : 'bg-emerald-500'}`}
               style={{ width: `${percentage}%` }}
             />
          </div>
        </div>
        <div className="absolute right-6 top-6 w-12 h-12 bg-emerald-100 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300 pointer-events-none">
          <PieChart size={24} />
        </div>
      </div>
    </div>
  );
};

export default Summary;
