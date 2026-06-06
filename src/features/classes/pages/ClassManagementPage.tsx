/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { Layers } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useAuthStore } from "@/store/authStore";
import { classService } from "../services/class.service";
import {
    type ClassDetailResponse,
    type PageResponse,
    type DepartmentBasic,
    type SemesterBasic,
} from "../types";
import { ClassFilter } from "../components/ClassFilter";
import { ClassTable } from "../components/ClassTable";
import { AssignLecturerModal } from "../components/AssignLecturerModal";
import { ClassDetailModal } from "../components/ClassDetailModal";

const MOCK_SEMESTERS = [
    { id: 1, name: "Học kỳ 1 (2025-2026)" },
    { id: 2, name: "Học kỳ 2 (2025-2026)" },
    { id: 3, name: "Học kỳ Hè (2025-2026)" },
];

export const ClassManagementPage: React.FC = () => {
    const user = useAuthStore((state) => state.user);
    const userId = user?.id;
    const isHeadOfDept = user?.roles.includes("HEAD_OF_DEPT") ?? false;
    const mockDepartmentId = userId === 5 ? 1 : 2;

    const [data, setData] = useState<PageResponse<ClassDetailResponse> | null>(null);
    const [departments, setDepartments] = useState<DepartmentBasic[]>([]);
    const [semesters, setSemesters] = useState<SemesterBasic[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 10;
    const debouncedSearchTerm = useDebounce(searchTerm, 400);

    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedClassForAssign, setSelectedClassForAssign] = useState<ClassDetailResponse | null>(null);

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedClassDetail, setSelectedClassDetail] = useState<ClassDetailResponse | null>(null);
    const [isFetchingDetail, setIsFetchingDetail] = useState(false);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await classService.getDepartments();
                setDepartments(res);
            } catch {
                toast.error("Không thể tải danh sách Khoa.");
            }
        };
        if (!isHeadOfDept) fetchDepartments();
    }, [isHeadOfDept]);

    useEffect(() => {
        const fetchSemesters = async () => {
        try {
            const res = await classService.getSemesters();
            setSemesters(res);
        } catch {
            toast.error("Không thể tải danh sách học kỳ.");
        }
    };
    fetchSemesters();
    }, [])

    const fetchClasses = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = {
                keyword: debouncedSearchTerm.trim() || undefined,
                semesterId: selectedSemester ? Number(selectedSemester) : undefined,
                status: selectedStatus || undefined,
                departmentId: isHeadOfDept 
                    ? mockDepartmentId 
                    : (selectedDepartment ? Number(selectedDepartment) : undefined),
                page: currentPage,
                size: pageSize,
            };

            const response = await classService.getClasses(params);
            setData(response);
        } catch {
            toast.error("Không thể tải danh sách lớp học.");
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearchTerm, selectedSemester, selectedStatus, selectedDepartment, currentPage, isHeadOfDept, mockDepartmentId]);

    useEffect(() => {
        fetchClasses();
    }, [fetchClasses]);

    const handleViewDetail = async (id: number) => {
        setIsDetailModalOpen(true);
        setIsFetchingDetail(true);
        try {
            const detail = await classService.getClassById(id);
            setSelectedClassDetail(detail);
        } catch {
            toast.error("Không thể tải thông tin chi tiết.");
            setIsDetailModalOpen(false);
        } finally {
            setIsFetchingDetail(false);
        }
    };

    const handleAssignLecturer = (id: number) => {
        const classItem = data?.content.find((item) => item.id === id);
        if (classItem) {
            setSelectedClassForAssign(classItem);
            setIsAssignModalOpen(true);
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-gray-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Layers className="w-7 h-7 text-blue-600" /> Quản lý Lớp học phần
                    </h1>
                </div>
            </div>

            <ClassFilter
                searchTerm={searchTerm}
                onSearchChange={(v) => { setSearchTerm(v); setCurrentPage(0); }}
                semesters={semesters}
                selectedSemester={selectedSemester}
                onSemesterChange={(v) => { setSelectedSemester(v); setCurrentPage(0); }}
                selectedStatus={selectedStatus}
                onStatusChange={(v) => { setSelectedStatus(v); setCurrentPage(0); }}
                departments={isHeadOfDept ? undefined : departments}
                selectedDepartment={selectedDepartment}
                onDepartmentChange={isHeadOfDept ? undefined : (v) => { setSelectedDepartment(v); setCurrentPage(0); }}
            />

            <div className="flex-1 relative">
                <ClassTable
                    data={data}
                    isLoading={isLoading && data === null}
                    onPageChange={setCurrentPage}
                    onViewDetail={handleViewDetail}
                    onAssignLecturer={handleAssignLecturer}
                    isHead={isHeadOfDept}
                />
            </div>

            <ClassDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                classDetail={selectedClassDetail}
                isLoading={isFetchingDetail}
            />

            <AssignLecturerModal
                isOpen={isAssignModalOpen}
                onClose={() => {
                    setIsAssignModalOpen(false);
                    setSelectedClassForAssign(null);
                }}
                onSuccess={() => {
                    setIsAssignModalOpen(false);
                    setSelectedClassForAssign(null);
                    fetchClasses();
                }}
                classItem={selectedClassForAssign}
            />
        </div>
    );
};