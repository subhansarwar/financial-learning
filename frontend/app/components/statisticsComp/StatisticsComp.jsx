// app/components/statisticsComp/StatisticsComp.jsx
"use client";

import statisticsData from "@/data/statistics.json";
import {
    ArrowDownRight,
    ArrowUpRight,
    BarChart3,
    Battery,
    Building2,
    CircleDollarSign,
    DollarSign,
    Globe,
    Landmark,
    Leaf,
    Minus,
    Recycle,
    Sun,
    TrendingUp,
    Users,
    Wind
} from "lucide-react";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import StatisticsImage from '../../../public/assets/statistics/Statistics.webp';

const StatisticsComp = () => {
    const [data] = useState(statisticsData);
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, {
        once: false,
        amount: 0.1,
    });
    // Helper to render tables
    // Helper to render tables — responsive: cards on mobile, table on larger screens
    const renderTable = (block) => {
        if (!block || !block.rows) return null;

        return (
            <>
                {/* ===== MOBILE: stacked cards (below sm) ===== */}
                <div className="space-y-3 sm:hidden">
                    {block?.rows?.map((row, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-[#14301F]/10 bg-white p-4 shadow-sm"
                        >
                            {/* First column as the card's title/heading */}
                            <div className="mb-2.5 text-sm font-bold text-[#14301F]">
                                {row[0]}
                            </div>
                            <div className="space-y-1.5">
                                {row.slice(1).map((cell, j) => (
                                    <div
                                        key={j}
                                        className="flex items-center justify-between border-t border-[#14301F]/5 pt-1.5 text-[13px]"
                                    >
                                        <span className="font-medium text-[#14301F]/50">
                                            {block.columns[j + 1]}
                                        </span>
                                        <span className="font-semibold text-[#14301F]/80">
                                            {cell}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ===== TABLET/DESKTOP: real table (sm and above) ===== */}
                <div className="hidden overflow-hidden rounded-2xl border border-[#14301F]/10 bg-white shadow-sm sm:block">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[560px] text-sm">
                            <thead>
                                <tr className="border-b border-[#14301F]/10 bg-[#72BB83]/[0.07]">
                                    {block?.columns?.map((col, i) => (
                                        <th
                                            key={i}
                                            className={`px-4 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#14301F]/50 sm:text-xs ${i === 0 ? "pl-5 sm:pl-6" : ""
                                                } ${i === block.columns.length - 1 ? "pr-5 sm:pr-6" : ""}`}
                                        >
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {block?.rows?.map((row, i) => (
                                    <tr
                                        key={i}
                                        className={`border-b border-[#14301F]/5 transition-colors hover:bg-[#72BB83]/[0.06] ${i === block.rows.length - 1 ? "border-b-0" : ""
                                            } ${i % 2 === 1 ? "bg-[#14301F]/[0.015]" : ""}`}
                                    >
                                        {row?.map((cell, j) => (
                                            <td
                                                key={j}
                                                className={`px-4 py-3.5 text-sm font-medium text-[#14301F]/70 ${j === 0 ? "pl-5 font-semibold text-[#14301F] sm:pl-6" : ""
                                                    } ${j === row.length - 1 ? "pr-5 sm:pr-6" : ""}`}
                                            >
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        );
    };

    // Helper to render green stats bars with visual trends
    // Helper to render green stats bars with visual trends
    const renderGreenBars = (rows) => {
        if (!rows) return null;
        const maxValue = Math.max(
            ...rows.map((row) => parseFloat(row[1]) || 0),
            1
        );

        return (
            <div className="space-y-2 sm:space-y-2.5">
                {rows.map((row, i) => {
                    const value = parseFloat(row[1]) || 0;
                    const percentage = (value / maxValue) * 100;
                    const trend = row[2] || "";

                    let TrendIcon = Minus;
                    let trendColor = "text-[#14301F]/40";
                    if (trend.includes("↑")) {
                        TrendIcon = ArrowUpRight;
                        trendColor = "text-[#72BB83]";
                    } else if (trend.includes("↓")) {
                        TrendIcon = ArrowDownRight;
                        trendColor = "text-rose-500";
                    }

                    const getCategoryIcon = (name) => {
                        const icons = {
                            "Green bonds": <CircleDollarSign className="h-3 w-3 text-[#72BB83]" strokeWidth={2} />,
                            "ESG funds": <Leaf className="h-3 w-3 text-[#72BB83]" strokeWidth={2} />,
                            "Solar investments": <Sun className="h-3 w-3 text-[#72BB83]" strokeWidth={2} />,
                            "Wind energy": <Wind className="h-3 w-3 text-[#72BB83]" strokeWidth={2} />,
                            "Battery storage": <Battery className="h-3 w-3 text-[#72BB83]" strokeWidth={2} />,
                            "Recycling initiatives": <Recycle className="h-3 w-3 text-[#72BB83]" strokeWidth={2} />,
                        };
                        return icons[name] || <BarChart3 className="h-3 w-3 text-[#14301F]/40" strokeWidth={2} />;
                    };

                    return (
                        <div key={i} className="space-y-1.5">
                            {/* Compact row */}
                            <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                                <span className="flex items-start gap-1.5 text-[11px] font-semibold leading-snug text-[#14301F] sm:text-xs">
                                    <span className="mt-0.5 flex-shrink-0">
                                        {getCategoryIcon(row[0])}
                                    </span>
                                    <span className="truncate">{row[0]}</span>
                                </span>
                                <div className="flex flex-shrink-0 items-center gap-1.5 pl-4 sm:pl-0">
                                    <span className="text-xs font-bold text-[#14301F] sm:text-[11px]">
                                        {row[1]}
                                    </span>
                                    <span className={`flex items-center gap-0.5 text-[9px] font-medium ${trendColor} sm:text-[10px]`}>
                                        <TrendIcon className="h-2.5 w-2.5" strokeWidth={2.5} />
                                        {trend.replace(/[↑↓]/g, "").trim() || ""}
                                    </span>
                                </div>
                            </div>

                            {/* Smaller Progress bar */}
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#14301F]/[0.06]">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-[#72BB83] to-[#5DA870] transition-all duration-700 ease-out"
                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    function StatBlock({ icon: Icon, title, note, source, children, last }) {
        return (
            <div className={last ? "" : "mb-10 sm:mb-14"}>
                <div className="mb-4 flex items-center gap-2.5 sm:mb-5">
                    <div className="inline-flex items-center justify-center rounded-xl bg-[#72BB83]/10 p-2 ring-1 ring-inset ring-[#72BB83]/20 sm:p-2.5">
                        <Icon className="h-4 w-4 text-[#72BB83] sm:h-5 sm:w-5" strokeWidth={2.25} />
                    </div>
                    <h2 className="text-lg font-bold tracking-tight text-[#14301F] sm:text-xl lg:text-2xl">
                        {title}
                    </h2>
                </div>

                {children}
            </div>
        );
    }

    // Fact card icons — single unified brand palette
    const factIcons = [
        { icon: Users, bg: "bg-[#72BB83]/10" },
        { icon: DollarSign, bg: "bg-[#72BB83]/10" },
        { icon: Landmark, bg: "bg-[#72BB83]/10" },
        { icon: Leaf, bg: "bg-[#72BB83]/10" },
    ];

    return (
        <>
            {/* ========== HERO SECTION ========== */}
            <section className="relative overflow-hidden flex items-center min-h-[100dvh] bg-[#E6FBF1]">
                <div className="relative mx-6 w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-0">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">

                        {/* ===== LEFT CONTENT - Slide from Left ===== */}
                        <motion.div
                            ref={sectionRef}
                            initial={{ opacity: 0, x: -60 }}
                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <motion.span
                                initial={{ opacity: 0, x: -40 }}
                                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
                                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                                className="inline-flex items-center gap-2.5 text-md font-bold uppercase tracking-[0.16em] text-[#72BB83]"
                            >
                                Data-driven insights
                            </motion.span>

                            <motion.h1
                                initial={{ opacity: 0, x: -50 }}
                                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                                transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                                className="mt-4 text-[2rem] font-extrabold leading-[1.1] tracking-tight text-[#14301F] sm:text-[2.5rem] lg:text-[3.2rem]"
                            >
                                Statistics
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, x: -50 }}
                                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                                transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                                className="mt-3 max-w-[55ch] text-sm font-medium text-[#14301F]/70 sm:text-base lg:text-lg"
                            >
                                The shape of financial inclusion and sustainable finance by
                                country and by institution.
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
                                <div className="overflow-hidden">
                                    <Image
                                        src={StatisticsImage}
                                        alt="Statistics Illustration"
                                        className="h-auto w-full object-cover transition-transform duration-500 hover:scale-105"
                                        priority
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ========== STATISTICS SECTION ========== */}
            <section className="relative overflow-hidden bg-[#E6FBF1] py-12 sm:py-16 lg:py-24">
                <div className="relative mx-6 px-4 sm:px-6 lg:px-8">

                    {/* ========== FACT CARDS ========== */}
                    <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5">
                        {data?.facts?.map((fact, i) => {
                            const { icon: Icon, bg } = factIcons[i] || factIcons[0];
                            return (
                                <div
                                    key={i}
                                    className="group relative overflow-hidden rounded-2xl border border-[#14301F]/10 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#72BB83]/40 hover:shadow-xl sm:p-6"
                                >
                                    <div
                                        className={`absolute -right-8 -top-8 h-24 w-24 rounded-full ${bg} opacity-60 blur-2xl transition-opacity duration-300 group-hover:opacity-100`}
                                    />
                                    <div className="relative">
                                        <div
                                            className={`mb-4 inline-flex items-center justify-center rounded-xl ${bg} p-2.5 ring-1 ring-inset ring-[#72BB83]/20 transition-transform duration-300 group-hover:scale-110`}
                                        >
                                            <Icon className="h-5 w-5 text-[#72BB83]" strokeWidth={2.25} />
                                        </div>
                                        <div className="text-[1.7rem] font-extrabold leading-none tracking-tight text-[#14301F] sm:text-3xl">
                                            {fact.value}
                                        </div>
                                        <div className="mt-2 text-[13px] font-bold text-[#14301F]/80 sm:text-sm">
                                            {fact.label}
                                        </div>
                                        <div className="mt-1 text-[11px] font-medium text-[#14301F]/50 sm:text-xs">
                                            {fact.source}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* ========== COUNTRY STATS ========== */}
                    {data.countryStats && (
                        <StatBlock
                            icon={Globe}
                            title={data.countryStats.title}
                            note={data.countryStats.note}
                            source={data.countryStats.source}
                        >
                            {renderTable(data.countryStats)}
                        </StatBlock>
                    )}

                    {/* ========== COMPANY STATS ========== */}
                    {data.companyStats && (
                        <StatBlock
                            icon={Building2}
                            title={data.companyStats.title}
                            note={data.companyStats.note}
                            source={data.companyStats.source}
                        >
                            {renderTable(data.companyStats)}
                        </StatBlock>
                    )}

                    {/* ========== GREEN STATS - SMALLER CARD ========== */}
                    {/* {data.greenStats && (
                        <StatBlock
                            icon={TrendingUp}
                            title={data.greenStats.title}
                            note={data.greenStats.note}
                            source={data.greenStats.source}
                            last
                        >
                            <div className="w-full max-w-2xl mx-auto rounded-2xl border border-[#14301F]/10 bg-white p-3 shadow-sm sm:p-4 lg:p-5">
                                {renderGreenBars(data.greenStats.rows)}
                            </div>
                        </StatBlock>
                    )} */}
                </div>
            </section>
        </>
    );
};

export default StatisticsComp;