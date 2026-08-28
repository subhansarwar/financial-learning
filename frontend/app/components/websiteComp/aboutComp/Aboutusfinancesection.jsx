// app/components/websiteComp/aboutComp/Aboutusfinancesection.jsx
"use client";

import {
    CircleDollarSign,
    Landmark,
    Leaf,
    ShieldCheck,
    TrendingUp,
    Triangle,
    Wind
} from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
// ---------------------------------------------------------------------------
import everythingHexagonMascot from "../../../../public/assets/aboutUsSectionImages/everything-hexagon-mascot.webp";
import growthFocusedIllustration from "../../../../public/assets/aboutUsSectionImages/growth-focused-illustration.webp";
import smartSolutionsAvatar from "../../../../public/assets/aboutUsSectionImages/smart-solutions-avatar.webp";

const eyebrowClasses =
    "inline-flex items-center gap-2 text-sm font-semibold text-blue-500";

const Eyebrow = ({ children }) => (
    <span className={eyebrowClasses}>
        <span className="h-px w-5 bg-blue-500" aria-hidden="true" />
        {children}
    </span>
);

const services = [
    { label: "Micro Finance", icon: Wind, color: "text-indigo-500" },
    { label: "Sustainable Finance", icon: Leaf, color: "text-emerald-600" },
    {
        label: "Personal Finance",
        icon: ShieldCheck,
        badge: true,
        badgeBg: "bg-red-800",
        iconColor: "text-white",
    },
    { label: "Investing", icon: TrendingUp, color: "text-orange-400" },
    { label: "Banking", icon: Landmark, color: "text-amber-500" },
    { label: "Fin Tech", icon: Triangle, color: "text-orange-500", fill: true },
    { label: "Islamic Finance", icon: CircleDollarSign, color: "text-emerald-600" },
];

function ServicePill({ label, icon: Icon, color, badge, badgeBg, iconColor, fill, index, inView }) {
    return (
        <motion.span
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.5, delay: 0.6 + index * 0.08, ease: "easeOut" }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-800 sm:text-[15px]"
        >
            {badge ? (
                <span
                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-[6px] ${badgeBg}`}
                >
                    <Icon className={`h-3 w-3 ${iconColor}`} />
                </span>
            ) : (
                <Icon
                    className={`h-[18px] w-[18px] flex-shrink-0 ${color}`}
                    {...(fill ? { fill: "currentColor" } : {})}
                />
            )}
            {label}
        </motion.span>
    );
}

export default function AboutUsFinanceSection() {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, {
        once: false,
        amount: 0.1,
    });

    return (
        <section
            ref={sectionRef}
            className="w-full bg-[#ffffff] px-6 py-17 sm:px-10 lg:px-16 xl:py-17 2xl:px-24"
        >
            <div className="mx-6 grid grid-cols-1 gap-x-12 gap-y-16 lg:grid-cols-2 lg:gap-x-16 xl:gap-x-24">
                {/* ---------------------------------------------------------------- */}
                {/* LEFT COLUMN                                                      */}
                {/* ---------------------------------------------------------------- */}
                <div className="flex flex-col">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <Eyebrow>Who we are</Eyebrow>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, x: -40 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
                        transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                        className="mt-4 font-serif text-4xl leading-tight text-slate-900 sm:text-[2.75rem]"
                    >
                        Finance should
                        <br />
                        Feel <span className="text-emerald-700">Simple.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, x: -40 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                        className="mt-6 max-w-md text-[15px] leading-relaxed text-slate-500"
                    >
                        We believe financial decisions shouldn&apos;t be complicated. Our
                        platform combines expertise, technology, and personalized
                        solutions to help individuals and businesses take control of
                        their financial future.
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, x: -40 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
                        transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                        className="mt-5 max-w-md text-[15px] leading-relaxed text-slate-500"
                    >
                        From everyday financial management to long-term growth, we&apos;re
                        here to make every step clearer, smarter, and more confident.
                    </motion.p>

                    {/* Everything You Need card */}
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.9 }}
                        transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                        className="mt-35 w-full max-w-xs self-start sm:ml-10 lg:ml-16"
                    >
                        <motion.div
                            className="rounded-2xl bg-[#F8FDFF] p-8 text-center"
                            whileHover={{ y: -4, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.div
                                whileHover={{ scale: 1.05, rotate: 3 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Image
                                    src={everythingHexagonMascot}
                                    alt="Illustration of a friendly hexagon mascot"
                                    className="mx-auto h-40 w-auto object-contain"
                                />
                            </motion.div>
                            <h3 className="mt-4 text-base font-semibold text-slate-900">
                                Everything You Need. One Place.
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-500">
                                Smart solutions, expert guidance, and the right tools to help
                                you take control of your financial future.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>

                {/* ---------------------------------------------------------------- */}
                {/* RIGHT COLUMN                                                     */}
                {/* ---------------------------------------------------------------- */}
                <div className="flex flex-col">
                    {/* Smart Solutions + Growth Focused cards */}
                    <div className="grid grid-cols-2 gap-5 sm:gap-6">
                        {/* Smart Solutions */}
                        <motion.div
                            initial={{ opacity: 0, x: -30, y: 30 }}
                            animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: -30, y: 30 }}
                            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                            className="col-start-1 mt-10 sm:mt-15"
                        >
                            <motion.div
                                className="rounded-2xl bg-[#F8FDFF] p-6 text-center sm:p-8"
                                whileHover={{ y: -4, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}
                                transition={{ duration: 0.3 }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05, rotate: -3 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Image
                                        src={smartSolutionsAvatar}
                                        alt="Portrait representing Smart Solutions, with a lightbulb and building illustration"
                                        className="mx-auto h-28 w-auto object-contain"
                                    />
                                </motion.div>
                                <h3 className="mt-4 text-base font-semibold text-slate-900">
                                    Smart Solutions
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                                    Financial tools built to make better decisions easier.
                                </p>
                            </motion.div>
                        </motion.div>

                        {/* Growth Focused */}
                        <motion.div
                            initial={{ opacity: 0, x: 30, y: -20 }}
                            animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: 30, y: -20 }}
                            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                            className="col-start-2 row-start-1 self-start"
                        >
                            <motion.div
                                className="rounded-2xl bg-[#F8FDFF] p-6 text-center"
                                whileHover={{ y: -4, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}
                                transition={{ duration: 0.3 }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05, rotate: 3 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Image
                                        src={growthFocusedIllustration}
                                        alt="Illustration of a person planning growth strategies"
                                        className="mx-auto h-28 w-auto object-contain"
                                    />
                                </motion.div>
                                <h3 className="mt-4 text-base font-semibold text-slate-900">
                                    Growth Focused
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                                    Strategies designed around your goals today and tomorrow.
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* What we cover */}
                    <div className="mt-16 max-w-lg sm:mt-24 lg:mt-28">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                        >
                            <Eyebrow>Our Services</Eyebrow>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, x: -40 }}
                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
                            transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
                            className="mt-4 font-serif text-4xl leading-tight text-slate-900 sm:text-[2.75rem]"
                        >
                            What we cover
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, x: -40 }}
                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
                            transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
                            className="mt-6 text-[15px] leading-relaxed text-slate-500"
                        >
                            Personal finance, sustainable finance, banking, investing,
                            fintech, Islamic finance and more topics added over time. Every
                            course is split into modules and bite-size lessons: short
                            readings, videos and quizzes, designed to work as well on a
                            phone as on a desktop.
                        </motion.p>

                        <div className="mt-6 flex flex-wrap justify-center gap-3">
                            {services.map((service, index) => (
                                <ServicePill
                                    key={service.label}
                                    {...service}
                                    index={index}
                                    inView={isInView}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}