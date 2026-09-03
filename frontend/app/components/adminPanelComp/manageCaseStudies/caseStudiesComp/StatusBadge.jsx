// app/components/adminPanelComp/manageCaseStudies/caseStudiesComp/StatusBadge.jsx
"use client";

const STYLES = {
    true: "bg-emerald-100 text-emerald-700",
    false: "bg-gray-100 text-gray-600",
    Published: "bg-emerald-100 text-emerald-700",
    Draft: "bg-gray-100 text-gray-600",
    Archived: "bg-amber-100 text-amber-700",
};

const STATUS_MAP = {
    true: "Published",
    false: "Draft",
    Published: "Published",
    Draft: "Draft",
    Archived: "Archived",
};

export default function StatusBadge({ status }) {
    const statusKey = typeof status === 'boolean' ? String(status) : status;
    const statusText = STATUS_MAP[statusKey] || "Draft";
    const style = STYLES[statusText] || STYLES.Draft;

    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${style}`}>
            {statusText}
        </span>
    );
}