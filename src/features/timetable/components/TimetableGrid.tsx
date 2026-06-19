import React, { useMemo } from "react";
import { Loader2 } from "lucide-react";
import clsx from "clsx";
import { ScheduleCard } from "./ScheduleCard";
import { getDatesOfWeek } from "../utils/dateUtils";
import { SHIFTS, type ScheduleItem, type TimetableRole } from "../types";

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

export const TimetableGrid: React.FC<TimetableGridProps> = React.memo(
    ({ currentDate, data, role, isLoading }) => {
        // Tinh toan truoc danh sach cac ngay trong tuan hien tai
        const weekDates = useMemo(
            () => getDatesOfWeek(currentDate),
            [currentDate],
        );

        // Chuoi thoi gian cua ngay hom nay dung de so sanh tren tieu de hang dau
        const todayStr = useMemo(() => new Date().toDateString(), []);

        // TIEU DIEM TOI UU: Chuyen doi toan bo mang thanh Ban do tra cuu nhanh O(1)
        const scheduleLookup = useMemo(() => {
            const lookup: Record<string, ScheduleItem> = {};

            // Chuan hoa 7 ngay cua tuan hien tai sang dang thoi gian timestamp so nguyen
            const cellTimestamps = weekDates.map((date) => {
                const d = new Date(date);
                d.setHours(0, 0, 0, 0);
                return d.getTime();
            });

            // Tinh toan truoc cac moc thoi gian bat dau/ket thuc cua danh sach goc de tranh khoi tao Date lai nhieu lan
            const parsedSchedules = data.map((item) => {
                if (item.startDate && item.totalWeeks) {
                    const baseStart = new Date(item.startDate);

                    const actualStart = new Date(baseStart);
                    actualStart.setDate(baseStart.getDate() + 7);
                    actualStart.setHours(0, 0, 0, 0);

                    const actualEnd = new Date(actualStart);
                    actualEnd.setDate(
                        actualStart.getDate() + item.totalWeeks * 7,
                    );
                    actualEnd.setHours(0, 0, 0, 0);

                    return {
                        item,
                        hasRange: true,
                        startTime: actualStart.getTime(),
                        endTime: actualEnd.getTime(),
                    };
                }
                return { item, hasRange: false, startTime: 0, endTime: 0 };
            });

            // Xay dung ban do chi muc theo khoa ket hop duy nhat "IdCaHoc-IdThu"
            SHIFTS.forEach((shift) => {
                DAYS_OF_WEEK.forEach((day, idx) => {
                    const cellTime = cellTimestamps[idx];

                    const match = parsedSchedules.find(
                        ({ item, hasRange, startTime, endTime }) => {
                            const isMatch =
                                item.shiftName?.includes(shift.name) &&
                                item.dayOfWeek === day.id;
                            if (!isMatch) return false;

                            return hasRange
                                ? cellTime >= startTime && cellTime < endTime
                                : true;
                        },
                    );

                    if (match) {
                        lookup[`${shift.id}-${day.id}`] = match.item;
                    }
                });
            });

            return lookup;
        }, [data, weekDates]);

        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
                    <p className="text-sm font-medium text-gray-500">
                        Đang tải thời khóa biểu...
                    </p>
                </div>
            );
        }

        return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <div className="min-w-[1100px]">
                        {/* Header Row */}
                        <div className="grid grid-cols-[120px_repeat(7,minmax(0,1fr))] bg-gray-50/80 border-b border-gray-200">
                            <div className="p-4 border-r border-gray-200 flex items-center justify-center text-center">
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                    Ca / Thứ
                                </span>
                            </div>

                            {DAYS_OF_WEEK.map((day, idx) => {
                                const date = weekDates[idx];
                                const isToday =
                                    todayStr === date.toDateString();
                                const formattedDay = String(
                                    date.getDate(),
                                ).padStart(2, "0");
                                const formattedMonth = String(
                                    date.getMonth() + 1,
                                ).padStart(2, "0");

                                return (
                                    <div
                                        key={day.id}
                                        className="p-3 border-r border-gray-200 last:border-r-0 flex flex-col items-center justify-center gap-1"
                                    >
                                        <span
                                            className={clsx(
                                                "text-sm font-bold",
                                                isToday
                                                    ? "text-blue-600"
                                                    : "text-gray-900",
                                            )}
                                        >
                                            {day.name}
                                        </span>
                                        <span
                                            className={clsx(
                                                "text-xs font-semibold px-2.5 py-0.5 rounded-full",
                                                isToday
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "text-gray-500",
                                            )}
                                        >
                                            {formattedDay}/{formattedMonth}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Body Rows */}
                        <div className="flex flex-col">
                            {SHIFTS.map((shift) => {
                                const [shiftTitle, shiftSessionRaw] =
                                    shift.name.split(" (");
                                const shiftSession = shiftSessionRaw?.replace(
                                    ")",
                                    "",
                                );
                                const formattedStartTime =
                                    shift.startTime.slice(0, 5);
                                const formattedEndTime = shift.endTime.slice(
                                    0,
                                    5,
                                );

                                return (
                                    <div
                                        key={shift.id}
                                        className="grid grid-cols-[120px_repeat(7,minmax(0,1fr))] border-b border-gray-200 last:border-b-0"
                                    >
                                        {/* Cot hien thi thong tin Ca Hoc */}
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
                                                {formattedStartTime} -{" "}
                                                {formattedEndTime}
                                            </span>
                                        </div>

                                        {/* 7 o bieu dien du lieu cac thu trong tuan */}
                                        {DAYS_OF_WEEK.map((day) => {
                                            // Truy xuat truc tiep thong tin qua ma tra cuu duoc tinh toán truoc
                                            const classItem =
                                                scheduleLookup[
                                                    `${shift.id}-${day.id}`
                                                ];

                                            return (
                                                <div
                                                    key={`${shift.id}-${day.id}`}
                                                    className="p-1.5 border-r border-gray-200 last:border-r-0 min-h-[160px] bg-white hover:bg-gray-50/50 transition-colors"
                                                >
                                                    {classItem && (
                                                        <ScheduleCard
                                                            item={classItem}
                                                            role={role}
                                                        />
                                                    )}
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
    },
);

TimetableGrid.displayName = "TimetableGrid";
