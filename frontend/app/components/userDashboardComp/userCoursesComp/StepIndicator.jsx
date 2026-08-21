// app/components/userDashboardComp/userCoursesComp/StepIndicator.jsx
"use client";

import { Check, BookOpen, Layers3 } from "lucide-react";

const STEPS = [
    { id: 1, label: "Course Information", icon: BookOpen },
    { id: 2, label: "Course Curriculum", icon: Layers3 },
];

export default function StepIndicator({ step }) {
    return (
        <div className="flex items-center gap-4 rounded-xl2 border border-line bg-cream-2/40 p-3 sm:p-4">
            {STEPS.map((s, idx) => {
                const isDone = step > s.id;
                const isActive = step === s.id;
                const Icon = s.icon;

                return (
                    <div key={s.id} className="flex flex-1 items-center gap-3">
                        <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isDone
                                    ? "bg-emerald-500 text-white"
                                    : isActive
                                        ? "bg-[#365B50] text-white"
                                        : "bg-cream-2 text-muted"
                                }`}
                        >
                            {isDone ? (
                                <Check className="h-4 w-4" strokeWidth={2.5} />
                            ) : (
                                <Icon className="h-4 w-4" strokeWidth={2} />
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className={`text-xs font-bold ${isActive || isDone ? "text-ink" : "text-muted"}`}>
                                Step {s.id}/2
                            </p>
                            <p className="truncate text-sm font-semibold text-ink-2">{s.label}</p>
                        </div>
                        {idx < STEPS.length - 1 && (
                            <div className="hidden h-px flex-1 bg-line-soft sm:block" />
                        )}
                    </div>
                );
            })}
        </div>
    );
}