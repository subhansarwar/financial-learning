"use client";

import Link from "next/link";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <div className="wrap">
                <div className="cols">
                    <div>
                        <Link className="brand" href="/">
                            <span className="mark">🎓</span>
                            Finance Platform Demo
                        </Link>
                        <p style={{ marginTop: "14px", fontSize: ".92rem", maxWidth: "36ch" }}>
                            Free, plain-language education in microfinance and sustainable finance. No paywalls, no jargon.
                        </p>
                    </div>
                    <div>
                        <h4>LEARN</h4>
                        <Link href="/catalog">Course catalog</Link>
                        <Link href="/dashboard">My learning</Link>
                        <Link href="/tools">Financial tools</Link>
                    </div>
                    <div>
                        <h4>EXPLORE</h4>
                        <Link href="/case-studies">Case studies</Link>
                        <Link href="/statistics">Statistics</Link>
                        <Link href="/research">Research papers</Link>
                    </div>
                    <div>
                        <h4>PLATFORM</h4>
                        <Link href="/about">About us</Link>
                        <Link href="/privacy">Privacy</Link>
                        <Link href="/terms">Terms & disclaimer</Link>
                        <Link href="/admin">Admin panel</Link>
                    </div>
                </div>
                <div className="f-note">
                    <strong>Education, not advice.</strong> The Finance Platform Demo provides general financial
                    education only. Nothing on this site is financial, investment, legal or tax advice, and no content is a
                    recommendation to buy or sell any product. Always consider your own circumstances and,
                    where needed, consult a licensed professional in your country.<br /><br />
                    © {currentYear} Finance Platform Demo. Free forever — built for learners everywhere.
                </div>
            </div>
            <div className="toast" id="flToast" role="status"></div>
        </footer>
    );
}