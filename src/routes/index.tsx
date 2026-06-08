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
import { RegistrationPeriodsPage } from "@/features/classes/pages/RegistrationPeriodsPage";
import { CourseRegistrationPage } from "@/features/enrollments/pages/CourseRegistrationPage";
import { TimetablePage } from "@/features/timetable/pages/TimetablePage";

// Imports module Teaching (Giảng viên)
import { ClassListPage } from "@/features/teaching/pages/ClassListPage";
import { ClassWorkspaceLayout } from "@/features/teaching/pages/ClassWorkspaceLayout";
import { StudentManagePage } from "@/features/teaching/pages/StudentManagePage";
import { LessonManagePage } from "@/features/teaching/pages/LessonManagePage";
import { ExamManagePage } from "@/features/teaching/pages/ExamManagePage";
import { GradeManagePage } from "@/features/teaching/pages/GradeManagePage";

const RoleBasedRedirect = () => {
    const { user } = useAuthStore();
    const targetPath = getDefaultPathByRole(user?.roles);

    return <Navigate to={targetPath} replace />;
};

const HeadQuanLyLopHoc = () => (
    <div className="text-xl font-bold text-gray-800">
        Giao diện Quản lý lớp học cho trưởng khoa
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
                path: "approval-classes",
                element: <ClassRequestPage />
            },
            {
                path: "head-classes",
                element: <HeadQuanLyLopHoc />
            },
            {
                path: "registration",
                element: <RegistrationPeriodsPage />
            },
            {
                path: "student-registration",
                element: <CourseRegistrationPage />
            },
            // Cấu hình Nested Routing cho Giảng viên (Teaching Module)
            {
                path: "teacher-classes",
                children: [
                    {
                        index: true,
                        element: <ClassListPage />
                    },
                    {
                        path: ":classId",
                        element: <ClassWorkspaceLayout />,
                        children: [
                            {
                                index: true,
                                element: <Navigate to="students" replace />
                            },
                            {
                                path: "students",
                                element: <StudentManagePage />
                            },
                            {
                                path: "lessons",
                                element: <LessonManagePage />
                            },
                            {
                                path: "exams",
                                element: <ExamManagePage />
                            },
                            {
                                path: "grades",
                                element: <GradeManagePage />
                            }
                        ]
                    }
                ]
            }
        ],
    },
    {
        path: "*",
        element: <Navigate to="/login" replace />,
    },
]);