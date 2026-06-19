import React, { useState, useMemo } from "react";
import { Search, Filter, Calendar, SlidersHorizontal, Building2, ChevronDown } from "lucide-react";
import clsx from "clsx";

interface FilterOption {
    id: number | string;
    name?: string;
    semesterCode?: string; 
    academicYear?: string;
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
}

// Đưa hằng số ra ngoài để tránh tái khởi tạo khi re-render
const SELECT_STYLES = "bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block w-full pl-9 pr-10 py-2.5 outline-none cursor-pointer appearance-none transition-all";

const SELECT_BG_STYLE = {
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundPosition: "right 0.75rem center",
    backgroundSize: "1rem",
    backgroundRepeat: "no-repeat",
};

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

    // Chỉ tính toán lại số lượng bộ lọc khi giá trị thực sự thay đổi
    const activeAdvancedFiltersCount = useMemo(() => {
        return [
            selectedStatus,
            onDepartmentChange ? selectedDepartment : "",
        ].filter(Boolean).length;
    }, [selectedStatus, selectedDepartment, onDepartmentChange]);

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6 w-full transition-all duration-300">
            {/* Khu vực bộ lọc chính */}
            <div className="flex flex-col xl:flex-row items-center gap-4 p-4">
                <div className="relative w-full xl:flex-1 min-w-[240px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm theo mã lớp hoặc tên môn học..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="bg-gray-50/50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block w-full pl-10 p-2.5 outline-none transition-all placeholder:text-gray-400"
                    />
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto shrink-0">
                    <div className="relative w-full sm:w-56">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                            value={selectedSemester}
                            onChange={(e) => onSemesterChange(e.target.value)}
                            className={SELECT_STYLES}
                            style={SELECT_BG_STYLE}
                        >
                            <option value="" className="text-gray-900">Tất cả học kỳ</option>
                            {semesters.map((sem) => {
                                const displayName = sem.name || (sem.semesterCode ? `${sem.semesterCode} ${sem.academicYear || ""}` : `Học kỳ ${sem.id}`);
                                return (
                                    <option key={sem.id} value={sem.id} className="text-gray-900">
                                        {displayName.trim()}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <button
                        onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                        className={clsx(
                            "relative flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 text-sm font-medium rounded-lg transition-colors border outline-none",
                            isAdvancedOpen ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        )}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Lọc nâng cao
                        {activeAdvancedFiltersCount > 0 && (
                            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-sm">
                                {activeAdvancedFiltersCount}
                            </span>
                        )}
                        <ChevronDown className={clsx("w-4 h-4 text-gray-400 transition-transform", isAdvancedOpen && "rotate-180")} />
                    </button>
                </div>
            </div>

            {/* Khu vực bộ lọc nâng cao */}
            <div className={clsx("grid transition-all duration-300", isAdvancedOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                <div className="overflow-hidden">
                    <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-wrap gap-4 rounded-b-xl">
                        <div className="relative w-full sm:w-56">
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 ml-1">Trạng thái lớp</label>
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => onStatusChange(e.target.value)}
                                    className={SELECT_STYLES}
                                    style={SELECT_BG_STYLE}
                                >
                                    <option value="">Tất cả trạng thái</option>
                                    <option value="PENDING">Lên kế hoạch</option>
                                    <option value="REGISTRATION">Mở đăng ký</option>
                                    <option value="ONGOING">Đang diễn ra</option>
                                    <option value="COMPLETED">Đã kết thúc</option>
                                    <option value="CANCELED">Đã hủy</option>
                                </select>
                            </div>
                        </div>

                        {onDepartmentChange && (
                            <div className="relative w-full sm:w-56">
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 ml-1">Khoa phụ trách</label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <select
                                        value={selectedDepartment}
                                        onChange={(e) => onDepartmentChange(e.target.value)}
                                        className={SELECT_STYLES}
                                        style={SELECT_BG_STYLE}
                                    >
                                        <option value="">Tất cả Khoa</option>
                                        {departments.map((dept) => (
                                            <option key={dept.id} value={dept.id}>{dept.name}</option>
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