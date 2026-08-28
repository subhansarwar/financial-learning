// app/components/toolComp/ToolComp.jsx (hero section)
"use client";

import { useRef, useState } from "react";
import { Calculator, TrendingUp, Leaf } from "lucide-react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import ToolTabs from "./ToolTabs";
import BudgetTool from "./BudgetTool";
import CompoundTool from "./CompoundTool";
import EsgTool from "./EsgTool";
import ToolImage from '../../../public/assets/toolSectionImage/toolImage.webp';

const TOOLS = [
    { id: "budget", label: "Budgeting calculator", shortLabel: "Budget", icon: Calculator },
    { id: "compound", label: "Compound interest", shortLabel: "Interest", icon: TrendingUp },
    { id: "esg", label: "ESG comparison", shortLabel: "ESG", icon: Leaf },
];

export default function ToolComp() {
    const [activeTool, setActiveTool] = useState("budget");
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, {
        once: false,
        amount: 0.1,
    });
    return (
        <>
            {/* ========== HERO SECTION ========== */}
            <section
                ref={sectionRef}
                className="relative overflow-hidden border-b border-[#14301F]/10 bg-[#E6FBF1] py-14 sm:py-20 lg:py-[88px]"
            >
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(600px 400px at 80% 20%, rgba(114,187,131,.14), transparent 60%), radial-gradient(500px 400px at 20% 80%, rgba(114,187,131,.08), transparent 55%)",
                    }}
                />
                <div className="relative mx-6 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">

                        {/* ===== LEFT CONTENT - Slide from Left ===== */}
                        <motion.div
                            initial={{ opacity: 0, x: -60 }}
                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <motion.span
                                initial={{ opacity: 0, x: -40 }}
                                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
                                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                                className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.16em] text-[#72BB83]"
                            >
                                {/* Interactive tools */}
                            </motion.span>

                            <motion.h1
                                initial={{ opacity: 0, x: -50 }}
                                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                                transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                                className="mt-4 text-[2rem] font-extrabold leading-[1.1] tracking-tight text-[#14301F] sm:mt-5 sm:text-[2.5rem] lg:text-[3.2rem]"
                            >
                                Turn theory into numbers
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, x: -50 }}
                                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                                transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                                className="mt-3 max-w-[50ch] text-sm font-medium text-[#14301F]/70 sm:mt-4 sm:text-base lg:text-lg"
                            >
                                Free forever, no sign-up. Everything runs in your browser your
                                numbers never leave your device.
                            </motion.p>
                        </motion.div>

                        {/* ===== RIGHT IMAGE - Slide from Right ===== */}
                        <motion.div
                            initial={{ opacity: 0, x: 60, scale: 0.9 }}
                            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 60, scale: 0.9 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="flex justify-center lg:justify-end"
                        >
                            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
                                <div className="overflow-hidden rounded-2xl shadow-lg">
                                    <Image
                                        src={ToolImage}
                                        alt="Interactive financial tools illustration"
                                        className="h-auto w-full object-cover transition-transform duration-500 hover:scale-105"
                                        priority
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ========== TOOLS SECTION ========== */}
            <section className="bg-[#E6FBF1] py-10 sm:py-14 lg:py-[78px]">
                <div className="mx-6 px-4 sm:px-6 lg:px-8">
                    <ToolTabs tools={TOOLS} activeTool={activeTool} onToolChange={setActiveTool} />

                    {activeTool === "budget" && <BudgetTool />}
                    {activeTool === "compound" && <CompoundTool />}
                    {activeTool === "esg" && <EsgTool />}
                </div>
            </section>
        </>
    );
}