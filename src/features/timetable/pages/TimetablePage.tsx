/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
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

    const role: TimetableRole = useMemo(() => {
        return user?.roles?.includes("INSTRUCTOR") ? "INSTRUCTOR" : "STUDENT";
    }, [user]);

    const fetchSchedule = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = role === "INSTRUCTOR" 
                ? await timetableService.getLecturerSchedule() 
                : await timetableService.getMySchedule();
            
            setScheduleData(data);
        } catch (error) {
            toast.error("Không thể tải thời khóa biểu. Vui lòng thử lại.");
            setScheduleData([]);
        } finally {
            setIsLoading(false);
        }
    }, [role]);

    useEffect(() => {
        fetchSchedule();
    }, [fetchSchedule]);

    const handlePrevWeek = () => setCurrentDate((prev) => addWeeks(prev, -1));
    const handleNextWeek = () => setCurrentDate((prev) => addWeeks(prev, 1));
    const handleToday = () => setCurrentDate(new Date());

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