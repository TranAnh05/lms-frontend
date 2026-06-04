/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { Layers, Plus } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { classService } from "../services/class.service";
import { type ClassResponse, type PageResponse } from "../types";
import { ClassFilter } from "../components/ClassFilter";
import { ClassTable } from "../components/ClassTable";
import { AssignLecturerModal } from "../components/AssignLecturerModal";
const MOCK_SEMESTERS = [
    { id: 1, name: "Học kỳ 1 (2025-2026)" },
    { id: 2, name: "Học kỳ 2 (2025-2026)" },
    { id: 3, name: "Học kỳ Hè (2025-2026)" },
];

const MOCK_DEPARTMENTS = [
    { id: 1, name: "Khoa Công nghệ thông tin" },
    { id: 2, name: "Khoa Ngôn ngữ Anh" },
    { id: 3, name: "Khoa Kinh tế" },
];

const MOCK_LECTURERS = [
    { id: 10, name: "ThS. Trần Giảng Viên" },
    { id: 11, name: "TS. Lê Data" },
    { id: 12, name: "ThS. Phạm Cloud" },
];

export const ClassManagementPage: React.FC = () => {
    const [data, setData] = useState<PageResponse<ClassResponse> | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedSemester, setSelectedSemester] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<string>("");
    const [selectedDepartment, setSelectedDepartment] = useState<string>("");
    const [selectedLecturer, setSelectedLecturer] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(0);
    const pageSize = 10;
    const debouncedSearchTerm = useDebounce(searchTerm, 400);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState<boolean>(false);
    const [selectedClassForAssign, setSelectedClassForAssign] =
        useState<ClassResponse | null>(null);

    const fetchClasses = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await classService.getClasses({
                keyword: debouncedSearchTerm.trim() || undefined,
                semesterId: selectedSemester
                    ? Number(selectedSemester)
                    : undefined,
                status: selectedStatus || undefined,
                page: currentPage,
                size: pageSize,
            });
            setData(response);
        } catch (error) {
            console.error("Lỗi khi tải danh sách lớp học phần:", error);
            toast.error(
                "Không thể tải dữ liệu lớp học phần. Vui lòng thử lại.",
            );
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearchTerm, selectedSemester, selectedStatus, currentPage]);

    useEffect(() => {
        fetchClasses();
    }, [fetchClasses]);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(0);
    };

    const handleSemesterChange = (semesterId: string) => {
        setSelectedSemester(semesterId);
        setCurrentPage(0);
    };

    const handleStatusChange = (status: string) => {
        setSelectedStatus(status);
        setCurrentPage(0);
    };

    const handleDepartmentChange = (departmentId: string) => {
        setSelectedDepartment(departmentId);
        setCurrentPage(0);
    };

    const handleLecturerChange = (lecturerId: string) => {
        setSelectedLecturer(lecturerId);
        setCurrentPage(0);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleAddClick = () => {
        toast.info("Tính năng Mở lớp học phần đang được xây dựng.");
    };

    const handleViewDetail = (id: number) => {
        toast.info(`Xem chi tiết lớp học phần ID: ${id}`);
    };

    const handleAssignLecturer = (id: number) => {
        const classItem = data?.content.find((item) => item.id === id);

        if (classItem) {
            setSelectedClassForAssign(classItem);
            setIsAssignModalOpen(true);
        } else {
            toast.error("Không tìm thấy thông tin lớp học phần này.");
        }
    };

    const handleCloseAssignModal = () => {
        setIsAssignModalOpen(false);
        setSelectedClassForAssign(null);
    };

    const handleAssignSuccess = () => {
        handleCloseAssignModal();
        fetchClasses();
    };

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-gray-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                        <Layers className="w-7 h-7 text-blue-600" /> Quản lý Lớp
                        học phần
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Quản lý danh sách lớp, sĩ số, phân công giảng viên và
                        theo dõi tiến độ đào tạo.
                    </p>
                </div>

                <button
                    onClick={handleAddClick}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    Mở lớp học phần
                </button>
            </div>

            <ClassFilter
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                semesters={MOCK_SEMESTERS}
                selectedSemester={selectedSemester}
                onSemesterChange={handleSemesterChange}
                selectedStatus={selectedStatus}
                onStatusChange={handleStatusChange}
                departments={MOCK_DEPARTMENTS}
                selectedDepartment={selectedDepartment}
                onDepartmentChange={handleDepartmentChange}
                lecturers={MOCK_LECTURERS}
                selectedLecturer={selectedLecturer}
                onLecturerChange={handleLecturerChange}
            />

            <div className="flex-1 relative">
                {isLoading && data !== null && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px] z-10 rounded-xl border border-transparent"></div>
                )}

                <ClassTable
                    data={data}
                    isLoading={isLoading && data === null}
                    onPageChange={handlePageChange}
                    onViewDetail={handleViewDetail}
                    onAssignLecturer={handleAssignLecturer}
                />
            </div>

            <AssignLecturerModal
                isOpen={isAssignModalOpen}
                onClose={handleCloseAssignModal}
                onSuccess={handleAssignSuccess}
                classItem={selectedClassForAssign}
                departments={MOCK_DEPARTMENTS}
            />
        </div>
    );
};
