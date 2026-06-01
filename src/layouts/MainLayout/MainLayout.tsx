import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { getMenusByRoles } from '@/config/menu.config';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

export const MainLayout: React.FC = () => {
  const { user } = useAuthStore();
  const currentMenus = getMenusByRoles(user?.roles || []);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar menus={currentMenus} />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-full p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};