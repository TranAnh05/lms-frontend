/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { FileEdit, AlertTriangle, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { courseService } from "../services/course.service";
import { type Course } from "../types";
import { CourseProposalFilter } from "../components/CourseProposalFilter";
import { CourseProposalTable } from "../components/CourseProposalTable";
import { SuggestCourseDetailModal } from "../components/SuggestCourseDetailModal";
import { CourseProposalFormModal } from "../components/CourseProposalFormModal";

export const CourseProposalPage: React.FC = () => {
    const { user } = useAuthStore();
    const isTrainingDept = user?.roles?.includes("TRAINING_DEPT");
    const isPrincipal = user?.roles?.includes("PRINCIPAL");
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const pageSize = 10;
    const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(
        null,
    );
    const [rejectReason, setRejectReason] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

    const fetchProposals = useCallback(async () => {
        setIsLoading(true);
        try {
            const currentStatus = statusFilter as
                | "PENDING"
                | "APPROVED"
                | "REJECTED"
                | "";

            const response = await courseService.getCourseProposals({
                status: currentStatus,
                page: currentPage,
                size: pageSize,
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

    const handleStatusChange = (status: string) => {
        setStatusFilter(status);
        setCurrentPage(0);
    };

    const handleAddProposalClick = useCallback(() => {
        setIsCreateModalOpen(true);
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

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-gray-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                        <FileEdit className="w-7 h-7 text-blue-600" /> Đề xuất
                        Môn học
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
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

            <div className="flex-1 relative">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px] z-10 rounded-xl border border-gray-100">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin shadow-sm"></div>
                            <span className="text-sm font-medium text-blue-700 animate-pulse bg-white/80 px-3 py-1 rounded-full shadow-sm">
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
                canApprove={!!isPrincipal}
            />

            {rejectReason !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="h-1.5 w-full bg-red-500"></div>
                        <div className="p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-2 text-red-600">
                                    <AlertTriangle className="w-6 h-6" />
                                    <h3 className="text-lg font-bold text-gray-900">
                                        Lý do từ chối
                                    </h3>
                                </div>
                                <button
                                    onClick={handleCloseRejectModal}
                                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="bg-red-50 text-red-800 p-4 rounded-xl text-sm leading-relaxed border border-red-100">
                                {rejectReason}
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={handleCloseRejectModal}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors focus:ring-4 focus:ring-gray-100"
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
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    setCurrentPage(0);
                    fetchProposals();
                }}
            />
        </div>
    );
};
