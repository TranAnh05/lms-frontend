/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { Layers, Plus } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useAuthStore } from "@/store/authStore";
import { classService } from "../services/class.service";
import {
    type ClassResponse,
    type PageResponse,
    type ClassDetailResponse,
} from "../types";
import { ClassFilter } from "../components/ClassFilter";
import { ClassTable } from "../components/ClassTable";
import { AssignLecturerModal } from "../components/AssignLecturerModal";
import { ClassDetailModal } from "../components/ClassDetailModal";

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

export const ClassManagementPage: React.FC = () => {
    const user = useAuthStore((state) => state.user);
    const userId = user?.id;
    const isHeadOfDept = user?.roles.includes("HEAD_OF_DEPT") ?? false;
    const mockDepartmentId = userId === 5 ? 1 : 2;
    const [data, setData] = useState<PageResponse<ClassResponse> | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedSemester, setSelectedSemester] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<string>("");
    const [selectedDepartment, setSelectedDepartment] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(0);
    const pageSize = 10;
    const debouncedSearchTerm = useDebounce(searchTerm, 400);

    const [isAssignModalOpen, setIsAssignModalOpen] = useState<boolean>(false);
    const [selectedClassForAssign, setSelectedClassForAssign] =
        useState<ClassResponse | null>(null);

    const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
    const [selectedClassDetail, setSelectedClassDetail] =
        useState<ClassDetailResponse | null>(null);
    const [isFetchingDetail, setIsFetchingDetail] = useState<boolean>(false);

    const fetchClasses = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = {
                keyword: debouncedSearchTerm.trim() || undefined,
                semesterId: selectedSemester
                    ? Number(selectedSemester)
                    : undefined,
                status: selectedStatus || undefined,
                page: currentPage,
                size: pageSize,
            };

            let response;
            if (isHeadOfDept) {
                response = await classService.getClassesByMyDepartment(
                    params,
                    mockDepartmentId,
                );
            } else {
                response = await classService.getAllClasses({
                    ...params,
                    departmentId: selectedDepartment || undefined,
                });
            }
            setData(response);
        } catch (error) {
            console.error("Lỗi khi tải danh sách lớp học phần:", error);
            toast.error(
                "Không thể tải dữ liệu lớp học phần. Vui lòng thử lại.",
            );
        } finally {
            setIsLoading(false);
        }
    }, [
        debouncedSearchTerm,
        selectedSemester,
        selectedStatus,
        currentPage,
        isHeadOfDept,
        mockDepartmentId,
        selectedDepartment,
    ]);

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

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleViewDetail = async (id: number) => {
        setIsDetailModalOpen(true);
        setIsFetchingDetail(true);
        try {
            const detail = (await classService.getClassById(
                id,
            )) as ClassDetailResponse;
            setSelectedClassDetail(detail);
        } catch (error) {
            toast.error("Không thể tải thông tin chi tiết lớp học.");
            setIsDetailModalOpen(false);
        } finally {
            setIsFetchingDetail(false);
        }
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
                        {isHeadOfDept
                            ? "Xem danh sách lớp học phần, theo dõi sĩ số và giảng viên phụ trách thuộc khoa của bạn."
                            : "Quản lý danh sách lớp, sĩ số, phân công giảng viên và theo dõi tiến độ đào tạo."}
                    </p>
                </div>
            </div>

            <ClassFilter
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                semesters={MOCK_SEMESTERS}
                selectedSemester={selectedSemester}
                onSemesterChange={handleSemesterChange}
                selectedStatus={selectedStatus}
                onStatusChange={handleStatusChange}
                departments={isHeadOfDept ? undefined : MOCK_DEPARTMENTS}
                selectedDepartment={selectedDepartment}
                onDepartmentChange={
                    isHeadOfDept ? undefined : handleDepartmentChange
                }
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
                    isHeadOfDept={isHeadOfDept}
                />
            </div>

            <ClassDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                classDetail={selectedClassDetail}
                isLoading={isFetchingDetail}
            />

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
