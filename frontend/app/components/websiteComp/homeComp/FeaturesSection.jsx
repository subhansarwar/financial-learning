"use client";

import { ArrowUpRight, Wallet, DollarSign, LayoutGrid, Heart, TrendingUp, Target, Calendar, CalendarDays, PieChart, Folder } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import interactiveToolsImg from "@/public/assets/featuresSectionImages/InteractivetoolsRightSideImage.webp";
import publishedPapersImg from "@/public/assets/featuresSectionImages/resarchSideImage.webp";

/* ---------- Scroll-reveal hook (modified for re-trigger) ---------- */
function useInView(threshold = 0.2) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                setInView(entry.isIntersecting);
            },
            { threshold }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [threshold]);

    return [ref, inView];
}

/* ---------- Small reusable bits ---------- */
function Eyebrow({ children }) {
    return (
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#2563EB] sm:text-sm">
            {children}
        </div>
    );
}

function BrowseAllButton() {
    return (
        <a
            href="#browse"
            className="group mt-6 inline-flex items-center gap-3 text-sm font-semibold text-[#0F172A] no-underline sm:mt-8"
        >
            Browse all
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#166534] text-white transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-[#14532D]">
                <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
            </span>
        </a>
    );
}

/* ---------- Row 1: Interactive Tools ---------- */
function BudgetMiniCard({ tag, mainIcon: MainIcon, mainIconBg, mainIconColor, rows }) {
    return (
        <div className="h-full w-full rounded-2xl border border-slate-200 bg-white p-3.5 transition-colors duration-300 hover:border-slate-300 sm:p-4">
            {/* Header: icon avatar + title + arrow */}
            <div className="mb-4 flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                    <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full sm:h-9 sm:w-9"
                        style={{ backgroundColor: mainIconBg, color: mainIconColor }}
                    >
                        <MainIcon className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <span className="text-[10.5px] font-bold uppercase leading-tight tracking-wide text-slate-800 sm:text-xs">
                        {tag}
                    </span>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-300" strokeWidth={2} />
            </div>

            {/* Rows: small colored icon + label */}
            <div className="space-y-2.5">
                {rows.map((row, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <row.icon
                            className="h-3.5 w-3.5 shrink-0"
                            style={{ color: row.color }}
                            strokeWidth={2}
                        />
                        <span className="text-[11px] text-slate-500 sm:text-xs">{row.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function InteractiveToolsRow() {
    const [ref, inView] = useInView(0.15);

    return (
        <div
            ref={ref}
            className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16"
        >
            {/* Image */}
            <div
                className={`order-1 flex justify-center transition-all duration-700 ease-out lg:justify-start ${inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                    }`}
            >
                <div className="relative w-full max-w-[420px]">
                    <Image
                        src={interactiveToolsImg}
                        alt="Interactive budgeting dashboard preview"
                        className="h-auto w-full object-contain transition-transform duration-700 group-hover:scale-105"
                        priority={false}
                    />
                </div>
            </div>

            {/* Text */}
            <div
                className={`order-2 transition-all delay-100 duration-700 ease-out ${inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                    }`}
            >
                <div className={`transition-all duration-700 delay-150 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
                    }`}>
                    <Eyebrow>interactive tools</Eyebrow>
                </div>
                <h2 className={`text-3xl font-bold leading-tight tracking-tight text-[#0F172A] sm:text-4xl lg:text-[2.5rem] transition-all duration-700 delay-200 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                    }`}>
                    Turn theory into numbers
                </h2>
                <p className={`mt-4 max-w-md text-sm leading-relaxed text-slate-500 sm:text-base transition-all duration-700 delay-300 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                    }`}>
                    Free forever, no sign-up. Everything runs in your browser your
                    numbers never leave your device.
                </p>

                {/* Cards Row - Fixed Width */}
                <div className="mt-6 flex flex-wrap items-stretch gap-3 w-full sm:mt-8 sm:gap-4">
                    {[
                        {
                            tag: "Your monthly budget",
                            mainIcon: Wallet,
                            mainIconBg: "#DBEAFE",
                            mainIconColor: "#3B82F6",
                            rows: [
                                { icon: DollarSign, color: "#3B82F6", label: "Monthly take-home income" },
                                { icon: LayoutGrid, color: "#F59E0B", label: "Needs rent, bills, groceries (%)" },
                                { icon: Heart, color: "#EC4899", label: "Wants fun, eating out (%)" },
                            ],
                        },
                        {
                            tag: "Your monthly budget",
                            mainIcon: TrendingUp,
                            mainIconBg: "#D1FAE5",
                            mainIconColor: "#10B981",
                            rows: [
                                { icon: Target, color: "#3B82F6", label: "Starting amount" },
                                { icon: Calendar, color: "#F59E0B", label: "Monthly contribution" },
                                { icon: CalendarDays, color: "#EC4899", label: "Annual return (%)" },
                            ],
                        },
                        {
                            tag: "Your monthly budget",
                            mainIcon: PieChart,
                            mainIconBg: "#FEF3C7",
                            mainIconColor: "#D97706",
                            rows: [
                                { icon: Folder, color: "#3B82F6", label: "Company A" },
                                { icon: Folder, color: "#F59E0B", label: "Company B" },
                            ],
                        },
                    ].map((card, idx) => (
                        <div
                            key={idx}
                            className="w-full sm:w-[calc(50%-8px)] lg:w-[calc(44.333%-11px)]"
                            style={{
                                transitionDelay: `${400 + idx * 100}ms`,
                                opacity: inView ? 1 : 0,
                                transform: inView ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)"
                            }}
                        >
                            <BudgetMiniCard
                                tag={card.tag}
                                mainIcon={card.mainIcon}
                                mainIconBg={card.mainIconBg}
                                mainIconColor={card.mainIconColor}
                                rows={card.rows}
                            />
                        </div>
                    ))}
                </div>

                <div className={`transition-all duration-700 delay-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                    }`}>
                    <BrowseAllButton />
                </div>
            </div>
        </div>
    );
}

/* ---------- Row 2: Case Studies ---------- */
function CaseStudiesMockup() {
    return (
        <div className="w-full max-w-[440px] rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(15,23,42,0.15)] sm:p-5">
            {/* fake browser bar */}
            <div className="mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-300" />
                <span className="h-2 w-2 rounded-full bg-yellow-300" />
                <span className="h-2 w-2 rounded-full bg-green-300" />
                <span className="ml-3 flex-1 rounded-full bg-slate-50 px-3 py-1 text-[10px] text-slate-400">
                    #MyResource
                </span>
            </div>

            <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                    <span className="text-sm font-bold">G</span>
                </div>
                <div className="flex-1">
                    <p className="text-[11px] font-semibold text-slate-400">
                        Grameen Bank
                    </p>
                    <h4 className="mt-0.5 text-sm font-bold text-[#0F172A] sm:text-base">
                        Grameen Bank: Banking on trust instead of collateral
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500">
                        Community professor Muhammad Yunus lent thousands of dollars to
                        villagers without requiring collateral — proving trust-based
                        lending could work at scale.
                    </p>
                    <a
                        href="#read"
                        className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 no-underline transition-all duration-300 hover:gap-2"
                    >
                        Read & learn <ArrowUpRight className="h-3 w-3" />
                    </a>
                </div>
            </div>
        </div>
    );
}

function CaseStudiesRow() {
    const [ref, inView] = useInView(0.15);

    return (
        <div
            ref={ref}
            className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16"
        >
            {/* Text */}
            <div
                className={`order-2 transition-all duration-700 ease-out lg:order-1 ${inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                    }`}
            >
                <div className={`transition-all duration-700 delay-150 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
                    }`}>
                    <Eyebrow>Learn from real examples</Eyebrow>
                </div>
                <h2 className={`text-3xl font-bold leading-tight tracking-tight text-[#0F172A] sm:text-4xl lg:text-[2.5rem] transition-all duration-700 delay-200 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                    }`}>
                    Case studies
                </h2>
                <p className={`mt-4 max-w-md text-sm leading-relaxed text-slate-500 sm:text-base transition-all duration-700 delay-300 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                    }`}>
                    Real organisations, real numbers, real lessons from Grameen's
                    village groups to Ørsted's wind-farm pivot.
                </p>
                <div className={`transition-all duration-700 delay-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                    }`}>
                    <BrowseAllButton />
                </div>
            </div>

            {/* Mockup */}
            <div
                className={`order-1 flex justify-center transition-all delay-100 duration-700 ease-out lg:order-2 lg:justify-end ${inView ? "translate-y-0 opacity-100 scale-100" : "translate-y-8 opacity-0 scale-95"
                    }`}
            >
                <CaseStudiesMockup />
            </div>
        </div>
    );
}

/* ---------- Row 3: Published Papers ---------- */
function PublishedPapersRow() {
    const [ref, inView] = useInView(0.15);

    return (
        <div
            ref={ref}
            className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16"
        >
            {/* Image */}
            <div
                className={`order-1 flex justify-center transition-all duration-700 ease-out lg:justify-start ${inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                    }`}
            >
                <div className="relative w-full max-w-[340px]">
                    <Image
                        src={publishedPapersImg}
                        alt="Published paper submission form preview"
                        className="h-auto w-full object-contain transition-transform duration-700 hover:scale-105"
                        priority={false}
                    />
                </div>
            </div>

            {/* Text */}
            <div
                className={`order-2 transition-all delay-100 duration-700 ease-out ${inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                    }`}
            >
                <div className={`transition-all duration-700 delay-150 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
                    }`}>
                    <Eyebrow>Published papers</Eyebrow>
                </div>
                <h2 className={`text-3xl font-bold leading-tight tracking-tight text-[#0F172A] sm:text-4xl lg:text-[2.5rem] transition-all duration-700 delay-200 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                    }`}>
                    Research
                </h2>
                <p className={`mt-4 max-w-md text-sm leading-relaxed text-slate-500 sm:text-base transition-all duration-700 delay-300 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                    }`}>
                    Share your essay or research with other learners. PDF only, up to
                    10 MB. Papers are student contributions they are not peer-reviewed
                    by the platform.
                </p>
                <div className={`transition-all duration-700 delay-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                    }`}>
                    <BrowseAllButton />
                </div>
            </div>
        </div>
    );
}

/* ---------- Main Section ---------- */
export default function FeaturesSection() {
    return (
        <section className="bg-white py-16 sm:py-20 lg:py-24 overflow-hidden">
            <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-20 sm:gap-24 lg:gap-28">
                    <InteractiveToolsRow />
                    <CaseStudiesRow />
                    <PublishedPapersRow />
                </div>
            </div>
        </section>
    );
}