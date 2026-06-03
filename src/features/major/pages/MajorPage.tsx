/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useDebounce } from "@/hooks/useDebounce";
import { majorService } from "../services/major.service";
import { type Major, type Department } from "../types";
import { MajorFilter } from "../components/MajorFilter";
import { MajorTable } from "../components/MajorTable";
import { MajorDetailModal } from "../components/MajorDetailModal";
import { useAuthStore } from "@/store/authStore";

export const MajorPage: React.FC = () => {
    const [majors, setMajors] = useState<Major[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
    const [selectedMajorId, setSelectedMajorId] = useState<number | null>(null);
    const { user } = useAuthStore();

    const isTrainingDept = user?.roles?.includes("TRAINING_DEPT");
    const hasAddEditPermission = !isTrainingDept;
    const debouncedSearchTerm = useDebounce(searchTerm, 400);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const data = await majorService.getDepartments(undefined, true);
                setDepartments(data);
            } catch (error) {
                toast.error("Không thể tải danh sách khoa.");
            }
        };
        fetchDepartments();
    }, []);

    useEffect(() => {
        setCurrentPage(0);
    }, [debouncedSearchTerm, selectedDeptId]);

    useEffect(() => {
        const fetchMajors = async () => {
            setIsLoading(true);
            try {
                const response = await majorService.getMajors({
                    keyword: debouncedSearchTerm,
                    departmentId: selectedDeptId,
                    page: currentPage,
                    size: 10,
                    sortBy: "createdAt",
                    sortDirection: "desc",
                });

                setMajors(response.content);
                setTotalPages(response.totalPages);
            } catch (error) {
                toast.error("Không thể tải danh sách ngành học.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMajors();
    }, [debouncedSearchTerm, selectedDeptId, currentPage]);

    const handlePageChange = useCallback((newPage: number) => {
        setCurrentPage(newPage);
    }, []);

    const handleAddClick = useCallback(() => {
        if (!hasAddEditPermission) return;
        toast.info("Chức năng thêm mới đang được phát triển.");
    }, [hasAddEditPermission]);

    const handleView = useCallback((id: number) => {
        setSelectedMajorId(id);
        setIsViewModalOpen(true);
    }, []);

    const handleCloseViewModal = useCallback(() => {
        setIsViewModalOpen(false);
        setSelectedMajorId(null);
    }, []);

    const handleEdit = useCallback(
        (id: number) => {
            if (!hasAddEditPermission) return;
            toast.info(`Đang chỉnh sửa ngành học có ID: ${id}`);
        },
        [hasAddEditPermission],
    );

    const handleDelete = useCallback(
        (id: number) => {
            if (!hasAddEditPermission) return;
            if (
                window.confirm("Bạn có chắc chắn muốn xóa ngành học này không?")
            ) {
                toast.success(`Đã gửi yêu cầu xóa ngành học ID: ${id}`);
            }
        },
        [hasAddEditPermission],
    );

    return (
        <div className="flex flex-col h-full space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Quản lý Ngành học
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Quản lý danh sách các ngành đào tạo, tín chỉ và trạng thái
                    hoạt động.
                </p>
            </div>

            <MajorFilter
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                departments={departments}
                selectedDeptId={selectedDeptId}
                onDeptChange={setSelectedDeptId}
                onAddClick={hasAddEditPermission ? handleAddClick : undefined}
                canCreate={hasAddEditPermission}
            />

            <div className="flex-1 relative">
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10 rounded-xl border border-gray-100">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm font-medium text-blue-600 animate-pulse">
                                Đang tải dữ liệu...
                            </span>
                        </div>
                    </div>
                ) : null}

                <MajorTable
                    majors={majors}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    canEdit={hasAddEditPermission}
                    canDelete={hasAddEditPermission}
                />
            </div>

            <MajorDetailModal
                isOpen={isViewModalOpen}
                onClose={handleCloseViewModal}
                majorId={selectedMajorId}
            />
        </div>
    );
};
