// app/components/CourseCard.js
"use client"; 

import Link from "next/link";

export default function CourseCard({ course, topic, progress }) {
    // Agar course undefined hai toh return null
    if (!course) {
        console.warn("CourseCard: course is undefined");
        return null;
    }

    const { title, slug, tagline, level, lengthMin, instructor, lessons = 0 } = course;
    const hue = topic?.hue || 160;
    const pct = progress?.pct || 0;
    const doneCount = progress?.done || 0;

    // Format duration
    const formatDuration = (min) => {
        if (!min || min <= 0) return "—";
        const h = Math.floor(min / 60);
        const m = min % 60;
        if (h && m) return `${h}h ${m}m`;
        if (h) return `${h}h`;
        return `${m} min`;
    };

    // Get initials
    const getInitials = (name) => {
        if (!name) return "?";
        return name.split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();
    };

    return (
        <Link
            href={`/course/${slug}`}
            className="course-card"
            style={{ "--hue": hue }}
        >
            <div className="course-cover">
                <span className="c-level">{level || "Beginner"}</span>
                <span className="c-icon">{topic?.icon || "📚"}</span>
            </div>
            {doneCount > 0 && (
                <div className="course-progress-strip">
                    <i style={{ width: `${pct}%` }}></i>
                </div>
            )}
            <div className="course-body">
                <span className="course-topic">{topic?.name || course?.topic || "Course"}</span>
                <h3>{title || "Untitled Course"}</h3>
                <p className="tagline">{tagline || ""}</p>
                <div className="course-meta">
                    <span className="instr">
                        <span className="avatar">
                            {getInitials(instructor?.name)}
                        </span>
                        {instructor?.name || "Instructor"}
                    </span>
                    <span>⏱ {formatDuration(lengthMin)}</span>
                    <span>▦ {lessons || 0} lessons</span>
                </div>
            </div>
        </Link>
    );
}