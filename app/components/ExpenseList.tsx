import React from 'react';
import { Expense } from './ExpenseForm';
import { Trash2, Edit2, ShoppingBag, Coffee, Zap, Heart, Plane, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  onEditExpense: (expense: Expense) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Food': return <Coffee size={18} />;
    case 'Shopping': return <ShoppingBag size={18} />;
    case 'Bills': return <Zap size={18} />;
    case 'Health': return <Heart size={18} />;
    case 'Travel': return <Plane size={18} />;
    default: return <MoreHorizontal size={18} />;
  }
};

const categoryStyles: Record<string, string> = {
  Food: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
  Travel: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
  Bills: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
  Shopping: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
  Health: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  Other: "bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
};

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDeleteExpense, onEditExpense }) => {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={40} />
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">No expenses added yet</p>
        <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">Start tracking your spending to see it here.</p>
      </div>
    );
  }

  const groupedExpenses = expenses.reduce((groups, expense) => {
    const date = new Date(expense.date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    let key = expense.date;
    if (date.toDateString() === today.toDateString()) key = "Today";
    else if (date.toDateString() === yesterday.toDateString()) key = "Yesterday";
    
    if (!groups[key]) groups[key] = [];
    groups[key].push(expense);
    return groups;
  }, {} as Record<string, Expense[]>);

  const sortedKeys = Object.keys(groupedExpenses).sort((a, b) => {
    if (a === "Today") return -1;
    if (b === "Today") return 1;
    if (a === "Yesterday") return -1;
    if (b === "Yesterday") return 1;
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return (
    <section className="space-y-6">
      {sortedKeys.map((dateKey) => (
        <div key={dateKey} className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">{dateKey}</h3>
          <AnimatePresence initial={false}>
            {groupedExpenses[dateKey].map((expense) => (
              <div 
                key={expense.id}
                className="group bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-transparent dark:border-slate-800 hover:border-violet-100 dark:hover:border-violet-900/30 flex justify-between items-center"
              >
                <div className="flex items-center space-x-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${categoryStyles[expense.category] || categoryStyles['Other']}`}>
                    {getCategoryIcon(expense.category)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{expense.category}</p>
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 space-x-2 mt-0.5">
                      {expense.note && (
                        <span className="truncate max-w-[120px] sm:max-w-xs">{expense.note}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className="font-bold text-slate-800 dark:text-white text-lg">
                    -₹{expense.amount.toFixed(2)}
                  </span>
                  <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 transform translate-x-2 sm:group-hover:translate-x-0">
                    <button 
                      onClick={() => onEditExpense(expense)}
                      className="p-2 text-slate-400 dark:text-slate-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                      aria-label="Edit expense"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => onDeleteExpense(expense.id)}
                      className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
                      aria-label="Delete expense"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </AnimatePresence>
        </div>
      ))}
    </section>
  );
};

export default ExpenseList;
