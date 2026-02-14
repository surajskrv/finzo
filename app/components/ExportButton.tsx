import React from 'react';
import { Download } from 'lucide-react';
import { Expense } from './ExpenseForm';

interface ExportButtonProps {
  expenses: Expense[];
}

const ExportButton: React.FC<ExportButtonProps> = ({ expenses }) => {
  const handleExport = () => {
    const headers = ['Date', 'Category', 'Amount', 'Note'];
    const csvContent = [
      headers.join(','),
      ...expenses.map(exp => 
        [exp.date, exp.category, exp.amount, `"${exp.note || ''}"`].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `finzo_expenses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
      title="Export to CSV"
    >
      <Download size={16} />
      Export
    </button>
  );
};

export default ExportButton;
