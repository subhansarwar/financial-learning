// app/course/[slug]/CourseClient.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { progress, gating, toast, esc, fmtMin } from "@/lib/app";

const typeIcon = {
    reading: "📖",
    video: "▶️",
    quiz: "✍️"
};

export default function CourseClient({ slug, course, topic }) {
    const [mounted, setMounted] = useState(false);
    const [courseProgress, setCourseProgress] = useState(null);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [moduleStates, setModuleStates] = useState({});
    const modules = Array.isArray(course?.modules) ? course.modules : [];
    const gated = !!course?.gated;
    const needPct = gating.passPct(course);

    // Safe flatMap - only if modules is array
    const lessons = modules.flatMap(m => m?.lessons || []) || [];

    useEffect(() => {
        setMounted(true);
        if (!course || modules.length === 0) {
            return;
        }
        // Get progress from localStorage
        const stats = progress.stats(slug, course);
        const prog = progress.course(slug);
        const done = prog.done || [];

        setCourseProgress(stats);
        setCompletedLessons(done);

        // Check module lock states
        const states = {};
        course.modules?.forEach((m, i) => {
            const locked = gated && gating.isModuleLocked(slug, course, i);
            const passed = gated && gating.modulePassed(slug, m);
            states[m.id] = { locked, passed };
        });
        setModuleStates(states);

    }, [slug, course, gated]);

    // Mark lesson as complete
    const markComplete = (lessonId) => {
        if (!completedLessons.includes(lessonId)) {
            progress.complete(slug, lessonId);
            setCompletedLessons([...completedLessons, lessonId]);

            // Update progress
            const stats = progress.stats(slug, course);
            setCourseProgress(stats);

            toast("Lesson marked complete ✓");
        }
    };

    if (!mounted) {
        return <div className="text-muted">Loading course content...</div>;
    }
    if (modules?.length === 0) {
        return (
            <div className="empty-state">
                <div className="big">📚</div>
                <p><b>No course content available.</b></p>
                <p className="text-muted">This course is being prepared.</p>
            </div>
        );
    }
    return (
        <div id="modulesList">
            {modules?.map((m, i) => {
                if (!m) return null;

                const moduleLessons = Array.isArray(m.lessons) ? m.lessons : [];
                const mins = moduleLessons.reduce((n, l) => n + (l?.durationMin || 0), 0);
                const state = moduleStates[m.id] || { locked: false, passed: false };
                const locked = state.locked;
                const passed = state.passed;
                const quizIds = gating.moduleQuizIds(m);
                const best = quizIds.length ? progress.quizScore(slug, quizIds[0]) : null;

                let status;
                if (locked) {
                    status = `<span class="m-lock">🔒 Score ${needPct}%+ in module ${i + 1}</span>`;
                } else if (passed && best) {
                    status = `<span class="m-pass">✓ Passed (${best.pct}%)</span>`;
                } else {
                    status = `<span class="m-meta">${moduleLessons.length} lessons · ${fmtMin(mins)}</span>`;
                }


                return (
                    <div
                        key={m.id}
                        className={`module-block ${i === 0 ? "open" : ""} ${locked ? "locked" : ""}`}
                        data-mod={m.id}
                    >
                        <button
                            className="module-head"
                            aria-expanded={i === 0}
                            disabled={locked}
                            onClick={() => {
                                if (locked) {
                                    toast(`🔒 Pass the previous module's quiz at ${needPct}%+ to unlock this one`);
                                    return;
                                }
                                const block = document.querySelector(`[data-mod="${m.id}"]`);
                                block.classList.toggle("open");
                                const btn = block.querySelector(".module-head");
                                btn.setAttribute("aria-expanded", block.classList.contains("open"));
                            }}
                        >
                            <span className="m-num">{locked ? "🔒" : i + 1}</span>
                            <h3>{esc(m.title)}</h3>
                            <span dangerouslySetInnerHTML={{ __html: status }} />
                            <span className="chev">▾</span>
                        </button>
                        <div className="lesson-list">
                            {/* Use moduleLessons instead of m.lessons */}
                            {moduleLessons.map(l => {
                                if (!l) return null;
                                const done = completedLessons.includes(l.id);
                                if (locked) {
                                    return (
                                        <span key={l.id} className="lesson-row is-locked">
                                            <span className={`l-icon ${l.type}`}>{typeIcon[l.type] || "📖"}</span>
                                            <span className="l-title">{esc(l.title)}</span>
                                            <span className="l-dur">{fmtMin(l.durationMin)}</span>
                                            <span className="l-done"></span>
                                        </span>
                                    );
                                }
                                return (
                                    <Link
                                        key={l.id}
                                        className={`lesson-row ${done ? "done" : ""}`}
                                        href={`/lesson/${slug}--${l.id}`}
                                    >
                                        <span className={`l-icon ${l.type}`}>{typeIcon[l.type] || "📖"}</span>
                                        <span className="l-title">{esc(l.title)}</span>
                                        <span className="l-dur">{fmtMin(l.durationMin)}</span>
                                        <span className="l-done">{done ? "✓" : ""}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}