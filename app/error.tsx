"use client";

import { useEffect } from "react";
import MainLayout from "./components/MainLayout";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <MainLayout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-full mb-6">
            <AlertCircle size={48} className="text-rose-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Something went wrong!</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
            We apologize for the inconvenience. An unexpected error occurred while processing your request.
        </p>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-violet-500/20"
        >
          <RefreshCcw size={20} />
          Try Again
        </button>
      </div>
    </MainLayout>
  );
}
