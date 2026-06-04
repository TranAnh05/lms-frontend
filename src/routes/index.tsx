/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { MainLayout } from "@/layouts/MainLayout/MainLayout";
import { useAuthStore } from "@/store/authStore";
import { getDefaultPathByRole } from "@/config/menu.config";
import { MajorPage } from "@/features/major/pages/MajorPage";
import { UserPage } from "@/features/users/pages/UserPage";
import { PermissionPage } from "@/features/permissions/pages/PermissionPage";
import { CourseManagementPage } from "@/features/courses/pages/CourseManagementPage";
import { CourseProposalPage } from "@/features/courses/pages/CourseProposalPage";
import { SemesterManagement } from "@/features/semesters/pages/SemesterManagement";
import { ClassManagementPage } from "@/features/classes/pages/ClassManagementPage";
import { ClassRequestPage } from "@/features/class-requests/pages/ClassRequestPage";

const RoleBasedRedirect = () => {
    const { user } = useAuthStore();
    const targetPath = getDefaultPathByRole(user?.roles);

    return <Navigate to={targetPath} replace />;
};

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
                element: <UserPage />,
            },
            {
                path: "permissions",
                element: <PermissionPage />,
            },
            {
                path: "majors",
                element: <MajorPage />,
            },
            {
                path: "subjects",
                element: <CourseManagementPage />,
            },
            {
                path: "courses",
                element: <ClassManagementPage />,
            },
            {
                path: "timetable",
                element: <TimetablePage />,
            },
            {
                path: "profile",
                element: <ProfilePage />,
            },
            {
                path: "course-suggest",
                element: <CourseProposalPage />,
            },
            {
                path: "semester",
                element: <SemesterManagement />,
            },
            {
                path: "course-approvals",
                element: <CourseProposalPage />,
            },
            {
                path: "courses",
                element: <ClassManagementPage />,
            },
            {
                path: "approval-classes",
                element: <ClassRequestPage />
            }
        ],
    },
    {
        path: "*",
        element: <Navigate to="/login" replace />,
    },
]);
