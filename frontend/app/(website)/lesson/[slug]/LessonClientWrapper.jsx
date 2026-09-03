// app/(website)/lesson/[slug]/LessonClientWrapper.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { getCourseBySlug, getCourseProgress } from "../../../store/website/websiteCourseThunks";
import {
    ChevronLeft,
    FileText,
    HelpCircle,
    Lock,
    PlayCircle,
    CheckCircle2
} from "lucide-react";
import LessonClient from "./LessonClient";
import LoadingSpinner from "../../../components/LoadingSpinner";
import Link from "next/link";

export default function LessonClientWrapper() {
    const params = useParams();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();

    const slug = params.slug;
    const { currentCourse: courseData, loadingDetail, errorDetail } = useAppSelector(
        (state) => state.websiteCourse
    );

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [courseSlug, setCourseSlug] = useState("");
    const [lessonId, setLessonId] = useState("");
    const [currentLesson, setCurrentLesson] = useState(null);
    const [currentModule, setCurrentModule] = useState(null);
    const [moduleIndex, setModuleIndex] = useState(-1);
    const [allLessons, setAllLessons] = useState([]);
    const [prevLesson, setPrevLesson] = useState(null);
    const [nextLesson, setNextLesson] = useState(null);
    const [isLocked, setIsLocked] = useState(false);
    // Progress state
    const [completedLessonIds, setCompletedLessonIds] = useState([]);
    const [courseProgress, setCourseProgress] = useState(null);

    // Redirect old format
    useEffect(() => {
        if (searchParams?.get('c') && searchParams?.get('l')) {
            window.location.href = `/lesson/${searchParams.get('c')}--${searchParams.get('l')}`;
        }
    }, [searchParams]);

    useEffect(() => {
        if (slug) {
            const parts = slug.split("--");
            const courseSlugValue = parts[0];
            const lessonIdValue = parts[1] || parts[0];

            setCourseSlug(courseSlugValue);
            setLessonId(lessonIdValue);

            console.log('🔵 Fetching course for lesson:', courseSlugValue);

            // First fetch course data
            dispatch(getCourseBySlug(courseSlugValue))
                .unwrap()
                .then((data) => {
                    console.log('Course data fetched for lesson:', data);

                    // Process lessons
                    const modules = Array.isArray(data.modules) ? data.modules : [];
                    let foundLesson = null;
                    let foundModule = null;
                    let foundIndex = -1;

                    for (let i = 0; i < modules.length; i++) {
                        const m = modules[i];
                        const found = m.lessons?.find((l) => l.id === lessonIdValue);
                        if (found) {
                            foundLesson = found;
                            foundModule = m;
                            foundIndex = i;
                            break;
                        }
                    }

                    if (!foundLesson) {
                        setError("Lesson not found");
                        setLoading(false);
                        return;
                    }

                    const allLessonsData = modules.flatMap((m) =>
                        (m.lessons || []).map((l) => ({ ...l, moduleId: m.id, moduleTitle: m.title }))
                    );

                    const currentIdx = allLessonsData.findIndex((l) => l.id === lessonIdValue);
                    const prev = currentIdx > 0 ? allLessonsData[currentIdx - 1] : null;
                    const next = currentIdx < allLessonsData.length - 1 ? allLessonsData[currentIdx + 1] : null;

                    setCurrentLesson(foundLesson);
                    setCurrentModule(foundModule);
                    setModuleIndex(foundIndex);
                    setAllLessons(allLessonsData);
                    setPrevLesson(prev);
                    setNextLesson(next);

                    // Fetch course progress after getting course data
                    if (data.id) {
                        dispatch(getCourseProgress(data.id))
                            .unwrap()
                            .then((progressData) => {
                                console.log('🟢 Progress Response:', progressData);
                                setCourseProgress(progressData);
                                setCompletedLessonIds(progressData?.completed_lesson_ids || []);

                                // Check if current lesson is locked based on progress
                                const isLessonLocked = checkIfLessonLocked(
                                    foundLesson,
                                    allLessonsData,
                                    currentIdx,
                                    progressData?.completed_lesson_ids || []
                                );
                                setIsLocked(isLessonLocked);
                                setLoading(false);
                            })
                            .catch((err) => {
                                // console.error('❌ Failed to fetch progress:', err);
                                // If progress fetch fails, use localStorage as fallback
                                const completedFromLocal = getCompletedFromLocalStorage(courseSlugValue);
                                setCompletedLessonIds(completedFromLocal);

                                const isLessonLocked = checkIfLessonLocked(
                                    foundLesson,
                                    allLessonsData,
                                    currentIdx,
                                    completedFromLocal
                                );
                                setIsLocked(isLessonLocked);
                                setLoading(false);
                            });
                    } else {
                        setLoading(false);
                    }
                })
                .catch((err) => {
                    setLoading(false);
                });
        }
    }, [slug]);

    // Helper: Check if lesson is locked
    const checkIfLessonLocked = (lesson, allLessons, currentIndex, completedIds) => {
        // If it's the first lesson, it's not locked
        if (currentIndex === 0) return false;

        // Get previous lesson
        const prevLessonData = allLessons[currentIndex - 1];
        if (!prevLessonData) return false;

        // Check if previous lesson is completed
        const isPrevCompleted = completedIds.includes(prevLessonData.id);

        // If previous lesson is not completed, current lesson is locked
        return !isPrevCompleted;
    };

    // Helper: Get completed from localStorage
    const getCompletedFromLocalStorage = (courseSlug) => {
        if (typeof window !== "undefined") {
            const data = JSON.parse(localStorage.getItem("finlearn.v1") || "{}");
            return data?.courses?.[courseSlug]?.done || [];
        }
        return [];
    };

    const updateProgress = (newCompletedIds) => {
        setCompletedLessonIds(newCompletedIds);

        // Save to localStorage for persistence
        if (typeof window !== "undefined") {
            const data = JSON.parse(localStorage.getItem("finlearn.v1") || "{}");
            if (!data.courses) data.courses = {};
            if (!data.courses[courseSlug]) data.courses[courseSlug] = { done: [] };
            data.courses[courseSlug].done = newCompletedIds;
            localStorage.setItem("finlearn.v1", JSON.stringify(data));
        }
    };

    // Update lock status when completed lessons change
    useEffect(() => {
        if (currentLesson && allLessons.length > 0) {
            const currentIdx = allLessons.findIndex((l) => l.id === currentLesson.id);
            const isLocked = checkIfLessonLocked(
                currentLesson,
                allLessons,
                currentIdx,
                completedLessonIds
            );
            setIsLocked(isLocked);
        }
    }, [completedLessonIds, currentLesson, allLessons]);

    // Show loading state
    if (loading || loadingDetail) {
        return (
            <section className="flex min-h-[60vh] items-center justify-center bg-[#E6FBF1] py-20">
                <LoadingSpinner />
            </section>
        );
    }

    // Show error state
    if (error || errorDetail || !courseData || !currentLesson) {
        return (
            <section className="flex min-h-[60vh] items-center justify-center bg-[#E6FBF1] py-20">
                <div className="text-center">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#72BB83]/10">
                        <FileText className="h-12 w-12 text-[#14301F]" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-[#14301F] sm:text-4xl">
                        {error || errorDetail || 'Lesson not found'}
                    </h1>
                    <p className="mt-2 text-[#14301F]/60">
                        The lesson you're looking for doesn't exist.
                    </p>
                    <a
                        href="/catalog"
                        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#14301F] px-6 py-3 font-bold text-white hover:bg-[#14301F]/80"
                    >
                        <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
                        Browse courses
                    </a>
                </div>
            </section>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 lg:gap-8">
            {/* TOC - Desktop */}
            <aside className="hidden lg:block lg:col-span-1 py-16">
                <div className="sticky top-24 max-h-[calc(100vh-160px)] overflow-y-auto rounded-xl border border-[#E5E5E5] bg-white p-4 shadow-sm">
                    <LessonTOC
                        course={courseData}
                        slug={courseSlug}
                        currentLessonId={currentLesson.id}
                        isGated={courseData.gated}
                        completedLessonIds={completedLessonIds}
                    />
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3 py-16">
                <LessonClient
                    course={courseData}
                    slug={courseSlug}
                    lesson={currentLesson}
                    module={currentModule}
                    prevLesson={prevLesson}
                    nextLesson={nextLesson}
                    isLocked={isLocked}
                    allLessons={allLessons}
                    currentIndex={allLessons.findIndex((l) => l.id === currentLesson.id)}
                    completedLessonIds={completedLessonIds}
                    onProgressUpdate={updateProgress}
                    courseProgress={courseProgress}
                />
            </div>
        </div>
    );
}

// TOC Component - Updated with progress
function LessonTOC({ course, slug, currentLessonId, isGated, completedLessonIds }) {
    const modules = Array.isArray(course.modules) ? course.modules : [];
    const typeIconMap = {
        reading: { icon: FileText, color: "text-blue-500" },
        video: { icon: PlayCircle, color: "text-rose-500" },
        quiz: { icon: HelpCircle, color: "text-amber-500" },
    };
    const isModuleUnlocked = (moduleIndex) => {
        // First module is always unlocked
        if (moduleIndex === 0) return true;

        // Check if ALL lessons in previous module are completed
        const prevModule = modules[moduleIndex - 1];
        if (!prevModule) return true;

        const prevLessonIds = (prevModule.lessons || []).map(l => l.id);
        // If previous module has no lessons, it's unlocked
        if (prevLessonIds.length === 0) return true;

        // Check if all lessons in previous module are completed
        const allPrevCompleted = prevLessonIds.every(id => completedLessonIds.includes(id));
        return allPrevCompleted;
    };

    // Check if module is completed (all lessons done)
    const isModuleCompleted = (module) => {
        const lessonIds = (module.lessons || []).map(l => l.id);
        if (lessonIds.length === 0) return false;
        return lessonIds.every(id => completedLessonIds.includes(id));
    };

    return (
        <>
            <div className="mb-4 border-b border-[#E5E5E5] pb-3">
                <Link href={`/course/${slug}`} className="flex items-center gap-1.5 text-sm font-bold text-[#14301F]/60 transition-colors hover:text-[#14301F]">
                    <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
                    {course.title}
                </Link>
            </div>
            {modules.map((m, mi) => {
                const isUnlocked = isModuleUnlocked(mi);
                const isCompleted = isModuleCompleted(m);
                const moduleLessonIds = (m.lessons || []).map(l => l.id);
                const allModuleLessonsCompleted = moduleLessonIds.every(id => completedLessonIds.includes(id));

                return (
                    <div key={m.id || mi} className="mb-3">
                        <div className={`mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${!isUnlocked
                            ? "text-[#14301F]/30"
                            : allModuleLessonsCompleted
                                ? "text-[#72BB83]"
                                : "text-[#14301F]/40"
                            }`}>
                            {!isUnlocked && <Lock className="h-3 w-3" strokeWidth={2.5} />}
                            {m.title}
                            {allModuleLessonsCompleted && moduleLessonIds.length > 0 && (
                                <CheckCircle2 className="h-3 w-3 text-[#72BB83]" strokeWidth={2.5} />
                            )}
                            {!isUnlocked && (
                                <span className="text-[10px] font-medium text-[#14301F]/30">
                                    (Complete previous module)
                                </span>
                            )}
                        </div>
                        <div className="space-y-0.5">
                            {(m.lessons || []).map((l) => {
                                const isCurrent = l.id === currentLessonId;
                                const isCompleted = completedLessonIds.includes(l.id);
                                const { icon: Icon, color } = typeIconMap[l.type] || typeIconMap.reading;

                                const isClickable = isUnlocked;

                                return (
                                    <Link
                                        key={l.id}
                                        href={isClickable ? `/lesson/${slug}--${l.id}` : '#'}
                                        onClick={(e) => {
                                            if (!isClickable) {
                                                e.preventDefault();
                                                toast.error("Complete all lessons in the previous module first");
                                            }
                                        }}
                                        className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors ${!isClickable
                                            ? "cursor-not-allowed text-[#14301F]/20 hover:bg-transparent"
                                            : isCurrent
                                                ? "bg-[#72BB83]/10 font-bold text-[#14301F]"
                                                : isCompleted
                                                    ? "text-[#72BB83] hover:bg-[#F5FAF7] hover:text-[#14301F]"
                                                    : "text-[#14301F]/60 hover:bg-[#F5FAF7] hover:text-[#14301F]"
                                            }`}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle2 className="h-3.5 w-3.5 text-[#72BB83]" strokeWidth={2.5} />
                                        ) : (
                                            <Icon className={`h-3.5 w-3.5 ${!isClickable ? 'text-[#14301F]/20' : color}`} strokeWidth={2} />
                                        )}
                                        <span className={`flex-1 truncate ${!isClickable ? 'line-through decoration-[#14301F]/20' : ''}`}>
                                            {l.title}
                                        </span>
                                        <span className={`text-xs ${!isClickable ? 'text-[#14301F]/20' : 'text-[#14301F]/40'}`}>
                                            {l.duration_min || 0}m
                                        </span>
                                        {!isClickable && !isCompleted && (
                                            <Lock className="h-3 w-3 text-[#14301F]/20" strokeWidth={2} />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </>
    );
}