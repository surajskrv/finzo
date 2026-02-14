import React, { useState, useEffect } from 'react';
import { Plus, Save, X, IndianRupee, Calendar, FileText, Tag } from 'lucide-react';

export interface Expense {
  id: string;
  amount: number;
  category: string;
  note: string;
  date: string;
}

interface ExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  editingExpense?: Expense | null;
  onUpdateExpense?: (expense: Expense) => void;
  onCancelEdit?: () => void;
}

const categories = ["Food", "Travel", "Bills", "Shopping", "Health", "Other"];

const ExpenseForm: React.FC<ExpenseFormProps> = ({ 
  onAddExpense, 
  editingExpense, 
  onUpdateExpense, 
  onCancelEdit 
}) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Populate form when editing
  useEffect(() => {
    if (editingExpense) {
      setAmount(editingExpense.amount.toString());
      setCategory(editingExpense.category);
      setNote(editingExpense.note);
      setDate(editingExpense.date);
    }
  }, [editingExpense]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !date) return;

    if (editingExpense && onUpdateExpense) {
      onUpdateExpense({
        ...editingExpense,
        amount: parseFloat(amount),
        category,
        note,
        date
      });
    } else {
      onAddExpense({
        amount: parseFloat(amount),
        category,
        note,
        date
      });
      
      // Reset form but keep category/date for convenience
      setAmount('');
      setNote('');
    }
  };

  const handleCancel = () => {
    // Reset to default
    setAmount('');
    setNote('');
    setCategory(categories[0]);
    setDate(new Date().toISOString().split('T')[0]);
    if (onCancelEdit) onCancelEdit();
  };

  const isEditing = !!editingExpense;

  return (
    <section className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm mb-8 transition-all duration-300 ${isEditing ? 'ring-2 ring-blue-500 dark:ring-blue-400' : 'hover:shadow-md'}`}>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <span className={`p-2 rounded-lg mr-3 ${isEditing ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
            {isEditing ? <Save size={20} /> : <Plus size={20} />}
          </span>
          {isEditing ? 'Edit Expense' : 'Add New Expense'}
        </div>
        {isEditing && (
          <button 
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        )}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Amount</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <IndianRupee size={16} />
              </span>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all dark:text-white"
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Category</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Tag size={16} />
              </span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all dark:text-white appearance-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Date</label>
             <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Calendar size={16} />
              </span>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all dark:text-white text-gray-700"
              />
            </div>
          </div>
          
          <div className="space-y-1">
             <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Note (Optional)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <FileText size={16} />
              </span>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all dark:text-white"
                placeholder="What was this for?"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className={`w-full font-medium py-3 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.99] flex justify-center items-center mt-4 text-white
            ${isEditing ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-blue-700'}
          `}
        >
          {isEditing ? (
            <>
              <Save size={20} className="mr-2" /> Update Expense
            </>
          ) : (
             <>
              <Plus size={20} className="mr-2" /> Add Expense
            </>
          )}
        </button>
      </form>
    </section>
  );
};

export default ExpenseForm;
