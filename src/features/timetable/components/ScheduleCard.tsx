import React, { useCallback } from "react";
import clsx from "clsx";
import { type ScheduleItem, type TimetableRole } from "../types";

interface ScheduleCardProps {
    item: ScheduleItem;
    role: TimetableRole;
    onClick?: (item: ScheduleItem) => void;
}

// Dung React.memo de ngan re-render toan bo cac o lich khi chi co mot o duy nhat thay doi hoac thay doi luong loading tu cha
export const ScheduleCard: React.FC<ScheduleCardProps> = React.memo(
    ({ item, role, onClick }) => {
        // Khai bao ham rieng biet de on dinh con tro vung nho, tranh khoi tao lai function an danh o phan JSX
        const handleCardClick = useCallback(() => {
            if (onClick) {
                onClick(item);
            }
        }, [item, onClick]);

        // Phong ve nghiep vu phong truong hop du lieu gio tu API bi null/undefined khong lam sap ung dung client
        const formattedStart = item.startTime ? item.startTime.slice(0, 5) : "";
        const formattedEnd = item.endTime ? item.endTime.slice(0, 5) : "";
        const isClickable = typeof onClick === "function";

        return (
            <div
                onClick={handleCardClick}
                // Bo sung thuoc tinh ho tro tiep can (A11y) theo chuan doanh nghiep khi dung div lam nut bam
                role={isClickable ? "button" : undefined}
                tabIndex={isClickable ? 0 : undefined}
                onKeyDown={
                    isClickable
                        ? (e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  handleCardClick();
                              }
                          }
                        : undefined
                }
                className={clsx(
                    "h-full w-full p-3 rounded-xl border flex flex-col transition-all duration-200 select-none",
                    "bg-blue-50/40 border-blue-100 hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm",
                    isClickable
                        ? "cursor-pointer active:scale-[0.98]"
                        : "cursor-default",
                )}
            >
                <h4
                    className="text-xs font-bold text-gray-900 line-clamp-2"
                    title={item.courseName}
                >
                    {item.courseName}
                </h4>

                <div className="flex flex-col gap-1 mt-3 text-[11px] text-gray-600">
                    <div className="truncate" title={item.classCode}>
                        <span className="text-gray-500">Mã lớp: </span>
                        <span className="font-semibold text-gray-800">
                            {item.classCode}
                        </span>
                    </div>

                    <div className="truncate" title={item.roomName}>
                        <span className="text-gray-500">Phòng: </span>
                        <span className="font-semibold text-gray-800">
                            {item.roomName}
                        </span>
                    </div>

                    {(formattedStart || formattedEnd) && (
                        <div
                            className="truncate"
                            title={`${item.startTime} - ${item.endTime}`}
                        >
                            <span className="text-gray-500">Giờ học: </span>
                            <span className="font-semibold text-gray-800">
                                {formattedStart} - {formattedEnd}
                            </span>
                        </div>
                    )}

                    {role === "STUDENT" && item.lecturerName && (
                        <div className="truncate" title={item.lecturerName}>
                            <span className="text-gray-500">GV: </span>
                            <span className="font-semibold text-gray-800">
                                {item.lecturerName}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    },
);

ScheduleCard.displayName = "ScheduleCard";
