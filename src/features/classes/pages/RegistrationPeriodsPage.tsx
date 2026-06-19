/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback, Suspense, lazy } from "react";
import { toast } from "react-toastify";
import { CalendarDays, Plus, Search, Filter } from "lucide-react";

import { useDebounce } from "@/hooks/useDebounce";
import { useAuthStore } from "@/store/authStore";
import { type PageResponse } from "../types";
import { 
    type RegistrationPeriodResponse, 
    type SemesterResponse, 
    type DepartmentResponse 
} from "../types/registration.types";
import { registrationService } from "../services/registration.service";

import { RegistrationTable } from "../components/registration/RegistrationTable";

// Toi uu: Code Splitting - Chi tai code cua Modals khi nguoi dung thuc su can mo chung
const RegistrationWizardModal = lazy(() => import("../components/registration/RegistrationWizardModal").then(m => ({ default: m.RegistrationWizardModal })));
const RegistrationDetailModal = lazy(() => import("../components/registration/RegistrationDetailModal").then(m => ({ default: m.RegistrationDetailModal })));

// Toi uu: Dua chuoi SVG vao hang so de tai su dung, giam kich thuoc code JSX
const SELECT_ARROW_SVG = `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`;

export const RegistrationPeriodsPage: React.FC = () => {
    const user = useAuthStore((state) => state.user);
    const isTrainingDept = user?.roles.includes("TRAINING_DEPT") ?? false;
    
    // --- STATE ---
    const [data, setData] = useState<PageResponse<RegistrationPeriodResponse> | null>(null);
    const [semesters, setSemesters] = useState<SemesterResponse[]>([]);
    const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    // Filter & Pagination States
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedSemester, setSelectedSemester] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(0);
    const pageSize = 10;
    
    const debouncedSearchTerm = useDebounce(searchTerm, 400);
    
    // Modal States
    const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
    const [detailPeriodId, setDetailPeriodId] = useState<number | null>(null);

    // --- EFFECTS ---
    useEffect(() => {
        const abortController = new AbortController();

        const fetchFilters = async () => {
            try {
                const [sems, depts] = await Promise.all([
                    registrationService.getSemesters(),
                    registrationService.getDepartments()
                ]);
                if (!abortController.signal.aborted) {
                    setSemesters(sems);
                    setDepartments(depts);
                }
            } catch {
                if (!abortController.signal.aborted) {
                    toast.error("Không thể tải dữ liệu học kỳ và khoa.");
                }
            }
        };

        fetchFilters();

        return () => abortController.abort();
    }, []);

    const fetchRegistrationPeriods = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await registrationService.getRegistrationPeriods({
                keyword: debouncedSearchTerm.trim() || undefined,
                semesterId: selectedSemester || undefined,
                status: selectedStatus || undefined,
                page: currentPage,
                size: pageSize,
            });
            setData(response);
        } catch {
            toast.error("Không thể tải danh sách đợt đăng ký.");
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearchTerm, selectedSemester, selectedStatus, currentPage]);

    useEffect(() => {
        fetchRegistrationPeriods();
    }, [fetchRegistrationPeriods]);

    // --- EVENT HANDLERS (Toi uu: Boc useCallback de giu tham chieu on dinh) ---
    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(0);
    }, []);

    const handleSemesterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSemester(e.target.value);
        setCurrentPage(0);
    }, []);

    const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(e.target.value);
        setCurrentPage(0);
    }, []);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handleActionSuccess = useCallback(() => {
        setCurrentPage(0);
        fetchRegistrationPeriods();
    }, [fetchRegistrationPeriods]);

    const handleOpenWizard = useCallback(() => setIsWizardOpen(true), []);
    const handleCloseWizard = useCallback(() => setIsWizardOpen(false), []);
    const handleCloseDetail = useCallback(() => setDetailPeriodId(null), []);

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-gray-50/50">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <CalendarDays className="w-7 h-7 text-blue-600" /> Quản lý Đợt đăng ký
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Cấu hình và quản lý các đợt mở đăng ký học phần cho sinh viên toàn trường.
                    </p>
                </div>

                {isTrainingDept && (
                    <button
                        onClick={handleOpenWizard}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        Tạo đợt đăng ký mới
                    </button>
                )}
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col md:flex-row items-center gap-4">
                <div className="relative w-full md:flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên đợt đăng ký..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="bg-gray-50/50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block w-full pl-10 p-2.5 outline-none transition-all placeholder:text-gray-400"
                    />
                </div>
                <div className="flex w-full md:w-auto gap-3 shrink-0">
                    <div className="relative w-full md:w-48">
                        <select
                            value={selectedSemester}
                            onChange={handleSemesterChange}
                            className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block w-full px-3 py-2.5 outline-none cursor-pointer appearance-none"
                            style={{
                                backgroundImage: SELECT_ARROW_SVG,
                                backgroundPosition: "right 0.75rem center",
                                backgroundSize: "1rem",
                                backgroundRepeat: "no-repeat",
                            }}
                        >
                            <option value="">Tất cả Học kỳ</option>
                            {semesters.map((sem) => (
                                <option key={sem.id} value={sem.id}>
                                    {sem.semesterCode} ({sem.academicYear})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="relative w-full md:w-40">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Filter className="w-4 h-4 text-gray-400" />
                        </div>
                        <select
                            value={selectedStatus}
                            onChange={handleStatusChange}
                            className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block w-full pl-9 pr-3 py-2.5 outline-none cursor-pointer appearance-none"
                            style={{
                                backgroundImage: SELECT_ARROW_SVG,
                                backgroundPosition: "right 0.75rem center",
                                backgroundSize: "1rem",
                                backgroundRepeat: "no-repeat",
                            }}
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="PENDING">Sắp diễn ra</option>
                            <option value="ACTIVE">Đang mở</option>
                            <option value="CLOSED">Đã đóng</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <RegistrationTable
                data={data}
                isLoading={isLoading}
                onPageChange={handlePageChange}
                onViewDetail={setDetailPeriodId}
            />

            {/* Modals */}
            <Suspense fallback={null}>
                {isWizardOpen && (
                    <RegistrationWizardModal
                        isOpen={isWizardOpen}
                        onClose={handleCloseWizard}
                        onSuccess={handleActionSuccess}
                        semesters={semesters}
                        departments={departments}
                    />
                )}

                {!!detailPeriodId && (
                    <RegistrationDetailModal
                        isOpen={!!detailPeriodId}
                        onClose={handleCloseDetail}
                        periodId={detailPeriodId}
                        onSuccess={handleActionSuccess}
                    />
                )}
            </Suspense>
        </div>
    );
};