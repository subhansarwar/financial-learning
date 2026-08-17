// app/lesson/[slug]/LessonClient.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { progress, gating, toast, esc, fmtMin, md } from "@/lib/app";
import { downloadCertificate } from "@/lib/cert";

const typeIcon = {
    reading: "📖",
    video: "▶️",
    quiz: "✍️"
};

export default function LessonClient({
    course,
    slug,
    lesson,
    module,
    prevLesson,
    nextLesson,
    isLocked: initialIsLocked
}) {
    const [isLocked, setIsLocked] = useState(initialIsLocked);
    const [isComplete, setIsComplete] = useState(false);
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizPassed, setQuizPassed] = useState(false);
    const [quizScore, setQuizScore] = useState(0);
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        // Check if lesson is locked
        if (course.gated) {
            const locked = gating.isLessonLocked(slug, course, lesson.id);
            setIsLocked(locked);
            if (locked) {
                toast("🔒 This module is locked — pass the previous module's quiz first");
            }
        }

        // Check if lesson is complete
        const done = progress.isDone(slug, lesson.id);
        setIsComplete(done);

        // Ensure progress exists
        progress.ensure(slug);

        // Check quiz score if this is a quiz lesson
        if (lesson.type === "quiz") {
            const score = progress.quizScore(slug, lesson.id);
            if (score) {
                setQuizSubmitted(true);
                setQuizPassed(score.passed);
                setQuizScore(score.pct);
            }
        }
    }, [slug, course, lesson]);

    // Handle marking lesson as complete
    const markComplete = () => {
        if (isLocked) {
            toast("🔒 This lesson is locked");
            return;
        }
        progress.complete(slug, lesson.id);
        setIsComplete(true);

        const stats = progress.markCompletedIfDone(slug, course);
        if (stats.complete) {
            toast("🎉 Course complete! Download your certificate.");
        } else {
            toast("✓ Lesson marked complete");
        }
    };

    // Handle quiz submission
    const handleQuizSubmit = (correct, total, passed) => {
        const pct = Math.round((correct / total) * 100);
        progress.recordQuiz(slug, lesson.id, pct, passed);
        setQuizSubmitted(true);
        setQuizPassed(passed);
        setQuizScore(pct);

        if (passed) {
            // Mark lesson as complete if quiz passed
            progress.complete(slug, lesson.id);
            setIsComplete(true);
            toast("🎉 Quiz passed! Lesson complete.");
        } else {
            toast(`❌ Score: ${pct}% — need ${lesson.quiz?.passPct || 70}% to pass`);
        }
    };

    // Handle certificate download
    const handleDownloadCert = () => {
        downloadCertificate(slug, course);
    };

    // If locked, show locked message
    if (isLocked) {
        return (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: "3rem" }}>🔒</div>
                <h2>This lesson is locked</h2>
                <p className="text-muted">
                    Pass the previous module's quiz to unlock this lesson.
                </p>
                <a
                    className="btn btn-primary mt-2"
                    href={`/course/${slug}`}
                >
                    Back to course
                </a>
            </div>
        );
    }

    // If course is complete, show completion message
    const courseStats = progress.stats(slug, course);
    if (courseStats.complete && isComplete) {
        return (
            <div style={{ textAlign: "center", padding: "30px 10px" }}>
                <div style={{ fontSize: "3.4rem" }}>🎓</div>
                <h1 style={{ margin: "14px 0 8px" }}>Course complete!</h1>
                <p className="text-muted" style={{ maxWidth: "46ch", margin: "0 auto 26px" }}>
                    You finished every lesson in <b>{course.title}</b>.
                    Download your free certificate of completion — nice work.
                </p>
                <button className="btn btn-emerald" onClick={handleDownloadCert}>
                    Download certificate (PDF)
                </button>
                <div className="mt-2">
                    <a href={`/course/${slug}`}>Back to course page</a>
                </div>
            </div>
        );
    }

    // Render lesson content based on type
    const renderContent = () => {
        const kicker = (
            <div className="lesson-kicker">
                <span className="pill">{module?.title || "Lesson"}</span>
                <span>{typeIcon[lesson.type]} {lesson.type?.charAt(0).toUpperCase() + lesson.type?.slice(1)}</span>
                <span>·</span>
                <span>{fmtMin(lesson.durationMin)}</span>
            </div>
        );

        const navActions = (extra) => (
            <div className="lesson-actions">
                {prevLesson ? (
                    <a
                        className="btn btn-outline btn-sm"
                        href={`/lesson/${slug}--${prevLesson.id}`}
                    >
                        ← Previous
                    </a>
                ) : null}
                <span className="spacer"></span>
                {extra || null}
                {nextLesson ? (
                    <a
                        className="btn btn-outline btn-sm"
                        href={`/lesson/${slug}--${nextLesson.id}`}
                    >
                        Next →
                    </a>
                ) : (
                    <a
                        className="btn btn-outline btn-sm"
                        href={`/course/${slug}`}
                    >
                        Back to course
                    </a>
                )}
            </div>
        );

        // Reading lesson
        if (lesson.type === "reading") {
            return (
                <>
                    {kicker}
                    <h1>{esc(lesson.title)}</h1>
                    <div className="prose" dangerouslySetInnerHTML={{ __html: md(lesson.content || "") }} />
                    {navActions(
                        isComplete ? (
                            <span className="pill" style={{ alignSelf: "center" }}>✓ Completed</span>
                        ) : (
                            <button className="btn btn-primary btn-sm" onClick={markComplete}>
                                Mark as complete ✓
                            </button>
                        )
                    )}
                </>
            );
        }

        // Video lesson
        if (lesson.type === "video") {
            return (
                <>
                    {kicker}
                    <h1>{esc(lesson.title)}</h1>
                    <div className="prose">
                        <p>{esc(lesson.content || "")}</p>
                    </div>
                    <div className="video-frame">
                        <iframe
                            src={esc(lesson.videoUrl || "")}
                            title={esc(lesson.title)}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            loading="lazy"
                        />
                    </div>
                    {navActions(
                        isComplete ? (
                            <span className="pill" style={{ alignSelf: "center" }}>✓ Completed</span>
                        ) : (
                            <button className="btn btn-primary btn-sm" onClick={markComplete}>
                                I watched it — mark complete ✓
                            </button>
                        )
                    )}
                </>
            );
        }

        // Quiz lesson
        if (lesson.type === "quiz") {
            return (
                <>
                    {kicker}
                    <h1>{esc(lesson.title)}</h1>
                    <QuizRenderer
                        quiz={lesson.quiz}
                        slug={slug}
                        lessonId={lesson.id}
                        onQuizSubmit={handleQuizSubmit}
                        isSubmitted={quizSubmitted}
                        isPassed={quizPassed}
                        score={quizScore}
                        nextLesson={nextLesson}
                    />
                    {navActions(null)}
                </>
            );
        }

        return <div>Unknown lesson type</div>;
    };

    return renderContent();
}

// Quiz Renderer Component
function QuizRenderer({ quiz, slug, lessonId, onQuizSubmit, isSubmitted, isPassed, score, nextLesson }) {
    const [answers, setAnswers] = useState([]);
    const [selected, setSelected] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);

    useEffect(() => {
        if (quiz?.questions) {
            setAnswers(new Array(quiz.questions.length).fill(null));
        }
    }, [quiz]);

    const handleOptionSelect = (questionIndex, optionIndex) => {
        if (showResults) return;
        const newAnswers = [...answers];
        newAnswers[questionIndex] = optionIndex;
        setAnswers(newAnswers);

        const newSelected = { ...selected };
        newSelected[questionIndex] = optionIndex;
        setSelected(newSelected);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if all questions are answered
        if (answers.includes(null)) {
            toast("Please answer all questions");
            return;
        }

        // Calculate correct answers
        let correct = 0;
        quiz.questions.forEach((q, i) => {
            if (answers[i] === q.answer) {
                correct++;
            }
        });

        setCorrectCount(correct);
        setShowResults(true);

        const total = quiz.questions.length;
        const passed = (correct / total) * 100 >= quiz.passPct;

        onQuizSubmit(correct, total, passed);
    };

    const handleRetry = () => {
        setShowResults(false);
        setAnswers(new Array(quiz.questions.length).fill(null));
        setSelected({});
    };

    if (!quiz || !quiz.questions) {
        return <div className="text-muted">Quiz not available</div>;
    }

    if (isSubmitted && isPassed) {
        return (
            <div className="quiz-result pass">
                <div className="score">{score}%</div>
                <p><b>You passed — lesson complete! 🎉</b></p>
                <p className="text-muted">
                    {correctCount} of {quiz.questions.length} correct. Best score is kept.
                </p>
                {nextLesson ? (
                    <a
                        className="btn btn-emerald mt-2"
                        href={`/lesson/${slug}--${nextLesson.id}`}
                    >
                        Continue to next lesson →
                    </a>
                ) : (
                    <a
                        className="btn btn-emerald mt-2"
                        href={`/course/${slug}`}
                    >
                        Finish course
                    </a>
                )}
            </div>
        );
    }

    if (isSubmitted && !isPassed) {
        return (
            <div className="quiz-result fail">
                <div className="score">{score}%</div>
                <p><b>Not yet — {quiz.passPct}% needed to pass.</b></p>
                <p className="text-muted">
                    {correctCount} of {quiz.questions.length} correct. Best score is kept.
                </p>
                <button className="btn btn-primary mt-2" onClick={handleRetry}>
                    Review & retry
                </button>
            </div>
        );
    }

    return (
        <>
            <p className="text-muted" style={{ marginBottom: "22px" }}>
                {quiz.questions.length} questions · pass at {quiz.passPct}% or higher
            </p>
            <form id="quizForm" onSubmit={handleSubmit}>
                {quiz.questions.map((q, qi) => (
                    <div className="quiz-q" data-q={qi} key={qi}>
                        <p className="q-text">
                            <span className="q-num">Q{qi + 1}.</span>
                            {esc(q.q)}
                        </p>
                        {q.choices.map((c, ci) => (
                            <button
                                key={ci}
                                type="button"
                                className={`quiz-opt ${selected[qi] === ci ? "selected" : ""}`}
                                onClick={() => handleOptionSelect(qi, ci)}
                                disabled={showResults}
                            >
                                <span className="opt-letter">{["A", "B", "C", "D"][ci]}</span>
                                <span>{esc(c)}</span>
                            </button>
                        ))}
                        <div className="quiz-explain" id={`ex${qi}`}></div>
                    </div>
                ))}
                <button
                    className="btn btn-primary"
                    type="submit"
                    id="submitQuiz"
                    disabled={answers.includes(null)}
                >
                    Check answers
                </button>
            </form>
            <div id="quizResult"></div>
        </>
    );
}