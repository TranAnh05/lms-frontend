import React, { memo } from "react";
import { Search, Plus, Calendar, Activity } from "lucide-react";

interface SemesterFilterProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    selectedStatus: string;
    onStatusChange: (status: string) => void;
    academicYears: string[];
    selectedAcademicYear: string;
    onAcademicYearChange: (year: string) => void;
    onAddClick?: () => void;
}

// Toi uu: Dua chuoi SVG va CSS class chung ra ngoai component de tranh cap phat lai bo nho
const SELECT_ARROW_SVG = `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`;
const SELECT_CLASSES =
    "bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block w-full pl-9 pr-10 py-2.5 outline-none cursor-pointer transition-all appearance-none";

// Toi uu: Su dung React.memo de ngan re-render khi Component cha thay doi state khong lien quan
export const SemesterFilter: React.FC<SemesterFilterProps> = memo(
    ({
        searchTerm,
        onSearchChange,
        selectedStatus,
        onStatusChange,
        academicYears,
        selectedAcademicYear,
        onAcademicYearChange,
        onAddClick,
    }) => {
        return (
            <div className="flex flex-col xl:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 w-full">
                <div className="relative w-full xl:flex-1 min-w-[240px]">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm theo mã học kỳ..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="bg-gray-50/50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block w-full pl-10 p-2.5 outline-none transition-all placeholder:text-gray-400"
                    />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto shrink-0">
                    <div className="relative w-full sm:w-48">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Activity className="w-4 h-4 text-gray-400" />
                        </div>
                        <select
                            value={selectedStatus}
                            onChange={(e) => onStatusChange(e.target.value)}
                            className={SELECT_CLASSES}
                            style={{
                                backgroundImage: SELECT_ARROW_SVG,
                                backgroundPosition: "right 0.75rem center",
                                backgroundSize: "1rem",
                                backgroundRepeat: "no-repeat",
                            }}
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="ACTIVE">Đang hoạt động</option>
                            <option value="CLOSED">Đã đóng</option>
                        </select>
                    </div>

                    <div className="relative w-full sm:w-48">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Calendar className="w-4 h-4 text-gray-400" />
                        </div>
                        <select
                            value={selectedAcademicYear}
                            onChange={(e) =>
                                onAcademicYearChange(e.target.value)
                            }
                            className={SELECT_CLASSES}
                            style={{
                                backgroundImage: SELECT_ARROW_SVG,
                                backgroundPosition: "right 0.75rem center",
                                backgroundSize: "1rem",
                                backgroundRepeat: "no-repeat",
                            }}
                        >
                            <option value="">Tất cả năm học</option>
                            {academicYears.map((year, index) => (
                                <option key={index} value={year}>
                                    Năm học {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    {onAddClick && (
                        <button
                            onClick={onAddClick}
                            className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 shrink-0"
                        >
                            <Plus className="w-4 h-4" />
                            Thêm học kỳ
                        </button>
                    )}
                </div>
            </div>
        );
    },
);

SemesterFilter.displayName = "SemesterFilter";
