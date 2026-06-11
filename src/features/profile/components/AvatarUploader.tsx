import React, { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { profileService } from "../services/profile.service";

interface AvatarUploaderProps {
    currentAvatarUrl?: string;
    fullName?: string;
    onUploadSuccess: (newUrl: string) => void;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
    currentAvatarUrl,
    fullName,
    onUploadSuccess,
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getInitials = (name?: string) => {
        if (!name) return "U";
        return name.charAt(0).toUpperCase();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!validTypes.includes(file.type)) {
            toast.error("Vui lòng chọn ảnh định dạng JPG hoặc PNG.");
            return;
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error("Dung lượng ảnh không được vượt quá 5MB.");
            return;
        }

        setIsUploading(true);
        try {
            const newAvatarUrl = await profileService.updateAvatar(file);
            onUploadSuccess(newAvatarUrl);
            toast.success("Cập nhật ảnh đại diện thành công!");
        } catch (error) {
            toast.error("Không thể cập nhật ảnh đại diện. Vui lòng thử lại.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-50 flex items-center justify-center relative group">
                {currentAvatarUrl ? (
                    <img
                        src={currentAvatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-4xl font-bold">
                        {getInitials(fullName)}
                    </div>
                )}

                {isUploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm z-10">
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                )}

                <div 
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                >
                    <Camera className="w-8 h-8 text-white/80" />
                </div>
            </div>

            <button
                type="button"
                onClick={() => !isUploading && fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-1 right-1 p-2.5 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50"
            >
                <Camera className="w-4 h-4" />
            </button>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/jpeg, image/png, image/jpg"
                onChange={handleFileChange}
            />
        </div>
    );
};