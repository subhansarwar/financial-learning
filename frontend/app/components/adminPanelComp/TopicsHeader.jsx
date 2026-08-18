// app/admin/components/TopicsHeader.jsx
"use client";

import { Tags, Plus, Sparkles } from "lucide-react";

export default function TopicsHeader({ topicCount, onAddTopic }) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
                <div className="rounded-xl bg-purple-50 p-2.5">
                    <Tags className="h-5 w-5 text-purple-500" strokeWidth={2} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-ink sm:text-xl">Topics</h3>
                    <p className="text-xs text-muted">{topicCount} topic{topicCount !== 1 ? "s" : ""} configured</p>
                </div>
            </div>
            <button
                onClick={onAddTopic}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-700 hover:shadow-md"
            >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                Add Topic
            </button>
        </div>
    );
}