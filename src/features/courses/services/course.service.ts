import apiClient from "@/services/apiClient";
import {
    type Course,
    type CourseFilterParams,
    type CourseProposalFilterParams,
    type CourseProposalPayload,
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
        payload: CourseProposalPayload,
    ): Promise<Course> => {
        return (await apiClient.post("/courses", payload)) as Course;
    },
};
