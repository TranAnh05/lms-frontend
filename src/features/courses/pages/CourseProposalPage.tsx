/* eslint-disable react-hooks/set-state-in-effect */
import React, { useCallback, useEffect, useState } from "react";
import { AlertTriangle, FileEdit, X } from "lucide-react";
import { toast } from "react-toastify";

import { useAuthStore } from "@/store/authStore";

import { CourseProposalFilter } from "../components/CourseProposalFilter";
import { CourseProposalFormModal } from "../components/CourseProposalFormModal";
import { CourseProposalTable } from "../components/CourseProposalTable";
import { SuggestCourseDetailModal } from "../components/SuggestCourseDetailModal";
import { courseService } from "../services/course.service";
import { type Course } from "../types";

const PAGE_SIZE = 10;

type ProposalStatus = "PENDING" | "APPROVED" | "REJECTED" | "";

export const CourseProposalPage: React.FC = () => {
    const { user } = useAuthStore();

    const roles = user?.roles ?? [];

    const isTrainingDept = roles.includes("TRAINING_DEPT");

    const isPrincipal = roles.includes("PRINCIPAL");

    const [courses, setCourses] = useState<Course[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    const [statusFilter, setStatusFilter] = useState<ProposalStatus>("");

    const [currentPage, setCurrentPage] = useState(0);

    const [totalPages, setTotalPages] = useState(0);

    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(
        null,
    );

    const [rejectReason, setRejectReason] = useState<string | null>(null);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const fetchProposals = useCallback(async () => {
        setIsLoading(true);

        try {
            const response = await courseService.getCourseProposals({
                status: statusFilter,
                page: currentPage,
                size: PAGE_SIZE,
                sortBy: "createdAt",
                sortDirection: "desc",
            });

            setCourses(response.content);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error("Lỗi khi tải danh sách đề xuất:", error);

            toast.error("Không thể tải danh sách đề xuất. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    }, [statusFilter, currentPage]);

    useEffect(() => {
        fetchProposals();
    }, [fetchProposals]);

    const handleStatusChange = useCallback((status: string) => {
        setStatusFilter(status as ProposalStatus);
        setCurrentPage(0);
    }, []);

    const handleAddProposalClick = useCallback(() => {
        setIsCreateModalOpen(true);
    }, []);

    const handleCloseCreateModal = useCallback(() => {
        setIsCreateModalOpen(false);
    }, []);

    const handleViewDetail = useCallback((id: number) => {
        setSelectedCourseId(id);
        setIsViewModalOpen(true);
    }, []);

    const handleCloseDetailModal = useCallback(() => {
        setIsViewModalOpen(false);
        setSelectedCourseId(null);
    }, []);

    const handleViewRejectReason = useCallback((reason: string) => {
        setRejectReason(reason);
    }, []);

    const handleCloseRejectModal = useCallback(() => {
        setRejectReason(null);
    }, []);

    const handleProposalSuccess = useCallback(() => {
        fetchProposals();
    }, [fetchProposals]);

    const handleCreateSuccess = useCallback(() => {
        setCurrentPage(0);
        fetchProposals();
    }, [fetchProposals]);

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-gray-50/50">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-gray-900">
                        <FileEdit className="w-7 h-7 text-blue-600" />
                        Đề xuất môn học
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Tạo mới và theo dõi tiến trình phê duyệt các môn học do
                        Phòng đào tạo đề xuất.
                    </p>
                </div>
            </div>

            <CourseProposalFilter
                selectedStatus={statusFilter}
                onStatusChange={handleStatusChange}
                onAddClick={isTrainingDept ? handleAddProposalClick : undefined}
            />

            <div className="relative flex-1">
                {isLoading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center border border-gray-100 rounded-xl bg-white/60 backdrop-blur-[1px]">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin shadow-sm" />

                            <span className="px-3 py-1 text-sm font-medium text-blue-700 rounded-full shadow-sm animate-pulse bg-white/80">
                                Đang tải danh sách đề xuất...
                            </span>
                        </div>
                    </div>
                )}

                <CourseProposalTable
                    courses={courses}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    onViewDetail={handleViewDetail}
                    onViewRejectReason={handleViewRejectReason}
                />
            </div>

            <SuggestCourseDetailModal
                isOpen={isViewModalOpen}
                onClose={handleCloseDetailModal}
                courseId={selectedCourseId}
                canApprove={isPrincipal}
                onSuccess={handleProposalSuccess}
            />

            {rejectReason !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative w-full max-w-md overflow-hidden bg-white shadow-2xl rounded-2xl animate-in zoom-in-95 duration-200">
                        <div className="w-full h-1.5 bg-red-500" />

                        <div className="p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-2 text-red-600">
                                    <AlertTriangle className="w-6 h-6" />

                                    <h3 className="text-lg font-bold text-gray-900">
                                        Lý do từ chối
                                    </h3>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleCloseRejectModal}
                                    className="p-1 text-gray-400 transition-colors rounded-md hover:text-gray-600 hover:bg-gray-100"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-4 text-sm leading-relaxed text-red-800 border border-red-100 rounded-xl bg-red-50">
                                {rejectReason}
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={handleCloseRejectModal}
                                    className="px-4 py-2 font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-4 focus:ring-gray-100"
                                >
                                    Đã hiểu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <CourseProposalFormModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
                onSuccess={handleCreateSuccess}
            />
        </div>
    );
};
