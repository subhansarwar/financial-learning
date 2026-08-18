// app/admin/components/CourseList.jsx
"use client";

import { Edit } from "lucide-react";

export default function CourseList({ courses, selectedSlug, overriddenKeys, onSelect }) {
    return (
        <div>
            <div className="max-h-[600px] overflow-y-auto rounded-xl2 border border-line bg-card">
                {courses.map((c) => (
                    <button
                        key={c.slug}
                        onClick={() => onSelect(c.slug)}
                        className={`flex w-full items-center justify-between border-b border-line-soft px-4 py-3 text-left text-sm font-medium transition-colors last:border-b-0 hover:bg-cream-2 ${selectedSlug === c.slug ? "bg-brand-soft text-brand-deep" : "text-ink-2"
                            }`}
                    >
                        <span className="truncate flex-1">{c.title}</span>
                        {overriddenKeys.has(`course:${c.slug}`) && (
                            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                                <Edit className="h-2.5 w-2.5" strokeWidth={2.5} />
                                edited
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}