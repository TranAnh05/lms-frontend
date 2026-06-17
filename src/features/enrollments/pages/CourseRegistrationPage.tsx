/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";

import {
    type CourseWithClassesResponse,
    type EnrollmentResponse,
    type ClassInfo,
} from "../types";
import { enrollmentService } from "../services/enrollment.service";

import { CourseListWithClasses } from "../components/CourseListWithClasses";
import { RegisteredClassesTable } from "../components/RegisteredClassesTable";
import { ClassDetailModal } from "../components/ClassDetailModal";

// Cấu trúc lỗi chuẩn từ API
interface ApiErrorResponse {
    response?: {
        data?: {
            message?: string;
        };
    };
}

export const CourseRegistrationPage: React.FC = () => {
    const [courses, setCourses] = useState<CourseWithClassesResponse[]>([]);
    const [registeredClasses, setRegisteredClasses] = useState<
        EnrollmentResponse[]
    >([]);

    // Gộp 2 trạng thái loading chạy song song làm một để giảm số lần re-render
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);
    const [selectedCourseContext, setSelectedCourseContext] =
        useState<CourseWithClassesResponse | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // Lấy dữ liệu API khởi tạo
    const fetchInitialData = useCallback(async (isMounted: boolean) => {
        setIsLoading(true);
        try {
            const [coursesData, registeredData] = await Promise.all([
                enrollmentService.getAvailableCourses(),
                enrollmentService.getRegisteredClasses(),
            ]);

            if (!isMounted) return;
            setCourses(coursesData);
            setRegisteredClasses(registeredData);
        } catch {
            toast.error("Lỗi khi tải dữ liệu đăng ký học phần.");
        } finally {
            if (isMounted) setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;
        fetchInitialData(isMounted);

        return () => {
            isMounted = false;
        };
    }, [fetchInitialData]);

    // Tối ưu hóa mảng ID đã đăng ký bằng useMemo
    const registeredClassIds = useMemo(() => {
        return registeredClasses.map((rc) => rc.classId);
    }, [registeredClasses]);

    // Xử lý nút Đăng ký học phần
    const handleRegisterClass = async (classId: number) => {
        if (isProcessing) return;
        setIsProcessing(true);
        try {
            await enrollmentService.registerClass(classId);

            // Cập nhật lại danh sách và giỏ hàng để đồng bộ số lượng mới nhất
            const [coursesData, registeredData] = await Promise.all([
                enrollmentService.getAvailableCourses(),
                enrollmentService.getRegisteredClasses(),
            ]);
            setCourses(coursesData);
            setRegisteredClasses(registeredData);

            toast.success("Đăng ký lớp học phần thành công!");
        } catch (error) {
            // Ép kiểu an toàn thay vì dùng any để tránh lỗi ESLint
            const apiError = error as ApiErrorResponse;
            toast.error(
                apiError.response?.data?.message ||
                    "Đăng ký thất bại. Lớp có thể đã đầy hoặc bị trùng lịch.",
            );
        } finally {
            setIsProcessing(false);
        }
    };

    // Bọc useCallback vì hàm này được truyền trực tiếp xuống component con
    const handleViewDetail = useCallback(
        (classData: ClassInfo, course: CourseWithClassesResponse) => {
            setSelectedClass(classData);
            setSelectedCourseContext(course);
            setIsDetailModalOpen(true);
        },
        [],
    );

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 sm:p-4 lg:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900">
                                DANH SÁCH MÔN HỌC MỞ ĐĂNG KÝ
                            </h2>
                        </div>

                        <CourseListWithClasses
                            data={courses}
                            isLoading={isLoading}
                            registeredClassIds={registeredClassIds}
                            onRegisterClass={handleRegisterClass}
                            onViewDetail={handleViewDetail}
                        />
                    </div>

                    {courses.length > 0 && (
                        <RegisteredClassesTable
                            data={registeredClasses}
                            isLoading={isLoading}
                        />
                    )}
                </div>
            </div>

            <ClassDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                classData={selectedClass}
                courseName={selectedCourseContext?.courseName}
                courseCode={selectedCourseContext?.courseName} // Giữ nguyên logic fallback cũ của dự án
            />
        </div>
    );
};
