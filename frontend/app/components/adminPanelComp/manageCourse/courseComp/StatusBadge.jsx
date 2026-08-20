// app/components/adminPanelComp/manageCourse/courseComp/StatusBadge.jsx
"use client";

const STYLES = {
    Publish: "bg-emerald-100 text-emerald-700",
    Draft: "bg-cream-2 text-ink-2",
    Archived: "bg-amber-100 text-amber-700",
};

export default function StatusBadge({ status }) {
    const style = STYLES[status] || STYLES.Draft;
    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${style}`}>
            {status}
        </span>
    );
}