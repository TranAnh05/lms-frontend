/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/services/apiClient";
import { type TranscriptResponseDto } from "../types";

export const gradeService = {
    getAcademicTranscript: async (): Promise<TranscriptResponseDto> => {
        const response: any = await apiClient.get("/grades/my-transcript");
        return response.data || response;
    },
};