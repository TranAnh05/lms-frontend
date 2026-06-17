import apiClient from "@/services/apiClient";
import { type TranscriptResponseDto } from "../types";

export const gradeService = {
    getAcademicTranscript: async (): Promise<TranscriptResponseDto> => {
        const response = await apiClient.get<{ data?: TranscriptResponseDto }>(
            "/grades/my-transcript",
        );
        return (response.data || response) as TranscriptResponseDto;
    },
};
