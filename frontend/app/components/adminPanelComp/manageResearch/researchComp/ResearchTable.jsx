// app/components/adminPanelComp/manageResearch/researchComp/ResearchTable.jsx
"use client";

import { useMemo, useState } from "react";
import { Search, ArrowUpDown, Eye, Trash2, FileText, CheckCircle, XCircle } from "lucide-react";
import StatusBadge from "./StatusBadge";
import TablePagination from "./TablePagination";

const COLUMNS = [
    { key: "title", label: "Paper Title", sortable: true },
    { key: "author", label: "Author", sortable: true },
    { key: "topic", label: "Topic", sortable: true },
    { key: "submissionDate", label: "Submitted", sortable: true },
    { key: "status", label: "Status", sortable: false },
];

export default function ResearchTable({ research, onView, onDelete, onApprove, onReject }) {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState({ key: "submissionDate", dir: "desc" });
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(6);

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        let list = !term
            ? research
            : research.filter(
                (r) =>
                    r.title.toLowerCase().includes(term) ||
                    r.author.toLowerCase().includes(term) ||
                    r.topic.toLowerCase().includes(term) ||
                    r.abstract.toLowerCase().includes(term)
            );

        list = [...list].sort((a, b) => {
            let av = a[sort.key];
            let bv = b[sort.key];
            if (sort.key === "submissionDate") {
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
    }, [research, search, sort]);

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
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            placeholder="Search papers..."
                            className="w-full rounded-full border border-line bg-cream-2/50 py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:border-brand/50 focus:outline-none focus:ring-4 focus:ring-brand/15 sm:w-56"
                        />
                    </div>
                    {/* Removed "New Paper" button */}
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
                        {pageItems.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted">
                                    No research papers match your search.
                                </td>
                            </tr>
                        ) : (
                            pageItems.map((paper) => (
                                <tr
                                    key={paper.id}
                                    className="border-b border-line-soft text-sm text-ink-2 last:border-b-0 hover:bg-cream-2/40"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-deep">
                                                <FileText className="h-4.5 w-4.5" strokeWidth={2} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate font-bold text-ink">{paper.title}</p>
                                                <p className="truncate text-xs text-muted">{paper.topic}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <p className="font-medium text-ink-2">{paper.author}</p>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <span className="rounded-full bg-brand-soft/50 px-2.5 py-1 text-xs font-bold text-brand-deep">
                                            {paper.topic}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3">{paper.submissionDate}</td>
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <StatusBadge status={paper.status} />
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            {/* View Only */}
                                            <button
                                                onClick={() => onView(paper)}
                                                title="View"
                                                className="flex h-8 w-8 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-brand-soft/60 hover:text-brand-deep"
                                            >
                                                <Eye className="h-4 w-4" strokeWidth={2} />
                                            </button>

                                            {/* Approve - Only for Pending */}
                                            {paper.status === "Pending" && (
                                                <button
                                                    onClick={() => onApprove(paper)}
                                                    title="Approve"
                                                    className="flex h-8 w-8 items-center justify-center rounded-full text-emerald-500 transition-colors hover:bg-emerald-50"
                                                >
                                                    <CheckCircle className="h-4 w-4" strokeWidth={2} />
                                                </button>
                                            )}

                                            {/* Reject - Only for Pending */}
                                            {paper.status === "Pending" && (
                                                <button
                                                    onClick={() => onReject(paper)}
                                                    title="Reject"
                                                    className="flex h-8 w-8 items-center justify-center rounded-full text-rose-500 transition-colors hover:bg-rose-50"
                                                >
                                                    <XCircle className="h-4 w-4" strokeWidth={2} />
                                                </button>
                                            )}

                                            {/* Delete - Always available */}
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