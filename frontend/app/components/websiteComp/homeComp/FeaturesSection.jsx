"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import interactiveToolsImg from "@/public/assets/featuresSectionImages/InteractivetoolsRightSideImage.webp";
import publishedPapersImg from "@/public/assets/featuresSectionImages/resarchSideImage.webp";

/* ---------- Scroll-reveal hook ---------- */
function useInView(threshold = 0.2) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.unobserve(node);
                }
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
            {/* <span className="h-px w-5 bg-[#2563EB]" /> */}
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
            < span className="grid h-8 w-8 place-items-center rounded-full bg-[#166534] text-white transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-[#14532D]" >
                <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
            </span >
        </a >
    );
}

/* ---------- Row 1: Interactive Tools ---------- */
function BudgetMiniCard({ tag, tagColor, dotColor, rows }) {
    return (
        <div className="w-full rounded-xl border border-slate-100 bg-white p-3 shadow-[0_2px_10px_rgba(15,23,42,0.06)] sm:p-4">
            <span
                className="mb-3 inline-block rounded-md px-2 py-1 text-[9px] font-bold uppercase tracking-wide sm:text-[10px]"
                style={{ backgroundColor: tagColor.bg, color: tagColor.text }}
            >
                {tag}
            </span>
            <div className="space-y-2">
                {rows.map((row, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <span
                            className="h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ backgroundColor: dotColor }}
                        />
                        <span className="h-1.5 flex-1 rounded-full bg-slate-100">
                            <span
                                className="block h-1.5 rounded-full"
                                style={{ width: row, backgroundColor: dotColor }}
                            />
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function InteractiveToolsRow() {
    const [ref, inView] = useInView();

    return (
        <div
            ref={ref}
            className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16"
        >
            {/* Image */}
            <div
                className={`order-1 flex justify-center transition-all duration-700 ease-out lg:justify-start ${inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                    }`}
            >
                <div className="relative w-full max-w-[420px]">
                    <Image
                        src={interactiveToolsImg}
                        alt="Interactive budgeting dashboard preview"
                        className="h-auto w-full object-contain"
                        priority={false}
                    />
                </div>
            </div>

            {/* Text */}
            <div
                className={`order-2 transition-all delay-100 duration-700 ease-out ${inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                    }`}
            >
                <Eyebrow>interactive tools</Eyebrow>
                <h2 className="text-3xl font-bold leading-tight tracking-tight text-[#0F172A] sm:text-4xl lg:text-[2.5rem]">
                    Turn theory into numbers
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-500 sm:text-base">
                    Free forever, no sign-up. Everything runs in your browser your
                    numbers never leave your device.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-3 xs:grid-cols-3 sm:mt-8 sm:grid-cols-3 sm:gap-4">
                    <BudgetMiniCard
                        tag="Your monthly budget"
                        tagColor={{ bg: "#DCFCE7", text: "#166534" }}
                        dotColor="#22C55E"
                        rows={["70%", "45%", "30%"]}
                    />
                    <BudgetMiniCard
                        tag="Your monthly budget"
                        tagColor={{ bg: "#FCE7F3", text: "#9D174D" }}
                        dotColor="#EC4899"
                        rows={["55%", "80%", "40%"]}
                    />
                    <BudgetMiniCard
                        tag="Your monthly budget"
                        tagColor={{ bg: "#FEF3C7", text: "#92400E" }}
                        dotColor="#F59E0B"
                        rows={["65%", "35%", "50%"]}
                    />
                </div>

                <BrowseAllButton />
            </div>
        </div>
    );
}

/* ---------- Row 2: Case Studies (no source image → custom mockup) ---------- */
function CaseStudiesMockup() {
    return (
        <div className="w-full max-w-[440px] rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition-transform duration-500 ease-out hover:-translate-y-1 sm:p-5">
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
                        className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 no-underline"
                    >
                        Read & learn <ArrowUpRight className="h-3 w-3" />
                    </a>
                </div>
            </div>
        </div >
    );
}

function CaseStudiesRow() {
    const [ref, inView] = useInView();

    return (
        <div
            ref={ref}
            className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16"
        >
            {/* Text */}
            <div
                className={`order-2 transition-all duration-700 ease-out lg:order-1 ${inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                    }`}
            >
                <Eyebrow>Learn from real examples</Eyebrow>
                <h2 className="text-3xl font-bold leading-tight tracking-tight text-[#0F172A] sm:text-4xl lg:text-[2.5rem]">
                    Case studies
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-500 sm:text-base">
                    Real organisations, real numbers, real lessons from Grameen's
                    village groups to Ørsted's wind-farm pivot.
                </p>
                <BrowseAllButton />
            </div>

            {/* Mockup */}
            <div
                className={`order-1 flex justify-center transition-all delay-100 duration-700 ease-out lg:order-2 lg:justify-end ${inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                    }`}
            >
                <CaseStudiesMockup />
            </div>
        </div>
    );
}

/* ---------- Row 3: Published Papers ---------- */
function PublishedPapersRow() {
    const [ref, inView] = useInView();

    return (
        <div
            ref={ref}
            className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16"
        >
            {/* Image */}
            <div
                className={`order-1 flex justify-center transition-all duration-700 ease-out lg:justify-start ${inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                    }`}
            >
                <div className="relative w-full max-w-[340px]">
                    <Image
                        src={publishedPapersImg}
                        alt="Published paper submission form preview"
                        className="h-auto w-full object-contain"
                        priority={false}
                    />
                </div>
            </div>

            {/* Text */}
            <div
                className={`order-2 transition-all delay-100 duration-700 ease-out ${inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                    }`}
            >
                <Eyebrow>Published papers</Eyebrow>
                <h2 className="text-3xl font-bold leading-tight tracking-tight text-[#0F172A] sm:text-4xl lg:text-[2.5rem]">
                    Research
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-500 sm:text-base">
                    Share your essay or research with other learners. PDF only, up to
                    10 MB. Papers are student contributions they are not peer-reviewed
                    by the platform.
                </p>
                <BrowseAllButton />
            </div>
        </div>
    );
}

/* ---------- Main Section ---------- */
export default function FeaturesSection() {
    return (
        <section className="bg-white py-16 sm:py-20 lg:py-24">
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