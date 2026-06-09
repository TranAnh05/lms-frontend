import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, BookOpen } from "lucide-react";
import { toast } from "react-toastify";
import clsx from "clsx";
import { studentService } from "../services/student.service";
import { type StudentClassResponse } from "../types";
import { StudentClassTabs, type StudentTabType } from "../components/class-detail/StudentClassTabs";
import { StudentLessonList } from "../components/lessons/StudentLessonList";
import { StudentExamList } from "../components/exams/StudentExamList";
import { StudentGradeView } from "../components/class-detail/StudentGradeView";

export const StudentClassDetailPage: React.FC = () => {
    const { classId } = useParams<{ classId: string }>();
    const navigate = useNavigate();
    
    const [classInfo, setClassInfo] = useState<StudentClassResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<StudentTabType>("LESSONS");

    useEffect(() => {
        const fetchClassDetail = async () => {
            if (!classId) return;
            try {
                const classes = await studentService.getMyClasses();
                const classList = Array.isArray(classes) ? classes : (classes as any).data;
                const currentClass = classList?.find((c: StudentClassResponse) => c.classId === Number(classId));
                
                if (currentClass) {
                    setClassInfo(currentClass);
                } else {
                    toast.error("Không tìm thấy thông tin lớp học.");
                }
            } catch (error) {
                toast.error("Lỗi kết nối: Không thể tải thông tin lớp.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchClassDetail();
    }, [classId]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Đang tải thông tin không gian lớp...</p>
            </div>
        );
    }

    if (!classInfo) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy lớp học</h2>
                <p className="text-gray-500 mb-6">Lớp học không tồn tại hoặc bạn không có quyền truy cập.</p>
                <button 
                    onClick={() => navigate("/dashboard/student-classes")}
                    className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Quay lại danh sách
                </button>
            </div>
        );
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case "LESSONS":
                return <StudentLessonList classId={Number(classId)} />;
            case "EXAMS":
                return <StudentExamList classId={Number(classId)} />;
            case "GRADES":
                return <StudentGradeView classId={Number(classId)} />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
            <button
                onClick={() => navigate("/dashboard/student-classes")}
                className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors w-fit focus:outline-none"
            >
                <ArrowLeft className="w-4 h-4" />
                Quay lại danh sách lớp
            </button>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 sm:px-8 sm:py-10 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <BookOpen className="w-48 h-48" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-3">
                            <span className={clsx(
                                "px-3 py-1 text-xs font-bold rounded-lg backdrop-blur-sm border uppercase tracking-wider",
                                classInfo.status === 'ONGOING' 
                                    ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-50" 
                                    : "bg-gray-500/20 border-gray-500/30 text-gray-50"
                            )}>
                                {classInfo.status === 'ONGOING' ? 'Đang diễn ra' : 'Đã kết thúc'}
                            </span>
                        </div>
                        
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight max-w-3xl">
                            {classInfo.courseName}
                        </h1>
                    </div>
                </div>

                <StudentClassTabs activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            <div className="mt-6">
                {renderTabContent()}
            </div>
        </div>
    );
};