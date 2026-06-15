import React from "react";
import { Search } from "lucide-react";
import {  type Department, type RoleDropdown } from "../types";

interface UserFilterProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;

    roles: RoleDropdown[];
    selectedRoleCode: string;
    onRoleChange: (code: string) => void;

    departments: Department[];
    selectedDeptId: number | null;
    onDeptChange: (id: number | null) => void;
}

export const UserFilter: React.FC<UserFilterProps> = ({
    searchTerm,
    onSearchChange,
    roles,
    selectedRoleCode,
    onRoleChange,
    departments,
    selectedDeptId,
    onDeptChange,
}) => {
    return (
        <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 w-full">
            <div className="relative w-full md:flex-1 min-w-[240px]">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-4 h-4 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Tìm theo tên, tên tài khoản, email..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="bg-gray-50/50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block w-full pl-10 p-2.5 outline-none transition-all placeholder:text-gray-400"
                />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
                <div className="w-full sm:w-48">
                    <select
                        value={selectedRoleCode}
                        onChange={(e) => onRoleChange(e.target.value)}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block w-full p-2.5 outline-none cursor-pointer transition-all appearance-none"
                        style={{
                            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                            backgroundPosition: "right 0.75rem center",
                            backgroundSize: "1rem",
                            backgroundRepeat: "no-repeat",
                            paddingRight: "2.5rem",
                        }}
                    >
                        <option value="">Tất cả vai trò</option>
                        {roles.map((role) => (
                            <option key={role.id} value={role.code}>
                                {role.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="w-full sm:w-56">
                    <select
                        value={selectedDeptId || ""}
                        onChange={(e) =>
                            onDeptChange(
                                e.target.value ? Number(e.target.value) : null,
                            )
                        }
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block w-full p-2.5 outline-none cursor-pointer transition-all appearance-none"
                        style={{
                            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                            backgroundPosition: "right 0.75rem center",
                            backgroundSize: "1rem",
                            backgroundRepeat: "no-repeat",
                            paddingRight: "2.5rem",
                        }}
                    >
                        <option value="">Tất cả các khoa</option>
                        {departments.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                                {dept.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};
