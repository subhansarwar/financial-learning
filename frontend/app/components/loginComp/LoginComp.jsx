// app/components/loginComp/LoginComp.jsx
"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import {
    ArrowRight,
    Eye,
    EyeOff,
    Leaf,
    Lock,
    Mail,
    Sparkles,
    TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import FooterLogo from "../../../public/assets/footerImages/Logo.webp";
import { loginSchema } from "../../validations/authValidation";
import GoogleLoginButton from "../googleLogin/GoogleLogin";
import { loginUser } from "../../store/slices/user/userThunks";
import { clearError } from "../../store/slices/user/userSlice";

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
    bottomSlot,
}) => {
    return (
        <div>
            <div className="mb-1.5 flex items-center justify-between">
                <label
                    htmlFor={id}
                    className="flex items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-wide text-[#14301F]/55"
                >
                    <Icon className="h-3.5 w-3.5 text-[#72BB83]" strokeWidth={2.5} />
                    {label}
                </label>
            </div>

            <div
                className={`relative rounded-xl border-2 bg-[#14301F]/[0.02] transition-all duration-200 ${error
                    ? "border-rose-500 ring-4 ring-rose-500/10"
                    : focused === field
                        ? "border-[#72BB83] bg-white shadow-[0_0_0_4px_rgba(114,187,131,0.15)]"
                        : "border-[#14301F]/10 hover:border-[#14301F]/20"
                    }`}
            >
                <input
                    id={id}
                    type={type === "password" && showPassword ? "text" : type}
                    placeholder={placeholder}
                    {...register(field)}
                    onFocus={() => setFocused(field)}
                    onBlur={() => setFocused(null)}
                    autoComplete={type === "password" ? "current-password" : "email"}
                    className={`w-full rounded-xl bg-transparent px-4 py-3 text-sm font-medium text-[#14301F] placeholder:text-[#14301F]/30 outline-none focus:outline-none focus:ring-0 ${type === "password" ? "pr-12" : ""
                        }`}
                />

                {type === "password" && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#14301F]/35 transition-colors hover:text-[#72BB83]"
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
            {bottomSlot && <div className="mt-2 text-right">{bottomSlot}</div>}
        </div>
    );
};

// ============================================
// MAIN LOGIN COMPONENT
// ============================================

const LoginComp = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();
    const { loading: authLoading, error, isAuthenticated, user } = useAppSelector(
        (state) => state.user
    );
    const next = searchParams.get("next") || "/";

    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState(null);
    const [mounted, setMounted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        setMounted(true);
        if (typeof window !== "undefined") {
            const user = localStorage.getItem("efp.user");
            if (user) {
                router.push("/");
            }
        }
    }, [next, router]);

    useEffect(() => {
        if (isAuthenticated && user) {
            setTimeout(() => {
                router.push("/");
            }, 500);
        }
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [isAuthenticated, user, error, router, next, dispatch]);

    const onSubmit = async (data) => {
        const { email, password } = data;
        try {
            const result = await dispatch(loginUser({ email, password })).unwrap();
            if (result?.access_token) {
                // Reset form
                reset();
                setTimeout(() => {
                    router.push('/');
                }, 500);
                // Redirect to dashboard
                setTimeout(() => {
                    router.push(next);
                }, 500);
            }
        } catch (error) {
            // Error is already handled in thunk
            console.error("Login error:", error);
        }
    };

    if (!mounted) {
        return (
            <section className="flex min-h-[calc(100vh-160px)] items-center justify-center bg-white py-20">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#72BB83]/20 border-t-[#72BB83]" />
                </div>
            </section>
        );
    }

    const isLoading = isSubmitting;

    return (
        <section className="relative min-h-[calc(100vh-160px)] overflow-hidden bg-[#F8FBF6] py-10 sm:py-14 lg:py-16">
            {/* ambient dotted backdrop, echoes the homepage grid */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(20,48,31,0.07)_1px,transparent_1px)] bg-[length:24px_24px]" />
            <div className="pointer-events-none absolute -top-24 right-[8%] h-64 w-64 rounded-full bg-[#72BB83]/15 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-[6%] h-56 w-56 rounded-full bg-[#F0A93E]/10 blur-3xl" />

            <div className="relative mx-auto flex max-w-5xl items-stretch justify-center px-4 sm:px-6">
                <div className="fade-up grid w-full overflow-hidden rounded-[28px] border border-[#14301F]/10 bg-white shadow-[0_25px_70px_-20px_rgba(20,48,31,0.3)] lg:grid-cols-[1.05fr_1fr]">

                    {/* ========== LEFT: GROWTH PANEL ========== */}
                    <div className="relative hidden flex-col justify-between overflow-hidden bg-[#14301F] p-10 text-white lg:flex">
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[length:22px_22px]" />
                        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#72BB83]/20 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-[#F0A93E]/10 blur-3xl" />

                        <div className="relative">
                            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white/70">
                                <Sparkles className="h-3.5 w-3.5 text-[#F0A93E]" strokeWidth={2.5} />
                                The Eco Lens
                            </div>
                            <h2 className="max-w-[19ch] text-[1.9rem] font-extrabold leading-[1.15] tracking-tight">
                                Grow your money knowledge, one lesson at a time.
                            </h2>
                            <p className="mt-4 max-w-[30ch] text-sm font-medium text-white/55">
                                Sign back in to pick up your courses right where you left off.
                            </p>
                        </div>

                        {/* growth vine illustration */}
                        <div className="relative my-6 flex-1">
                            <svg viewBox="0 0 220 260" className="mx-auto h-full max-h-[230px] w-auto" fill="none">
                                <path
                                    className="vine-path"
                                    d="M110 250 C 68 212, 152 182, 110 150 C 68 118, 152 90, 110 60 C 80 36, 122 20, 108 8"
                                    stroke="rgba(255,255,255,0.35)"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    pathLength="1"
                                />
                                <circle cx="128" cy="195" r="11" fill="#72BB83" className="leaf-node" style={{ animationDelay: "0.5s" }} />
                                <circle cx="84" cy="135" r="9" fill="#F0A93E" className="leaf-node" style={{ animationDelay: "0.85s" }} />
                                <circle cx="132" cy="78" r="10" fill="#9FD6AC" className="leaf-node" style={{ animationDelay: "1.15s" }} />
                                <circle cx="108" cy="8" r="6" fill="#F8FBF6" className="leaf-node" style={{ animationDelay: "1.4s" }} />
                            </svg>

                            <div className="badge-float absolute left-0 top-2 flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2 backdrop-blur-sm" style={{ animationDelay: "0.3s" }}>
                                <TrendingUp className="h-4 w-4 text-[#72BB83]" strokeWidth={2.5} />
                                <span className="text-xs font-bold">Progress saved</span>
                            </div>
                            <div className="badge-float absolute bottom-0 right-0 flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2 backdrop-blur-sm" style={{ animationDelay: "0.7s" }}>
                                <Leaf className="h-4 w-4 text-[#F0A93E]" strokeWidth={2.5} />
                                <span className="text-xs font-bold">12,400+ learners</span>
                            </div>
                        </div>

                        <p className="relative border-t border-white/10 pt-5 text-xs font-medium italic text-white/40">
                            Small, consistent lessons compound just like good habits.
                        </p>
                    </div>

                    {/* ========== RIGHT: LOGIN FORM ========== */}
                    <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12">
                        <div className="mb-7 text-center lg:text-left">
                            {/* <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#14301F] ring-4 ring-[#72BB83]/15 ring-offset-2 ring-offset-white lg:mx-0">
                                <Image src={FooterLogo} alt="The Eco Lens" className="h-8 w-8 object-contain" />
                            </div> */}
                            <h1 className="text-[1.7rem] font-extrabold tracking-tight text-[#14301F] sm:text-[1.8rem]">
                                Welcome back, learner
                            </h1>
                            <p className="mt-2 text-sm font-medium text-[#14301F]/55">
                                Sign in to track your progress, unlock modules and earn your
                                certificates. Everything stays free.
                            </p>
                        </div>

                        {/* Google Sign-in — logic untouched, only the surrounding frame is restyled */}
                        <div className="mb-5 [&_button]:!rounded-xl [&_button]:!border-2 [&_button]:!border-[#14301F]/10 [&_button]:!py-3 [&_button]:!font-bold [&_button]:!transition-all [&_button]:hover:!border-[#72BB83]/40 [&_button]:hover:!bg-[#72BB83]/[0.06]">
                            <GoogleLoginButton
                                isLoading={isGoogleLoading}
                                setIsLoading={setIsGoogleLoading}
                            />
                        </div>

                        {/* Divider */}
                        <div className="mb-6 flex items-center gap-3">
                            <div className="h-px flex-1 bg-[#14301F]/10" />
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#14301F]/35">
                                or continue with email
                            </span>
                            <div className="h-px flex-1 bg-[#14301F]/10" />
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
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
                                placeholder="Anything you like, this is a demo login"
                                register={register}
                                error={errors.password?.message}
                                field="password"
                                focused={focused}
                                setFocused={setFocused}
                                showPassword={showPassword}
                                setShowPassword={setShowPassword}
                                bottomSlot={
                                    <button
                                        type="button"
                                        onClick={() => router.push("/forgot-password")}
                                        className="text-sm font-semibold text-[#72BB83] transition-colors hover:text-[#5aa86e]"
                                    >
                                        Forgot password?
                                    </button>
                                }
                            />

                            <button
                                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#14301F] px-6 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[#0d2015] hover:shadow-lg hover:shadow-[#14301F]/25 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                                type="submit"
                                disabled={isLoading || isGoogleLoading}
                            >
                                {isLoading ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : (
                                    <>
                                        Log in free
                                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.5} />
                                    </>
                                )}
                            </button>
                            <p className="text-center text-sm font-medium text-[#14301F]/55">
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => router.push("/signup")}
                                    className="font-bold text-[#72BB83] transition-colors hover:text-[#5aa86e]"
                                >
                                    Register
                                </button>
                            </p>
                        </form>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .fade-up {
                    animation: fade-up 0.5s ease-out both;
                }
                .vine-path {
                    stroke-dasharray: 1;
                    stroke-dashoffset: 1;
                    animation: draw-vine 1.6s ease-out 0.2s forwards;
                }
                .leaf-node {
                    opacity: 0;
                    transform-origin: center;
                    animation: pop-leaf 0.5s ease-out forwards;
                }
                .badge-float {
                    opacity: 0;
                    animation: badge-in 0.6s ease-out forwards, drift 4.5s ease-in-out infinite 1.2s;
                }
                @keyframes fade-up {
                    from { opacity: 0; transform: translateY(14px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes draw-vine {
                    to { stroke-dashoffset: 0; }
                }
                @keyframes pop-leaf {
                    0% { opacity: 0; transform: scale(0); }
                    70% { opacity: 1; transform: scale(1.15); }
                    100% { opacity: 1; transform: scale(1); }
                }
                @keyframes badge-in {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes drift {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-6px); }
                }
                @media (prefers-reduced-motion: reduce) {
                    .fade-up, .vine-path, .leaf-node, .badge-float {
                        animation: none !important;
                        opacity: 1 !important;
                        stroke-dashoffset: 0 !important;
                        transform: none !important;
                    }
                }
            `}</style>
        </section>
    );
};

export default LoginComp;