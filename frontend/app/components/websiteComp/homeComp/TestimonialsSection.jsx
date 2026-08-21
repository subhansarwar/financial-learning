"use client";

import Image from "next/image";
import quoteIcon from "@/public/assets/testimonialsSectionImages/QuoteIcon.webp";
import avatar1 from "@/public/assets/testimonialsSectionImages/SukranMemis.webp";
import avatar2 from "@/public/assets/testimonialsSectionImages/AtikaYuksel.webp";
import avatar3 from "@/public/assets/testimonialsSectionImages/FaridKamal.webp";
import avatar4 from "@/public/assets/testimonialsSectionImages/MiselCoron.webp";
import avatar5 from "@/public/assets/testimonialsSectionImages/AxelColey.webp";
// import avatar6 from "@/public/assets/testimonialsSectionImages/LiraNoven.webp";

const TESTIMONIAL_TEXT =
    "I have always relied on EdTech to help me understand my studies. I can always count on him to get me through difficult subjects. with edtech my learning is easier without any obstacles.";

const ROW_ONE = [
    { name: "Sukran Memis", role: "Site Reliability Engineer", avatar: avatar1 },
    { name: "Atika Yuksel", role: "Site Reliability Engineer", avatar: avatar2 },
    { name: "Farid Kamal", role: "Site Reliability Engineer", avatar: avatar3 },
    { name: "Misel Coron", role: "Site Reliability Engineer", avatar: avatar4 },
    { name: "Axel Coley", role: "Site Reliability Engineer", avatar: avatar5 },
    // { name: "Lira Noven", role: "Site Reliability Engineer", avatar: avatar6 },
];

const ROW_TWO = [
    { name: "Axel Coley", role: "Site Reliability Engineer", avatar: avatar5 },
    { name: "Misel Coron", role: "Site Reliability Engineer", avatar: avatar4 },
    // { name: "Lira Noven", role: "Site Reliability Engineer", avatar: avatar6 },
    { name: "Sukran Memis", role: "Site Reliability Engineer", avatar: avatar1 },
    { name: "Farid Kamal", role: "Site Reliability Engineer", avatar: avatar3 },
    { name: "Atika Yuksel", role: "Site Reliability Engineer", avatar: avatar2 },
];

function TestimonialCard({ name, role, avatar }) {
    return (
        <div className="relative flex w-[300px] shrink-0 flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_2px_14px_rgba(15,23,42,0.05)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:w-[340px] sm:p-6">
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
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
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

function MarqueeRow({ items, direction = "left", speed = 42 }) {
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
                className="flex w-max gap-5 sm:gap-6"
                style={{
                    animation: `${direction === "left" ? "marqueeLeft" : "marqueeRight"
                        } ${speed}s linear infinite`,
                }}
            >
                {doubled.map((item, idx) => (
                    <TestimonialCard key={`${item.name}-${idx}`} {...item} />
                ))}
            </div>
        </div>
    );
}

export default function TestimonialsSection() {
    return (
        <section className="overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
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
                  animation-play-state: paused;
                }
                @media (prefers-reduced-motion: reduce) {
                  .marquee-track { animation: none !important; }
                }
            `}</style>

            <div className="mx-auto max-w-[760px] px-4 text-center sm:px-6">
                <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-[#0F9D6D]">
                    Testimonials
                </div>
                <h2 className="text-3xl font-bold leading-[1.2] tracking-tight text-[#0F172A] sm:text-4xl lg:text-[2.75rem]">
                    What Our Students Say
                    <br className="hidden sm:block" /> About Us
                </h2>
            </div>

            <div className="mt-12 flex flex-col gap-5 sm:mt-14 sm:gap-6">
                <div className="marquee-pause-wrapper">
                    <div className="marquee-track">
                        <MarqueeRow items={ROW_ONE} direction="left" speed={46} />
                    </div>
                </div>
                <div className="marquee-pause-wrapper">
                    <div className="marquee-track">
                        <MarqueeRow items={ROW_TWO} direction="right" speed={50} />
                    </div>
                </div>
            </div>
        </section>
    );
}