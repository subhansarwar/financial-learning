"use client";

import Link from "next/link";
import Image from "next/image";
import FooterImage from "../../public/assets/footerImages/FooterImage.webp";
import FooterLogo from "../../public/assets/footerImages/Logo.webp";
import InstagramLogoFooter from "../../public/assets/footerImages/InstagramLogoFooter.webp";
import twitterFooter from "../../public/assets/footerImages/twitterFooterIcon.webp";
import facebookIconFooter from "../../public/assets/footerImages/facebookIconFooter.webp";
import LinkedinLogoFooter from "../../public/assets/footerImages/LinkedinLogoFooter.webp";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const pagesLinks = [
        ["Course catalog", "/catalog"],
        ["My learning", "/dashboard"],
        ["Financial tools", "/tools"],
        ["Case studies", "/case-studies"],
        ["Statistics", "/statistics"],
        ["Research papers", "/research"],
    ];

    const companyLinks = [
        ["Terms Conditions", "/terms"],
        ["Privacy Policy", "/privacy"],
        ["Cookies", "/cookies"],
    ];

    const communityLinks = [
        ["Help Center", "/help"],
        ["FAQ", "/faq"],
    ];

    const socialLinks = [
        ["Facebook", "https://facebook.com", facebookIconFooter],
        ["Instagram", "https://instagram.com", InstagramLogoFooter],
        ["Twitter", "https://twitter.com", twitterFooter],
        ["LinkedIn", "https://linkedin.com", LinkedinLogoFooter],
    ];

    return (
        <footer className="relative overflow-hidden rounded-t-[24px] bg-[#0c0c0e] text-white sm:rounded-t-[32px]">

            <div className="relative mx-5 px-5 sm:px-8 lg:px-10">
                {/* ===== CTA ===== */}
                <div className="mx-5 pt-12 text-center sm:pt-14 md:pt-16 lg:pt-20">
                    <h2 className="text-[1.5rem] font-extrabold leading-[1.2] tracking-tight sm:text-[1.85rem] md:text-[2.1rem] lg:text-[2.3rem]">
                        Ready to Start Your Courses and Grow Your Career
                    </h2>
                    <p className="mx-auto mt-3 max-w-[75ch] text-[13px] font-medium text-white/55 sm:text-sm">
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

                {/* ===== Center Illustration (enlarged) ===== */}
                <div className="relative mx-auto mt-0 h-[260px] w-[290px] sm:mt-5 sm:h-[320px] sm:w-[350px] md:h-[380px] md:w-[420px] lg:h-[420px] lg:w-[460px]">
                    <Image
                        src={FooterImage}
                        alt=""
                        fill
                        priority={false}
                        sizes="(max-width: 640px) 290px, (max-width: 768px) 350px, (max-width: 1024px) 420px, 460px"
                        className="object-contain"
                    />
                </div>

                {/* ===== Link columns ===== */}
                <div className="flex flex-col gap-10 border-t border-white/10 pb-8 pt-10 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
                    {/* Logo + description */}
                    <div className="max-w-xs">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-base font-extrabold tracking-tight text-white no-underline hover:no-underline"
                        >
                            {/* <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-md">
                                <Image
                                    src={FooterLogo}
                                    alt="The Eco Lens"
                                    fill
                                    className="object-contain"
                                />
                            </span> */}
                            The Eco Lens
                        </Link>
                        <p className="mt-3 max-w-[34ch] text-[13px] leading-relaxed font-medium text-white/50 sm:text-sm">
                            Free, plain-language education in microfinance and sustainable
                            finance. No paywalls, no jargon.
                        </p>
                    </div>

                    {/* Link groups */}
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-14 lg:gap-16">
                        <div>
                            <h4 className="text-[14px] font-semibold text-white">Pages</h4>
                            <div className="mt-3 flex flex-col gap-2.5">
                                {pagesLinks.map(([label, href]) => (
                                    <Link
                                        key={href}
                                        href={href}
                                        className="text-[13px] font-medium text-white/50 transition-colors hover:text-white sm:text-sm"
                                    >
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-[14px] font-semibold text-white">Company</h4>
                            <div className="mt-3 flex flex-col gap-2.5">
                                {companyLinks.map(([label, href]) => (
                                    <Link
                                        key={href}
                                        href={href}
                                        className="text-[13px] font-medium text-white/50 transition-colors hover:text-white sm:text-sm"
                                    >
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <h4 className="text-[14px] font-semibold text-white">Community</h4>
                            <div className="mt-3 flex flex-col gap-2.5">
                                {communityLinks.map(([label, href]) => (
                                    <Link
                                        key={href}
                                        href={href}
                                        className="text-[13px] font-medium text-white/50 transition-colors hover:text-white sm:text-sm"
                                    >
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== Bottom bar ===== */}
                <div className="mt-6 flex flex-col-reverse items-center gap-4 border-t border-white/10 py-5 sm:flex-row sm:justify-between">
                    <p className="text-xs font-medium text-white/40 sm:text-[13px]">
                        ©{currentYear} The Eco Lens. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2.5">
                        {socialLinks.map(([label, href, icon]) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                className="group relative grid h-8 w-8 place-items-center overflow-hidden rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_-6px_rgba(0,0,0,0.5)] sm:h-9 sm:w-9"
                            >
                                <Image
                                    src={icon}
                                    alt={label}
                                    className="h-4 w-4 object-contain transition-transform duration-200 group-hover:scale-110 sm:h-[18px] sm:w-[18px]"
                                />
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
        </footer >
    );
}