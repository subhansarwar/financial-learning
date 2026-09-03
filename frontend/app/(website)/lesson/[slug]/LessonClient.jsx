// app/(website)/lesson/[slug]/LessonClient.jsx
"use client";

import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Award,
    BookOpen,
    Check,
    CheckCircle2,
    Download,
    GraduationCap,
    HelpCircle,
    Loader2,
    Lock,
    PlayCircle,
    RefreshCw
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppDispatch } from "../../../store/hooks";
import { completeLesson } from "../../../store/website/websiteCourseThunks";

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
    completedLessonIds: initialCompletedIds = [],
    onProgressUpdate,
    courseProgress: initialCourseProgress = null,
}) {
    console.log('lesson Data ==>', lesson);
    const dispatch = useAppDispatch();
    const [isLocked, setIsLocked] = useState(initialIsLocked);

    // Use mark_as_completed from API instead of local state
    const [isComplete, setIsComplete] = useState(lesson?.mark_as_completed || false);
    const [isCompleting, setIsCompleting] = useState(false);
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizPassed, setQuizPassed] = useState(false);
    const [quizScore, setQuizScore] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [mounted, setMounted] = useState(false);
    const [completedLessonIds, setCompletedLessonIds] = useState(initialCompletedIds);
    const [courseProgress, setCourseProgress] = useState({
        done: initialCompletedIds,
        total: allLessons?.length || 0,
        pct: initialCourseProgress?.progress_pct || 0,
    });

    useEffect(() => {
        setMounted(true);

        if (typeof window !== "undefined") {
            const data = JSON.parse(localStorage.getItem("finlearn.v1") || "{}");
            const done = data?.courses?.[slug]?.done || [];

            // Check if lesson is completed from API or localStorage
            const isCompletedFromApi = lesson?.mark_as_completed || false;
            const isCompletedFromLocal = done.includes(lesson.id);
            setIsComplete(isCompletedFromApi || isCompletedFromLocal);

            if (lesson.type === "quiz") {
                const scores = data?.courses?.[slug]?.quizScores || {};
                const score = scores[lesson.id];
                if (score) {
                    setQuizSubmitted(true);
                    setQuizPassed(score.passed);
                    setQuizScore(score.pct);
                }
            }

            const completedIds = initialCompletedIds.length > 0 ? initialCompletedIds : done;
            setCompletedLessonIds(completedIds);
            const totalLessons = allLessons?.length || 0;
            const progressPct = initialCourseProgress?.progress_pct ||
                (totalLessons > 0 ? Math.round((completedIds.length / totalLessons) * 100) : 0);
            setCourseProgress({
                done: completedIds,
                total: totalLessons,
                pct: progressPct,
            });
        }
    }, [slug, lesson, allLessons]);

    const getYouTubeEmbedUrl = (url) => {
        if (!url) return "";

        try {
            const parsedUrl = new URL(url);

            if (parsedUrl.hostname === "youtu.be") {
                return `https://www.youtube.com/embed/${parsedUrl.pathname.slice(1)}`;
            }

            if (parsedUrl.hostname.includes("youtube.com")) {
                if (parsedUrl.pathname === "/watch") {
                    const videoId = parsedUrl.searchParams.get("v");
                    return videoId
                        ? `https://www.youtube.com/embed/${videoId}`
                        : "";
                }

                if (parsedUrl.pathname.startsWith("/embed/")) {
                    return url;
                }
            }

            return "";
        } catch {
            return "";
        }
    };

    // FIXED: markComplete with API call
    const markComplete = async () => {
        if (isLocked) {
            toast.error("This lesson is locked");
            return;
        }

        if (isComplete) {
            toast.success("Lesson already completed!");
            return;
        }

        setIsCompleting(true);
        try {
            const result = await dispatch(completeLesson(lesson.id)).unwrap();
            console.log('✅ Lesson completion result:', result);
            console.log('res ===>', result)
            setIsComplete(true);

            if (result.progress) {
                const completedIds = result.progress.completed_lesson_ids || [];
                setCompletedLessonIds(completedIds);

                if (onProgressUpdate) {
                    onProgressUpdate(completedIds);
                }

                const totalLessons = allLessons?.length || 0;
                const progressPct = result.progress.progress_pct ||
                    (totalLessons > 0 ? Math.round((completedIds.length / totalLessons) * 100) : 0);

                setCourseProgress({
                    done: completedIds,
                    total: totalLessons,
                    pct: progressPct,
                });
            }

            if (typeof window !== "undefined") {
                const data = JSON.parse(localStorage.getItem("finlearn.v1") || "{}");
                if (!data.courses) data.courses = {};
                if (!data.courses[slug]) data.courses[slug] = { done: [] };
                if (!data.courses[slug].done.includes(lesson.id)) {
                    data.courses[slug].done.push(lesson.id);
                    localStorage.setItem("finlearn.v1", JSON.stringify(data));
                }
            }

        } catch (error) {
        } finally {
            setIsCompleting(false);
        }
    };

    const handleQuizSubmit = async (correct, total, passed) => {
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
            localStorage.setItem("finlearn.v1", JSON.stringify(data));
        }

        if (passed) {
            setIsCompleting(true);
            try {
                const result = await dispatch(completeLesson(lesson.id)).unwrap();
                console.log('✅ Quiz completion result:', result);
                setIsComplete(true);

                if (result.progress) {
                    const totalLessons = allLessons?.length || 0;
                    const completedCount = result.progress.completed_lessons ||
                        result.progress.completed_lesson_ids?.length || 0;
                    setCourseProgress({
                        done: result.progress.completed_lesson_ids || [],
                        total: totalLessons,
                        pct: totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0,
                    });
                }

                if (typeof window !== "undefined") {
                    const data = JSON.parse(localStorage.getItem("finlearn.v1") || "{}");
                    if (!data.courses) data.courses = {};
                    if (!data.courses[slug]) data.courses[slug] = { done: [], quizScores: {} };
                    if (!data.courses[slug].done.includes(lesson.id)) {
                        data.courses[slug].done.push(lesson.id);
                        localStorage.setItem("finlearn.v1", JSON.stringify(data));
                    }
                }

            } catch (error) {
            } finally {
                setIsCompleting(false);
            }
        } else {
            toast.error(`Score: ${pct}% need ${lesson.quiz_pass_pct || 70}% to pass`);
        }
    };

    const courseComplete = courseProgress.total > 0 && courseProgress.done.length === courseProgress.total;

    if (!mounted) {
        return (
            <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-[#E5E5E5] bg-white p-8">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#72BB83]/20 border-t-[#72BB83]" />
                </div>
            </div>
        );
    }

    if (isLocked) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-[#E5E5E5] bg-white p-8 text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50">
                    <Lock className="h-10 w-10 text-amber-500" strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-bold text-[#14301F]">This lesson is locked</h2>
                <p className="mt-2 max-w-sm text-[#14301F]/60">
                    Pass the previous module's quiz to unlock this lesson.
                </p>
                <Link
                    href={`/course/${slug}`}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#14301F] px-6 py-3 font-bold text-white hover:bg-[#14301F]/80"
                >
                    <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
                    Back to course
                </Link>
            </div>
        );
    }

    if (courseComplete && isComplete) {
        return (
            <div className="flex min-h-[500px] flex-col items-center justify-center rounded-xl border border-[#72BB83]/30 bg-[#72BB83]/5 p-8 text-center">
                <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-[#72BB83]/10">
                    <GraduationCap className="h-12 w-12 text-[#72BB83]" strokeWidth={1.5} />
                </div>
                <h1 className="text-3xl font-extrabold text-[#14301F]">Course Complete!</h1>
                <p className="mt-3 max-w-md text-lg text-[#14301F]/70">
                    You finished every lesson in <span className="font-bold text-[#14301F]">{course.title}</span>.
                    Download your free certificate of completion nice work!
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <button
                        onClick={() => {
                            toast.success("Certificate downloaded!");
                        }}
                        className="inline-flex items-center gap-2 rounded-full bg-[#72BB83] px-6 py-3 font-bold text-white transition-colors hover:bg-[#72BB83]/80"
                    >
                        <Download className="h-4 w-4" strokeWidth={2.5} />
                        Download Certificate (PDF)
                    </button>
                    <Link
                        href={`/course/${slug}`}
                        className="inline-flex items-center gap-2 rounded-full border border-[#E5E5E5] bg-white px-6 py-3 font-bold text-[#14301F]/60 transition-colors hover:border-[#72BB83]/40 hover:text-[#14301F]"
                    >
                        Back to course
                    </Link>
                </div>
            </div>
        );
    }

    const renderContent = () => {
        const { icon: Icon, color, label } = typeIconMap[lesson.type] || typeIconMap.reading;

        const Navigation = ({ extra }) => (
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#E5E5E5] pt-6">
                <div className="flex flex-wrap items-center gap-2">
                    {prevLesson ? (
                        <Link
                            href={`/lesson/${slug}--${prevLesson.id}`}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E5E5] bg-white px-4 py-2 text-sm font-bold text-[#14301F]/60 transition-colors hover:border-[#72BB83]/40 hover:bg-[#F5FAF7] hover:text-[#14301F]"
                        >
                            <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
                            Previous
                        </Link>
                    ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {extra}
                    {nextLesson ? (
                        <Link
                            href={`/lesson/${slug}--${nextLesson.id}`}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#14301F] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#14301F]/80"
                        >
                            Next
                            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                        </Link>
                    ) : (
                        <Link
                            href={`/course/${slug}`}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E5E5] bg-white px-4 py-2 text-sm font-bold text-[#14301F]/60 transition-colors hover:border-[#72BB83]/40 hover:text-[#14301F]"
                        >
                            <BookOpen className="h-4 w-4" strokeWidth={2.5} />
                            Back to course
                        </Link>
                    )}
                </div>
            </div>
        );

        // Reading lesson
        if (lesson.type === "reading") {
            return (
                <>
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#72BB83]/10 px-3 py-1 text-xs font-bold text-[#14301F]">
                            <Icon className={`h-3.5 w-3.5 ${color}`} strokeWidth={2.5} />
                            {label}
                        </span>
                        <span className="text-sm text-[#14301F]/60">{lesson.duration_min || 0} min read</span>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-[#14301F] sm:text-3xl lg:text-4xl">
                        {lesson.title}
                    </h1>
                    {lesson.content && (
                        <div
                            className="prose prose-ink mt-6 max-w-none text-[#14301F]/80"
                            dangerouslySetInnerHTML={{ __html: lesson.content || "" }}
                        />
                    )}
                    <Navigation
                        extra={
                            isComplete ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#72BB83]/10 px-3 py-1.5 text-sm font-bold text-[#72BB83]">
                                    <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />
                                    Completed
                                </span>
                            ) : (
                                <button
                                    onClick={markComplete}
                                    disabled={isCompleting}
                                    className="inline-flex items-center gap-1.5 rounded-full bg-[#14301F] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#14301F]/80 disabled:opacity-50"
                                >
                                    {isCompleting ? (
                                        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />
                                    ) : (
                                        <Check className="h-4 w-4" strokeWidth={2.5} />
                                    )}
                                    {isCompleting ? "" : "Mark complete"}
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
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#72BB83]/10 px-3 py-1 text-xs font-bold text-[#14301F]">
                            <PlayCircle className="h-3.5 w-3.5 text-rose-500" strokeWidth={2.5} />
                            Video
                        </span>
                        <span className="text-sm text-[#14301F]/60">{lesson.duration_min || 0} min</span>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-[#14301F] sm:text-3xl lg:text-4xl">
                        {lesson.title}
                    </h1>
                    {lesson.content && (
                        <p className="mt-2 text-base text-[#14301F]/70">{lesson.content}</p>
                    )}
                    {lesson.video_url && (
                        <div className="mt-4 overflow-hidden rounded-xl bg-black aspect-video">
                            <iframe
                                src={getYouTubeEmbedUrl(lesson?.video_url)}
                                title={lesson?.title}
                                allow="accelerometer; autoplay=0; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                loading="lazy"
                                className="h-full w-full"
                            />
                        </div>
                    )}
                    <Navigation
                        extra={
                            isComplete ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#72BB83]/10 px-3 py-1.5 text-sm font-bold text-[#72BB83]">
                                    <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />
                                    Watched
                                </span>
                            ) : (
                                <button
                                    onClick={markComplete}
                                    disabled={isCompleting}
                                    className="inline-flex items-center gap-1.5 rounded-full bg-[#14301F] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#14301F]/80 disabled:opacity-50"
                                >
                                    {isCompleting ? (
                                        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />
                                    ) : (
                                        <Check className="h-4 w-4" strokeWidth={2.5} />
                                    )}
                                    {isCompleting ? "" : "I watched it"}
                                </button>
                            )
                        }
                    />
                </>
            );
        }

        // Quiz lesson
        if (lesson.type === "quiz") {
            const quizQuestions = lesson.quiz_questions || [];
            const passPct = lesson.quiz_pass_pct || 70;

            return (
                <>
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#72BB83]/10 px-3 py-1 text-xs font-bold text-[#14301F]">
                            <HelpCircle className="h-3.5 w-3.5 text-amber-500" strokeWidth={2.5} />
                            Quiz
                        </span>
                        <span className="text-sm text-[#14301F]/60">
                            {quizQuestions.length} questions
                        </span>
                        <span className="text-sm text-[#14301F]/60">
                            Pass at {passPct}%
                        </span>
                        {isComplete && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#72BB83]/10 px-3 py-1.5 text-sm font-bold text-[#72BB83]">
                                <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />
                                Completed
                            </span>
                        )}
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-[#14301F] sm:text-3xl lg:text-4xl">
                        {lesson.title}
                    </h1>
                    {lesson.content && (
                        <p className="mt-2 text-base text-[#14301F]/70">{lesson.content}</p>
                    )}
                    <QuizRenderer
                        quizQuestions={quizQuestions}
                        passPct={passPct}
                        slug={slug}
                        lessonId={lesson.id}
                        onQuizSubmit={handleQuizSubmit}
                        isSubmitted={quizSubmitted}
                        isPassed={quizPassed}
                        score={quizScore}
                        correctCount={correctCount}
                        nextLesson={nextLesson}
                        isCompleting={isCompleting}
                        isComplete={isComplete}
                        markComplete={markComplete}
                    />
                    <Navigation extra={null} />
                </>
            );
        }

        return <div className="text-[#14301F]/60">Unknown lesson type</div>;
    };

    return (
        <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-sm sm:p-6 lg:p-8">
            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-[#14301F]/60">Course progress</span>
                    <span className="font-bold text-[#72BB83]">{courseProgress.pct}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#E5E5E5]">
                    <div
                        className="h-full rounded-full bg-[#72BB83] transition-all duration-500"
                        style={{ width: `${courseProgress.pct}%` }}
                    />
                </div>
            </div>

            {renderContent()}
        </div>
    );
}

// Quiz Renderer Component (unchanged)
// Quiz Renderer Component - Updated with Check Answers after Complete
function QuizRenderer({
    quizQuestions,
    passPct,
    slug,
    lessonId,
    onQuizSubmit,
    isSubmitted,
    isPassed,
    score,
    correctCount,
    nextLesson,
    isCompleting: parentIsCompleting,
    isComplete,
    markComplete,
}) {
    const [answers, setAnswers] = useState([]);
    const [selected, setSelected] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [isMarkingComplete, setIsMarkingComplete] = useState(false);
    const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
    const [showAnswers, setShowAnswers] = useState(false); // For viewing answers

    useEffect(() => {
        if (quizQuestions && quizQuestions.length > 0) {
            setAnswers(new Array(quizQuestions.length).fill(null));
        } else {
            setAnswers([]);
        }
    }, [quizQuestions]);

    const handleOptionSelect = (questionIndex, optionIndex) => {
        if (showResults || isSubmitted || isComplete) return;
        const newAnswers = [...answers];
        newAnswers[questionIndex] = optionIndex;
        setAnswers(newAnswers);
        setSelected({ ...selected, [questionIndex]: optionIndex });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isComplete) {
            // If already complete, just show answers
            setShowAnswers(!showAnswers);
            return;
        }

        if (answers.includes(null)) {
            toast.error("Please answer all questions");
            return;
        }

        setIsSubmittingQuiz(true);
        try {
            let correct = 0;
            quizQuestions.forEach((q, i) => {
                if (answers[i] === q.answer) correct++;
            });

            setShowResults(true);
            await onQuizSubmit(correct, quizQuestions.length, (correct / quizQuestions.length) * 100 >= passPct);
        } catch (error) {
            console.error('Quiz submission error:', error);
            toast.error("Failed to submit quiz");
        } finally {
            setIsSubmittingQuiz(false);
        }
    };

    const handleRetry = () => {
        setShowResults(false);
        setAnswers(new Array(quizQuestions.length).fill(null));
        setSelected({});
        setShowAnswers(false);
    };

    const handleMarkComplete = async () => {
        if (isComplete) {
            toast.success("Quiz already completed!");
            return;
        }

        if (!allQuestionsAnswered) {
            toast.error("Please answer all questions first");
            return;
        }

        setIsMarkingComplete(true);
        try {
            await markComplete();
        } catch (error) {
        } finally {
            setIsMarkingComplete(false);
        }
    };

    // Toggle show answers
    const toggleShowAnswers = () => {
        setShowAnswers(!showAnswers);
    };

    // Handle back button - hide answers
    const handleBack = () => {
        setShowAnswers(false);
    };

    const allQuestionsAnswered = answers.every((ans) => ans !== null);

    if (!quizQuestions || !Array.isArray(quizQuestions) || quizQuestions.length === 0) {
        return (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50/30 p-6 text-center">
                <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-3" strokeWidth={1.5} />
                <h3 className="text-lg font-bold text-[#14301F]">No Quiz Questions Available</h3>
                <p className="text-sm text-[#14301F]/60">This quiz doesn't have any questions configured yet.</p>
                {nextLesson && (
                    <Link
                        href={`/lesson/${slug}--${nextLesson.id}`}
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#72BB83] px-6 py-2.5 font-bold text-white transition-colors hover:bg-[#72BB83]/80"
                    >
                        Continue to next lesson
                        <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                    </Link>
                )}
            </div>
        );
    }

    // If quiz is complete - Show with Check Answers button
    if (showResults && !isSubmitted) {
        return (
            <div className="mt-6 rounded-xl border border-[#72BB83]/30 bg-[#72BB83]/5 p-6 text-center sm:p-8">

                {/* Show answers when toggled */}
                {showAnswers && (
                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-[#14301F]">Your Answers Review</h4>
                            {/*Back Button - Hides answers */}
                            <button
                                onClick={handleBack}
                                className="inline-flex items-center gap-2 rounded-full border border-[#E5E5E5] bg-white px-4 py-2 text-sm font-bold text-[#14301F]/60 transition-colors hover:border-[#72BB83]/40 hover:text-[#14301F]"
                            >
                                <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
                                Back
                            </button>
                        </div>
                        <div className="text-left space-y-4">
                            {quizQuestions.map((q, qi) => {
                                const userAnswer = answers[qi];
                                const isCorrect = userAnswer === q.answer;
                                return (
                                    <div key={qi} className="rounded-lg border border-[#E5E5E5] bg-white p-4">
                                        <p className="font-medium text-[#14301F]">
                                            <span className="mr-2 text-[#72BB83]">Q{qi + 1}.</span>
                                            {q.q}
                                        </p>
                                        <div className="mt-2 space-y-1">
                                            {q.choices && q.choices.map((c, ci) => {
                                                const isSelected = userAnswer === ci;
                                                const isCorrectAnswer = q.answer === ci;
                                                let bgColor = "bg-white";
                                                if (isSelected && isCorrect) bgColor = "bg-green-100 border-green-500";
                                                else if (isSelected && !isCorrect) bgColor = "bg-red-100 border-red-500";
                                                else if (isCorrectAnswer) bgColor = "bg-green-50 border-green-300";

                                                return (
                                                    <div
                                                        key={ci}
                                                        className={`flex items-center gap-3 rounded-lg border px-4 py-2 text-sm ${bgColor}`}
                                                    >
                                                        <span className="font-bold text-[#14301F]/60">
                                                            {["A", "B", "C", "D"][ci]}.
                                                        </span>
                                                        <span className={isCorrectAnswer ? "font-medium text-green-700" : ""}>
                                                            {c}
                                                        </span>
                                                        {isCorrectAnswer && (
                                                            <span className="ml-auto text-xs font-bold text-green-600">✓ Correct</span>
                                                        )}
                                                        {isSelected && !isCorrect && (
                                                            <span className="ml-auto text-xs font-bold text-red-600">✗ Your answer</span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {q.explain && (
                                            <p className="mt-2 text-sm text-[#14301F]/60 border-t border-[#E5E5E5] pt-2">
                                                <span className="font-medium">Explanation:</span> {q.explain}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // If quiz is submitted and passed
    if (isSubmitted && isPassed) {
        return (
            <div className="mt-6 rounded-xl border border-[#72BB83]/30 bg-[#72BB83]/5 p-6 text-center sm:p-8">
                <div className="mb-3 flex items-center justify-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#72BB83]/10">
                        <Award className="h-8 w-8 text-[#72BB83]" strokeWidth={2} />
                    </div>
                    <div>
                        <div className="text-4xl font-extrabold text-[#72BB83]">{score}%</div>
                        <div className="text-sm text-[#14301F]/60">Passed</div>
                    </div>
                </div>
                <p className="font-bold text-[#14301F]">You passed the quiz!</p>
                <p className="text-sm text-[#14301F]/60">
                    {correctCount} of {quizQuestions.length} correct. Best score is kept.
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                    <button
                        onClick={() => setShowAnswers(!showAnswers)}
                        className="inline-flex items-center gap-2 rounded-full border border-[#72BB83] bg-white px-6 py-2.5 text-sm font-bold text-[#72BB83] transition-colors hover:bg-[#72BB83]/10"
                    >
                        {showAnswers ? "Hide Answers" : "View Answers"}
                    </button>
                </div>

                {showAnswers && (
                    <div className="mt-6 text-left space-y-4">
                        <h4 className="font-bold text-[#14301F] text-center">Your Answers Review</h4>
                        {quizQuestions.map((q, qi) => {
                            const userAnswer = answers[qi];
                            const isCorrect = userAnswer === q.answer;
                            return (
                                <div key={qi} className="rounded-lg border border-[#E5E5E5] bg-white p-4">
                                    <p className="font-medium text-[#14301F]">
                                        <span className="mr-2 text-[#72BB83]">Q{qi + 1}.</span>
                                        {q.q}
                                    </p>
                                    <div className="mt-2 space-y-1">
                                        {q.choices && q.choices.map((c, ci) => {
                                            const isSelected = userAnswer === ci;
                                            const isCorrectAnswer = q.answer === ci;
                                            let bgColor = "bg-white";
                                            if (isSelected && isCorrect) bgColor = "bg-green-100 border-green-500";
                                            else if (isSelected && !isCorrect) bgColor = "bg-red-100 border-red-500";
                                            else if (isCorrectAnswer) bgColor = "bg-green-50 border-green-300";

                                            return (
                                                <div
                                                    key={ci}
                                                    className={`flex items-center gap-3 rounded-lg border px-4 py-2 text-sm ${bgColor}`}
                                                >
                                                    <span className="font-bold text-[#14301F]/60">
                                                        {["A", "B", "C", "D"][ci]}.
                                                    </span>
                                                    <span className={isCorrectAnswer ? "font-medium text-green-700" : ""}>
                                                        {c}
                                                    </span>
                                                    {isCorrectAnswer && (
                                                        <span className="ml-auto text-xs font-bold text-green-600">✓ Correct</span>
                                                    )}
                                                    {isSelected && !isCorrect && (
                                                        <span className="ml-auto text-xs font-bold text-red-600">✗ Your answer</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {q.explain && (
                                        <p className="mt-2 text-sm text-[#14301F]/60 border-t border-[#E5E5E5] pt-2">
                                            <span className="font-medium">Explanation:</span> {q.explain}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    if (isSubmitted && !isPassed) {
        return (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50/30 p-6 text-center sm:p-8">
                <div className="mb-3 flex items-center justify-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                        <AlertCircle className="h-8 w-8 text-amber-600" strokeWidth={2} />
                    </div>
                    <div>
                        <div className="text-4xl font-extrabold text-amber-600">{score}%</div>
                        <div className="text-sm text-[#14301F]/60">Not passed</div>
                    </div>
                </div>
                <p className="font-bold text-[#14301F]">{passPct}% needed to pass.</p>
                <p className="text-sm text-[#14301F]/60">
                    {correctCount} of {quizQuestions.length} correct. Best score is kept.
                </p>
                <button
                    onClick={handleRetry}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#14301F] px-6 py-2.5 font-bold text-white transition-colors hover:bg-[#14301F]/80"
                >
                    <RefreshCw className="h-4 w-4" strokeWidth={2.5} />
                    Review & retry
                </button>
            </div>
        );
    }

    // Show quiz questions
    return (
        <div className="mt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                {quizQuestions.map((q, qi) => (
                    <div key={qi} className="rounded-lg border border-[#E5E5E5] bg-[#F5FAF7] p-4 sm:p-5">
                        <p className="mb-3 font-bold text-[#14301F]">
                            <span className="mr-2 text-[#72BB83]">Q{qi + 1}.</span>
                            {q.q}
                        </p>
                        <div className="space-y-2">
                            {q.choices && q.choices.map((c, ci) => {
                                const isSelected = selected[qi] === ci;
                                return (
                                    <button
                                        key={ci}
                                        type="button"
                                        onClick={() => handleOptionSelect(qi, ci)}
                                        className={`flex w-full items-center gap-3 rounded-lg border px-4 py-2.5 text-left text-sm transition-all ${isSelected
                                            ? "border-[#72BB83] bg-[#72BB83]/10 font-medium text-[#14301F]"
                                            : "border-[#E5E5E5] bg-white text-[#14301F]/60 hover:border-[#72BB83]/40 hover:bg-[#F5FAF7]"
                                            } ${showResults ? "cursor-default opacity-60" : ""}`}
                                        disabled={showResults}
                                    >
                                        <span
                                            className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${isSelected
                                                ? "bg-[#72BB83] text-white"
                                                : "bg-[#E5E5E5] text-[#14301F]/40"
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
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-full bg-[#14301F] px-8 py-3 font-bold text-white transition-colors hover:bg-[#14301F]/80 disabled:opacity-60"
                        disabled={answers.includes(null)}
                    >
                        {isSubmittingQuiz ? (
                            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />
                        ) : (
                            <Check className="h-4 w-4" strokeWidth={2.5} />
                        )}
                        {isSubmittingQuiz ? "" : "Check answers"}
                    </button>

                    <button
                        type="button"
                        onClick={handleMarkComplete}
                        disabled={!allQuestionsAnswered || isMarkingComplete || isSubmittingQuiz || isComplete}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-6 py-3 text-sm font-bold transition-colors disabled:opacity-50 ${!allQuestionsAnswered
                            ? "border-[#E5E5E5] bg-gray-100 text-[#14301F]/40 cursor-not-allowed"
                            : "border-[#E5E5E5] bg-white text-[#14301F]/60 hover:border-[#72BB83]/40 hover:text-[#14301F]"
                            }`}
                    >
                        {isMarkingComplete ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />
                            </>
                        ) : (
                            <>
                                <Check className="h-4 w-4" strokeWidth={2.5} />
                                {!allQuestionsAnswered
                                    ? `Answer all questions (${answers.filter(a => a !== null).length}/${quizQuestions.length})`
                                    : "Mark complete"
                                }
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}