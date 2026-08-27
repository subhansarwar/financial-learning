// app/components/websiteComp/homeComp/MoreCoursesSection.jsx
"use client";

import { ArrowUpRight, BarChart3, BookOpen, Clock, Layers, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Microfiance from "../../../../public/assets/moreCoursesSectionImages/Microfiance.webp";
import UIUXDesignTerminology from "../../../../public/assets/moreCoursesSectionImages/UIUXDesignTerminology.webp";
import CommonDesignPaterns from "../../../../public/assets/moreCoursesSectionImages/CommonDesignPaterns.webp";

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
    { slug: "micro-finance-1", title: "Micro Finance Foundations", instructor: "Prof. Elena Ruiz", rating: 4.8, reviewsCount: 122, duration: "40 Min", lecturesCount: 21, level: "Beginner Level", image: Microfiance, topic: "micro-finance" },
    { slug: "micro-finance-2", title: "Community Lending Models", instructor: "Prof. Elena Ruiz", rating: 4.6, reviewsCount: 88, duration: "32 Min", lecturesCount: 16, level: "Intermediate Level", image: Microfiance, topic: "micro-finance" },
    { slug: "micro-finance-3", title: "Microcredit in Practice", instructor: "David Osei", rating: 4.7, reviewsCount: 140, duration: "45 Min", lecturesCount: 19, level: "Beginner Level", image: Microfiance, topic: "micro-finance" },

    { slug: "sustainable-1", title: "Sustainable Finance Basics", instructor: "Dr. Sarah Johnson", rating: 4.9, reviewsCount: 95, duration: "45 Min", lecturesCount: 18, level: "Intermediate Level", image: CommonDesignPaterns, topic: "sustainable-finance" },
    { slug: "sustainable-2", title: "ESG Investment Strategy", instructor: "Dr. Sarah Johnson", rating: 4.8, reviewsCount: 121, duration: "50 Min", lecturesCount: 22, level: "Advanced Level", image: CommonDesignPaterns, topic: "sustainable-finance" },
    { slug: "sustainable-3", title: "Green Bonds Explained", instructor: "Marcus Lee", rating: 4.5, reviewsCount: 76, duration: "28 Min", lecturesCount: 12, level: "Beginner Level", image: CommonDesignPaterns, topic: "sustainable-finance" },

    { slug: "personal-1", title: "Personal Finance 101", instructor: "Michael Chen", rating: 4.7, reviewsCount: 203, duration: "35 Min", lecturesCount: 15, level: "Beginner Level", image: UIUXDesignTerminology, topic: "personal-finance" },
    { slug: "personal-2", title: "Budgeting That Sticks", instructor: "Michael Chen", rating: 4.6, reviewsCount: 168, duration: "30 Min", lecturesCount: 13, level: "Beginner Level", image: UIUXDesignTerminology, topic: "personal-finance" },
    { slug: "personal-3", title: "Planning for Retirement", instructor: "Grace Kim", rating: 4.8, reviewsCount: 190, duration: "42 Min", lecturesCount: 20, level: "Intermediate Level", image: UIUXDesignTerminology, topic: "personal-finance" },

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
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, {
        once: false,
        amount: 0.1,
    });

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

    useLayoutEffect(() => {
        measureUnderline();
    }, [activeTopic, topics]);

    useEffect(() => {
        window.addEventListener("resize", measureUnderline);
        return () => window.removeEventListener("resize", measureUnderline);
    }, [activeTopic]);

    const courseCountLabel = totalCourses ? totalCourses.toLocaleString() : `${catalog.length}+`;

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.7,
                ease: "easeOut"
            }
        }
    };

    const headingVariants = {
        hidden: { opacity: 0, x: -40 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.7,
                ease: "easeOut"
            }
        }
    };

    const rightContentVariants = {
        hidden: { opacity: 0, x: 40 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.7,
                ease: "easeOut"
            }
        }
    };

    const tabsVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <section ref={sectionRef} className="py-8 sm:py-8 lg:py-8 bg-[#ffffff] overflow-hidden">
            <div className="mx-auto px-4 sm:px-6 lg:p-10">
                {/* ===== HEADER ===== */}
                <motion.div
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={containerVariants}
                    className="mb-8 grid grid-cols-1 gap-6 sm:mb-9 lg:grid-cols-2 lg:items-start lg:gap-12"
                >
                    <motion.h2
                        variants={headingVariants}
                        className="font-serif text-[1.75rem] font-semibold leading-[1.15] tracking-tight text-ink sm:text-[2.1rem] md:text-[2.5rem] lg:text-[2.75rem]"
                    >
                        More Than {courseCountLabel} Courses To Choose From
                    </motion.h2>

                    <motion.div
                        variants={rightContentVariants}
                        className="flex flex-col gap-4 lg:items-end"
                    >
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="self-start lg:self-end"
                        >
                            <Link
                                href="/catalog"
                                className="group flex items-center gap-3 text-sm font-semibold text-ink no-underline"
                            >
                                <span>Browse all</span>
                                <motion.span
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1E4D35] text-white"
                                    whileHover={{ rotate: 45, x: 2, y: -2 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
                                </motion.span>
                            </Link>
                        </motion.div>
                        <motion.p
                            variants={itemVariants}
                            className="max-w-[420px] text-sm font-medium leading-relaxed text-muted"
                        >
                            We provide a range of categories to help you choose courses that
                            fit your expertise. More than {courseCountLabel} courses will
                            guide you from basic.
                        </motion.p>
                    </motion.div>
                </motion.div>

                {/* ===== TABS ===== */}
                {topics.length > 0 && (
                    <motion.div
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        variants={tabsVariants}
                        className="relative mb-8 flex gap-5 overflow-x-auto whitespace-nowrap border-b border-[#E0E0E0] pb-0 mc-scrollbar-none sm:mb-9 sm:gap-9"
                    >
                        {topics.map((topic, idx) => {
                            const isActive = topic.id === activeTopic;
                            return (
                                <motion.button
                                    key={topic.id}
                                    ref={(el) => (tabRefs.current[idx] = el)}
                                    type="button"
                                    onClick={() => setActiveTopic(topic.id)}
                                    className={`relative shrink-0 pb-4 text-sm font-medium transition-colors duration-300 ${isActive
                                        ? "font-semibold text-[#1C1C1C]"
                                        : "text-neutral-400 hover:text-ink"
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {toText(topic.name ?? topic.title)}
                                </motion.button>
                            );
                        })}

                        {/* sliding underline indicator */}
                        <motion.span
                            className="pointer-events-none absolute bottom-0 h-[2px] bg-[#32BCA3]"
                            style={{ left: underline.left, width: underline.width }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        />
                    </motion.div>
                )}

                {/* ===== CARDS GRID ===== */}
                <motion.div
                    key={activeTopic}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={containerVariants}
                    className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-6 lg:grid-cols-3 lg:gap-x-5"
                >
                    {filteredCourses.map((course, i) => (
                        <ExploreCourseCard
                            key={course.slug}
                            course={course}
                            delay={i}
                            isInView={isInView}
                        />
                    ))}
                </motion.div>

                {/* ===== MORE COURSES ===== */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-10 flex justify-center sm:mt-12"
                >
                    <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            href="/catalog"
                            className="rounded-full border border-[#32BCA3] px-8 py-3 text-sm font-semibold text-[#32BCA3] no-underline transition-all duration-300 hover:bg-[#32BCA3] hover:text-white hover:shadow-[0_10px_24px_rgba(50,188,163,0.35)]"
                        >
                            More Courses
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            <style jsx global>{`
                .mc-scrollbar-none::-webkit-scrollbar { display: none; }
                .mc-scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </section>
    );
}

/**
 * Meta-row icon, styled to match the reference design exactly: a plain
 * outline icon sitting inline with its label — no border/badge — same
 * muted color and baseline as the text next to it.
 */
function MetaIcon({ icon: Icon }) {
    return <Icon className="h-3.5 w-3.5 shrink-0 text-ink/60" strokeWidth={1.75} />;
}

function ExploreCourseCard({ course, delay = 0, isInView }) {
    const title = toText(course.title);
    const instructor = toText(course.instructor) || "Instructor";
    const level = toText(course.level);
    const duration = toText(course.duration);
    const rating = course.rating || null;
    const reviewsCount = course.reviewsCount || null;

    // Build the meta row items so we can interleave "·" separators exactly
    // like the reference design, regardless of which fields are present.
    const metaItems = [
        duration && {
            key: "duration",
            icon: Clock,
            label: duration,
        },
        course.lecturesCount && {
            key: "lectures",
            icon: Layers,
            label: `${course.lecturesCount} ${course.lecturesCount === 1 ? "Lecture" : "Lectures"}`,
        },
        level && {
            key: "level",
            icon: BarChart3,
            label: level,
        },
    ].filter(Boolean);

    const cardVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.7,
                delay: delay * 0.1,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.article
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={cardVariants}
            className="group flex flex-col rounded-2xl border border-[#E7E2D9] bg-white p-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-shadow duration-300 hover:shadow-[0_10px_28px_rgba(0,0,0,0.08)] sm:p-3"
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
        >
            {/* Course Image */}
            <motion.div
                className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#f5f0eb]"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
            >
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
                        <BookOpen className="h-6 w-6" strokeWidth={1.25} />
                        <span className="px-4 text-center text-xs font-medium">{title}</span>
                    </div>
                )}
            </motion.div>

            <div className="px-0.5 pb-1">
                {/* Course Title */}
                <motion.h3
                    className="mb-1 text-sm font-bold leading-snug tracking-tight text-ink sm:text-base"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                >
                    {title}
                </motion.h3>

                {/* Instructor and Rating */}
                <div className="mb-2.5 flex flex-wrap items-center gap-x-1.5 text-xs text-muted">
                    <span>By {instructor}</span>
                    {rating && (
                        <>
                            <span className="text-line">·</span>
                            <motion.div
                                className="flex items-center gap-1"
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Star className="h-3.5 w-3.5 fill-[#f5a623] text-[#f5a623]" strokeWidth={0} />
                                <span className="font-medium">
                                    {rating}
                                    {reviewsCount ? ` (${reviewsCount})` : ""}
                                </span>
                            </motion.div>
                        </>
                    )}
                </div>

                {/* Thin Divider */}
                <div className="mb-2.5 border-t border-[#e8e3dd]" />

                {/* Course Details — plain icon + label, dot-separated, matching the reference */}
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] font-medium text-muted">
                    {metaItems.map((item, idx) => (
                        <div key={item.key} className="flex items-center gap-x-2.5">
                            {idx > 0 && <span className="text-line">·</span>}
                            <motion.span
                                className="flex items-center gap-1"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                            >
                                <MetaIcon icon={item.icon} />
                                <span className="whitespace-nowrap">{item.label}</span>
                            </motion.span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.article>
    );
}