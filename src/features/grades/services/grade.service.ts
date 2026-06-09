import apiClient from "@/services/apiClient";
import { MOCK_ACADEMIC_TRANSCRIPT } from "../data/mockdata";
import { type StudentAcademicTranscript } from "../types";

const networkDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const gradeService = {
    getAcademicTranscript: async (): Promise<StudentAcademicTranscript> => {
        await networkDelay(800); 
        
        /*
        const response = await apiClient.get("/students/me/transcript");
        return (response as any).data;
        */

        return MOCK_ACADEMIC_TRANSCRIPT;
    },
};