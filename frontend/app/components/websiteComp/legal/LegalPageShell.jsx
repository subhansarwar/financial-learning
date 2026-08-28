// app/components/websiteComp/legal/LegalPageShell.jsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
    AlertTriangle,
    ArrowUpRight,
    Award,
    Baby,
    Ban,
    BookOpenCheck,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Clock3,
    Cookie,
    Database,
    Gavel,
    Globe2,
    GraduationCap,
    Handshake,
    HelpCircle,
    ListChecks,
    Lock,
    Mail,
    Minus,
    Plus,
    Printer,
    RefreshCw,
    Scale,
    ScrollText,
    Search,
    Server,
    Settings2,
    ShieldAlert,
    ShieldCheck,
    SlidersHorizontal,
    Sparkles,
    Timer,
    UserCheck,
    UserCog,
} from "lucide-react";

/* Server Components can't hand function props (icon components) to a Client
   Component, so pages reference icons by key and we resolve them here. */
const ICONS = {
    AlertTriangle,
    Award,
    Baby,
    Ban,
    BookOpenCheck,
    Cookie,
    Database,
    Gavel,
    Globe2,
    GraduationCap,
    Handshake,
    HelpCircle,
    Lock,
    Mail,
    RefreshCw,
    Scale,
    ScrollText,
    Server,
    Settings2,
    ShieldAlert,
    ShieldCheck,
    SlidersHorizontal,
    Sparkles,
    Timer,
    UserCheck,
    UserCog,
};

/* ------------------------------------------------------------------ */
/*  Block renderer — pages describe each section as an array of        */
/*  plain-data blocks so the markup / spacing stays consistent.        */
/* ------------------------------------------------------------------ */

const TONE = {
    green: {
        wrap: "border-[#72BB83]/30 bg-[#72BB83]/8",
        icon: "text-[#72BB83]",
        dot: "bg-[#72BB83]",
    },
    amber: {
        wrap: "border-amber-300/50 bg-amber-50",
        icon: "text-amber-500",
        dot: "bg-amber-400",
    },
    blue: {
        wrap: "border-sky-300/50 bg-sky-50",
        icon: "text-sky-500",
        dot: "bg-sky-400",
    },
    rose: {
        wrap: "border-rose-300/50 bg-rose-50",
        icon: "text-rose-500",
        dot: "bg-rose-400",
    },
};

function LegalBlocks({ blocks }) {
    return (
        <div className="space-y-4">
            {blocks.map((block, i) => {
                switch (block.type) {
                    case "p":
                        return (
                            <p
                                key={i}
                                className="text-[15px] font-normal leading-[1.75] text-[#14301F]/75"
                            >
                                {block.text}
                            </p>
                        );

                    case "subhead":
                        return (
                            <h3
                                key={i}
                                className="pt-1 text-[15px] font-bold tracking-tight text-[#14301F]"
                            >
                                {block.text}
                            </h3>
                        );

                    case "list":
                        return (
                            <ul key={i} className="space-y-2.5">
                                {block.items.map((item, j) => (
                                    <li
                                        key={j}
                                        className="flex items-start gap-3 text-[15px] font-normal leading-[1.7] text-[#14301F]/75"
                                    >
                                        <span className="mt-[9px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#72BB83]" />
                                        <span>
                                            {typeof item === "string" ? (
                                                item
                                            ) : (
                                                <>
                                                    <span className="font-semibold text-[#14301F]">
                                                        {item.term}
                                                    </span>{" "}
                                                    {item.text}
                                                </>
                                            )}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        );

                    case "note": {
                        const tone = TONE[block.tone] || TONE.green;
                        return (
                            <div
                                key={i}
                                className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 ${tone.wrap}`}
                            >
                                <Sparkles
                                    className={`mt-0.5 h-4 w-4 flex-shrink-0 ${tone.icon}`}
                                    strokeWidth={2.25}
                                />
                                <p className="text-[14px] font-medium leading-[1.65] text-[#14301F]/80">
                                    {block.text}
                                </p>
                            </div>
                        );
                    }

                    case "table":
                        return (
                            <div
                                key={i}
                                className="overflow-x-auto rounded-2xl border border-[#E5E5E5]"
                            >
                                <table className="w-full min-w-[520px] border-collapse text-left">
                                    <thead>
                                        <tr className="bg-[#F8FAF9]">
                                            {block.head.map((h, k) => (
                                                <th
                                                    key={k}
                                                    className="px-4 py-3 text-[12px] font-bold uppercase tracking-wider text-[#14301F]/55"
                                                >
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {block.rows.map((row, r) => (
                                            <tr
                                                key={r}
                                                className="border-t border-[#E5E5E5]/70 align-top"
                                            >
                                                {row.map((cell, c) => (
                                                    <td
                                                        key={c}
                                                        className="px-4 py-3 text-[13.5px] font-normal leading-[1.6] text-[#14301F]/75"
                                                    >
                                                        {c === 0 ? (
                                                            <span className="font-semibold text-[#14301F]">
                                                                {cell}
                                                            </span>
                                                        ) : (
                                                            cell
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        );

                    default:
                        return null;
                }
            })}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Shell                                                              */
/* ------------------------------------------------------------------ */

export default function LegalPageShell({
    badge,
    badgeIcon,
    title,
    intro,
    lastUpdated,
    readTime,
    sections,
    topSlot = null,
    relatedLinks = [],
}) {
    const [activeId, setActiveId] = useState(sections[0]?.id);
    const [open, setOpen] = useState(() =>
        Object.fromEntries(sections.map((s) => [s.id, true]))
    );
    const [query, setQuery] = useState("");
    const [progress, setProgress] = useState(0);
    const [showTop, setShowTop] = useState(false);
    const sectionRefs = useRef({});
    const BadgeIcon = ICONS[badgeIcon];

    /* reading progress + back-to-top visibility */
    useEffect(() => {
        const onScroll = () => {
            const doc = document.documentElement;
            const scrollable = doc.scrollHeight - doc.clientHeight;
            setProgress(scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0);
            setShowTop(doc.scrollTop > 640);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    /* scroll-spy for the table of contents */
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible[0]) setActiveId(visible[0].target.id);
            },
            { rootMargin: "-120px 0px -65% 0px", threshold: 0 }
        );
        Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, [sections]);

    const scrollToSection = useCallback((id) => {
        const el = sectionRefs.current[id];
        if (!el) return;
        setOpen((prev) => ({ ...prev, [id]: true }));
        const y = el.getBoundingClientRect().top + window.scrollY - 104;
        window.scrollTo({ top: y, behavior: "smooth" });
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return sections;
        return sections.filter((s) => {
            const haystack = (
                s.title +
                " " +
                JSON.stringify(s.blocks || "")
            ).toLowerCase();
            return haystack.includes(q);
        });
    }, [query, sections]);

    const allOpen = filtered.every((s) => open[s.id]);
    const toggleAll = () => {
        const next = !allOpen;
        setOpen((prev) => {
            const copy = { ...prev };
            filtered.forEach((s) => (copy[s.id] = next));
            return copy;
        });
    };

    return (
        <section className="font-quicksand relative overflow-hidden bg-[#F5F8F7] pb-20 pt-28 sm:pt-32">
            {/* reading progress bar */}
            <div className="fixed inset-x-0 top-0 z-40 h-1 bg-transparent">
                <div
                    className="h-full bg-gradient-to-r from-[#72BB83] to-[#14301F] transition-[width] duration-150 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* soft background wash */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-[15%] -top-[10%] h-[520px] w-[520px] rounded-full bg-[#72BB83]/10 blur-3xl" />
                <div className="absolute -right-[15%] top-[30%] h-[460px] w-[460px] rounded-full bg-[#72BB83]/8 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-[1180px] px-4 sm:px-6">
                {/* ---------- Hero ---------- */}
                <div className="mx-auto max-w-3xl text-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#72BB83]/30 bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#14301F]">
                        {BadgeIcon && (
                            <BadgeIcon className="h-3.5 w-3.5 text-[#72BB83]" strokeWidth={2.5} />
                        )}
                        {badge}
                    </span>
                    <h1 className="mt-6 text-[2rem] font-bold leading-[1.12] tracking-tight text-[#14301F] sm:text-[2.6rem] lg:text-[3.1rem]">
                        {title}
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-[15.5px] font-normal leading-[1.7] text-[#14301F]/70">
                        {intro}
                    </p>

                    <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[12.5px] font-semibold text-[#14301F]/60 shadow-sm">
                            <Clock3 className="h-3.5 w-3.5 text-[#72BB83]" strokeWidth={2.25} />
                            Updated {lastUpdated}
                        </span>
                        {readTime && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[12.5px] font-semibold text-[#14301F]/60 shadow-sm">
                                <ListChecks className="h-3.5 w-3.5 text-[#72BB83]" strokeWidth={2.25} />
                                {readTime}
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[12.5px] font-bold text-[#14301F]/70 shadow-sm transition-colors hover:text-[#14301F]"
                        >
                            <Printer className="h-3.5 w-3.5 text-[#72BB83]" strokeWidth={2.25} />
                            Print / save PDF
                        </button>
                    </div>
                </div>

                {topSlot && <div className="mx-auto mt-12 max-w-5xl">{topSlot}</div>}

                {/* ---------- Body: sticky TOC + sections ---------- */}
                <div className="mx-auto mt-14 grid max-w-5xl gap-10 lg:grid-cols-[248px_1fr]">
                    {/* Table of contents */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-24">
                            <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#14301F]/45">
                                <ListChecks className="h-3.5 w-3.5 text-[#72BB83]" strokeWidth={2.5} />
                                On this page
                            </p>
                            <nav className="space-y-0.5 border-l border-[#E5E5E5]">
                                {sections.map((s, i) => {
                                    const active = activeId === s.id;
                                    return (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => scrollToSection(s.id)}
                                            className={`-ml-px flex w-full items-center gap-2 border-l-2 py-1.5 pl-3 pr-2 text-left text-[13px] transition-all duration-200 ${active
                                                    ? "border-[#72BB83] font-bold text-[#14301F]"
                                                    : "border-transparent font-medium text-[#14301F]/50 hover:border-[#72BB83]/40 hover:text-[#14301F]/80"
                                                }`}
                                        >
                                            <span className="text-[11px] tabular-nums text-[#72BB83]">
                                                {String(i + 1).padStart(2, "0")}
                                            </span>
                                            {s.title}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </aside>

                    {/* Sections column */}
                    <div>
                        {/* toolbar */}
                        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="relative flex-1 sm:max-w-xs">
                                <Search
                                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#14301F]/30"
                                    strokeWidth={2.25}
                                />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search this policy…"
                                    className="w-full rounded-full border border-[#E5E5E5] bg-white py-2.5 pl-10 pr-4 text-[13.5px] font-medium text-[#14301F] outline-none transition-colors placeholder:text-[#14301F]/35 focus:border-[#72BB83]"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={toggleAll}
                                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#E5E5E5] bg-white px-4 py-2.5 text-[12.5px] font-bold text-[#14301F]/70 transition-colors hover:border-[#72BB83]/40 hover:text-[#14301F]"
                            >
                                {allOpen ? (
                                    <Minus className="h-3.5 w-3.5 text-[#72BB83]" strokeWidth={2.5} />
                                ) : (
                                    <Plus className="h-3.5 w-3.5 text-[#72BB83]" strokeWidth={2.5} />
                                )}
                                {allOpen ? "Collapse all" : "Expand all"}
                            </button>
                        </div>

                        {filtered.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-[#E5E5E5] bg-white px-6 py-12 text-center">
                                <p className="text-[14px] font-semibold text-[#14301F]">
                                    Nothing matches “{query}”.
                                </p>
                                <p className="mt-1 text-[13px] font-normal text-[#14301F]/55">
                                    Try a different word, or clear the search.
                                </p>
                            </div>
                        )}

                        <div className="space-y-4">
                            {filtered.map((s, i) => {
                                const Icon = ICONS[s.icon];
                                const isOpen = open[s.id];
                                return (
                                    <article
                                        key={s.id}
                                        id={s.id}
                                        ref={(el) => {
                                            sectionRefs.current[s.id] = el;
                                        }}
                                        className="scroll-mt-28 overflow-hidden rounded-2xl border border-[#E5E5E5]/70 bg-white transition-shadow duration-300 hover:shadow-[0_18px_40px_-24px_rgba(20,48,31,0.35)]"
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setOpen((prev) => ({ ...prev, [s.id]: !prev[s.id] }))
                                            }
                                            className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-7"
                                            aria-expanded={isOpen}
                                        >
                                            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#72BB83]/10">
                                                {Icon && (
                                                    <Icon
                                                        className="h-5 w-5 text-[#72BB83]"
                                                        strokeWidth={2}
                                                    />
                                                )}
                                            </span>
                                            <span className="flex-1">
                                                <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[#72BB83]">
                                                    Section {String(i + 1).padStart(2, "0")}
                                                </span>
                                                <span className="mt-0.5 block text-[17px] font-bold leading-snug tracking-tight text-[#14301F] sm:text-[18px]">
                                                    {s.title}
                                                </span>
                                            </span>
                                            <ChevronDown
                                                className={`h-5 w-5 flex-shrink-0 text-[#14301F]/35 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                                                    }`}
                                                strokeWidth={2.25}
                                            />
                                        </button>

                                        {isOpen && (
                                            <div className="animate-legal-fade-in border-t border-[#E5E5E5]/70 px-5 py-6 sm:px-7">
                                                <LegalBlocks blocks={s.blocks} />
                                            </div>
                                        )}
                                    </article>
                                );
                            })}
                        </div>

                        {/* footer / acknowledgement */}
                        <div className="mt-8 rounded-2xl border border-[#72BB83]/30 bg-[#72BB83]/8 px-6 py-6 sm:px-8">
                            <div className="flex items-start gap-3">
                                <CheckCircle2
                                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#72BB83]"
                                    strokeWidth={2}
                                />
                                <div>
                                    <h2 className="text-[15px] font-bold tracking-tight text-[#14301F]">
                                        Questions about this document?
                                    </h2>
                                    <p className="mt-1.5 text-[14px] font-normal leading-[1.7] text-[#14301F]/75">
                                        We keep our legal pages in plain language on purpose. If
                                        anything here is unclear, reach the team through the
                                        channels on the{" "}
                                        <Link
                                            href="/about"
                                            className="font-bold text-[#14301F] underline decoration-[#72BB83] decoration-2 underline-offset-2 hover:text-[#72BB83]"
                                        >
                                            About page
                                        </Link>
                                        . This document may be updated as The Eco Lens grows — the
                                        date at the top always reflects the current version.
                                    </p>

                                    {relatedLinks.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-2.5">
                                            {relatedLinks.map(([label, href]) => (
                                                <Link
                                                    key={href}
                                                    href={href}
                                                    className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E5E5] bg-white px-4 py-2 text-[12.5px] font-bold text-[#14301F]/70 transition-colors hover:border-[#72BB83]/40 hover:text-[#14301F]"
                                                >
                                                    {label}
                                                    <ArrowUpRight
                                                        className="h-3.5 w-3.5 text-[#72BB83]"
                                                        strokeWidth={2.5}
                                                    />
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* back to top */}
            <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                aria-label="Back to top"
                className={`fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-[#14301F] text-white shadow-lg transition-all duration-300 hover:bg-[#72BB83] ${showTop
                        ? "translate-y-0 opacity-100"
                        : "pointer-events-none translate-y-4 opacity-0"
                    }`}
            >
                <ChevronRight className="h-5 w-5 -rotate-90" strokeWidth={2.5} />
            </button>
        </section>
    );
}
