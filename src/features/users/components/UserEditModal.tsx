/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const userData = await userService.getUserById(userId);
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
                    (r) => r === "INSTRUCTOR" || r === "HEAD_OF_DEPT",
                );
                const isStudent = userData.roles?.includes("STUDENT");

                if (isTeacher) {
                    const depts = await userService.getDepartments();
                    setDepartments(depts);
                }

                if (isStudent) {
                    const majorList = await userService.getMajorsDropdown();
                    setMajors(majorList);
                }
            } catch (error) {
                toast.error("Không thể tải thông tin người dùng.");
                onClose();
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [isOpen, userId, onClose]);

    const handleChange = (field: keyof UpdateUserPayload, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        setIsSubmitting(true);
        try {
            const payload = Object.fromEntries(
                Object.entries(formData).map(([k, v]) => [
                    k,
                    v === "" ? null : v,
                ]),
            );

            await userService.updateUser(userId, payload);
            toast.success("Cập nhật thông tin thành công!");
            onSuccess();
            onClose();
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi cập nhật.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const isTeacher = user?.roles?.some(
        (r) => r === "INSTRUCTOR" || r === "HEAD_OF_DEPT",
    );
    const isStudent = user?.roles?.includes("STUDENT");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Cập nhật hồ sơ
                        </h2>
                        {user && (
                            <p className="text-lg text-gray-500 mt-2">
                                {user.fullName}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 flex-1">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">
                            Đang tải dữ liệu...
                        </p>
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col flex-1 overflow-hidden"
                    >
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* --- THÔNG TIN CHUNG --- */}
                            <section>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                                    <UserIcon className="w-4 h-4" /> Thông tin
                                    cơ bản
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Số điện thoại
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.phone || ""}
                                            onChange={(e) =>
                                                handleChange(
                                                    "phone",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                            placeholder="Nhập số điện thoại"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Ngày sinh
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.birthday || ""}
                                            onChange={(e) =>
                                                handleChange(
                                                    "birthday",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Giới tính
                                        </label>
                                        <select
                                            value={formData.gender || ""}
                                            onChange={(e) =>
                                                handleChange(
                                                    "gender",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                        >
                                            <option value="">
                                                Chọn giới tính
                                            </option>
                                            <option value="MALE">Nam</option>
                                            <option value="FEMALE">Nữ</option>
                                            <option value="OTHER">Khác</option>
                                        </select>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Địa chỉ
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.address || ""}
                                            onChange={(e) =>
                                                handleChange(
                                                    "address",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                            placeholder="Nhập địa chỉ hiện tại"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* --- THÔNG TIN GIẢNG VIÊN --- */}
                            {isTeacher && (
                                <section className="pt-6 border-t border-gray-100">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-blue-500 mb-4 flex items-center gap-2">
                                        <Briefcase className="w-4 h-4" /> Dành
                                        cho Giảng viên
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Mã giảng viên
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    formData.employeeCode || ""
                                                }
                                                onChange={(e) =>
                                                    handleChange(
                                                        "employeeCode",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Khoa
                                            </label>
                                            <select
                                                value={
                                                    formData.departmentId || ""
                                                }
                                                onChange={(e) =>
                                                    handleChange(
                                                        "departmentId",
                                                        e.target.value
                                                            ? Number(
                                                                  e.target
                                                                      .value,
                                                              )
                                                            : null,
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                            >
                                                <option value="">
                                                    Chọn khoa trực thuộc
                                                </option>
                                                {departments.map((d) => (
                                                    <option
                                                        key={d.id}
                                                        value={d.id}
                                                    >
                                                        {d.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Học hàm
                                            </label>
                                            <select
                                                value={
                                                    formData.academicTitle || ""
                                                }
                                                onChange={(e) =>
                                                    handleChange(
                                                        "academicTitle",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                            >
                                                <option value="">
                                                    Chọn học hàm/học vị
                                                </option>
                                                <option value="ThS">
                                                    Thạc sĩ (ThS)
                                                </option>
                                                <option value="TS">
                                                    Tiến sĩ (TS)
                                                </option>
                                                <option value="PGS.TS">
                                                    Phó Giáo sư, Tiến sĩ
                                                    (PGS.TS)
                                                </option>
                                                <option value="GS.TS">
                                                    Giáo sư, Tiến sĩ (GS.TS)
                                                </option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Loại hợp đồng
                                            </label>
                                            <select
                                                value={
                                                    formData.isVisiting === null
                                                        ? ""
                                                        : String(
                                                              formData.isVisiting,
                                                          )
                                                }
                                                onChange={(e) =>
                                                    handleChange(
                                                        "isVisiting",
                                                        e.target.value === ""
                                                            ? null
                                                            : e.target.value ===
                                                                  "true",
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                            >
                                                <option value="">
                                                    Chọn loại
                                                </option>
                                                <option value="false">
                                                    Biên chế
                                                </option>
                                                <option value="true">
                                                    Thỉnh giảng
                                                </option>
                                            </select>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Chuyên môn giảng dạy
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    formData.specialization ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleChange(
                                                        "specialization",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                                placeholder="Ví dụ: Khoa học máy tính, Kỹ thuật phần mềm..."
                                            />
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* --- THÔNG TIN SINH VIÊN --- */}
                            {isStudent && (
                                <section className="pt-6 border-t border-gray-100">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-500 mb-4 flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4" />{" "}
                                        Dành cho Sinh viên
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Mã sinh viên
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    formData.studentCode || ""
                                                }
                                                onChange={(e) =>
                                                    handleChange(
                                                        "studentCode",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Khóa học
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.cohort || ""}
                                                onChange={(e) =>
                                                    handleChange(
                                                        "cohort",
                                                        e.target.value
                                                            ? Number(
                                                                  e.target
                                                                      .value,
                                                              )
                                                            : null,
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                                placeholder="Ví dụ: 15, 16..."
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Ngành học
                                            </label>
                                            <select
                                                value={formData.majorId || ""}
                                                onChange={(e) =>
                                                    handleChange(
                                                        "majorId",
                                                        e.target.value
                                                            ? Number(
                                                                  e.target
                                                                      .value,
                                                              )
                                                            : null,
                                                    )
                                                }
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                            >
                                                <option value="">
                                                    Chọn ngành học
                                                </option>
                                                {majors.map((m) => (
                                                    <option
                                                        key={m.id}
                                                        value={m.id}
                                                    >
                                                        {m.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </section>
                            )}
                        </div>

                        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                Lưu thay đổi
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
