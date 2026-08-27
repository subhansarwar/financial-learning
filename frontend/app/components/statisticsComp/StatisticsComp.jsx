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
    Info,
    Landmark,
    Leaf,
    Minus,
    Recycle,
    Sun,
    TrendingUp,
    Users,
    Wind
} from "lucide-react";
import { useState } from "react";
import StatisticsImage from '../../../public/assets/statistics/Statistics.webp';
import Image from "next/image";

const StatisticsComp = () => {
    const [data] = useState(statisticsData);

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
            <div className="space-y-5 sm:space-y-6">
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
                            "Green bonds": <CircleDollarSign className="h-4 w-4 text-[#72BB83]" strokeWidth={2} />,
                            "ESG funds": <Leaf className="h-4 w-4 text-[#72BB83]" strokeWidth={2} />,
                            "Solar investments": <Sun className="h-4 w-4 text-[#72BB83]" strokeWidth={2} />,
                            "Wind energy": <Wind className="h-4 w-4 text-[#72BB83]" strokeWidth={2} />,
                            "Battery storage": <Battery className="h-4 w-4 text-[#72BB83]" strokeWidth={2} />,
                            "Recycling initiatives": <Recycle className="h-4 w-4 text-[#72BB83]" strokeWidth={2} />,
                        };
                        return icons[name] || <BarChart3 className="h-4 w-4 text-[#14301F]/40" strokeWidth={2} />;
                    };

                    return (
                        <div key={i} className="space-y-2.5">
                            {/* Row 1 on mobile: icon + label. Row 2: value + trend (stacks below on mobile, inline on sm+) */}
                            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                                <span className="flex items-start gap-2 text-sm font-semibold leading-snug text-[#14301F]">
                                    <span className="mt-0.5 flex-shrink-0">
                                        {getCategoryIcon(row[0])}
                                    </span>
                                    <span>{row[0]}</span>
                                </span>
                                <div className="flex flex-shrink-0 items-center gap-3 pl-6 sm:pl-0">
                                    <span className="text-base font-bold text-[#14301F] sm:text-sm">
                                        {row[1]}
                                    </span>
                                    <span className={`flex items-center gap-0.5 text-xs font-medium ${trendColor}`}>
                                        <TrendIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
                                        {trend.replace(/[↑↓]/g, "").trim() || ""}
                                    </span>
                                </div>
                            </div>

                            {/* Progress bar — always full width */}
                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#14301F]/[0.06]">
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
            <section className="relative overflow-hidden flex items-center min-h-[100dvh] bg-[#E5E5E5]">
                <div className="relative mx-6 w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-0">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
                        {/* Left Content */}
                        <div>
                            <span className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.16em] text-[#72BB83]">
                                Data-driven insights
                            </span>
                            <h1 className="mt-4 text-[2rem] font-extrabold leading-[1.1] tracking-tight text-[#14301F] sm:text-[2.5rem] lg:text-[3.2rem]">
                                Statistics
                            </h1>
                            <p className="mt-3 max-w-[55ch] text-sm font-medium text-[#14301F]/70 sm:text-base lg:text-lg">
                                The shape of financial inclusion and sustainable finance by
                                country and by institution.
                            </p>
                        </div>

                        {/* Right Image */}
                        <div className="flex justify-center lg:justify-end">
                            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
                                <div className="overflow-hidden rounded-2xl shadow-lg">
                                    <Image
                                        src={StatisticsImage}
                                        alt="Statistics Illustration"
                                        className="h-auto w-full object-cover"
                                        priority
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== STATISTICS SECTION ========== */}
            <section className="relative overflow-hidden bg-white py-12 sm:py-16 lg:py-24">

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
                                    {/* decorative corner glow */}
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

                    {/* ========== GREEN STATS ========== */}
                    {data.greenStats && (
                        <StatBlock
                            icon={TrendingUp}
                            title={data.greenStats.title}
                            note={data.greenStats.note}
                            source={data.greenStats.source}
                            last
                        >
                            <div className="rounded-2xl border border-[#14301F]/10 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
                                {renderGreenBars(data.greenStats.rows)}
                            </div>
                        </StatBlock>
                    )}
                </div>
            </section>
        </>
    );
};

export default StatisticsComp;