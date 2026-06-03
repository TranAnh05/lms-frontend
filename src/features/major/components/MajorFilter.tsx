import React from "react";
import { type Department } from "../types";
import { Plus, Search } from "lucide-react";

interface MajorFilterProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    departments: Department[];
    selectedDeptId: number | null;
    onDeptChange: (id: number | null) => void;
    onAddClick?: () => void;
    canCreate?: boolean;
}

export const MajorFilter: React.FC<MajorFilterProps> = ({
    searchTerm,
    onSearchChange,
    departments = [],
    selectedDeptId,
    onDeptChange,
    onAddClick,
    canCreate,
}) => {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                {/* Ô tìm kiếm */}
                <div className="relative w-full sm:w-72">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm theo mã hoặc tên ngành..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 shadow-sm transition-colors"
                    />
                </div>

                {/* Dropdown Lọc theo Khoa */}
                <select
                    value={selectedDeptId || ""}
                    onChange={(e) =>
                        onDeptChange(
                            e.target.value ? Number(e.target.value) : null,
                        )
                    }
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-56 p-2.5 shadow-sm cursor-pointer"
                >
                    <option value="">Tất cả các khoa</option>
                    {departments?.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                            {dept.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Nút hành động chính */}
            {canCreate && (
                <button
                    onClick={onAddClick}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <Plus className="w-4 h-4" />
                    Thêm ngành học
                </button>
            )}
        </div>
    );
};
