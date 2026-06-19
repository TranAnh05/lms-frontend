/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback, Suspense, lazy } from "react";
import { toast } from "react-toastify";
import { useDebounce } from "@/hooks/useDebounce";
import { majorService } from "../services/major.service";
import { type Major, type Department } from "../types";
import { MajorFilter } from "../components/MajorFilter";
import { MajorTable } from "../components/MajorTable";
import { useAuthStore } from "@/store/authStore";

// Toi uu: Ap dung Code Splitting cho cac modal
const MajorDetailModal = lazy(() => import("../components/MajorDetailModal").then(m => ({ default: m.MajorDetailModal })));
const MajorFormModal = lazy(() => import("../components/MajorFormModal").then(m => ({ default: m.MajorFormModal })));
const MajorDeleteModal = lazy(() => import("../components/MajorDeleteModal").then(m => ({ default: m.MajorDeleteModal })));

export const MajorPage: React.FC = () => {
    // --- STATE ---
    const [majors, setMajors] = useState<Major[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    // Filter & Pagination States
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    
    // Modals States
    const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
    const [selectedMajorId, setSelectedMajorId] = useState<number | null>(null);
    
    const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
    const [editMajorId, setEditMajorId] = useState<number | null>(null);
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [majorToDelete, setMajorToDelete] = useState<{ id: number; name: string; code: string } | null>(null);

    // --- AUTH & PERMISSIONS ---
    const { user } = useAuthStore();
    const isTrainingDept = user?.roles?.includes("TRAINING_DEPT");
    const hasAddEditPermission = !isTrainingDept;
    
    const debouncedSearchTerm = useDebounce(searchTerm, 400);

    // --- EFFECTS ---
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const data = await majorService.getDepartments(undefined, true);
                setDepartments(data);
            } catch {
                toast.error("Không thể tải danh sách khoa.");
            }
        };
        fetchDepartments();
    }, []);

    const fetchMajors = useCallback(async () => {
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
        } catch {
            toast.error("Không thể tải danh sách ngành học.");
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearchTerm, selectedDeptId, currentPage]);

    useEffect(() => {
        fetchMajors();
    }, [fetchMajors]);

    // Reset page ve 0 neu bo loc thay doi
    useEffect(() => {
        setCurrentPage(0);
    }, [debouncedSearchTerm, selectedDeptId]);


    // --- EVENT HANDLERS (Toi uu bang useCallback) ---
    
    // Handlers cho Filter & Table
    const handleSearchChange = useCallback((val: string) => setSearchTerm(val), []);
    const handleDeptChange = useCallback((id: number | null) => setSelectedDeptId(id), []);
    const handlePageChange = useCallback((newPage: number) => setCurrentPage(newPage), []);

    // Handlers cho Form (Them/Sua)
    const handleAddClick = useCallback(() => {
        if (!hasAddEditPermission) return;
        setEditMajorId(null);
        setIsFormModalOpen(true);
    }, [hasAddEditPermission]);

    const handleEdit = useCallback((id: number) => {
        if (!hasAddEditPermission) return;
        setEditMajorId(id);
        setIsFormModalOpen(true);
    }, [hasAddEditPermission]);

    const handleCloseFormModal = useCallback(() => {
        setIsFormModalOpen(false);
        setEditMajorId(null);
    }, []);

    const handleFormSuccess = useCallback(() => {
        if (currentPage === 0) {
            fetchMajors();
        } else {
            setCurrentPage(0);
        }
    }, [currentPage, fetchMajors]);

    // Handlers cho View Modal
    const handleView = useCallback((id: number) => {
        setSelectedMajorId(id);
        setIsViewModalOpen(true);
    }, []);

    const handleCloseViewModal = useCallback(() => {
        setIsViewModalOpen(false);
        setSelectedMajorId(null);
    }, []);

    // Handlers cho Delete Modal
    const handleDelete = useCallback((id: number) => {
        if (!hasAddEditPermission) return;
        // Chi su dung functional update neu can, o day majors da co trong the hien nen phai them vao dependency array
        const targetMajor = majors.find((m) => m.id === id);
        if (targetMajor) {
            setMajorToDelete({ id: targetMajor.id, name: targetMajor.name, code: targetMajor.code });
            setIsDeleteModalOpen(true);
        }
    }, [hasAddEditPermission, majors]);

    const handleCloseDeleteModal = useCallback(() => {
        setIsDeleteModalOpen(false);
        setMajorToDelete(null);
    }, []);

    const handleDeleteSuccess = useCallback(() => {
        fetchMajors();
    }, [fetchMajors]);

    return (
        <div className="flex flex-col h-full space-y-6">
            {/* --- HEADER --- */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Quản lý Ngành học
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Quản lý danh sách các ngành đào tạo, tín chỉ và trạng thái
                    hoạt động.
                </p>
            </div>

            {/* --- FILTER --- */}
            <MajorFilter
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                departments={departments}
                selectedDeptId={selectedDeptId}
                onDeptChange={handleDeptChange}
                onAddClick={hasAddEditPermission ? handleAddClick : undefined}
                canCreate={hasAddEditPermission}
            />

            {/* --- TABLE & LOADING --- */}
            <div className="flex-1 relative">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10 rounded-xl border border-gray-100">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm font-medium text-blue-600 animate-pulse">
                                Đang tải dữ liệu...
                            </span>
                        </div>
                    </div>
                )}

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

            {/* --- MODALS (Suspense bao boc) --- */}
            <Suspense fallback={null}>
                {isViewModalOpen && (
                    <MajorDetailModal
                        isOpen={isViewModalOpen}
                        onClose={handleCloseViewModal}
                        majorId={selectedMajorId}
                    />
                )}

                {isFormModalOpen && (
                    <MajorFormModal
                        isOpen={isFormModalOpen}
                        onClose={handleCloseFormModal}
                        onSuccess={handleFormSuccess}
                        departments={departments}
                        editId={editMajorId}
                    />
                )}

                {isDeleteModalOpen && (
                    <MajorDeleteModal
                        isOpen={isDeleteModalOpen}
                        onClose={handleCloseDeleteModal}
                        onSuccess={handleDeleteSuccess}
                        majorInfo={majorToDelete}
                    />
                )}
            </Suspense>
        </div>
    );
};