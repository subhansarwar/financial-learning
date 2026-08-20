// app/components/adminPanelComp/manageCourse/courseComp/CourseForm.jsx
"use client";

import { Tag, Layers, Clock, Lock, Unlock, User, ListChecks } from "lucide-react";

export default function CourseForm({ data, onChange, topics }) {
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted">Title</label>
                <input
                    value={data.title || ""}
                    onChange={(e) => onChange({ ...data, title: e.target.value })}
                    className="w-full rounded-lg border border-line bg-cream-2/50 px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-brand/50 focus:outline-none focus:ring-4 focus:ring-brand/15"
                />
            </div>
            <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted">Slug</label>
                <input
                    value={data.slug || ""}
                    onChange={(e) => onChange({ ...data, slug: e.target.value })}
                    className="w-full rounded-lg border border-line bg-cream-2/50 px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-brand/50 focus:outline-none focus:ring-4 focus:ring-brand/15"
                />
            </div>
            <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted">Tagline</label>
                <input
                    value={data.tagline || ""}
                    onChange={(e) => onChange({ ...data, tagline: e.target.value })}
                    className="w-full rounded-lg border border-line bg-cream-2/50 px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-brand/50 focus:outline-none focus:ring-4 focus:ring-brand/15"
                />
            </div>
            <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted">
                    <Tag className="inline h-3 w-3" strokeWidth={2} /> Topic
                </label>
                <select
                    value={data.topic || ""}
                    onChange={(e) => onChange({ ...data, topic: e.target.value })}
                    className="w-full rounded-lg border border-line bg-cream-2/50 px-3 py-2 text-sm text-ink focus:border-brand/50 focus:outline-none focus:ring-4 focus:ring-brand/15"
                >
                    {topics.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted">
                    <Layers className="inline h-3 w-3" strokeWidth={2} /> Level
                </label>
                <select
                    value={data.level || "Beginner"}
                    onChange={(e) => onChange({ ...data, level: e.target.value })}
                    className="w-full rounded-lg border border-line bg-cream-2/50 px-3 py-2 text-sm text-ink focus:border-brand/50 focus:outline-none focus:ring-4 focus:ring-brand/15"
                >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                </select>
            </div>
            <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted">
                    <Clock className="inline h-3 w-3" strokeWidth={2} /> Length (min)
                </label>
                <input
                    type="number"
                    value={data.lengthMin || 60}
                    onChange={(e) => onChange({ ...data, lengthMin: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-line bg-cream-2/50 px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-brand/50 focus:outline-none focus:ring-4 focus:ring-brand/15"
                />
            </div>
            <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted">
                    {data.gated ? <Lock className="inline h-3 w-3" strokeWidth={2} /> : <Unlock className="inline h-3 w-3" strokeWidth={2} />} Gated
                </label>
                <select
                    value={data.gated ? "true" : "false"}
                    onChange={(e) => onChange({ ...data, gated: e.target.value === "true" })}
                    className="w-full rounded-lg border border-line bg-cream-2/50 px-3 py-2 text-sm text-ink focus:border-brand/50 focus:outline-none focus:ring-4 focus:ring-brand/15"
                >
                    <option value="false">No</option>
                    <option value="true">Yes (70% to unlock)</option>
                </select>
            </div>
            <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted">
                    <User className="inline h-3 w-3" strokeWidth={2} /> Instructor Name
                </label>
                <input
                    value={data.instructor?.name || ""}
                    onChange={(e) => onChange({ ...data, instructor: { ...data.instructor, name: e.target.value } })}
                    className="w-full rounded-lg border border-line bg-cream-2/50 px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-brand/50 focus:outline-none focus:ring-4 focus:ring-brand/15"
                />
            </div>
            <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted">Instructor Title</label>
                <input
                    value={data.instructor?.title || ""}
                    onChange={(e) => onChange({ ...data, instructor: { ...data.instructor, title: e.target.value } })}
                    className="w-full rounded-lg border border-line bg-cream-2/50 px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-brand/50 focus:outline-none focus:ring-4 focus:ring-brand/15"
                />
            </div>
            <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted">
                    <ListChecks className="inline h-3 w-3" strokeWidth={2} /> Outcomes (one per line)
                </label>
                <textarea
                    rows={3}
                    value={(data.outcomes || []).join("\n")}
                    onChange={(e) => onChange({ ...data, outcomes: e.target.value.split("\n").filter(Boolean) })}
                    className="w-full rounded-lg border border-line bg-cream-2/50 px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-brand/50 focus:outline-none focus:ring-4 focus:ring-brand/15"
                />
            </div>
        </div>
    );
}