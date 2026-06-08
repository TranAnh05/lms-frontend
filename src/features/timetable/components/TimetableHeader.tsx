import React from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { getWeekRangeString } from "../utils/dateUtils";

interface TimetableHeaderProps {
    currentDate: Date;
    onPrevWeek: () => void;
    onNextWeek: () => void;
    onToday: () => void;
}

export const TimetableHeader: React.FC<TimetableHeaderProps> = ({
    currentDate,
    onPrevWeek,
    onNextWeek,
    onToday,
}) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                    <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900 leading-tight">Thời khóa biểu</h2>
                    <p className="text-sm font-medium text-gray-500 mt-0.5">
                        {getWeekRangeString(currentDate)}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                    onClick={onPrevWeek}
                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    title="Tuần trước"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                    onClick={onToday}
                    className="px-4 py-2 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300/50 whitespace-nowrap"
                >
                    Tuần này
                </button>
                <button
                    onClick={onNextWeek}
                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    title="Tuần sau"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};