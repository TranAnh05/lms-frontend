import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GraduationCap, BookOpen, Users } from 'lucide-react';
import { AxiosError } from 'axios'; 

import { LoginForm, type LoginFormData } from '../components/LoginForm';
import { authService } from '../services/auth.service';
import { useAuthStore } from '@/store/authStore';
import { getDefaultPathByRole } from '@/config/menu.config';

const BrandingSidebar: React.FC = React.memo(() => (
  <div className="hidden md:flex md:w-1/2 bg-blue-600 p-12 flex-col justify-between relative overflow-hidden">
    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-500 opacity-50 blur-3xl" />
    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-blue-700 opacity-50 blur-3xl" />
    <div className="relative z-10">
      <div className="flex items-center gap-3 text-white mb-12">
        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
          <GraduationCap className="h-8 w-8" />
        </div>
        <span className="text-2xl font-bold tracking-wider">LMS.EDU</span>
      </div>

      <h1 className="text-4xl font-extrabold text-white leading-tight mb-6">
        Nền tảng quản lý <br /> đào tạo toàn diện
      </h1>
      <p className="text-blue-100 text-lg mb-8 max-w-sm">
        Tối ưu hóa quy trình giảng dạy, quản lý học vụ và kết nối sinh viên trên một hệ thống duy nhất.
      </p>

      <div className="space-y-4">
        <div className="flex items-center gap-4 text-blue-100">
          <Users className="h-5 w-5 text-blue-300" />
          <span>Quản lý +1000 hồ sơ sinh viên</span>
        </div>
        <div className="flex items-center gap-4 text-blue-100">
          <BookOpen className="h-5 w-5 text-blue-300" />
          <span>Hệ thống phân quyền động linh hoạt</span>
        </div>
      </div>
    </div>
  </div>
));

BrandingSidebar.displayName = 'BrandingSidebar';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginSuccess, logout } = useAuthStore((state) => ({
    loginSuccess: state.loginSuccess,
    logout: state.logout,
  }));
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      
      logout();

      const response = await authService.login(data);
      
      if (response.code === 200) {
        loginSuccess(response.data); 
        toast.success(response.message || 'Đăng nhập thành công!');
        
        const userRoles = response.data.user?.roles || [];
        const targetPath = getDefaultPathByRole(userRoles);
        
        navigate(targetPath, { replace: true });
      } else {
        toast.error(response.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại!');
      }
      
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Không thể kết nối đến máy chủ!';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        <BrandingSidebar />
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex items-center justify-center bg-white">
          <div className="w-full max-w-sm">
            <LoginForm onSubmit={handleLoginSubmit} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};