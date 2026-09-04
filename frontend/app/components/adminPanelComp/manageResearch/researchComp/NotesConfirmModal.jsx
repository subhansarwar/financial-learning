// app/components/adminPanelComp/manageResearch/researchComp/NotesConfirmModal.jsx
"use client";

import { useState, useEffect } from "react";
import { X, AlertTriangle, CheckCircle, XCircle, Trash2 } from "lucide-react";

const TONE_CONFIG = {
    approve: {
        icon: CheckCircle,
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
        btnBg: "bg-emerald-600 hover:bg-emerald-700",
        title: "Approve Paper",
        confirmLabel: "Approve",
    },
    reject: {
        icon: XCircle,
        iconBg: "bg-rose-50",
        iconColor: "text-rose-600",
        btnBg: "bg-rose-600 hover:bg-rose-700",
        title: "Reject Paper",
        confirmLabel: "Reject",
    },
    delete: {
        icon: Trash2,
        iconBg: "bg-rose-50",
        iconColor: "text-rose-600",
        btnBg: "bg-rose-600 hover:bg-rose-700",
        title: "Delete Paper",
        confirmLabel: "Delete Permanently",
    },
};

export default function NotesConfirmModal({ isOpen, mode = "approve", paperTitle, loading, onClose, onConfirm }) {
    const [notes, setNotes] = useState("");

    useEffect(() => {
        if (isOpen) setNotes("");
    }, [isOpen]);

    if (!isOpen) return null;

    const cfg = TONE_CONFIG[mode] || TONE_CONFIG.approve;
    const Icon = cfg.icon;

    const handleSubmit = () => {
        onConfirm(notes.trim());
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md mx-4 rounded-xl2 border border-line bg-card p-6 shadow-card-lg animate-in zoom-in-95 duration-200 sm:p-8"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`rounded-full p-2 ${cfg.iconBg}`}>
                            <Icon className={`h-5 w-5 ${cfg.iconColor}`} strokeWidth={2} />
                        </div>
                        <h3 className="text-xl font-bold text-ink">{cfg.title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1.5 text-muted transition-colors hover:bg-cream-2 hover:text-ink"
                    >
                        <X className="h-5 w-5" strokeWidth={2} />
                    </button>
                </div>

                {mode === "delete" && (
                    <div className="flex items-start gap-3 rounded-lg bg-rose-50 p-3 mb-4">
                        <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-600" strokeWidth={2} />
                        <div>
                            <p className="font-bold text-rose-700">Warning: This action cannot be undone!</p>
                            <p className="text-sm text-rose-600">
                                You are about to delete <span className="font-bold">"{paperTitle}"</span> permanently.
                            </p>
                        </div>
                    </div>
                )}

                {mode !== "delete" && (
                    <p className="text-sm text-muted mb-4">
                        {mode === "approve" ? "Approve" : "Reject"}{" "}
                        <span className="font-bold text-ink">"{paperTitle}"</span>. You can add a note for the author below.
                    </p>
                )}

                <div className="mb-6">
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">
                        Admin Notes {mode !== "delete" && <span className="normal-case font-normal">(optional)</span>}
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                        placeholder="Add a note for this action..."
                        className="w-full rounded-lg border border-line bg-cream-2/50 p-3 text-sm text-ink placeholder:text-muted focus:border-[#365B50]/50 focus:outline-none focus:ring-4 focus:ring-[#365B50]/15"
                    />
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`flex-1 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white transition-colors disabled:opacity-60 sm:px-6 ${cfg.btnBg}`}
                    >
                        <Icon className="h-4 w-4 shrink-0" strokeWidth={2.5} />
                        <span className="whitespace-nowrap">{loading ? "Please wait..." : cfg.confirmLabel}</span>
                    </button>

                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-line bg-card px-5 py-3 text-sm font-bold text-ink-2 transition-colors hover:border-brand/40 hover:bg-brand-soft/30 hover:text-brand-deep disabled:opacity-60"
                    >
                        <span className="whitespace-nowrap">Cancel</span>
                    </button>
                </div>
            </div>
        </div>
    );
}