"use client";

import { ArrowRight, GraduationCap, Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import patternwave from '@/public/assets/howToBySectionImages/HeaderTopPattern.webp';
import HowToBegin from '@/public/assets/howToBySectionImages/HowToBeginImage.webp'

const ITEMS = [
    {
        title: "Expert-Led Lessons",
        body: "Start with structured video lessons taught by finance professionals. Each module breaks down budgeting, saving, investing, credit, and taxes into clear, practical steps you can apply right away. Learn at your own pace and revisit any lesson whenever you need a refresher.",
    },
    {
        title: "Quizzes and Real-World Practice",
        body: "Test what you have learned with short quizzes and scenario-based exercises. Build a mock budget, compare investment options, and work through real financial decisions in a safe environment so the concepts stick long after the lesson ends.",
    },
    {
        title: "Personalized Notes and Progress Tracking",
        body: "Save your own notes alongside each lesson and track your progress from your dashboard. Set financial goals, monitor completed modules, and get tailored recommendations for what to learn next based on where you are in your journey.",
    },
    {
        title: "Community Support and Mentorship",
        body: "Join a community of learners working toward financial confidence. Ask questions in discussion threads, attend live Q&A sessions, and connect with mentors who can review your plans and share guidance drawn from real experience.",
    },
];

export default function HowToBuySection() {
    const [openIndex, setOpenIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
            },
            {
                threshold: 0.1,
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden py-12 sm:py-16 lg:py-20"
            style={{ backgroundColor: "#FFB061" }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');

                @keyframes htbDrift { 
                    from { transform: translate(0,0); } 
                    to { transform: translate(-10px, 6px); } 
                }
                .htb-pattern { 
                    animation: htbDrift 24s ease-in-out infinite alternate; 
                }
                @media (prefers-reduced-motion: reduce) {
                    .htb-pattern { animation: none !important; }
                }

                .htb-panel {
                    display: grid;
                    grid-template-rows: 0fr;
                    transition: grid-template-rows 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;
                    opacity: 0;
                }
                .htb-panel.is-open {
                    grid-template-rows: 1fr;
                    opacity: 1;
                }
                .htb-panel > div { overflow: hidden; }
            `}</style>

            {/* ===== Wavy Pattern ===== */}
            <div className="htb-pattern pointer-events-none absolute inset-x-0 -top-4 h-[160px] w-full opacity-25 sm:h-[200px] lg:h-[240px]">
                <Image
                    src={patternwave}
                    alt=""
                    fill
                    className="object-cover object-top"
                    priority={false}
                />
            </div>

            <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                {/* ===== INTRO - CENTERED ===== */}
                <div className="w-full max-w-4xl mx-auto text-center mb-10 sm:mb-12 lg:mb-16">
                    <div className={`mb-4 flex items-center justify-center gap-3 text-sm font-medium transition-all duration-700 ${isVisible
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-8"
                        }`}>
                        <span className="h-px w-6 bg-white/70" />
                        <span className="text-white">How to Begin</span>
                        <span className="h-px w-6 bg-white/70" />
                    </div>

                    <h2
                        className={`font-bold text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl transition-all duration-700 delay-100 ${isVisible
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 -translate-x-12"
                            }`}
                        style={{
                            lineHeight: "1.2",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Get the help you need to ace your finances
                    </h2>

                    <p className={`mt-4 max-w-2xl mx-auto text-sm sm:text-base font-medium text-white/90 transition-all duration-700 delay-200 ${isVisible
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-12"
                        }`}>
                        We provide a wealth of materials for developing your financial literacy. In
                        addition, our teacher dashboard and curriculum pages help you stay
                        organized.
                    </p>
                </div>

                {/* ===== IMAGE + ACCORDION ROW ===== */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                    {/* ===== IMAGE ===== */}
                    <div className="htb-image order-1 lg:order-1">
                        <div className={`group relative aspect-[4/3] w-full overflow-hidden transition-all duration-700 delay-150 ${isVisible
                                ? "opacity-100 translate-x-0 scale-100"
                                : "opacity-0 -translate-x-12 scale-90"
                            }`}>
                            <Image
                                src={HowToBegin}
                                alt="How to begin illustration"
                                fill
                                className="object-contain rounded-2xl transition-transform duration-700 group-hover:scale-105"
                                priority={false}
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                quality={100}
                            />
                        </div>
                    </div>

                    {/* ===== ACCORDION ===== */}
                    <div className="htb-accordion order-2 lg:order-2">
                        <div className={`transition-all duration-700 delay-200 ${isVisible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-8"
                            }`}>
                            {ITEMS.map((item, idx) => {
                                const isOpen = openIndex === idx;
                                return (
                                    <div
                                        key={item.title}
                                        className={`border-b border-white/30 last:border-b-0 transition-all duration-300 ${isOpen ? "" : ""
                                            }`}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                                            className="flex w-full items-center justify-between gap-4 py-4 sm:py-5 text-left group  px-4 transition-all duration-300"
                                        >
                                            <span
                                                className={`text-base sm:text-lg font-bold transition-colors duration-300 ${isOpen ? "text-white" : "text-white/90"
                                                    }`}
                                            >
                                                {item.title}
                                            </span>
                                            <span className="relative grid h-6 w-6 shrink-0 place-items-center text-white transition-transform duration-300 group-hover:scale-110">
                                                <Plus
                                                    className={`absolute h-5 w-5 transition-all duration-300 ${isOpen ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                                                        }`}
                                                    strokeWidth={2.5}
                                                />
                                                <Minus
                                                    className={`absolute h-5 w-5 transition-all duration-300 ${isOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                                                        }`}
                                                    strokeWidth={2.5}
                                                />
                                            </span>
                                        </button>
                                        <div className={`htb-panel ${isOpen ? "is-open" : ""}`}>
                                            <div>
                                                <p className="max-w-lg pb-4 sm:pb-5 px-4 text-sm leading-relaxed text-white/85">
                                                    {item.body}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}