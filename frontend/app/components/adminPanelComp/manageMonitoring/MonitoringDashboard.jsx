// app/components/adminPanelComp/AdminDashboard.jsx
"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import {
    Activity,
    Users,
    GraduationCap,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Search,
} from "lucide-react";
import {
    fetchStudents,
    fetchEnrollments,
    fetchActivity,
    fetchCompletions,
} from "../../../store/admin/monitoring/monitoringThunks";
import { setPage, hydrateFromCache } from "../../../store/admin/monitoring/monitoringSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";

const POLL_INTERVAL_MS = 20000; // background silent refresh — no loader shown

const TABS = [
    { key: "students", label: "Students", icon: Users, thunk: fetchStudents },
    { key: "enrollments", label: "Enrollments", icon: GraduationCap, thunk: fetchEnrollments },
    { key: "activity", label: "Activity", icon: Activity, thunk: fetchActivity },
    { key: "completions", label: "Completions", icon: CheckCircle2, thunk: fetchCompletions },
];

function timeAgo(ts) {
    if (!ts) return "never";
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 5) return "just now";
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    return `${h}h ago`;
}

function StatusBadge({ status }) {
    const map = {
        completed: "bg-green-100 text-green-700 border-green-200",
        in_progress: "bg-amber-100 text-amber-700 border-amber-200",
        active: "bg-green-100 text-green-700 border-green-200",
        inactive: "bg-red-100 text-red-700 border-red-200",
    };
    const cls = map[status] || "bg-gray-100 text-gray-700 border-gray-200";
    return (
        <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${cls}`}>
            {status?.replace(/_/g, " ") || "—"}
        </span>
    );
}

function Pagination({ skip, limit, total, onChange }) {
    const page = Math.floor(skip / limit) + 1;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return (
        <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-4 py-3 sm:flex-row">
            <p className="text-xs text-muted sm:text-sm">
                Showing <span className="font-medium text-ink">{total === 0 ? 0 : skip + 1}</span>–
                <span className="font-medium text-ink">{Math.min(skip + limit, total)}</span> of{" "}
                <span className="font-medium text-ink">{total}</span>
            </p>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => onChange(Math.max(0, skip - limit))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-ink transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="min-w-[70px] text-center text-xs text-muted sm:text-sm">
                    Page {page} / {totalPages}
                </span>
                <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => onChange(skip + limit)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-ink transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

/* ---------------- Table configs per resource ---------------- */

const COLUMNS = {
    students: [
        { key: "full_name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "is_active", label: "Active", render: (v) => <StatusBadge status={v ? "active" : "inactive"} /> },
        { key: "is_verified", label: "Verified", render: (v) => (v ? "" : "") },
        { key: "enrolled_courses_count", label: "Enrolled" },
        { key: "completed_courses_count", label: "Completed" },
        { key: "created_at", label: "Joined", render: (v) => new Date(v).toLocaleDateString() },
    ],
    enrollments: [
        { key: "user_full_name", label: "Student" },
        { key: "user_email", label: "Email" },
        { key: "course_title", label: "Course" },
        { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
        { key: "progress_pct", label: "Progress", render: (v) => `${v}%` },
        { key: "started_at", label: "Started", render: (v) => new Date(v).toLocaleDateString() },
        {
            key: "completed_at",
            label: "Completed",
            render: (v) => (v ? new Date(v).toLocaleDateString() : "—"),
        },
    ],
    activity: [
        { key: "user_full_name", label: "Student" },
        { key: "user_email", label: "Email" },
        { key: "action", label: "Action" },
        { key: "details", label: "Details" },
        { key: "created_at", label: "When", render: (v) => (v ? new Date(v).toLocaleString() : "—") },
    ],
    completions: [
        { key: "user_full_name", label: "Student" },
        { key: "user_email", label: "Email" },
        { key: "lesson_title", label: "Lesson" },
        { key: "course_title", label: "Course" },
        { key: "completed_at", label: "Completed", render: (v) => new Date(v).toLocaleString() },
    ],
};

function ResourceTable({ resource, rows, query }) {
    const columns = COLUMNS[resource] || [];

    const filtered = useMemo(() => {
        if (!query) return rows;
        const q = query.toLowerCase();
        return rows.filter((row) =>
            Object.values(row).some((v) => String(v ?? "").toLowerCase().includes(q))
        );
    }, [rows, query]);

    if (filtered.length === 0) {
        return (
            <div className="flex min-h-[200px] items-center justify-center text-sm text-muted">
                No records found.
            </div>
        );
    }

    return (
        <>
            {/* Desktop / tablet: table */}
            <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[720px] text-left text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-muted">
                            {columns.map((c) => (
                                <th key={c.key} className="whitespace-nowrap px-4 py-3 font-medium">
                                    {c.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((row, idx) => (
                            <tr
                                key={row.id || idx}
                                className="border-b border-gray-50 transition hover:bg-gray-50/70"
                            >
                                {columns.map((c) => (
                                    <td key={c.key} className="whitespace-nowrap px-4 py-3 text-ink">
                                        {c.render ? c.render(row[c.key], row) : row[c.key] ?? "—"}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile: stacked cards */}
            <div className="divide-y divide-gray-100 md:hidden">
                {filtered.map((row, idx) => (
                    <div key={row.id || idx} className="space-y-1.5 p-4">
                        {columns.map((c) => (
                            <div key={c.key} className="flex items-start justify-between gap-3 text-sm">
                                <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-muted">
                                    {c.label}
                                </span>
                                <span className="text-right text-ink">
                                    {c.render ? c.render(row[c.key], row) : row[c.key] ?? "—"}
                                </span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
}

/* ---------------- Summary cards ---------------- */

function SummaryCards({ data }) {
    const cards = [
        { label: "Total Students", value: data.students.total, icon: Users, color: "bg-blue-50 text-blue-600" },
        {
            label: "Total Enrollments",
            value: data.enrollments.total,
            icon: GraduationCap,
            color: "bg-purple-50 text-purple-600",
        },
        {
            label: "Recent Activity",
            value: data.activity.total,
            icon: Activity,
            color: "bg-amber-50 text-amber-600",
        },
        {
            label: "Lesson Completions",
            value: data.completions.total,
            icon: CheckCircle2,
            color: "bg-green-50 text-green-600",
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {cards.map((c) => (
                <div
                    key={c.label}
                    className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${c.color}`}>
                        <c.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-xs text-muted">{c.label}</p>
                        <p className="text-xl font-bold text-ink sm:text-2xl">{c.value ?? 0}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ---------------- Main component ---------------- */

export default function MonitoringDashboard() {
    const dispatch = useAppDispatch();
    const monitoring = useAppSelector((s) => s.monitoring);
    const [activeTab, setActiveTab] = useState("students");
    const [query, setQuery] = useState("");
    const pollRef = useRef(null);

    const active = TABS.find((t) => t.key === activeTab);
    const activeState = monitoring[activeTab];

    const loadResource = useCallback(
        (tab, { skip, limit, silent } = {}) => {
            const s = monitoring[tab.key];
            dispatch(
                tab.thunk({
                    skip: skip ?? s.skip,
                    limit: limit ?? s.limit,
                    silent: !!silent,
                })
            );
        },
        [dispatch, monitoring]
    );

    // Hydrate from localStorage (in case another tab updated cache), then fetch fresh silently
    useEffect(() => {
        dispatch(hydrateFromCache());
        TABS.forEach((t) => loadResource(t, { silent: true }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Real-time background polling — no loader, just silent refresh + localStorage sync
    useEffect(() => {
        pollRef.current = setInterval(() => {
            loadResource(active, { silent: true });
        }, POLL_INTERVAL_MS);
        return () => clearInterval(pollRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    const handlePageChange = (skip) => {
        dispatch(setPage({ resource: activeTab, skip }));
        loadResource(active, { skip, silent: true });
    };

    const handleManualRefresh = () => {
        loadResource(active, { silent: true });
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-ink sm:text-3xl">Monitoring</h1>
                <p className="text-sm text-muted">
                    Live overview of students, enrollments, activity and lesson completions.
                </p>
            </div>

            <SummaryCards data={monitoring} />

            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                {/* Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-3 sm:p-4">
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {TABS.map((t) => (
                            <button
                                key={t.key}
                                type="button"
                                onClick={() => setActiveTab(t.key)}
                                className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition sm:text-sm ${activeTab === t.key
                                    ? "bg-[#365B50] text-white"
                                    : "bg-gray-50 text-ink hover:bg-gray-100"
                                    }`}
                            >
                                <t.icon className="h-4 w-4" />
                                {t.label}
                                <span
                                    className={`ml-1 rounded-full px-1.5 text-[10px] ${activeTab === t.key ? "bg-white/20" : "bg-gray-200"
                                        }`}
                                >
                                    {monitoring[t.key].total}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search..."
                                className="w-32 rounded-lg border border-gray-200 py-1.5 pl-8 pr-2 text-xs focus:border-[#365B50] focus:outline-none sm:w-48 sm:text-sm"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleManualRefresh}
                            title={`Last updated ${timeAgo(activeState.lastUpdated)}`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-ink transition hover:bg-gray-50"
                        >
                            <RefreshCw
                                className={`h-4 w-4 ${activeState.refreshing ? "animate-spin" : ""}`}
                            />
                        </button>
                    </div>
                </div>

                {/* Tiny non-blocking status line — not a loader */}
                <div className="flex items-center justify-between px-4 pt-3 text-[11px] text-muted">
                    <span className="flex items-center gap-1.5">
                        <span
                            className={`h-1.5 w-1.5 rounded-full ${activeState.refreshing ? "bg-amber-400" : "bg-green-400"
                                }`}
                        />
                        {activeState.refreshing ? "Syncing…" : `Updated ${timeAgo(activeState.lastUpdated)}`}
                    </span>
                    {activeState.error && <span className="text-red-500">{activeState.error}</span>}
                </div>

                <ResourceTable resource={activeTab} rows={activeState.items} query={query} />

                <Pagination
                    skip={activeState.skip}
                    limit={activeState.limit}
                    total={activeState.total}
                    onChange={handlePageChange}
                />
            </div>
        </div>
    );
}