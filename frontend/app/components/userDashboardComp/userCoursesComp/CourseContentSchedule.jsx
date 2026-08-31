// app/components/userDashboardComp/userCoursesComp/CourseContentSchedule.jsx
"use client";

import { CheckCircle2, ChevronDown, MessageSquare, PlayCircle } from "lucide-react";
import { useState } from "react";

const TEAL = "#34C79D";

function AccordionItem({ module, isOpen, onToggle, onLessonComplete, completedLessonIds, isEnrolled }) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white">
            <button
                onClick={onToggle}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
                <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-gray-900">{module.title || "Untitled Module"}</p>
                    <p className="mt-0.5 text-xs text-gray-400">
                        {module.lessons?.length || 0} lessons
                    </p>
                </div>
                <ChevronDown
                    className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </button>
            {isOpen && module.lessons?.length > 0 && (
                <div className="space-y-1 border-t border-gray-100 px-5 pb-4 pt-2">
                    {module.lessons.map((lesson) => {
                        const isCompleted = completedLessonIds?.includes(lesson.id);
                        return (
                            <button
                                key={lesson.id}
                                onClick={() => onLessonComplete(lesson.id)}
                                disabled={!isEnrolled || isCompleted}
                                className="flex w-full items-center justify-between gap-3 py-1.5 hover:bg-gray-50 rounded px-2 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <div className="flex min-w-0 items-center gap-2.5">
                                    {isCompleted ? (
                                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                                    ) : (
                                        <PlayCircle className="h-4 w-4 shrink-0" style={{ color: TEAL }} />
                                    )}
                                    <span className={`truncate text-sm ${isCompleted ? "text-gray-400 line-through" : "text-gray-600"}`}>
                                        {lesson.title || "Untitled Lesson"}
                                    </span>
                                </div>
                                <span className="shrink-0 text-xs font-medium text-gray-400">
                                    {lesson.duration_min || 0} min
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default function CourseContentSchedule({
    modules = [],
    completedLessonIds = [],
    onLessonComplete,
    isEnrolled,
    outcomes = []
}) {
    const [openIndex, setOpenIndex] = useState(0);

    if (!modules || modules.length === 0) {
        return (
            <div className="text-center py-8 text-gray-400">
                No content available for this course.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
            {/* Course Content */}
            <div>
                <h2 className="mb-4 text-lg font-bold text-gray-900">Course Content</h2>
                <div className="space-y-3">
                    {modules.map((module, i) => (
                        <AccordionItem
                            key={module.id || i}
                            module={module}
                            isOpen={openIndex === i}
                            onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                            onLessonComplete={onLessonComplete}
                            completedLessonIds={completedLessonIds}
                            isEnrolled={isEnrolled}
                        />
                    ))}
                </div>
            </div>

            {/* What You'll Learn */}
            <div>
                <h2 className="mb-4 text-lg font-bold text-gray-900">What You'll Learn</h2>
                <div className="rounded-2xl border border-gray-100 bg-white p-5">
                    {outcomes && outcomes.length > 0 ? (
                        <ul className="space-y-4">
                            {outcomes.map((outcome, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0" style={{ color: TEAL }} />
                                    <span className="text-sm leading-relaxed text-gray-600">{outcome}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-400">No learning outcomes listed yet.</p>
                    )}
                    <div className="mt-5 flex items-center gap-2 border-t border-gray-100 pt-4 text-xs text-gray-400">
                        <MessageSquare className="h-3.5 w-3.5" />
                        Have questions about this course? Ask in the comments.
                    </div>
                </div>
            </div>
        </div>
    );
}