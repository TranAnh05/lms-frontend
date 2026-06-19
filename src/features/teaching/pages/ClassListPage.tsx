import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, BookMarked, Inbox } from "lucide-react";
import { toast } from "react-toastify";
import clsx from "clsx";
import { teachingService } from "../services/teaching.service";
import { type LecturerClassResponse, type ClassStatus } from "../types";
import { ClassCard } from "../components/ClassCard";

// Cấu hình các tùy chọn bộ lọc trạng thái lớp học
const FILTER_OPTIONS: { value: ClassStatus | "ALL"; label: string }[] = [
    { value: "ALL", label: "Tất cả" },
    { value: "ONGOING", label: "Đang diễn ra" },
    { value: "PENDING", label: "Chờ mở" },
    { value: "REGISTRATION", label: "Đang đăng ký" },
    { value: "COMPLETED", label: "Đã kết thúc" },
    { value: "CANCELED", label: "Đã hủy" },
];

export const ClassListPage: React.FC = () => {
    const [classes, setClasses] = useState<LecturerClassResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState<ClassStatus | "ALL">(
        "ALL",
    );
    const navigate = useNavigate();

    // Gọi API lấy danh sách lớp học khi component mount
    useEffect(() => {
        let isMounted = true;

        const fetchClasses = async () => {
            try {
                const data = await teachingService.getAssignedClasses();
                if (isMounted) {
                    setClasses(data);
                }
            } catch {
                toast.error("Không thể tải danh sách lớp học.");
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchClasses();

        // Dọn dẹp để tránh memory leak nếu chuyển trang sớm
        return () => {
            isMounted = false;
        };
    }, []);

    // Tối ưu tham chiếu hàm điều hướng khi click vào lớp học
    const handleClassClick = useCallback(
        (classId: number) => {
            navigate(`/dashboard/teacher-classes/${classId}/students`);
        },
        [navigate],
    );

    // Tối ưu hiệu năng lọc danh sách lớp học bằng useMemo
    const filteredClasses = useMemo(() => {
        return classes.filter(
            (c) => selectedStatus === "ALL" || c.status === selectedStatus,
        );
    }, [classes, selectedStatus]);

    // Trạng thái hiển thị khi đang tải dữ liệu
    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">
                    Đang tải danh sách lớp học...
                </p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Tiêu đề trang */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-600 text-white rounded-xl shadow-sm">
                    <BookMarked className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                        Lớp học của tôi
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Danh sách các học phần bạn đang phụ trách giảng dạy
                    </p>
                </div>
            </div>

            {/* Thanh bộ lọc trạng thái */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
                {FILTER_OPTIONS.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => setSelectedStatus(option.value)}
                        className={clsx(
                            "px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 focus:outline-none",
                            selectedStatus === option.value
                                ? "bg-blue-600 text-white shadow-sm"
                                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-blue-300",
                        )}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {/* Khu vực hiển thị danh sách kết quả hoặc thông báo trống */}
            {classes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200 border-dashed">
                    <div className="p-4 bg-gray-50 rounded-full mb-3 text-gray-400">
                        <Inbox className="w-10 h-10" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                        Chưa có lớp học nào
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Bạn chưa được phân công giảng dạy lớp học phần nào trong
                        học kỳ này.
                    </p>
                </div>
            ) : filteredClasses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200 border-dashed">
                    <div className="p-4 bg-gray-50 rounded-full mb-3 text-gray-400">
                        <Inbox className="w-10 h-10" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                        Không tìm thấy lớp học
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Không có lớp học nào phù hợp với trạng thái đã chọn.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredClasses.map((classItem) => (
                        <ClassCard
                            key={classItem.classId}
                            classData={classItem}
                            onClick={handleClassClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
