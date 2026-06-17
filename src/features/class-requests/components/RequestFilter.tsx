import React from "react";
import { Search, Filter, Calendar } from "lucide-react";
import type { ClassRequestStatus } from "../types";

interface FilterOption {
    id: number | string;
    name: string;
}

interface RequestFilterProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    semesters: FilterOption[];
    selectedSemester: string;
    onSemesterChange: (value: string) => void;
    // Định nghĩa kiểu dữ liệu nghiêm ngặt đồng bộ với component cha
    selectedStatus: ClassRequestStatus | "";
    onStatusChange: (value: ClassRequestStatus | "") => void;
}

// Chuyển các hằng số ra ngoài component để tránh khởi tạo lại khi re-render
const SELECT_STYLES =
    "bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block w-full pl-9 pr-10 py-2.5 outline-none cursor-pointer transition-all appearance-none";

const SELECT_BG_IMAGE = `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`;

const SELECT_INLINE_STYLE = {
    backgroundImage: SELECT_BG_IMAGE,
    backgroundPosition: "right 0.75rem center",
    backgroundSize: "1rem",
    backgroundRepeat: "no-repeat",
};

export const RequestFilter: React.FC<RequestFilterProps> = ({
    searchTerm,
    onSearchChange,
    semesters,
    selectedSemester,
    onSemesterChange,
    selectedStatus,
    onStatusChange,
}) => {
    return (
        <div className="flex flex-col xl:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 w-full">
            {/* Khung tìm kiếm văn bản */}
            <div className="relative w-full xl:flex-1 min-w-[240px]">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-4 h-4 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Tìm theo mã môn học hoặc tên môn học..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="bg-gray-50/50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block w-full pl-10 p-2.5 outline-none transition-all placeholder:text-gray-400"
                />
            </div>

            {/* Các bộ chọn phân loại danh sách */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto shrink-0">
                {/* Bộ lọc học kỳ */}
                <div className="relative w-full sm:w-48">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Calendar className="w-4 h-4 text-gray-400" />
                    </div>
                    <select
                        value={selectedSemester}
                        onChange={(e) => onSemesterChange(e.target.value)}
                        className={SELECT_STYLES}
                        style={SELECT_INLINE_STYLE}
                    >
                        <option value="">Tất cả học kỳ</option>
                        {semesters.map((sem) => (
                            <option key={sem.id} value={sem.id}>
                                {sem.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Bộ lọc trạng thái yêu cầu */}
                <div className="relative w-full sm:w-48">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Filter className="w-4 h-4 text-gray-400" />
                    </div>
                    <select
                        value={selectedStatus}
                        onChange={(e) =>
                            onStatusChange(
                                e.target.value as ClassRequestStatus | "",
                            )
                        }
                        className={SELECT_STYLES}
                        style={SELECT_INLINE_STYLE}
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="PENDING">Chờ duyệt (Pending)</option>
                        <option value="APPROVED">Đã duyệt (Approved)</option>
                        <option value="REJECTED">Bị từ chối (Rejected)</option>
                    </select>
                </div>
            </div>
        </div>
    );
};
