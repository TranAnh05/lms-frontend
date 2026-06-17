import React, { memo } from "react";
import clsx from "clsx";

export type StudentTabType = "LESSONS" | "EXAMS" | "GRADES";

interface StudentClassTabsProps {
    readonly activeTab: StudentTabType;
    readonly onTabChange: (tab: StudentTabType) => void;
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

// Su dung React.memo de chan dung hanh vi re-render vo nghia tu phia component cha
export const StudentClassTabs: React.FC<StudentClassTabsProps> = memo(
    ({ activeTab, onTabChange }) => {
        return (
            <div className="bg-white px-4 sm:px-6 border-b border-gray-200">
                {/* Bo sung aria-label va role de trinh doc man hinh nhan dien dung layout tablist */}
                <div
                    className="flex items-center gap-6 overflow-x-auto custom-scrollbar"
                    role="tablist"
                    aria-label="Thanh điều hướng lớp học"
                >
                    {TABS.map((tab) => {
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                aria-controls={`tab-panel-${tab.id}`}
                                id={`tab-control-${tab.id}`}
                                onClick={() => onTabChange(tab.id)}
                                className={clsx(
                                    "flex items-center gap-2.5 py-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap focus:outline-none select-none relative top-[1px]",
                                    isActive
                                        ? "border-blue-600 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300",
                                )}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    },
);

// Dat ten hien thi tuong minh phuc vu cho cac cong cu debug nhu React DevTools
StudentClassTabs.displayName = "StudentClassTabs";
