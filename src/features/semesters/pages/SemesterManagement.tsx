/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { CalendarDays } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { semesterService } from "../services/semester.service";
import { type SemesterResponse, type PageResponse } from "../types";

import { SemesterFilter } from "../components/SemesterFilter";
import { SemesterListTable } from "../components/SemesterListTable";
import { SemesterFormModal } from "../components/SemesterFormModal";
import { SemesterClosingModal } from "../components/SemesterClosingModal";
const ACADEMIC_YEARS = ["2023-2024", "2024-2025", "2025-2026", "2026-2027"];

export const SemesterManagement: React.FC = () => {
    const [data, setData] = useState<PageResponse<SemesterResponse> | null>(
        null,
    );
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<string>("");
    const [selectedAcademicYear, setSelectedAcademicYear] =
        useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(0);
    const pageSize = 10;
    const debouncedSearchTerm = useDebounce(searchTerm, 400);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
    const [selectedSemesterId, setSelectedSemesterId] = useState<number | null>(
        null,
    );
    const [isClosingModalOpen, setIsClosingModalOpen] =
        useState<boolean>(false);
    const [selectedSemesterForClose, setSelectedSemesterForClose] =
        useState<SemesterResponse | null>(null);

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
        } catch (error) {
            console.error("Lỗi khi tải danh sách học kỳ:", error);
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

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(0);
    };

    const handleStatusChange = (status: string) => {
        setSelectedStatus(status);
        setCurrentPage(0);
    };

    const handleAcademicYearChange = (year: string) => {
        setSelectedAcademicYear(year);
        setCurrentPage(0);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleOpenCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const handleViewDetail = (id: number) => {
        setSelectedSemesterId(id);
        setIsDetailModalOpen(true);
    };

    const handleUpdate = (id: number) => {
        toast.info(
            `Tính năng cập nhật Học kỳ (ID: ${id}) đang được phát triển.`,
        );
    };

    const handleToggleStatus = (semester: SemesterResponse) => {
        if (semester.status === "ACTIVE") {
            setSelectedSemesterForClose(semester);
            setIsClosingModalOpen(true);
        } 
    };

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-gray-50/50">
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

            <SemesterFormModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    setCurrentPage(0);
                    fetchSemesters();
                }}
            />

            <SemesterClosingModal
                isOpen={isClosingModalOpen}
                onClose={() => {
                    setIsClosingModalOpen(false);
                    setSelectedSemesterForClose(null);
                }}
                semester={selectedSemesterForClose}
                onSuccess={() => {
                    fetchSemesters();
                }}
            />
        </div>
    );
};
