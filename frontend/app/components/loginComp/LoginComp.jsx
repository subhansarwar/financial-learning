// app/components/loginComp/LoginComp.jsx
"use client";

import {
    Award,
    BadgeCheck,
    Eye,
    EyeOff,
    FileText,
    Fingerprint,
    GraduationCap,
    Handshake,
    Leaf,
    Lock,
    LogIn,
    Mail,
    Rocket,
    Shield,
    User,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { loginSchema } from "../../validations/authValidation";

// ============================================
// FIELD COMPONENT
// ============================================

export const Field = ({
    id,
    label,
    icon: Icon,
    type,
    placeholder,
    register,
    error,
    field,
    focused,
    setFocused,
    showPassword,
    setShowPassword,
}) => {
    const iconColor = {
        name: "text-brand",
        email: "text-purple-500",
        password: "text-amber-500",
    };

    return (
        <div>
            <label
                htmlFor={id}
                className="mb-1.5 flex items-center gap-2 text-sm font-bold text-ink-2"
            >
                <Icon
                    className={`h-4 w-4 ${iconColor[field] || "text-muted"}`}
                    strokeWidth={2}
                />
                {label}
            </label>

            <div
                className={`relative rounded-lg border transition-all duration-200 ${error
                        ? "border-rose-500 ring-4 ring-rose-500/15"
                        : focused === field
                            ? "border-brand/50 ring-4 ring-brand/15"
                            : "border-line"
                    }`}
            >
                <input
                    id={id}
                    type={type === "password" && showPassword ? "text" : type}
                    placeholder={placeholder}
                    {...register(field)}
                    onFocus={() => setFocused(field)}
                    onBlur={() => setFocused(null)}
                    autoComplete={
                        type === "password"
                            ? "current-password"
                            : type === "email"
                                ? "email"
                                : "name"
                    }
                    className={`w-full rounded-lg bg-transparent px-4 py-2.5 text-sm font-medium text-ink placeholder:text-muted outline-none focus:outline-none focus:ring-0 ${type === "password" ? "pr-12" : ""
                        }`}
                />

                {type === "password" && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-ink-2"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4" strokeWidth={2} />
                        ) : (
                            <Eye className="h-4 w-4" strokeWidth={2} />
                        )}
                    </button>
                )}
            </div>

            {error && (
                <p className="mt-1.5 text-xs font-medium text-rose-600">{error}</p>
            )}
        </div>
    );
};

// ============================================
// MAIN LOGIN COMPONENT
// ============================================

const LoginComp = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const next = searchParams.get("next") || "dashboard";

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState(null);
    const [mounted, setMounted] = useState(false);

    // React Hook Form with Yup validation
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        reset,
    } = useForm({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        setMounted(true);
        // Check if already logged in
        if (typeof window !== "undefined") {
            const user = localStorage.getItem("efp.user");
            if (user) {
                toast.success("Welcome back!");
                router.push(next);
            }
        }
    }, [next, router]);

    // Submit handler with validation
    const onSubmit = async (data) => {
        setLoading(true);

        const { name, email, password } = data;

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Store user data
            if (typeof window !== "undefined") {
                localStorage.setItem(
                    "efp.user",
                    JSON.stringify({
                        name: name.trim(),
                        email: email.trim(),
                        password: password.trim(),
                        at: Date.now(),
                    })
                );
                localStorage.setItem(
                    "finlearn.v1",
                    JSON.stringify({
                        name: name.trim(),
                        courses: {},
                    })
                );

                // Dispatch custom event to update header
                window.dispatchEvent(new Event("userUpdate"));
            }

            toast.success("Welcome! Redirecting to dashboard...");
            reset();

            setTimeout(() => {
                router.push(next);
                setLoading(false);
            }, 500);
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    const features = [
        {
            icon: Handshake,
            label: "Microfinance",
            desc: "Microcredit, micro-savings, micro-insurance, micro-leasing",
            color: "text-blue-500",
            bg: "bg-blue-50",
        },
        {
            icon: Leaf,
            label: "Sustainability & Finance",
            desc: "Green energy, green bonds, ESG, carbon markets",
            color: "text-emerald-500",
            bg: "bg-emerald-50",
        },
        {
            icon: FileText,
            label: "Research corner",
            desc: "Read and publish student papers",
            color: "text-purple-500",
            bg: "bg-purple-50",
        },
        {
            icon: Award,
            label: "Certificates",
            desc: "Pass every module at 70%+ and download yours",
            color: "text-amber-500",
            bg: "bg-amber-50",
        },
    ];

    // Show loading state while checking auth
    if (!mounted) {
        return (
            <section className="flex min-h-[calc(100vh-160px)] items-center justify-center bg-cream py-20">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-soft border-t-brand-deep" />
                    <p className="text-sm text-muted">Loading...</p>
                </div>
            </section>
        );
    }

    const isLoading = loading || isSubmitting;

    return (
        <section className="relative min-h-[calc(100vh-160px)] overflow-hidden bg-cream py-12 sm:py-16 lg:py-20">
            {/* Background decorations */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-[20%] -top-[30%] h-[600px] w-[600px] rounded-full bg-gradient-radial from-brand/6 to-transparent" />
                <div className="absolute -right-[20%] -bottom-[30%] h-[600px] w-[600px] rounded-full bg-gradient-radial from-brand/5 to-transparent" />
                {["left-[10%] top-[15%]", "right-[15%] top-[25%]", "bottom-[30%] left-[20%]", "right-[10%] bottom-[20%]"].map(
                    (pos, i) => (
                        <div
                            key={i}
                            className={`absolute h-2 w-2 rounded-full bg-brand/${i % 2 === 0 ? "20" : "15"} ${pos}`}
                        />
                    )
                )}
            </div>

            <div className="relative mx-auto max-w-[1180px] px-4 sm:px-6">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
                    {/* Login Form */}
                    <div className="flex items-center justify-center">
                        <div className="relative z-10 w-full max-w-md rounded-xl2 border border-line bg-card p-6 shadow-card sm:p-8">
                            <div className="mb-6 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft">
                                    <GraduationCap className="h-8 w-8 text-brand-deep" strokeWidth={2} />
                                </div>
                                <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                                    Welcome back, learner
                                </h1>
                                <p className="mt-2 text-sm font-medium text-muted">
                                    Sign in to track your progress, unlock modules and earn your
                                    certificates. Everything stays free.
                                </p>
                            </div>

                            {/* Form with React Hook Form */}
                            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                                <Field
                                    id="lfName"
                                    label="Your name"
                                    icon={User}
                                    type="text"
                                    placeholder="e.g. Amina Yusuf"
                                    register={register}
                                    error={errors.name?.message}
                                    field="name"
                                    focused={focused}
                                    setFocused={setFocused}
                                    showPassword={showPassword}
                                    setShowPassword={setShowPassword}
                                />

                                <Field
                                    id="lfEmail"
                                    label="Email"
                                    icon={Mail}
                                    type="email"
                                    placeholder="you@example.org"
                                    register={register}
                                    error={errors.email?.message}
                                    field="email"
                                    focused={focused}
                                    setFocused={setFocused}
                                    showPassword={showPassword}
                                    setShowPassword={setShowPassword}
                                />

                                <Field
                                    id="lfPass"
                                    label="Password"
                                    icon={Lock}
                                    type="password"
                                    placeholder="Anything you like this is a demo login"
                                    register={register}
                                    error={errors.password?.message}
                                    field="password"
                                    focused={focused}
                                    setFocused={setFocused}
                                    showPassword={showPassword}
                                    setShowPassword={setShowPassword}
                                />

                                <button
                                    className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-deep px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#241f6b] disabled:opacity-60 disabled:cursor-not-allowed"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        </>
                                    ) : (
                                        <>
                                            <LogIn className="h-4 w-4" strokeWidth={2.5} />
                                            Log in free
                                        </>
                                    )}
                                </button>

                                <div className="flex items-start gap-2 rounded-lg bg-brand-soft/50 p-3">
                                    <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-deep" strokeWidth={2} />
                                    <p className="text-xs text-ink-2">
                                        <span className="font-bold text-brand-deep">Demo sign-in:</span> No
                                        real account is created. Your name is only used on certificates.
                                    </p>
                                </div>

                                <div className="text-center text-xs text-muted">
                                    <span className="flex items-center justify-center gap-1">
                                        <Fingerprint className="h-3.5 w-3.5" strokeWidth={2} />
                                        No password required just sign in with any name and email
                                    </span>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar - Desktop */}
                    <div className="hidden lg:flex lg:items-center">
                        <div className="relative w-full overflow-hidden rounded-xl2 border border-line bg-card p-8 shadow-card-lg">
                            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-brand-soft/30" />
                            <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-brand-soft/20" />

                            <div className="relative">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="rounded-full bg-brand-soft p-2.5">
                                        <Rocket className="h-6 w-6 text-brand-deep" strokeWidth={2} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold tracking-tight text-ink">
                                            Two flagship programs
                                        </h2>
                                        <p className="text-sm text-muted">Twelve modules each</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {features.map((f, i) => (
                                        <div
                                            key={i}
                                            className="group rounded-lg border border-line-soft bg-cream-2/50 p-4 transition hover:border-brand/30 hover:bg-brand-soft/10"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`rounded-full ${f.bg} p-2`}>
                                                    <f.icon className={`h-4 w-4 ${f.color}`} strokeWidth={2} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-ink">{f.label}</h3>
                                                    <p className="text-sm text-muted">{f.desc}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 flex items-center gap-2 rounded-lg border border-accent-soft bg-accent-soft/30 p-3">
                                    <BadgeCheck className="h-5 w-5 text-accent-deep" strokeWidth={2} />
                                    <div>
                                        <p className="text-sm font-bold text-accent-deep">Free forever</p>
                                        <p className="text-xs text-muted">
                                            No paywalls, no hidden fees, no credit card
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Mobile */}
                    <div className="lg:hidden">
                        <div className="rounded-xl2 border border-line bg-card p-6 shadow-card">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-brand-soft p-2">
                                    <Rocket className="h-5 w-5 text-brand-deep" strokeWidth={2} />
                                </div>
                                <h2 className="text-lg font-bold text-ink">
                                    Two flagship programs, twelve modules each
                                </h2>
                            </div>
                            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {features.map((f, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-2 rounded-lg border border-line-soft bg-cream-2/50 p-3"
                                    >
                                        <div className={`rounded-full ${f.bg} p-1.5`}>
                                            <f.icon className={`h-3.5 w-3.5 ${f.color}`} strokeWidth={2} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-ink">{f.label}</p>
                                            <p className="text-xs text-muted">{f.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoginComp;