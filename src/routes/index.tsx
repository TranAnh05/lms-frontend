import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '../features/auth/pages/LoginPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/dashboard',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-2xl font-bold text-blue-800">
        Chào mừng bạn đến với Dashboard! (Giao diện đang xây dựng...)
      </div>
    ),
  }
]);