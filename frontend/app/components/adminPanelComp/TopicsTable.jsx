// app/admin/components/TopicsTable.jsx
"use client";

import { Hash, Type, AlignLeft, Sparkles, Palette, Trash2, FolderOpen } from "lucide-react";
import TopicRow from "./TopicRow";

export default function TopicsTable({ topics, onUpdate, onDelete }) {
    if (topics.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-3 rounded-full bg-brand-soft p-4">
                    <FolderOpen className="h-8 w-8 text-brand-deep" strokeWidth={1.5} />
                </div>
                <p className="font-medium text-ink">No topics created yet</p>
                <p className="text-sm text-muted">Click "Add Topic" to get started</p>
            </div>
        );
    }

    return (
        <div className="min-w-[700px]">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr,1.2fr,1.5fr,0.8fr,0.8fr,auto] gap-2 border-b border-line bg-cream-2/70 px-3 py-3 text-xs font-bold uppercase tracking-wider text-muted">
                <span className="flex items-center gap-1.5">
                    <Hash className="h-3.5 w-3.5" strokeWidth={2.5} />
                    ID
                </span>
                <span className="flex items-center gap-1.5">
                    <Type className="h-3.5 w-3.5" strokeWidth={2.5} />
                    Name
                </span>
                <span className="flex items-center gap-1.5">
                    <AlignLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
                    Blurb
                </span>
                <span className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
                    Icon
                </span>
                <span className="flex items-center gap-1.5">
                    <Palette className="h-3.5 w-3.5" strokeWidth={2.5} />
                    Hue
                </span>
                <span className="flex items-center gap-1.5">
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={2.5} />
                    Actions
                </span>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-line-soft">
                {topics.map((topic, index) => (
                    <TopicRow
                        key={index}
                        topic={topic}
                        index={index}
                        onUpdate={onUpdate}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    );
}