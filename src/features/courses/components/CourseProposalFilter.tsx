import React from "react";
import { Filter, Plus } from "lucide-react";

interface CourseProposalFilterProps {
    selectedStatus: string;
    onStatusChange: (status: string) => void;
    onAddClick?: () => void;
}

const STATUS_OPTIONS = [
    {
        value: "",
        label: "Tất cả trạng thái",
    },
    {
        value: "PENDING",
        label: "Đang chờ duyệt",
    },
    {
        value: "APPROVED",
        label: "Đã được duyệt",
    },
    {
        value: "REJECTED",
        label: "Bị từ chối",
    },
] as const;

const SELECT_STYLE: React.CSSProperties = {
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundPosition: "right 0.75rem center",
    backgroundSize: "1rem",
    backgroundRepeat: "no-repeat",
    paddingRight: "2.5rem",
};

export const CourseProposalFilter: React.FC<CourseProposalFilterProps> = ({
    selectedStatus,
    onStatusChange,
    onAddClick,
}) => {
    const handleStatusChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        onStatusChange(event.target.value);
    };

    return (
        <div className="flex w-full flex-col items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row">
            <div className="flex w-full items-center gap-3 sm:w-auto">
                <div className="relative w-full sm:w-64">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Filter className="h-4 w-4 text-gray-400" />
                    </div>

                    <select
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        style={SELECT_STYLE}
                        className="block w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-gray-50/50 p-2.5 pl-9 text-sm text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    >
                        {STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {onAddClick && (
                <button
                    type="button"
                    onClick={onAddClick}
                    className="flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 sm:w-auto"
                >
                    <Plus className="h-4 w-4" />
                    Đề xuất môn học
                </button>
            )}
        </div>
    );
};
