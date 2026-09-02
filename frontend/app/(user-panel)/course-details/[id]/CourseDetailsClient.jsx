// app/(user-panel)/course-details/[id]/CourseDetailsClient.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
    getCourseBySlug,
    getCourseProgress,
    enrollCourse,
    completeLesson
} from "../../../store/slices/courses/courseThunks";
import { clearCurrentCourse } from "../../../store/slices/courses/courseSlice";
import toast from "react-hot-toast";
import { ArrowLeft, Users, Layers, Signal, Globe, BookOpen, Infinity, Clock, Award } from "lucide-react";
import CourseContentSchedule from "../../../components/userDashboardComp/userCoursesComp/CourseContentSchedule";
import LecturesSection from "../../../components/userDashboardComp/userCoursesComp/LecturesSection";
import ProgressRing from "../../../components/userDashboardComp/userCoursesComp/ProgressRing";

const TEAL = "#34C79D";

export default function CourseDetailsClient({ courseId }) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { currentCourse, currentCourseProgress, loadingDetail, loadingEnroll } =
        useAppSelector((state) => state.courses);
    const { isAuthenticated } = useAppSelector((state) => state.user);

    const [isEnrolled, setIsEnrolled] = useState(false);
    const [completedLessonIds, setCompletedLessonIds] = useState([]);

    useEffect(() => {
        if (courseId) {
            dispatch(getCourseBySlug(courseId));
        }

        return () => {
            dispatch(clearCurrentCourse());
        };
    }, [dispatch, courseId]);

    useEffect(() => {
        if (currentCourse?.id && isAuthenticated) {
            dispatch(getCourseProgress(currentCourse.id)).then((result) => {
                if (result.payload?.course_id) {
                    setIsEnrolled(true);
                    setCompletedLessonIds(result.payload.completed_lesson_ids || []);
                }
            });
        }
    }, [dispatch, currentCourse, isAuthenticated]);

    const handleEnroll = async () => {
        if (!isAuthenticated) {
            router.push("/login?next=" + encodeURIComponent(window.location.pathname));
            return;
        }
        const result = await dispatch(enrollCourse(currentCourse.id));
        if (result.payload?.id) {
            setIsEnrolled(true);
        }
    };

    const handleLessonComplete = async (lessonId) => {
        if (!isEnrolled) {
            toast.error("Please enroll in the course first");
            return;
        }

        if (completedLessonIds.includes(lessonId)) {
            return;
        }

        await dispatch(completeLesson({
            lessonId: lessonId,
            courseId: currentCourse.id,
        })).then((result) => {
            if (result.payload?.completed_lesson_ids) {
                setCompletedLessonIds(result.payload.completed_lesson_ids);
                dispatch(getCourseProgress(currentCourse.id));
            }
        });
    };

    if (loadingDetail) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#FFF7ED]">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#72BB83]/20 border-t-[#72BB83]" />
                    <p className="text-sm text-[#14301F]/55">Loading course...</p>
                </div>
            </div>
        );
    }

    if (!currentCourse) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#FFF7ED]">
                <div className="text-center">
                    <h3 className="text-lg font-bold text-[#14301F]">Course not found</h3>
                    <button
                        onClick={() => router.back()}
                        className="mt-4 rounded-lg bg-[#14301F] px-6 py-2.5 text-sm font-bold text-white"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const progressValue = currentCourseProgress?.progress_pct || 0;

    const COURSE_DETAILS = [
        { icon: Users, label: `${currentCourse.enrollments || 0} Enrolled` },
        { icon: Layers, label: `${currentCourse.modules?.length || 0} Modules` },
        { icon: Signal, label: currentCourse.level || "Beginner" },
        { icon: Globe, label: "English" },
        { icon: BookOpen, label: currentCourse.topic || "General" },
        { icon: Infinity, label: "Full Lifetime Access" },
        { icon: Clock, label: `${currentCourse.length_min || 0} min total` },
        { icon: Award, label: "Certificate of Completion" },
    ];

    return (
        <div className="min-h-screen bg-[#FFF7ED] py-4">

            {/* Hero Section */}
            <div className="py-5 px-4 mx-2 rounded-2xl" style={{ background: "#365B50" }}>
                <div className="px-4 pb-8 pt-2 sm:px-6 lg:px-10">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                                {currentCourse.title}
                            </h1>
                            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/50">
                                {currentCourse.tagline || currentCourse.description?.slice(0, 150) || ""}
                            </p>
                            <div className="mt-5 flex flex-wrap items-center gap-3">
                                {!isEnrolled ? (
                                    <button
                                        onClick={handleEnroll}
                                        disabled={loadingEnroll}
                                        className="rounded-full px-5 py-2.5 text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-60"
                                        style={{ background: TEAL }}
                                    >
                                        {loadingEnroll ? "Enrolling..." : "Enroll Course"}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => router.push(`/my-courses`)}
                                        className="rounded-full px-5 py-2.5 text-xs font-bold text-white/80 transition hover:bg-white/10"
                                    >
                                        Continue Learning
                                    </button>
                                )}
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                                    {currentCourse.level || "Beginner"}
                                </span>
                                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                                    {currentCourse.topic || "General"}
                                </span>
                            </div>
                        </div>

                        <div className="flex shrink-0 flex-col items-center gap-1">
                            <span className="text-[11px] font-semibold text-white">Overall Progress</span>
                            <ProgressRing value={progressValue} size={88} strokeWidth={6} color={TEAL} subLabel="Course" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Details */}
            <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {COURSE_DETAILS.map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center gap-2 rounded-xl bg-white p-3 shadow-sm border border-gray-100">
                            <Icon className="h-4 w-4 text-[#34C79D]" />
                            <span className="text-xs font-medium text-gray-600">{label}</span>
                        </div>
                    ))}
                </div>

                <CourseContentSchedule
                    modules={currentCourse.modules || []}
                    completedLessonIds={completedLessonIds}
                    onLessonComplete={handleLessonComplete}
                    isEnrolled={isEnrolled}
                    outcomes={currentCourse.outcomes || []}
                />
                <LecturesSection
                    modules={currentCourse.modules || []}
                    completedLessonIds={completedLessonIds}
                    onLessonComplete={handleLessonComplete}
                    isEnrolled={isEnrolled}
                />
            </div>
        </div>
    );
}