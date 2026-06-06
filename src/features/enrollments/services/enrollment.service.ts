/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/services/apiClient";
import {
    type CourseWithClassesDTO,
    type RegisteredClassDTO,
    type RegisterClassPayload,
    type EnrollmentFilterParams,
} from "../types";

export const enrollmentService = {
    getAvailableCourses: async (
        params?: EnrollmentFilterParams
    ): Promise<CourseWithClassesDTO[]> => {
        const cleanParams = params
            ? Object.fromEntries(
                  Object.entries(params).filter(
                      ([v]) => v !== undefined && v !== null && v !== ""
                  )
              )
            : {};
            
        const response: any = await apiClient.get("/enrollments/available-courses", {
            params: cleanParams,
        });
        return response.data || response;
    },

    getRegisteredClasses: async (): Promise<RegisteredClassDTO[]> => {
        const response: any = await apiClient.get("/enrollments/me/classes");
        return response.data || response;
    },

    registerClass: async (payload: RegisterClassPayload): Promise<RegisteredClassDTO> => {
        const response: any = await apiClient.post("/enrollments/register", payload);
        return response.data || response;
    },

    cancelRegistration: async (enrollmentId: number): Promise<void> => {
        await apiClient.delete(`/enrollments/${enrollmentId}`);
    },
};