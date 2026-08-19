// app/course/[slug]/CourseClient.jsx
"use client";

import {
    BookOpen,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Clock,
    Shield,
    HelpCircle,
    Layers,
    Lock,
    PlayCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const typeIconMap = {
    reading: { icon: BookOpen, color: "text-blue-500" },
    video: { icon: PlayCircle, color: "text-rose-500" },
    quiz: { icon: HelpCircle, color: "text-amber-500" },
};

const typeLabel = {
    reading: "Reading",
    video: "Video",
    quiz: "Quiz",
};

export default function CourseClient({ slug, course, topic }) {
    const [mounted, setMounted] = useState(false);
    const [courseProgress, setCourseProgress] = useState(null);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [moduleStates, setModuleStates] = useState({});
    const [openModules, setOpenModules] = useState({});

    const modules = Array.isArray(course?.modules) ? course.modules : [];
    const gated = !!course?.gated;
    const needPct = 70;
    const lessons = modules.flatMap((m) => m?.lessons || []) || [];

    useEffect(() => {
        setMounted(true);
        if (!course || modules.length === 0) return;

        const prog = JSON.parse(localStorage.getItem("finlearn.v1") || "{}");
        const done = prog?.courses?.[slug]?.done || [];
        setCompletedLessons(done);

        const states = {};
        course.modules?.forEach((m, i) => {
            const locked = gated && isModuleLocked(slug, course, i, done);
            states[m.id] = { locked, passed: false };
        });
        setModuleStates(states);

        // Open first module by default
        if (modules.length > 0) {
            setOpenModules({ [modules[0].id]: true });
        }
    }, [slug, course, gated]);

    const isModuleLocked = (slug, course, moduleIndex, done) => {
        if (moduleIndex === 0) return false;
        const prevModule = course.modules?.[moduleIndex - 1];
        if (!prevModule) return false;
        const prevLessonIds = prevModule.lessons?.map((l) => l.id) || [];
        const allDone = prevLessonIds.every((id) => done.includes(id));
        return !allDone;
    };

    const toggleModule = (moduleId) => {
        setOpenModules((prev) => ({
            ...prev,
            [moduleId]: !prev[moduleId],
        }));
    };

    const markComplete = (lessonId) => {
        if (!completedLessons.includes(lessonId)) {
            const updated = [...completedLessons, lessonId];
            setCompletedLessons(updated);

            const data = JSON.parse(localStorage.getItem("finlearn.v1") || "{}");
            if (!data.courses) data.courses = {};
            if (!data.courses[slug]) data.courses[slug] = { done: [] };
            data.courses[slug].done = updated;
            localStorage.setItem("finlearn.v1", JSON.stringify(data));

            // Update module states
            const newStates = { ...moduleStates };
            modules.forEach((m, i) => {
                const locked = gated && isModuleLocked(slug, course, i, updated);
                newStates[m.id] = { ...newStates[m.id], locked };
            });
            setModuleStates(newStates);

            toast.success("Lesson completed!");
        }
    };

    if (!mounted) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-soft border-t-brand-deep" />
                </div>
            </div>
        );
    }

    if (modules.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl2 border border-line bg-card px-6 py-16 text-center">
                <BookOpen className="mb-4 h-12 w-12 text-muted" strokeWidth={1.5} />
                <h3 className="text-lg font-bold text-ink">No content available</h3>
                <p className="text-sm text-muted">This course is being prepared.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {modules.map((m, i) => {
                if (!m) return null;
                const moduleLessons = Array.isArray(m.lessons) ? m.lessons : [];
                const mins = moduleLessons.reduce((n, l) => n + (l?.durationMin || 0), 0);
                const state = moduleStates[m.id] || { locked: false, passed: false };
                const locked = state.locked;
                const isOpen = openModules[m.id] || false;
                const doneCount = moduleLessons.filter((l) =>
                    completedLessons.includes(l.id)
                ).length;
                const isComplete = doneCount === moduleLessons.length && moduleLessons.length > 0;

                return (
                    <div
                        key={m.id}
                        className={`overflow-hidden rounded-xl2 border transition-all duration-200 ${locked
                            ? "border-line-soft opacity-60"
                            : isComplete
                                ? "border-emerald-200"
                                : "border-line"
                            } ${isOpen ? "bg-card" : "bg-cream-2/50"}`}
                    >
                        {/* Module Header */}
                        <button
                            onClick={() => {
                                if (locked) {
                                    toast.error(
                                        `Pass the previous module's quiz at ${needPct}%+ to unlock this one`
                                    );
                                    return;
                                }
                                toggleModule(m.id);
                            }}
                            disabled={locked}
                            className={`flex w-full items-center gap-3 p-4 text-left transition-colors sm:p-5 ${locked ? "cursor-not-allowed" : "hover:bg-cream-2/50"
                                }`}
                        >
                            <div
                                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${locked
                                    ? "bg-muted/20 text-muted"
                                    : isComplete
                                        ? "bg-emerald-100 text-emerald-600"
                                        : "bg-brand-soft text-brand-deep"
                                    }`}
                            >
                                {locked ? (
                                    <Lock className="h-3.5 w-3.5" strokeWidth={2.5} />
                                ) : isComplete ? (
                                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                                ) : (
                                    i + 1
                                )}
                            </div>

                            <div className="flex-1">
                                <h3 className="font-bold text-ink">{m.title}</h3>
                                <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                                    <span className="flex items-center gap-1">
                                        <Layers className="h-3 w-3" strokeWidth={2} />
                                        {moduleLessons.length} lessons
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" strokeWidth={2} />
                                        {formatDuration(mins)}
                                    </span>
                                    {isComplete && (
                                        <span className="flex items-center gap-1 text-emerald-600">
                                            <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} />
                                            Complete
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {locked && (
                                    <span className="text-xs font-medium text-muted">
                                        <Lock className="inline h-3 w-3" strokeWidth={2.5} /> Locked
                                    </span>
                                )}
                                {isOpen ? (
                                    <ChevronDown className="h-4 w-4 text-muted" strokeWidth={2.5} />
                                ) : (
                                    <ChevronRight className="h-4 w-4 text-muted" strokeWidth={2.5} />
                                )}
                            </div>
                        </button>

                        {/* Module Lessons */}
                        {isOpen && !locked && (
                            <div className="border-t border-line-soft p-1.5">
                                {moduleLessons.map((l) => {
                                    if (!l) return null;
                                    const done = completedLessons.includes(l.id);
                                    const { icon: Icon, color } =
                                        typeIconMap[l.type] || typeIconMap.reading;

                                    return (
                                        <div
                                            key={l.id}
                                            className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-cream-2/50"
                                        >
                                            {done ? (
                                                <CheckCircle2
                                                    className="h-4 w-4 text-emerald-500"
                                                    strokeWidth={2.5}
                                                />
                                            ) : (
                                                <Icon className={`h-4 w-4 ${color}`} strokeWidth={2} />
                                            )}
                                            <Link
                                                href={`/lesson/${slug}--${l.id}`}
                                                className={`flex-1 text-sm font-medium transition-colors ${done
                                                    ? "text-muted line-through"
                                                    : "text-ink-2 hover:text-brand-deep"
                                                    }`}
                                            >
                                                {l.title}
                                            </Link>
                                            <span className="text-xs text-muted">
                                                {formatDuration(l.durationMin)}
                                            </span>
                                            {!done && (
                                                <button
                                                    onClick={() => markComplete(l.id)}
                                                    className="rounded-full bg-brand-soft px-3 py-0.5 text-xs font-bold text-brand-deep opacity-0 transition-opacity group-hover:opacity-100"
                                                >
                                                    Mark done
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function formatDuration(min) {
    if (!min || min <= 0) return "";
    const h = Math.floor(min / 60);
    const m = min % 60;
    if (h && m) return `${h}h ${m}m`;
    if (h) return `${h}h`;
    return `${m} min`;
}