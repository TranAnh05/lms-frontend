import {
    type ClassResponse,
    type ClassListParams,
    type PageResponse,
    type DepartmentBasic,
    type LecturerBasic,
    type AssignLecturerPayload,
} from "../types";
import { mockClasses, mockDepartments, mockLecturers } from "../data/mockData";

export const classService = {
    getClasses: async (
        params: ClassListParams,
    ): Promise<PageResponse<ClassResponse>> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let filteredData = [...mockClasses];

                if (params.keyword) {
                    const lowerKey = params.keyword.toLowerCase();
                    filteredData = filteredData.filter(
                        (cls) =>
                            cls.code.toLowerCase().includes(lowerKey) ||
                            cls.course.name.toLowerCase().includes(lowerKey),
                    );
                }

                if (params.semesterId) {
                    filteredData = filteredData.filter(
                        (cls) => cls.semester.id === Number(params.semesterId),
                    );
                }

                if (params.status) {
                    filteredData = filteredData.filter(
                        (cls) => cls.status === params.status,
                    );
                }

                const page = params.page || 0;
                const size = params.size || 10;
                const totalElements = filteredData.length;
                const totalPages = Math.ceil(totalElements / size);

                const start = page * size;
                const end = start + size;
                const paginatedContent = filteredData.slice(start, end);

                resolve({
                    content: paginatedContent,
                    totalElements,
                    totalPages,
                    size,
                    number: page,
                });
            }, 800);
        });
    },

    getClassById: async (id: number): Promise<ClassResponse> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const foundClass = mockClasses.find((cls) => cls.id === id);
                if (foundClass) {
                    resolve(foundClass);
                } else {
                    reject(new Error("Không tìm thấy lớp học phần"));
                }
            }, 500);
        });
    },

    getDepartments: async (): Promise<DepartmentBasic[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(mockDepartments);
            }, 300);
        });
    },

    getLecturers: async (departmentId?: number): Promise<LecturerBasic[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (departmentId) {
                    resolve(
                        mockLecturers.filter(
                            (lec) => lec.departmentId === departmentId,
                        ),
                    );
                } else {
                    resolve(mockLecturers);
                }
            }, 400);
        });
    },

    assignLecturer: async (payload: AssignLecturerPayload): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(
                    "Mock API - Đã gán giảng viên thành công:",
                    payload,
                );
                resolve();
            }, 800);
        });
    },
};
