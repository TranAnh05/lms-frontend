import React from "react";
import { Plus, Search } from "lucide-react";
import { type Department } from "../types";

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
    const handleSearchChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        onSearchChange(e.target.value);
    };

    const handleDeptChange = (
        e: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        onDeptChange(
            e.target.value ? Number(e.target.value) : null,
        );
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                {/* Tìm kiếm */}
                <div className="relative w-full sm:w-72">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="w-4 h-4 text-gray-400" />
                    </div>

                    <input
                        type="text"
                        aria-label="Tìm kiếm ngành học"
                        placeholder="Tìm theo mã hoặc tên ngành..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="block w-full pl-10 p-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm transition-colors focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Lọc theo khoa */}
                <select
                    aria-label="Lọc theo khoa"
                    value={selectedDeptId ?? ""}
                    onChange={handleDeptChange}
                    className="block w-full sm:w-56 p-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm cursor-pointer focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">Tất cả các khoa</option>

                    {departments.map((dept) => (
                        <option
                            key={dept.id}
                            value={dept.id}
                        >
                            {dept.name}
                        </option>
                    ))}
                </select>
            </div>

            {canCreate && (
                <button
                    type="button"
                    onClick={onAddClick}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <Plus className="w-4 h-4" />
                    Thêm ngành học
                </button>
            )}
        </div>
    );
};