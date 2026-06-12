/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import apiClient from "@/services/apiClient";
import {
    type SemesterResponse,
    type PageResponse,
    type SemesterListParams,
    type SemesterCreatePayload,
    type SemesterClassResponse,
} from "../types";

export const semesterService = {
    getSemesters: async (
        params: SemesterListParams,
    ): Promise<PageResponse<SemesterResponse>> => {
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(
                ([value]) =>
                    value !== null && value !== undefined && value !== "",
            ),
        );

        return (await apiClient.get("/semesters", {
            params: cleanParams,
        })) as PageResponse<SemesterResponse>;
    },

    getSemesterById: async (id: number): Promise<SemesterResponse> => {
        return (await apiClient.get(`/semesters/${id}`)) as SemesterResponse;
    },

    createSemester: async (
        payload: SemesterCreatePayload,
    ): Promise<SemesterResponse> => {
        return (await apiClient.post(
            "/semesters",
            payload,
        )) as SemesterResponse;
    },

    getClassesBySemester: async (
        semesterId: number,
    ): Promise<SemesterClassResponse[]> => {
        const response: any = await apiClient.get(`/classes/semesters/${semesterId}/classes`)
        return response.data || response
    },

    closeSemester: async (semesterId: number): Promise<string> => {
        const response: any = await apiClient.post(`/semesters/${semesterId}/close`)
        return response.data || response
    }
};
