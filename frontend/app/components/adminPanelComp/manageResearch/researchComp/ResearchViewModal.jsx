// app/components/adminPanelComp/manageResearch/researchComp/ResearchViewModal.jsx
"use client";

import { X, Mail, FileText, Calendar, User, CheckCircle, XCircle } from "lucide-react";
import StatusBadge from "./StatusBadge";

function InfoItem({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-2.5">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={2} />
            <div>
                <p className="text-xs font-bold uppercase tracking-wide text-muted">{label}</p>
                <p className="text-sm font-semibold text-ink">{value || "—"}</p>
            </div>
        </div>
    );
}

export default function ResearchViewModal({ paper, onClose, onApprove, onReject }) {
    if (!paper) return null;

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
                    <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <StatusBadge status={paper.status} />
                            <span className="text-xs font-bold uppercase tracking-wide text-muted">
                                {paper.topic}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">{paper.title}</h3>
                        <p className="mt-1 text-sm text-muted">by {paper.author}</p>
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
                        <InfoItem icon={User} label="Author" value={paper.author} />
                        <InfoItem icon={Mail} label="Email" value={paper.email} />
                        <InfoItem icon={Calendar} label="Submitted" value={paper.submissionDate} />
                    </div>

                    <div>
                        <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted">Abstract</p>
                        <p className="text-sm leading-relaxed text-ink-2">
                            {paper.abstract || "No abstract provided."}
                        </p>
                    </div>

                    <div>
                        <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted">File</p>
                        <a
                            href={paper.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-bold text-brand-deep hover:underline"
                        >
                            <FileText className="h-4 w-4" strokeWidth={2} />
                            View PDF
                        </a>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex flex-wrap gap-3 border-t border-line-soft p-5 sm:p-6">
                    {paper.status === "Pending" && (
                        <>
                            <button
                                onClick={() => { onApprove(paper); onClose(); }}
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
                            >
                                <CheckCircle className="h-4 w-4" strokeWidth={2.5} />
                                Approve
                            </button>
                            <button
                                onClick={() => { onReject(paper); onClose(); }}
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-rose-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-rose-700"
                            >
                                <XCircle className="h-4 w-4" strokeWidth={2.5} />
                                Reject
                            </button>
                        </>
                    )}
                    {/* Removed Edit button */}
                    <button
                        onClick={onClose}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-line bg-card px-6 py-2.5 text-sm font-bold text-ink-2 transition-colors hover:border-brand/40 hover:bg-brand-soft/30 hover:text-brand-deep"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}