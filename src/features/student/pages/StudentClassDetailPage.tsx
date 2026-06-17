/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, BookOpen } from "lucide-react";
import { toast } from "react-toastify";
import clsx from "clsx";
import { studentService } from "../services/student.service";
import { type StudentClassResponse } from "../types";
import {
    StudentClassTabs,
    type StudentTabType,
} from "../components/class-detail/StudentClassTabs";
import { StudentLessonList } from "../components/lessons/StudentLessonList";
import { StudentExamList } from "../components/exams/StudentExamList";
import { StudentGradeView } from "../components/class-detail/StudentGradeView";

export const StudentClassDetailPage: React.FC = () => {
    // Ep kieu tham so URL sang number ngay tu dau de thong nhat kieu du lieu so sanh
    const { classId: classIdParam } = useParams<{ classId: string }>();
    const classId = useMemo(() => Number(classIdParam), [classIdParam]);
    const navigate = useNavigate();

    const [classInfo, setClassInfo] = useState<StudentClassResponse | null>(
        null,
    );
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<StudentTabType>("LESSONS");

    useEffect(() => {
        if (!classId || Number.isNaN(classId)) {
            setIsLoading(false);
            return;
        }

        let isMounted = true;

        const fetchClassDetail = async () => {
            try {
                // Toi uu hoa: Goi ham lay danh sach da duoc chuan hoa kieu du lieu o tang service, khong can dung "as any"
                const classList = await studentService.getMyClassesRegistered();

                if (isMounted) {
                    const currentClass = classList?.find(
                        (c) => c.classId === classId,
                    );

                    if (currentClass) {
                        setClassInfo(currentClass);
                    } else {
                        toast.error("Không tìm thấy thông tin lớp học.");
                    }
                }
            } catch {
                if (isMounted) {
                    toast.error("Lỗi kết nối: Không thể tải thông tin lớp.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchClassDetail();

        return () => {
            isMounted = false;
        };
    }, [classId]);

    // Dung useCallback de giu nguyen tham chieu ham dieu huong, tranh re-render khong dang co o the button
    const handleBackToList = useCallback(() => {
        navigate("/dashboard/student-classes");
    }, [navigate]);

    // Dung useMemo de cache noi dung tab, ngan chan viec re-render ca sub-component con khi tab khong thay doi
    const tabContent = useMemo(() => {
        if (!classId) return null;

        switch (activeTab) {
            case "LESSONS":
                return <StudentLessonList classId={classId} />;
            case "EXAMS":
                return <StudentExamList classId={classId} />;
            case "GRADES":
                return <StudentGradeView classId={classId} />;
            default:
                return null;
        }
    }, [activeTab, classId]);

    if (isLoading) {
        return (
            <div
                className="flex flex-col items-center justify-center min-h-[60vh]"
                aria-live="polite"
            >
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">
                    Đang tải thông tin không gian lớp...
                </p>
            </div>
        );
    }

    if (!classInfo) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Không tìm thấy lớp học
                </h2>
                <p className="text-gray-500 mb-6">
                    Lớp học không tồn tại hoặc bạn không có quyền truy cập.
                </p>
                <button
                    type="button"
                    onClick={handleBackToList}
                    className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors select-none focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                    Quay lại danh sách
                </button>
            </div>
        );
    }

    const isOngoing = classInfo.status === "ONGOING";

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
            <button
                type="button"
                onClick={handleBackToList}
                className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors w-fit focus:outline-none select-none group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Quay lại danh sách lớp
            </button>

            {/* Khung thong tin Banner lop hoc */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 sm:px-8 sm:py-10 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none select-none">
                        <BookOpen className="w-48 h-48" />
                    </div>

                    <div className="relative z-10 space-y-3">
                        <div className="flex items-center gap-3">
                            <span
                                className={clsx(
                                    "px-3 py-1 text-xs font-bold rounded-lg backdrop-blur-sm border uppercase tracking-wider select-none",
                                    isOngoing
                                        ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-50"
                                        : "bg-gray-500/20 border-gray-500/30 text-gray-50",
                                )}
                            >
                                {isOngoing ? "Đang diễn ra" : "Đã kết thúc"}
                            </span>
                            {/* Bo sung hien thi truc quan ClassCode len banner detail */}
                            <span className="text-xs font-mono opacity-70 tracking-wide">
                                Mã lớp: {classInfo.classCode}
                            </span>
                        </div>

                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight max-w-3xl">
                            {classInfo.courseName}
                        </h1>
                    </div>
                </div>

                <StudentClassTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />
            </div>

            {/* Phan render noi dung cac component con */}
            <div className="mt-6">{tabContent}</div>
        </div>
    );
};
