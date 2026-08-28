// app/components/websiteComp/aboutComp/CoreValuesSection.jsx
"use client";

import { BookOpen, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const values = [
    {
        icon: Sparkles,
        title: "Free financial education",
        desc: "Every lesson, tool, and case study is free no subscriptions or locked 'premium' modules.",
        iconColor: "text-[#189A80]",
        iconBg: "bg-[#B2FFDF]",
    },
    {
        icon: BookOpen,
        title: "Money made plain",
        desc: "Budgeting, investing, and credit explained in plain language you can follow on the first read.",
        iconColor: "text-[#B08B1A]",
        iconBg: "bg-[#EFFFDB]",
    },
    {
        icon: Lock,
        title: "Your data stays yours",
        desc: "The interactive tools run in your browser your numbers and progress never leave your device.",
        iconColor: "text-[#C341BF]",
        iconBg: "bg-[#FDDEFF]",
    },
    {
        icon: ShieldCheck,
        title: "Education, not advice",
        desc: "We teach how money works and how to decide. We never tell you what to buy or sell.",
        iconColor: "text-[#0E7DB0]",
        iconBg: "bg-[#B2F2FF]",
    },
];

export default function CoreValuesSection() {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, {
        once: false,
        amount: 0.1,
    });

    // Animation variants for cards
    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 40,
            scale: 0.9
        },
        visible: (custom) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.7,
                delay: custom * 0.15,
                ease: "easeOut"
            }
        })
    };

    return (
        <section
            ref={sectionRef}
            className="bg-[#72BB83] py-12 sm:py-12 lg:py-12"
        >
            <div className="mx-6 px-4 sm:px-6 2xl:max-w-[1400px]">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="mx-auto max-w-2xl text-center"
                >
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                        className="text-xs font-bold uppercase tracking-[0.18em] text-white/85"
                    >
                        What Drives Us
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                        className="mt-3 font-serif text-[1.9rem] font-bold text-white sm:text-4xl lg:text-[2.6rem]"
                    >
                        Our Core Values
                    </motion.h2>
                </motion.div>

                {/* Cards */}
                <div className="mx-auto mt-10 grid max-w-[1080px] grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                    {values.map((value, i) => {
                        const Icon = value.icon;
                        return (
                            <motion.div
                                key={i}
                                custom={i}
                                initial="hidden"
                                animate={isInView ? "visible" : "hidden"}
                                variants={cardVariants}
                                whileHover={{
                                    y: -8,
                                    boxShadow: "0 20px 40px -18px rgba(15,50,30,0.55)",
                                    transition: { duration: 0.3 }
                                }}
                                whileTap={{ scale: 0.95 }}
                                className="rounded-[20px] bg-[#F8FFFA] p-6 shadow-[0_16px_30px_-18px_rgba(15,50,30,0.45)]"
                            >
                                <motion.div
                                    whileHover={{
                                        scale: 1.1,
                                        rotate: 5,
                                        transition: { duration: 0.3 }
                                    }}
                                    className={`flex h-11 w-11 items-center justify-center rounded-full ${value.iconBg}`}
                                >
                                    <Icon className={`h-5 w-5 ${value.iconColor}`} strokeWidth={2} />
                                </motion.div>
                                <motion.h3
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                                    transition={{ duration: 0.5, delay: 0.3 + i * 0.15, ease: "easeOut" }}
                                    className="mt-4 text-[0.98rem] font-bold text-ink"
                                >
                                    {value.title}
                                </motion.h3>
                                <motion.p
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                                    transition={{ duration: 0.5, delay: 0.4 + i * 0.15, ease: "easeOut" }}
                                    className="mt-2 text-sm leading-relaxed text-muted"
                                >
                                    {value.desc}
                                </motion.p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}