import apiClient from "@/services/apiClient";
import {
    type SemesterResponse,
    type PageResponse,
    type SemesterListParams,
    type SemesterCreatePayload,
    type SemesterClassResponse,
    type SemesterUpdateRequest,
    type SemesterDetailResponse,
} from "../types";

export const semesterService = {
    getSemesters: async (
        params: SemesterListParams,
    ): Promise<PageResponse<SemesterResponse>> => {
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(
                ([, value]) =>
                    value !== null && value !== undefined && value !== "",
            ),
        );

        return apiClient.get<never, PageResponse<SemesterResponse>>(
            "/semesters",
            {
                params: cleanParams,
            },
        );
    },

    createSemester: async (
        payload: SemesterCreatePayload,
    ): Promise<SemesterResponse> => {
        return apiClient.post<never, SemesterResponse>("/semesters", payload);
    },

    getClassesBySemester: async (
        semesterId: number,
    ): Promise<SemesterClassResponse[]> => {
        return apiClient.get<never, SemesterClassResponse[]>(
            `/classes/semesters/${semesterId}/classes`,
        );
    },

    closeSemester: async (semesterId: number): Promise<string> => {
        return apiClient.post<never, string>(`/semesters/${semesterId}/close`);
    },

    getSemesterById: async (id: number): Promise<SemesterResponse> => {
        return apiClient.get<never, SemesterResponse>(`/semesters/${id}`);
    },

    updateSemester: async (
        id: number,
        payload: SemesterUpdateRequest,
    ): Promise<SemesterDetailResponse> => {
        return apiClient.put<never, SemesterDetailResponse>(
            `/semesters/${id}`,
            payload,
        );
    },
};
