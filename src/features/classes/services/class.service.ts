import {
    type ClassResponse,
    type ClassListParams,
    type PageResponse,
    type DepartmentBasic,
    type LecturerBasic,
    type AssignLecturerPayload,
} from "../types";
import { mockClasses, mockDepartments, mockLecturers } from "../data/mockData";

const applyCommonFilters = (data: ClassResponse[], params: ClassListParams) => {
    let filteredData = [...data];

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

    return filteredData;
};

const paginateData = (
    data: ClassResponse[],
    page: number,
    size: number,
): PageResponse<ClassResponse> => {
    const totalElements = data.length;
    const totalPages = Math.ceil(totalElements / size);
    const start = page * size;
    const end = start + size;
    const paginatedContent = data.slice(start, end);

    return {
        content: paginatedContent,
        totalElements,
        totalPages,
        size,
        number: page,
    };
};

export const classService = {
    getAllClasses: async (
        params: ClassListParams & { departmentId?: string },
    ): Promise<PageResponse<ClassResponse>> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let filteredData = applyCommonFilters(mockClasses, params);
                if (params.departmentId) {
                    filteredData = filteredData.filter(
                        (cls) =>
                            cls.course.departmentId ===
                            Number(params.departmentId),
                    );
                }

                resolve(
                    paginateData(
                        filteredData,
                        params.page || 0,
                        params.size || 10,
                    ),
                );
            }, 800);
        });
    },

    getClassesByMyDepartment: async (
        params: ClassListParams,
        mockDepartmentId: number,
    ): Promise<PageResponse<ClassResponse>> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let filteredData = applyCommonFilters(mockClasses, params);
                filteredData = filteredData.filter(
                    (cls) => cls.course.departmentId === mockDepartmentId,
                );

                resolve(
                    paginateData(
                        filteredData,
                        params.page || 0,
                        params.size || 10,
                    ),
                );
            }, 800);
        });
    },

    getMyTeachingClasses: async (
        params: ClassListParams,
        mockLecturerId: number,
    ): Promise<PageResponse<ClassResponse>> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let filteredData = applyCommonFilters(mockClasses, params);
                filteredData = filteredData.filter(
                    (cls) => cls.lecturer?.id === mockLecturerId,
                );

                resolve(
                    paginateData(
                        filteredData,
                        params.page || 0,
                        params.size || 10,
                    ),
                );
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
