// app/components/websiteComp/homeComp/HeroSection.jsx
"use client";

import { Search, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// Background
import greenShade from '@/public/assets/homePageImages/greenshade.webp';
import textTopShade from '@/public/assets/homePageImages/textGreenShade.webp'

// Corner floating badges
import topLeftAvatar from '@/public/assets/homePageImages/topLeftAvatar.webp';
import topRightAvatar from '@/public/assets/homePageImages/topRightAvatar.webp';
import star from '@/public/assets/homePageImages/star.webp';

// Small avatars beside buttons
import leftBtnAvatar from '@/public/assets/homePageImages/leftBtnAvatar.webp';
import rightBtnAvatar from '@/public/assets/homePageImages/rightBtnAvatar.webp';

// Bottom illustrations
import financialLiteracyImg from '@/public/assets/homePageImages/financialLiteracy.webp';
import readingIllustrationImg from '@/public/assets/homePageImages/readingIllustration.webp';

// Orange card - overlapping avatars (already merged into ONE image)
import users from '@/public/assets/homePageImages/users.webp';
import Link from "next/link";

export default function HeroSection() {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, {
        once: false,
        amount: 0.1,
    });

    // Animation variants for staggered children
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.7, ease: "easeOut" },
        },
    };

    const fadeInLeftVariants = {
        hidden: { opacity: 0, x: -40, scale: 0.9 },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: { duration: 0.8, ease: "easeOut" },
        },
    };

    const fadeInRightVariants = {
        hidden: { opacity: 0, x: 40, scale: 0.9 },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: { duration: 0.8, ease: "easeOut" },
        },
    };

    const fadeInUpVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.7, ease: "easeOut" },
        },
    };

    const scaleInVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.8, ease: "easeOut" },
        },
    };

    return (
        <section
            ref={sectionRef}
            className="relative isolate overflow-hidden bg-white pb-10 pt-12 sm:pb-16 sm:pt-16 lg:pb-10 lg:pt-20"
        >
            {/* ===== Faint grid background ===== */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.35]"
                style={{
                    backgroundImage:
                        "linear-gradient(#f1f1f1 1px, transparent 1px), linear-gradient(90deg, #f1f1f1 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />

            {/* ===== Green shaded blob (right side) ===== */}
            {/* <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="pointer-events-none absolute -right-16 -top-16 h-[250px] w-[300px] sm:-right-20 sm:-top-20 sm:h-[350px] sm:w-[400px] lg:-right-24 lg:-top-24 lg:h-[450px] lg:w-[550px] xl:h-[550px] xl:w-[650px]"
            >
                <Image
                    src={greenShade}
                    alt=""
                    fill
                    className="object-contain"
                    priority={false}
                />
            </motion.div> */}

            {/* ===== Sparkle / star decoration ===== */}
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
                className="pointer-events-none absolute right-[4%] top-[15%] h-4 w-4 sm:right-[5%] sm:top-[18%] sm:h-5 sm:w-5 lg:right-[6%] lg:top-[20%] lg:h-6 lg:w-6 xl:right-[8%]"
            >
                <Image src={star} alt="" fill className="object-contain" />
            </motion.div>

            <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                {/* ===== TOP: Heading block ===== */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="relative flex flex-col items-center text-center"
                >
                    {/* Top-left floating avatar badge */}
                    <motion.div
                        variants={fadeInLeftVariants}
                        className="absolute -left-2 top-0 hidden h-10 w-10 sm:block sm:h-14 sm:w-14 lg:-left-4 lg:h-[72px] lg:w-[72px] xl:-left-6"
                    >
                        <Image
                            src={topLeftAvatar}
                            alt=""
                            fill
                            className="object-contain"
                        />
                    </motion.div>

                    {/* Top-right floating avatar badge */}
                    <motion.div
                        variants={fadeInRightVariants}
                        className="absolute -right-2 top-2 hidden h-10 w-10 sm:block sm:h-14 sm:w-14 lg:-right-4 lg:h-[72px] lg:w-[72px] xl:-right-6"
                    >
                        <Image
                            src={topRightAvatar}
                            alt=""
                            fill
                            className="object-contain"
                        />
                    </motion.div>

                    {/* Heading with shade background */}
                    <div className="relative w-full max-w-4xl">
                        {/* Green shade behind heading */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="pointer-events-none absolute -inset-x-2 -inset-y-4 z-0 sm:-inset-x-4 sm:-inset-y-6 lg:-inset-x-6 lg:-inset-y-8"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="pointer-events-none absolute -right-6 -top-8 -z-10 h-[160%] w-[70%] blur-2xl sm:-right-8 sm:w-[65%] lg:-right-10 lg:w-[60%]"
                                style={{
                                    background:
                                        "radial-gradient(ellipse at center, rgba(125,255,210,0.35) 0%, rgba(125,255,210,0.18) 45%, rgba(125,255,210,0) 75%)",
                                }}
                            />
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="relative z-10 font-serif text-[1.6rem] font-extrabold leading-[1.15] tracking-tight sm:text-[2.2rem] md:text-[2.6rem] lg:text-[3rem] xl:text-[3.5rem]"
                        >
                            <span className="text-[#03010D]">Learn and Grow with</span>
                            <br />
                            <span className="text-[#03010D]">Top </span>
                            <span className="text-[#FFB061]">Online Courses</span>
                        </motion.h1>
                    </div>

                    {/* Description */}
                    <motion.p
                        variants={itemVariants}
                        className="mx-auto mt-3 max-w-[280px] text-[11px] leading-relaxed text-[#616161] sm:mt-4 sm:max-w-md sm:text-[12px] md:max-w-lg md:text-[13px] lg:text-sm"
                    >
                        Discover top online courses to upgrade your Financial skills and
                        stay ahead. Learn from experts and enhance your expertise at your
                        own pace.
                    </motion.p>

                    {/* Buttons row with side avatars */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-4 flex w-full items-center justify-center gap-6 sm:mt-5 sm:gap-10 md:gap-16 lg:gap-24 xl:gap-[140px]"
                    >
                        {/* Left avatar */}
                        <motion.div
                            variants={fadeInLeftVariants}
                            className="relative hidden h-8 w-8 shrink-0 sm:block sm:h-9 sm:w-9 lg:h-10 lg:w-10 xl:h-11 xl:w-11"
                        >
                            <Image
                                src={leftBtnAvatar}
                                alt=""
                                fill
                                className="object-contain"
                            />
                        </motion.div>

                        {/* Buttons stay close together as a tight pair */}
                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                            <Link
                                href="/catalog"
                                className="inline-flex items-center justify-center rounded-full px-4 py-2 text-[11px] font-semibold text-white no-underline transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:px-5 sm:py-2.5 sm:text-xs md:text-sm"
                                style={{ backgroundColor: "#1E4D35" }}
                            >
                                Explore Courses
                            </Link>

                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-semibold text-[#03010D] no-underline transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:px-5 sm:py-2.5 sm:text-xs md:text-sm"
                            >
                                Contact Us
                            </Link>
                        </div>

                        {/* Right avatar with soft mint glow behind it */}
                        <motion.div
                            variants={fadeInRightVariants}
                            className="relative hidden h-8 w-8 shrink-0 sm:block sm:h-9 sm:w-9 lg:h-10 lg:w-10 xl:h-11 xl:w-11"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={
                                    isInView
                                        ? { opacity: 1, scale: 1 }
                                        : { opacity: 0, scale: 0.9 }
                                }
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="pointer-events-none absolute -right-54 -top-20 h-[250px] w-[300px] sm:-right-60 sm:-top-34 sm:h-[350px] sm:w-[400px] lg:-right-68 lg:-top-42 lg:h-[450px] lg:w-[550px] xl:-right-76 xl:-top-50 xl:h-[550px] xl:w-[650px]"
                            >
                                <Image
                                    src={greenShade}
                                    alt=""
                                    fill
                                    className="object-cover"
                                    priority={false}
                                />
                            </motion.div>
                            <Image
                                src={rightBtnAvatar}
                                alt=""
                                fill
                                className="object-contain"
                            />
                        </motion.div>
                    </motion.div>

                    {/* Search Form */}
                    <motion.form
                        variants={fadeInUpVariants}
                        className="mt-4 flex w-full max-w-[340px] items-center gap-1 rounded-full border border-input-border bg-input-bg py-1 pl-3 pr-1 sm:mt-5 sm:max-w-[400px] sm:pl-4 md:max-w-[440px] md:pl-5 lg:max-w-[480px]"
                        action="/catalog"
                        method="get"
                        role="search"
                    >
                        <input
                            type="search"
                            name="q"
                            placeholder="Search course, event or author"
                            aria-label="Search courses"
                            className="min-w-0 flex-1 bg-transparent py-2 text-[11px] text-text-dark placeholder:text-text-muted focus:outline-none sm:py-2.5 sm:text-[12px] md:text-[13px]"
                        />

                        <div className="h-3 w-px shrink-0 bg-input-border sm:h-4" />

                        <div className="relative flex shrink-0 items-center">
                            <select
                                className="cursor-pointer appearance-none bg-transparent py-2 pl-2 pr-5 text-[11px] font-medium text-text-dark transition-colors hover:text-btn-primary focus:outline-none sm:py-2.5 sm:pl-3 sm:pr-6 sm:text-[12px] md:text-[13px]"
                                defaultValue="courses"
                            >
                                <option value="courses">Courses</option>
                                <option value="case-studies">Case Studies</option>
                                <option value="statistics">Statistics</option>
                                <option value="research">Research</option>
                            </select>
                            <ChevronDown
                                className="pointer-events-none absolute right-1 top-1/2 h-3 w-3 -translate-y-1/2 text-text-muted sm:h-3.5 sm:w-3.5"
                                strokeWidth={2}
                            />
                        </div>

                        <button
                            type="submit"
                            aria-label="Search"
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white transition-all duration-300 hover:scale-110 active:scale-95 sm:h-8 sm:w-8 md:h-9 md:w-9"
                            style={{ backgroundColor: "#1E4D35" }}
                        >
                            <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.5} />
                        </button>
                    </motion.form>
                </motion.div>

                {/* ===== BOTTOM: 3-column illustration + cards ===== */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="mt-8 flex w-full flex-row items-center justify-center gap-4 sm:mt-10 sm:gap-6 md:mt-12 lg:mt-14 lg:gap-8"
                >
                    {/* Middle: stacked cards */}
                    <motion.div
                        variants={fadeInUpVariants}
                        className="mx-auto flex w-full max-w-[280px] flex-row gap-3 sm:max-w-[340px] sm:gap-4 md:max-w-[560px] lg:max-w-[600px]"
                    >
                        {/* Orange card */}
                        <motion.div
                            variants={scaleInVariants}
                            className="flex h-[110px] flex-1 flex-col justify-between rounded-2xl p-4 sm:h-[130px] sm:p-5 md:h-[140px] lg:h-[150px]"
                            style={{ backgroundColor: "#FFB061" }}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="relative h-7 w-[80px] sm:h-8 sm:w-[100px] md:h-9 md:w-[110px] lg:w-[124px]">
                                <Image
                                    src={users}
                                    alt="Students"
                                    fill
                                    className="object-contain object-left"
                                />
                            </div>
                            <p className="text-xs font-bold leading-snug text-[#03010D] sm:text-sm md:text-base">
                                We will create Students Community.
                            </p>
                        </motion.div>

                        {/* Green quote card */}
                        <motion.div
                            variants={scaleInVariants}
                            className="flex min-h-[110px] flex-1 flex-col justify-center gap-2 rounded-2xl p-3 sm:min-h-[130px] sm:p-5 md:min-h-[140px] lg:min-h-[150px]"
                            style={{ backgroundColor: "#7CEED0" }}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <p className="text-[10px] font-semibold leading-snug text-[#03010D] sm:text-xs md:text-sm">
                                "Believe in yourself, keep learning, and success will
                                follow."
                            </p>
                            <div>
                                <p className="text-[10px] font-bold text-[#03010D] sm:text-[11px] md:text-xs">
                                    Arya Khanna.
                                </p>
                                <p className="text-[9px] text-[#616161] sm:text-[10px] md:text-[11px]">
                                    Quote from our Founder
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
                {/* <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="mt-8 grid grid-cols-1 items-center gap-4 sm:mt-10 sm:gap-6 md:mt-12 lg:mt-14 lg:grid-cols-[1fr_1.1fr_1fr] lg:gap-8"
                >
                    Left illustration
                    <motion.div
                        variants={fadeInLeftVariants}
                        className="relative mx-auto aspect-square w-full max-w-[490px] sm:max-w-[350px] md:max-w-[280px] lg:max-w-[280px] xl:max-w-[320px]"
                    >
                        <Image
                            src={financialLiteracyImg}
                            alt="Financial literacy illustration"
                            fill
                            className="object-cover"
                        />
                    </motion.div>

                    Middle: stacked cards
                    <motion.div
                        variants={fadeInUpVariants}
                        className="mx-auto flex w-full max-w-[220px] flex-col gap-3 sm:max-w-[250px] sm:gap-4 md:max-w-[280px] lg:max-w-[300px]"
                    >
                        Orange card
                        <motion.div
                            variants={scaleInVariants}
                            className="flex h-[110px] flex-col justify-between rounded-2xl p-4 sm:h-[130px] sm:p-5 md:h-[140px] lg:h-[150px]"
                            style={{ backgroundColor: "#FFB061" }}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="relative h-7 w-[80px] sm:h-8 sm:w-[100px] md:h-9 md:w-[110px] lg:w-[124px]">
                                <Image
                                    src={users}
                                    alt="Students"
                                    fill
                                    className="object-contain object-left"
                                />
                            </div>
                            <p className="text-xs font-bold leading-snug text-[#03010D] sm:text-sm md:text-base">
                                We will create Students Community.
                            </p>
                        </motion.div>

                        Green quote card
                        <motion.div
                            variants={scaleInVariants}
                            className="flex h-[110px] flex-col justify-center gap-2 rounded-2xl p-4 sm:h-[130px] sm:p-5 md:h-[140px] lg:h-[150px]"
                            style={{ backgroundColor: "#7CEED0" }}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <p className="text-[11px] font-semibold leading-snug text-[#03010D] sm:text-xs md:text-sm">
                                "Believe in yourself, keep learning, and success will
                                follow."
                            </p>
                            <div>
                                <p className="text-[10px] font-bold text-[#03010D] sm:text-[11px] md:text-xs">
                                    Arya Khanna.
                                </p>
                                <p className="text-[9px] text-[#616161] sm:text-[10px] md:text-[11px]">
                                    Quote from our Founder
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>

                    Right illustration
                    <motion.div
                        variants={fadeInRightVariants}
                        className="relative mx-auto aspect-square w-full max-w-[670px] sm:max-w-[450px] md:max-w-[560px] lg:max-w-[490px] xl:max-w-[550px]"
                    >
                        <Image
                            src={readingIllustrationImg}
                            alt="Reading illustration"
                            fill
                            className="object-cover"
                        />
                    </motion.div>
                </motion.div> */}
            </div>
        </section>
    );
}