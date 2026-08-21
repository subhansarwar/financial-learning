"use client";

import {
    Award,
    BookOpen,
    Clock,
    Globe,
    Infinity as InfinityIcon,
    Layers,
    Signal,
    Users
} from "lucide-react";
import CourseContentSchedule from "../../../components/userDashboardComp/userCoursesComp/CourseContentSchedule";
import LecturesSection from "../../../components/userDashboardComp/userCoursesComp/LecturesSection";
import ProgressRing from "../../../components/userDashboardComp/userCoursesComp/ProgressRing";

// ===== THEME (kept consistent with the dashboard's existing tokens) =====
const DARK_BG = "#365B50";
const MAIN_BG = "#FFF7ED";
const TEAL = "#34C79D";

const BREADCRUMB = ["Browse", "Courses", "UX/UI Design Foundations"];

const COURSE_DETAILS = [
    { icon: Users, label: "2,100 Enrolled" },
    { icon: Award, label: "4 Difficulties or Completed" },
    { icon: Layers, label: "21 Curriculum" },
    { icon: Signal, label: "Beginner Level" },
    { icon: Globe, label: "English" },
    { icon: BookOpen, label: "3 Topics" },
    { icon: InfinityIcon, label: "Full Lifetime Access" },
    { icon: Clock, label: "Certificate of Completion" },
];

const DESCRIPTION =
    "Users learn effective UI and UX design principles that they can apply directly in their day-to-day work. This foundations course walks you through how to make design decisions for on-page hierarchy, typography, spacing, and interaction patterns that keep every screen consistent, accessible, and easy to build upon.";

export default function CourseDetailsClient() {
    return (
        <div className="min-h-screen py-4" style={{ background: MAIN_BG }}>
            {/* ===== BREADCRUMB ===== */}
            <div className="py-5 px-4 mx-2 rounded-2xl" style={{ background: DARK_BG }}>
                {/* ===== HERO HEADER ===== */}
                <div className="px-4 pb-8 pt-2 sm:px-6 lg:px-10">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                                UX Design Foundations
                            </h1>
                            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/50">
                                Understanding design is a crucial in creating a great user experience. Explore what
                                drives human behavior and how to use this knowledge to improve your product.
                            </p>
                            <div className="mt-5 flex flex-wrap items-center gap-3">
                                <button
                                    className="rounded-full px-5 py-2.5 text-xs font-bold text-white transition hover:opacity-90"
                                    style={{ background: TEAL }}
                                >
                                    Enroll Course
                                </button>
                                <button className="rounded-full border border-white/20 px-5 py-2.5 text-xs font-bold text-white/80 transition hover:bg-white/10">
                                    Continue to See Lesson
                                </button>
                            </div>
                        </div>

                        <div className="flex shrink-0 flex-col items-center gap-1">
                            <span className="text-[11px] font-semibold text-white">Overall Progress</span>
                            <ProgressRing value={50} size={88} strokeWidth={6} color={TEAL} subLabel="Course" />
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== CONTENT ===== */}
            <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
                {/* Description + Details */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
                    <div className="rounded-2xl border border-gray-100 bg-white p-5">
                        <h2 className="mb-3 text-lg font-bold text-gray-900">Course Description</h2>
                        <p className="text-sm leading-relaxed text-gray-500">{DESCRIPTION}</p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-5">
                        <h2 className="mb-4 text-lg font-bold text-gray-900">Course Details</h2>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {COURSE_DETAILS.map(({ icon: Icon, label }) => (
                                <div key={label} className="flex items-center gap-2.5">
                                    <Icon className="h-4 w-4 shrink-0" style={{ color: TEAL }} />
                                    <span className="truncate text-xs font-medium text-gray-500">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <CourseContentSchedule />
                <LecturesSection />
            </div>
        </div>
    );
}