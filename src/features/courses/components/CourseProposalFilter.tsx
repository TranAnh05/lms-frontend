import React from "react";
import { Filter, Plus } from "lucide-react";

interface CourseProposalFilterProps {
    selectedStatus: string;
    onStatusChange: (status: string) => void;
    onAddClick: () => void;
}

export const CourseProposalFilter: React.FC<CourseProposalFilterProps> = ({
    selectedStatus,
    onStatusChange,
    onAddClick,
}) => {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm w-full">
            <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Filter className="w-4 h-4 text-gray-400" />
                    </div>

                    <select
                        value={selectedStatus}
                        onChange={(e) => onStatusChange(e.target.value)}
                        className="bg-gray-50/50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block w-full pl-9 p-2.5 outline-none cursor-pointer transition-all appearance-none"
                        style={{
                            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                            backgroundPosition: "right 0.75rem center",
                            backgroundSize: "1rem",
                            backgroundRepeat: "no-repeat",
                            paddingRight: "2.5rem",
                        }}
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="PENDING">Đang chờ duyệt</option>
                        <option value="APPROVED">Đã được duyệt</option>
                        <option value="REJECTED">Bị từ chối</option>
                    </select>
                </div>
            </div>

            <button
                onClick={onAddClick}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm focus:ring-4 focus:ring-blue-500/20 w-full sm:w-auto shrink-0"
            >
                <Plus className="w-4 h-4" />
                Đề xuất môn học
            </button>
        </div>
    );
};
