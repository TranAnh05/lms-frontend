/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { CheckSquare, Plus } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useAuthStore } from "@/store/authStore";
import { classRequestService } from "../services/classRequest.service";
import { type ClassOpeningResponseDto, type PageResponse } from "../types";

import { RequestFilter } from "../components/RequestFilter";
import { RequestTable } from "../components/RequestTable";
import { RequestDetailModal } from "../components/RequestDetailModal";
import { RejectRequestModal } from "../components/RejectRequestModal";
import { CreateClassFromRequestModal } from "../components/CreateClassFromRequestModal";
import { CreateRequestModal } from "../components/CreateRequestModal";

export const ClassRequestPage: React.FC = () => {
    // Quyền hạn
    const user = useAuthStore((state) => state.user);
    const isTrainingDept = user?.roles.includes("TRAINING_DEPT") ?? false;
    const isHeadOfDept = user?.roles.includes("HEAD_OF_DEPT") ?? false;

    // State Dữ liệu & Bộ lọc
    const [data, setData] = useState<PageResponse<ClassOpeningResponseDto> | null>(null);
    const [semesters, setSemesters] = useState<{ id: number; name: string }[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedSemester, setSelectedSemester] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(0);
    const pageSize = 10;
    
    const debouncedSearchTerm = useDebounce(searchTerm, 400);
    const [selectedRequest, setSelectedRequest] = useState<ClassOpeningResponseDto | null>(null);

    // State Modals
    const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);
    const [isCreateClassModalOpen, setIsCreateClassModalOpen] = useState<boolean>(false);
    const [isCreateRequestModalOpen, setIsCreateRequestModalOpen] = useState<boolean>(false);

    // Lấy danh mục Học kỳ
    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                const response = await classRequestService.getSemesters();
                const formattedSemesters = response.map((sem) => ({
                    id: sem.id,
                    name: `${sem.semesterCode} (${sem.academicYear})`,
                }));
                setSemesters(formattedSemesters);
            } catch (error) {
                console.error("Lỗi khi tải danh sách học kỳ:", error);
                toast.error("Không thể tải dữ liệu học kỳ.");
            }
        };
        fetchSemesters();
    }, []);

    // Lấy danh sách Đề xuất
    const fetchRequests = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await classRequestService.getPendingRequests({
                search: debouncedSearchTerm.trim() || undefined,
                semesterId: selectedSemester ? Number(selectedSemester) : undefined,
                status: (selectedStatus as any) || undefined,
                page: currentPage,
                size: pageSize,
            });
            setData(response);
        } catch (error) {
            console.error("Lỗi khi tải danh sách đề xuất:", error);
            toast.error("Không thể tải danh sách đề xuất. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearchTerm, selectedSemester, selectedStatus, currentPage]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    // Handlers cập nhật bộ lọc
    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(0);
    };

    const handleSemesterChange = (value: string) => {
        setSelectedSemester(value);
        setCurrentPage(0);
    };

    const handleStatusChange = (value: string) => {
        setSelectedStatus(value);
        setCurrentPage(0);
    };

    // Handlers mở Modals
    const handleViewDetail = (request: any) => {
        setSelectedRequest(request);
        setIsDetailModalOpen(true);
    };

    const handleOpenReject = (request: any) => {
        setSelectedRequest(request);
        setIsRejectModalOpen(true);
    };

    const handleOpenCreateClass = (request: any) => {
        setSelectedRequest(request);
        setIsCreateClassModalOpen(true);
    };

    // Tích hợp API Từ chối
    const handleConfirmReject = async (requestId: number, reason: string) => {
        try {
            await classRequestService.reviewRequest(requestId, {
                status: "REJECTED",
                rejectReason: reason,
            });
            toast.success("Đã từ chối đề xuất mở lớp.");
            fetchRequests();
        } catch (error) {
            toast.error("Có lỗi xảy ra khi từ chối đề xuất.");
            throw error;
        }
    };

    // Tích hợp API Duyệt & Tạo lớp
    const handleConfirmCreateClasses = async (requestId: number, reviewData: any) => {
        try {
            await classRequestService.reviewRequest(requestId, {
                status: "APPROVED",
                ...reviewData,
            });
            toast.success("Đã phê duyệt và khởi tạo lớp học phần thành công!");
            fetchRequests();
        } catch (error) {
            toast.error("Có lỗi xảy ra trong quá trình phê duyệt và tạo lớp.");
            throw error;
        }
    };

    const handleCreateRequestSuccess = () => {
        setIsCreateRequestModalOpen(false);
        setCurrentPage(0);
        fetchRequests();
    };

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-gray-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                        <CheckSquare className="w-7 h-7 text-blue-600" />
                        {isHeadOfDept ? "Đề xuất Học phần" : "Duyệt Đề xuất Học phần"}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {isHeadOfDept
                            ? "Quản lý và tạo mới các yêu cầu mở lớp học phần cho khoa của bạn."
                            : "Xem xét, phê duyệt hoặc từ chối các yêu cầu mở lớp học phần từ các Khoa/Bộ môn."}
                    </p>
                </div>

                {isHeadOfDept && (
                    <button
                        onClick={() => setIsCreateRequestModalOpen(true)}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        Đề xuất lớp học phần
                    </button>
                )}
            </div>

            <RequestFilter
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                semesters={semesters}
                selectedSemester={selectedSemester}
                onSemesterChange={handleSemesterChange}
                selectedStatus={selectedStatus}
                onStatusChange={handleStatusChange}
            />

            <div className="flex-1 relative">
                {isLoading && data !== null && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px] z-10 rounded-xl border border-transparent"></div>
                )}

                <RequestTable
                    data={data as any}
                    isLoading={isLoading && data === null}
                    onPageChange={setCurrentPage}
                    onViewDetail={handleViewDetail}
                />
            </div>

            <RequestDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                request={selectedRequest as any}
                onRejectClick={handleOpenReject}
                onCreateClassClick={handleOpenCreateClass}
                canApprove={isTrainingDept}
            />

            {isTrainingDept && (
                <RejectRequestModal
                    isOpen={isRejectModalOpen}
                    onClose={() => setIsRejectModalOpen(false)}
                    request={selectedRequest as any}
                    onConfirm={handleConfirmReject}
                />
            )}

            {isTrainingDept && (
                <CreateClassFromRequestModal
                    isOpen={isCreateClassModalOpen}
                    onClose={() => setIsCreateClassModalOpen(false)}
                    request={selectedRequest as any}
                    onConfirm={handleConfirmCreateClasses}
                />
            )}

            {isHeadOfDept && (
                <CreateRequestModal
                    isOpen={isCreateRequestModalOpen}
                    onClose={() => setIsCreateRequestModalOpen(false)}
                    onSuccess={handleCreateRequestSuccess}
                    semesters={semesters}
                />
            )}
        </div>
    );
};