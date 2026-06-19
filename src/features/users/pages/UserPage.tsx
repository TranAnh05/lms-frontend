/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback, Suspense, lazy } from "react";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";

import { useDebounce } from "@/hooks/useDebounce";
import { userService } from "../services/user.service";
import { type User, type Department, type RoleDropdown } from "../types";

import { UserFilter } from "../components/UserFilter";
import { UserTable } from "../components/UserTable";

const UserDetailModal = lazy(() => import("../components/UserDetailModal").then(m => ({ default: m.UserDetailModal })));
const UserFormModal = lazy(() => import("../components/UserFormModal").then(m => ({ default: m.UserFormModal })));
const UserEditModal = lazy(() => import("../components/UserEditModal").then(m => ({ default: m.UserEditModal })));
const LockUserModal = lazy(() => import("../components/LockUserModal").then(m => ({ default: m.LockUserModal })));
const UnlockUserModal = lazy(() => import("../components/UnlockUserModal").then(m => ({ default: m.UnlockUserModal })));

export const UserPage: React.FC = () => {
    // --- STATE ---
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<RoleDropdown[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    // Filter & Pagination States
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedRoleCode, setSelectedRoleCode] = useState<string>("");
    const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const pageSize = 10;

    // Modal States
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isLockModalOpen, setIsLockModalOpen] = useState<boolean>(false);
    const [isUnlockModalOpen, setIsUnlockModalOpen] = useState<boolean>(false);

    const debouncedSearchTerm = useDebounce(searchTerm, 400);

    // --- EFFECTS ---
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
                toast.error("Không thể tải dữ liệu bộ lọc vai trò hoặc khoa học.");
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
            toast.error("Đã xảy ra lỗi khi lấy danh sách người dùng từ hệ thống.");
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearchTerm, selectedRoleCode, selectedDeptId, currentPage]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    
    // Filter Handlers
    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value);
        setCurrentPage(0);
    }, []);

    const handleRoleChange = useCallback((code: string) => {
        setSelectedRoleCode(code);
        setCurrentPage(0);
    }, []);

    const handleDeptChange = useCallback((id: number | null) => {
        setSelectedDeptId(id);
        setCurrentPage(0);
    }, []);

    // View Modal Handlers
    const handleViewDetail = useCallback((id: number) => {
        setSelectedUserId(id);
        setIsViewModalOpen(true);
    }, []);

    const handleCloseViewModal = useCallback(() => {
        setIsViewModalOpen(false);
        setSelectedUserId(null);
    }, []);

    // Create Modal Handlers
    const handleOpenCreateModal = useCallback(() => {
        setIsCreateModalOpen(true);
    }, []);

    const handleCloseCreateModal = useCallback(() => {
        setIsCreateModalOpen(false);
    }, []);

    const handleCreateSuccess = useCallback(() => {
        setCurrentPage(0);
        fetchUsers();
    }, [fetchUsers]);

    // Edit Modal Handlers
    const handleEditUser = useCallback((id: number) => {
        setIsViewModalOpen(false);
        setSelectedUserId(id);
        setIsEditModalOpen(true);
    }, []);

    const handleCloseEditModal = useCallback(() => {
        setIsEditModalOpen(false);
        setSelectedUserId(null);
    }, []);

    const handleEditSuccess = useCallback(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Lock/Unlock Handlers
    const handleToggleLockUser = useCallback((id: number, currentStatus: boolean) => {
        setSelectedUserId(id);
        if (currentStatus) {
            setIsLockModalOpen(true);
        } else {
            setIsUnlockModalOpen(true);
        }
    }, []);

    const handleCloseLockModal = useCallback(() => {
        setIsLockModalOpen(false);
        setSelectedUserId(null);
    }, []);

    const handleCloseUnlockModal = useCallback(() => {
        setIsUnlockModalOpen(false);
        setSelectedUserId(null);
    }, []);

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-gray-50/50">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                        Quản lý Tài khoản
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Xem danh sách, kiểm tra thông tin hồ sơ và quản lý trạng
                        thái kích hoạt của người dùng toàn hệ thống.
                    </p>
                </div>

                <button
                    onClick={handleOpenCreateModal}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 h-10 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    Thêm tài khoản
                </button>
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

            {/* Bảng dữ liệu */}
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

            <Suspense fallback={null}>
                {isViewModalOpen && (
                    <UserDetailModal
                        isOpen={isViewModalOpen}
                        onClose={handleCloseViewModal}
                        userId={selectedUserId}
                        onEdit={handleEditUser}
                    />
                )}

                {isCreateModalOpen && (
                    <UserFormModal
                        isOpen={isCreateModalOpen}
                        onClose={handleCloseCreateModal}
                        onSuccess={handleCreateSuccess}
                    />
                )}

                {isEditModalOpen && (
                    <UserEditModal
                        isOpen={isEditModalOpen}
                        onClose={handleCloseEditModal}
                        userId={selectedUserId}
                        onSuccess={handleEditSuccess}
                    />
                )}

                {isLockModalOpen && (
                    <LockUserModal
                        isOpen={isLockModalOpen}
                        onClose={handleCloseLockModal}
                        onSuccess={fetchUsers}
                        userId={selectedUserId}
                    />
                )}

                {isUnlockModalOpen && (
                    <UnlockUserModal
                        isOpen={isUnlockModalOpen}
                        onClose={handleCloseUnlockModal}
                        onSuccess={fetchUsers}
                        userId={selectedUserId}
                    />
                )}
            </Suspense>
        </div>
    );
};