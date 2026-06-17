import React, { useRef, useState, useEffect, useCallback, memo } from "react";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { profileService } from "../services/profile.service";

interface AvatarUploaderProps {
    currentAvatarUrl?: string;
    fullName?: string;
    onUploadSuccess: (newUrl: string) => void;
}

// Chuyển hàm xử lý chuỗi ra ngoài tránh tái khởi tạo khi re-render
const getInitials = (name?: string): string => {
    if (!name?.trim()) return "U";
    return name.trim().charAt(0).toUpperCase();
};

export const AvatarUploader: React.FC<AvatarUploaderProps> = memo(
    ({ currentAvatarUrl, fullName, onUploadSuccess }) => {
        const [isUploading, setIsUploading] = useState(false);
        const fileInputRef = useRef<HTMLInputElement>(null);
        const isMounted = useRef(true);

        // Quản lý vòng đời mount để kiểm soát an toàn luồng dữ liệu bất đồng bộ
        useEffect(() => {
            isMounted.current = true;
            return () => {
                isMounted.current = false;
            };
        }, []);

        // Gom nhóm hành động kích hoạt hộp thoại chọn file thiết bị
        const triggerFileInput = useCallback(() => {
            if (!isUploading) {
                fileInputRef.current?.click();
            }
        }, [isUploading]);

        // Xử lý tải lên và kiểm định nghiêm ngặt tệp tin đầu vào
        const handleFileChange = async (
            e: React.ChangeEvent<HTMLInputElement>,
        ) => {
            const file = e.target.files?.[0];
            if (!file) return;

            // Kiểm tra định dạng tệp tin hợp lệ
            const validTypes = ["image/jpeg", "image/png", "image/jpg"];
            if (!validTypes.includes(file.type)) {
                toast.error("Vui lòng chọn ảnh định dạng JPG hoặc PNG.");
                return;
            }

            // Giới hạn dung lượng tệp tin tối đa 5MB
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                toast.error("Dung lượng ảnh không được vượt quá 5MB.");
                return;
            }

            setIsUploading(true);
            try {
                const newAvatarUrl = await profileService.updateAvatar(file);
                if (isMounted.current) {
                    onUploadSuccess(newAvatarUrl);
                    toast.success("Cập nhật ảnh đại diện thành công!");
                }
            } catch {
                if (isMounted.current) {
                    toast.error(
                        "Không thể cập nhật ảnh đại diện. Vui lòng thử lại.",
                    );
                }
            } finally {
                if (isMounted.current) {
                    setIsUploading(false);
                    if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                    }
                }
            }
        };

        return (
            <div className="relative inline-block">
                {/* Khung chứa ảnh hoặc ký tự đại diện */}
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-50 flex items-center justify-center relative group">
                    {currentAvatarUrl ? (
                        <img
                            src={currentAvatarUrl}
                            alt={
                                fullName
                                    ? `Ảnh đại diện của ${fullName}`
                                    : "Avatar"
                            }
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-4xl font-bold select-none">
                            {getInitials(fullName)}
                        </div>
                    )}

                    {/* Lớp phủ hiển thị trạng thái đang xử lý tải ảnh lên */}
                    {isUploading && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm z-10">
                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                        </div>
                    )}

                    {/* Vùng tương tác nhanh bằng chuột khi di chuyển vào ảnh */}
                    <div
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={triggerFileInput}
                    >
                        <Camera className="w-8 h-8 text-white/80" />
                    </div>
                </div>

                {/* Nút hành động nổi độc lập hỗ trợ thiết bị di động */}
                <button
                    type="button"
                    onClick={triggerFileInput}
                    disabled={isUploading}
                    className="absolute bottom-1 right-1 p-2.5 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50"
                >
                    <Camera className="w-4 h-4" />
                </button>

                {/* Thẻ input ẩn phục vụ việc tương tác với hệ thống tệp tin */}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/jpeg, image/png, image/jpg"
                    onChange={handleFileChange}
                />
            </div>
        );
    },
);

AvatarUploader.displayName = "AvatarUploader";
