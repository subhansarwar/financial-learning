// app/components/userDashboardComp/userCoursesComp/DeleteConfirmModal.jsx
"use client";

import { Trash2, X, AlertTriangle } from "lucide-react";

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, courseTitle }) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md mx-4 rounded-2xl border border-rose-200 bg-white p-6 shadow-card-lg animate-in zoom-in-95 duration-200 sm:p-8"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-rose-50 p-2">
                            <Trash2 className="h-5 w-5 text-rose-600" strokeWidth={2} />
                        </div>
                        <h3 className="text-xl font-bold text-ink">Delete Course</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1.5 text-muted transition-colors hover:bg-cream-2 hover:text-ink"
                    >
                        <X className="h-5 w-5" strokeWidth={2} />
                    </button>
                </div>

                <div className="flex items-start gap-3 rounded-lg bg-rose-50 p-3 mb-4">
                    <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-600" strokeWidth={2} />
                    <div>
                        <p className="font-bold text-rose-700">Warning: This action cannot be undone!</p>
                        <p className="text-sm text-rose-600">
                            You are about to delete <span className="font-bold">"{courseTitle}"</span> permanently.
                        </p>
                    </div>
                </div>

                <p className="text-sm text-muted mb-6">
                    This will remove the course from your list. Are you sure you want to continue?
                </p>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={onConfirm}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-rose-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-rose-700 sm:px-6"
                    >
                        <Trash2 className="h-4 w-4 shrink-0" strokeWidth={2.5} />
                        <span className="whitespace-nowrap">Delete Permanently</span>
                    </button>

                    <button
                        onClick={onClose}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-sm font-bold text-ink-2 transition-colors hover:border-[#365B50]/40 hover:bg-[#365B50]/10"
                    >
                        <span className="whitespace-nowrap">Cancel</span>
                    </button>
                </div>
            </div>
        </div>
    );
}