// app/(website)/case-studies/ClientHeroSection.jsx
"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import caseStudy from '../../../../public/assets/caseStudyImages/caseStudy.webp';

export default function ClientHeroSection({ cases }) {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, {
        once: false,
        amount: 0.1,
    });

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-[#E6FBF1] py-16 sm:py-20 lg:py-12 lg:h-[480px]"
        >

            <div className="relative mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center lg:h-[480px]">
                    {/* Left Content */}
                    <div className="flex flex-col justify-center py-8 lg:py-0">
                        {/* <motion.span
                            initial={{ opacity: 0, x: -30 }}
                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="inline-flex items-center gap-2.5 text-md font-bold uppercase tracking-[0.16em] text-[#72BB83]"
                        >
                            Learn from real examples
                        </motion.span> */}

                        <motion.h1
                            initial={{ opacity: 0, x: -40 }}
                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
                            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                            className="mt-4 text-[2.2rem] font-extrabold leading-[1.08] tracking-tight text-[#14301F] sm:text-[2.8rem] lg:text-[3.6rem]"
                        >
                            Case <span className="text-[#72BB83]">Studies</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, x: -40 }}
                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
                            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                            className="mt-4 max-w-[55ch] text-base font-medium text-[#14301F]/70 sm:text-lg"
                        >
                            Real people, real budgets, and real financial decisions
                            broken down step by step so you can see how the concepts
                            play out beyond the classroom.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
                            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                            className="mt-6 flex flex-wrap items-center gap-4"
                        >
                            <span className="text-sm font-medium text-[#14301F]/50">
                                {cases?.length || 0} case studies
                            </span>
                            <span className="h-1 w-1 rounded-full bg-[#14301F]/20" />
                            <span className="text-sm font-medium text-[#14301F]/50">
                                Microfinance · Sustainability · Green Energy
                            </span>
                        </motion.div>
                    </div>

                    {/* Right Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 40, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 40, scale: 0.9 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="relative flex items-center justify-center lg:justify-end"
                    >
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-full max-w-md lg:max-w-lg"
                        >
                            <div className="relative overflow-hidden">
                                <Image
                                    src={caseStudy}
                                    alt="Case Study Illustration"
                                    className="w-90 h-90 object-cover transition-transform duration-500 hover:scale-105"
                                    priority
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}