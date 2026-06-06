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
    const user = useAuthStore((state) => state.user);
    const isTrainingDept = user?.roles.includes("TRAINING_DEPT") ?? false;
    const isHeadOfDept = user?.roles.includes("HEAD_OF_DEPT") ?? false;

    const [data, setData] = useState<PageResponse<ClassOpeningResponseDto> | null>(null);
    const [semesters, setSemesters] = useState<{ id: number; name: string }[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    
    const debouncedSearchTerm = useDebounce(searchTerm, 400);
    const [selectedRequest, setSelectedRequest] = useState<ClassOpeningResponseDto | null>(null);

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [isCreateClassModalOpen, setIsCreateClassModalOpen] = useState(false);
    const [isCreateRequestModalOpen, setIsCreateRequestModalOpen] = useState(false);

    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                const res = await classRequestService.getSemesters();
                setSemesters(res.map(s => ({ id: s.id, name: `${s.semesterCode} (${s.academicYear})` })));
            } catch {
                toast.error("Không thể tải học kỳ.");
            }
        };
        fetchSemesters();
    }, []);

    const fetchRequests = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await classRequestService.getPendingRequests({
                search: debouncedSearchTerm.trim() || undefined,
                semesterId: selectedSemester ? Number(selectedSemester) : undefined,
                status: (selectedStatus as any) || undefined,
                page: currentPage,
                size: 10,
            });
            setData(res);
        } catch {
            toast.error("Không thể tải danh sách đề xuất.");
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearchTerm, selectedSemester, selectedStatus, currentPage]);

    useEffect(() => { 
        fetchRequests(); 
    }, [fetchRequests]);

    const handleConfirmReject = async (requestId: number, reason: string) => {
        try {
            await classRequestService.rejectRequest(requestId, { rejectReason: reason });
            toast.success("Đã từ chối đề xuất.");
            setIsRejectModalOpen(false);
            await fetchRequests();
        } catch {
            toast.error("Lỗi khi từ chối đề xuất.");
        }
    };

    const handleConfirmApprove = async (requestId: number) => {
        try {
            await classRequestService.approveRequest(requestId);
            toast.success("Phê duyệt thành công. Vui lòng cấu hình lớp học phần.");
            setIsDetailModalOpen(false);
            await fetchRequests();
            setIsCreateClassModalOpen(true);
        } catch {
            toast.error("Lỗi khi phê duyệt đề xuất.");
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-gray-50/50">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <CheckSquare className="w-7 h-7 text-blue-600" />
                    {isHeadOfDept ? "Đề xuất Học phần" : "Duyệt Đề xuất Học phần"}
                </h1>
                {isHeadOfDept && (
                    <button onClick={() => setIsCreateRequestModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Đề xuất lớp
                    </button>
                )}
            </div>

            <RequestFilter
                searchTerm={searchTerm}
                onSearchChange={(v) => { setSearchTerm(v); setCurrentPage(0); }}
                semesters={semesters}
                selectedSemester={selectedSemester}
                onSemesterChange={(v) => { setSelectedSemester(v); setCurrentPage(0); }}
                selectedStatus={selectedStatus}
                onStatusChange={(v) => { setSelectedStatus(v); setCurrentPage(0); }}
            />

            <RequestTable
                data={data}
                isLoading={isLoading}
                onPageChange={setCurrentPage}
                onViewDetail={(req) => { setSelectedRequest(req); setIsDetailModalOpen(true); }}
            />

            <RequestDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                request={selectedRequest}
                onRejectClick={(req) => { setSelectedRequest(req); setIsRejectModalOpen(true); }}
                onCreateClassClick={(req) => { setSelectedRequest(req); handleConfirmApprove(req.requestId); }}
                canApprove={isTrainingDept}
            />

            <RejectRequestModal
                isOpen={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                request={selectedRequest}
                onConfirm={handleConfirmReject}
            />

            <CreateClassFromRequestModal
                isOpen={isCreateClassModalOpen}
                onSuccess={() => {
                    setIsCreateClassModalOpen(false);
                    fetchRequests();
                }}
                request={selectedRequest}
                onConfirm={async (payload) => {
                    if (!selectedRequest) return;
                    await classRequestService.generateClasses(selectedRequest.requestId, payload);
                    toast.success("Khởi tạo các lớp học phần thành công!");
                }}
            />

            <CreateRequestModal
                isOpen={isCreateRequestModalOpen}
                onClose={() => setIsCreateRequestModalOpen(false)}
                onSuccess={() => { setIsCreateRequestModalOpen(false); fetchRequests(); }}
                semesters={semesters}
            />
        </div>
    );
};