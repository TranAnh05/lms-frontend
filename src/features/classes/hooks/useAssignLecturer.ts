/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { classService } from "../services/class.service";
import { type LecturerBasic } from "../types";

interface UseAssignLecturerProps {
    classId?: number;
    initialDepartmentId?: number;
    onSuccess: () => void;
}

export const useAssignLecturer = ({
    classId,
    initialDepartmentId,
    onSuccess,
}: UseAssignLecturerProps) => {
    const [selectedDepartmentId, setSelectedDepartmentId] =
        useState<string>("");
    const [selectedLecturerId, setSelectedLecturerId] = useState<string>("");
    const [lecturers, setLecturers] = useState<LecturerBasic[]>([]);
    const [isFetchingLecturers, setIsFetchingLecturers] =
        useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        if (initialDepartmentId) {
            setSelectedDepartmentId(initialDepartmentId.toString());
        } else {
            setSelectedDepartmentId("");
        }
        setSelectedLecturerId("");
    }, [initialDepartmentId, classId]);

    useEffect(() => {
        const fetchLecturersByDepartment = async () => {
            if (!selectedDepartmentId) {
                setLecturers([]);
                return;
            }

            setIsFetchingLecturers(true);
            try {
                const data = await classService.getLecturers(
                    Number(selectedDepartmentId),
                );
                setLecturers(data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách giảng viên:", error);
                toast.error(
                    "Không thể lấy danh sách giảng viên. Vui lòng thử lại.",
                );
                setLecturers([]);
            } finally {
                setIsFetchingLecturers(false);
            }
        };

        fetchLecturersByDepartment();
    }, [selectedDepartmentId]);

    const handleDepartmentChange = useCallback((departmentId: string) => {
        setSelectedDepartmentId(departmentId);
        setSelectedLecturerId("");
    }, []);

    const handleLecturerChange = useCallback((lecturerId: string) => {
        setSelectedLecturerId(lecturerId);
    }, []);

    const handleSubmitAssign = useCallback(async () => {
        if (!classId) {
            toast.error("Lỗi hệ thống: Không xác định được lớp học phần.");
            return;
        }

        if (!selectedLecturerId) {
            toast.warning("Vui lòng chọn một giảng viên để phân công.");
            return;
        }

        setIsSubmitting(true);
        try {
            await classService.assignLecturer({
                classId: classId,
                lecturerId: Number(selectedLecturerId),
            });

            toast.success("Đã phân công giảng viên thành công!");
            onSuccess();
        } catch (error) {
            console.error("Lỗi khi gán giảng viên:", error);
            toast.error("Đã xảy ra lỗi trong quá trình phân công.");
        } finally {
            setIsSubmitting(false);
        }
    }, [classId, selectedLecturerId, onSuccess]);

    const handleReset = useCallback(() => {
        setSelectedDepartmentId(initialDepartmentId?.toString() || "");
        setSelectedLecturerId("");
    }, [initialDepartmentId]);

    return {
        selectedDepartmentId,
        selectedLecturerId,
        lecturers,
        isFetchingLecturers,
        isSubmitting,
        handleDepartmentChange,
        handleLecturerChange,
        handleSubmitAssign,
        handleReset,
        isSubmitDisabled: !selectedLecturerId || isSubmitting,
    };
};
