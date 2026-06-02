import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { MainLayout } from "@/layouts/MainLayout/MainLayout";
import { useAuthStore } from "@/store/authStore";
import { getDefaultPathByRole } from "@/config/menu.config";

import { MajorPage } from "@/features/major/pages/MajorPage";

const RoleBasedRedirect = () => {
    const { user } = useAuthStore();
    const targetPath = getDefaultPathByRole(user?.roles);

    return <Navigate to={targetPath} replace />;
};

const UserManagementPage = () => (
    <div className="text-xl font-bold text-gray-800">
        Giao diện Quản lý Người dùng
    </div>
);
const SubjectManagementPage = () => (
    <div className="text-xl font-bold text-gray-800">
        Giao diện Quản lý Môn học
    </div>
);
const CourseManagementPage = () => (
    <div className="text-xl font-bold text-gray-800">
        Giao diện Quản lý Học phần
    </div>
);
const TimetablePage = () => (
    <div className="text-xl font-bold text-gray-800">
        Giao diện Thời khóa biểu
    </div>
);
const ProfilePage = () => (
    <div className="text-xl font-bold text-gray-800">
        Giao diện Hồ sơ cá nhân
    </div>
);

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/login" replace />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/dashboard",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <RoleBasedRedirect />,
            },
            {
                path: "users",
                element: <UserManagementPage />,
            },
            {
                path: "majors",
                element: <MajorPage />,
            },
            {
                path: "subjects",
                element: <SubjectManagementPage />,
            },
            {
                path: "courses",
                element: <CourseManagementPage />,
            },
            {
                path: "timetable",
                element: <TimetablePage />,
            },
            {
                path: "profile",
                element: <ProfilePage />,
            },
        ],
    },
    {
        path: "*",
        element: <Navigate to="/login" replace />,
    },
]);
