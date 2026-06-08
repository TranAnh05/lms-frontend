import React from "react";
import { NavLink, useParams } from "react-router-dom";
import clsx from "clsx";

export const ClassWorkspaceNav: React.FC = () => {
    const { classId } = useParams<{ classId: string }>();

    const NAV_ITEMS = [
        { 
            id: "students", 
            label: "Danh sách Sinh viên", 
            path: `/dashboard/teacher-classes/${classId}/students` 
        },
        { 
            id: "lessons", 
            label: "Bài học & Tài liệu", 
            path: `/dashboard/teacher-classes/${classId}/lessons` 
        },
        { 
            id: "exams", 
            label: "Bài kiểm tra", 
            path: `/dashboard/teacher-classes/${classId}/exams` 
        },
        { 
            id: "grades", 
            label: "Bảng điểm", 
            path: `/dashboard/teacher-classes/${classId}/grades` 
        },
    ];

    return (
        <div className="bg-white border-b border-gray-200">
            <nav className="flex space-x-1 sm:space-x-8 px-4 sm:px-6 overflow-x-auto custom-scrollbar" aria-label="Tabs">
                {NAV_ITEMS.map((item) => (
                    <NavLink
                        key={item.id}
                        to={item.path}
                        className={({ isActive }) => clsx(
                            "py-4 px-3 border-b-2 text-sm font-semibold whitespace-nowrap transition-all duration-200",
                            isActive 
                                ? "border-blue-600 text-blue-700 bg-blue-50/50" 
                                : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
                        )}
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};