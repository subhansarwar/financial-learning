// app/admin/components/TopicRow.jsx
"use client";

import { Trash2, Copy } from "lucide-react";

export default function TopicRow({ topic, index, onUpdate, onDelete }) {
    return (
        <div className="grid grid-cols-[1fr,1.2fr,1.5fr,0.8fr,0.8fr,auto] gap-2 border-b border-line-soft px-3 py-2 last:border-b-0 items-center hover:bg-cream-2/30 transition-colors">
            <input
                value={topic.id || ""}
                onChange={(e) => onUpdate(index, "id", e.target.value)}
                placeholder="id"
                className="w-full rounded-lg border border-line bg-cream-2/50 px-2.5 py-1.5 text-sm text-ink placeholder:text-muted focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/15"
            />
            <input
                value={topic.name || ""}
                onChange={(e) => onUpdate(index, "name", e.target.value)}
                placeholder="Topic name"
                className="w-full rounded-lg border border-line bg-cream-2/50 px-2.5 py-1.5 text-sm text-ink placeholder:text-muted focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/15"
            />
            <input
                value={topic.blurb || ""}
                onChange={(e) => onUpdate(index, "blurb", e.target.value)}
                placeholder="Short description"
                className="w-full rounded-lg border border-line bg-cream-2/50 px-2.5 py-1.5 text-sm text-ink placeholder:text-muted focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/15"
            />
            <input
                value={topic.icon || ""}
                onChange={(e) => onUpdate(index, "icon", e.target.value)}
                placeholder="📚"
                className="w-full rounded-lg border border-line bg-cream-2/50 px-2.5 py-1.5 text-center text-sm text-ink placeholder:text-muted focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/15"
            />
            <input
                type="number"
                value={topic.hue || 160}
                onChange={(e) => onUpdate(index, "hue", parseInt(e.target.value) || 160)}
                placeholder="160"
                className="w-full rounded-lg border border-line bg-cream-2/50 px-2.5 py-1.5 text-sm text-ink placeholder:text-muted focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/15"
            />
            <button
                onClick={() => onDelete(index)}
                className="inline-flex items-center justify-center rounded-lg p-2 text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700"
                aria-label="Delete topic"
            >
                <Trash2 className="h-4 w-4" strokeWidth={2} />
            </button>
        </div>
    );
}