// app/components/Header.jsx
"use client";

import { ChevronDown, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logoutUser } from "../store/slices/user/userThunks";

const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/catalog", label: "Courses" },
    { href: "/case-studies", label: "Case study" },
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
    const [isScrolled, setIsScrolled] = useState(false);
    const [clickedLink, setClickedLink] = useState(null);
    const [isNearFooter, setIsNearFooter] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const accountRef = useRef(null);
    const dispatch = useAppDispatch()
    const { isAuthenticated, user, loading } = useAppSelector((state) => state.user);
    const lastScrollY = useRef(0);

    // Check scroll position
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            setIsScrolled(currentScrollY > 20);

            if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
                setIsVisible(false);
                setIsOpen(false);
            } else {
                setIsVisible(true);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    // useEffect(() => {
    //     const handleScroll = () => {
    //         setIsScrolled(window.scrollY > 30);
    //     };
    //     window.addEventListener("scroll", handleScroll);
    //     return () => window.removeEventListener("scroll", handleScroll);
    // }, []);

    // useEffect(() => {
    //     const userData = localStorage.getItem("efp.user");
    //     if (userData) {
    //         try {
    //             const user = JSON.parse(userData);
    //             setIsLoggedIn(true);
    //             setUserName(user.full_name);
    //             setUserEmail(user.email);
    //         } catch (e) {
    //             setIsLoggedIn(false);
    //         }
    //     }
    // }, []);

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

    const handleLogout = async () => {
        try {
            // Dispatch logout action
            await dispatch(logoutUser()).unwrap();
            setIsLoggedIn(false);
            setIsAccountOpen(false);
            window.location.href = "/";
        } catch (error) {
            setIsLoggedIn(false);
            setIsAccountOpen(false);
            // console.error("Logout error:", error);
            // Even if there's an error, redirect to login
            window.location.href = "/";
        }
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

    const handleLinkClick = (href) => {
        setClickedLink(href);
        setTimeout(() => setClickedLink(null), 300);
    };

    const shouldBeTransparent = isScrolled && !isNearFooter;

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-in-out ${shouldBeTransparent
                    ? "bg-transparent backdrop-blur-xl shadow-lg"
                    : "bg-[#72BB83]"
                    }`}
                style={{
                    transform: isVisible
                        ? "translateY(0)"
                        : "translateY(-100%)",
                }}
            >
                <div className="mx-5 px-4 sm:px-6 lg:px-10">
                    <div className="flex h-14 items-center justify-between gap-4 sm:h-16">
                        {/* Logo */}
                        <Link
                            href="/"
                            className={`shrink-0 no-underline hover:no-underline transition-all duration-300 ${shouldBeTransparent ? "scale-95" : "scale-100"
                                }`}
                        >
                            <span className={`text-base font-extrabold tracking-tight transition-all duration-300 sm:text-lg lg:text-xl ${shouldBeTransparent ? "text-[#14301F]" : "text-[#151515]"
                                }`}>
                                The Eco Lens
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden items-center gap-5 lg:flex xl:gap-7">
                            {NAV_LINKS.map(({ href, label }) => {
                                const active = isActive(href);
                                const isClicked = clickedLink === href;
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        onClick={() => handleLinkClick(href)}
                                        className={`relative pb-1 text-[13px] font-medium tracking-wide transition-all duration-300 ${active
                                            ? isScrolled
                                                ? "text-[#14301F]"
                                                : "text-[#14301F]"
                                            : isScrolled
                                                ? "text-gray-600 hover:text-[#14301F]"
                                                : "text-white/90 hover:text-white"
                                            } ${isClicked ? "scale-110" : "scale-100"} hover:scale-105`}
                                    >
                                        {label}
                                        {active && (
                                            <span className="absolute -bottom-0 left-0 right-0 h-[2px] bg-[#14301F] transition-all duration-300 origin-left scale-x-100" />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Right Section */}
                        <div className="flex items-center gap-3">
                            {/* User Section - Desktop */}
                            <div className="hidden items-center gap-3 lg:flex" ref={accountRef}>
                                {isAuthenticated && user ? (
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsAccountOpen((v) => !v)}
                                            className={`flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-sm font-semibold transition-all duration-300 hover:scale-105 ${isAccountOpen
                                                ? "border-[#14301F]/30 bg-[#14301F]/10 text-[#14301F]"
                                                : isScrolled
                                                    ? "border-gray-300 bg-white/50 text-gray-700 hover:bg-white/80"
                                                    : "border-white/30 bg-white/10 text-white hover:bg-white/20"
                                                }`}
                                            aria-haspopup="menu"
                                            aria-expanded={isAccountOpen}
                                        >
                                            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-transform duration-300 hover:scale-110 ${isScrolled
                                                ? "bg-[#14301F] text-white"
                                                : "bg-btn-primary text-white"
                                                }`}>
                                                {getInitials(user?.full_name || user?.name || user?.email)}
                                            </span>
                                            <span className={`max-w-[9ch] truncate ${isScrolled ? "text-gray-700" : "text-white"
                                                }`}>
                                                {user?.full_name || user?.name || user?.email?.split('@')[0] || 'User'}
                                            </span>
                                            <ChevronDown
                                                className={`h-3.5 w-3.5 transition-all duration-300 ${isAccountOpen ? "rotate-180" : ""
                                                    } ${isScrolled ? "text-gray-500" : "text-white/70"}`}
                                                strokeWidth={2.5}
                                            />
                                        </button>

                                        {isAccountOpen && (
                                            <div
                                                role="menu"
                                                className="absolute right-0 top-[calc(100%+10px)] w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white text-ink shadow-card-lg transition-all duration-300 origin-top scale-100 opacity-100"
                                            >
                                                <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/50 px-4 py-3.5">
                                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#14301F]/10 text-sm font-bold text-[#14301F]">
                                                        {getInitials(user?.full_name || user?.name || user?.email)}
                                                    </span>
                                                    <div className="min-w-0">
                                                        <p className="truncate font-bold text-ink">{user?.full_name || user?.name || 'User'}</p>
                                                        <p className="truncate text-xs text-gray-500"> {user?.email || ''}</p>
                                                    </div>
                                                </div>
                                                <div className="p-1.5">
                                                    <Link
                                                        href="/dashboard"
                                                        onClick={() => setIsAccountOpen(false)}
                                                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-ink-2 transition-all duration-200 hover:bg-gray-100 hover:text-ink hover:scale-105"
                                                    >
                                                        <LayoutDashboard className="h-4 w-4 text-gray-400" strokeWidth={2} />
                                                        Dashboard
                                                    </Link>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-rose-600 transition-all duration-200 hover:bg-rose-50 hover:scale-105"
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
                                            className={`text-[13px] font-medium transition-all duration-300 hover:scale-105 ${isScrolled
                                                ? "text-gray-600 hover:text-[#14301F]"
                                                : "text-white/90 hover:text-white"
                                                }`}
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/signup"
                                            className={`rounded-full px-5 py-1.5 text-[11px] font-bold text-white transition-all duration-300 hover:scale-105 ${isScrolled
                                                ? "bg-[#14301F] hover:bg-[#14301F]/80 shadow-md"
                                                : "bg-btn-primary hover:bg-btn-primary-hover"
                                                }`}
                                        >
                                            Register Now
                                        </Link>
                                    </>
                                )}
                            </div>

                            {/* Mobile Menu Toggle */}
                            <button
                                className={`grid h-9 w-9 place-items-center rounded-lg transition-all duration-300 hover:bg-white/20 lg:hidden ${isScrolled
                                    ? "text-[#14301F] hover:bg-[#14301F]/10"
                                    : "text-white hover:bg-white/20"
                                    }`}
                                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                                aria-expanded={isMenuOpen}
                                onClick={() => setIsMenuOpen((v) => !v)}
                            >
                                {isMenuOpen ? (
                                    <X className="h-5 w-5 transition-transform duration-300 rotate-180" strokeWidth={2.25} />
                                ) : (
                                    <Menu className="h-5 w-5 transition-transform duration-300" strokeWidth={2.25} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out lg:hidden ${isMenuOpen
                            ? "max-h-[600px] opacity-100 translate-y-0"
                            : "max-h-0 opacity-0 -translate-y-4"
                            }`}
                    >
                        <nav className={`flex flex-col gap-1 pb-4 pt-3 ${isScrolled ? "border-t border-gray-200" : "border-t border-white/20"
                            }`}>
                            {NAV_LINKS.map(({ href, label }) => {
                                const active = isActive(href);
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            handleLinkClick(href);
                                        }}
                                        className={`flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${active
                                            ? isScrolled
                                                ? "bg-[#14301F]/10 text-[#14301F]"
                                                : "bg-white/15 text-[#14301F]"
                                            : isScrolled
                                                ? "text-gray-600 hover:bg-gray-100 hover:text-[#14301F]"
                                                : "text-white/90 hover:bg-white/10 hover:text-white"
                                            } hover:scale-105`}
                                    >
                                        {label}
                                        {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#14301F] animate-pulse" />}
                                    </Link>
                                );
                            })}

                            <div className={`mt-2 pt-2 ${isScrolled ? "border-t border-gray-200" : "border-t border-white/20"
                                }`}>
                                {isLoggedIn ? (
                                    <>
                                        <div className={`flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-300 hover:scale-[1.02] ${isScrolled ? "bg-gray-100/50" : "bg-white/10"
                                            }`}>
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#14301F] text-sm font-bold text-white">
                                                {getInitials(userName)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className={`truncate font-bold ${isScrolled ? "text-gray-800" : "text-white"
                                                    }`}>{userName}</p>
                                                <p className={`truncate text-xs ${isScrolled ? "text-gray-500" : "text-white/70"
                                                    }`}>{userEmail}</p>
                                            </div>
                                        </div>
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setIsMenuOpen(false)}
                                            className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-105 ${isScrolled
                                                ? "text-gray-600 hover:bg-gray-100 hover:text-[#14301F]"
                                                : "text-white/90 hover:bg-white/10 hover:text-white"
                                                }`}
                                        >
                                            <LayoutDashboard className={`h-5 w-5 ${isScrolled ? "text-gray-400" : "text-white/60"
                                                }`} strokeWidth={2} />
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsMenuOpen(false);
                                            }}
                                            className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-105 ${isScrolled
                                                ? "text-rose-600 hover:bg-rose-50"
                                                : "text-rose-100 hover:bg-rose-500/15"
                                                }`}
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
                                            className={`flex items-center justify-center rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-300 hover:scale-105 ${isScrolled
                                                ? "border-gray-300 text-gray-600 hover:bg-gray-100"
                                                : "border-white/40 text-white hover:bg-white/10"
                                                }`}
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/register"
                                            onClick={() => setIsMenuOpen(false)}
                                            className={`flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:scale-105 ${isScrolled
                                                ? "bg-[#14301F] hover:bg-[#14301F]/80"
                                                : "bg-btn-primary hover:bg-btn-primary-hover"
                                                }`}
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
            <div className="h-8 sm:h-8" aria-hidden="true" />
        </>
    );
}