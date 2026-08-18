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
    Moon,
    Search,
    Sparkles,
    Sun,
    Wrench,
    X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
    const [scrolled, setScrolled] = useState(false);
    const [isDark, setIsDark] = useState(false);

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
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem("efp.user");
        setIsLoggedIn(false);
        setUserName("");
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
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                ? "border-b border-line bg-white/95 shadow-card backdrop-blur-xl"
                : "border-b border-transparent bg-white/80 backdrop-blur-md"
                }`}
        >
            <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
                <div className="flex h-16 items-center justify-between gap-4 sm:h-[72px]">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="group flex items-center gap-2.5 no-underline hover:no-underline"
                    >
                        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-deep transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg">
                            <GraduationCap className="h-5 w-5 text-white" strokeWidth={2.25} />
                        </div>
                        <span className="text-lg font-extrabold tracking-tight text-ink transition-colors group-hover:text-brand-deep">
                            Finance<span className="text-brand">.</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center gap-1 lg:flex">
                        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
                            const active = isActive(href);
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`group relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all duration-200 ${active
                                        ? "bg-brand-soft text-brand-deep"
                                        : "text-ink-2 hover:bg-cream-2 hover:text-ink"
                                        }`}
                                >
                                    <Icon
                                        className={`h-4 w-4 transition-colors ${active ? "text-brand" : "text-muted group-hover:text-ink-2"
                                            }`}
                                        strokeWidth={2}
                                    />
                                    {label}
                                    {active && (
                                        <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-brand" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Section */}
                    <div className="flex items-center gap-2">

                        {/* User Section - Desktop */}
                        <div className="hidden items-center gap-2 lg:flex">
                            {isLoggedIn ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-deep text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-md"
                                        aria-label={`Go to ${userName}'s dashboard`}
                                        title={userName}
                                    >
                                        {getInitials(userName).charAt(0).toUpperCase()}
                                    </Link>
                                    {/* <button
                                        onClick={handleLogout}
                                        className="rounded-full p-2 text-muted transition-colors hover:bg-rose-50 hover:text-rose-600"
                                        aria-label="Log out"
                                    >
                                        <LogOut className="h-4 w-4" strokeWidth={2} />
                                    </button> */}
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-deep to-brand px-5 py-2 text-sm font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-brand/25"
                                >
                                    <Sparkles className="h-4 w-4" strokeWidth={2.5} />
                                    Log in free
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="grid h-10 w-10 place-items-center rounded-lg text-ink-2 transition-colors hover:bg-brand-soft hover:text-brand-deep lg:hidden"
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

                {/* Mobile Navigation */}
                <div
                    className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                        }`}
                >
                    <nav className="flex flex-col gap-1 border-t border-line-soft pb-4 pt-3">
                        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
                            const active = isActive(href);
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition-colors ${active
                                        ? "bg-brand-soft text-brand-deep"
                                        : "text-ink-2 hover:bg-cream-2 hover:text-ink"
                                        }`}
                                >
                                    <Icon
                                        className={`h-5 w-5 ${active ? "text-brand" : "text-muted"
                                            }`}
                                        strokeWidth={2}
                                    />
                                    {label}
                                    {active && (
                                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand" />
                                    )}
                                </Link>
                            );
                        })}

                        <div className="mt-2 border-t border-line-soft pt-2">
                            {isLoggedIn ? (
                                <>
                                    <div className="flex items-center gap-3 rounded-lg px-4 py-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand-deep">
                                            {getInitials(userName)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-ink">{userName}</p>
                                            <p className="text-xs text-muted">{userEmail}</p>
                                        </div>
                                    </div>
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold text-ink-2 transition-colors hover:bg-cream-2 hover:text-ink"
                                    >
                                        <LayoutDashboard className="h-5 w-5 text-muted" strokeWidth={2} />
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-50"
                                    >
                                        <LogOut className="h-5 w-5" strokeWidth={2} />
                                        Log out
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-deep to-brand px-5 py-3 text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-brand/25"
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