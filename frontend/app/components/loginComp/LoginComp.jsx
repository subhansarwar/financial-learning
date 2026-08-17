"use client";
import React from 'react'
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const LoginComp = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const next = searchParams.get("next") || "dashboard";
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check if already logged in
        const user = localStorage.getItem("efp.user");
        if (user) {
            router.push(next);
        }
    }, [next, router]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const { name, email, password } = form;
        if (!name.trim()) {
            alert("Please enter your name");
            setLoading(false);
            return;
        }
        if (!email || !email.includes("@")) {
            alert("Please enter a valid email");
            setLoading(false);
            return;
        }

        // Demo login - store in localStorage
        localStorage.setItem("efp.user", JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            at: Date.now()
        }));
        localStorage.setItem("finlearn.v1", JSON.stringify({
            name: name.trim(),
            courses: {}
        }));

        setTimeout(() => {
            router.push(next);
        }, 500);
    };
    return (
        <section className="login-hero">
            <div className="login-card">
                <div className="login-mark">🎓</div>
                <h1>Welcome back, learner</h1>
                <p className="text-muted">
                    Sign in to track your progress, unlock modules and earn your certificates.
                    Everything stays free — and stays on your device.
                </p>

                <form onSubmit={handleSubmit} noValidate>
                    <label htmlFor="lfName">Your name</label>
                    <input
                        id="lfName"
                        type="text"
                        placeholder="e.g. Amina Yusuf"
                        autoComplete="name"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />

                    <label htmlFor="lfEmail">Email</label>
                    <input
                        id="lfEmail"
                        type="email"
                        placeholder="you@example.org"
                        autoComplete="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />

                    <label htmlFor="lfPass">Password</label>
                    <input
                        id="lfPass"
                        type="password"
                        placeholder="Anything you like — this is a demo login"
                        autoComplete="current-password"
                        required
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />

                    <button className="btn btn-primary" type="submit" style={{ width: "100%" }} disabled={loading}>
                        {loading ? "Logging in..." : "Log in — free"}
                    </button>
                    <p className="login-note">
                        🔒 Demo sign-in: no real account is created and nothing is uploaded.
                        Your name is only used on your certificates and saved in this browser.
                    </p>
                </form>
            </div>

            <aside className="login-side">
                <h2>Two flagship programs, twelve modules each</h2>
                <ul>
                    <li><b>🤝 Microfinance</b> — microcredit, micro-savings, micro-insurance, micro-leasing</li>
                    <li><b>🌱 Sustainability &amp; Finance</b> — green energy, green bonds, ESG, carbon markets</li>
                    <li><b>📄 Research corner</b> — read and publish student papers</li>
                    <li><b>🎓 Certificates</b> — pass every module at 70%+ and download yours</li>
                </ul>
            </aside>
        </section>
    )
}

export default LoginComp