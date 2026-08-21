// app/components/userDashboardComp/userCoursesComp/StatusBadge.jsx
"use client";

const STYLES = {
    Publish: "bg-emerald-100 text-emerald-700",
    Draft: "bg-gray-100 text-gray-500",
    Archived: "bg-amber-100 text-amber-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Completed: "bg-emerald-100 text-emerald-700",
    "Not Started": "bg-gray-100 text-gray-500",
};

export default function StatusBadge({ status }) {
    const style = STYLES[status] || STYLES.Draft;
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${style}`}>
            {status}
        </span>
    );
}