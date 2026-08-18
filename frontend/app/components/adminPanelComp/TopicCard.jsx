// app/admin/components/TopicCard.jsx
"use client";

import { useState } from "react";
import { Edit2, Trash2, Save, X, Eye, Hash, Type, AlignLeft, Sparkles, Palette } from "lucide-react";

export default function TopicCard({ topic, index, onUpdate, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ ...topic });

    const handleSave = () => {
        onUpdate(index, "id", editData.id);
        onUpdate(index, "name", editData.name);
        onUpdate(index, "blurb", editData.blurb);
        onUpdate(index, "icon", editData.icon);
        onUpdate(index, "hue", editData.hue);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditData({ ...topic });
        setIsEditing(false);
    };

    const PreviewMode = () => (
        <div className="group relative rounded-xl2 border border-line bg-card p-5 transition-all duration-200 hover:border-brand/40 hover:shadow-card-lg">
            {/* Hue Background */}
            <div
                className="absolute inset-0 rounded-xl2 opacity-5 transition-opacity group-hover:opacity-10"
                style={{ background: `hsl(${topic.hue || 200} 70% 50%)` }}
            />

            <div className="relative">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                            style={{ background: `hsl(${topic.hue || 200} 70% 94%)` }}
                        >
                            {topic.icon || "📚"}
                        </div>
                        <div>
                            <h4 className="font-bold text-ink">{topic.name}</h4>
                            <span className="text-xs text-muted">{topic.id}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-brand-soft hover:text-brand-deep"
                        >
                            <Edit2 className="h-4 w-4" strokeWidth={2} />
                        </button>
                        <button
                            onClick={() => onDelete(index)}
                            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-rose-50 hover:text-rose-600"
                        >
                            <Trash2 className="h-4 w-4" strokeWidth={2} />
                        </button>
                    </div>
                </div>

                {/* Blurb */}
                <p className="mt-2 text-sm text-muted">{topic.blurb}</p>

                {/* Footer */}
                <div className="mt-3 flex items-center gap-3 border-t border-line-soft pt-3 text-xs text-muted">
                    <span className="flex items-center gap-1">
                        <Palette className="h-3 w-3" strokeWidth={2} />
                        {topic.hue || 200}
                    </span>
                    <span className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3" strokeWidth={2} />
                        {topic.icon}
                    </span>
                </div>
            </div>
        </div>
    );

    const EditMode = () => (
        <div className="rounded-xl2 border border-brand/40 bg-card p-5 shadow-card-lg">
            <div className="space-y-3">
                <div>
                    <label className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted">
                        <Hash className="h-3 w-3" strokeWidth={2.5} />
                        ID
                    </label>
                    <input
                        value={editData.id || ""}
                        onChange={(e) => setEditData({ ...editData, id: e.target.value })}
                        className="w-full rounded-lg border border-line bg-cream-2/50 px-3 py-1.5 text-sm text-ink focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/15"
                        placeholder="topic-id"
                    />
                </div>

                <div>
                    <label className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted">
                        <Type className="h-3 w-3" strokeWidth={2.5} />
                        Name
                    </label>
                    <input
                        value={editData.name || ""}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="w-full rounded-lg border border-line bg-cream-2/50 px-3 py-1.5 text-sm text-ink focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/15"
                        placeholder="Topic Name"
                    />
                </div>

                <div>
                    <label className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted">
                        <AlignLeft className="h-3 w-3" strokeWidth={2.5} />
                        Blurb
                    </label>
                    <input
                        value={editData.blurb || ""}
                        onChange={(e) => setEditData({ ...editData, blurb: e.target.value })}
                        className="w-full rounded-lg border border-line bg-cream-2/50 px-3 py-1.5 text-sm text-ink focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/15"
                        placeholder="Short description..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted">
                            <Sparkles className="h-3 w-3" strokeWidth={2.5} />
                            Icon
                        </label>
                        <input
                            value={editData.icon || ""}
                            onChange={(e) => setEditData({ ...editData, icon: e.target.value })}
                            className="w-full rounded-lg border border-line bg-cream-2/50 px-3 py-1.5 text-center text-sm text-ink focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/15"
                            placeholder="📚"
                        />
                    </div>
                    <div>
                        <label className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted">
                            <Palette className="h-3 w-3" strokeWidth={2.5} />
                            Hue
                        </label>
                        <input
                            type="number"
                            value={editData.hue || 200}
                            onChange={(e) => setEditData({ ...editData, hue: parseInt(e.target.value) || 200 })}
                            className="w-full rounded-lg border border-line bg-cream-2/50 px-3 py-1.5 text-sm text-ink focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/15"
                            placeholder="200"
                        />
                    </div>
                </div>

                {/* Color Preview */}
                <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ background: `hsl(${editData.hue || 200} 70% 50%)` }}
                />

                <div className="flex items-center gap-2 pt-2">
                    <button
                        onClick={handleSave}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-brand-deep px-4 py-1.5 text-sm font-bold text-white transition-colors hover:bg-[#241f6b]"
                    >
                        <Save className="h-4 w-4" strokeWidth={2.5} />
                        Save
                    </button>
                    <button
                        onClick={handleCancel}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-line bg-card px-4 py-1.5 text-sm font-bold text-ink-2 transition-colors hover:border-brand/40 hover:bg-brand-soft/30 hover:text-brand-deep"
                    >
                        <X className="h-4 w-4" strokeWidth={2.5} />
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );

    return isEditing ? <EditMode /> : <PreviewMode />;
}