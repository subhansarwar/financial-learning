// app/(website)/course/[slug]/CourseClient.jsx
"use client";

import {
    BookOpen,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Clock,
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

export default function CourseClient({ slug, course, topic, onLessonClick, completedLessonIds = [] }) {
    const [mounted, setMounted] = useState(false);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [moduleStates, setModuleStates] = useState({});
    const [openModules, setOpenModules] = useState({});

    const modules = Array.isArray(course?.modules) ? course.modules : [];
    const gated = !!course?.gated;
    const needPct = 70;

    useEffect(() => {
        setMounted(true);
        if (!course || modules.length === 0) return;
        // Use completedLessonIds from props if available
        const done = completedLessonIds.length > 0 ? completedLessonIds : [];
        setCompletedLessons(done);

        const states = {};
        course.modules?.forEach((m, i) => {
            const locked = gated && isModuleLocked(i, done);
            states[m.id] = { locked, passed: false };
        });
        setModuleStates(states);

        // Find and open the first incomplete module
        let firstIncompleteModuleIndex = 0;
        for (let i = 0; i < modules.length; i++) {
            const moduleLessons = modules[i]?.lessons || [];
            const moduleLessonIds = moduleLessons.map(l => l.id);
            const allCompleted = moduleLessonIds.every(id => done.includes(id));
            if (!allCompleted && moduleLessonIds.length > 0) {
                firstIncompleteModuleIndex = i;
                break;
            }
        }

        // Open the module where user left off
        const moduleToOpen = modules[firstIncompleteModuleIndex]?.id;
        if (moduleToOpen) {
            setOpenModules({ [moduleToOpen]: true });
        } else if (modules.length > 0) {
            setOpenModules({ [modules[0].id]: true });
        }
    }, [slug, course, gated]);

    const isModuleLocked = (moduleIndex, done) => {
        if (moduleIndex === 0) return false;
        const prevModule = modules[moduleIndex - 1];
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

            const newStates = { ...moduleStates };
            modules.forEach((m, i) => {
                const locked = gated && isModuleLocked(slug, course, i, updated);
                newStates[m.id] = { ...newStates[m.id], locked };
            });
            setModuleStates(newStates);

            toast.success("Lesson completed!");
        }
    };

    const handleLessonClick = (e, lessonId) => {
        if (onLessonClick) {
            e.preventDefault();
            onLessonClick();
        }
        // Navigation will happen after enrollment
    };

    if (!mounted) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#72BB83]/20 border-t-[#72BB83]" />
                </div>
            </div>
        );
    }

    if (modules.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-[#E5E5E5] bg-white px-6 py-16 text-center">
                <BookOpen className="mb-4 h-12 w-12 text-[#14301F]/30" strokeWidth={1.5} />
                <h3 className="text-lg font-bold text-[#14301F]">No content available</h3>
                <p className="text-sm text-[#14301F]/60">This course is being prepared.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {modules.map((m, i) => {
                if (!m) return null;
                const moduleLessons = Array.isArray(m.lessons) ? m.lessons : [];
                const mins = moduleLessons.reduce((n, l) => n + (l?.duration_min || 0), 0);
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
                        className={`overflow-hidden rounded-xl border transition-all duration-200 ${locked
                            ? "border-[#E5E5E5] opacity-60"
                            : isComplete
                                ? "border-[#72BB83]/30"
                                : "border-[#E5E5E5]"
                            } ${isOpen ? "bg-white" : "bg-[#F5FAF7]"}`}
                    >
                        {/* Module Header */}
                        <button
                            onClick={() => {
                                if (locked) {
                                
                                    return;
                                }
                                toggleModule(m.id);
                            }}
                            disabled={locked}
                            className={`flex w-full items-center gap-3 p-4 text-left transition-colors sm:p-5 ${locked ? "cursor-not-allowed" : "hover:bg-[#F5FAF7]"
                                }`}
                        >
                            <div
                                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${locked
                                    ? "bg-[#E5E5E5] text-[#14301F]/40"
                                    : isComplete
                                        ? "bg-[#72BB83]/10 text-[#72BB83]"
                                        : "bg-[#72BB83]/10 text-[#14301F]"
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
                                <h3 className="font-bold text-[#14301F]">{m.title}</h3>
                                <div className="flex flex-wrap items-center gap-3 text-xs text-[#14301F]/60">
                                    <span className="flex items-center gap-1">
                                        <Layers className="h-3 w-3" strokeWidth={2} />
                                        {moduleLessons.length} lessons
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" strokeWidth={2} />
                                        {formatDuration(mins)}
                                    </span>
                                    {isComplete && (
                                        <span className="flex items-center gap-1 text-[#72BB83]">
                                            <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} />
                                            Complete
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {locked && (
                                    <span className="text-xs font-medium text-[#14301F]/40">
                                        <Lock className="inline h-3 w-3" strokeWidth={2.5} /> Locked
                                    </span>
                                )}
                                {isOpen ? (
                                    <ChevronDown className="h-4 w-4 text-[#14301F]/40" strokeWidth={2.5} />
                                ) : (
                                    <ChevronRight className="h-4 w-4 text-[#14301F]/40" strokeWidth={2.5} />
                                )}
                            </div>
                        </button>

                        {/* Module Lessons */}
                        {isOpen && !locked && (
                            <div className="border-t border-[#E5E5E5] p-1.5">
                                {moduleLessons.map((l) => {
                                    if (!l) return null;
                                    const done = completedLessons.includes(l.id);
                                    const { icon: Icon, color } =
                                        typeIconMap[l.type] || typeIconMap.reading;

                                    return (
                                        <div
                                            key={l.id}
                                            className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-[#F5FAF7]"
                                        >
                                            {done ? (
                                                <CheckCircle2
                                                    className="h-4 w-4 text-[#72BB83]"
                                                    strokeWidth={2.5}
                                                />
                                            ) : (
                                                <Icon className={`h-4 w-4 ${color}`} strokeWidth={2} />
                                            )}
                                            <Link
                                                href={`/lesson/${slug}--${l.id}`}
                                                onClick={(e) => handleLessonClick(e, l.id)}
                                                className={`flex-1 text-sm font-medium transition-colors ${done
                                                    ? "text-[#14301F]/40 line-through"
                                                    : "text-[#14301F]/70 hover:text-[#14301F]"
                                                    }`}
                                            >
                                                {l.title}
                                            </Link>
                                            <span className="text-xs text-[#14301F]/40">
                                                {formatDuration(l.duration_min)}
                                            </span>
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