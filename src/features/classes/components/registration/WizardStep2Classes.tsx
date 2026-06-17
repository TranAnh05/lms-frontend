import React, { useState, useMemo, useEffect, useCallback, memo } from "react";
import {
    ArrowLeft,
    CheckCircle2,
    BookOpen,
    Users,
    ChevronDown,
    ChevronUp,
    Inbox,
    Loader2,
} from "lucide-react";
import clsx from "clsx";
import { type ClassPendingResponse } from "../../types/registration.types";

interface CourseGroup {
    courseId: number;
    courseCode: string;
    courseName: string;
    classes: ClassPendingResponse[];
}

interface WizardStep2ClassesProps {
    pendingClasses: ClassPendingResponse[];
    onBack: () => void;
    onSubmit: () => void;
    isLoading: boolean;
    isSubmitting: boolean;
}

// Toi uu 1: Su dung React.memo de ngan chan re-render khi cac state cua Component cha thay doi
export const WizardStep2Classes: React.FC<WizardStep2ClassesProps> = memo(
    ({ pendingClasses, onBack, onSubmit, isLoading, isSubmitting }) => {
        const [expandedCourses, setExpandedCourses] = useState<number[]>([]);

        const groupedClasses = useMemo(() => {
            const groups: Record<number, CourseGroup> = {};
            pendingClasses.forEach((cls) => {
                if (!groups[cls.courseId]) {
                    groups[cls.courseId] = {
                        courseId: cls.courseId,
                        courseCode: cls.courseCode,
                        courseName: cls.courseName,
                        classes: [],
                    };
                }
                groups[cls.courseId].classes.push(cls);
            });
            return Object.values(groups);
        }, [pendingClasses]);

        // Tu dong mo rong tat ca cac nhom lop khi co du lieu moi
        useEffect(() => {
            if (groupedClasses.length > 0) {
                setExpandedCourses(groupedClasses.map((g) => g.courseId));
            }
        }, [groupedClasses]);

        // Toi uu 2: Su dung useCallback de giu on dinh tham chieu ham, tranh tao lai moi khi render
        const toggleCourseCollapse = useCallback((courseId: number) => {
            setExpandedCourses((prev) =>
                prev.includes(courseId)
                    ? prev.filter((id) => id !== courseId)
                    : [...prev, courseId],
            );
        }, []);

        return (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                        Xem trước danh sách lớp học phần
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Dưới đây là danh sách các lớp học phần sẽ được hệ thống{" "}
                        <strong>tự động mở đăng ký</strong> dựa trên cấu hình
                        Học kỳ và Khoa ở bước trước.
                    </p>

                    <div className="mt-4 inline-flex items-center gap-3 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg text-sm font-medium text-blue-800 shadow-sm">
                        <span>
                            Tổng số lượng:{" "}
                            <strong>{pendingClasses.length}</strong> lớp học
                            phần
                        </span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-6 space-y-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-blue-600">
                            <Loader2 className="w-10 h-10 animate-spin mb-3" />
                            <p className="text-sm font-medium text-gray-500">
                                Đang truy xuất dữ liệu lớp học phần...
                            </p>
                        </div>
                    ) : groupedClasses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white border border-gray-100 rounded-xl shadow-sm text-center">
                            <div className="p-4 bg-gray-50 text-gray-400 rounded-full mb-4">
                                <Inbox className="w-10 h-10" />
                            </div>
                            <h3 className="text-base font-bold text-gray-900 mb-1">
                                Không tìm thấy lớp học phần hợp lệ
                            </h3>
                            <p className="text-sm text-gray-500 max-w-md">
                                Không có lớp học phần nào đang chờ mở thuộc Học
                                kỳ và Khoa bạn đã chọn. Đợt đăng ký này sẽ không
                                có lớp nào được gắn vào.
                            </p>
                        </div>
                    ) : (
                        groupedClasses.map((group) => {
                            const isExpanded = expandedCourses.includes(
                                group.courseId,
                            );

                            return (
                                <div
                                    key={group.courseId}
                                    className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all duration-200"
                                >
                                    <div
                                        className="flex items-center justify-between px-5 py-3 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors border-b border-gray-100"
                                        onClick={() =>
                                            toggleCourseCollapse(group.courseId)
                                        }
                                    >
                                        <div className="flex items-center gap-3">
                                            <BookOpen className="w-4 h-4 text-blue-600" />
                                            <span className="font-bold text-gray-900 text-sm">
                                                {group.courseName}{" "}
                                                <span className="text-gray-500 font-medium ml-1">
                                                    ({group.courseCode})
                                                </span>
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs font-semibold text-gray-500 bg-white px-2.5 py-1 rounded-md border border-gray-200 shadow-sm">
                                                {group.classes.length} lớp
                                            </span>
                                            {isExpanded ? (
                                                <ChevronUp className="w-4 h-4 text-gray-400" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4 text-gray-400" />
                                            )}
                                        </div>
                                    </div>

                                    <div
                                        className={clsx(
                                            "overflow-hidden transition-all duration-300 ease-in-out",
                                            isExpanded
                                                ? "max-h-[1000px] opacity-100"
                                                : "max-h-0 opacity-0",
                                        )}
                                    >
                                        <div className="p-0">
                                            <table className="w-full text-sm text-left">
                                                <tbody className="divide-y divide-gray-50">
                                                    {group.classes.map(
                                                        (cls) => (
                                                            <tr
                                                                key={cls.id}
                                                                className="hover:bg-blue-50/50 transition-colors"
                                                            >
                                                                <td className="px-6 py-3.5 font-medium text-gray-900 w-1/2">
                                                                    <span className="bg-gray-100 px-2.5 py-1 rounded border border-gray-200 font-mono text-xs text-gray-700">
                                                                        {
                                                                            cls.code
                                                                        }
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-3.5 text-gray-600 text-right w-1/2">
                                                                    <div className="flex items-center justify-end gap-2">
                                                                        <Users className="w-4 h-4 text-gray-400 shrink-0" />
                                                                        <span className="text-sm">
                                                                            Sĩ
                                                                            số:{" "}
                                                                            <strong className="text-gray-900">
                                                                                {
                                                                                    cls.maxStudents
                                                                                }
                                                                            </strong>
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="pt-4 mt-2 border-t border-gray-100 flex justify-between shrink-0">
                    <button
                        onClick={onBack}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors focus:ring-4 focus:ring-gray-100 disabled:opacity-50 shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Quay lại
                    </button>
                    <button
                        onClick={onSubmit}
                        disabled={pendingClasses.length === 0 || isSubmitting}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-500/20 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed shadow-sm"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-4 h-4" />
                                Hoàn tất tạo đợt
                            </>
                        )}
                    </button>
                </div>
            </div>
        );
    },
);

WizardStep2Classes.displayName = "WizardStep2Classes";
