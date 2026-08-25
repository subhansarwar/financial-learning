// app/components/HeroSection.jsx
"use client";

import { Search, ChevronDown, ArrowRight, Sparkle } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Patern from '../../../../public/assets/homePageImages/Patern.webp';
import rightsideImage from '../../../../public/assets/homePageImages/rightSideImage.webp';

export default function HeroSection({ catalog = [], topics = [] }) {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Set isVisible based on whether section is intersecting
                setIsVisible(entry.isIntersecting);
            },
            {
                threshold: 0.15,
                // Remove triggerOnce to allow animation to replay
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
            className="relative overflow-hidden bg-white py-8"
        >
            {/* ===== Background Pattern (spans full hero, anchored top-left) ===== */}
            <div className="pointer-events-none absolute inset-0 opacity-70">
                <Image
                    src={Patern}
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-cover object-left-top"
                    priority={false}
                />
            </div>

            <div className="relative mx-6 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12 lg:py-14">
                    {/* ===== LEFT CONTENT ===== */}
                    <div className="relative flex flex-col justify-center py-10 sm:py-14 lg:py-0">
                        {/* Heading */}
                        <h1
                            className={`font-serif text-[2.35rem] font-semibold leading-[1.15] tracking-tight text-black sm:text-[2.75rem] lg:text-[3rem] transition-all duration-700 ${isVisible
                                    ? "opacity-100 translate-x-0"
                                    : "opacity-0 -translate-x-12"
                                }`}
                        >
                            Receive the help you need
                        </h1>

                        {/* Description */}
                        <p
                            className={`mt-4 max-w-[420px] text-[13px] leading-relaxed text-[#616161] sm:text-sm transition-all duration-700 delay-100 ${isVisible
                                    ? "opacity-100 translate-x-0"
                                    : "opacity-0 -translate-x-12"
                                }`}
                        >
                            Two flagship 12-module programs{" "}
                            <span className="font-semibold">Microfinance</span> and{" "}
                            <span className="font-semibold">Sustainability &amp; Finance</span>{" "}
                            plus case studies, country statistics and{" "}
                            <span className="italic">a student research corner</span>. Pass each module
                            at 70% to unlock the next, and earn your certificate.
                        </p>

                        {/* Search Form */}
                        <form
                            className={`mt-5 flex max-w-[420px] items-center gap-1 rounded-full border border-input-border bg-input-bg py-1 pl-4 pr-1 transition-all duration-700 delay-200 ${isVisible
                                    ? "opacity-100 translate-y-0 scale-100"
                                    : "opacity-0 translate-y-8 scale-95"
                                }`}
                            action="/catalog"
                            method="get"
                            role="search"
                        >
                            <input
                                type="search"
                                name="q"
                                placeholder="Search course, event or author"
                                aria-label="Search courses"
                                className="min-w-0 flex-1 bg-transparent py-2 text-[12.5px] text-text-dark placeholder:text-text-muted focus:outline-none"
                            />

                            <div className="h-4 w-px shrink-0 bg-input-border" />

                            <div className="relative flex shrink-0 items-center">
                                <select
                                    className="cursor-pointer appearance-none bg-transparent py-2 pl-3 pr-3 text-[12.5px] font-medium text-text-dark transition-colors hover:text-btn-primary focus:outline-none"
                                    defaultValue="courses"
                                >
                                    <option value="courses">Courses</option>
                                    <option value="case-studies">Case Studies</option>
                                    <option value="statistics">Statistics</option>
                                    <option value="research">Research</option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-3 w-3 -translate-y-1/2 text-text-muted" strokeWidth={2} />
                            </div>

                            <button
                                type="submit"
                                aria-label="Search"
                                className="flex h-7 w-8 shrink-0 items-center justify-center rounded-full bg-btn-primary text-white transition-all duration-300 hover:bg-btn-primary-hover hover:scale-110 active:scale-95"
                            >
                                <Search className="h-3.5 w-3.5" strokeWidth={2.5} />
                            </button>
                        </form>

                        {/* Get Started */}
                        <div
                            className={`mt-5 flex items-center gap-2.5 transition-all duration-700 delay-300 ${isVisible
                                    ? "opacity-100 translate-x-0"
                                    : "opacity-0 -translate-x-12"
                                }`}
                        >
                            <span className="text-[12.5px] font-medium text-text-muted">Get Started as</span>
                            <ArrowRight className="h-3.5 w-3.5 text-text-muted transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
                            <span className="inline-flex items-center rounded-full bg-btn-primary px-4 py-1 text-[10px] font-bold tracking-wide text-white transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                STUDENT
                            </span>
                        </div>
                    </div>

                    {/* ===== RIGHT IMAGE ===== */}
                    <div className="relative flex items-center justify-center py-6 lg:py-0">
                        <div
                            className={`relative aspect-square w-full max-w-[420px] transition-all duration-700 delay-150 ${isVisible
                                    ? "opacity-100 translate-x-0 scale-100"
                                    : "opacity-0 translate-x-12 scale-90"
                                }`}
                        >
                            <Image
                                src={rightsideImage}
                                alt="Student learning online"
                                fill
                                priority
                                className="transition-all duration-700 hover:scale-105"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}