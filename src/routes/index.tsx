/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React, { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react"; 

import { useAuthStore } from "@/store/authStore";
import { getDefaultPathByRole } from "@/config/menu.config";

import { MainLayout } from "@/layouts/MainLayout/MainLayout";
import { LoginPage } from "../features/auth/pages/LoginPage";

// Fallback UI hiển thị mượt mà trong lúc trình duyệt tải file JS của trang mới
const SuspenseFallback = () => (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] w-full bg-gray-50/50">
        <div className="flex flex-col items-center gap-3 text-blue-600">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-sm font-medium animate-pulse">Đang tải phân hệ...</span>
        </div>
    </div>
);

const Loadable = (Component: React.ComponentType<any>) => (props: any) => (
    <Suspense fallback={<SuspenseFallback />}>
        <Component {...props} />
    </Suspense>
);

// Hàm helper để giải quyết vấn đề Lazy Load với Named Exports thay vì Default Exports
const lazyImport = (factory: () => Promise<any>, name: string) => {
    return lazy(() => factory().then((module) => ({ default: module[name] })));
};

// LAZY IMPORT CÁC PHÂN HỆ (Tách Code Splitting theo từng trang)

// Auth & Profile
const ForgotPasswordPage = Loadable(lazyImport(() => import("@/features/auth/pages/ForgotPasswordPage"), "ForgotPasswordPage"));
const ResetPasswordPage = Loadable(lazyImport(() => import("@/features/auth/pages/ResetPasswordPage"), "ResetPasswordPage"));
const ProfilePage = Loadable(lazyImport(() => import("@/features/profile/pages/ProfilePage"), "ProfilePage"));

// Admin & Manager Features
const UserPage = Loadable(lazyImport(() => import("@/features/users/pages/UserPage"), "UserPage"));
const PermissionPage = Loadable(lazyImport(() => import("@/features/permissions/pages/PermissionPage"), "PermissionPage"));
const MajorPage = Loadable(lazyImport(() => import("@/features/major/pages/MajorPage"), "MajorPage"));
const SemesterManagement = Loadable(lazyImport(() => import("@/features/semesters/pages/SemesterManagement"), "SemesterManagement"));

// Course & Class Features
const CourseManagementPage = Loadable(lazyImport(() => import("@/features/courses/pages/CourseManagementPage"), "CourseManagementPage"));
const CourseProposalPage = Loadable(lazyImport(() => import("@/features/courses/pages/CourseProposalPage"), "CourseProposalPage"));
const ClassManagementPage = Loadable(lazyImport(() => import("@/features/classes/pages/ClassManagementPage"), "ClassManagementPage"));
const ClassRequestPage = Loadable(lazyImport(() => import("@/features/class-requests/pages/ClassRequestPage"), "ClassRequestPage"));
const RegistrationPeriodsPage = Loadable(lazyImport(() => import("@/features/classes/pages/RegistrationPeriodsPage"), "RegistrationPeriodsPage"));

// Student Features
const CourseRegistrationPage = Loadable(lazyImport(() => import("@/features/enrollments/pages/CourseRegistrationPage"), "CourseRegistrationPage"));
const TimetablePage = Loadable(lazyImport(() => import("@/features/timetable/pages/TimetablePage"), "TimetablePage"));
const StudentClassListPage = Loadable(lazyImport(() => import("@/features/student/pages/StudentClassListPage"), "StudentClassListPage"));
const StudentClassDetailPage = Loadable(lazyImport(() => import("@/features/student/pages/StudentClassDetailPage"), "StudentClassDetailPage"));
const StudentTakeExamPage = Loadable(lazyImport(() => import("@/features/student/pages/StudentTakeExamPage"), "StudentTakeExamPage"));
const StudentTranscriptPage = Loadable(lazyImport(() => import("@/features/grades/pages/StudentTranscriptPage"), "StudentTranscriptPage"));

// Teaching (Giảng viên) Features
const ClassListPage = Loadable(lazyImport(() => import("@/features/teaching/pages/ClassListPage"), "ClassListPage"));
const ClassWorkspaceLayout = Loadable(lazyImport(() => import("@/features/teaching/pages/ClassWorkspaceLayout"), "ClassWorkspaceLayout"));
const StudentManagePage = Loadable(lazyImport(() => import("@/features/teaching/pages/StudentManagePage"), "StudentManagePage"));
const LessonManagePage = Loadable(lazyImport(() => import("@/features/teaching/pages/LessonManagePage"), "LessonManagePage"));
const ExamManagePage = Loadable(lazyImport(() => import("@/features/teaching/pages/ExamManagePage"), "ExamManagePage"));
const GradeManagePage = Loadable(lazyImport(() => import("@/features/teaching/pages/GradeManagePage"), "GradeManagePage"));

// Inline Components
const RoleBasedRedirect = () => {
    const { user } = useAuthStore();
    const targetPath = getDefaultPathByRole(user?.roles);
    return <Navigate to={targetPath} replace />;
};

// CẤU HÌNH ROUTER
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
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
    },
    {
        path: "/reset-password",
        element: <ResetPasswordPage />,
    },
    {
        path: "/student/exams/:examId/take",
        element: <StudentTakeExamPage />, 
    },
    {
        path: "/dashboard",
        element: <MainLayout />, 
        children: [
            {
                index: true,
                element: <RoleBasedRedirect />,
            },
            { path: "users", element: <UserPage /> },
            { path: "permissions", element: <PermissionPage /> },
            { path: "majors", element: <MajorPage /> },
            { path: "subjects", element: <CourseManagementPage /> },
            { path: "courses", element: <ClassManagementPage /> },
            { path: "timetable", element: <TimetablePage /> },
            { path: "profile", element: <ProfilePage /> },
            { path: "course-suggest", element: <CourseProposalPage /> },
            { path: "semester", element: <SemesterManagement /> },
            { path: "course-approvals", element: <CourseProposalPage /> },
            { path: "approval-classes", element: <ClassRequestPage /> },
            { path: "registration", element: <RegistrationPeriodsPage /> },
            { path: "student-registration", element: <CourseRegistrationPage /> },
            { path: "results", element: <StudentTranscriptPage /> },
            
            {
                path: "student-classes",
                children: [
                    { index: true, element: <StudentClassListPage /> },
                    { path: ":classId", element: <StudentClassDetailPage /> },
                ],
            },
            {
                path: "teacher-classes",
                children: [
                    { index: true, element: <ClassListPage /> },
                    {
                        path: ":classId",
                        element: <ClassWorkspaceLayout />,
                        children: [
                            { index: true, element: <Navigate to="students" replace /> },
                            { path: "students", element: <StudentManagePage /> },
                            { path: "lessons", element: <LessonManagePage /> },
                            { path: "exams", element: <ExamManagePage /> },
                            { path: "grades", element: <GradeManagePage /> },
                        ],
                    },
                ],
            },
        ],
    },
    {
        path: "*",
        element: <Navigate to="/login" replace />,
    },
]);