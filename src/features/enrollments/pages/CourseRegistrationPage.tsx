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

export const CourseRegistrationPage: React.FC = () => {
    const [courses, setCourses] = useState<CourseWithClassesResponse[]>([]);
    const [registeredClasses, setRegisteredClasses] = useState<
        EnrollmentResponse[]
    >([]);

    const [isLoadingCourses, setIsLoadingCourses] = useState(true);
    const [isLoadingCart, setIsLoadingCart] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);
    const [selectedCourseContext, setSelectedCourseContext] =
        useState<CourseWithClassesResponse | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // Lấy dữ liệu API khởi tạo
    const fetchInitialData = useCallback(async () => {
        setIsLoadingCourses(true);
        setIsLoadingCart(true);
        try {
            const [coursesData, registeredData] = await Promise.all([
                enrollmentService.getAvailableCourses(),
                enrollmentService.getRegisteredClasses(),
            ]);
            setCourses(coursesData);
            setRegisteredClasses(registeredData);
        } catch (error) {
            toast.error("Lỗi khi tải dữ liệu đăng ký học phần.");
        } finally {
            setIsLoadingCourses(false);
            setIsLoadingCart(false);
        }
    }, []);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    const registeredClassIds = useMemo(() => {
        return registeredClasses.map((rc) => rc.classId);
    }, [registeredClasses]);

    // Xử lý nút Đăng ký học phần
    const handleRegisterClass = async (classId: number) => {
        if (isProcessing) return;
        setIsProcessing(true);
        try {
            await enrollmentService.registerClass(classId);

            // Cập nhật lại giỏ hàng và danh sách (số lượng currentStudent) để đồng bộ mới nhất
            const [coursesData, registeredData] = await Promise.all([
                enrollmentService.getAvailableCourses(),
                enrollmentService.getRegisteredClasses(),
            ]);
            setCourses(coursesData);
            setRegisteredClasses(registeredData);

            toast.success("Đăng ký lớp học phần thành công!");
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                    "Đăng ký thất bại. Lớp có thể đã đầy hoặc bị trùng lịch.",
            );
        } finally {
            setIsProcessing(false);
        }
    };

    // Xử lý xem chi tiết
    const handleViewDetail = (
        classData: ClassInfo,
        course: CourseWithClassesResponse,
    ) => {
        setSelectedClass(classData);
        setSelectedCourseContext(course);
        setIsDetailModalOpen(true);
    };

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
                            isLoading={isLoadingCourses}
                            registeredClassIds={registeredClassIds}
                            onRegisterClass={handleRegisterClass}
                            onViewDetail={handleViewDetail}
                        />
                    </div>

                    {courses.length > 0 && (
                        <RegisteredClassesTable
                            data={registeredClasses}
                            isLoading={isLoadingCart}
                        />
                    )}
                </div>
            </div>

            <ClassDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                classData={selectedClass}
                courseName={selectedCourseContext?.courseName}
                courseCode={selectedCourseContext?.courseName} // Tạm thời dùng Name nếu backend không trả Code cho course
            />
        </div>
    );
};
