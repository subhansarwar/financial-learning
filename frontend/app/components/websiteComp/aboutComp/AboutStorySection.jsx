// app/components/websiteComp/aboutComp/AboutStorySection.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Poppins } from "next/font/google";
import aboutStoryImage from "../../../../public/assets/aboutUsSectionImages/about-story.webp";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["700", "800"],
    display: "swap",
});

export default function AboutStorySection() {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, {
        once: false,
        amount: 0.15,
    });

    return (
        <section
            ref={sectionRef}
            className="bg-[#EBFFF9] py-12 sm:py-12 lg:py-12"
        >
            <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className={`${poppins.className} mx-auto max-w-3xl text-center text-[1.6rem] font-extrabold leading-[1.25] tracking-tight text-ink sm:text-[2.1rem] lg:text-[2.5rem]`}
                >
                    Driven by knowledge. Built for financial confidence.
                </motion.h2>

                {/* Image + copy */}
                <div className="mt-10 grid grid-cols-1 items-center gap-8 sm:mt-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-14">
                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -50, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -50, scale: 0.9 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative aspect-[3/2] w-full overflow-hidden"
                    >
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            transition={{ duration: 0.3 }}
                            className="relative aspect-[3/2] w-full overflow-hidden"
                        >
                            <Image
                                src={aboutStoryImage}
                                alt="Team presenting a financial education dashboard in a meeting"
                                fill
                                sizes="(max-width: 1024px) 90vw, 45vw"
                                className="object-cover transition-transform duration-700 hover:scale-105"
                            />
                        </motion.div>
                    </motion.div>

                    {/* Text */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                        className="space-y-5 text-[0.95rem] leading-relaxed text-[#4B4B4A] sm:text-base"
                    >
                        <motion.p
                            initial={{ opacity: 0, x: 30 }}
                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                        >
                            Providing high-quality{" "}
                            <Link
                                href="/catalog"
                                className="underline decoration-[#4B4B4A]/60 underline-offset-2 transition-colors hover:text-ink hover:decoration-ink"
                            >
                                financial education
                            </Link>{" "}
                            for everyone is an ambitious goal. We&apos;re fortunate to bring
                            together passionate educators, finance experts, and technology
                            specialists who believe financial knowledge should be accessible
                            to all.
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, x: 30 }}
                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                        >
                            Expertise and innovation drive us every day, helping turn complex
                            financial concepts into simple, practical learning experiences.
                            Our goal is simple: give people the knowledge and confidence to
                            make better financial decisions and build a more secure future.
                        </motion.p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}