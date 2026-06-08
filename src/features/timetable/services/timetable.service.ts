import apiClient from "@/services/apiClient";
import { type ScheduleItem, type WeeklyScheduleParams } from "../types";
import { mockScheduleItems } from "../data/mockTimetableData";

export const timetableService = {
    getWeeklySchedule: async (params: WeeklyScheduleParams): Promise<ScheduleItem[]> => {
        // Tạm thời trả về mock data. Khi có API, thay thế bằng block code bên dưới.
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockScheduleItems), 600);
        });

        /*
        const response = await apiClient.get<ScheduleItem[]>("/timetable", { params });
        return response.data;
        */
    },
};