"use client";

import { Calendar, ClipboardList, MessagesSquare } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import studentLibraryImg from "@/public/assets/whyUsSectionImages/StudentLibrary.webp";

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

const FEATURES = [
    {
        icon: MessagesSquare,
        title: "Community Discussion",
        body: "Every lesson has a discussion thread where learners and educators help each other work through tricky concepts.",
    },
    {
        icon: Calendar,
        title: "Live Q&A Sessions",
        body: "Join our regular live sessions to ask questions about budgeting, investing, and anything else you're studying.",
    },
    {
        icon: ClipboardList,
        title: "Practice for Free",
        body: "Check your understanding with quizzes and hands-on exercises built into every course, at no cost.",
    },
];

function FeatureItem({ icon: Icon, title, body, isLast, delay, isVisible }) {
    return (
        <div
            className={`transition-all duration-700 ease-out ${isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                } ${!isLast ? "border-b border-slate-900/10 pb-6" : ""}`}
            style={{
                transitionDelay: isVisible ? `${delay}ms` : "0ms",
                transitionDuration: isVisible ? "700ms" : "0ms"
            }}
        >
            <div className={`transition-all duration-700 ${isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-6"
                }`} style={{ transitionDelay: isVisible ? `${delay + 50}ms` : "0ms" }}>
                <Icon className="h-7 w-7 text-[#0F172A]" strokeWidth={1.5} />
            </div>
            <h3 className={`mt-4 text-xl font-bold text-[#0F172A] sm:text-2xl transition-all duration-700 ${isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-8"
                }`} style={{ transitionDelay: isVisible ? `${delay + 100}ms` : "0ms" }}>
                {title}
            </h3>
            <p className={`mt-2 max-w-md text-sm leading-relaxed text-slate-500 sm:text-[15px] transition-all duration-700 ${isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-8"
                }`} style={{ transitionDelay: isVisible ? `${delay + 150}ms` : "0ms" }}>
                {body}
            </p>
        </div>
    );
}

export default function WhyUsSection() {
    const [sectionRef, sectionInView] = useInView(0.1);
    const [textRef, textInView] = useInView(0.1);
    const [imgRef, imgInView] = useInView(0.1);

    return (
        <section
            ref={sectionRef}
            className="py-10 sm:py-10 lg:py-10 overflow-hidden"
            style={{ backgroundColor: "#E6FBF1" }}
        >
            <div className="mx-6 px-4 sm:px-6 lg:px-8">
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
                                isVisible={sectionInView}
                            />
                        ))}
                    </div>

                    {/* ===== RIGHT: Heading + image ===== */}
                    <div className="order-1 lg:order-2">
                        <div
                            ref={textRef}
                            className={`transition-all duration-700 ease-out ${textInView
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-8 opacity-0"
                                }`}
                        >
                            <div className={`mb-4 flex items-center gap-2 text-xl font-semibold text-[#0F9D6D] transition-all duration-700 delay-100 ${textInView
                                    ? "opacity-100 translate-x-0"
                                    : "opacity-0 -translate-x-6"
                                }`}>
                                Why Us
                            </div>
                            <h2 className={`text-3xl font-bold leading-[1.15] tracking-tight text-[#0F172A] sm:text-4xl lg:text-[2.6rem] transition-all duration-700 delay-200 ${textInView
                                    ? "opacity-100 translate-x-0"
                                    : "opacity-0 -translate-x-8"
                                }`}>
                                Features Built to Help You Learn
                            </h2>
                            <p className={`mt-4 max-w-lg text-sm leading-relaxed text-slate-500 sm:text-base transition-all duration-700 delay-300 ${textInView
                                    ? "opacity-100 translate-x-0"
                                    : "opacity-0 -translate-x-8"
                                }`}>
                                The Eco Lens helps you build real financial confidence with
                                free, plain-language courses and hands-on tools you can use
                                anywhere, anytime no account or payment required.
                            </p>
                        </div>

                        <div
                            ref={imgRef}
                            className={`mt-8 overflow-hidden rounded-2xl transition-all delay-150 duration-700 ease-out ${imgInView
                                    ? "translate-y-0 scale-100 opacity-100"
                                    : "translate-y-10 scale-[0.95] opacity-0"
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