"use client";

import Link from "next/link";
import { Clock, ListChecks } from "lucide-react";

export default function CourseCard({ course, topic, progress }) {
    if (!course) {
        console.warn("CourseCard: course is undefined");
        return null;
    }

    const { title, slug, tagline, level, lengthMin, instructor, lessons = 0 } = course;
    const hue = topic?.hue || 245; // default to the brand indigo hue
    const pct = progress?.pct || 0;
    const doneCount = progress?.done || 0;

    const formatDuration = (min) => {
        if (!min || min <= 0) return "";
        const h = Math.floor(min / 60);
        const m = min % 60;
        if (h && m) return `${h}h ${m}m`;
        if (h) return `${h}h`;
        return `${m} min`;
    };

    const getInitials = (name) => {
        if (!name) return "?";
        return name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
    };

    return (
        <Link
            href={`/course/${slug}`}
            style={{ "--hue": hue }}
            className="group block overflow-hidden rounded-xl2 border border-line bg-card transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-card-lg"
        >
            <div
                className="relative flex h-32 items-center justify-center sm:h-36"
                style={{ background: "linear-gradient(135deg, hsl(var(--hue) 70% 94%), hsl(var(--hue) 55% 85%))" }}
            >
                <span className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-ink-2 backdrop-blur-sm sm:left-4 sm:top-4">
                    {level || "Beginner"}
                </span>
                <span className="text-4xl sm:text-5xl">{topic?.icon || "📚"}</span>
            </div>

            {doneCount > 0 && (
                <div className="h-1.5 w-full bg-cream-2">
                    <i
                        className="block h-full not-italic"
                        style={{ width: `${pct}%`, background: "hsl(var(--hue) 55% 42%)" }}
                    ></i>
                </div>
            )}

            <div className="p-4 sm:p-5">
                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: "hsl(var(--hue) 45% 38%)" }}>
                    {topic?.name || course?.topic || "Course"}
                </span>
                <h3 className="mt-1 text-base font-bold leading-snug tracking-tight text-ink sm:text-lg">
                    {title || "Untitled Course"}
                </h3>
                {tagline && <p className="mt-1 line-clamp-2 text-sm font-medium text-muted">{tagline}</p>}

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line-soft pt-3 text-xs font-semibold text-muted sm:text-sm">
                    <span className="flex items-center gap-1.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-soft text-[10px] font-bold text-brand-deep">
                            {getInitials(instructor?.name)}
                        </span>
                        <span className="max-w-[9rem] truncate">{instructor?.name || "Instructor"}</span>
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" strokeWidth={2.25} />
                        {formatDuration(lengthMin)}
                    </span>
                    <span className="flex items-center gap-1">
                        <ListChecks className="h-3.5 w-3.5" strokeWidth={2.25} />
                        {lessons || 0} lessons
                    </span>
                </div>
            </div>
        </Link>
    );
}