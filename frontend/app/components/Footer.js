"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";

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

    return (
        <footer className="border-t border-line-soft bg-cream-2">
            <div className="mx-auto max-w-[1180px] px-4 py-12 sm:px-6 sm:py-14">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                    <div>
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-ink no-underline hover:no-underline"
                        >
                            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand-deep">
                                <GraduationCap className="h-5 w-5" strokeWidth={2.25} />
                            </span>
                            Finance Platform Demo
                        </Link>
                        <p className="mt-3.5 max-w-[36ch] text-sm font-medium text-muted">
                            Free, plain-language education in microfinance and sustainable
                            finance. No paywalls, no jargon.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted">Learn</h4>
                        <div className="mt-4 flex flex-col gap-2.5">
                            {learnLinks.map(([label, href]) => (
                                <Link key={href} href={href} className="text-sm font-medium text-ink-2 transition-colors hover:text-brand-deep">
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted">Explore</h4>
                        <div className="mt-4 flex flex-col gap-2.5">
                            {exploreLinks.map(([label, href]) => (
                                <Link key={href} href={href} className="text-sm font-medium text-ink-2 transition-colors hover:text-brand-deep">
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted">Platform</h4>
                        <div className="mt-4 flex flex-col gap-2.5">
                            {platformLinks.map(([label, href]) => (
                                <Link key={href} href={href} className="text-sm font-medium text-ink-2 transition-colors hover:text-brand-deep">
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-10 border-t border-line pt-6 text-xs font-medium leading-relaxed text-muted sm:text-sm">
                    <strong className="text-ink-2">Education, not advice.</strong> The
                    Finance Platform Demo provides general financial education only.
                    Nothing on this site is financial, investment, legal or tax advice,
                    and no content is a recommendation to buy or sell any product.
                    Always consider your own circumstances and, where needed, consult a
                    licensed professional in your country.
                    <br />
                    <br />© {currentYear} Finance Platform Demo. Free forever built for
                    learners everywhere.
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