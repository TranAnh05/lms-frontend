/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { Layers } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useAuthStore } from "@/store/authStore";
import { classService } from "../services/class.service";
import {
    type ClassDetailResponse,
    type ClassDetailForStudentResponse,
    type PageResponse,
    type DepartmentBasic,
    type SemesterBasic,
} from "../types";
import { ClassFilter } from "../components/ClassFilter";
import { ClassTable } from "../components/ClassTable";
import { AssignLecturerModal } from "../components/AssignLecturerModal";
import { ClassDetailModal } from "../components/ClassDetailModal";

export const ClassManagementPage: React.FC = () => {
    const user = useAuthStore((state) => state.user);
    const userId = user?.id;
    const isHeadOfDept = user?.roles.includes("HEAD_OF_DEPT") ?? false;
    const mockDepartmentId = userId === 5 ? 1 : 2;

    const [data, setData] = useState<PageResponse<ClassDetailResponse> | null>(
        null,
    );
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
    const [selectedClassForAssign, setSelectedClassForAssign] =
        useState<ClassDetailResponse | null>(null);

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedClassDetail, setSelectedClassDetail] =
        useState<ClassDetailForStudentResponse | null>(null);
    const [isFetchingDetail, setIsFetchingDetail] = useState(false);

    // Lưu trữ ID của request phục vụ khử Race Condition và Memory Leak
    const fetchIdRef = useRef<number>(0);
    const isMountedRef = useRef<boolean>(true);

    // Theo dõi vòng đời component unmount
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    // Tải danh sách khoa ban đầu
    useEffect(() => {
        let isCurrent = true;
        const fetchDepartments = async () => {
            try {
                const res = await classService.getDepartments();
                if (isCurrent) setDepartments(res);
            } catch {
                toast.error("Không thể tải danh sách Khoa.");
            }
        };

        if (!isHeadOfDept) fetchDepartments();
        return () => {
            isCurrent = false;
        };
    }, [isHeadOfDept]);

    // Tải danh sách học kỳ ban đầu
    useEffect(() => {
        let isCurrent = true;
        const fetchSemesters = async () => {
            try {
                const res = await classService.getSemesters();
                if (isCurrent) setSemesters(res);
            } catch {
                toast.error("Không thể tải danh sách học kỳ.");
            }
        };

        fetchSemesters();
        return () => {
            isCurrent = false;
        };
    }, []);

    // Gọi danh sách lớp có cơ chế loại bỏ xung đột phản hồi API cũ/mới
    const fetchClasses = useCallback(async () => {
        const currentFetchId = ++fetchIdRef.current;
        setIsLoading(true);

        try {
            const params = {
                keyword: debouncedSearchTerm.trim() || undefined,
                semesterId: selectedSemester
                    ? Number(selectedSemester)
                    : undefined,
                status: selectedStatus || undefined,
                departmentId: isHeadOfDept
                    ? mockDepartmentId
                    : selectedDepartment
                      ? Number(selectedDepartment)
                      : undefined,
                page: currentPage,
                size: pageSize,
            };

            const response = await classService.getClasses(params);

            // Chỉ cập nhật state nếu đây là request mới nhất và component còn mount
            if (currentFetchId === fetchIdRef.current && isMountedRef.current) {
                setData(response);
            }
        } catch {
            if (currentFetchId === fetchIdRef.current && isMountedRef.current) {
                toast.error("Không thể tải danh sách lớp học.");
            }
        } finally {
            if (currentFetchId === fetchIdRef.current && isMountedRef.current) {
                setIsLoading(false);
            }
        }
    }, [
        debouncedSearchTerm,
        selectedSemester,
        selectedStatus,
        selectedDepartment,
        currentPage,
        isHeadOfDept,
        mockDepartmentId,
    ]);

    useEffect(() => {
        fetchClasses();
    }, [fetchClasses]);

    // Xem chi tiết lớp học
    const handleViewDetail = async (id: number) => {
        setIsDetailModalOpen(true);
        setIsFetchingDetail(true);
        setSelectedClassDetail(null);

        try {
            const detail = await classService.getClassDetailForStudent(id);
            if (isMountedRef.current) {
                setSelectedClassDetail(detail);
            }
        } catch {
            toast.error("Không thể tải thông tin chi tiết.");
            if (isMountedRef.current) setIsDetailModalOpen(false);
        } finally {
            if (isMountedRef.current) setIsFetchingDetail(false);
        }
    };

    // Kích hoạt modal phân công giảng viên
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
                        <Layers className="w-7 h-7 text-blue-600" /> Quản lý Lớp
                        học phần
                    </h1>
                </div>
            </div>

            <ClassFilter
                searchTerm={searchTerm}
                onSearchChange={(v) => {
                    setSearchTerm(v);
                    setCurrentPage(0);
                }}
                semesters={semesters}
                selectedSemester={selectedSemester}
                onSemesterChange={(v) => {
                    setSelectedSemester(v);
                    setCurrentPage(0);
                }}
                selectedStatus={selectedStatus}
                onStatusChange={(v) => {
                    setSelectedStatus(v);
                    setCurrentPage(0);
                }}
                departments={isHeadOfDept ? undefined : departments}
                selectedDepartment={selectedDepartment}
                onDepartmentChange={
                    isHeadOfDept
                        ? undefined
                        : (v) => {
                              setSelectedDepartment(v);
                              setCurrentPage(0);
                          }
                }
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
