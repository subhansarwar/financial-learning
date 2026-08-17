"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState("");

    useEffect(() => {
        // Get current page from URL
        const path = window.location.pathname;
        const page = path.split("/").pop().replace(".html", "") || "index";
        setCurrentPage(page);

        // Check login status
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

    const handleLogout = () => {
        localStorage.removeItem("efp.user");
        setIsLoggedIn(false);
        setUserName("");
        window.location.href = "/";
    };

    // Navigation links exactly like static site
    const links = [
        ["catalog", "Courses", "/catalog"],
        ["cases", "Case Studies", "/case-studies"],
        ["stats", "Statistics", "/statistics"],
        ["research", "Research", "/research"],
        ["tools", "Tools", "/tools"],
    ];

    return (
        <>
            <a className="skip-link" href="#main">Skip to content</a>
            <header className="site-header">
                <div className="wrap">
                    <Link className="brand" href="/">
                        <span className="mark">🎓</span>
                        Finance Platform
                    </Link>
                    <button
                        className="nav-toggle"
                        aria-label="Menu"
                        aria-expanded={isMenuOpen}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        ☰
                    </button>
                    <nav className={`main-nav ${isMenuOpen ? "open" : ""}`} id="mainNav" aria-label="Main">
                        {links.map(([id, label, href]) => (
                            <Link
                                key={id}
                                href={href}
                                className={currentPage === id ? "active" : ""}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {label}
                            </Link>
                        ))}
                        {isLoggedIn ? (
                            <>
                                <span className="user-chip" title={userEmail}>
                                    👤 {userName}
                                </span>
                                <Link
                                    href="/dashboard"
                                    className={currentPage === "dashboard" ? "active" : ""}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    My Learning
                                </Link>
                                <a
                                    href="#"
                                    id="navLogout"
                                    className="nav-cta-outline"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleLogout();
                                    }}
                                >
                                    Log out
                                </a>
                            </>
                        ) : (
                            <Link href="/login" className="nav-cta">
                                Log in — free
                            </Link>
                        )}
                    </nav>
                </div>
            </header>
        </>
    );
}