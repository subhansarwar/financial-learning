// app/components/adminPanelComp/AdminLogin.jsx
"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import {
    Shield,
    Lock,
    Key,
    Eye,
    EyeOff,
    LogIn,
    Sparkles,
    AlertCircle,
    CheckCircle2,
    UserCog,
    Fingerprint,
    ShieldCheck,
    LockKeyhole,
} from "lucide-react";
import loginBg from '../../../public/assets/loginPageImage/financial-information.webp';

export default function AdminLogin({ onLogin }) {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Demo admin password
        if (password === "admin123") {
            sessionStorage.setItem("fl_admin", "true");
            toast.success("Welcome Admin! Redirecting...");
            setTimeout(() => {
                onLogin();
                setLoading(false);
            }, 500);
        } else {
            setError("Invalid password. Please try again.");
            toast.error("Invalid password. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream py-12 sm:py-16">
            {/* ===== Background Image ===== */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={loginBg}
                    alt="Admin Login Background"
                    fill
                    className="object-cover"
                    priority
                    quality={100}
                />
                {/* Dark Overlay for better readability */}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            </div>

            {/* ===== Content ===== */}
            <div className="relative z-10 w-full max-w-md px-4 sm:px-0">
                <div className="rounded-xl2 border border-white/10 bg-white/95 p-6 shadow-card backdrop-blur-sm sm:p-8">
                    {/* Header */}
                    <div className="mb-6 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#47735B]-soft">
                            <Shield className="h-8 w-8 text-[#47735B]" strokeWidth={2} />
                        </div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                            Admin Access
                        </h1>
                        <p className="mt-2 text-sm font-medium text-muted">
                            Enter your password to manage courses, topics, and ESG data.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="adminPass"
                                className="mb-1.5 flex items-center gap-2 text-sm font-bold text-ink-2"
                            >
                                <Lock className="h-4 w-4 text-amber-500" strokeWidth={2} />
                                Admin Password
                            </label>
                            <div className="relative rounded-lg border border-line focus-within:border-brand/50 focus-within:ring-4 focus-within:ring-brand/15">
                                <input
                                    id="adminPass"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter admin password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-lg bg-transparent px-4 py-2.5 pr-12 text-sm font-medium text-ink placeholder:text-muted focus:outline-none"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-ink-2"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" strokeWidth={2} />
                                    ) : (
                                        <Eye className="h-4 w-4" strokeWidth={2} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-start gap-2 rounded-lg bg-rose-50 p-3">
                                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-500" strokeWidth={2} />
                                <p className="text-sm text-rose-700">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !password.trim()}
                            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#47735B] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#47735B] disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                </>
                            ) : (
                                <>
                                    <LogIn className="h-4 w-4" strokeWidth={2.5} />
                                    Sign in
                                </>
                            )}
                        </button>
                    </form>

                    {/* Security Note */}
                    <div className="mt-4 flex items-start gap-2 rounded-lg bg-brand-soft/50 p-3">
                        <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-deep" strokeWidth={2} />
                        <p className="text-xs text-ink-2">
                            <span className="font-bold text-brand-deep">Secure access:</span>{" "}
                            This is a demo admin panel. Use password{" "}
                            <code className="rounded bg-white/50 px-1.5 py-0.5 font-mono text-xs font-bold text-brand-deep">
                                admin123
                            </code>
                        </p>
                    </div>

                    {/* Keyboard Hint */}
                    <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted">
                        <Key className="h-3.5 w-3.5" strokeWidth={2} />
                        Press Enter to submit
                    </div>
                </div>
            </div>
        </div>
    );
}