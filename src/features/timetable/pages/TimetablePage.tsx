import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { TimetableHeader } from "../components/TimetableHeader";
import { TimetableGrid } from "../components/TimetableGrid";
import { timetableService } from "../services/timetable.service";
import { type ScheduleItem, type TimetableRole } from "../types";
import { addWeeks } from "../utils/dateUtils";
import { useAuthStore } from "@/store/authStore";

export const TimetablePage: React.FC = () => {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { user } = useAuthStore();

    // Phan quyen nguoi dung dua tren thong tin luu tru trong global store
    const role: TimetableRole = useMemo(() => {
        return user?.roles?.includes("INSTRUCTOR") ? "INSTRUCTOR" : "STUDENT";
    }, [user]);

    // Tu dong tai du lieu thoi khoa bieu khi vai tro (role) thay doi
    useEffect(() => {
        let isMounted = true;

        const fetchSchedule = async () => {
            setIsLoading(true);
            try {
                const data =
                    role === "INSTRUCTOR"
                        ? await timetableService.getLecturerSchedule()
                        : await timetableService.getMySchedule();

                if (isMounted) {
                    setScheduleData(data);
                }
            } catch {
                toast.error("Không thể tải thời khóa biểu. Vui lòng thử lại.");
                if (isMounted) {
                    setScheduleData([]);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchSchedule();

        return () => {
            isMounted = false;
        };
    }, [role]);

    // Giu nguyen vung nho cac ham dieu huong tuan de ghi nho props cho TimetableHeader
    const handlePrevWeek = useCallback(
        () => setCurrentDate((prev) => addWeeks(prev, -1)),
        [],
    );
    const handleNextWeek = useCallback(
        () => setCurrentDate((prev) => addWeeks(prev, 1)),
        [],
    );
    const handleToday = useCallback(() => setCurrentDate(new Date()), []);

    return (
        <div className="min-h-screen bg-gray-50/50 p-2 sm:p-2 lg:p-3">
            <div className="max-w-[1400px] mx-auto space-y-6">
                <TimetableHeader
                    currentDate={currentDate}
                    onPrevWeek={handlePrevWeek}
                    onNextWeek={handleNextWeek}
                    onToday={handleToday}
                />

                <TimetableGrid
                    currentDate={currentDate}
                    data={scheduleData}
                    role={role}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};
