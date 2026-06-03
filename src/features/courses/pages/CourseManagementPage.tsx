/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { BookOpen } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { courseService } from "../services/course.service";
import { type Course } from "../types";
import { userService } from "@/features/users/services/user.service";
import { type Department } from "@/features/courses/types";
import { CourseFilter } from "../components/CourseFilter";
import { CourseTable } from "../components/CourseTable";
import { CourseDetailModal } from "../components/CourseDetailModal";

export const CourseManagementPage: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const pageSize = 10;
    const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(
        null,
    );

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const departmentsData = (await userService.getDepartments(
                    undefined,
                    true,
                )) as unknown as Department[];
                setDepartments(departmentsData);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu Khoa:", error);
                toast.error(
                    "Không thể tải danh sách Khoa. Vui lòng tải lại trang.",
                );
            }
        };

        fetchDropdownData();
    }, []);

    const fetchCoursesData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await courseService.getCourses({
                keyword: debouncedSearchTerm.trim(),
                departmentId: selectedDeptId,
                page: currentPage,
                size: pageSize,
                sortBy: "createdAt",
                sortDirection: "desc",
            });

            setCourses(response.content);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error("Lỗi gọi API lấy danh sách môn học:", error);
            toast.error(
                "Đã xảy ra lỗi khi lấy danh sách môn học. Vui lòng thử lại.",
            );
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearchTerm, selectedDeptId, currentPage]);

    useEffect(() => {
        fetchCoursesData();
    }, [fetchCoursesData]);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(0);
    };

    const handleDeptChange = (id: number | null) => {
        setSelectedDeptId(id);
        setCurrentPage(0);
    };

    const handleViewDetail = useCallback((id: number) => {
        setSelectedCourseId(id);
        setIsViewModalOpen(true);
    }, []);

    const handleCloseViewModal = useCallback(() => {
        setIsViewModalOpen(false);
        setSelectedCourseId(null);
    }, []);

    const handleEditCourse = useCallback((id: number) => {
        toast.info(`Đang chuyển sang form cập nhật môn học ID: ${id}`);
    }, []);

    const handleDeleteCourse = async (id: number, code: string) => {
        if (
            window.confirm(
                `Thao tác này không thể hoàn tác! Bạn có chắc chắn muốn xóa môn học [${code}] không?`,
            )
        ) {
            try {
                await courseService.deleteCourse(id);
                toast.success(`Đã xóa thành công môn học: ${code}`);
                fetchCoursesData();
            } catch (error) {
                console.error("Lỗi khi xóa môn học:", error);
                toast.error(
                    `Xóa môn học [${code}] thất bại. Vui lòng kiểm tra lại.`,
                );
            }
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-gray-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                        <BookOpen className="w-7 h-7 text-blue-600" /> Quản lý
                        Môn học
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Tra cứu, cập nhật và quản lý danh mục các môn học đang
                        được đào tạo trong trường.
                    </p>
                </div>
            </div>

            <CourseFilter
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                departments={departments}
                selectedDeptId={selectedDeptId}
                onDeptChange={handleDeptChange}
            />

            <div className="flex-1 relative">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px] z-10 rounded-xl border border-gray-100">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin shadow-sm"></div>
                            <span className="text-sm font-medium text-blue-700 animate-pulse bg-white/80 px-3 py-1 rounded-full shadow-sm">
                                Đang tải danh sách môn học...
                            </span>
                        </div>
                    </div>
                )}

                <CourseTable
                    courses={courses}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    onView={handleViewDetail}
                    onEdit={handleEditCourse}
                    onDelete={handleDeleteCourse}
                />
            </div>

            <CourseDetailModal
                isOpen={isViewModalOpen}
                onClose={handleCloseViewModal}
                courseId={selectedCourseId}
            />
        </div>
    );
};
