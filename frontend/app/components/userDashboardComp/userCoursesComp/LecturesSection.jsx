// app/components/userDashboardComp/userCoursesComp/LecturesSection.jsx
"use client";

import { CheckCircle2, ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import { useState } from "react";
import ProgressRing from "./ProgressRing";

const TEAL = "#34C79D";

function LectureCard({ module, completedLessonIds, onLessonComplete, isEnrolled }) {
    const [expanded, setExpanded] = useState(false);

    const totalLessons = module.lessons?.length || 0;
    const completedCount = module.lessons?.filter(l => completedLessonIds?.includes(l.id)).length || 0;
    const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-gray-900">{module.title || "Module"}</p>
                    <p className="mt-0.5 text-xs text-gray-400">
                        {totalLessons} lessons · {progress}% complete
                    </p>
                </div>
                <ProgressRing
                    value={progress}
                    size={40}
                    strokeWidth={4}
                    color={TEAL}
                    trackColor="#F1F1F1"
                    labelColor="#1F2937"
                />
            </div>

            <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
                {module.lessons?.slice(0, expanded ? undefined : 2).map((lesson) => {
                    const isCompleted = completedLessonIds?.includes(lesson.id);
                    return (
                        <button
                            key={lesson.id}
                            onClick={() => onLessonComplete(lesson.id)}
                            disabled={!isEnrolled || isCompleted}
                            className="flex w-full items-center gap-2.5 hover:bg-gray-50 rounded px-1 py-1 transition-colors disabled:cursor-not-allowed"
                        >
                            {isCompleted ? (
                                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                            ) : (
                                <PlayCircle className="h-3.5 w-3.5 shrink-0" style={{ color: TEAL }} />
                            )}
                            <span className={`truncate text-xs font-medium ${isCompleted ? "text-gray-400 line-through" : "text-gray-500"}`}>
                                {lesson.title || "Untitled"}
                            </span>
                        </button>
                    );
                })}
            </div>

            {totalLessons > 2 && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-3 text-xs font-bold hover:underline"
                    style={{ color: TEAL }}
                >
                    {expanded ? "Show Less" : `Show All (${totalLessons} lessons)`}
                </button>
            )}
        </div>
    );
}

export default function LecturesSection({
    modules = [],
    completedLessonIds = [],
    onLessonComplete,
    isEnrolled
}) {
    const [page, setPage] = useState(1);
    const itemsPerPage = 6;
    const totalPages = Math.ceil((modules?.length || 0) / itemsPerPage);

    const paginatedModules = modules?.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    ) || [];

    if (!modules || modules.length === 0) {
        return (
            <div className="text-center py-8 text-gray-400">
                No lectures available for this course.
            </div>
        );
    }

    return (
        <div>
            <h2 className="mb-4 text-lg font-bold text-gray-900">
                Lectures ({modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)})
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {paginatedModules.map((module, i) => (
                    <LectureCard
                        key={module.id || i}
                        module={module}
                        completedLessonIds={completedLessonIds}
                        onLessonComplete={onLessonComplete}
                        isEnrolled={isEnrolled}
                    />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-1.5">
                    <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 disabled:opacity-50"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                        <button
                            key={n}
                            onClick={() => setPage(n)}
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${page === n
                                    ? "bg-[#34C79D] text-white"
                                    : "text-gray-400 hover:bg-gray-100"
                                }`}
                        >
                            {n}
                        </button>
                    ))}
                    <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 disabled:opacity-50"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    );
}