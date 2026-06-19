import apiClient from "@/services/apiClient";

export interface NotificationResponse {
    id: number;
    title: string;
    message: string;
    departmentId: number;
    periodId: number;
    createdAt: string;
}

export const notificationService = {
    getMyNotifications: async (): Promise<NotificationResponse[]> => {
        const response = await apiClient.get("/notifications/my");
        return response.data || [];
    },
};
