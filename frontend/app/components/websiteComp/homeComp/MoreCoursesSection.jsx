// app/components/websiteComp/homeComp/MoreCoursesSection.jsx
"use client";

import { ArrowUpRight, BarChart3, BookOpen, Clock, Layers, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

/**
 * Safely converts a field to a renderable string.
 * Handles the case where your data returns text fields as
 * nested objects, e.g. { name: "Micro Finance", title: "Micro Finance" }
 * instead of a plain string — very common with CMS / i18n data sources.
 */
function toText(value) {
    if (value === null || value === undefined) return "";
    if (typeof value === "string" || typeof value === "number") return String(value);
    if (typeof value === "object") {
        return value.name ?? value.title ?? value.label ?? value.value ?? "";
    }
    return String(value);
}

// Dummy data for testing
const DUMMY_TOPICS = [
    { id: "micro-finance", name: "Micro Finance" },
    { id: "sustainable-finance", name: "Sustainable Finance" },
    { id: "personal-finance", name: "Personal Finance" },
    { id: "investing", name: "Investing" },
    { id: "banking", name: "Banking" },
    { id: "fintech", name: "Fintech" },
    { id: "islamic-finance", name: "Islamic Finance" },
];

const DUMMY_COURSES = [
    { slug: "micro-finance-1", title: "Micro Finance Foundations", instructor: "Prof. Elena Ruiz", rating: 4.8, reviewsCount: 122, duration: "40 Min", lecturesCount: 21, level: "Beginner Level", image: null, topic: "micro-finance" },
    { slug: "micro-finance-2", title: "Community Lending Models", instructor: "Prof. Elena Ruiz", rating: 4.6, reviewsCount: 88, duration: "32 Min", lecturesCount: 16, level: "Intermediate Level", image: null, topic: "micro-finance" },
    { slug: "micro-finance-3", title: "Microcredit in Practice", instructor: "David Osei", rating: 4.7, reviewsCount: 140, duration: "45 Min", lecturesCount: 19, level: "Beginner Level", image: null, topic: "micro-finance" },

    { slug: "sustainable-1", title: "Sustainable Finance Basics", instructor: "Dr. Sarah Johnson", rating: 4.9, reviewsCount: 95, duration: "45 Min", lecturesCount: 18, level: "Intermediate Level", image: null, topic: "sustainable-finance" },
    { slug: "sustainable-2", title: "ESG Investment Strategy", instructor: "Dr. Sarah Johnson", rating: 4.8, reviewsCount: 121, duration: "50 Min", lecturesCount: 22, level: "Advanced Level", image: null, topic: "sustainable-finance" },
    { slug: "sustainable-3", title: "Green Bonds Explained", instructor: "Marcus Lee", rating: 4.5, reviewsCount: 76, duration: "28 Min", lecturesCount: 12, level: "Beginner Level", image: null, topic: "sustainable-finance" },

    { slug: "personal-1", title: "Personal Finance 101", instructor: "Michael Chen", rating: 4.7, reviewsCount: 203, duration: "35 Min", lecturesCount: 15, level: "Beginner Level", image: null, topic: "personal-finance" },
    { slug: "personal-2", title: "Budgeting That Sticks", instructor: "Michael Chen", rating: 4.6, reviewsCount: 168, duration: "30 Min", lecturesCount: 13, level: "Beginner Level", image: null, topic: "personal-finance" },
    { slug: "personal-3", title: "Planning for Retirement", instructor: "Grace Kim", rating: 4.8, reviewsCount: 190, duration: "42 Min", lecturesCount: 20, level: "Intermediate Level", image: null, topic: "personal-finance" },

    { slug: "investing-1", title: "Investing 101", instructor: "Emily Rodriguez", rating: 4.6, reviewsCount: 178, duration: "50 Min", lecturesCount: 24, level: "Intermediate Level", image: null, topic: "investing" },
    { slug: "investing-2", title: "Reading the Market", instructor: "Emily Rodriguez", rating: 4.7, reviewsCount: 152, duration: "38 Min", lecturesCount: 17, level: "Intermediate Level", image: null, topic: "investing" },
    { slug: "investing-3", title: "Options & Derivatives", instructor: "Jonathan Pierce", rating: 4.9, reviewsCount: 133, duration: "55 Min", lecturesCount: 26, level: "Advanced Level", image: null, topic: "investing" },

    { slug: "banking-1", title: "Banking Fundamentals", instructor: "David Kim", rating: 4.5, reviewsCount: 156, duration: "30 Min", lecturesCount: 12, level: "Beginner Level", image: null, topic: "banking" },
    { slug: "banking-2", title: "Retail Banking Operations", instructor: "David Kim", rating: 4.4, reviewsCount: 99, duration: "33 Min", lecturesCount: 14, level: "Beginner Level", image: null, topic: "banking" },
    { slug: "banking-3", title: "Risk & Compliance", instructor: "Priya Nair", rating: 4.8, reviewsCount: 187, duration: "48 Min", lecturesCount: 23, level: "Advanced Level", image: null, topic: "banking" },

    { slug: "fintech-1", title: "Fintech Innovation", instructor: "Amanda Patel", rating: 4.8, reviewsCount: 210, duration: "55 Min", lecturesCount: 28, level: "Advanced Level", image: null, topic: "fintech" },
    { slug: "fintech-2", title: "Payments & Digital Wallets", instructor: "Amanda Patel", rating: 4.6, reviewsCount: 118, duration: "36 Min", lecturesCount: 16, level: "Intermediate Level", image: null, topic: "fintech" },
    { slug: "fintech-3", title: "Blockchain for Finance", instructor: "Noah Weber", rating: 4.7, reviewsCount: 145, duration: "44 Min", lecturesCount: 20, level: "Intermediate Level", image: null, topic: "fintech" },

    { slug: "islamic-1", title: "Islamic Finance Principles", instructor: "Dr. Yusuf Al-Amin", rating: 4.9, reviewsCount: 132, duration: "40 Min", lecturesCount: 18, level: "Beginner Level", image: null, topic: "islamic-finance" },
    { slug: "islamic-2", title: "Sukuk & Islamic Bonds", instructor: "Dr. Yusuf Al-Amin", rating: 4.7, reviewsCount: 84, duration: "34 Min", lecturesCount: 15, level: "Intermediate Level", image: null, topic: "islamic-finance" },
    { slug: "islamic-3", title: "Shariah-Compliant Investing", instructor: "Layla Haddad", rating: 4.8, reviewsCount: 109, duration: "37 Min", lecturesCount: 17, level: "Intermediate Level", image: null, topic: "islamic-finance" },
];

export default function MoreCoursesSection({
    catalog = DUMMY_COURSES,
    topics = DUMMY_TOPICS,
    totalCourses = 3200,
}) {
    const [activeTopic, setActiveTopic] = useState(topics[0]?.id ?? null);
    const [mounted, setMounted] = useState(false);
    const tabRefs = useRef([]);
    const [underline, setUnderline] = useState({ left: 0, width: 0 });

    useEffect(() => setMounted(true), []);

    const filteredCourses = useMemo(() => {
        const list = activeTopic ? catalog.filter((c) => c.topic === activeTopic) : catalog;
        return list.slice(0, 3);
    }, [catalog, activeTopic]);

    const measureUnderline = () => {
        const idx = topics.findIndex((t) => t.id === activeTopic);
        const el = tabRefs.current[idx];
        if (el) setUnderline({ left: el.offsetLeft, width: el.offsetWidth });
    };

    // Reposition the sliding underline whenever the active tab (or tab set) changes
    useLayoutEffect(() => {
        measureUnderline();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTopic, topics]);

    // Keep the underline aligned on viewport resize
    useEffect(() => {
        window.addEventListener("resize", measureUnderline);
        return () => window.removeEventListener("resize", measureUnderline);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTopic]);

    const courseCountLabel = totalCourses ? totalCourses.toLocaleString() : `${catalog.length}+`;

    return (
        <section className="py-14 sm:py-16">
            <style jsx global>{`
                @keyframes mcFadeUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .mc-anim { animation: mcFadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; }
                .mc-scrollbar-none::-webkit-scrollbar { display: none; }
                .mc-scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
                @media (prefers-reduced-motion: reduce) {
                    .mc-anim { animation: none !important; }
                }
            `}</style>

            <div className="mx-auto px-4 sm:px-6 lg:p-10">
                {/* ===== HEADER ===== */}
                <div className="mb-9 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start lg:gap-12">
                    <h2
                        className={`font-serif text-[2.1rem] font-semibold leading-[1.15] tracking-tight text-ink sm:text-[2.5rem] lg:text-[2.75rem] ${mounted ? "mc-anim" : "opacity-0"}`}
                    >
                        More Than {courseCountLabel} Courses To Choose From
                    </h2>

                    <div
                        className={`flex flex-col gap-4 lg:items-end ${mounted ? "mc-anim" : "opacity-0"}`}
                        style={{ animationDelay: "80ms" }}
                    >
                        <Link
                            href="/catalog"
                            className="group flex items-center gap-3 self-start text-sm font-semibold text-ink no-underline lg:self-end"
                        >
                            <span>Browse all</span>
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1E4D35] text-white transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:rotate-45">
                                <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
                            </span>
                        </Link>
                        <p className="max-w-[420px] text-sm font-medium leading-relaxed text-muted">
                            We provide a range of categories to help you choose courses that
                            fit your expertise. More than {courseCountLabel} courses will
                            guide you from basic.
                        </p>
                    </div>
                </div>

                {/* ===== TABS (underline style, sliding indicator) ===== */}
                {topics.length > 0 && (
                    <div
                        className={`relative mb-9 flex gap-6 overflow-x-auto whitespace-nowrap border-b border-[#E0E0E0] pb-0 mc-scrollbar-none sm:gap-9 ${mounted ? "mc-anim" : "opacity-0"}`}
                        style={{ animationDelay: "140ms" }}
                    >
                        {topics.map((topic, idx) => {
                            const isActive = topic.id === activeTopic;
                            return (
                                <button
                                    key={topic.id}
                                    ref={(el) => (tabRefs.current[idx] = el)}
                                    type="button"
                                    onClick={() => setActiveTopic(topic.id)}
                                    className={`relative shrink-0 pb-4 text-sm font-medium transition-colors duration-300 ${isActive
                                        ? "font-semibold text-[#1C1C1C]"
                                        : "text-neutral-400 hover:text-ink"
                                        }`}
                                >
                                    {toText(topic.name ?? topic.title)}
                                </button>
                            );
                        })}

                        {/* sliding underline indicator */}
                        <span
                            className="pointer-events-none absolute bottom-0 h-[2px] bg-[#32BCA3] transition-all duration-300 ease-out"
                            style={{ left: underline.left, width: underline.width }}
                        />
                    </div>
                )}

                {/* ===== CARDS GRID ===== */}
                <div key={activeTopic} className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredCourses.map((course, i) => (
                        <ExploreCourseCard key={course.slug} course={course} delay={i * 90} />
                    ))}
                </div>

                {/* ===== MORE COURSES ===== */}
                <div className="mt-10 flex justify-center sm:mt-12">
                    <Link
                        href="/catalog"
                        className="rounded-full border border-[#32BCA3] px-8 py-3 text-sm font-semibold text-[#32BCA3] no-underline transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#32BCA3] hover:text-white hover:shadow-[0_10px_24px_rgba(50,188,163,0.35)]"
                    >
                        More Courses
                    </Link>
                </div>
            </div>
        </section>
    );
}

function ExploreCourseCard({ course, delay = 0 }) {
    const title = toText(course.title);
    const instructor = toText(course.instructor) || "Instructor";
    const level = toText(course.level);
    const duration = toText(course.duration);
    const rating = course.rating || null;
    const reviewsCount = course.reviewsCount || null;

    return (
        <article className="group mc-anim flex flex-col" style={{ animationDelay: `${delay}ms` }}>
            {/* Course Image */}
            <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#f5f0eb]">
                {course.image ? (
                    <Image
                        src={course.image}
                        alt={title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#f5f0eb] to-[#e8e3dd] text-ink/20 transition-transform duration-500 ease-out group-hover:scale-105">
                        <BookOpen className="h-7 w-7" strokeWidth={1.25} />
                        <span className="px-4 text-center text-sm font-medium">{title}</span>
                    </div>
                )}
            </div>

            {/* Course Title - Bold, clean */}
            <h3 className="mb-1.5 text-lg font-bold leading-snug tracking-tight text-ink">
                {title}
            </h3>

            {/* Instructor and Rating - Clean inline */}
            <div className="mb-3 flex flex-wrap items-center text-sm text-muted">
                <span>By {instructor}</span>
                {rating && (
                    <>
                        <span className="mx-1.5 text-line">·</span>
                        <div className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-[#f5a623] text-[#f5a623]" strokeWidth={0} />
                            <span className="font-medium">
                                {rating}
                                {reviewsCount ? ` (${reviewsCount})` : ""}
                            </span>
                        </div>
                    </>
                )}
            </div>

            {/* Thin Divider */}
            <div className="mb-3 border-t border-[#e8e3dd]" />

            {/* Course Details - Clean with icons */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-medium text-muted">
                {duration && (
                    <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
                        {duration}
                    </span>
                )}
                {course.lecturesCount && (
                    <span className="flex items-center gap-1">
                        <Layers className="h-3.5 w-3.5" strokeWidth={1.5} />
                        {course.lecturesCount} {course.lecturesCount === 1 ? "Lecture" : "Lectures"}
                    </span>
                )}
                {level && (
                    <span className="flex items-center gap-1">
                        <BarChart3 className="h-3.5 w-3.5" strokeWidth={1.5} />
                        {level}
                    </span>
                )}
            </div>
        </article>
    );
}