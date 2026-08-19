// app/components/Header.jsx
"use client";

import {
    BarChart3,
    BookOpen,
    ChevronDown,
    FileText,
    GraduationCap,
    LayoutDashboard,
    LogOut,
    Menu,
    Sparkles,
    Wrench,
    X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
    { href: "/catalog", label: "Courses", icon: BookOpen },
    { href: "/case-studies", label: "Case Studies", icon: FileText },
    { href: "/statistics", label: "Statistics", icon: BarChart3 },
    { href: "/research", label: "Research", icon: Sparkles },
    { href: "/tools", label: "Tools", icon: Wrench },
];

export default function Header() {
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
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

        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
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

    const transparentBg =
        "bg-transparent";

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-xl shadow-card" : transparentBg
                }`}
        >
            <div className="relative mx-auto px-4 sm:px-6">
                <div className="flex h-16 items-center justify-between gap-4 sm:h-[72px]">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="group flex items-center gap-2.5 no-underline hover:no-underline"
                    >
                        <div className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 ${scrolled
                            ? "bg-gradient-to-br from-brand to-brand-deep group-hover:scale-105 group-hover:shadow-lg"
                            : "bg-gradient-to-br from-brand/90 to-brand-deep/90 group-hover:scale-105 group-hover:shadow-lg"
                            }`}>
                            <GraduationCap className="h-5 w-5 text-white" strokeWidth={2.25} />
                        </div>
                        <span className={`text-lg font-extrabold tracking-tight transition-colors ${scrolled ? "text-ink group-hover:text-brand-deep" : "text-ink group-hover:text-brand"
                            }`}>
                            Finance<span className={scrolled ? "text-brand" : "text-brand"}>.</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center gap-0.5 lg:flex">
                        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
                            const active = isActive(href);
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`group relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${active
                                        ? scrolled
                                            ? "bg-brand-soft text-brand-deep"
                                            : "bg-brand-soft text-brand-deep"
                                        : scrolled
                                            ? "text-ink-2 hover:bg-cream-2 hover:text-ink"
                                            : "text-ink-2 hover:bg-cream-2 hover:text-ink"
                                        }`}
                                >
                                    <Icon
                                        className={`h-4 w-4 transition-colors ${active
                                            ? scrolled
                                                ? "text-brand"
                                                : "text-brand"
                                            : scrolled
                                                ? "text-muted group-hover:text-ink-2"
                                                : "text-muted group-hover:text-ink-2"
                                            }`}
                                        strokeWidth={2}
                                    />
                                    {label}
                                    {active && (
                                        <span className={`absolute -bottom-[3px] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${scrolled ? "bg-brand" : "bg-brand"
                                            }`} />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Section */}
                    <div className="flex items-center gap-3">
                        {/* User Section - Desktop */}
                        <div className="hidden items-center lg:flex" ref={accountRef}>
                            {isLoggedIn ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsAccountOpen((v) => !v)}
                                        className={`flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-sm font-semibold transition-all ${isAccountOpen
                                            ? scrolled
                                                ? "border-brand/30 bg-brand-soft text-brand-deep"
                                                : "border-white/40 bg-white/20 text-white"
                                            : scrolled
                                                ? "border-line bg-card text-ink-2 hover:border-brand/40 hover:bg-brand-soft/30"
                                                : "border-white/25 bg-white/10 text-white hover:border-white/40 hover:bg-white/15"
                                            }`}
                                        aria-haspopup="menu"
                                        aria-expanded={isAccountOpen}
                                    >
                                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-deep text-xs font-bold text-white">
                                            {getInitials(userName)}
                                        </span>
                                        <span className={`max-w-[9ch] truncate ${scrolled ? "text-ink-2" : "text-white"
                                            }`}>
                                            {userName}
                                        </span>
                                        <ChevronDown
                                            className={`h-3.5 w-3.5 transition-transform ${isAccountOpen ? "rotate-180" : ""
                                                } ${scrolled ? "text-muted" : "text-white/70"}`}
                                            strokeWidth={2.5}
                                        />
                                    </button>

                                    {isAccountOpen && (
                                        <div
                                            role="menu"
                                            className="absolute right-0 top-[calc(100%+10px)] w-64 overflow-hidden rounded-2xl border border-line bg-white text-ink shadow-card-lg"
                                        >
                                            <div className="flex items-center gap-3 border-b border-line-soft bg-cream-2/50 px-4 py-3.5">
                                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand-deep">
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
                                <Link
                                    href="/login"
                                    className={`group flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg ${scrolled
                                        ? "bg-gradient-to-r from-brand-deep to-brand shadow-[0_6px_20px_-6px_rgba(124,58,237,0.65)] hover:shadow-[0_10px_26px_-6px_rgba(124,58,237,0.75)]"
                                        : "bg-gradient-to-r from-brand to-brand-deep shadow-[0_6px_20px_-6px_rgba(0,0,0,0.45)] hover:shadow-[0_10px_26px_-6px_rgba(0,0,0,0.55)]"
                                        }`}
                                >
                                    <Sparkles className="h-4 w-4" strokeWidth={2.5} />
                                    Log in free
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className={`grid h-10 w-10 place-items-center rounded-lg transition-colors lg:hidden ${scrolled
                                ? "text-ink-2 hover:bg-brand-soft hover:text-brand-deep"
                                : "text-ink-2 hover:bg-brand-soft hover:text-brand-deep"
                                }`}
                            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={isMenuOpen}
                            onClick={() => setIsMenuOpen((v) => !v)}
                        >
                            {isMenuOpen ? (
                                <X className="h-5 w-5" strokeWidth={2} />
                            ) : (
                                <Menu className="h-5 w-5" strokeWidth={2} />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation — gets its own solid backdrop when transparent
                    so the panel never inherits a faded, low-contrast background. */}
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${isMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                        } ${!scrolled && isMenuOpen ? "-mx-4 rounded-b-2xl bg-white/95 backdrop-blur-xl px-4 sm:-mx-6 sm:px-6" : ""
                        }`}
                >
                    <nav className={`flex flex-col gap-1 pb-4 pt-3 ${scrolled ? "border-t border-line-soft" : "border-t border-line-soft"
                        }`}>
                        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
                            const active = isActive(href);
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${active
                                        ? scrolled
                                            ? "bg-brand-soft text-brand-deep"
                                            : "bg-brand-soft text-brand-deep"
                                        : scrolled
                                            ? "text-ink-2 hover:bg-cream-2 hover:text-ink"
                                            : "text-ink-2 hover:bg-cream-2 hover:text-ink"
                                        }`}
                                >
                                    <Icon
                                        className={`h-5 w-5 ${active
                                            ? scrolled
                                                ? "text-brand"
                                                : "text-brand"
                                            : scrolled
                                                ? "text-muted"
                                                : "text-muted"
                                            }`}
                                        strokeWidth={2}
                                    />
                                    {label}
                                    {active && (
                                        <span className={`ml-auto h-1.5 w-1.5 rounded-full ${scrolled ? "bg-brand" : "bg-brand"
                                            }`} />
                                    )}
                                </Link>
                            );
                        })}

                        <div className={`mt-2 pt-2 ${scrolled ? "border-t border-line-soft" : "border-t border-white/10"
                            }`}>
                            {isLoggedIn ? (
                                <>
                                    <div className={`flex items-center gap-3 rounded-xl px-4 py-3 ${scrolled ? "bg-cream-2/50" : "bg-white/10"
                                        }`}>
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-deep text-sm font-bold text-white">
                                            {getInitials(userName)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className={`truncate font-bold ${scrolled ? "text-ink" : "text-white"
                                                }`}>{userName}</p>
                                            <p className={`truncate text-xs ${scrolled ? "text-muted" : "text-white/70"
                                                }`}>{userEmail}</p>
                                        </div>
                                    </div>
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${scrolled
                                            ? "text-ink-2 hover:bg-cream-2 hover:text-ink"
                                            : "text-white/85 hover:bg-white/10 hover:text-white"
                                            }`}
                                    >
                                        <LayoutDashboard className={`h-5 w-5 ${scrolled ? "text-muted" : "text-white/60"
                                            }`} strokeWidth={2} />
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${scrolled
                                            ? "text-rose-600 hover:bg-rose-50"
                                            : "text-rose-300 hover:bg-rose-500/15"
                                            }`}
                                    >
                                        <LogOut className="h-5 w-5" strokeWidth={2} />
                                        Log out
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white transition-all ${scrolled
                                        ? "bg-gradient-to-r from-brand-deep to-brand shadow-[0_6px_20px_-6px_rgba(124,58,237,0.65)]"
                                        : "bg-gradient-to-r from-brand to-brand-deep shadow-[0_6px_20px_-6px_rgba(0,0,0,0.45)]"
                                        }`}
                                >
                                    <Sparkles className="h-4 w-4" strokeWidth={2.5} />
                                    Log in free
                                </Link>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}