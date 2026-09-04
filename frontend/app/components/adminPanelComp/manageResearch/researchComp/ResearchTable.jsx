// app/components/adminPanelComp/manageResearch/researchComp/ResearchTable.jsx
"use client";

import { useMemo, useState } from "react";
import { Search, ArrowUpDown, Eye, Trash2, FileText, CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import StatusBadge from "./StatusBadge";

const COLUMNS = [
    { key: "title", label: "Paper Title", sortable: true },
    { key: "category", label: "Topic", sortable: true },
    { key: "submitted_at", label: "Submitted", sortable: true },
    { key: "status", label: "Status", sortable: false },
];

function formatDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
}

function toTitleCase(s) {
    if (!s) return "—";
    return s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ");
}

export default function ResearchTable({
    research,
    loading,
    error,
    skip,
    limit,
    hasMore,
    onNextPage,
    onPrevPage,
    onView,
    onDelete,
    onApprove,
    onReject,
}) {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState({ key: "submitted_at", dir: "desc" });

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        let list = !term
            ? research
            : research.filter(
                (r) =>
                    r.title?.toLowerCase().includes(term) ||
                    r.category?.toLowerCase().includes(term) ||
                    r.abstract?.toLowerCase().includes(term) ||
                    r.publication_number?.toLowerCase().includes(term)
            );

        list = [...list].sort((a, b) => {
            let av = a[sort.key];
            let bv = b[sort.key];
            if (sort.key === "submitted_at") {
                av = av ? new Date(av).getTime() : 0;
                bv = bv ? new Date(bv).getTime() : 0;
            } else if (typeof av === "string") {
                av = (av || "").toLowerCase();
                bv = (bv || "").toLowerCase();
            }
            if (av < bv) return sort.dir === "asc" ? -1 : 1;
            if (av > bv) return sort.dir === "asc" ? 1 : -1;
            return 0;
        });

        return list;
    }, [research, search, sort]);

    const toggleSort = (key) => {
        setSort((prev) =>
            prev.key === key
                ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
                : { key, dir: "asc" }
        );
    };

    return (
        <div className="rounded-xl2 border border-line bg-card p-4 shadow-card sm:p-6">
            {/* Header */}
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">Research Papers</h2>
                    <p className="text-sm text-muted">Manage student research paper submissions.</p>
                </div>
                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search papers..."
                            className="w-full rounded-full border border-line bg-cream-2/50 py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:border-[#365B50]/50 focus:outline-none focus:ring-4 focus:ring-[#365B50]/15 sm:w-56"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="-mx-4 overflow-x-auto sm:mx-0">
                <table className="w-full min-w-[820px] border-collapse text-left">
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
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-12 text-center text-sm text-muted">
                                    Loading research papers...
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-12 text-center text-sm text-rose-500">
                                    {error}
                                </td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-12 text-center text-sm text-muted">
                                    No research papers match your search.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((paper) => {
                                const statusLower = (paper.status || "").toLowerCase();
                                console.log('paper ===>', paper)
                                const displayStatus = toTitleCase(paper.status);
                                return (
                                    <tr
                                        key={paper.id}
                                        className="border-b border-line-soft text-sm text-ink-2 last:border-b-0 hover:bg-cream-2/40"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#47735B]/10 text-[#365B50]">
                                                    <FileText className="h-4.5 w-4.5" strokeWidth={2} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate font-bold text-ink">{paper.title || "Untitled"}</p>
                                                    <p className="truncate text-xs text-muted">{paper.publication_number}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <span className="rounded-full bg-[#365B50] px-2.5 py-1 text-xs font-bold text-white">
                                                {toTitleCase(paper.category)}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3">{formatDate(paper.submitted_at)}</td>
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <StatusBadge status={displayStatus} />
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => onView(paper)}
                                                    title="View"
                                                    className="flex h-8 w-8 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-brand-soft/60 hover:text-brand-deep"
                                                >
                                                    <Eye className="h-4 w-4" strokeWidth={2} />
                                                </button>

                                                {statusLower === "pending_review" && (
                                                    <button
                                                        onClick={() => onApprove(paper)}
                                                        title="Approve"
                                                        className="flex h-8 w-8 items-center justify-center rounded-full text-emerald-500 transition-colors hover:bg-emerald-50"
                                                    >
                                                        <CheckCircle className="h-4 w-4" strokeWidth={2} />
                                                    </button>
                                                )}

                                                {statusLower === "pending_review" && (
                                                    <button
                                                        onClick={() => onReject(paper)}
                                                        title="Reject"
                                                        className="flex h-8 w-8 items-center justify-center rounded-full text-rose-500 transition-colors hover:bg-rose-50"
                                                    >
                                                        <XCircle className="h-4 w-4" strokeWidth={2} />
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => onDelete(paper)}
                                                    title="Delete"
                                                    className="flex h-8 w-8 items-center justify-center rounded-full text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
                                                >
                                                    <Trash2 className="h-4 w-4" strokeWidth={2} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination — no total count from API, so simple Prev/Next based on skip/limit */}
            <div className="mt-5 flex items-center justify-between border-t border-line-soft pt-4">
                <p className="text-xs text-muted">
                    Showing {research.length === 0 ? 0 : skip + 1}–{skip + research.length}
                </p>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onPrevPage}
                        disabled={skip === 0 || loading}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-2 transition-colors hover:bg-cream-2 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                    </button>
                    <button
                        onClick={onNextPage}
                        disabled={!hasMore || loading}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-2 transition-colors hover:bg-cream-2 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ChevronRight className="h-4 w-4" strokeWidth={2} />
                    </button>
                </div>
            </div>
        </div>
    );
}