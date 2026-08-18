// app/admin/components/TopicsActions.jsx
"use client";

import { Save, RefreshCw, CheckCircle2 } from "lucide-react";

export default function TopicsActions({ topicCount, saving, onSave }) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl2 border border-line bg-card p-4">
            <div className="flex flex-wrap items-center gap-3">
                <button
                    onClick={onSave}
                    disabled={saving || topicCount === 0}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-deep px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#241f6b] hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {saving ? (
                        <>
                            <RefreshCw className="h-4 w-4 animate-spin" strokeWidth={2.5} />
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4" strokeWidth={2.5} />
                            Save All Topics
                        </>
                    )}
                </button>
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" strokeWidth={2} />
                    <span className="text-xs font-medium text-emerald-700">
                        {topicCount} topic{topicCount !== 1 ? "s" : ""} ready
                    </span>
                </div>
            </div>
        </div>
    );
}