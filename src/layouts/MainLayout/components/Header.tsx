import React from 'react';
import { Menu } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Quản trị viên',
  PRINCIPAL: 'Hiệu trưởng',
  HR: 'Nhân sự',
  TRAINING_DEPT: 'Phòng đào tạo',
  HEAD_OF_DEPT: 'Trưởng khoa',
  INSTRUCTOR: 'Giảng viên',
  STUDENT: 'Sinh viên'
};

export const Header: React.FC = () => {
  const { user } = useAuthStore();
  const primaryRoleCode = user?.roles?.[0]?.toUpperCase() || '';
  const displayRole = ROLE_LABELS[primaryRoleCode] || 'Thành viên';
  const initialChar = user?.fullName?.charAt(0).toUpperCase() || 'U';

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 z-10 shrink-0">
      <div className="flex items-center">
        <button className="p-2 lg:hidden text-gray-500 hover:bg-gray-100 rounded-md transition-colors focus:outline-none">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center">
        <div className="flex items-center gap-3 p-1">
          {user?.avatarUrl ? (
            <img 
              src={user.avatarUrl} 
              alt="Avatar" 
              className="h-9 w-9 rounded-full object-cover border border-gray-200 shadow-sm"
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
              {initialChar}
            </div>
          )}

          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-gray-700 leading-tight">
              {user?.fullName || 'Đang tải...'}
            </p>
            <p className="text-xs text-blue-600 font-medium mt-0.5">
              {displayRole}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};