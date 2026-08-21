// app/components/userDashboardComp/userCoursesComp/TablePagination.jsx
"use client";

import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

const ROWS_OPTIONS = [6, 10, 20, 50];

function getPageList(page, totalPages) {
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = new Set([1, totalPages, page]);
    if (page > 1) pages.add(page - 1);
    if (page < totalPages) pages.add(page + 1);
    return Array.from(pages).sort((a, b) => a - b);
}

export default function TablePagination({ page, totalPages, onPageChange, rowsPerPage, onRowsPerPageChange }) {
    const pageList = getPageList(page, totalPages);

    return (
        <div className="flex flex-col-reverse items-center justify-between gap-4 px-1 pt-4 sm:flex-row">
            <div className="flex items-center gap-2 text-sm text-muted">
                <span>Show</span>
                <div className="relative">
                    <select
                        value={rowsPerPage}
                        onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
                        className="appearance-none rounded-full border border-line bg-card py-1.5 pl-3 pr-8 text-sm font-bold text-ink-2 focus:border-[#365B50]/50 focus:outline-none"
                    >
                        {ROWS_OPTIONS.map((n) => (
                            <option key={n} value={n}>
                                {n} rows
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                </div>
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-cream-2 disabled:opacity-30"
                >
                    <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
                </button>

                {pageList.map((p, idx) => {
                    const prev = pageList[idx - 1];
                    const showEllipsis = prev !== undefined && p - prev > 1;
                    return (
                        <span key={p} className="flex items-center">
                            {showEllipsis && <span className="px-1 text-sm text-muted">…</span>}
                            <button
                                onClick={() => onPageChange(p)}
                                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${p === page
                                        ? "bg-[#47735B] text-white"
                                        : "text-ink-2 hover:bg-cream-2"
                                    }`}
                            >
                                {p}
                            </button>
                        </span>
                    );
                })}

                <button
                    onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-cream-2 disabled:opacity-30"
                >
                    <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
}