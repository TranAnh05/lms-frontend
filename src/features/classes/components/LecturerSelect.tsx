import React, { useState, useRef, useEffect, useMemo, memo } from "react";
import { UserCircle, ChevronDown, Search, Check, Loader2 } from "lucide-react";
import clsx from "clsx";

interface LecturerOption {
    id: number | string;
    fullName?: string;
    name?: string;
    employeeCode?: string;
    academicTitle?: string;
}

interface LecturerSelectProps {
    lecturers: LecturerOption[];
    value: string;
    onChange: (lecturerId: string) => void;
    isLoading?: boolean;
    disabled?: boolean;
    placeholder?: string;
}

export const LecturerSelect: React.FC<LecturerSelectProps> = memo(({
    lecturers,
    value,
    onChange,
    isLoading = false,
    disabled = false,
    placeholder = "Chọn giảng viên phụ trách...",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Tìm kiếm giảng viên được chọn dựa trên mảng tĩnh đầu vào
    const selectedLecturer = useMemo(() => {
        const targetId = value.toString();
        return lecturers.find((lec) => lec.id.toString() === targetId);
    }, [lecturers, value]);

    // Lọc danh sách giảng viên theo chuỗi tìm kiếm đầu vào
    const filteredLecturers = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return lecturers;
        
        return lecturers.filter((lec) => {
            const nameMatch = (lec.fullName || lec.name || "").toLowerCase().includes(q);
            const codeMatch = lec.employeeCode ? lec.employeeCode.toLowerCase().includes(q) : false;
            return nameMatch || codeMatch;
        });
    }, [lecturers, searchQuery]);

    // Đăng ký sự kiện click chuột bên ngoài và phím Escape để đóng dropdown nhanh
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    // Tự động focus ô input khi dropdown mở hoặc clear dữ liệu cũ khi đóng
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        } else {
            setSearchQuery("");
        }
    }, [isOpen]);

    const handleToggle = () => {
        if (!disabled && !isLoading) setIsOpen((prev) => !prev);
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            {/* Thanh hiển thị trạng thái nút kích hoạt */}
            <button
                type="button"
                onClick={handleToggle}
                disabled={disabled || isLoading}
                className={clsx(
                    "flex items-center justify-between w-full px-3 py-2.5 bg-white border text-left rounded-lg outline-none transition-all",
                    disabled || isLoading
                        ? "bg-gray-50 border-gray-200 cursor-not-allowed opacity-70"
                        : "border-gray-300 cursor-pointer hover:bg-gray-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                    isOpen && "ring-2 ring-blue-500/20 border-blue-500",
                )}
            >
                <div className="flex items-center gap-2 truncate">
                    <UserCircle className={clsx("w-5 h-5 shrink-0", selectedLecturer ? "text-blue-600" : "text-gray-400")} />
                    <span className={clsx("truncate text-sm", !selectedLecturer && "text-gray-500")}>
                        {isLoading ? "Đang tải dữ liệu..." : (selectedLecturer ? (
                            <span className="font-medium text-gray-900">
                                {selectedLecturer.academicTitle ? `${selectedLecturer.academicTitle}. ` : ""}
                                {selectedLecturer.fullName || selectedLecturer.name}
                            </span>
                        ) : placeholder)}
                    </span>
                </div>
                {isLoading ? (
                    <Loader2 className="w-4 h-4 text-gray-400 animate-spin shrink-0 ml-2" />
                ) : (
                    <ChevronDown className={clsx("w-4 h-4 text-gray-500 transition-transform", isOpen && "rotate-180")} />
                )}
            </button>

            {/* Menu danh sách kết quả tìm kiếm đổ xuống */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-2 border-b border-gray-100 bg-gray-50/50">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tìm kiếm giảng viên..."
                                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 text-sm rounded-lg outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <ul className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                        {filteredLecturers.length === 0 ? (
                            <li className="px-4 py-6 text-sm text-center text-gray-500">Không tìm thấy giảng viên</li>
                        ) : (
                            filteredLecturers.map((lec) => {
                                const isSelected = lec.id.toString() === value.toString();
                                return (
                                    <li
                                        key={lec.id}
                                        onClick={() => { onChange(lec.id.toString()); setIsOpen(false); }}
                                        className={clsx(
                                            "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-colors",
                                            isSelected ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-100",
                                        )}
                                    >
                                        <div className="flex flex-col">
                                            <span>
                                                {lec.academicTitle ? `${lec.academicTitle}. ` : ""}
                                                {lec.fullName || lec.name}
                                            </span>
                                            {lec.employeeCode && (
                                                <span className={clsx("text-xs mt-0.5", isSelected ? "text-blue-500" : "text-gray-400")}>
                                                    Mã GV: {lec.employeeCode}
                                                </span>
                                            )}
                                        </div>
                                        {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
});

LecturerSelect.displayName = "LecturerSelect";