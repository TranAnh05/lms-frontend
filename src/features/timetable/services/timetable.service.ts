import apiClient from "@/services/apiClient";
import { type ScheduleItem } from "../types";

export const timetableService = Object.freeze({
    /**
     * Lay thoi khoa bieu cua ca nhan (Sinh vien)
     */
    getMySchedule: async (): Promise<ScheduleItem[]> => {
        const response = await apiClient.get<ScheduleItem[]>("/schedules/my");
        // Bo sung phong ve du lieu de luon tra ve mang, tranh loi map/filter o UI
        return response.data || [];
    },

    /**
     * Lay lich day cua Giang vien
     */
    getLecturerSchedule: async (): Promise<ScheduleItem[]> => {
        const response = await apiClient.get<ScheduleItem[]>("/schedules/lecturer");
        // Bo sung phong ve du lieu de luon tra ve mang, tranh loi map/filter o UI
        return response.data || [];
    },
});