// app/components/adminPanelComp/manageResearch/researchComp/ResearchViewModal.jsx
"use client";

import { X, FileText, Calendar, User, CheckCircle, XCircle, Hash } from "lucide-react";
import StatusBadge from "./StatusBadge";

function InfoItem({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-2.5">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={2} />
            <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-muted">{label}</p>
                <p className="truncate text-sm font-semibold text-ink">{value || "—"}</p>
            </div>
        </div>
    );
}

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

export default function ResearchViewModal({ paper, onClose, onApprove, onReject }) {
    if (!paper) return null;

    const statusLower = (paper.status || "").toLowerCase();
    const displayStatus = toTitleCase(paper.status);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl2 border border-line bg-card shadow-card-lg animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-line-soft p-5 sm:p-6">
                    <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <StatusBadge status={displayStatus} />
                            <span className="text-xs font-bold uppercase tracking-wide text-muted">
                                {toTitleCase(paper.category)}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">{paper.title}</h3>
                        <p className="mt-1 text-sm text-muted">#{paper.publication_number}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-cream-2 hover:text-ink"
                    >
                        <X className="h-5 w-5" strokeWidth={2} />
                    </button>
                </div>

                {/* Body */}
                <div className="space-y-6 p-5 sm:p-6">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        <InfoItem icon={User} label="Author ID" value={paper.author_id} />
                        <InfoItem icon={Calendar} label="Submitted" value={formatDate(paper.submitted_at)} />
                        <InfoItem icon={Hash} label="Views / Downloads" value={`${paper.view_count ?? 0} / ${paper.download_count ?? 0}`} />
                    </div>

                    {paper.co_authors?.length > 0 && (
                        <div>
                            <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted">Co-Authors</p>
                            <p className="text-sm text-ink-2">{paper.co_authors.join(", ")}</p>
                        </div>
                    )}

                    {paper.keywords?.length > 0 && (
                        <div>
                            <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted">Keywords</p>
                            <div className="flex flex-wrap gap-1.5">
                                {paper.keywords.map((k) => (
                                    <span key={k} className="rounded-full bg-brand-soft/50 px-2.5 py-1 text-xs font-bold text-brand-deep">
                                        {k}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted">Abstract</p>
                        <p className="text-sm leading-relaxed text-ink-2">
                            {paper.abstract || "No abstract provided."}
                        </p>
                    </div>

                    {paper.review_notes && (
                        <div>
                            <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted">Review Notes</p>
                            <p className="text-sm leading-relaxed text-ink-2">{paper.review_notes}</p>
                        </div>
                    )}

                    {paper.file_url && (
                        <div>
                            <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted">File</p>
                            <a
                                href={paper.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-bold text-brand-deep hover:underline"
                            >
                                <FileText className="h-4 w-4" strokeWidth={2} />
                                View PDF
                            </a>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex flex-wrap gap-3 border-t border-line-soft p-5 sm:p-6">
                    {statusLower === "pending" && (
                        <>
                            <button
                                onClick={() => onApprove(paper)}
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
                            >
                                <CheckCircle className="h-4 w-4" strokeWidth={2.5} />
                                Approve
                            </button>
                            <button
                                onClick={() => onReject(paper)}
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-rose-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-rose-700"
                            >
                                <XCircle className="h-4 w-4" strokeWidth={2.5} />
                                Reject
                            </button>
                        </>
                    )}
                    <button
                        onClick={onClose}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-line bg-card px-6 py-2.5 text-sm font-bold text-ink-2 transition-colors hover:border-brand/40 hover:bg-brand-soft/30 hover:text-brand-deep"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div >
    );
}