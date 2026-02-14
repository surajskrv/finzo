"use client";

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Wallet, Moon, Sun, PieChart, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MobileNav = () => {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('finzo_theme');
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && isSystemDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

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

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Wallet, label: 'Expenses', path: '/expenses' },
    { icon: PieChart, label: 'Summary', path: '/summary' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 flex justify-around items-center px-6 py-4 md:hidden z-50 safe-area-pb shadow-lg shadow-slate-200/20 dark:shadow-none">
      {menuItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link 
            key={item.path} 
            href={item.path}
            className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all duration-300
              ${isActive 
                ? 'text-violet-600 dark:text-violet-400 translate-y-[-4px]' 
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }
            `}
          >
            <item.icon size={26} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'drop-shadow-sm' : ''} />
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileNav;
