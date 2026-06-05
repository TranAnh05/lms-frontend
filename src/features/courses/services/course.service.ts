import apiClient from "@/services/apiClient";
import {
    type Course,
    type CourseApprovePayload,
    type CourseFilterParams,
    type CourseProposalFilterParams,
    type CourseRejectPayload,
    type CreateCourseProposalPayload,
    type Department,
    type PageResponse,
} from "../types";

export const courseService = {
    getCourses: async (
        params: CourseFilterParams,
    ): Promise<PageResponse<Course>> => {
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(
                ([value]) => value !== null && value !== "",
            ),
        );

        return (await apiClient.get("/courses", {
            params: cleanParams,
        })) as PageResponse<Course>;
    },

    getApprovalCourses: async (
        params: CourseFilterParams,
    ): Promise<PageResponse<Course>> => {
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(
                ([value]) => value !== null && value !== "",
            ),
        );

        return (await apiClient.get("/courses/approved", {
            params: cleanParams,
        })) as PageResponse<Course>;
    },

    getCourseById: async (id: number): Promise<Course> => {
        return (await apiClient.get(`/courses/${id}`)) as Course;
    },

    getCourseProposals: async (
        params: CourseProposalFilterParams,
    ): Promise<PageResponse<Course>> => {
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(
                ([value]) => value !== null && value !== "",
            ),
        );

        return (await apiClient.get("/courses", {
            params: cleanParams,
        })) as PageResponse<Course>;
    },

    createCourseProposal: async (
        payload: CreateCourseProposalPayload,
    ): Promise<Course> => {
        return (await apiClient.post("/courses/propose", payload)) as Course;
    },

    getDepartments: async (): Promise<Department[]> => {
        return (await apiClient.get("/departments", {
            params: { isActive: true },
        })) as Department[];
    },
    
    approveCourse: async (payload: CourseApprovePayload): Promise<Course> => {
        return (await apiClient.post("/courses/approve", payload)) as Course;
    },

    rejectCourse: async (payload: CourseRejectPayload): Promise<Course> => {
        return (await apiClient.post("/courses/reject", payload)) as Course;
    },
};
