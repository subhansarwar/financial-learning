// app/components/websiteComp/homeComp/ExploreCoursesSection.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import PatternDecor from "../../../../public/assets/ExploreSectionImages/ExploreSectionPatern.webp";

const COURSE_TAGS = [
    "Micro Finance",
    "Sustainable finance",
    "Personal finance",
    "Investing",
    "Banking",
    "Fintech",
    "Islamic finance",
    "Popular Courses",
    "Popular Courses",
];

function slugify(label) {
    return label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export default function ExploreCoursesSection() {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, {
        once: false,
        amount: 0.1,
    });

    // Animation variants
    const headingVariants = {
        hidden: {
            opacity: 0,
            y: 30,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.7,
                ease: "easeOut"
            }
        }
    };

    const slideLeftVariants = {
        hidden: {
            opacity: 0,
            x: -60
        },
        visible: (custom) => ({
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.7,
                delay: custom * 0.12,
                ease: "easeOut"
            }
        })
    };

    const slideUpVariants = {
        hidden: {
            opacity: 0,
            y: 40,
            rotate: -3
        },
        visible: (custom) => ({
            opacity: 1,
            y: 0,
            rotate: 0,
            transition: {
                duration: 0.7,
                delay: 0.48 + custom * 0.12,
                ease: "easeOut"
            }
        })
    };

    const slideRightVariants = {
        hidden: {
            opacity: 0,
            x: 60,
            scale: 0.9
        },
        visible: (custom) => ({
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                duration: 0.7,
                delay: 0.84 + custom * 0.15,
                ease: "easeOut"
            }
        })
    };

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-[#72BB83] px-4 py-8 sm:px-6 sm:py-8 lg:px-10 lg:py-10"
        >
            {/* Decorative diagonal-line pattern */}
            <div className="pointer-events-none absolute inset-y-0 right-0 w-2/3 opacity-40 sm:w-1/2 sm:opacity-60">
                <Image
                    src={PatternDecor}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 50vw, 66vw"
                    className="object-cover object-right"
                    priority={false}
                />
            </div>

            <div className="relative mx-5">
                {/* Heading with motion */}
                <motion.h2
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={headingVariants}
                    className="text-center font-serif text-2xl font-semibold tracking-tight text-white sm:text-3xl"
                >
                    Explore Our Courses
                </motion.h2>

                {/* Row 1 - Slide from Left */}
                <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-3 sm:mt-10 sm:gap-4">
                    {COURSE_TAGS.slice(0, 4).map((tag, idx) => (
                        <motion.div
                            key={`${tag}-${idx}`}
                            initial="hidden"
                            animate={isInView ? "visible" : "hidden"}
                            variants={slideLeftVariants}
                            custom={idx}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href={`/catalog?topic=${slugify(tag)}`}
                                className="whitespace-nowrap rounded-full border-1 border-[#D0F6FF] bg-white/5 py-2 text-xs font-medium text-white shadow-[0_8px_32px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-1px_0_rgba(255,255,255,0.1)] backdrop-blur-2xl transition-all hover:bg-white/10 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.8),inset_0_-1px_0_rgba(255,255,255,0.15)] sm:px-10 sm:py-2 sm:text-sm"
                            >
                                {tag}
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Row 2 - Slide from Bottom with Rotation */}
                <div className="mx-auto mt-3 flex max-w-4xl flex-wrap items-center justify-center gap-8 sm:mt-4 sm:gap-8">
                    {COURSE_TAGS.slice(4, 7).map((tag, idx) => (
                        <motion.div
                            key={`${tag}-${idx}`}
                            initial="hidden"
                            animate={isInView ? "visible" : "hidden"}
                            variants={slideUpVariants}
                            custom={idx}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href={`/catalog?topic=${slugify(tag)}`}
                                className="whitespace-nowrap rounded-full border border-[#D0F6FF] bg-white/5 px-10 py-2 text-xs font-medium text-white shadow-[0_8px_32px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-1px_0_rgba(255,255,255,0.1)] backdrop-blur-2xl transition-all hover:bg-white/10 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.8),inset_0_-1px_0_rgba(255,255,255,0.15)] sm:px-14 sm:py-2 sm:text-sm"
                            >
                                {tag}
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Row 3 - Slide from Right */}
                <div className="mx-auto mt-3 flex max-w-3xl flex-wrap items-center justify-center gap-7 sm:mt-4 sm:gap-7">
                    {COURSE_TAGS.slice(7, 9).map((tag, idx) => (
                        <motion.div
                            key={`${tag}-${idx}`}
                            initial="hidden"
                            animate={isInView ? "visible" : "hidden"}
                            variants={slideRightVariants}
                            custom={idx}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href={`/catalog?topic=${slugify(tag)}`}
                                className="whitespace-nowrap rounded-full border-1 border-[#D0F6FF] bg-white/5 px-10 py-2 text-xs font-medium text-white shadow-[0_8px_32px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-1px_0_rgba(255,255,255,0.1)] backdrop-blur-2xl transition-all hover:bg-white/10 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.8),inset_0_-1px_0_rgba(255,255,255,0.15)] sm:px-10 sm:py-2 sm:text-sm"
                            >
                                {tag}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}