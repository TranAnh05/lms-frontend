import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { classService } from "../services/class.service";
import { type DropdownResponseDto } from "../types";

interface UseAssignLecturerProps {
    classId?: number;
    onSuccess: () => void;
}

export const useAssignLecturer = ({ classId, onSuccess }: UseAssignLecturerProps) => {
    const [selectedLecturerId, setSelectedLecturerId] = useState<string>("");
    const [instructors, setInstructors] = useState<DropdownResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        const fetchInstructors = async () => {
            if (!classId) return;
            setIsLoading(true);
            try {
                const data = await classService.getInstructorsDropdown(classId);
                setInstructors(data);
            } catch {
                toast.error("Không thể tải danh sách giảng viên.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchInstructors();
    }, [classId]);

    const handleSubmitAssign = useCallback(async () => {
        if (!classId || !selectedLecturerId) return;

        setIsSubmitting(true);
        try {
            await classService.assignLecturer(classId, {
                lecturerId: Number(selectedLecturerId),
            });
            toast.success("Phân công giảng viên thành công!");
            onSuccess();
        } catch {
            toast.error("Lỗi khi phân công giảng viên.");
        } finally {
            setIsSubmitting(false);
        }
    }, [classId, selectedLecturerId, onSuccess]);

    return {
        selectedLecturerId,
        instructors,
        isLoading,
        isSubmitting,
        setSelectedLecturerId, // Export hàm này để Modal sử dụng
        handleSubmitAssign,
        isSubmitDisabled: !selectedLecturerId || isSubmitting,
    };
};