// app/components/websiteComp/faq/FaqClient.jsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
    Award,
    BookOpen,
    Calculator,
    ChevronDown,
    ChevronRight,
    HelpCircle,
    LayoutGrid,
    LifeBuoy,
    Mail,
    Minus,
    Plus,
    Rocket,
    Search,
    ShieldCheck,
    Sparkles,
    UserCircle,
    X,
} from "lucide-react";

/* Server Components can't pass icon components to a Client Component, so the
   page references categories by key and we resolve the icon here. */
const ICONS = {
    LayoutGrid,
    Rocket,
    BookOpen,
    Award,
    UserCircle,
    ShieldCheck,
    Calculator,
    LifeBuoy,
    HelpCircle,
    Sparkles,
};

const slugify = (str) =>
    str
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .slice(0, 60);

const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* ------------------------------------------------------------------ */
/*  Answer block renderer                                              */
/* ------------------------------------------------------------------ */

const TONE = {
    green: "border-[#72BB83]/30 bg-[#72BB83]/8 text-[#14301F]/80",
    amber: "border-amber-300/50 bg-amber-50 text-[#14301F]/80",
    blue: "border-sky-300/50 bg-sky-50 text-[#14301F]/80",
};

function AnswerBlocks({ blocks, highlight }) {
    return (
        <div className="space-y-3.5">
            {blocks.map((block, i) => {
                switch (block.type) {
                    case "p":
                        return (
                            <p
                                key={i}
                                className="text-[14.5px] font-normal leading-[1.75] text-[#14301F]/75"
                            >
                                {highlight(block.text)}
                            </p>
                        );

                    case "list":
                        return (
                            <ul key={i} className="space-y-2">
                                {block.items.map((item, j) => (
                                    <li
                                        key={j}
                                        className="flex items-start gap-2.5 text-[14.5px] font-normal leading-[1.7] text-[#14301F]/75"
                                    >
                                        <span className="mt-[9px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#72BB83]" />
                                        <span>
                                            {typeof item === "string" ? (
                                                highlight(item)
                                            ) : (
                                                <>
                                                    <span className="font-semibold text-[#14301F]">
                                                        {item.term}
                                                    </span>{" "}
                                                    {highlight(item.text)}
                                                </>
                                            )}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        );

                    case "note":
                        return (
                            <div
                                key={i}
                                className={`flex items-start gap-2.5 rounded-2xl border px-4 py-3 ${TONE[block.tone] || TONE.green
                                    }`}
                            >
                                <Sparkles
                                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#72BB83]"
                                    strokeWidth={2.25}
                                />
                                <p className="text-[13.5px] font-medium leading-[1.6]">
                                    {highlight(block.text)}
                                </p>
                            </div>
                        );

                    case "link":
                        return (
                            <Link
                                key={i}
                                href={block.href}
                                className="inline-flex items-center gap-1.5 text-[13.5px] font-bold text-[#14301F] underline decoration-[#72BB83] decoration-2 underline-offset-2 transition-colors hover:text-[#72BB83]"
                            >
                                {block.label}
                                <ChevronRight className="h-3.5 w-3.5 text-[#72BB83]" strokeWidth={2.5} />
                            </Link>
                        );

                    default:
                        return null;
                }
            })}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  FAQ page                                                           */
/* ------------------------------------------------------------------ */

export default function FaqClient({ categories, faqs }) {
    const items = useMemo(
        () => faqs.map((f) => ({ ...f, id: slugify(f.q) })),
        [faqs]
    );

    const [activeCat, setActiveCat] = useState("all");
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState({});
    const [showTop, setShowTop] = useState(false);
    const listRef = useRef(null);

    /* open the question referenced in the URL hash on first load */
    useEffect(() => {
        const hash = decodeURIComponent(window.location.hash.replace("#", ""));
        if (!hash) return;
        const match = items.find((f) => f.id === hash);
        if (match) {
            setActiveCat("all");
            setOpen({ [hash]: true });
            requestAnimationFrame(() => {
                const el = document.getElementById(hash);
                if (el) {
                    const y = el.getBoundingClientRect().top + window.scrollY - 110;
                    window.scrollTo({ top: y, behavior: "smooth" });
                }
            });
        }
    }, [items]);

    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 700);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const counts = useMemo(() => {
        const map = { all: items.length };
        for (const f of items) map[f.category] = (map[f.category] || 0) + 1;
        return map;
    }, [items]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return items.filter((f) => {
            const inCat = activeCat === "all" || f.category === activeCat;
            if (!inCat) return false;
            if (!q) return true;
            const haystack = (f.q + " " + JSON.stringify(f.blocks)).toLowerCase();
            return haystack.includes(q);
        });
    }, [items, activeCat, query]);

    const popular = useMemo(() => items.filter((f) => f.popular).slice(0, 5), [items]);

    const highlight = useCallback(
        (text) => {
            const q = query.trim();
            if (!q || typeof text !== "string") return text;
            const parts = text.split(new RegExp(`(${escapeRegExp(q)})`, "gi"));
            return parts.map((part, i) =>
                part.toLowerCase() === q.toLowerCase() ? (
                    <mark
                        key={i}
                        className="rounded bg-[#72BB83]/25 px-0.5 font-semibold text-[#14301F]"
                    >
                        {part}
                    </mark>
                ) : (
                    part
                )
            );
        },
        [query]
    );

    const toggle = (id) => {
        setOpen((prev) => {
            const next = { ...prev, [id]: !prev[id] };
            if (next[id] && history.replaceState) {
                history.replaceState(null, "", `#${id}`);
            }
            return next;
        });
    };

    const allOpen = filtered.length > 0 && filtered.every((f) => open[f.id]);
    const toggleAll = () => {
        const next = !allOpen;
        setOpen((prev) => {
            const copy = { ...prev };
            filtered.forEach((f) => (copy[f.id] = next));
            return copy;
        });
    };

    const jumpTo = (id) => {
        setActiveCat("all");
        setQuery("");
        setOpen({ [id]: true });
        requestAnimationFrame(() => {
            const el = document.getElementById(id);
            if (el) {
                const y = el.getBoundingClientRect().top + window.scrollY - 110;
                window.scrollTo({ top: y, behavior: "smooth" });
            }
        });
    };

    const resetFilters = () => {
        setActiveCat("all");
        setQuery("");
    };

    const hasFilter = activeCat !== "all" || query.trim() !== "";

    return (
        <section className="font-quicksand relative overflow-hidden bg-[#ffffff] pb-20 pt-28 sm:pt-32">
            {/* background wash */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-[15%] -top-[8%] h-[520px] w-[520px] rounded-full bg-[#72BB83]/10 blur-3xl" />
                <div className="absolute -right-[12%] top-[28%] h-[440px] w-[440px] rounded-full bg-[#72BB83]/8 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-[1100px] px-4 sm:px-6">
                {/* ---------- Hero ---------- */}
                <div className="mx-auto max-w-2xl text-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#72BB83]/30 bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#14301F]">
                        <HelpCircle className="h-3.5 w-3.5 text-[#72BB83]" strokeWidth={2.5} />
                        Help Center
                    </span>
                    <h1 className="mt-6 text-[2rem] font-bold leading-[1.12] tracking-tight text-[#14301F] sm:text-[2.6rem] lg:text-[3rem]">
                        Questions? <span className="text-[#72BB83]">We have answers</span>.
                    </h1>
                    <p className="mx-auto mt-4 max-w-xl text-[15.5px] font-normal leading-[1.7] text-[#14301F]/70">
                        Everything about learning on The Eco Lens — courses, certificates,
                        accounts, privacy and the tools. Search below or browse by topic.
                    </p>

                    {/* search */}
                    <div className="relative mx-auto mt-7 max-w-lg">
                        <Search
                            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#14301F]/30"
                            strokeWidth={2.25}
                        />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search questions…"
                            className="w-full rounded-full border border-[#E5E5E5] bg-white py-3.5 pl-11 pr-11 text-[14.5px] font-medium text-[#14301F] shadow-sm outline-none transition-colors placeholder:text-[#14301F]/35 focus:border-[#72BB83]"
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={() => setQuery("")}
                                aria-label="Clear search"
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#14301F]/35 transition-colors hover:text-[#14301F]"
                            >
                                <X className="h-4 w-4" strokeWidth={2.5} />
                            </button>
                        )}
                    </div>

                    {/* popular */}
                    {popular.length > 0 && !hasFilter && (
                        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                            <span className="text-[12px] font-bold uppercase tracking-wider text-[#14301F]/40">
                                Popular
                            </span>
                            {popular.map((f) => (
                                <button
                                    key={f.id}
                                    type="button"
                                    onClick={() => jumpTo(f.id)}
                                    className="rounded-full border border-[#E5E5E5] bg-white px-3.5 py-1.5 text-[12.5px] font-semibold text-[#14301F]/70 transition-colors hover:border-[#72BB83]/40 hover:text-[#14301F]"
                                >
                                    {f.q}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ---------- Category tabs ---------- */}
                <div className="mx-auto mt-12 max-w-4xl">
                    <div className="flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center sm:overflow-visible">
                        {categories.map((cat) => {
                            const Icon = ICONS[cat.icon] || HelpCircle;
                            const active = activeCat === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setActiveCat(cat.id)}
                                    className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-bold transition-all duration-300 ${active
                                            ? "border-[#72BB83] bg-[#72BB83]/10 text-[#14301F] shadow-sm"
                                            : "border-[#E5E5E5] bg-white text-[#14301F]/55 hover:border-[#72BB83]/30 hover:text-[#14301F]"
                                        }`}
                                >
                                    <Icon
                                        className={`h-4 w-4 ${active ? "text-[#72BB83]" : "text-[#14301F]/30"}`}
                                        strokeWidth={2}
                                    />
                                    {cat.label}
                                    <span
                                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${active
                                                ? "bg-[#72BB83]/15 text-[#72BB83]"
                                                : "bg-[#14301F]/6 text-[#14301F]/40"
                                            }`}
                                    >
                                        {counts[cat.id] || 0}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ---------- Result bar ---------- */}
                <div className="mx-auto mt-8 flex max-w-3xl items-center justify-between border-b border-[#E5E5E5] pb-3">
                    <span className="text-[13px] font-semibold text-[#14301F]/55">
                        {filtered.length} {filtered.length === 1 ? "question" : "questions"}
                        {hasFilter && (
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="ml-3 font-bold text-[#72BB83] hover:underline"
                            >
                                Clear
                            </button>
                        )}
                    </span>
                    {filtered.length > 0 && (
                        <button
                            type="button"
                            onClick={toggleAll}
                            className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#14301F]/60 transition-colors hover:text-[#14301F]"
                        >
                            {allOpen ? (
                                <Minus className="h-3.5 w-3.5 text-[#72BB83]" strokeWidth={2.5} />
                            ) : (
                                <Plus className="h-3.5 w-3.5 text-[#72BB83]" strokeWidth={2.5} />
                            )}
                            {allOpen ? "Collapse all" : "Expand all"}
                        </button>
                    )}
                </div>

                {/* ---------- FAQ list ---------- */}
                <div ref={listRef} className="mx-auto mt-6 max-w-3xl space-y-3">
                    {filtered.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-[#E5E5E5] bg-white px-6 py-14 text-center">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#72BB83]/10">
                                <Search className="h-6 w-6 text-[#72BB83]" strokeWidth={1.75} />
                            </div>
                            <p className="text-[15px] font-bold text-[#14301F]">
                                No questions match {query ? `“${query}”` : "that topic"}.
                            </p>
                            <p className="mt-1 text-[13.5px] font-normal text-[#14301F]/55">
                                Try a different word, or{" "}
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="font-bold text-[#72BB83] hover:underline"
                                >
                                    reset the filters
                                </button>
                                .
                            </p>
                        </div>
                    )}

                    {filtered.map((f) => {
                        const isOpen = !!open[f.id];
                        const cat = categories.find((c) => c.id === f.category);
                        return (
                            <article
                                key={f.id}
                                id={f.id}
                                className={`scroll-mt-28 overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${isOpen
                                        ? "border-[#72BB83]/40 shadow-[0_18px_44px_-26px_rgba(20,48,31,0.4)]"
                                        : "border-[#E5E5E5]/70 hover:border-[#72BB83]/30"
                                    }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => toggle(f.id)}
                                    aria-expanded={isOpen}
                                    className="flex w-full items-center gap-4 px-5 py-4 text-left sm:px-6"
                                >
                                    <span className="flex-1">
                                        {cat && (
                                            <span className="mb-1 block text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#72BB83]">
                                                {cat.label}
                                            </span>
                                        )}
                                        <span className="block text-[15px] font-bold leading-snug tracking-tight text-[#14301F] sm:text-[15.5px]">
                                            {highlight(f.q)}
                                        </span>
                                    </span>
                                    <span
                                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300 ${isOpen ? "bg-[#72BB83] text-white" : "bg-[#72BB83]/10 text-[#72BB83]"
                                            }`}
                                    >
                                        <ChevronDown
                                            className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                                                }`}
                                            strokeWidth={2.5}
                                        />
                                    </span>
                                </button>

                                {isOpen && (
                                    <div className="animate-faq-reveal border-t border-[#E5E5E5]/70 px-5 py-5 sm:px-6">
                                        <AnswerBlocks blocks={f.blocks} highlight={highlight} />
                                    </div>
                                )}
                            </article>
                        );
                    })}
                </div>

                {/* ---------- Still need help ---------- */}
                <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-3xl border border-[#72BB83]/30 bg-white shadow-[0_24px_60px_-42px_rgba(20,48,31,0.4)]">
                    <div className="flex flex-col items-start gap-5 px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-9">
                        <div className="flex items-start gap-4">
                            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#72BB83]/12">
                                <LifeBuoy className="h-6 w-6 text-[#72BB83]" strokeWidth={2} />
                            </span>
                            <div>
                                <h2 className="text-[17px] font-bold tracking-tight text-[#14301F]">
                                    Still can’t find your answer?
                                </h2>
                                <p className="mt-1 text-[13.5px] font-normal leading-[1.6] text-[#14301F]/65">
                                    Send us a message and a real person will get back to you,
                                    usually within a few working days.
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/about"
                            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#14301F] px-5 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[#72BB83]"
                        >
                            <Mail className="h-4 w-4" strokeWidth={2.25} />
                            Contact the team
                        </Link>
                    </div>
                    <div className="flex flex-wrap gap-2.5 border-t border-[#E5E5E5]/70 bg-[#F8FAF9] px-6 py-4 sm:px-9">
                        {[
                            ["Browse courses", "/catalog"],
                            ["Privacy Policy", "/privacy"],
                            ["Cookies Policy", "/cookies"],
                            ["Terms & Conditions", "/terms"],
                        ].map(([label, href]) => (
                            <Link
                                key={href}
                                href={href}
                                className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E5E5] bg-white px-3.5 py-1.5 text-[12px] font-bold text-[#14301F]/70 transition-colors hover:border-[#72BB83]/40 hover:text-[#14301F]"
                            >
                                {label}
                                <ChevronRight className="h-3 w-3 text-[#72BB83]" strokeWidth={2.5} />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* back to top */}
            <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                aria-label="Back to top"
                className={`fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-[#14301F] text-white shadow-lg transition-all duration-300 hover:bg-[#72BB83] ${showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
                    }`}
            >
                <ChevronDown className="h-5 w-5 rotate-180" strokeWidth={2.5} />
            </button>
        </section>
    );
}
