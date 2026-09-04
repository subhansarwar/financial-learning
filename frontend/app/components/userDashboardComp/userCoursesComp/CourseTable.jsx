// app/components/userDashboardComp/userCoursesComp/CourseTable.jsx
"use client";

import { ArrowUpDown, BookOpen, Eye, Pencil, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import StatusBadge from "./StatusBadge";
import TablePagination from "./TablePagination";

const COLUMNS = [
    { key: "title", label: "Course Name", sortable: true },
    { key: "creationDate", label: "Created", sortable: true },
    { key: "topic", label: "Topic", sortable: false },
    { key: "level", label: "Level", sortable: false },
    { key: "status", label: "Status", sortable: false },
];

export default function CourseTable({
    courses,
    onCreateNew,
    onView,
    onEdit,
    onDelete,
    pagination,
    loading
}) {
    console.log("CourseTable rendering with courses:", courses);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState({ key: "creationDate", dir: "desc" });
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(6);

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        let list = !term
            ? courses
            : courses.filter(
                (c) =>
                    c.title.toLowerCase().includes(term) ||
                    c.category?.toLowerCase().includes(term) ||
                    c.instructor_name?.toLowerCase().includes(term)
            );

        list = [...list].sort((a, b) => {
            let av = a[sort.key];
            let bv = b[sort.key];
            if (sort.key === "creationDate") {
                av = new Date(av).getTime();
                bv = new Date(bv).getTime();
            } else if (typeof av === "string") {
                av = av.toLowerCase();
                bv = bv.toLowerCase();
            }
            if (av < bv) return sort.dir === "asc" ? -1 : 1;
            if (av > bv) return sort.dir === "asc" ? 1 : -1;
            return 0;
        });

        return list;
    }, [courses, search, sort]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
    const currentPage = Math.min(page, totalPages);
    const pageItems = filtered.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const toggleSort = (key) => {
        setSort((prev) =>
            prev.key === key
                ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
                : { key, dir: "asc" }
        );
        setPage(1);
    };
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        });
    };

    const getLevelColor = (level) => {
        const colors = {
            Beginner: "bg-green-100 text-green-700",
            Intermediate: "bg-yellow-100 text-yellow-700",
            Advanced: "bg-red-100 text-red-700",
        };
        return colors[level] || "bg-gray-100 text-gray-700";
    };

    if (loading) {
        return (
            <div className="rounded-2xl border border-line bg-white p-4 shadow-card sm:p-6">
                <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#72BB83]/20 border-t-[#72BB83]" />
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-line bg-white p-4 shadow-card sm:p-6">
            {/* Header */}
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                        All Courses
                    </h2>
                    <p className="text-sm text-muted">
                        View and manage all available courses.
                    </p>
                </div>
                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                        <input
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            placeholder="Search course..."
                            className="w-full rounded-full border border-line bg-cream-2/50 py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:border-[#365B50]/50 focus:outline-none focus:ring-4 focus:ring-[#365B50]/15 sm:w-56"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="-mx-4 overflow-x-auto sm:mx-0">
                <table className="w-full min-w-[800px] border-collapse text-left">
                    <thead>
                        <tr className="border-b border-line-soft text-xs font-bold uppercase tracking-wide text-muted">
                            {COLUMNS.map((col) => (
                                <th key={col.key} className="px-4 py-3">
                                    {col.sortable ? (
                                        <button
                                            onClick={() => toggleSort(col.key)}
                                            className="inline-flex items-center gap-1 hover:text-ink"
                                        >
                                            {col.label}
                                            <ArrowUpDown className="h-3 w-3" strokeWidth={2.5} />
                                        </button>
                                    ) : (
                                        col.label
                                    )}
                                </th>
                            ))}
                            <th className="px-4 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted">
                                    No courses found.
                                </td>
                            </tr>
                        ) : (
                            pageItems.map((course) => (
                                <tr
                                    key={course.id}
                                    className="border-b border-line-soft text-sm text-ink-2 last:border-b-0 hover:bg-cream-2/40"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                                                style={{ background: `${course.tone}22`, color: course.tone }}
                                            >
                                                <BookOpen className="h-4.5 w-4.5" strokeWidth={2} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate font-bold text-ink">{course.title}</p>
                                                <p className="truncate text-xs text-muted">
                                                    {course.instructor_name}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3">{formatDate(course.created_at)}</td>
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <span className="text-xs font-medium text-[#14301F]/70">
                                            {course.category}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getLevelColor(course.level)}`}>
                                            {course.level}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <StatusBadge status={course.status} />
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => onView(course)}
                                                title="View"
                                                className="flex h-8 w-8 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-[#365B50]/10 hover:text-[#365B50]"
                                            >
                                                <Eye className="h-4 w-4" strokeWidth={2} />
                                            </button>
                                            {/* <button
                                                onClick={() => onEdit(course)}
                                                title="Edit"
                                                className="flex h-8 w-8 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-[#365B50]/10 hover:text-[#365B50]"
                                            >
                                                <Pencil className="h-4 w-4" strokeWidth={2} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(course)}
                                                title="Delete"
                                                className="flex h-8 w-8 items-center justify-center rounded-full text-rose-500 transition-colors hover:bg-rose-50"
                                            >
                                                <Trash2 className="h-4 w-4" strokeWidth={2} />
                                            </button> */}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <TablePagination
                page={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(n) => {
                    setRowsPerPage(n);
                    setPage(1);
                }}
            />
        </div>
    );
}