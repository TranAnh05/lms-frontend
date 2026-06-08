import apiClient from "@/services/apiClient";
import { type ScheduleItem } from "../types";

export const timetableService = {
    getMySchedule: async (): Promise<ScheduleItem[]> => {
        const response = await apiClient.get<ScheduleItem[]>("/schedules/my");
        return response.data;
    },

    getLecturerSchedule: async (): Promise<ScheduleItem[]> => {
        const response = await apiClient.get<ScheduleItem[]>("/schedules/lecturer");
        return response.data;
    },
};