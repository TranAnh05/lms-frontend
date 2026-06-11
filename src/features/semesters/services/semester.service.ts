/* eslint-disable @typescript-eslint/no-unused-vars */
import apiClient from "@/services/apiClient";
import {
    type SemesterResponse,
    type PageResponse,
    type SemesterListParams,
    type SemesterCreatePayload,
    type SemesterClassResponse,
} from "../types";
import { MOCK_SEMESTER_CLASSES } from "./mockData";

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
        await new Promise((resolve) => setTimeout(resolve, 500));
        return MOCK_SEMESTER_CLASSES;
    },

    closeSemester: async (
        semesterId: number,
    ): Promise<{ message: string }> => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return { message: "Đóng học kỳ thành công!" };
    },
};
