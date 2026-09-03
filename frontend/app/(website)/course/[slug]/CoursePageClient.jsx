// app/(website)/course/[slug]/CoursePageClient.jsx
"use client";

import {
    ArrowLeft,
    Award,
    BookOpen,
    Clock,
    Layers,
    Lock,
    PlayCircle,
    Shield,
    Target,
    Loader2,
    CheckCircle2
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
    getCourseBySlug,
    enrollInCourse,
    getCourseProgress
} from "../../../store/website/websiteCourseThunks";
import CourseClient from "./CourseClient";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CoursePageClient({ slug }) {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const {
        currentCourse: course,
        loadingDetail,
        errorDetail,
        loading: reduxLoading
    } = useAppSelector((state) => state.websiteCourse);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [enrollmentData, setEnrollmentData] = useState(null);
    const [courseProgress, setCourseProgress] = useState(null);
    const [completedLessonIds, setCompletedLessonIds] = useState([]);
    const [progressLoading, setProgressLoading] = useState(true);
    const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);

    useEffect(() => {
        if (slug) {
            dispatch(getCourseBySlug(slug))
                .unwrap()
                .then((data) => {
                    console.log('slug data ===>', data)
                    setIsPageLoading(false);
                    // Fetch progress after course data is loaded
                    if (data?.id) {
                        fetchCourseProgress(data.id);
                    }
                })
                .catch(() => {
                    setIsPageLoading(false);
                    setProgressLoading(false);
                });
        }
    }, [dispatch, slug]);

    // Fetch course progress
    const fetchCourseProgress = async (courseId) => {
        try {
            setProgressLoading(true);
            const progress = await dispatch(getCourseProgress(courseId)).unwrap();
            console.log('📊 Course Progress:', progress);
            setCourseProgress(progress);
            setCompletedLessonIds(progress?.completed_lesson_ids || []);
            if (progress?.status === "in_progress" || progress?.status === "completed") {
                setIsAlreadyEnrolled(true);
            }
        } catch (error) {
            setIsAlreadyEnrolled(false);
            // console.error('Failed to fetch progress:', error);
            // Fallback to localStorage
            const completed = getCompletedFromLocalStorage(slug);
            setCompletedLessonIds(completed);
        } finally {
            setProgressLoading(false);
        }
    };

    // Get completed from localStorage
    const getCompletedFromLocalStorage = (courseSlug) => {
        if (typeof window !== "undefined") {
            const data = JSON.parse(localStorage.getItem("finlearn.v1") || "{}");
            return data?.courses?.[courseSlug]?.done || [];
        }
        return [];
    };

    const handleEnrollAndStart = async () => {
        if (!course) return;
        if (isAlreadyEnrolled) {
            navigateToLesson();
            return;
        }
        setIsEnrolling(true);
        try {
            const result = await dispatch(enrollInCourse(course.id)).unwrap();
            setEnrollmentData(result);

            const modules = Array.isArray(course?.modules) ? course.modules : [];
            const lessons = modules.flatMap((m) => m?.lessons || []) || [];

            // Find first incomplete lesson
            let firstLesson = null;
            for (const lesson of lessons) {
                if (!completedLessonIds.includes(lesson.id)) {
                    firstLesson = lesson;
                    break;
                }
            }

            // If all lessons are completed, go to first lesson
            if (!firstLesson && lessons.length > 0) {
                firstLesson = lessons[0];
            }

            if (firstLesson) {
                router.push(`/lesson/${slug}--${firstLesson.id}`);
            } else {
                toast.error("No lessons available in this course");
            }
        } catch (error) {
            console.error('Enrollment failed:', error);
        } finally {
            setIsEnrolling(false);
        }
    };

    const navigateToLesson = () => {
        const modules = Array.isArray(course?.modules) ? course.modules : [];
        const lessons = modules.flatMap((m) => m?.lessons || []) || [];

        // Find first incomplete lesson
        let firstLesson = null;
        for (const lesson of lessons) {
            if (!completedLessonIds.includes(lesson.id)) {
                firstLesson = lesson;
                break;
            }
        }

        // If all lessons are completed, go to first lesson
        if (!firstLesson && lessons.length > 0) {
            firstLesson = lessons[0];
        }

        if (firstLesson) {
            router.push(`/lesson/${slug}--${firstLesson.id}`);
        } else {
            toast.error("No lessons available in this course");
        }
    };

    // Fixed: Using isPageLoading instead of loading
    if (isPageLoading || loadingDetail) {
        return (
            <section className="flex min-h-[60vh] items-center justify-center bg-[#E6FBF1] py-20">
                <LoadingSpinner />
            </section>
        );
    }

    if (errorDetail || !course) {
        return (
            <section className="flex min-h-[60vh] items-center justify-center bg-[#E6FBF1] py-20">
                <div className="text-center">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#72BB83]/10">
                        <BookOpen className="h-12 w-12 text-[#14301F]" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-[#14301F] sm:text-4xl">
                        {errorDetail || 'Course not found'}
                    </h1>
                    <p className="mt-2 text-[#14301F]/60">
                        {errorDetail || "The course you're looking for doesn't exist."}
                    </p>
                    <a
                        href="/catalog"
                        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#14301F] px-6 py-3 font-bold text-white hover:bg-[#14301F]/80"
                    >
                        <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
                        Browse courses
                    </a>
                </div>
            </section>
        );
    }
    // Fixed: Using isPageLoading instead of loading
    if (isPageLoading || loadingDetail) {
        return (
            <section className="flex min-h-[60vh] items-center justify-center bg-[#E6FBF1] py-20">
                <LoadingSpinner />
            </section>
        );
    }

    if (errorDetail || !course) {
        return (
            <section className="flex min-h-[60vh] items-center justify-center bg-[#E6FBF1] py-20">
                <div className="text-center">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#72BB83]/10">
                        <BookOpen className="h-12 w-12 text-[#14301F]" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-[#14301F] sm:text-4xl">
                        {errorDetail || 'Course not found'}
                    </h1>
                    <p className="mt-2 text-[#14301F]/60">
                        {errorDetail || "The course you're looking for doesn't exist."}
                    </p>
                    <a
                        href="/catalog"
                        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#14301F] px-6 py-3 font-bold text-white hover:bg-[#14301F]/80"
                    >
                        <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
                        Browse courses
                    </a>
                </div>
            </section>
        );
    }

    const topic = {
        id: course.topic || 'general',
        name: course.topic || 'General',
        icon: '📚',
        hue: 160,
    };

    const modules = Array.isArray(course?.modules) ? course.modules : [];
    const lessons = modules.flatMap((m) => m?.lessons || []) || [];
    const totalLessons = lessons.length;
    const gated = !!course?.gated;

    // Calculate progress percentage
    const progressPercentage = courseProgress?.progress_pct || 0;
    const completedCount = completedLessonIds.length;

    const isCourseComplete = totalLessons > 0 && completedCount === totalLessons;

    return (
        <>
            {/* Hero Section */}
            <section
                className="relative overflow-hidden border-b border-[#E5E5E5] py-4 sm:py-4 lg:py-4 mt-12"
                style={{ background: '#E6FBF1' }}
            >
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <nav className="mb-4 flex flex-wrap items-center gap-1 text-sm font-medium text-[#14301F]/60">
                        <a href="/catalog" className="hover:text-[#14301F]">Catalog</a>
                        <span>/</span>
                        <a href={`/catalog?topic=${topic.id}`} className="hover:text-[#14301F]">{topic.name}</a>
                        <span>/</span>
                        <span className="text-[#14301F]">{course.title}</span>
                    </nav>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-[#14301F] sm:text-5xl lg:text-6xl">
                                {course.title}
                            </h1>
                            <p className="mt-3 text-xl font-medium text-[#14301F]/70">{course.tagline}</p>

                            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-[#14301F]/60">
                                {/* Level Badge - Increased size */}
                                <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2.5">
                                    <Award className="h-4 w-4 text-[#72BB83]" strokeWidth={2.5} />
                                    <b className="text-[#14301F] text-sm">{course.level || 'Beginner'}</b>
                                </span>

                                {/* Duration Badge - Increased size */}
                                <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2.5">
                                    <Clock className="h-4 w-4 text-[#72BB83]" strokeWidth={2.5} />
                                    <b className="text-[#14301F] text-sm">{formatDuration(course.length_min)}</b>
                                </span>

                                {/* Modules Badge - Increased size */}
                                <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2.5">
                                    <Layers className="h-4 w-4 text-[#72BB83]" strokeWidth={2.5} />
                                    <b className="text-[#14301F] text-sm">{course.modules?.length || 0}</b> modules
                                </span>

                                {/* Lessons Badge - Increased size */}
                                <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2.5">
                                    <BookOpen className="h-4 w-4 text-[#72BB83]" strokeWidth={2.5} />
                                    <b className="text-[#14301F] text-sm">{totalLessons}</b> lessons
                                </span>

                                {/* Course Complete Badge - Increased size */}
                                {isCourseComplete && (
                                    <span className="inline-flex items-center gap-2 rounded-full bg-[#72BB83]/10 px-4 py-2.5 text-[#72BB83]">
                                        <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />
                                        <span className="text-sm font-bold">Course Complete!</span>
                                    </span>
                                )}

                                {/* Gated Badge - Increased size */}
                                {gated && (
                                    <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2.5 text-amber-700">
                                        <Lock className="h-4 w-4" strokeWidth={2.5} />
                                        <span className="text-sm font-bold">Pass each module at 70%+</span>
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Sidebar with Progress */}
                        <div className="hidden lg:block">
                            <div className="sticky top-24 rounded-xl border border-[#E5E5E5] bg-white p-6 shadow-sm">
                                <div className="flex items-center gap-3 border-b border-[#E5E5E5] pb-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#72BB83]/10 text-lg font-bold text-[#14301F]">
                                        {getInitials(course.instructor_name)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#14301F]">{course.instructor_name || "Instructor"}</p>
                                        <p className="text-sm text-[#14301F]/60">{course.instructor_title || ""}</p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-[#14301F]/60">
                                            {isCourseComplete ? 'Completed!' : 'Your progress'}
                                        </span>
                                        <b className="text-[#72BB83]">
                                            {progressLoading ? '...' : `${progressPercentage}%`}
                                        </b>
                                    </div>
                                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#E5E5E5]">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${isCourseComplete ? 'bg-[#72BB83]' : 'bg-[#72BB83]'
                                                }`}
                                            style={{ width: `${progressPercentage}%` }}
                                        />
                                    </div>
                                    <p className="mt-1.5 text-xs text-[#14301F]/60">
                                        {completedCount} of {totalLessons} lessons complete
                                    </p>
                                </div>
                                <button
                                    onClick={handleEnrollAndStart}
                                    disabled={isEnrolling}
                                    className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 font-bold text-white transition-colors hover:bg-[#14301F]/80 disabled:opacity-50 disabled:cursor-not-allowed ${isCourseComplete
                                        ? 'bg-[#72BB83] hover:bg-[#72BB83]/80'
                                        : 'bg-[#14301F]'
                                        }`}
                                >
                                    {isEnrolling ? (
                                        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />
                                    ) : (
                                        <>
                                            <PlayCircle className="h-4 w-4" strokeWidth={2.5} />
                                            {isCourseComplete ? 'Review Course' : 'Start course free'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Course Content */}
            <section className="py-12 sm:py-16 bg-[#E6FBF1]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
                        <div className="lg:col-span-2">
                            <h2 className="mb-4 flex items-center gap-2.5 text-xl font-bold text-[#14301F] sm:text-2xl">
                                <BookOpen className="h-5 w-5 text-[#72BB83]" strokeWidth={2} />
                                Course content
                            </h2>
                            <CourseClient
                                slug={slug}
                                course={course}
                                topic={topic}
                                onLessonClick={handleEnrollAndStart}
                                completedLessonIds={completedLessonIds}
                                onProgressUpdate={setCompletedLessonIds}
                            />

                            <div className="mt-6 rounded-lg border-l-4 border-[#72BB83] bg-[#72BB83]/5 p-4">
                                <div className="flex items-start gap-3">
                                    <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#72BB83]" strokeWidth={2} />
                                    <div className="text-sm text-[#14301F]/70">
                                        <span className="font-bold text-[#14301F]">Education, not advice.</span> This course
                                        teaches general concepts. It is not a recommendation to buy, sell or use any
                                        financial product.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <aside className="hidden lg:block">
                            <div className="sticky top-24 space-y-4">
                                <div className="rounded-xl border border-[#E5E5E5] bg-white p-6 shadow-sm">
                                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#14301F]">
                                        <Target className="h-4 w-4 text-[#72BB83]" strokeWidth={2} />
                                        What you'll learn
                                    </h3>
                                    <ul className="space-y-2">
                                        {(course.outcomes || []).map((o, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-[#14301F]/70">
                                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#72BB83]" />
                                                {o}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </>
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

function getInitials(name) {
    if (!name) return "?";
    return name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}