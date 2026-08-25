"use client"
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import certificateIcon from "../../../../public/assets/aboutUsSectionImages/certificate-icon.webp";
import learnerIllustration from "../../../../public/assets/aboutUsSectionImages/learner-illustration.webp";

export default function CtaAndCertificateSection() {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, {
        once: false,
        amount: 0.1,
    });

    return (
        <section
            ref={sectionRef}
            className="w-full bg-[#E5E5E5] px-6 py-12 sm:px-10 lg:px-16 2xl:px-24"
        >
            <div className="mx-6 flex flex-col gap-6">
                {/* --------------------------------------------------------------- */}
                {/* GREEN CTA BANNER                                                */}
                {/* --------------------------------------------------------------- */}
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="relative overflow-hidden rounded-3xl bg-[#74B583] px-8 py-12 sm:px-12 lg:px-14"
                >
                    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
                        {/* Left: copy */}
                        <div className="max-w-md">
                            <motion.h2
                                initial={{ opacity: 0, x: -30 }}
                                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                                className="font-serif text-3xl leading-tight text-white sm:text-4xl"
                            >
                                Ready to Master
                                <br />
                                Your Next Skill
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, x: -30 }}
                                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                                className="mt-4 text-[15px] leading-relaxed text-white/90"
                            >
                                Join thousands of learners building real-world skills with
                                expert-led courses.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.9 }}
                                transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <button
                                    type="button"
                                    className="mt-7 inline-flex items-center gap-3 rounded-lg bg-white py-3 pl-6 pr-2 text-sm font-semibold text-emerald-800 transition-transform hover:scale-[1.02]"
                                >
                                    Start Learning Free
                                    <motion.span
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            repeatType: "loop",
                                            delay: 0.5
                                        }}
                                    >
                                        <ArrowRight className="h-4 w-4" />
                                    </motion.span>
                                </button>
                            </motion.div>
                        </div>

                        {/* Right: illustration */}
                        <motion.div
                            initial={{ opacity: 0, x: 40, scale: 0.9 }}
                            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 40, scale: 0.9 }}
                            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                            className="flex justify-center lg:justify-end"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05, rotate: 2 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Image
                                    src={learnerIllustration}
                                    alt="Illustration of a student reading with growth and finance icons"
                                    width={340}
                                    height={340}
                                    quality={100}
                                    sizes="(min-width: 1024px) 340px, 260px"
                                    className="h-48 w-auto object-contain sm:h-56 lg:h-64"
                                />
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* --------------------------------------------------------------- */}
                {/* CERTIFICATE STRIP                                               */}
                {/* --------------------------------------------------------------- */}
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
                    transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                    className="rounded-3xl bg-[#E3EFF5] px-8 py-8 sm:px-10"
                >
                    <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-4 sm:items-center">
                            {/* Circular light-blue backdrop behind the certificate icon */}
                            <motion.span
                                initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                                animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.5, rotate: -45 }}
                                transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                                whileHover={{ scale: 1.1, rotate: 10 }}
                                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#A7E6FF]"
                            >
                                <Image
                                    src={certificateIcon}
                                    alt="Certificate icon"
                                    width={48}
                                    height={48}
                                    quality={100}
                                    className="h-6 w-6 object-contain"
                                />
                            </motion.span>
                            <div>
                                <motion.h3
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                                    transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
                                    className="font-serif text-xl text-slate-900 sm:text-2xl"
                                >
                                    Certificate
                                </motion.h3>
                                <motion.p
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                                    transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
                                    className="mt-1 max-w-xl text-sm leading-relaxed text-slate-500"
                                >
                                    Finish a course and you can download a free certificate of
                                    completion. It recognises your effort and learning it is
                                    not an accredited qualification, and we say so on the
                                    certificate itself.
                                </motion.p>
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.9 }}
                            transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <button
                                type="button"
                                className="w-full flex-shrink-0 rounded-md bg-[#1D6E96] px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#175877] sm:w-auto"
                            >
                                Get Today
                            </button>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}