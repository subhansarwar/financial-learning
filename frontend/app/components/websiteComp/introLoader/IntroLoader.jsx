"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Poppins } from "next/font/google"; // Sirf Poppins import kiya

// Setup Poppins Font
const poppins = Poppins({
    subsets: ["latin"],
    weight: ["700", "800"],
    display: "swap"
});

const COUNT_DURATION = 3000;
const EXIT_DURATION = 1.1;

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const words = ["The", "Eco", "Lens"];

const wordGroup = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.09,
            delayChildren: 0.2,
        },
    },
};

const wordItem = {
    hidden: {
        y: "115%",
    },
    show: {
        y: 0,
        transition: {
            duration: 1,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

export default function IntroLoader({ children }) {
    const [mounted, setMounted] = useState(false);
    const [count, setCount] = useState(0); // Initial state 0 hai, padStart se "00" hoga
    const [phase, setPhase] = useState("counting");
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Wait until the component is mounted on the client
        setMounted(true);
        setShow(true);

        const start = performance.now();

        let raf;
        let timeout;

        const tick = (now) => {
            const progress = Math.min(
                (now - start) / COUNT_DURATION,
                1
            );

            const nextCount = Math.round(
                easeOutCubic(progress) * 100
            );

            setCount(nextCount);

            if (progress < 1) {
                raf = requestAnimationFrame(tick);
            } else {
                setPhase("exiting");

                timeout = setTimeout(() => {
                    setShow(false);
                }, EXIT_DURATION * 1000);
            }
        };

        raf = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(timeout);
        };
    }, []);

    return (
        <>
            {children}

            {mounted && (
                <AnimatePresence>
                    {show && (
                        <motion.div
                            key="intro"
                            initial={{ y: 0 }}
                            animate={{
                                y:
                                    phase === "exiting"
                                        ? "-100%"
                                        : 0,
                            }}
                            transition={{
                                duration: EXIT_DURATION,
                                ease: [0.83, 0, 0.17, 1],
                            }}
                            className="fixed inset-0 z-[9999] flex flex-col justify-between overflow-hidden bg-[#72BB83] px-5 py-4 sm:px-8 sm:py-6 lg:px-12 lg:py-8"
                            style={{
                                pointerEvents:
                                    phase === "exiting"
                                        ? "none"
                                        : "auto",
                                willChange: "transform",
                            }}
                        >
                            {/* Top */}
                            <div className={`${poppins.className} flex items-start justify-between text-[10px] font-bold uppercase tracking-[0.25em] text-white/70 sm:text-xs`}>
                                <span>
                                    The Eco Lens&reg;
                                </span>

                                <span className="hidden sm:inline">
                                    Finance For Everyone
                                </span>
                            </div>

                            {/* Center */}
                            <div className="flex flex-1 items-center justify-center overflow-hidden">
                                <motion.h1
                                    variants={wordGroup}
                                    initial="hidden"
                                    animate="show"
                                    className={`${poppins.className} flex flex-wrap items-center justify-center gap-x-[0.28em] text-center font-extrabold leading-none tracking-tight text-[#f7f4ee] text-[13vw] sm:text-[10vw] lg:text-[7rem]`}
                                >
                                    {words.map((word) => (
                                        <span
                                            key={word}
                                            className="overflow-hidden py-[0.05em]"
                                        >
                                            <motion.span
                                                variants={wordItem}
                                                className="inline-block"
                                            >
                                                {word}
                                            </motion.span>
                                        </span>
                                    ))}
                                </motion.h1>
                            </div>

                            {/* Bottom */}
                            <div className="flex items-end justify-end">
                                {/* Counter color changed to #14301F */}
                                <span className={`${poppins.className} text-4xl font-extrabold leading-none tabular-nums text-[#14301F] sm:text-6xl lg:text-7xl`}>
                                    {String(count).padStart(2, "0")}
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </>
    );
}