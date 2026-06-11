/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/services/apiClient";
import { type PageResponse } from "../types";
import {
    type RegistrationPeriodResponse,
    type CreateRegistrationPayload,
    type ClassPendingResponse,
    type SemesterResponse,
    type DepartmentResponse,
    type RegistrationPeriodDetailResponse,
} from "../types/registration.types";

export const registrationService = {
    getRegistrationPeriods: async (params: {
        keyword?: string;
        semesterId?: string;
        status?: string;
        page: number;
        size: number;
    }): Promise<PageResponse<RegistrationPeriodResponse>> => {
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([v]) => v !== undefined && v !== null && v !== "")
        );
        const response: any = await apiClient.get("/registration-management/periods", { params: cleanParams });
        return response.data || response;
    },

    getSemesters: async (): Promise<SemesterResponse[]> => {
        const response: any = await apiClient.get("/semesters/all");
        return response.data || response;
    },

    getDepartments: async (): Promise<DepartmentResponse[]> => {
        const response: any = await apiClient.get("/departments");
        return response.data || response;
    },

    getPendingClasses: async (
        semesterId: number,
        departmentIds: number[]
    ): Promise<ClassPendingResponse[]> => {
        const params = {
            semesterId,
            departmentId: departmentIds.join(","),
        };
        const response: any = await apiClient.get("/registration-management/pending-classes", { params });
        return response.data || response;
    },

    createRegistrationPeriod: async (payload: CreateRegistrationPayload): Promise<void> => {
        await apiClient.post("/registration-periods/open", payload);
    },

   getRegistrationPeriodDetail: async (
        id: number
    ): Promise<RegistrationPeriodDetailResponse> => {
        const response: any = await apiClient.get(`/registration-management/periods/${id}`);
        return response.data || response;
    },

    closeRegistrationPeriod: async (id: number): Promise<void> => {
        await apiClient.put(`/registration-periods/${id}/close`);
    },
};