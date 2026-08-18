// app/admin/components/ResetConfirmModal.jsx
"use client";

import { RefreshCw, X, AlertCircle } from "lucide-react";

export default function ResetConfirmModal({ isOpen, onClose, onConfirm, courseTitle }) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md mx-4 rounded-xl2 border border-amber-200 bg-card p-6 shadow-card-lg animate-in zoom-in-95 duration-200 sm:p-8"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-amber-50 p-2">
                            <RefreshCw className="h-5 w-5 text-amber-600" strokeWidth={2} />
                        </div>
                        <h3 className="text-xl font-bold text-ink">Reset Course</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1.5 text-muted transition-colors hover:bg-cream-2 hover:text-ink"
                    >
                        <X className="h-5 w-5" strokeWidth={2} />
                    </button>
                </div>

                <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-3 mb-4">
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" strokeWidth={2} />
                    <div>
                        <p className="font-bold text-amber-700">Discard all custom changes?</p>
                        <p className="text-sm text-amber-600">
                            You are about to reset <span className="font-bold">"{courseTitle}"</span> to its built-in version.
                        </p>
                    </div>
                </div>

                <p className="text-sm text-muted mb-6">
                    All your custom edits, modules, and lessons will be lost and replaced with the original content. This action cannot be undone.
                </p>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={onConfirm}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-amber-600 px-6 py-2.5 font-bold text-white transition-colors hover:bg-amber-700"
                    >
                        <RefreshCw className="h-4 w-4" strokeWidth={2.5} />
                        Reset to Built-in
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-line bg-card px-6 py-2.5 font-bold text-ink-2 transition-colors hover:border-brand/40 hover:bg-brand-soft/30 hover:text-brand-deep"
                    >
                        Keep Edits
                    </button>
                </div>
            </div>
        </div>
    );
}