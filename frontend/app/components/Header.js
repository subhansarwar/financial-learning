// app/components/Header.jsx
"use client";

import { ChevronDown, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/catalog", label: "Courses" },
    { href: "/case-studies", label: "Case study" },
    { href: "/statistics", label: "Statistics" },
    { href: "/research", label: "Research" },
    { href: "/tools", label: "Tool" },
];

export default function Header() {
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const accountRef = useRef(null);

    useEffect(() => {
        const userData = localStorage.getItem("efp.user");
        if (userData) {
            try {
                const user = JSON.parse(userData);
                setIsLoggedIn(true);
                setUserName(user.name);
                setUserEmail(user.email);
            } catch (e) {
                setIsLoggedIn(false);
            }
        }
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
        setIsAccountOpen(false);
    }, [pathname]);

    // Close the account dropdown when clicking outside it.
    useEffect(() => {
        const handleClick = (e) => {
            if (accountRef.current && !accountRef.current.contains(e.target)) {
                setIsAccountOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("efp.user");
        setIsLoggedIn(false);
        setUserName("");
        setIsAccountOpen(false);
        window.location.href = "/";
    };

    const isActive = (href) => {
        if (href === "/") return pathname === href;
        return pathname === href || pathname?.startsWith(href + "/");
    };

    const getInitials = (name) => {
        if (!name) return "?";
        return name
            .split(/\s+/)
            .map((w) => w[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-[#72BB83]">
            <div className="mx-5 px-4 sm:px-6 lg:px-10">
                <div className="flex h-15 items-center justify-between gap-4 sm:h-20">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="shrink-0 no-underline hover:no-underline"
                    >
                        <span className="text-lg font-extrabold uppercase tracking-tight text-[#151515] sm:text-xl lg:text-2xl">
                            The Eco Lens
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
                        {NAV_LINKS.map(({ href, label }) => {
                            const active = isActive(href);
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`relative pb-1 text-[14px] font-medium tracking-wide transition-colors ${active
                                        ? "text-[#14301F]"
                                        : "text-white/90 hover:text-white"
                                        }`}
                                >
                                    {label}
                                    {active && (
                                        <span className="absolute -bottom-0 left-0 right-0 h-[1.5px] bg-[#14301F]" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Section */}
                    <div className="flex items-center gap-4">
                        {/* User Section - Desktop */}
                        <div className="hidden items-center gap-4 lg:flex" ref={accountRef}>
                            {isLoggedIn ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsAccountOpen((v) => !v)}
                                        className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 py-1 pl-1 pr-3 text-sm font-semibold text-white transition-all hover:bg-white/20"
                                        aria-haspopup="menu"
                                        aria-expanded={isAccountOpen}
                                    >
                                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-btn-primary text-xs font-bold text-white">
                                            {getInitials(userName)}
                                        </span>
                                        <span className="max-w-[9ch] truncate">{userName}</span>
                                        <ChevronDown
                                            className={`h-3.5 w-3.5 transition-transform ${isAccountOpen ? "rotate-180" : ""}`}
                                            strokeWidth={2.5}
                                        />
                                    </button>

                                    {isAccountOpen && (
                                        <div
                                            role="menu"
                                            className="absolute right-0 top-[calc(100%+10px)] w-64 overflow-hidden rounded-2xl border border-line bg-white text-ink shadow-card-lg"
                                        >
                                            <div className="flex items-center gap-3 border-b border-line-soft bg-cream-2/50 px-4 py-3.5">
                                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-btn-primary/10 text-sm font-bold text-btn-primary">
                                                    {getInitials(userName)}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="truncate font-bold text-ink">{userName}</p>
                                                    <p className="truncate text-xs text-muted">{userEmail}</p>
                                                </div>
                                            </div>
                                            <div className="p-1.5">
                                                <Link
                                                    href="/dashboard"
                                                    onClick={() => setIsAccountOpen(false)}
                                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-ink-2 transition-colors hover:bg-cream-2 hover:text-ink"
                                                >
                                                    <LayoutDashboard className="h-4 w-4 text-muted" strokeWidth={2} />
                                                    Dashboard
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-50"
                                                >
                                                    <LogOut className="h-4 w-4" strokeWidth={2} />
                                                    Log out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-[14px] font-medium text-white/90 transition-colors hover:text-white"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="rounded-full bg-btn-primary px-6 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-btn-primary-hover"
                                    >
                                        Register Now
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="grid h-10 w-10 place-items-center rounded-lg text-[#14301F] transition-colors hover:bg-white/20 lg:hidden"
                            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={isMenuOpen}
                            onClick={() => setIsMenuOpen((v) => !v)}
                        >
                            {isMenuOpen ? (
                                <X className="h-5 w-5" strokeWidth={2.25} />
                            ) : (
                                <Menu className="h-5 w-5" strokeWidth={2.25} />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${isMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                        }`}
                >
                    <nav className="flex flex-col gap-1 border-t border-white/20 pb-4 pt-3">
                        {NAV_LINKS.map(({ href, label }) => {
                            const active = isActive(href);
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${active
                                        ? "bg-white/15 text-[#14301F]"
                                        : "text-white/90 hover:bg-white/10 hover:text-white"
                                        }`}
                                >
                                    {label}
                                    {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#14301F]" />}
                                </Link>
                            );
                        })}

                        <div className="mt-2 border-t border-white/20 pt-2">
                            {isLoggedIn ? (
                                <>
                                    <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-btn-primary text-sm font-bold text-white">
                                            {getInitials(userName)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-bold text-white">{userName}</p>
                                            <p className="truncate text-xs text-white/70">{userEmail}</p>
                                        </div>
                                    </div>
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                                    >
                                        <LayoutDashboard className="h-5 w-5 text-white/60" strokeWidth={2} />
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-rose-100 transition-colors hover:bg-rose-500/15"
                                    >
                                        <LogOut className="h-5 w-5" strokeWidth={2} />
                                        Log out
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-2 px-1">
                                    <Link
                                        href="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-center rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-center rounded-full bg-btn-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-btn-primary-hover"
                                    >
                                        Register Now
                                    </Link>
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}