/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { CheckSquare, Plus } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useAuthStore } from "@/store/authStore";
import { classRequestService } from "../services/classRequest.service";
import { type ClassRequestResponse, type PageResponse } from "../types";
import { RequestFilter } from "../components/RequestFilter";
import { RequestTable } from "../components/RequestTable";
import { RequestDetailModal } from "../components/RequestDetailModal";
import { RejectRequestModal } from "../components/RejectRequestModal";
import { CreateClassFromRequestModal } from "../components/CreateClassFromRequestModal";
import { CreateRequestModal } from "../components/CreateRequestModal";

const MOCK_SEMESTERS = [
    { id: 1, name: "Học kỳ 1 (2025-2026)" },
    { id: 2, name: "Học kỳ 2 (2025-2026)" },
    { id: 3, name: "Học kỳ Hè (2025-2026)" },
];

export const ClassRequestPage: React.FC = () => {
    const user = useAuthStore((state) => state.user);
    const userId = user?.id;
    const isTrainingDept = user?.roles.includes("TRAINING_DEPT") ?? false;
    const isHeadOfDept = user?.roles.includes("HEAD_OF_DEPT") ?? false;

    const [data, setData] = useState<PageResponse<ClassRequestResponse> | null>(
        null,
    );
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedSemester, setSelectedSemester] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(0);
    const pageSize = 10;
    const debouncedSearchTerm = useDebounce(searchTerm, 400);
    const [selectedRequest, setSelectedRequest] =
        useState<ClassRequestResponse | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);
    const [isCreateClassModalOpen, setIsCreateClassModalOpen] =
        useState<boolean>(false);

    const [isCreateRequestModalOpen, setIsCreateRequestModalOpen] =
        useState<boolean>(false);

    const fetchRequests = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await classRequestService.getRequests({
                keyword: debouncedSearchTerm.trim() || undefined,
                semesterId: selectedSemester
                    ? Number(selectedSemester)
                    : undefined,
                status: selectedStatus || undefined,
                page: currentPage,
                size: pageSize,
                mockRequesterId: isHeadOfDept ? userId : undefined,
            });
            setData(response);
        } catch (error) {
            console.error("Lỗi khi tải danh sách đề xuất:", error);
            toast.error("Không thể tải danh sách đề xuất. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    }, [
        debouncedSearchTerm,
        selectedSemester,
        selectedStatus,
        currentPage,
        isHeadOfDept,
        userId,
    ]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

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

    const handleViewDetail = (request: ClassRequestResponse) => {
        setSelectedRequest(request);
        setIsDetailModalOpen(true);
    };

    const handleOpenReject = (request: ClassRequestResponse) => {
        setSelectedRequest(request);
        setIsRejectModalOpen(true);
    };

    const handleOpenCreateClass = (request: ClassRequestResponse) => {
        setSelectedRequest(request);
        setIsCreateClassModalOpen(true);
    };

    const handleConfirmReject = async (requestId: number, reason: string) => {
        try {
            await classRequestService.rejectRequest(requestId, reason);
            toast.success("Đã từ chối đề xuất mở lớp.");
            fetchRequests();
        } catch (error) {
            toast.error("Có lỗi xảy ra khi từ chối đề xuất.");
            throw error;
        }
    };

    const handleConfirmCreateClasses = async (payload: any) => {
        try {
            await classRequestService.approveAndCreateClasses(payload);
            fetchRequests();
        } catch (error) {
            toast.error("Có lỗi xảy ra trong quá trình phê duyệt và tạo lớp.");
            throw error;
        }
    };

    const handleCreateRequestClick = () => {
        setIsCreateRequestModalOpen(true);
    };

    const handleCreateRequestSuccess = () => {
        setIsCreateRequestModalOpen(false);
        fetchRequests();
    };

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-gray-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                        <CheckSquare className="w-7 h-7 text-blue-600" />
                        {isHeadOfDept
                            ? "Đề xuất Học phần"
                            : "Duyệt Đề xuất Học phần"}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {isHeadOfDept
                            ? "Quản lý và tạo mới các yêu cầu mở lớp học phần cho khoa của bạn."
                            : "Xem xét, phê duyệt hoặc từ chối các yêu cầu mở lớp học phần từ các Khoa/Bộ môn."}
                    </p>
                </div>

                {isHeadOfDept && (
                    <button
                        onClick={handleCreateRequestClick}
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
                semesters={MOCK_SEMESTERS}
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
                    data={data}
                    isLoading={isLoading && data === null}
                    onPageChange={setCurrentPage}
                    onViewDetail={handleViewDetail}
                />
            </div>

            <RequestDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                request={selectedRequest}
                onRejectClick={handleOpenReject}
                onCreateClassClick={handleOpenCreateClass}
                canApprove={isTrainingDept}
            />

            {isTrainingDept && (
                <RejectRequestModal
                    isOpen={isRejectModalOpen}
                    onClose={() => setIsRejectModalOpen(false)}
                    request={selectedRequest}
                    onConfirm={handleConfirmReject}
                />
            )}

            {isTrainingDept && (
                <CreateClassFromRequestModal
                    isOpen={isCreateClassModalOpen}
                    onClose={() => setIsCreateClassModalOpen(false)}
                    request={selectedRequest}
                    onConfirm={handleConfirmCreateClasses}
                />
            )}

            {isHeadOfDept && (
                <CreateRequestModal
                    isOpen={isCreateRequestModalOpen}
                    onClose={() => setIsCreateRequestModalOpen(false)}
                    onSuccess={handleCreateRequestSuccess}
                    semesters={MOCK_SEMESTERS}
                />
            )}
        </div>
    );
};
