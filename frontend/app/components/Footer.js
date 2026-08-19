"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";

// lucide-react dropped brand/logo glyphs (Facebook, Instagram, Twitter,
// LinkedIn) in newer releases, so these are small local SVG stand-ins 
// same 24x24 viewBox / stroke-less fill style, sized the same as lucide icons.
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
        <footer className="relative mt-6 overflow-hidden rounded-t-[17px] bg-ink text-white sm:rounded-t-[17px]">
            {/* Decorative wavy line-flow background, concentrated top-right,
                fading out toward the bottom-left. Purely decorative. */}
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <svg
                    className="absolute -right-24 -top-24 h-[520px] w-[820px] opacity-[0.10] sm:opacity-[0.14]"
                    viewBox="0 0 820 520"
                    fill="none"
                    preserveAspectRatio="xMidYMid slice"
                >
                    <defs>
                        <linearGradient id="flFade" x1="1" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="white" stopOpacity="1" />
                            <stop offset="55%" stopColor="white" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="white" stopOpacity="0" />
                        </linearGradient>
                        <mask id="flMask">
                            <rect x="0" y="0" width="820" height="520" fill="url(#flFade)" />
                        </mask>
                    </defs>
                    <g stroke="white" strokeWidth="1" mask="url(#flMask)">
                        <path d="M-40 480 C 160 380, 220 300, 160 200 S 40 20, 220 -40" />
                        <path d="M0 500 C 200 400, 260 320, 200 220 S 80 40, 260 -20" />
                        <path d="M40 520 C 240 420, 300 340, 240 240 S 120 60, 300 0" />
                        <path d="M80 540 C 280 440, 340 360, 280 260 S 160 80, 340 20" />
                        <path d="M120 560 C 320 460, 380 380, 320 280 S 200 100, 380 40" />
                        <path d="M160 580 C 360 480, 420 400, 360 300 S 240 120, 420 60" />
                        <path d="M200 600 C 400 500, 460 420, 400 320 S 280 140, 460 80" />
                        <path d="M240 620 C 440 520, 500 440, 440 340 S 320 160, 500 100" />
                        <path d="M280 640 C 480 540, 540 460, 480 360 S 360 180, 540 120" />
                        <path d="M320 660 C 520 560, 580 480, 520 380 S 400 200, 580 140" />
                    </g>
                </svg>
            </div>

            <div className="relative mx-auto px-5 pb-8 pt-12 sm:px-8 sm:pt-16 lg:px-10">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
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
                        <p className="mt-3.5 max-w-[36ch] text-sm font-medium text-white/60">
                            Free, plain-language education in microfinance and sustainable
                            finance. No paywalls, no jargon.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white/40">Learn</h4>
                        <div className="mt-4 flex flex-col gap-2.5">
                            {learnLinks.map(([label, href]) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className="text-sm font-medium text-white/70 transition-colors hover:text-white"
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white/40">Explore</h4>
                        <div className="mt-4 flex flex-col gap-2.5">
                            {exploreLinks.map(([label, href]) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className="text-sm font-medium text-white/70 transition-colors hover:text-white"
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white/40">Platform</h4>
                        <div className="mt-4 flex flex-col gap-2.5">
                            {platformLinks.map(([label, href]) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className="text-sm font-medium text-white/70 transition-colors hover:text-white"
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-xs font-medium leading-relaxed text-white/50 sm:text-sm">
                    <strong className="text-white/80">Education, not advice.</strong> The
                    Finance Platform Demo provides general financial education only.
                    Nothing on this site is financial, investment, legal or tax advice,
                    and no content is a recommendation to buy or sell any product.
                    Always consider your own circumstances and, where needed, consult a
                    licensed professional in your country.
                </div>

                <div className="mt-8 flex flex-col-reverse items-center gap-5 border-t border-white/10 pt-6 sm:flex-row sm:justify-between">
                    <p className="text-xs font-medium text-white/45 sm:text-sm">
                        © {currentYear} Finance Platform Demo. Free forever built for
                        learners everywhere.
                    </p>
                    <div className="flex items-center gap-2">
                        {socialLinks.map(([label, href, Icon]) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                className="group grid h-9 w-9 place-items-center rounded-full border border-white/12 bg-white/[0.03] text-white/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10 hover:text-white hover:shadow-[0_6px_16px_-6px_rgba(0,0,0,0.5)]"
                            >
                                <Icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
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