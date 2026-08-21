"use client";

import { Calendar, ClipboardList, MessagesSquare } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import studentLibraryImg from "@/public/assets/whyUsSectionImages/StudentLibrary.webp";

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

const FEATURES = [
    {
        icon: MessagesSquare,
        title: "Discussion 24/7",
        body: "The community always there for you if you have difficult learning the course.",
    },
    {
        icon: Calendar,
        title: "Schedule with Author",
        body: "Choose an order schedule to the author to get in-depth knowledge with 1 on 1 call.",
    },
    {
        icon: ClipboardList,
        title: "Practice for Free",
        body: "test your skills with practice tests that have been provided on our platform.",
    },
];

function FeatureItem({ icon: Icon, title, body, isLast, delay }) {
    const [ref, inView] = useInView();

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                } ${!isLast ? "border-b border-slate-900/10 pb-6" : ""}`}
            style={{ transitionDelay: inView ? `${delay}ms` : "0ms" }}
        >
            <Icon className="h-7 w-7 text-[#0F172A]" strokeWidth={1.5} />
            <h3 className="mt-4 text-xl font-bold text-[#0F172A] sm:text-2xl">
                {title}
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500 sm:text-[15px]">
                {body}
            </p>
        </div>
    );
}

export default function WhyUsSection() {
    const [textRef, textInView] = useInView();
    const [imgRef, imgInView] = useInView();

    return (
        <section
            className="py-16 sm:py-20 lg:py-24"
            style={{ backgroundColor: "#E6FBF1" }}
        >
            <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
                    {/* ===== LEFT: Stacked features ===== */}
                    <div className="order-2 flex flex-col gap-6 lg:order-1">
                        {FEATURES.map((f, idx) => (
                            <FeatureItem
                                key={f.title}
                                icon={f.icon}
                                title={f.title}
                                body={f.body}
                                isLast={idx === FEATURES.length - 1}
                                delay={idx * 120}
                            />
                        ))}
                    </div>

                    {/* ===== RIGHT: Heading + image ===== */}
                    <div className="order-1 lg:order-2">
                        <div
                            ref={textRef}
                            className={`transition-all duration-700 ease-out ${textInView
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-6 opacity-0"
                                }`}
                        >
                            <div className="mb-4 flex items-center gap-2 text-xl font-semibold text-[#0F9D6D]">
                                Why Us
                            </div>
                            <h2 className="text-3xl font-bold leading-[1.15] tracking-tight text-[#0F172A] sm:text-4xl lg:text-[2.6rem]">
                                Our Special Features We Build for You
                            </h2>
                            <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-500 sm:text-base">
                                EdTech is a platform that helps students in advancing their
                                career by providing solutions for simple and flexible online
                                learning, allowing you to study anywhere and anytime at
                                affordable prices.
                            </p>
                        </div>

                        <div
                            ref={imgRef}
                            className={`mt-8 overflow-hidden rounded-2xl shadow-lg shadow-black/5 transition-all delay-150 duration-700 ease-out ${imgInView
                                    ? "translate-y-0 scale-100 opacity-100"
                                    : "translate-y-8 scale-[0.97] opacity-0"
                                }`}
                        >
                            <div className="group aspect-[5/3] w-full overflow-hidden">
                                <Image
                                    src={studentLibraryImg}
                                    alt="Student studying with a laptop in a library"
                                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    priority={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}