import React, { useState } from "react";
import {
    Search,
    Filter,
    Calendar,
    SlidersHorizontal,
    Building2,
    ChevronDown,
} from "lucide-react";
import clsx from "clsx";

interface FilterOption {
    id: number | string;
    name: string;
}

interface ClassFilterProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    semesters: FilterOption[];
    selectedSemester: string;
    onSemesterChange: (value: string) => void;
    selectedStatus: string;
    onStatusChange: (value: string) => void;
    departments?: FilterOption[];
    selectedDepartment?: string;
    onDepartmentChange?: (value: string) => void;
    onAddClick?: () => void;
}

export const ClassFilter: React.FC<ClassFilterProps> = ({
    searchTerm,
    onSearchChange,
    semesters,
    selectedSemester,
    onSemesterChange,
    selectedStatus,
    onStatusChange,
    departments = [],
    selectedDepartment = "",
    onDepartmentChange,
}) => {
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
    
    // Đã fix: Chỉ đếm 'selectedDepartment' nếu prop 'onDepartmentChange' tồn tại (Phòng ĐT đang xem)
    const activeAdvancedFiltersCount = [
        selectedStatus,
        onDepartmentChange ? selectedDepartment : "",
    ].filter((val) => val !== "").length;

    const selectStyles =
        "bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block w-full pl-9 pr-10 py-2.5 outline-none cursor-pointer transition-all appearance-none";
    const selectBgImage = `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`;

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6 w-full transition-all duration-300 ease-in-out">
            <div className="flex flex-col xl:flex-row items-center gap-4 p-4 w-full">
                <div className="relative w-full xl:flex-1 min-w-[240px]">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm theo mã lớp học phần hoặc tên môn học..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="bg-gray-50/50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block w-full pl-10 p-2.5 outline-none transition-all placeholder:text-gray-400"
                    />
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto shrink-0">
                    <div className="relative w-full sm:w-48">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Calendar className="w-4 h-4 text-gray-400" />
                        </div>
                        <select
                            value={selectedSemester}
                            onChange={(e) => onSemesterChange(e.target.value)}
                            className={selectStyles}
                            style={{
                                backgroundImage: selectBgImage,
                                backgroundPosition: "right 0.75rem center",
                                backgroundSize: "1rem",
                                backgroundRepeat: "no-repeat",
                            }}
                        >
                            <option value="">Tất cả học kỳ</option>
                            {semesters.map((sem) => (
                                <option key={sem.id} value={sem.id}>
                                    {sem.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                        className={clsx(
                            "relative flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 text-sm font-medium rounded-lg transition-colors border focus:outline-none focus:ring-4",
                            isAdvancedOpen
                                ? "bg-blue-50 text-blue-700 border-blue-200 focus:ring-blue-500/20"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-gray-100",
                        )}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Lọc nâng cao
                        {activeAdvancedFiltersCount > 0 && (
                            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white border-2 border-white shadow-sm">
                                {activeAdvancedFiltersCount}
                            </span>
                        )}
                        <ChevronDown
                            className={clsx(
                                "w-4 h-4 text-gray-400 transition-transform duration-200",
                                isAdvancedOpen && "rotate-180",
                            )}
                        />
                    </button>
                </div>
            </div>
            <div
                className={clsx(
                    "grid overflow-hidden transition-all duration-300 ease-in-out",
                    isAdvancedOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                )}
            >
                <div className="min-h-0">
                    <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-wrap gap-4 rounded-b-xl">
                        <div className="relative w-full sm:w-56">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                                Trạng thái lớp
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Filter className="w-4 h-4 text-gray-400" />
                                </div>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) =>
                                        onStatusChange(e.target.value)
                                    }
                                    className={selectStyles}
                                    style={{
                                        backgroundImage: selectBgImage,
                                        backgroundPosition:
                                            "right 0.75rem center",
                                        backgroundSize: "1rem",
                                        backgroundRepeat: "no-repeat",
                                    }}
                                >
                                    <option value="">Tất cả trạng thái</option>
                                    <option value="PENDING">
                                        Lên kế hoạch (Pending)
                                    </option>
                                    <option value="REGISTRATION">
                                        Mở đăng ký (Registration)
                                    </option>
                                    <option value="ONGOING">
                                        Đang diễn ra (Ongoing)
                                    </option>
                                    <option value="COMPLETED">
                                        Đã kết thúc (Completed)
                                    </option>
                                    <option value="CANCELED">
                                        Đã hủy (Canceled)
                                    </option>
                                </select>
                            </div>
                        </div>

                        {onDepartmentChange && (
                            <div className="relative w-full sm:w-56">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                                    Khoa phụ trách
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <Building2 className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <select
                                        value={selectedDepartment}
                                        onChange={(e) =>
                                            onDepartmentChange(e.target.value)
                                        }
                                        className={selectStyles}
                                        style={{
                                            backgroundImage: selectBgImage,
                                            backgroundPosition:
                                                "right 0.75rem center",
                                            backgroundSize: "1rem",
                                            backgroundRepeat: "no-repeat",
                                        }}
                                    >
                                        <option value="">Tất cả Khoa</option>
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
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};