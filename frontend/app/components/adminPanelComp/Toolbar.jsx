// app/admin/components/Toolbar.jsx
"use client";

import { Download, RefreshCw, Trash2, Save } from "lucide-react";

export default function Toolbar({ isCustomized, saving, onDownload, onReset, onDelete, onSave }) {
    return (
        <div className="ml-auto flex flex-wrap items-center gap-1.5">
            <button
                onClick={onDownload}
                className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-bold text-ink-2 transition-colors hover:border-brand/40 hover:bg-brand-soft/30 hover:text-brand-deep"
            >
                <Download className="h-3.5 w-3.5" strokeWidth={2.5} />
                <span className="hidden sm:inline">JSON</span>
            </button>
            {isCustomized && (
                <button
                    onClick={onReset}
                    disabled={saving}
                    className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-bold text-amber-600 transition-colors hover:border-amber-300 hover:bg-amber-50 disabled:opacity-60"
                >
                    <RefreshCw className="h-3.5 w-3.5" strokeWidth={2.5} />
                    Reset
                </button>
            )}
            <button
                onClick={onDelete}
                disabled={saving}
                className="inline-flex items-center gap-1 rounded-full border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-600 transition-colors hover:border-rose-300 hover:bg-rose-50 disabled:opacity-60"
            >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={2.5} />
                Delete
            </button>
            <button
                onClick={onSave}
                disabled={saving}
                className="inline-flex items-center gap-1 rounded-full bg-brand-deep px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#241f6b] disabled:opacity-60"
            >
                {saving ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" strokeWidth={2.5} />
                ) : (
                    <Save className="h-3.5 w-3.5" strokeWidth={2.5} />
                )}
            </button>
        </div>
    );
}