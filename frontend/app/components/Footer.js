"use client";

import Link from "next/link";
import Image from "next/image";
import { GraduationCap } from "lucide-react";
import FooterWave from "../../public/assets/footerImages/PaternWaveFooter.webp";

// Social Icons
function FacebookIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M15.5 8.5h-2a2 2 0 0 0-2 2V21" />
            <path d="M9 13.2h6.4" />
        </svg>
    );
}

function InstagramIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
            <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
            <circle cx="12" cy="12" r="3.6" />
            <circle cx="17.1" cy="6.9" r="0.6" fill="currentColor" stroke="none" />
        </svg>
    );
}

function TwitterIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M20.5 4.4c-.8.5-1.7.8-2.6 1a4.3 4.3 0 0 0-7.3 3.9A12.1 12.1 0 0 1 1.9 4.6a4.3 4.3 0 0 0 1.3 5.7c-.7 0-1.4-.2-2-.5v.1a4.3 4.3 0 0 0 3.4 4.2 4.3 4.3 0 0 1-1.9.1 4.3 4.3 0 0 0 4 3 8.6 8.6 0 0 1-6.3 1.8 12.1 12.1 0 0 0 6.6 1.9c7.9 0 12.2-6.6 12.2-12.2v-.6c.8-.6 1.6-1.4 2.2-2.3" />
        </svg>
    );
}

function LinkedinIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
            <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
            <path d="M7.7 10v6.3M7.7 7.7v.02" />
            <path d="M11.3 16.3V10M11.3 12.6c0-1.4 1-2.6 2.4-2.6s2.3 1 2.3 2.6v3.7" />
        </svg>
    );
}

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const learnLinks = [
        ["Course catalog", "/catalog"],
        ["My learning", "/dashboard"],
        ["Financial tools", "/tools"],
    ];

    const exploreLinks = [
        ["Case studies", "/case-studies"],
        ["Statistics", "/statistics"],
        ["Research papers", "/research"],
    ];

    const platformLinks = [
        ["About us", "/about"],
        ["Privacy", "/privacy"],
        ["Terms & disclaimer", "/terms"],
        ["Admin panel", "/admin"],
    ];

    const socialLinks = [
        ["Facebook", "https://facebook.com", FacebookIcon],
        ["Instagram", "https://instagram.com", InstagramIcon],
        ["Twitter", "https://twitter.com", TwitterIcon],
        ["LinkedIn", "https://linkedin.com", LinkedinIcon],
    ];

    return (
        <footer className="relative mt-6 overflow-hidden rounded-t-[28px] bg-[#0c0c0e] text-white sm:rounded-t-[32px]">
            {/* Wave Pattern - object-cover naturally fills the full width
                with no horizontal cropping here (container is much wider
                than the image), only clipping the excess height off the
                bottom via object-top — same look as the reference. */}
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-[220px] w-full overflow-hidden sm:h-[280px] md:h-[320px] lg:h-[380px]"
                aria-hidden="true"
            >
                <Image
                    src={FooterWave}
                    alt=""
                    fill
                    priority={false}
                    sizes="100vw"
                    className="object-cover object-top invert brightness-90"
                />
            </div>

            <div className="relative mx-6 px-5 sm:px-8 lg:px-10">
                {/* ===== CTA ===== */}
                <div className="mx-auto max-w-2xl pt-12 text-center sm:pt-14 md:pt-16 lg:pt-20">
                    <h2 className="text-[1.8rem] font-extrabold leading-[1.15] tracking-tight sm:text-[2.2rem] md:text-[2.5rem] lg:text-[2.75rem]">
                        Ready to Start Your Courses
                        <br />
                        and Grow Your Career
                    </h2>
                    <p className="mx-auto mt-3 max-w-[48ch] text-sm font-medium text-white/60 sm:text-base">
                        Experts teach you everything from the comfort of your own home.
                        Improve your career today by enrolling in excellent courses at
                        affordable prices.
                    </p>
                    <Link
                        href="/catalog"
                        className="mt-6 inline-flex items-center gap-2 rounded-full bg-teal-400 px-6 py-2.5 text-sm font-bold text-ink shadow-[0_10px_28px_-8px_rgba(45,212,191,0.5)] transition-all duration-300 hover:scale-105 hover:bg-teal-300 hover:shadow-[0_14px_34px_-8px_rgba(45,212,191,0.6)] sm:px-7 sm:py-3"
                    >
                        Get Started
                    </Link>
                </div>

                {/* ===== "Featured in" strip ===== */}
                <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 pb-10 sm:mt-14 sm:pb-12 md:mt-16 md:pb-14">
                </div>

                {/* ===== Link columns ===== */}
                <div className="grid grid-cols-1 gap-8 border-t border-white/10 pb-8 pt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                    <div>
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-white no-underline hover:no-underline"
                        >
                            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-brand-deep">
                                <GraduationCap className="h-5 w-5 text-white" strokeWidth={2.25} />
                            </span>
                            Finance Platform
                        </Link>
                        <p className="mt-3 max-w-[36ch] text-sm font-medium text-white/60">
                            Free, plain-language education in microfinance and sustainable
                            finance. No paywalls, no jargon.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white/40">Learn</h4>
                        <div className="mt-3 flex flex-col gap-2">
                            {learnLinks.map(([label, href]) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className="text-sm font-medium text-white/70 transition-colors w-28 hover:text-white"
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white/40">Explore</h4>
                        <div className="mt-3 flex flex-col gap-2 w-100">
                            {exploreLinks.map(([label, href]) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className="text-sm font-medium text-white/70 transition-colors w-28 hover:text-white"
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white/40">Platform</h4>
                        <div className="mt-3 flex flex-col gap-2 w-100">
                            {platformLinks.map(([label, href]) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className="text-sm font-medium text-white/70 transition-colors w-30 hover:text-white"
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-xs font-medium leading-relaxed text-white/50 sm:p-5 sm:text-sm">
                    <strong className="text-white/80">Education, not advice.</strong> The
                    Finance Platform provides general financial education only.
                    Nothing on this site is financial, investment, legal or tax advice,
                    and no content is a recommendation to buy or sell any product.
                    Always consider your own circumstances and, where needed, consult a
                    licensed professional in your country.
                </div>

                {/* ===== Bottom bar ===== */}
                <div className="mt-6 flex flex-col-reverse items-center gap-4 border-t border-white/10 py-5 sm:flex-row sm:justify-between">
                    <p className="text-xs font-medium text-white/45 sm:text-sm">
                        ©{currentYear} Finance Platform. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2">
                        {socialLinks.map(([label, href, Icon]) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                className="group grid h-8 w-8 place-items-center rounded-full border border-white/12 bg-white/[0.03] text-white/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10 hover:text-white hover:shadow-[0_6px_16px_-6px_rgba(0,0,0,0.5)] sm:h-9 sm:w-9"
                            >
                                <Icon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110 sm:h-4 sm:w-4" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div
                className="pointer-events-none fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-brand-deep px-4 py-2 text-sm font-semibold text-white opacity-0 shadow-card-lg transition-opacity duration-300 data-[show=true]:pointer-events-auto data-[show=true]:opacity-100"
                id="flToast"
                role="status"
            ></div>
        </footer>
    );
}