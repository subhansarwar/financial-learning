"use client";

import { ChevronLeft, ChevronRight, MessageSquare, PlayCircle } from "lucide-react";
import { useState } from "react";
import ProgressRing from "./ProgressRing";

const TEAL = "#34C79D";
const GOLD = "#F2B84B";
const PURPLE = "#7C6AE8";

// ===== DATA =====
const LECTURES = [
    {
        title: "UX Design Principles",
        meta: "26Min · 5 Lessons",
        progress: 100,
        tone: TEAL,
        lessons: [
            { title: "UI Introduction", meta: "Jakob's Law - Other Pages" },
            { title: "Consistency is Key", meta: "6 Comments" },
        ],
    },
    {
        title: "UX Design Principles",
        meta: "26Min · 5 Lessons",
        progress: 100,
        tone: GOLD,
        lessons: [
            { title: "UI Introduction", meta: "Jakob's Law - Other Pages" },
            { title: "Consistency is Key", meta: "6 Comments" },
        ],
    },
    {
        title: "UI Introduction",
        meta: "26Min · 5 Lessons",
        progress: 12,
        tone: PURPLE,
        lessons: [
            { title: "Jakob's Law - Other Pages", meta: "Consistency is Key" },
            { title: "6 Comments", meta: "" },
        ],
    },
    {
        title: "UX Design Principles",
        meta: "26Min · 5 Lessons",
        progress: 0,
        tone: TEAL,
        lessons: [
            { title: "UI Introduction", meta: "Jakob's Law - Other Pages" },
            { title: "Consistency is Key", meta: "6 Comments" },
        ],
    },
    {
        title: "UX Design Principles",
        meta: "26Min · 5 Lessons",
        progress: 0,
        tone: GOLD,
        lessons: [
            { title: "UI Introduction", meta: "Jakob's Law - Other Pages" },
            { title: "Consistency is Key", meta: "6 Comments" },
        ],
    },
    {
        title: "UI Introduction",
        meta: "26Min · 5 Lessons",
        progress: 0,
        tone: PURPLE,
        lessons: [
            { title: "Jakob's Law - Other Pages", meta: "Consistency is Key" },
            { title: "6 Comments", meta: "" },
        ],
    },
];

function LectureCard({ lecture }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-gray-900">{lecture.title}</p>
                    <p className="mt-0.5 text-xs text-gray-400">{lecture.meta}</p>
                </div>
                <ProgressRing
                    value={lecture.progress}
                    size={40}
                    strokeWidth={4}
                    color={lecture.tone}
                    trackColor="#F1F1F1"
                    labelColor="#1F2937"
                />
            </div>

            <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
                {lecture.lessons.map((l, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                        {i === 0 ? (
                            <PlayCircle className="h-3.5 w-3.5 shrink-0" style={{ color: lecture.tone }} />
                        ) : (
                            <MessageSquare className="h-3.5 w-3.5 shrink-0 text-gray-300" />
                        )}
                        <span className="truncate text-xs font-medium text-gray-500">{l.title}</span>
                    </div>
                ))}
            </div>

            <button
                onClick={() => setExpanded(!expanded)}
                className="mt-3 text-xs font-bold hover:underline"
                style={{ color: lecture.tone }}
            >
                {expanded ? "Show Less" : "Show More"}
            </button>
        </div>
    );
}

export default function LecturesSection() {
    const [page, setPage] = useState(1);
    const totalPages = 5;

    return (
        <div>
            <h2 className="mb-4 text-lg font-bold text-gray-900">Lectures (26)</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {LECTURES.map((lecture, i) => (
                    <LectureCard key={i} lecture={lecture} />
                ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-center gap-1.5">
                <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                        key={n}
                        onClick={() => setPage(n)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                        style={
                            page === n
                                ? { background: TEAL, color: "#FFFFFF" }
                                : { color: "#9CA3AF" }
                        }
                    >
                        {n}
                    </button>
                ))}
                <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}