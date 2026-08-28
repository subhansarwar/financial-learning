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
            q: "Do I need an account to start learning?",
            a: "No. You can browse every course and open the interactive tools without signing up. An account only adds progress tracking and certificates.",
        },
        {
            q: "Do I need any finance background?",
            a: "None at all. Courses start from the basics of budgeting, saving, and credit, and build up gradually to investing and beyond.",
        },
        {
            q: "Where should I begin?",
            a: "Start with the Personal Finance track for everyday money skills, then move into Investing or Sustainable Finance once you're comfortable.",
        },
        {
            q: "Can I learn on my phone?",
            a: "Yes. Lessons, videos, quizzes, and the tools are fully responsive and work the same on phone, tablet, and desktop.",
        },
        {
            q: "How much time does a course take?",
            a: "Most courses are split into short modules of 5 to 10 minutes, so you can finish a lesson in a single sitting and pick up where you left off.",
        },
    ],
    "Courses & Coaches": [
        {
            q: "Is The Eco Lens really free?",
            a: "Yes. Every course, lesson, and tool on The Eco Lens is free for students, teachers, and families with no premium tier.",
        },
        {
            q: "What topics do you cover?",
            a: "Budgeting, saving, credit and debt, investing, taxes, retirement, sustainable finance, and Islamic finance, with new topics added over time.",
        },
        {
            q: "Who creates the courses?",
            a: "Courses are built by finance educators and reviewed for accuracy before they are published.",
        },
        {
            q: "Can I get help if I'm stuck on a concept?",
            a: "Yes. Each lesson has a discussion thread, and we run regular live Q&A sessions where you can ask questions directly.",
        },
        {
            q: "Can I download lessons for offline study?",
            a: "Lesson readings and worksheets can be downloaded as PDFs so you can review them without an internet connection.",
        },
    ],
    "Certificates & Progress": [
        {
            q: "Do I get a certificate for finishing a course?",
            a: "Yes. Complete all modules and pass the final quiz to earn a free certificate you can download and share.",
        },
        {
            q: "How is my progress tracked?",
            a: "When you're signed in, completed lessons and quiz scores are saved automatically so you always see what's left.",
        },
        {
            q: "Can I retake a quiz?",
            a: "Yes. Quizzes can be retaken as many times as you need, and only your best score is kept.",
        },
        {
            q: "Is there any cost for the certificate?",
            a: "No. Certificates are completely free, just like the courses.",
        },
        {
            q: "Can I export a record of what I've completed?",
            a: "Yes. You can export your progress and completed courses as a PDF or CSV from your dashboard.",
        },
    ],
    "Tools & Privacy": [
        {
            q: "What interactive tools are included?",
            a: "A monthly budgeting planner, a compound interest calculator, and an ESG comparison tool, all free and open to everyone.",
        },
        {
            q: "Do the tools work without signing in?",
            a: "Yes. Every tool runs entirely in your browser, so you can use them without an account.",
        },
        {
            q: "What happens to the numbers I enter?",
            a: "They stay on your device. Your inputs are never uploaded to our servers.",
        },
        {
            q: "Is my learning data shared with anyone?",
            a: "No. We don't sell or share your data, and progress tracking is only used to power your dashboard.",
        },
        {
            q: "Do the tools work offline?",
            a: "Once the page has loaded, the calculators keep working even if your connection drops.",
        },
    ],
};

const CATEGORIES = Object.keys(FAQ_DATA);

function AccordionItem({ item, isOpen, onToggle, delay, inView }) {
    return (
        <div
            className={`w-full overflow-hidden rounded-xl bg-[#E6FBF1] transition-all duration-700 ease-out ${inView
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
        <section className="bg-[#ffffff] py-8 sm:py-12 lg:py-9 overflow-hidden">
            <div className="mx-6 min-h-screen px-4 pb-0 sm:px-6 lg:px-8">
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
                            Frequently Asked
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
                    className="mt-10 sm:mt-12 lg:mt-16 grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr] lg:gap-10"
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

                    {/* Accordion Section - Right side */}
                    <div
                        className={`transition-all delay-150 duration-700 ease-out ${bodyInView
                                ? "translate-y-0 opacity-100"
                                : "translate-y-8 opacity-0"
                            }`}
                    >
                        <h3 className={`mb-4 sm:mb-5 text-lg font-bold text-[#0F172A] sm:text-xl transition-all duration-700 delay-200 ${bodyInView
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 -translate-x-6"
                            }`}>
                            {activeCategory}
                        </h3>

                        {/* Accordion Container */}
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