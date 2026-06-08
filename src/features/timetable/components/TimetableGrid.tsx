import React, { useMemo } from "react";
import { Loader2 } from "lucide-react";
import clsx from "clsx";
import { ScheduleCard } from "./ScheduleCard";
import { getDatesOfWeek } from "../utils/dateUtils";
import { SHIFTS } from "../data/mockTimetableData";
import { type ScheduleItem, type TimetableRole } from "../types";

interface TimetableGridProps {
    currentDate: Date;
    data: ScheduleItem[];
    role: TimetableRole;
    isLoading: boolean;
}

const DAYS_OF_WEEK = [
    { id: 2, name: "Thứ 2" },
    { id: 3, name: "Thứ 3" },
    { id: 4, name: "Thứ 4" },
    { id: 5, name: "Thứ 5" },
    { id: 6, name: "Thứ 6" },
    { id: 7, name: "Thứ 7" },
    { id: 8, name: "Chủ Nhật" },
];

export const TimetableGrid: React.FC<TimetableGridProps> = ({
    currentDate,
    data,
    role,
    isLoading,
}) => {
    const weekDates = useMemo(() => getDatesOfWeek(currentDate), [currentDate]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-xl border border-gray-200 shadow-sm">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
                <p className="text-sm font-medium text-gray-500">Đang tải thời khóa biểu...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
                <div className="min-w-[1100px]">
                    <div className="grid grid-cols-[120px_repeat(7,minmax(0,1fr))] bg-gray-50/80 border-b border-gray-200">
                        <div className="p-4 border-r border-gray-200 flex items-center justify-center text-center">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                Ca / Thứ
                            </span>
                        </div>
                        
                        {DAYS_OF_WEEK.map((day, idx) => {
                            const date = weekDates[idx];
                            const isToday = new Date().toDateString() === date.toDateString();
                            
                            return (
                                <div key={day.id} className="p-3 border-r border-gray-200 last:border-r-0 flex flex-col items-center justify-center gap-1">
                                    <span className={clsx(
                                        "text-sm font-bold",
                                        isToday ? "text-blue-600" : "text-gray-900"
                                    )}>
                                        {day.name}
                                    </span>
                                    <span className={clsx(
                                        "text-xs font-semibold px-2.5 py-0.5 rounded-full",
                                        isToday ? "bg-blue-100 text-blue-700" : "text-gray-500"
                                    )}>
                                        {date.getDate().toString().padStart(2, '0')}/{(date.getMonth() + 1).toString().padStart(2, '0')}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex flex-col">
                        {SHIFTS.map((shift) => {
                            const [shiftTitle, shiftSessionRaw] = shift.name.split(' (');
                            const shiftSession = shiftSessionRaw?.replace(')', '');

                            return (
                                <div key={shift.id} className="grid grid-cols-[120px_repeat(7,minmax(0,1fr))] border-b border-gray-200 last:border-b-0">
                                    <div className="p-3 border-r border-gray-200 bg-gray-50/30 flex flex-col items-center justify-center text-center gap-1">
                                        <span className="text-sm font-bold text-gray-700 uppercase">
                                            {shiftTitle}
                                        </span>
                                        {shiftSession && (
                                            <span className="text-[11px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded">
                                                {shiftSession}
                                            </span>
                                        )}
                                        <span className="text-[11px] font-semibold text-gray-500 mt-1">
                                            {shift.startTime.slice(0, 5)} - {shift.endTime.slice(0, 5)}
                                        </span>
                                    </div>

                                    {DAYS_OF_WEEK.map((day) => {
                                        const classItem = data.find(d => d.shiftId === shift.id && d.dayOfWeek === day.id);
                                        
                                        return (
                                            <div 
                                                key={`${shift.id}-${day.id}`} 
                                                className="p-1.5 border-r border-gray-200 last:border-r-0 min-h-[160px] bg-white hover:bg-gray-50/50 transition-colors"
                                            >
                                                {classItem ? (
                                                    <ScheduleCard item={classItem} role={role} />
                                                ) : null}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};