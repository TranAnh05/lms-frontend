/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback, Suspense, lazy } from "react";
import { toast } from "react-toastify";
import { CalendarDays } from "lucide-react";

import { useDebounce } from "@/hooks/useDebounce";
import { semesterService } from "../services/semester.service";
import { type SemesterResponse, type PageResponse } from "../types";

import { SemesterFilter } from "../components/SemesterFilter";
import { SemesterListTable } from "../components/SemesterListTable";

// Toi uu: Ap dung Code Splitting de chia nho bundle, chi tai code Modal khi thuc su mo
const SemesterFormModal = lazy(() =>
    import("../components/SemesterFormModal").then((m) => ({
        default: m.SemesterFormModal,
    })),
);
const SemesterClosingModal = lazy(() =>
    import("../components/SemesterClosingModal").then((m) => ({
        default: m.SemesterClosingModal,
    })),
);
const SemesterUpdateModal = lazy(() =>
    import("../components/SemesterUpdateModal").then((m) => ({
        default: m.SemesterUpdateModal,
    })),
);
const SemesterDetailModal = lazy(() =>
    import("../components/SemesterDetailModal").then((m) => ({
        default: m.SemesterDetailModal,
    })),
);

const ACADEMIC_YEARS = ["2023-2024", "2024-2025", "2025-2026", "2026-2027"];

export const SemesterManagement: React.FC = () => {
    // --- STATE ---
    const [data, setData] = useState<PageResponse<SemesterResponse> | null>(
        null,
    );
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Filter & Pagination States
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<string>("");
    const [selectedAcademicYear, setSelectedAcademicYear] =
        useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(0);
    const pageSize = 10;

    const debouncedSearchTerm = useDebounce(searchTerm, 400);

    // Modal States
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
    const [isClosingModalOpen, setIsClosingModalOpen] =
        useState<boolean>(false);

    const [selectedSemesterId, setSelectedSemesterId] = useState<number | null>(
        null,
    );
    const [selectedSemesterForClose, setSelectedSemesterForClose] =
        useState<SemesterResponse | null>(null);

    // --- EFFECTS ---
    const fetchSemesters = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await semesterService.getSemesters({
                keyword: debouncedSearchTerm.trim() || undefined,
                status: selectedStatus || undefined,
                academicYear: selectedAcademicYear || undefined,
                page: currentPage,
                size: pageSize,
                sortBy: "createdAt",
                sortDirection: "desc",
            });
            setData(response);
        } catch {
            toast.error(
                "Không thể tải dữ liệu học kỳ. Vui lòng kiểm tra lại kết nối.",
            );
        } finally {
            setIsLoading(false);
        }
    }, [
        debouncedSearchTerm,
        selectedStatus,
        selectedAcademicYear,
        currentPage,
    ]);

    useEffect(() => {
        fetchSemesters();
    }, [fetchSemesters]);

    // Toi uu: Gom chung logic reset trang khi bo loc thay doi de chong Double-fetch
    useEffect(() => {
        setCurrentPage(0);
    }, [debouncedSearchTerm, selectedStatus, selectedAcademicYear]);

    // --- EVENT HANDLERS (Boc useCallback de giu tham chieu on dinh) ---

    // Filter Handlers
    const handleSearchChange = useCallback(
        (value: string) => setSearchTerm(value),
        [],
    );
    const handleStatusChange = useCallback(
        (status: string) => setSelectedStatus(status),
        [],
    );
    const handleAcademicYearChange = useCallback(
        (year: string) => setSelectedAcademicYear(year),
        [],
    );
    const handlePageChange = useCallback(
        (page: number) => setCurrentPage(page),
        [],
    );

    // Create Handlers
    const handleOpenCreateModal = useCallback(
        () => setIsCreateModalOpen(true),
        [],
    );
    const handleCloseCreateModal = useCallback(
        () => setIsCreateModalOpen(false),
        [],
    );

    // Detail Handlers
    const handleViewDetail = useCallback((id: number) => {
        setSelectedSemesterId(id);
        setIsDetailModalOpen(true);
    }, []);
    const handleCloseDetailModal = useCallback(() => {
        setIsDetailModalOpen(false);
        setSelectedSemesterId(null);
    }, []);

    // Update Handlers
    const handleUpdate = useCallback((id: number) => {
        setSelectedSemesterId(id);
        setIsUpdateModalOpen(true);
    }, []);
    const handleCloseUpdateModal = useCallback(() => {
        setIsUpdateModalOpen(false);
        setSelectedSemesterId(null);
    }, []);

    // Close Semester Handlers
    const handleToggleStatus = useCallback((semester: SemesterResponse) => {
        if (semester.status === "ACTIVE") {
            setSelectedSemesterForClose(semester);
            setIsClosingModalOpen(true);
        }
    }, []);
    const handleCloseClosingModal = useCallback(() => {
        setIsClosingModalOpen(false);
        setSelectedSemesterForClose(null);
    }, []);

    // Common Success Handler
    const handleActionSuccess = useCallback(() => {
        if (currentPage === 0) {
            fetchSemesters();
        } else {
            setCurrentPage(0); // View tu dong cap nhat thong qua useEffect
        }
    }, [currentPage, fetchSemesters]);

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-gray-50/50">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                    <CalendarDays className="w-7 h-7 text-blue-600" />
                    Quản lý Học kỳ
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Thiết lập danh sách học kỳ, cấu hình thời gian bắt đầu/kết
                    thúc cho từng năm học trên toàn hệ thống.
                </p>
            </div>

            {/* Filter */}
            <SemesterFilter
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                selectedStatus={selectedStatus}
                onStatusChange={handleStatusChange}
                academicYears={ACADEMIC_YEARS}
                selectedAcademicYear={selectedAcademicYear}
                onAcademicYearChange={handleAcademicYearChange}
                onAddClick={handleOpenCreateModal}
            />

            {/* Table & Loading Overlay */}
            <div className="flex-1 relative">
                {isLoading && data !== null && (
                    <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-[1px] rounded-xl border border-transparent"></div>
                )}

                <SemesterListTable
                    data={data}
                    isLoading={isLoading && data === null}
                    onPageChange={handlePageChange}
                    onViewDetail={handleViewDetail}
                    onUpdate={handleUpdate}
                    onToggleStatus={handleToggleStatus}
                />
            </div>

            {/* Modals (Boc Suspense de Lazy Load hieu qua) */}
            <Suspense fallback={null}>
                {isCreateModalOpen && (
                    <SemesterFormModal
                        isOpen={isCreateModalOpen}
                        onClose={handleCloseCreateModal}
                        onSuccess={handleActionSuccess}
                    />
                )}

                {isClosingModalOpen && (
                    <SemesterClosingModal
                        isOpen={isClosingModalOpen}
                        onClose={handleCloseClosingModal}
                        semester={selectedSemesterForClose}
                        onSuccess={handleActionSuccess}
                    />
                )}

                {isUpdateModalOpen && (
                    <SemesterUpdateModal
                        isOpen={isUpdateModalOpen}
                        onClose={handleCloseUpdateModal}
                        semesterId={selectedSemesterId}
                        onSuccess={handleActionSuccess}
                    />
                )}

                {isDetailModalOpen && (
                    <SemesterDetailModal
                        isOpen={isDetailModalOpen}
                        onClose={handleCloseDetailModal}
                        semesterId={selectedSemesterId}
                    />
                )}
            </Suspense>
        </div>
    );
};
