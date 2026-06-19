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
            Object.entries(params).filter(
                ([, value]) =>
                    value !== undefined && value !== null && value !== "",
            ),
        );

        return apiClient.get<never, PageResponse<RegistrationPeriodResponse>>(
            "/registration-management/periods",
            { params: cleanParams },
        );
    },

    getSemesters: async (): Promise<SemesterResponse[]> => {
        return apiClient.get<never, SemesterResponse[]>("/semesters/all");
    },

    getDepartments: async (): Promise<DepartmentResponse[]> => {
        return apiClient.get<never, DepartmentResponse[]>("/departments");
    },

    getPendingClasses: async (
        semesterId: number,
        departmentIds: number[],
    ): Promise<ClassPendingResponse[]> => {
        const params = {
            semesterId,
            departmentId: departmentIds.join(","),
        };
        return apiClient.get<never, ClassPendingResponse[]>(
            "/registration-management/pending-classes",
            { params },
        );
    },

    createRegistrationPeriod: async (
        payload: CreateRegistrationPayload,
    ): Promise<void> => {
        return apiClient.post<never, void>(
            "/registration-periods/open",
            payload,
        );
    },

    getRegistrationPeriodDetail: async (
        id: number,
    ): Promise<RegistrationPeriodDetailResponse> => {
        return apiClient.get<never, RegistrationPeriodDetailResponse>(
            `/registration-management/periods/${id}`,
        );
    },

    closeRegistrationPeriod: async (id: number): Promise<void> => {
        return apiClient.put<never, void>(`/registration-periods/${id}/close`);
    },
};
