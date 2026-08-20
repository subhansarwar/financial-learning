// app/components/adminPanelComp/manageResearch/researchComp/StatusBadge.jsx
"use client";

export default function StatusBadge({ status }) {
    const configs = {
        Pending: {
            bg: "bg-amber-50",
            text: "text-amber-700",
            dot: "bg-amber-500",
        },
        Approved: {
            bg: "bg-emerald-50",
            text: "text-emerald-700",
            dot: "bg-emerald-500",
        },
        Rejected: {
            bg: "bg-rose-50",
            text: "text-rose-700",
            dot: "bg-rose-500",
        },
    };

    const config = configs[status] || configs.Pending;

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full ${config.bg} px-2.5 py-1 text-xs font-bold ${config.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
            {status}
        </span>
    );
}