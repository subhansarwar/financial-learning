// app/lesson/[slug]/LessonClient.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
    BookOpen,
    PlayCircle,
    FileText,
    HelpCircle,
    CheckCircle2,
    Lock,
    Unlock,
    ChevronLeft,
    ChevronRight,
    Award,
    Clock,
    Layers,
    AlertCircle,
    Check,
    X,
    Sparkles,
    GraduationCap,
    Download,
    RefreshCw,
    ArrowLeft,
    ArrowRight,
    BarChart3,
    Target,
    Star,
} from "lucide-react";

const typeIconMap = {
    reading: { icon: BookOpen, color: "text-blue-500", label: "Reading" },
    video: { icon: PlayCircle, color: "text-rose-500", label: "Video" },
    quiz: { icon: HelpCircle, color: "text-amber-500", label: "Quiz" },
};

export default function LessonClient({
    course,
    slug,
    lesson,
    module: currentModule,
    prevLesson,
    nextLesson,
    isLocked: initialIsLocked,
    allLessons,
    currentIndex,
}) {
    const [isLocked, setIsLocked] = useState(initialIsLocked);
    const [isComplete, setIsComplete] = useState(false);
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizPassed, setQuizPassed] = useState(false);
    const [quizScore, setQuizScore] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [courseProgress, setCourseProgress] = useState({ done: [], total: 0, pct: 0 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Check lesson completion and quiz scores from localStorage
        if (typeof window !== "undefined") {
            const data = JSON.parse(localStorage.getItem("finlearn.v1") || "{}");
            const done = data?.courses?.[slug]?.done || [];
            setIsComplete(done.includes(lesson.id));

            // Check quiz score
            if (lesson.type === "quiz") {
                const scores = data?.courses?.[slug]?.quizScores || {};
                const score = scores[lesson.id];
                if (score) {
                    setQuizSubmitted(true);
                    setQuizPassed(score.passed);
                    setQuizScore(score.pct);
                }
            }

            // Calculate course progress
            const totalLessons = allLessons?.length || 0;
            const completedCount = done.length;
            setCourseProgress({
                done: done,
                total: totalLessons,
                pct: totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0,
            });
        }
    }, [slug, lesson, allLessons]);

    const markComplete = () => {
        if (isLocked) {
            toast.error("This lesson is locked");
            return;
        }

        if (typeof window !== "undefined") {
            const data = JSON.parse(localStorage.getItem("finlearn.v1") || "{}");
            if (!data.courses) data.courses = {};
            if (!data.courses[slug]) data.courses[slug] = { done: [] };
            if (!data.courses[slug].done.includes(lesson.id)) {
                data.courses[slug].done.push(lesson.id);
                localStorage.setItem("finlearn.v1", JSON.stringify(data));
                setIsComplete(true);

                // Update progress
                const totalLessons = allLessons?.length || 0;
                const completedCount = data.courses[slug].done.length;
                setCourseProgress({
                    done: data.courses[slug].done,
                    total: totalLessons,
                    pct: totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0,
                });

                toast.success("Lesson completed!");
            }
        }
    };

    const handleQuizSubmit = (correct, total, passed) => {
        const pct = Math.round((correct / total) * 100);
        setCorrectCount(correct);
        setQuizSubmitted(true);
        setQuizPassed(passed);
        setQuizScore(pct);

        if (typeof window !== "undefined") {
            const data = JSON.parse(localStorage.getItem("finlearn.v1") || "{}");
            if (!data.courses) data.courses = {};
            if (!data.courses[slug]) data.courses[slug] = { done: [], quizScores: {} };
            if (!data.courses[slug].quizScores) data.courses[slug].quizScores = {};
            data.courses[slug].quizScores[lesson.id] = { pct, passed };

            if (passed && !data.courses[slug].done.includes(lesson.id)) {
                data.courses[slug].done.push(lesson.id);
                // Update progress
                const totalLessons = allLessons?.length || 0;
                const completedCount = data.courses[slug].done.length;
                setCourseProgress({
                    done: data.courses[slug].done,
                    total: totalLessons,
                    pct: totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0,
                });
            }
            localStorage.setItem("finlearn.v1", JSON.stringify(data));
        }

        if (passed) {
            setIsComplete(true);
            toast.success(`Quiz passed! Score: ${pct}%`);
        } else {
            toast.error(`Score: ${pct}% need ${lesson.quiz?.passPct || 70}% to pass`);
        }
    };

    // Check if course is complete
    const courseComplete = courseProgress.total > 0 && courseProgress.done.length === courseProgress.total;

    // Show loading state
    if (!mounted) {
        return (
            <div className="flex min-h-[400px] items-center justify-center rounded-xl2 border border-line bg-card p-8">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-soft border-t-brand-deep" />
                </div>
            </div>
        );
    }

    if (isLocked) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl2 border border-line bg-card p-8 text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50">
                    <Lock className="h-10 w-10 text-amber-500" strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-bold text-ink">This lesson is locked</h2>
                <p className="mt-2 max-w-sm text-muted">
                    Pass the previous module's quiz to unlock this lesson.
                </p>
                <a
                    href={`/course/${slug}`}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-deep px-6 py-3 font-bold text-white hover:bg-[#241f6b]"
                >
                    <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
                    Back to course
                </a>
            </div>
        );
    }

    if (courseComplete && isComplete) {
        return (
            <div className="flex min-h-[500px] flex-col items-center justify-center rounded-xl2 border border-emerald-200 bg-emerald-50/30 p-8 text-center">
                <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
                    <GraduationCap className="h-12 w-12 text-emerald-600" strokeWidth={1.5} />
                </div>
                <h1 className="text-3xl font-extrabold text-ink">Course Complete!</h1>
                <p className="mt-3 max-w-md text-lg text-ink-2">
                    You finished every lesson in <span className="font-bold">{course.title}</span>.
                    Download your free certificate of completion nice work!
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <button
                        onClick={() => {
                            toast.success("Certificate downloaded!");
                        }}
                        className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 font-bold text-white transition-colors hover:bg-emerald-700"
                    >
                        <Download className="h-4 w-4" strokeWidth={2.5} />
                        Download Certificate (PDF)
                    </button>
                    <a
                        href={`/course/${slug}`}
                        className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-6 py-3 font-bold text-ink-2 transition-colors hover:border-brand/40 hover:text-brand-deep"
                    >
                        Back to course
                    </a>
                </div>
            </div>
        );
    }

    // Render lesson content
    const renderContent = () => {
        const { icon: Icon, color, label } = typeIconMap[lesson.type] || typeIconMap.reading;

        const Navigation = ({ extra }) => (
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line-soft pt-6">
                <div className="flex flex-wrap items-center gap-2">
                    {prevLesson ? (
                        <a
                            href={`/lesson/${slug}--${prevLesson.id}`}
                            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-4 py-2 text-sm font-bold text-ink-2 transition-colors hover:border-brand/40 hover:bg-brand-soft/30 hover:text-brand-deep"
                        >
                            <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
                            Previous
                        </a>
                    ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {extra}
                    {nextLesson ? (
                        <a
                            href={`/lesson/${slug}--${nextLesson.id}`}
                            className="inline-flex items-center gap-1.5 rounded-full bg-brand-deep px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#241f6b]"
                        >
                            Next
                            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                        </a>
                    ) : (
                        <a
                            href={`/course/${slug}`}
                            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-4 py-2 text-sm font-bold text-ink-2 transition-colors hover:border-brand/40 hover:text-brand-deep"
                        >
                            <BookOpen className="h-4 w-4" strokeWidth={2.5} />
                            Back to course
                        </a>
                    )}
                </div>
            </div>
        );

        // Reading lesson
        if (lesson.type === "reading") {
            return (
                <>
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-deep">
                            <Icon className={`h-3.5 w-3.5 ${color}`} strokeWidth={2.5} />
                            {label}
                        </span>
                        <span className="text-sm text-muted">{lesson.durationMin} min read</span>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl lg:text-4xl">
                        {lesson.title}
                    </h1>
                    <div
                        className="prose prose-ink mt-6 max-w-none"
                        dangerouslySetInnerHTML={{ __html: lesson.content || "" }}
                    />
                    <Navigation
                        extra={
                            isComplete ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-600">
                                    <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />
                                    Completed
                                </span>
                            ) : (
                                <button
                                    onClick={markComplete}
                                    className="inline-flex items-center gap-1.5 rounded-full bg-brand-deep px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#241f6b]"
                                >
                                    <Check className="h-4 w-4" strokeWidth={2.5} />
                                    Mark complete
                                </button>
                            )
                        }
                    />
                </>
            );
        }

        // Video lesson
        if (lesson.type === "video") {
            return (
                <>
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-deep">
                            <PlayCircle className={`h-3.5 w-3.5 text-rose-500`} strokeWidth={2.5} />
                            Video
                        </span>
                        <span className="text-sm text-muted">{lesson.durationMin} min</span>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl lg:text-4xl">
                        {lesson.title}
                    </h1>
                    {lesson.content && (
                        <p className="mt-2 text-base text-ink-2">{lesson.content}</p>
                    )}
                    {lesson.videoUrl && (
                        <div className="mt-4 overflow-hidden rounded-xl2 bg-black aspect-video">
                            <iframe
                                src={lesson.videoUrl}
                                title={lesson.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                loading="lazy"
                                className="h-full w-full"
                            />
                        </div>
                    )}
                    <Navigation
                        extra={
                            isComplete ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-600">
                                    <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />
                                    Watched
                                </span>
                            ) : (
                                <button
                                    onClick={markComplete}
                                    className="inline-flex items-center gap-1.5 rounded-full bg-brand-deep px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#241f6b]"
                                >
                                    <Check className="h-4 w-4" strokeWidth={2.5} />
                                    I watched it
                                </button>
                            )
                        }
                    />
                </>
            );
        }

        // Quiz lesson
        if (lesson.type === "quiz") {
            return (
                <>
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-deep">
                            <HelpCircle className="h-3.5 w-3.5 text-amber-500" strokeWidth={2.5} />
                            Quiz
                        </span>
                        <span className="text-sm text-muted">
                            {lesson.quiz?.questions?.length || 0} questions
                        </span>
                        <span className="text-sm text-muted">
                            Pass at {lesson.quiz?.passPct || 70}%
                        </span>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl lg:text-4xl">
                        {lesson.title}
                    </h1>
                    <QuizRenderer
                        quiz={lesson.quiz}
                        slug={slug}
                        lessonId={lesson.id}
                        onQuizSubmit={handleQuizSubmit}
                        isSubmitted={quizSubmitted}
                        isPassed={quizPassed}
                        score={quizScore}
                        correctCount={correctCount}
                        nextLesson={nextLesson}
                    />
                    <Navigation extra={null} />
                </>
            );
        }

        return <div>Unknown lesson type</div>;
    };

    return (
        <div className="rounded-xl2 border border-line bg-card p-5 shadow-card sm:p-6 lg:p-8">
            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-muted">Course progress</span>
                    <span className="font-bold text-brand-deep">{courseProgress.pct}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-cream-2">
                    <div
                        className="h-full rounded-full bg-brand transition-all duration-500"
                        style={{ width: `${courseProgress.pct}%` }}
                    />
                </div>
            </div>

            {renderContent()}
        </div>
    );
}

// Quiz Renderer Component
function QuizRenderer({
    quiz,
    slug,
    lessonId,
    onQuizSubmit,
    isSubmitted,
    isPassed,
    score,
    correctCount,
    nextLesson,
}) {
    const [answers, setAnswers] = useState([]);
    const [selected, setSelected] = useState({});
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        if (quiz?.questions) {
            setAnswers(new Array(quiz.questions.length).fill(null));
        }
    }, [quiz]);

    const handleOptionSelect = (questionIndex, optionIndex) => {
        if (showResults || isSubmitted) return;
        const newAnswers = [...answers];
        newAnswers[questionIndex] = optionIndex;
        setAnswers(newAnswers);
        setSelected({ ...selected, [questionIndex]: optionIndex });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (answers.includes(null)) {
            toast.error("Please answer all questions");
            return;
        }

        let correct = 0;
        quiz.questions.forEach((q, i) => {
            if (answers[i] === q.answer) correct++;
        });

        setShowResults(true);
        onQuizSubmit(correct, quiz.questions.length, (correct / quiz.questions.length) * 100 >= quiz.passPct);
    };

    const handleRetry = () => {
        setShowResults(false);
        setAnswers(new Array(quiz.questions.length).fill(null));
        setSelected({});
        toast.info("Quiz reset. Try again!");
    };

    if (!quiz || !quiz.questions) {
        return <div className="text-muted">Quiz not available</div>;
    }

    if (isSubmitted && isPassed) {
        return (
            <div className="mt-6 rounded-xl2 border border-emerald-200 bg-emerald-50/50 p-6 text-center sm:p-8">
                <div className="mb-3 flex items-center justify-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                        <Award className="h-8 w-8 text-emerald-600" strokeWidth={2} />
                    </div>
                    <div>
                        <div className="text-4xl font-extrabold text-emerald-600">{score}%</div>
                        <div className="text-sm text-muted">Passed</div>
                    </div>
                </div>
                <p className="font-bold text-ink">You passed lesson complete!</p>
                <p className="text-sm text-muted">
                    {correctCount} of {quiz.questions.length} correct. Best score is kept.
                </p>
                {nextLesson && (
                    <a
                        href={`/lesson/${slug}--${nextLesson.id}`}
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 font-bold text-white transition-colors hover:bg-emerald-700"
                    >
                        Continue to next lesson
                        <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                    </a>
                )}
            </div>
        );
    }

    if (isSubmitted && !isPassed) {
        return (
            <div className="mt-6 rounded-xl2 border border-amber-200 bg-amber-50/50 p-6 text-center sm:p-8">
                <div className="mb-3 flex items-center justify-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                        <AlertCircle className="h-8 w-8 text-amber-600" strokeWidth={2} />
                    </div>
                    <div>
                        <div className="text-4xl font-extrabold text-amber-600">{score}%</div>
                        <div className="text-sm text-muted">Not passed</div>
                    </div>
                </div>
                <p className="font-bold text-ink">{quiz.passPct}% needed to pass.</p>
                <p className="text-sm text-muted">
                    {correctCount} of {quiz.questions.length} correct. Best score is kept.
                </p>
                <button
                    onClick={handleRetry}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-deep px-6 py-2.5 font-bold text-white transition-colors hover:bg-[#241f6b]"
                >
                    <RefreshCw className="h-4 w-4" strokeWidth={2.5} />
                    Review & retry
                </button>
            </div>
        );
    }

    return (
        <div className="mt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                {quiz.questions.map((q, qi) => (
                    <div key={qi} className="rounded-lg border border-line-soft bg-cream-2/30 p-4 sm:p-5">
                        <p className="mb-3 font-bold text-ink">
                            <span className="mr-2 text-brand">Q{qi + 1}.</span>
                            {q.q}
                        </p>
                        <div className="space-y-2">
                            {q.choices.map((c, ci) => {
                                const isSelected = selected[qi] === ci;
                                return (
                                    <button
                                        key={ci}
                                        type="button"
                                        onClick={() => handleOptionSelect(qi, ci)}
                                        className={`flex w-full items-center gap-3 rounded-lg border px-4 py-2.5 text-left text-sm transition-all ${isSelected
                                            ? "border-brand bg-brand-soft font-medium text-brand-deep"
                                            : "border-line-soft bg-card text-ink-2 hover:border-brand/40 hover:bg-brand-soft/20"
                                            } ${showResults ? "cursor-default opacity-60" : ""}`}
                                        disabled={showResults}
                                    >
                                        <span
                                            className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${isSelected
                                                ? "bg-brand text-white"
                                                : "bg-cream-2 text-muted"
                                                }`}
                                        >
                                            {["A", "B", "C", "D"][ci]}
                                        </span>
                                        <span>{c}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
                <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-brand-deep px-8 py-3 font-bold text-white transition-colors hover:bg-[#241f6b] disabled:opacity-60"
                    disabled={answers.includes(null)}
                >
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                    Check answers
                </button>
            </form>
        </div>
    );
}