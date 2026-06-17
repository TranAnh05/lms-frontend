import React, { useState, useEffect } from "react";
import {
    X,
    Loader2,
    User as UserIcon,
    Briefcase,
    GraduationCap,
    Save,
} from "lucide-react";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

import { userService } from "../services/user.service";
import {
    type User,
    type UpdateUserPayload,
    type Department,
    type DropdownOption,
} from "../types";

interface UserEditModalProps {
    userId: number | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const UserEditModal: React.FC<UserEditModalProps> = ({
    userId,
    isOpen,
    onClose,
    onSuccess,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    const [departments, setDepartments] = useState<Department[]>([]);
    const [majors, setMajors] = useState<DropdownOption[]>([]);

    const [formData, setFormData] = useState<UpdateUserPayload>({});

    useEffect(() => {
        if (!isOpen || !userId) return;

        // Su dung AbortController de chan loi cap nhat state khi component da unmount
        const abortController = new AbortController();

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const userData = await userService.getUserById(userId);
                if (abortController.signal.aborted) return;

                setUser(userData);
                setFormData({
                    phone: userData.phone || "",
                    birthday: userData.birthday || "",
                    gender: userData.gender || "",
                    address: userData.address || "",
                    employeeCode: userData.employeeCode || "",
                    departmentId: userData.departmentId || null,
                    academicTitle: userData.academicTitle || "",
                    specialization: userData.specialization || "",
                    isVisiting: userData.isVisiting ?? null,
                    studentCode: userData.studentCode || "",
                    cohort: userData.cohort || null,
                    majorId: userData.majorId || null,
                });

                const isTeacher = userData.roles?.some(
                    (r) => r === "INSTRUCTOR" || r === "HEAD_OF_DEPT"
                );
                const isStudent = userData.roles?.includes("STUDENT");

                // Goi API song song de toi uu thoi gian tai
                const promises: Promise<void>[] = [];

                if (isTeacher) {
                    promises.push(
                        userService.getDepartments(undefined, true).then(depts => {
                            if (!abortController.signal.aborted) setDepartments(depts);
                        })
                    );
                }
                if (isStudent) {
                    promises.push(
                        userService.getMajorsDropdown().then(majorList => {
                            if (!abortController.signal.aborted) setMajors(majorList);
                        })
                    );
                }

                await Promise.all(promises);

            } catch {
                if (!abortController.signal.aborted) {
                    toast.error("Không thể tải thông tin người dùng.");
                    onClose();
                }
            } finally {
                if (!abortController.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            abortController.abort();
            setUser(null);
            setFormData({});
        };
    }, [isOpen, userId, onClose]);

    // Dung Generic cho ham onChange de TypeScript tu dong map dung kieu du lieu
    const handleChange = <K extends keyof UpdateUserPayload>(
        field: K,
        value: UpdateUserPayload[K]
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        setIsSubmitting(true);
        try {
            // Loai bo cac chuoi rong de tranh luu rac vao DB
            const payload = Object.fromEntries(
                Object.entries(formData).map(([k, v]) => [
                    k,
                    v === "" ? null : v,
                ])
            );

            const response = await userService.updateUser(userId, payload);
            toast.success(response.message || "Cập nhật thông tin thành công!");
            onSuccess();
            onClose();
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message: string }>;
            toast.error(axiosError.response?.data?.message || "Đã xảy ra lỗi khi cập nhật.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const isTeacher = user?.roles?.some(
        (r) => r === "INSTRUCTOR" || r === "HEAD_OF_DEPT"
    );
    const isStudent = user?.roles?.includes("STUDENT");

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <div className="absolute inset-0" onClick={!isSubmitting ? onClose : undefined} />

            <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 z-10">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Cập nhật hồ sơ
                        </h2>
                        {user && (
                            <p className="text-sm font-medium text-gray-500 mt-1">
                                {user.fullName} <span className="text-gray-300 mx-1">|</span> {user.username}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 flex-1">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                        <p className="text-sm text-gray-500 font-medium animate-pulse">
                            Đang đồng bộ dữ liệu hồ sơ...
                        </p>
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col flex-1 overflow-hidden"
                    >
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                            <section>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                                    <UserIcon className="w-4 h-4" /> Thông tin cơ bản
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Số điện thoại
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.phone || ""}
                                            onChange={(e) => handleChange("phone", e.target.value)}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                                            placeholder="Nhập số điện thoại"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Ngày sinh
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.birthday || ""}
                                            onChange={(e) => handleChange("birthday", e.target.value)}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Giới tính
                                        </label>
                                        <select
                                            value={formData.gender || ""}
                                            onChange={(e) => handleChange("gender", e.target.value)}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                                        >
                                            <option value="">Chọn giới tính</option>
                                            <option value="MALE">Nam</option>
                                            <option value="FEMALE">Nữ</option>
                                            <option value="OTHER">Khác</option>
                                        </select>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Địa chỉ
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.address || ""}
                                            onChange={(e) => handleChange("address", e.target.value)}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                                            placeholder="Nhập địa chỉ hiện tại"
                                        />
                                    </div>
                                </div>
                            </section>

                            {isTeacher && (
                                <section className="pt-6 border-t border-gray-100">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-4 flex items-center gap-2">
                                        <Briefcase className="w-4 h-4" /> Dành cho Giảng viên
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Mã giảng viên
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.employeeCode || ""}
                                                onChange={(e) => handleChange("employeeCode", e.target.value)}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Khoa trực thuộc
                                            </label>
                                            <select
                                                value={formData.departmentId || ""}
                                                onChange={(e) => handleChange("departmentId", e.target.value ? Number(e.target.value) : null)}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                                            >
                                                <option value="">Chọn khoa</option>
                                                {departments.map((d) => (
                                                    <option key={d.id} value={d.id}>{d.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Học hàm / Học vị
                                            </label>
                                            <select
                                                value={formData.academicTitle || ""}
                                                onChange={(e) => handleChange("academicTitle", e.target.value)}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                                            >
                                                <option value="">Chọn học hàm/học vị</option>
                                                <option value="ThS">Thạc sĩ (ThS)</option>
                                                <option value="TS">Tiến sĩ (TS)</option>
                                                <option value="PGS.TS">Phó Giáo sư, Tiến sĩ (PGS.TS)</option>
                                                <option value="GS.TS">Giáo sư, Tiến sĩ (GS.TS)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Loại hợp đồng
                                            </label>
                                            <select
                                                value={formData.isVisiting === null ? "" : String(formData.isVisiting)}
                                                onChange={(e) => handleChange("isVisiting", e.target.value === "" ? null : e.target.value === "true")}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                                            >
                                                <option value="">Chọn loại</option>
                                                <option value="false">Biên chế</option>
                                                <option value="true">Thỉnh giảng</option>
                                            </select>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Chuyên môn giảng dạy
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.specialization || ""}
                                                onChange={(e) => handleChange("specialization", e.target.value)}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                                                placeholder="Ví dụ: Khoa học máy tính, Kỹ thuật phần mềm..."
                                            />
                                        </div>
                                    </div>
                                </section>
                            )}

                            {isStudent && (
                                <section className="pt-6 border-t border-gray-100">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-500 mb-4 flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4" /> Dành cho Sinh viên
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Mã sinh viên
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.studentCode || ""}
                                                onChange={(e) => handleChange("studentCode", e.target.value)}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Khóa học
                                            </label>
                                            <input
                                                type="number"
                                                min={0}
                                                value={formData.cohort || ""}
                                                onChange={(e) => handleChange("cohort", e.target.value ? Number(e.target.value) : null)}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                                                placeholder="Ví dụ: 15, 16..."
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Ngành học
                                            </label>
                                            <select
                                                value={formData.majorId || ""}
                                                onChange={(e) => handleChange("majorId", e.target.value ? Number(e.target.value) : null)}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                                            >
                                                <option value="">Chọn ngành học</option>
                                                {majors.map((m) => (
                                                    <option key={m.id} value={m.id}>{m.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </section>
                            )}
                        </div>

                        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-3 z-10">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-100 disabled:opacity-50"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm active:scale-[0.98]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Lưu thay đổi
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};