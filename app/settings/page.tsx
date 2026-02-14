"use client";

import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import { Moon, Sun, Trash2, IndianRupee, Info, User, Mail, Download, LogOut, ChevronRight, Shield } from 'lucide-react';
import { toast } from 'sonner';

import LoadingSpinner from '../components/LoadingSpinner';

export default function SettingsPage() {
  const [isDark, setIsDark] = useState(false);
  const [profileName, setProfileName] = useState("Sam"); // Mock profile name
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initialize theme from localStorage
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('finzo_theme');
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (savedTheme === 'dark' || (!savedTheme && isSystemDark)) {
        setIsDark(true);
      } else {
        setIsDark(false);
      }
      setIsLoaded(true);
    }
  }, []);

  if (!isLoaded) return <LoadingSpinner />;

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('finzo_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('finzo_theme', 'light');
    }
  };

  const clearData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        localStorage.removeItem('finzo_expenses');
        localStorage.removeItem('finzo_budget');
        toast.success("All data cleared successfully");
        window.location.reload();
    }
  };

  const exportData = () => {
    const expenses = localStorage.getItem('finzo_expenses');
    if (!expenses) {
        toast.error("No data to export");
        return;
    }
    
    const blob = new Blob([expenses], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finzo-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Data exported successfully");
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
        <header className="pb-4 border-b border-slate-100 dark:border-slate-800">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your profile and preferences</p>
        </header>

        <section className="space-y-8">
            {/* Profile Section */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <User size={20} className="text-violet-500" />
                        Profile
                    </h2>
                </div>
                <div className="p-6">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-white dark:border-slate-800 shadow-md">
                            {profileName.charAt(0)}
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{profileName}</h3>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                                <Mail size={14} />
                                <span>sam@example.com</span>
                            </div>
                            <button className="text-sm font-medium text-violet-600 dark:text-violet-400 hover:underline mt-1">
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* General Settings */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">General</h2>
                </div>
                

                {/* Currency */}
                <div className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-4">
                         <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                             <IndianRupee size={20} />
                         </div>
                         <div>
                             <p className="font-semibold text-slate-900 dark:text-white">Currency</p>
                             <p className="text-sm text-slate-500 dark:text-slate-400">Indian Rupee (₹)</p>
                         </div>
                    </div>
                    <ChevronRight size={20} className="text-slate-400" />
                </div>
            </div>

            {/* Data Management */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Data Analysis</h2>
                </div>
                
                <button 
                    onClick={exportData}
                    className="w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-50 dark:border-slate-800/50 text-left"
                >
                    <div className="flex items-center gap-4">
                         <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                             <Download size={20} />
                         </div>
                         <div>
                             <p className="font-semibold text-slate-900 dark:text-white">Export Data</p>
                             <p className="text-sm text-slate-500 dark:text-slate-400">Download your expenses as JSON</p>
                         </div>
                    </div>
                    <ChevronRight size={20} className="text-slate-400" />
                </button>

                <button 
                    onClick={clearData}
                    className="w-full p-6 flex items-center justify-between hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors group text-left"
                >
                    <div className="flex items-center gap-4">
                         <div className="p-2.5 bg-rose-100 dark:bg-rose-900/30 rounded-xl text-rose-600 dark:text-rose-400 group-hover:bg-rose-200 dark:group-hover:bg-rose-900/50 transition-colors">
                             <Trash2 size={20} />
                         </div>
                         <div>
                             <p className="font-semibold text-rose-600 dark:text-rose-400">Clear All Data</p>
                             <p className="text-sm text-slate-500 dark:text-slate-400">Permanently delete all records</p>
                         </div>
                    </div>
                </button>
            </div>
            
            <div className="flex justify-center pt-4 pb-8">
               <div className="flex items-center gap-2 text-slate-400 text-sm">
                   <Shield size={14} />
                   <span>Secure & Local • v3.0</span>
               </div>
            </div>
        </section>
      </div>
    </MainLayout>
  );
}
