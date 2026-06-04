import {
    type ClassRequestResponse,
    type ClassRequestListParams,
    type PageResponse,
    type ApproveAndCreateClassesPayload,
    type CreateClassRequestPayload,
} from "../types";
import { mockClassRequests } from "../data/mockData";

export const classRequestService = {
    getRequests: async (
        params: ClassRequestListParams,
    ): Promise<PageResponse<ClassRequestResponse>> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let filteredData = [...mockClassRequests];

                // Lọc theo từ khóa (Mã môn / Tên môn)
                if (params.keyword) {
                    const lowerKey = params.keyword.toLowerCase();
                    filteredData = filteredData.filter(
                        (req) =>
                            req.course.code.toLowerCase().includes(lowerKey) ||
                            req.course.name.toLowerCase().includes(lowerKey),
                    );
                }

                // Lọc theo Học kỳ
                if (params.semesterId) {
                    filteredData = filteredData.filter(
                        (req) => req.semester.id === Number(params.semesterId),
                    );
                }

                // Lọc theo Trạng thái
                if (params.status) {
                    filteredData = filteredData.filter(
                        (req) => req.status === params.status,
                    );
                }

                if (params.mockRequesterId) {
                    filteredData = filteredData.filter(
                        (req) =>
                            req.requester.id === Number(params.mockRequesterId),
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

    rejectRequest: async (requestId: number, reason: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(
                    `Mock API - Đã từ chối đề xuất ${requestId}. Lý do: ${reason}`,
                );
                resolve();
            }, 600);
        });
    },

    approveAndCreateClasses: async (
        payload: ApproveAndCreateClassesPayload,
    ): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`Mock API - Đã duyệt đề xuất ${payload.requestId}`);
                console.log(
                    "Danh sách lớp sẽ được insert vào bảng classes:",
                    payload.classes,
                );
                resolve();
            }, 1000);
        });
    },

    createRequest: async (
        payload: CreateClassRequestPayload,
    ): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log("Mock API - Trưởng khoa đã tạo đề xuất:", payload);
                resolve();
            }, 800);
        });
    },
};
