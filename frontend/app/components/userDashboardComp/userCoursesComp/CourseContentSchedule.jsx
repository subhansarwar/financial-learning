"use client";

import { CheckCircle2, ChevronDown, MessageSquare, PlayCircle } from "lucide-react";
import { useState } from "react";

const TEAL = "#34C79D";

// ===== DATA =====
const CONTENT_SECTIONS = [
    {
        title: "UX Design Principles",
        meta: "80Min · 6 Comments",
        lessons: [
            { title: "UI Introduction", duration: "20:00" },
            { title: "Jakob's Law - Other Pages", duration: "25:00" },
            { title: "Consistency is Key", duration: "18:00" },
            { title: "How to Use - Choose and Locator", duration: "22:00" },
            { title: "The Regal Hierarchy 4", duration: "15:00" },
            { title: "A Word About Dopamine and Ethical Design", duration: "10:40" },
        ],
    },
    { title: "UI Design Principles", meta: "45Min · 4 Comments", lessons: [] },
    { title: "Understanding 8pt Spacing System", meta: "30Min · 2 Comments", lessons: [] },
    { title: "Intro to Grids", meta: "35Min · 3 Comments", lessons: [] },
    { title: "Scaling Typography in UI Design", meta: "28Min · 1 Comment", lessons: [] },
];

const LEARNING_POINTS = [
    "Improve the structure of your design by understanding UI theory",
    "Improve your design skills by understanding UI theory",
    "Improve your design knowledge and quality by understanding UI theory",
    "Improve your design execution with your UI/UX theory",
];

function AccordionItem({ section, isOpen, onToggle }) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white">
            <button
                onClick={onToggle}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
                <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-gray-900">{section.title}</p>
                    <p className="mt-0.5 text-xs text-gray-400">{section.meta}</p>
                </div>
                <ChevronDown
                    className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </button>
            {isOpen && section.lessons.length > 0 && (
                <div className="space-y-1 border-t border-gray-100 px-5 pb-4 pt-2">
                    {section.lessons.map((l) => (
                        <div key={l.title} className="flex items-center justify-between gap-3 py-1.5">
                            <div className="flex min-w-0 items-center gap-2.5">
                                <PlayCircle className="h-4 w-4 shrink-0" style={{ color: TEAL }} />
                                <span className="truncate text-sm text-gray-600">{l.title}</span>
                            </div>
                            <span className="shrink-0 text-xs font-medium text-gray-400">{l.duration}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function CourseContentSchedule() {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
            {/* Course Content and Schedule */}
            <div>
                <h2 className="mb-4 text-lg font-bold text-gray-900">Course Content and Schedule</h2>
                <div className="space-y-3">
                    {CONTENT_SECTIONS.map((section, i) => (
                        <AccordionItem
                            key={section.title}
                            section={section}
                            isOpen={openIndex === i}
                            onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                        />
                    ))}
                </div>
            </div>

            {/* What You'll Learn */}
            <div>
                <h2 className="mb-4 text-lg font-bold text-gray-900">What You'll Learn</h2>
                <div className="rounded-2xl border border-gray-100 bg-white p-5">
                    <ul className="space-y-4">
                        {LEARNING_POINTS.map((point) => (
                            <li key={point} className="flex items-start gap-3">
                                <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0" style={{ color: TEAL }} />
                                <span className="text-sm leading-relaxed text-gray-600">{point}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-5 flex items-center gap-2 border-t border-gray-100 pt-4 text-xs text-gray-400">
                        <MessageSquare className="h-3.5 w-3.5" />
                        Have questions about this course? Ask in the comments.
                    </div>
                </div>
            </div>
        </div>
    );
}