"use client";

import { ArrowRight, GraduationCap, Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import patternwave from '@/public/assets/howToBySectionImages/HeaderTopPattern.webp';
import HowToBegin from '@/public/assets/howToBySectionImages/HowToBeginImage.webp'

const ITEMS = [
    {
        title: "Class Lectures and Teacher",
        body: "You begin with your enthusiasm and knowledge. Then, using our Marketplace Insights tool, select a promising topic. It is entirely up to you how you teach and what you bring to the table. We provide a wealth of materials for developing your first course. In addition, our teacher dashboard and curriculum pages help you stay organized.",
    },
    {
        title: "Midterm and Final Practice",
        body: "You begin with your enthusiasm and knowledge. Then, using our Marketplace Insights tool, select a promising topic. It is entirely up to you how you teach and what you bring to the table. We provide a wealth of materials for developing your first course. In addition, our teacher dashboard and curriculum pages help you stay organized.",
    },
    {
        title: "Personalized Notes",
        body: "You begin with your enthusiasm and knowledge. Then, using our Marketplace Insights tool, select a promising topic. It is entirely up to you how you teach and what you bring to the table. We provide a wealth of materials for developing your first course. In addition, our teacher dashboard and curriculum pages help you stay organized.",
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
            className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
            style={{ backgroundColor: "#72BB83" }}
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

                .htb-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    grid-template-areas: "intro" "cta" "image" "accordion";
                    column-gap: 56px;
                    row-gap: 28px;
                }
                @media (min-width: 1024px) {
                    .htb-grid {
                        grid-template-columns: 0.92fr 1fr;
                        grid-template-areas: "intro cta" "image accordion";
                        row-gap: 40px;
                    }
                }
                .htb-intro { grid-area: intro; }
                .htb-cta { grid-area: cta; justify-self: start; align-self: start; }
                .htb-image { grid-area: image; }
                .htb-accordion { grid-area: accordion; }
                @media (min-width: 1024px) {
                    .htb-cta { justify-self: end; align-self: start; margin-top: 8px; }
                }

                .htb-panel {
                    display: grid;
                    grid-template-rows: 0fr;
                    transition: grid-template-rows .4s cubic-bezier(.22,1,.36,1), opacity .3s ease;
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

            <div className="relative mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
                <div className="htb-grid">
                    {/* ===== INTRO ===== */}
                    <div className="htb-intro">
                        <div className={`mb-4 flex items-center gap-3 text-sm font-medium text-white/85 transition-all duration-700 ${isVisible
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 -translate-x-8"
                            }`}>
                            <span className="h-px w-6 bg-white/70" />
                            How to Begin
                        </div>
                        <h2
                            className={`text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-[2.75rem] transition-all duration-700 delay-100 ${isVisible
                                    ? "opacity-100 translate-x-0"
                                    : "opacity-0 -translate-x-12"
                                }`}
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Get the help you need to ace your classes
                        </h2>
                        <p className={`mt-4 max-w-md text-sm font-medium leading-relaxed text-white/85 sm:text-base transition-all duration-700 delay-200 ${isVisible
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 -translate-x-12"
                            }`}>
                            We provide a wealth of materials for developing your first course. In
                            addition, our teacher dashboard and curriculum pages help you stay
                            organized.
                        </p>
                    </div>

                    {/* ===== CTA BUTTON ===== */}
                    <div className="htb-cta">
                        <a
                            href="#catalog"
                            className={`inline-flex items-center gap-2 rounded-full bg-[#1E4D35] px-8 py-3 text-sm font-bold text-white no-underline transition-all duration-700 delay-300 hover:-translate-y-0.5 hover:bg-[#163D2A] hover:shadow-lg hover:shadow-[#1E4D35]/30 ${isVisible
                                    ? "opacity-100 translate-y-0 scale-100"
                                    : "opacity-0 translate-y-8 scale-95"
                                }`}
                        >
                            Start now for free
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
                        </a>
                    </div>

                    {/* ===== IMAGE ===== */}
                    <div className="htb-image">
                        <div className={`group aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#5AA36B] to-[#3E7E52] shadow-xl shadow-black/10 transition-all duration-700 delay-150 ${isVisible
                                ? "opacity-100 translate-x-0 scale-100"
                                : "opacity-0 translate-x-12 scale-90"
                            }`}>
                            <Image
                                src={HowToBegin}
                                alt=""
                                fill
                                className="object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
                                priority={false}
                            />
                        </div>
                    </div>

                    {/* ===== ACCORDION ===== */}
                    <div className="htb-accordion">
                        <div className={`border-t border-white/25 transition-all duration-700 delay-200 ${isVisible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-8"
                            }`}>
                            {ITEMS.map((item, idx) => {
                                const isOpen = openIndex === idx;
                                return (
                                    <div key={item.title} className="border-b border-white/25">
                                        <button
                                            type="button"
                                            onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                                            className="flex w-full items-center justify-between gap-6 py-5 text-left group"
                                        >
                                            <span
                                                className={`text-base font-bold transition-colors duration-300 sm:text-lg ${isOpen ? "text-white" : "text-white/90"
                                                    }`}
                                            >
                                                {item.title}
                                            </span>
                                            <span className="relative grid h-5 w-5 shrink-0 place-items-center text-white transition-transform duration-300 group-hover:scale-110">
                                                <Plus
                                                    className={`absolute h-4 w-4 transition-all duration-300 ${isOpen ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                                                        }`}
                                                    strokeWidth={2.5}
                                                />
                                                <Minus
                                                    className={`absolute h-4 w-4 transition-all duration-300 ${isOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                                                        }`}
                                                    strokeWidth={2.5}
                                                />
                                            </span>
                                        </button>
                                        <div className={`htb-panel ${isOpen ? "is-open" : ""}`}>
                                            <div>
                                                <p className="max-w-lg pb-5 text-sm leading-relaxed text-white/85">
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