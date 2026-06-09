import React from "react";
import clsx from "clsx";

export type StudentTabType = "LESSONS" | "EXAMS" | "GRADES";

interface StudentClassTabsProps {
    activeTab: StudentTabType;
    onTabChange: (tab: StudentTabType) => void;
}

const TABS = [
    { 
        id: "LESSONS", 
        label: "Bài học & Tài liệu", 
    },
    { 
        id: "EXAMS", 
        label: "Bài kiểm tra", 
    },
    { 
        id: "GRADES", 
        label: "Bảng điểm", 
    },
] as const;

export const StudentClassTabs: React.FC<StudentClassTabsProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="bg-white px-4 sm:px-6 border-b border-gray-200">
            <div className="flex items-center gap-6 overflow-x-auto custom-scrollbar">
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={clsx(
                                "flex items-center gap-2.5 py-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap focus:outline-none",
                                isActive
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
                            )}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};