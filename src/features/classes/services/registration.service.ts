import {
    type PageResponse,
    type ClassResponse,
    type ClassDetailResponse,
} from "../types";
import {
    type RegistrationPeriodResponse,
    type CreateRegistrationPayload,
    type CourseWithClasses,
} from "../types/registration.types";
import { mockRegistrationPeriods, mockClasses } from "../data/mockData";

const paginateData = <T>(
    data: T[],
    page: number,
    size: number,
): PageResponse<T> => {
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

export const registrationService = {
    getRegistrationPeriods: async (params: {
        keyword?: string;
        semesterId?: string;
        status?: string;
        page: number;
        size: number;
    }): Promise<PageResponse<RegistrationPeriodResponse>> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let filteredData = [...mockRegistrationPeriods];

                if (params.keyword) {
                    const lowerKey = params.keyword.toLowerCase();
                    filteredData = filteredData.filter((period) =>
                        period.name.toLowerCase().includes(lowerKey),
                    );
                }

                if (params.semesterId) {
                    filteredData = filteredData.filter(
                        (period) =>
                            period.semester.id === Number(params.semesterId),
                    );
                }

                if (params.status) {
                    filteredData = filteredData.filter(
                        (period) => period.status === params.status,
                    );
                }

                resolve(
                    paginateData(
                        filteredData,
                        params.page || 0,
                        params.size || 10,
                    ),
                );
            }, 600);
        });
    },

    getEligibleClassesForRegistration: async (
        semesterId: number,
        departmentIds: number[],
    ): Promise<CourseWithClasses[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const eligibleClasses = mockClasses.filter(
                    (cls) =>
                        cls.status === "PENDING" &&
                        cls.semester.id === semesterId &&
                        (departmentIds.length === 0 ||
                            departmentIds.includes(cls.course.departmentId)),
                );

                const groupedData: Record<number, CourseWithClasses> = {};

                eligibleClasses.forEach((cls) => {
                    const courseId = cls.course.id;
                    if (!groupedData[courseId]) {
                        groupedData[courseId] = {
                            course: cls.course,
                            classes: [],
                        };
                    }
                    groupedData[courseId].classes.push(cls as ClassResponse);
                });

                resolve(Object.values(groupedData));
            }, 800);
        });
    },

    createRegistrationPeriod: async (
        payload: CreateRegistrationPayload,
    ): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newPeriodId = mockRegistrationPeriods.length + 1;
                const newPeriod: RegistrationPeriodResponse = {
                    id: newPeriodId,
                    semester: {
                        id: payload.semesterId,
                        semesterCode: "HK_NEW",
                        academicYear: "2025-2026",
                    },
                    name: payload.name,
                    type: payload.type,
                    startTime: payload.startTime,
                    endTime: payload.endTime,
                    targetCohorts: payload.targetCohorts,
                    targetDepartments: payload.targetDepartments,
                    status: "ACTIVE",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };

                mockRegistrationPeriods.unshift(newPeriod);

                mockClasses.forEach((c) => {
                    if (
                        c.status === "PENDING" &&
                        c.semester.id === payload.semesterId &&
                        (payload.targetDepartments.length === 0 ||
                            payload.targetDepartments.includes(
                                c.course.departmentId,
                            ))
                    ) {
                        c.status = "REGISTRATION";
                    }
                });

                resolve();
            }, 1200);
        });
    },

    getRegistrationPeriodDetail: async (
        id: number,
    ): Promise<
        RegistrationPeriodResponse & { classes: ClassDetailResponse[] }
    > => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const period = mockRegistrationPeriods.find((p) => p.id === id);
                if (!period) {
                    reject(new Error("Không tìm thấy đợt đăng ký"));
                    return;
                }

                const periodClasses = mockClasses.filter(
                    (c) =>
                        (period.status === "ACTIVE" &&
                            c.status === "REGISTRATION") ||
                        (period.status === "CLOSED" &&
                            c.status === "ONGOING") ||
                        c.id === 3 ||
                        c.id === 4,
                );

                resolve({
                    ...period,
                    classes: periodClasses,
                });
            }, 600);
        });
    },

    closeRegistrationPeriod: async (id: number): Promise<void> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const period = mockRegistrationPeriods.find((p) => p.id === id);
                if (!period) {
                    reject(new Error("Không tìm thấy đợt đăng ký"));
                    return;
                }

                period.status = "CLOSED";
                period.endTime = new Date().toISOString();

                mockClasses.forEach((c) => {
                    if (c.status === "REGISTRATION") {
                        c.status = "ONGOING";
                    }
                });

                resolve();
            }, 800);
        });
    },
};
