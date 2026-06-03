import apiClient from "@/services/apiClient";
import {
    type SemesterResponse,
    type PageResponse,
    type SemesterListParams,
    type SemesterCreatePayload,
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
};
