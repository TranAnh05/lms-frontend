import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useDebounce } from "@/hooks/useDebounce";
import { userService } from "../services/user.service";
import { type User, type Role, type Department } from "../types";
import { UserFilter } from "../components/UserFilter";
import { UserTable } from "../components/UserTable";
import { UserDetailModal } from "../components/UserDetailModal";

export const UserPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedRoleCode, setSelectedRoleCode] = useState<string>("");
    const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null);

    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const pageSize = 10;

    const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    const debouncedSearchTerm = useDebounce(searchTerm, 400);

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [rolesData, deptsData] = await Promise.all([
                    userService.getRoles(),
                    userService.getDepartments(undefined, true),
                ]);
                setRoles(rolesData);
                setDepartments(deptsData);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu cấu hình hệ thống:", error);
                toast.error(
                    "Không thể tải dữ liệu bộ lọc vai trò hoặc khoa học.",
                );
            }
        };

        fetchDropdownData();
    }, []);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await userService.getUsers({
                keyword: debouncedSearchTerm.trim() || undefined,
                roleCode: selectedRoleCode || undefined,
                departmentId: selectedDeptId || undefined,
                page: currentPage,
                size: pageSize,
                sortBy: "createdAt",
                sortDirection: "desc",
            });

            setUsers(response.content);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error("Lỗi gọi API lấy danh sách người dùng:", error);
            toast.error(
                "Đã xảy ra lỗi khi lấy danh sách người dùng từ hệ thống.",
            );
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearchTerm, selectedRoleCode, selectedDeptId, currentPage]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(0);
    };

    const handleRoleChange = (code: string) => {
        setSelectedRoleCode(code);
        setCurrentPage(0);
    };

    const handleDeptChange = (id: number | null) => {
        setSelectedDeptId(id);
        setCurrentPage(0);
    };

    const handleViewDetail = useCallback((id: number) => {
        setSelectedUserId(id);
        setIsViewModalOpen(true);
    }, []);

    const handleCloseViewModal = useCallback(() => {
        setIsViewModalOpen(false);
        setSelectedUserId(null);
    }, []);

    const handleEditUser = useCallback((id: number) => {
        toast.info(`Đang mở form cập nhật người dùng có ID: ${id}`);
    }, []);

    const handleToggleLockUser = async (id: number, currentStatus: boolean) => {
        const actionText = currentStatus ? "khóa" : "mở khóa";

        if (
            window.confirm(
                `Bạn có chắc chắn muốn ${actionText} tài khoản này không?`,
            )
        ) {
            try {
                toast.success(
                    `Đã thực hiện ${actionText} tài khoản ID ${id} thành công!`,
                );
                fetchUsers();
            } catch (error) {
                toast.error(
                    `Không thể thực hiện thao tác ${actionText} tài khoản.`,
                );
            }
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-gray-50/50">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Quản lý Tài khoản
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Xem danh sách, kiểm tra thông tin hồ sơ và quản lý trạng
                    thái kích hoạt của người dùng toàn hệ thống.
                </p>
            </div>

            <UserFilter
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                roles={roles}
                selectedRoleCode={selectedRoleCode}
                onRoleChange={handleRoleChange}
                departments={departments}
                selectedDeptId={selectedDeptId}
                onDeptChange={handleDeptChange}
            />

            <div className="flex-1 relative">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10 rounded-xl border border-gray-100">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm font-medium text-blue-600 animate-pulse">
                                Đang đồng bộ dữ liệu...
                            </span>
                        </div>
                    </div>
                )}

                <UserTable
                    users={users}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    onView={handleViewDetail}
                    onEdit={handleEditUser}
                    onToggleLock={handleToggleLockUser}
                />
            </div>

            {/* Modal Xem chi tiết */}
            <UserDetailModal
                isOpen={isViewModalOpen}
                onClose={handleCloseViewModal}
                userId={selectedUserId}
            />
        </div>
    );
};
