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

const StatisticsComp = () => {
    const [data] = useState(statisticsData);

    // Helper to render tables
    const renderTable = (block) => {
        if (!block || !block.rows) return null;
        return (
            <div className="overflow-x-auto rounded-xl2 border border-line bg-card shadow-sm">
                <table className="w-full min-w-[640px] text-sm">
                    <thead>
                        <tr className="border-b border-line bg-cream-2/70">
                            {block?.columns?.map((col, i) => (
                                <th
                                    key={i}
                                    className={`px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-muted ${i === 0 ? "pl-6" : ""
                                        } ${i === block.columns.length - 1 ? "pr-6" : ""}`}
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
                                className={`border-b border-line-soft transition-colors hover:bg-cream-2/40 ${i === block.rows.length - 1 ? "border-b-0" : ""
                                    }`}
                            >
                                {row?.map((cell, j) => (
                                    <td
                                        key={j}
                                        className={`px-4 py-3 text-sm font-medium text-ink-2 ${j === 0 ? "pl-6 font-semibold text-ink" : ""
                                            } ${j === row.length - 1 ? "pr-6" : ""}`}
                                    >
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    // Helper to render green stats bars with visual trends
    const renderGreenBars = (rows) => {
        if (!rows) return null;
        // Calculate max value for bar scaling
        const maxValue = Math.max(
            ...rows.map((row) => parseFloat(row[1]) || 0),
            1
        );

        // Color palette for bars
        const colors = [
            "bg-blue-500",
            "bg-indigo-500",
            "bg-purple-500",
            "bg-amber-500",
            "bg-emerald-500",
            "bg-rose-500",
            "bg-cyan-500",
            "bg-teal-500",
        ];

        return (
            <div className="space-y-4">
                {rows.map((row, i) => {
                    const value = parseFloat(row[1]) || 0;
                    const percentage = (value / maxValue) * 100;
                    const trend = row[2] || "";

                    let TrendIcon = Minus;
                    let trendColor = "text-muted";
                    if (trend.includes("↑")) {
                        TrendIcon = ArrowUpRight;
                        trendColor = "text-emerald-500";
                    } else if (trend.includes("↓")) {
                        TrendIcon = ArrowDownRight;
                        trendColor = "text-rose-500";
                    }

                    const barColor = colors[i % colors.length];

                    // Get appropriate icon for the category
                    const getCategoryIcon = (name) => {
                        const icons = {
                            "Green bonds": <CircleDollarSign className="h-4 w-4 text-emerald-500" strokeWidth={2} />,
                            "ESG funds": <Leaf className="h-4 w-4 text-emerald-500" strokeWidth={2} />,
                            "Solar investments": <Sun className="h-4 w-4 text-amber-500" strokeWidth={2} />,
                            "Wind energy": <Wind className="h-4 w-4 text-cyan-500" strokeWidth={2} />,
                            "Battery storage": <Battery className="h-4 w-4 text-purple-500" strokeWidth={2} />,
                            "Recycling initiatives": <Recycle className="h-4 w-4 text-emerald-500" strokeWidth={2} />,
                        };
                        return icons[name] || <BarChart3 className="h-4 w-4 text-muted" strokeWidth={2} />;
                    };

                    return (
                        <div key={i} className="space-y-1.5">
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2 font-semibold text-ink">
                                    {getCategoryIcon(row[0])}
                                    {row[0]}
                                </span>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-brand-deep">{row[1]}</span>
                                    <span className={`flex items-center gap-0.5 text-xs font-medium ${trendColor}`}>
                                        <TrendIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
                                        {trend.replace(/[↑↓]/g, "").trim() || ""}
                                    </span>
                                </div>
                            </div>
                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-cream-2">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // Fact card icons with colors
    const factIcons = [
        { icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
        { icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50" },
        { icon: Landmark, color: "text-purple-500", bg: "bg-purple-50" },
        { icon: Leaf, color: "text-amber-500", bg: "bg-amber-50" },
    ];

    // Section icons
    const sectionIcons = {
        country: Globe,
        company: Building2,
        green: TrendingUp,
    };

    const sectionColors = {
        country: "text-brand",
        company: "text-indigo-500",
        green: "text-emerald-500",
    };

    return (
        <>
            {/* ========== HERO SECTION ========== */}
            <section className="relative overflow-hidden border-b border-line-soft bg-cream-2 py-16 sm:py-20 lg:py-[88px]">
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(600px 400px at 10% 20%, rgba(67,56,202,.06), transparent 60%), radial-gradient(500px 400px at 90% 80%, rgba(99,102,241,.05), transparent 55%)",
                    }}
                />
                <div className="relative mx-auto max-w-[1180px] px-4 sm:px-6">
                    <div className="max-w-[48rem]">
                        <span className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.16em] text-brand-deep">
                            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                            Data-driven insights
                        </span>
                        <h1 className="mt-5 text-[2.2rem] font-extrabold leading-[1.08] tracking-tight text-ink sm:text-[2.8rem] lg:text-[3.6rem]">
                            Statistics
                        </h1>
                        <p className="mt-4 max-w-[55ch] text-base font-medium text-ink-2 sm:text-lg">
                            The shape of financial inclusion and sustainable finance — by
                            country and by institution.
                        </p>
                    </div>
                </div>
            </section>

            {/* ========== STATISTICS SECTION ========== */}
            <section className="py-14 sm:py-[78px]">
                <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
                    {/* ========== FACT CARDS ========== */}
                    <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {data?.facts?.map((fact, i) => {
                            const { icon: Icon, color, bg } = factIcons[i] || factIcons[0];
                            return (
                                <div
                                    key={i}
                                    className="group relative overflow-hidden rounded-xl2 border border-line bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-card-lg"
                                >
                                    <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-5 transition-opacity group-hover:opacity-10" />
                                    <div className="relative">
                                        <div className={`mb-3 inline-flex rounded-full ${bg} p-2.5`}>
                                            <Icon className={`h-5 w-5 ${color}`} strokeWidth={2} />
                                        </div>
                                        <div className="text-3xl font-extrabold tracking-tight text-brand-deep group-hover:text-brand">
                                            {fact.value}
                                        </div>
                                        <div className="mt-1 text-sm font-bold text-ink-2">{fact.label}</div>
                                        <div className="mt-2 text-xs font-medium text-muted">{fact.source}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* ========== COUNTRY STATS ========== */}
                    {data.countryStats && (
                        <div className="mb-12">
                            <div className="mb-4 flex items-center gap-2.5">
                                <div className="rounded-full bg-brand-soft p-2">
                                    <Globe className="h-5 w-5 text-brand" strokeWidth={2} />
                                </div>
                                <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                                    {data.countryStats.title}
                                </h2>
                            </div>
                            {renderTable(data.countryStats)}
                            {data.countryStats.note && (
                                <div className="mt-3 flex items-start gap-2 text-xs font-medium text-muted">
                                    <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-brand" strokeWidth={2} />
                                    <span>
                                        {data.countryStats.note} — Source: {data.countryStats.source}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ========== COMPANY STATS ========== */}
                    {data.companyStats && (
                        <div className="mb-12">
                            <div className="mb-4 flex items-center gap-2.5">
                                <div className="rounded-full bg-indigo-50 p-2">
                                    <Building2 className="h-5 w-5 text-indigo-500" strokeWidth={2} />
                                </div>
                                <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                                    {data.companyStats.title}
                                </h2>
                            </div>
                            {renderTable(data.companyStats)}
                            {data.companyStats.note && (
                                <div className="mt-3 flex items-start gap-2 text-xs font-medium text-muted">
                                    <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-brand" strokeWidth={2} />
                                    <span>
                                        {data.companyStats.note} — Source: {data.companyStats.source}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ========== GREEN STATS ========== */}
                    {data.greenStats && (
                        <div>
                            <div className="mb-4 flex items-center gap-2.5">
                                <div className="rounded-full bg-emerald-50 p-2">
                                    <TrendingUp className="h-5 w-5 text-emerald-500" strokeWidth={2} />
                                </div>
                                <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                                    {data.greenStats.title}
                                </h2>
                            </div>
                            <div className="rounded-xl2 border border-line bg-card p-6 shadow-sm sm:p-8">
                                {renderGreenBars(data.greenStats.rows)}
                            </div>
                            {data.greenStats.note && (
                                <div className="mt-3 flex items-start gap-2 text-xs font-medium text-muted">
                                    <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-brand" strokeWidth={2} />
                                    <span>
                                        {data.greenStats.note} — Source: {data.greenStats.source}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default StatisticsComp;