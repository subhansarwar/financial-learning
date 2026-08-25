// app/components/CourseCard.jsx
"use client";

import Link from "next/link";
import { Clock, ListChecks, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function CourseCard({ course, topic, progress }) {
    const [isHovered, setIsHovered] = useState(false);

    if (!course) {
        console.warn("CourseCard: course is undefined");
        return null;
    }

    const { title, slug, tagline, level, lengthMin, instructor, lessons = 0 } = course;
    const hue = topic?.hue || 245;
    const pct = progress?.pct || 0;
    const doneCount = progress?.done || 0;

    const formatDuration = (min) => {
        if (!min || min <= 0) return "—";
        const h = Math.floor(min / 60);
        const m = min % 60;
        if (h && m) return `${h}h ${m}m`;
        if (h) return `${h}h`;
        return `${m} min`;
    };

    const getInitials = (name) => {
        if (!name) return "?";
        return name
            .split(/\s+/)
            .map((w) => w[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
    };

    return (
        <Link
            href={`/course/${slug}`}
            style={{ "--hue": hue }}
            className="group block w-full overflow-hidden rounded-2xl border border-[#E5E5E5]/60 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#72BB83]/40 hover:shadow-lg"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Course Cover - Increased Height */}
            <div
                className="relative flex h-48 items-center justify-center sm:h-56"
                style={{
                    background: `linear-gradient(135deg, hsl(${hue} 70% 94%), hsl(${hue} 55% 85%))`,
                }}
            >
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
                    <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
                </div>

                {/* Level Badge */}
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#14301F] shadow-sm backdrop-blur-sm">
                    {level || "Beginner"}
                </span>

                {/* Course Icon - Larger */}
                <span className="relative text-6xl transition-transform duration-300 group-hover:scale-110 sm:text-7xl">
                    {topic?.icon || "📚"}
                </span>

                {/* Progress Badge */}
                {doneCount > 0 && pct > 0 && (
                    <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold text-[#72BB83] shadow-sm backdrop-blur-sm">
                        {pct}%
                    </span>
                )}
            </div>

            {/* Progress Bar */}
            {doneCount > 0 && (
                <div className="h-1.5 w-full bg-[#F0F0F0]">
                    <div
                        className="h-full transition-all duration-500"
                        style={{
                            width: `${pct}%`,
                            background: `hsl(${hue} 55% 42%)`,
                        }}
                    />
                </div>
            )}

            {/* Course Body - More Padding */}
            <div className="p-5 sm:p-6 lg:p-7">
                {/* Topic */}
                <span
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: `hsl(${hue} 45% 38%)` }}
                >
                    {topic?.name || course?.topic || "Course"}
                </span>

                {/* Title - Larger */}
                <h3 className="mt-1.5 text-lg font-bold leading-snug tracking-tight text-[#14301F] transition-colors duration-300 group-hover:text-[#72BB83] sm:text-xl">
                    {title || "Untitled Course"}
                </h3>

                {/* Tagline */}
                {tagline && (
                    <p className="mt-2 line-clamp-2 text-sm text-[#14301F]/60 sm:text-base">
                        {tagline}
                    </p>
                )}

                {/* Meta Info - More spacing */}
                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#E5E5E5]/60 pt-4 text-xs font-medium text-[#14301F]/50 sm:text-sm">
                    <span className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#72BB83]/10 text-[11px] font-bold text-[#72BB83] transition-colors group-hover:bg-[#72BB83]/20">
                            {getInitials(instructor?.name)}
                        </span>
                        <span className="max-w-[10rem] truncate font-medium text-[#14301F]">
                            {instructor?.name || "Instructor"}
                        </span>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-[#72BB83]" strokeWidth={2} />
                        {formatDuration(lengthMin)}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <ListChecks className="h-4 w-4 text-[#72BB83]" strokeWidth={2} />
                        {lessons || 0}
                    </span>
                </div>

                {/* Hover CTA - Theme Color */}
                <div
                    className={`mt-4 overflow-hidden transition-all duration-300 ${isHovered ? "max-h-8 opacity-100" : "max-h-0 opacity-0"
                        }`}
                >
                    <div className="flex items-center gap-2 text-sm font-bold text-[#72BB83]">
                        <span>View Course</span>
                        <ChevronRight
                            className={`h-4 w-4 transition-all duration-300 ${isHovered ? "translate-x-1" : ""
                                }`}
                            strokeWidth={2.5}
                        />
                    </div>
                </div>
            </div>
        </Link>
    );
}