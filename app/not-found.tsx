import Link from "next/link";
import MainLayout from "./components/MainLayout";
import { SearchX, Home } from "lucide-react";

export default function NotFound() {
  return (
    <MainLayout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-6">
            <SearchX size={48} className="text-slate-500" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Page Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
            The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 rounded-xl font-medium transition-colors"
        >
          <Home size={20} />
          Back to Dashboard
        </Link>
      </div>
    </MainLayout>
  );
}
