"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import quoteIcon from "@/public/assets/testimonialsSectionImages/QuoteIcon.webp";
import avatar1 from "@/public/assets/testimonialsSectionImages/SukranMemis.webp";
import avatar2 from "@/public/assets/testimonialsSectionImages/AtikaYuksel.webp";
import avatar3 from "@/public/assets/testimonialsSectionImages/FaridKamal.webp";
import avatar4 from "@/public/assets/testimonialsSectionImages/MiselCoron.webp";
import avatar5 from "@/public/assets/testimonialsSectionImages/AxelColey.webp";

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

const TESTIMONIAL_TEXT =
    "I have always relied on EdTech to help me understand my studies. I can always count on him to get me through difficult subjects. with edtech my learning is easier without any obstacles.";

const ROW_ONE = [
    { name: "Sukran Memis", role: "Site Reliability Engineer", avatar: avatar1 },
    { name: "Atika Yuksel", role: "Site Reliability Engineer", avatar: avatar2 },
    { name: "Farid Kamal", role: "Site Reliability Engineer", avatar: avatar3 },
    { name: "Misel Coron", role: "Site Reliability Engineer", avatar: avatar4 },
    { name: "Axel Coley", role: "Site Reliability Engineer", avatar: avatar5 },
];

const ROW_TWO = [
    { name: "Axel Coley", role: "Site Reliability Engineer", avatar: avatar5 },
    { name: "Misel Coron", role: "Site Reliability Engineer", avatar: avatar4 },
    { name: "Sukran Memis", role: "Site Reliability Engineer", avatar: avatar1 },
    { name: "Farid Kamal", role: "Site Reliability Engineer", avatar: avatar3 },
    { name: "Atika Yuksel", role: "Site Reliability Engineer", avatar: avatar2 },
];

function TestimonialCard({ name, role, avatar, delay }) {
    const [cardRef, cardInView] = useInView(0.1);

    return (
        <div
            ref={cardRef}
            className={`relative flex w-[300px] shrink-0 flex-col rounded-2xl border border-slate-100 bg-white p-5  transition-all duration-700 ease-out hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:w-[340px] sm:p-6 ${cardInView
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-8 scale-95"
                }`}
            style={{
                transitionDelay: cardInView ? `${delay}ms` : "0ms",
                transitionDuration: cardInView ? "700ms" : "0ms"
            }}
        >
            <div className="mb-4 flex items-start justify-between">
                <Image
                    src={quoteIcon}
                    alt=""
                    className="h-6 w-6 opacity-40 sm:h-7 sm:w-7"
                />
                <Image
                    src={quoteIcon}
                    alt=""
                    className="h-6 w-6 rotate-180 opacity-40 sm:h-7 sm:w-7"
                />
            </div>

            <div className="mb-3 flex items-center gap-3">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full transition-transform duration-500 hover:scale-110">
                    <Image
                        src={avatar}
                        alt={name}
                        fill
                        className="object-cover"
                    />
                </div>
                <div>
                    <p className="text-sm font-bold text-[#0F172A] sm:text-[15px]">
                        {name}
                    </p>
                    <p className="text-xs text-slate-400 sm:text-[13px]">{role}</p>
                </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-500">
                {TESTIMONIAL_TEXT}
            </p>
        </div>
    );
}

function MarqueeRow({ items, direction = "left", speed = 42, isVisible }) {
    const doubled = [...items, ...items];

    return (
        <div
            className="group relative w-full overflow-hidden"
            style={{
                maskImage:
                    "linear-gradient(to right, transparent 0, black 64px, black calc(100% - 64px), transparent 100%)",
                WebkitMaskImage:
                    "linear-gradient(to right, transparent 0, black 64px, black calc(100% - 64px), transparent 100%)",
            }}
        >
            <div
                className={`flex w-max gap-5 sm:gap-6 marquee-track ${isVisible ? "marquee-running" : "marquee-paused"
                    }`}
                style={{
                    animation: `${direction === "left" ? "marqueeLeft" : "marqueeRight"
                        } ${speed}s linear infinite`,
                    animationPlayState: isVisible ? "running" : "paused",
                }}
            >
                {doubled.map((item, idx) => (
                    <TestimonialCard
                        key={`${item.name}-${idx}`}
                        {...item}
                        delay={idx * 50}
                    />
                ))}
            </div>
        </div>
    );
}

export default function TestimonialsSection() {
    const [sectionRef, sectionInView] = useInView(0.1);
    const [headingRef, headingInView] = useInView(0.1);

    return (
        <section
            ref={sectionRef}
            className="overflow-hidden bg-[#E5E5E5] py-16 sm:py-20 lg:py-24"
        >
            <style>{`
                @keyframes marqueeLeft {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
                @keyframes marqueeRight {
                    from { transform: translateX(-50%); }
                    to { transform: translateX(0); }
                }
                .marquee-pause-wrapper:hover .marquee-track {
                    animation-play-state: paused !important;
                }
                .marquee-running {
                    animation-play-state: running !important;
                }
                .marquee-paused {
                    animation-play-state: paused !important;
                }
                @media (prefers-reduced-motion: reduce) {
                    .marquee-track { animation: none !important; }
                }
            `}</style>

            <div className="mx-6 px-4 text-center sm:px-6">
                <div
                    ref={headingRef}
                    className={`transition-all duration-700 ease-out ${headingInView
                            ? "translate-y-0 opacity-100"
                            : "translate-y-8 opacity-0"
                        }`}
                >
                    <div className={`mb-3 inline-flex items-center gap-2 text-sm font-semibold text-[#0F9D6D] transition-all duration-700 delay-100 ${headingInView
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-6"
                        }`}>
                        Testimonials
                    </div>
                    <h2 className={`text-3xl font-bold leading-[1.2] tracking-tight text-[#0F172A] sm:text-4xl lg:text-[2.75rem] transition-all duration-700 delay-200 ${headingInView
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-8"
                        }`}>
                        What Our Students Say
                        <br className="hidden sm:block" /> About Us
                    </h2>
                </div>
            </div>

            <div className={`mt-12 flex flex-col gap-5 sm:mt-14 sm:gap-6 transition-all duration-700 delay-300 ${sectionInView
                    ? "opacity-100"
                    : "opacity-0"
                }`}>
                <div className="marquee-pause-wrapper">
                    <MarqueeRow items={ROW_ONE} direction="left" speed={46} isVisible={sectionInView} />
                </div>
                <div className="marquee-pause-wrapper">
                    <MarqueeRow items={ROW_TWO} direction="right" speed={50} isVisible={sectionInView} />
                </div>
            </div>
        </section>
    );
}