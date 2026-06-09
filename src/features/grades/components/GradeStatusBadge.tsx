import React from "react";
import clsx from "clsx";
import { type SubjectGradeStatus } from "../types";

interface GradeStatusBadgeProps {
    status: SubjectGradeStatus;
}

const STATUS_CONFIG: Record<SubjectGradeStatus, { label: string; className: string }> = {
    PASS: { label: "Qua môn", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    FAIL: { label: "Học lại", className: "bg-rose-50 text-rose-700 border-rose-200" },
    PENDING: { label: "Chưa có điểm", className: "bg-gray-50 text-gray-600 border-gray-200" },
};

export const GradeStatusBadge: React.FC<GradeStatusBadgeProps> = ({ status }) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;

    return (
        <span className={clsx("px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide border whitespace-nowrap", config.className)}>
            {config.label}
        </span>
    );
};