import React, { useState, useRef, useEffect, useMemo } from "react";
import { UserCircle, ChevronDown, Search, Check, Loader2 } from "lucide-react";
import clsx from "clsx";
import { type LecturerBasic } from "../types";

interface LecturerSelectProps {
    lecturers: LecturerBasic[];
    value: string;
    onChange: (lecturerId: string) => void;
    isLoading?: boolean;
    disabled?: boolean;
    placeholder?: string;
}

export const LecturerSelect: React.FC<LecturerSelectProps> = ({
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
    const selectedLecturer = useMemo(() => {
        return lecturers.find((lec) => lec.id.toString() === value);
    }, [lecturers, value]);

    // Lọc danh sách giảng viên dựa trên từ khóa tìm kiếm
    const filteredLecturers = useMemo(() => {
        if (!searchQuery.trim()) return lecturers;

        const lowerQuery = searchQuery.toLowerCase();
        return lecturers.filter(
            (lec) =>
                lec.fullName.toLowerCase().includes(lowerQuery) ||
                lec.employeeCode.toLowerCase().includes(lowerQuery),
        );
    }, [lecturers, searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    // Focus vào ô search mỗi khi mở menu
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        } else {
            setSearchQuery("");
        }
    }, [isOpen]);

    const handleToggle = () => {
        if (!disabled && !isLoading) {
            setIsOpen(!isOpen);
        }
    };

    const handleSelect = (id: string) => {
        onChange(id);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={containerRef}>
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
                    <UserCircle
                        className={clsx(
                            "w-5 h-5 shrink-0",
                            selectedLecturer
                                ? "text-blue-600"
                                : "text-gray-400",
                        )}
                    />
                    <span
                        className={clsx(
                            "truncate text-sm",
                            !selectedLecturer && "text-gray-500",
                        )}
                    >
                        {isLoading ? (
                            "Đang tải dữ liệu..."
                        ) : selectedLecturer ? (
                            <span className="font-medium text-gray-900">
                                <span className="text-gray-500 font-normal mr-1">
                                    [{selectedLecturer.employeeCode}]
                                </span>
                                {selectedLecturer.academicTitle}.{" "}
                                {selectedLecturer.fullName}
                            </span>
                        ) : (
                            placeholder
                        )}
                    </span>
                </div>

                {isLoading ? (
                    <Loader2 className="w-4 h-4 text-gray-400 animate-spin shrink-0 ml-2" />
                ) : (
                    <ChevronDown
                        className={clsx(
                            "w-4 h-4 text-gray-500 shrink-0 ml-2 transition-transform duration-200",
                            isOpen && "rotate-180",
                        )}
                    />
                )}
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-2 border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
                                <Search className="w-4 h-4 text-gray-400" />
                            </div>
                            <input
                                ref={inputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Gõ tên hoặc mã giảng viên để tìm..."
                                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 text-sm text-gray-900 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    <ul className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                        {filteredLecturers.length === 0 ? (
                            <li className="px-4 py-8 text-sm text-center text-gray-500">
                                {searchQuery ? (
                                    <>
                                        Không tìm thấy giảng viên nào khớp với "
                                        <span className="font-medium text-gray-700">
                                            {searchQuery}
                                        </span>
                                        ".
                                    </>
                                ) : (
                                    "Chưa có dữ liệu giảng viên thuộc khoa này."
                                )}
                            </li>
                        ) : (
                            filteredLecturers.map((lec) => {
                                const isSelected = lec.id.toString() === value;

                                return (
                                    <li
                                        key={lec.id}
                                        onClick={() =>
                                            handleSelect(lec.id.toString())
                                        }
                                        className={clsx(
                                            "flex items-center justify-between px-3 py-2.5 mb-0.5 rounded-lg text-sm cursor-pointer transition-colors",
                                            isSelected
                                                ? "bg-blue-50 text-blue-700 font-medium"
                                                : "text-gray-700 hover:bg-gray-100",
                                        )}
                                    >
                                        <div className="flex flex-col">
                                            <span>
                                                {lec.academicTitle}.{" "}
                                                {lec.fullName}
                                            </span>
                                            <span
                                                className={clsx(
                                                    "text-xs mt-0.5",
                                                    isSelected
                                                        ? "text-blue-500"
                                                        : "text-gray-400",
                                                )}
                                            >
                                                Mã GV: {lec.employeeCode}
                                            </span>
                                        </div>

                                        {isSelected && (
                                            <Check className="w-4 h-4 text-blue-600 shrink-0" />
                                        )}
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};
