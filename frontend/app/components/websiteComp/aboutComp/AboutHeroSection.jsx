// app/components/websiteComp/aboutComp/AboutHeroSection.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import aboutHeroImage from "../../../../public/assets/aboutUsSectionImages/about-hero.webp";

export default function AboutHeroSection() {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, {
        once: false,
        amount: 0.15,
    });

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-[#ffffff] py-0 "
        >
            {/* Background decorations */}
            <div className="pointer-events-none absolute inset-0">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute -left-[15%] -top-[25%] h-[420px] w-[420px] rounded-full bg-gradient-radial from-emerald-100/70 to-transparent blur-2xl sm:h-[560px] sm:w-[560px]"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                    transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                    className="absolute -right-[15%] bottom-[-15%] h-[420px] w-[420px] rounded-full bg-gradient-radial from-orange-100/70 to-transparent blur-2xl sm:h-[560px] sm:w-[560px]"
                />
            </div>

            <div className="relative mx-6 grid grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 xl:gap-20 2xl:max-w-[1400px]">
                {/* Image column */}
                <motion.div
                    initial={{ opacity: 0, x: -60, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -60, scale: 0.9 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative mx-6 w-full lg:justify-self-start"
                >
                    <motion.div
                        className="relative aspect-[4/5] w-full overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Image
                            src={aboutHeroImage}
                            alt="Two people reviewing their finances together"
                            fill
                            priority
                            sizes="(max-width: 1024px) 90vw, 45vw"
                            className="object-cover transition-transform duration-700 hover:scale-105"
                        />
                    </motion.div>
                </motion.div>

                {/* Text column */}
                <div className="text-center lg:text-left">
                    <motion.span
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                        className="inline-flex items-center text-xs font-bold uppercase tracking-[0.16em] text-[#1E7A3B]"
                    >
                        About Us
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, x: -40 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                        className="mt-4 font-serif text-[2.1rem] font-bold leading-[1.12] tracking-tight text-ink sm:text-[2.6rem] lg:text-[2.9rem] xl:text-[3.3rem] 2xl:text-[3.6rem]"
                    >
                        Your Financial Future, Built With Confidence.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, x: -40 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
                        transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                        className="mx-auto mt-5 max-w-md text-[0.95rem] font-medium leading-relaxed text-muted sm:text-base lg:mx-0"
                    >
                        We make managing, growing, and understanding your money simpler
                        through smart financial solutions designed around your goals.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
                        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                        className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href="/catalog"
                                className="rounded-full bg-[#78BD86] px-7 py-3 font-serif text-sm font-bold text-white shadow-[0_10px_20px_-8px_rgba(60,120,80,0.55)] transition-colors hover:bg-[#67AC75]"
                            >
                                Get Started
                            </Link>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href="/tools"
                                className="rounded-full border-2 border-[#3F8A56] bg-white px-7 py-3 font-serif text-sm font-bold text-ink transition-colors hover:bg-[#F1F8F3]"
                            >
                                Explore Our Services
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}