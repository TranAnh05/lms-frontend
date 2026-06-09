import React, { useState, useEffect } from "react";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import clsx from "clsx";
import { teachingService } from "../services/teaching.service";
import { type LecturerClassDetailResponse, type ClassStatus } from "../types";
import { ClassWorkspaceNav } from "../components/ClassWorkspaceNav";

const STATUS_CONFIG: Record<ClassStatus, { label: string; color: string }> = {
    PENDING: { label: "Chờ mở", color: "bg-amber-100 text-amber-700" },
    REGISTRATION: { label: "Đang đăng ký", color: "bg-blue-100 text-blue-700" },
    ONGOING: { label: "Đang diễn ra", color: "bg-emerald-100 text-emerald-700" },
    COMPLETED: { label: "Đã kết thúc", color: "bg-gray-100 text-gray-600" },
    CANCELED: { label: "Đã hủy", color: "bg-rose-100 text-rose-700" },
};

export const ClassWorkspaceLayout: React.FC = () => {
    const { classId } = useParams<{ classId: string }>();
    const navigate = useNavigate();
    
    const [classData, setClassData] = useState<LecturerClassDetailResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchClassDetail = async () => {
            if (!classId) return;
            try {
                const data = await teachingService.getClassDetail(Number(classId));
                if (data) {
                    setClassData(data);
                } else {
                    toast.error("Không tìm thấy thông tin lớp học.");
                    navigate("/dashboard/teacher-classes");
                }
            } catch (error) {
                toast.error("Lỗi khi tải dữ liệu lớp học.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchClassDetail();
    }, [classId, navigate]);

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Đang tải không gian lớp học...</p>
            </div>
        );
    }

    if (!classData) return null;

    const statusConfig = STATUS_CONFIG[classData.status];

    return (
        <div className="flex flex-col min-h-screen bg-gray-50/50">
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <button
                        onClick={() => navigate("/dashboard/teacher-classes")}
                        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors mb-5 w-max focus:outline-none"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Quay lại danh sách
                    </button>

                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2.5">
                                <span className={clsx("px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide rounded-md", statusConfig.color)}>
                                    {statusConfig.label}
                                </span>
                            </div>
                            
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                                {classData.courseName}
                            </h1>
                            
                            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 text-sm text-gray-600">
                                <div>
                                    <span className="text-gray-500">Mã lớp:</span>{" "}
                                    <span className="font-semibold text-gray-900">{classData.classCode}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-[1400px] mx-auto">
                    <ClassWorkspaceNav />
                </div>
            </div>

            <div className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-6 lg:p-8">
                <Outlet context={{ classData }} />
            </div>
        </div>
    );
};