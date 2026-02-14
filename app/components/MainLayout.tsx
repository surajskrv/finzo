import React from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[var(--background)] dark:bg-gray-950 transition-colors duration-300 font-sans pb-20 md:pb-0">
      <Sidebar />
      <MobileNav />
      <main className="flex-1 md:ml-64 p-4 sm:p-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
