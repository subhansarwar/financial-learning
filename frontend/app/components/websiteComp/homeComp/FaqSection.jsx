"use client";

import { ChevronDown, MessageCircleQuestion, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ---------- Scroll-reveal hook (modified for re-trigger) ---------- */
function useInView(threshold = 0.15) {
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

/* ---------- Dynamic FAQ content ---------- */
const FAQ_DATA = {
    "Getting started": [
        {
            q: "How do I create my first account?",
            a: "Sign up with your email, verify it, and you're ready to start exploring courses right away.",
        },
        {
            q: "Is there an onboarding walkthrough?",
            a: "Yes, we guide you through the dashboard the first time you log in.",
        },
        {
            q: "Can I use EdTech on mobile?",
            a: "Absolutely, the platform is fully responsive and works great on any device.",
        },
        {
            q: "Do I need any prior experience?",
            a: "No prior experience is required, our courses are built for all skill levels.",
        },
        {
            q: "How long does setup take?",
            a: "Most learners are set up and browsing courses within just a couple of minutes.",
        },
    ],
    "Courses Coaches": [
        {
            q: "Is The Eco Len really free?",
            a: "Yes. The Eco Len is always free for students, teachers, and families.",
        },
        {
            q: "What courses do you offer?",
            a: "We offer a wide range of financial and business courses for all skill levels.",
        },
        {
            q: "How do I become a coach?",
            a: "Apply through our coach program and get verified by our team.",
        },
        {
            q: "Are there live sessions?",
            a: "Yes, we offer live coaching sessions every week.",
        },
        {
            q: "Can I access course materials offline?",
            a: "Yes, you can download materials for offline access.",
        },
    ],
    "Pricing & Billing": [
        {
            q: "What payment methods do you accept?",
            a: "We accept all major credit cards, debit cards, and popular digital wallets.",
        },
        {
            q: "Can I cancel my subscription anytime?",
            a: "Yes, you can cancel anytime from your account settings, no questions asked.",
        },
        {
            q: "Do you offer refunds?",
            a: "We offer a full refund within 14 days of purchase if you're not satisfied.",
        },
        {
            q: "Are there any hidden fees?",
            a: "No hidden fees, the price you see at checkout is exactly what you pay.",
        },
        {
            q: "Do you offer student discounts?",
            a: "Yes, verified students get a discount on all premium plans.",
        },
    ],
    "Dashboard & Tools": [
        {
            q: "What tools are included in the dashboard?",
            a: "You get access to budgeting tools, progress tracking, and scheduling features.",
        },
        {
            q: "Can I customize my dashboard?",
            a: "Yes, you can rearrange widgets and pin the tools you use most.",
        },
        {
            q: "Is my data synced across devices?",
            a: "Yes, everything syncs automatically as long as you're signed in.",
        },
        {
            q: "Can I export my progress reports?",
            a: "Yes, reports can be exported as PDF or CSV from the dashboard.",
        },
        {
            q: "Do tools work offline?",
            a: "Most tools run in your browser and work even without an internet connection.",
        },
    ],
};

const CATEGORIES = Object.keys(FAQ_DATA);

function AccordionItem({ item, isOpen, onToggle, delay, inView }) {
    return (
        <div
            className={`w-full overflow-hidden rounded-xl bg-slate-50 transition-all duration-700 ease-out ${inView
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0"
                }`}
            style={{
                transitionDelay: inView ? `${delay}ms` : "0ms",
                transitionDuration: inView ? "700ms" : "0ms",
            }}
        >
            <button
                type="button"
                onClick={onToggle}
                className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-all duration-300 hover:bg-slate-100/50 sm:px-5 sm:py-4"
            >
                <span className="text-sm font-bold text-[#0F172A] sm:text-[15px]">
                    {item.q}
                </span>
                <span className="relative grid h-5 w-5 shrink-0 place-items-center text-slate-400 transition-transform duration-300 hover:scale-110">
                    <Plus
                        className={`absolute h-4 w-4 transition-all duration-300 ${isOpen
                                ? "rotate-90 scale-0 opacity-0"
                                : "rotate-0 scale-100 opacity-100"
                            }`}
                        strokeWidth={2}
                    />
                    <ChevronDown
                        className={`absolute h-4 w-4 transition-all duration-300 ${isOpen
                                ? "rotate-0 scale-100 opacity-100"
                                : "-rotate-90 scale-0 opacity-0"
                            }`}
                        strokeWidth={2}
                    />
                </span>
            </button>

            <div
                className="grid transition-all duration-400 ease-out"
                style={{
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                }}
            >
                <div className="overflow-hidden">
                    <p className="px-4 pb-3 text-sm leading-relaxed text-slate-500 sm:px-5 sm:pb-4">
                        {item.a}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function FaqSection() {
    const [activeCategory, setActiveCategory] = useState(CATEGORIES[1]);
    const [openIndex, setOpenIndex] = useState(0);
    const [headerRef, headerInView] = useInView(0.15);
    const [bodyRef, bodyInView] = useInView(0.05);

    const items = FAQ_DATA[activeCategory];

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        setOpenIndex(0);
    };

    return (
        <section className="bg-[#ffffff] min-h-screen py-16 sm:py-20 lg:py-24 overflow-hidden">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* ===== Header ===== */}
                <div
                    ref={headerRef}
                    className={`text-center transition-all duration-700 ease-out ${headerInView
                            ? "translate-y-0 opacity-100"
                            : "translate-y-8 opacity-0"
                        }`}
                >
                    <h2
                        className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-3xl leading-tight text-[#0F172A] sm:text-4xl lg:text-[2.5rem]"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        <span className={`font-semibold transition-all duration-700 delay-100 ${headerInView
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 -translate-x-6"
                            }`}>
                            Frequently Ask
                        </span>
                        <span className={`grid h-9 w-9 place-items-center rounded-full bg-[#F5A623] sm:h-10 sm:w-10 transition-all duration-700 delay-200 ${headerInView
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-50"
                            }`}>
                            <MessageCircleQuestion
                                className="h-5 w-5 text-white sm:h-5 sm:w-5"
                                strokeWidth={2}
                            />
                        </span>
                        <span
                            className={`font-semibold text-[#6366F1] transition-all duration-700 delay-300 ${headerInView
                                    ? "opacity-100 translate-x-0"
                                    : "opacity-0 translate-x-6"
                                }`}
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Questions
                        </span>
                    </h2>
                    <p className={`mt-3 text-sm text-slate-500 sm:text-base transition-all duration-700 delay-400 ${headerInView
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                        }`}>
                        everything you need to know before getting started.
                    </p>
                </div>

                {/* ===== Body: sidebar + accordion ===== */}
                <div
                    ref={bodyRef}
                    className="mt-12 grid grid-cols-1 gap-8 lg:mt-16 lg:grid-cols-[240px_1fr] lg:gap-12"
                >
                    {/* Sidebar tabs - Left side */}
                    <div
                        className={`flex gap-2 overflow-x-auto pb-2 transition-all delay-100 duration-700 ease-out lg:flex-col lg:gap-1 lg:overflow-visible lg:border-l lg:border-slate-200 lg:pb-0 ${bodyInView
                                ? "translate-x-0 opacity-100"
                                : "-translate-x-8 opacity-0"
                            }`}
                    >
                        {CATEGORIES.map((category, idx) => {
                            const isActive = category === activeCategory;
                            return (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => handleCategoryChange(category)}
                                    className={`relative shrink-0 whitespace-nowrap px-3 py-2 text-left text-sm font-medium transition-all duration-300 lg:px-5 hover:scale-105 ${isActive
                                            ? "text-[#0F172A]"
                                            : "text-slate-400 hover:text-slate-600"
                                        }`}
                                    style={{
                                        transitionDelay: bodyInView ? `${idx * 50}ms` : "0ms"
                                    }}
                                >
                                    <span
                                        className={`absolute left-0 top-1/2 hidden h-5 w-0.5 -translate-x-px -translate-y-1/2 rounded-full bg-[#0F172A] transition-all duration-300 lg:block ${isActive ? "opacity-100" : "opacity-0"
                                            }`}
                                    />
                                    {category}
                                </button>
                            );
                        })}
                    </div>

                    {/* Accordion Section - Right side with FIXED WIDTH */}
                    <div
                        className={`transition-all delay-150 duration-700 ease-out ${bodyInView
                                ? "translate-y-0 opacity-100"
                                : "translate-y-8 opacity-0"
                            }`}
                    >
                        {/* Category Title - Courses Coaches */}
                        <h3 className={`mb-5 text-lg font-bold text-[#0F172A] sm:text-xl transition-all duration-700 delay-200 ${bodyInView
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 -translate-x-6"
                            }`}>
                            {activeCategory}
                        </h3>

                        {/* Accordion Container with FIXED MAX-WIDTH */}
                        <div className="w-full max-w-2xl space-y-3">
                            {items.map((item, idx) => (
                                <AccordionItem
                                    key={`${activeCategory}-${idx}`}
                                    item={item}
                                    isOpen={openIndex === idx}
                                    onToggle={() =>
                                        setOpenIndex(openIndex === idx ? -1 : idx)
                                    }
                                    delay={idx * 60 + 100}
                                    inView={bodyInView}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}