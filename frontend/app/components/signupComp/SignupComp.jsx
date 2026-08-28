// app/components/signupComp/SignupComp.jsx
"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import {
    AlertCircle,
    CheckCircle,
    Eye,
    EyeOff,
    Lock,
    Mail,
    Sparkles,
    Sprout,
    User,
    UserPlus,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import FooterLogo from "../../../public/assets/footerImages/Logo.webp";
import { signupSchema } from "../../validations/authValidation";
import GoogleLoginButton from "../googleLogin/GoogleLogin";
import { registerUser } from "../../store/slices/user/userThunks";
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
    isPassword = false,
}) => {
    return (
        <div>
            <label
                htmlFor={id}
                className="mb-1.5 flex items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-wide text-[#14301F]/55"
            >
                <Icon className="h-3.5 w-3.5 text-[#72BB83]" strokeWidth={2.5} />
                {label}
            </label>

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
                    type={isPassword && showPassword ? "text" : type}
                    placeholder={placeholder}
                    {...register(field)}
                    onFocus={() => setFocused(field)}
                    onBlur={() => setFocused(null)}
                    autoComplete={
                        isPassword
                            ? "new-password"
                            : type === "email"
                                ? "email"
                                : "name"
                    }
                    className={`w-full rounded-xl bg-transparent px-4 py-3 text-sm font-medium text-[#14301F] placeholder:text-[#14301F]/30 outline-none focus:outline-none focus:ring-0 ${isPassword ? "pr-12" : ""
                        }`}
                />

                {isPassword && (
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
                <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600">
                    <AlertCircle className="h-3 w-3" />
                    {error}
                </p>
            )}
        </div>
    );
};

// ============================================
// MAIN SIGNUP COMPONENT
// ============================================

const SignupComp = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();
    const { loading: authLoading, error, isAuthenticated, user } = useAppSelector(
        (state) => state.user
    );
    const next = searchParams.get("next") || "dashboard";

    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [focused, setFocused] = useState(null);
    const [mounted, setMounted] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
    } = useForm({
        resolver: yupResolver(signupSchema),
        defaultValues: {
            full_name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const password = watch("password");

    useEffect(() => {
        setMounted(true);
        if (typeof window !== "undefined") {
            const user = localStorage.getItem("efp.user");
            if (user) {
                router.push(next);
            }
        }
    }, [next, router]);

    useEffect(() => {
        if (isAuthenticated && user) {
            setTimeout(() => {
                router.push(next);
            }, 500);
        }
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [isAuthenticated, user, error, router, next, dispatch]);

    const onSubmit = async (data) => {
        const { confirmPassword, ...signupData } = data;
        const result = await dispatch(registerUser(signupData));

        if (result?.payload?.success) {
            setSignupSuccess(true);
            toast.success("Account created successfully! Please verify your email.");

            // Redirect to OTP verification with email
            const email = result.payload.email || data.email;
            router.push(`/verify-otp?email=${encodeURIComponent(email)}&from=signup`);
            reset();
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

    const isLoading = isSubmitting || authLoading;

    // password strength drives both the meter and the growth vine on the left panel
    const stage = !password
        ? 0
        : password.length >= 8
            ? 4
            : password.length >= 6
                ? 3
                : password.length >= 4
                    ? 2
                    : 1;
    const stageCopy = ["Plant a password to get started", "Sprouting", "Growing", "Blooming", "Flourishing"];
    const stageColor = ["#14301F1A", "#F0A93E", "#B8D98A", "#72BB83", "#14301F"];

    return (
        <section className="relative min-h-[calc(100vh-160px)] overflow-hidden bg-[#F8FBF6] py-10 sm:py-14 lg:py-16">
            {/* ambient dotted backdrop, echoes the homepage grid */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(20,48,31,0.07)_1px,transparent_1px)] bg-[length:24px_24px]" />
            <div className="pointer-events-none absolute -top-24 left-[8%] h-64 w-64 rounded-full bg-[#72BB83]/15 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 right-[6%] h-56 w-56 rounded-full bg-[#F0A93E]/10 blur-3xl" />

            <div className="relative mx-auto flex max-w-5xl items-stretch justify-center px-4 sm:px-6">
                <div className="fade-up grid w-full overflow-hidden rounded-[28px] border border-[#14301F]/10 bg-white shadow-[0_25px_70px_-20px_rgba(20,48,31,0.3)] lg:grid-cols-[1.05fr_1fr]">

                    {/* ========== LEFT: GROWTH PANEL (reacts to password strength) ========== */}
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
                                Plant the first seed of your financial future.
                            </h2>
                            <p className="mt-4 max-w-[30ch] text-sm font-medium text-white/55">
                                Your password grows the vine below — the stronger it is, the taller it climbs.
                            </p>
                        </div>

                        {/* growth vine, leaves appear as password strength increases */}
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
                                {[
                                    { cx: 128, cy: 195, r: 11, fill: "#F0A93E" },
                                    { cx: 84, cy: 135, r: 10, fill: "#B8D98A" },
                                    { cx: 132, cy: 78, r: 10, fill: "#72BB83" },
                                    { cx: 108, cy: 8, r: 7, fill: "#F8FBF6" },
                                ].map((leaf, i) => (
                                    <circle
                                        key={i}
                                        cx={leaf.cx}
                                        cy={leaf.cy}
                                        r={leaf.r}
                                        fill={leaf.fill}
                                        className="growth-leaf"
                                        style={{
                                            opacity: stage >= i + 1 ? 1 : 0,
                                            transform: stage >= i + 1 ? "scale(1)" : "scale(0)",
                                        }}
                                    />
                                ))}
                            </svg>

                            <div className="absolute left-0 top-2 flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2 backdrop-blur-sm">
                                <Sprout className="h-4 w-4 text-[#72BB83]" strokeWidth={2.5} />
                                <span className="text-xs font-bold transition-all duration-300">
                                    {stageCopy[stage]}
                                </span>
                            </div>
                        </div>

                        <p className="relative border-t border-white/10 pt-5 text-xs font-medium italic text-white/40">
                            Free forever — no card, no catch, just courses.
                        </p>
                    </div>

                    {/* ========== RIGHT: SIGNUP FORM ========== */}
                    <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12">
                        {/* Success Message */}
                        {signupSuccess && (
                            <div className="mb-6 flex items-center gap-3 rounded-xl border border-[#72BB83]/30 bg-[#72BB83]/10 p-4">
                                <CheckCircle className="h-5 w-5 flex-shrink-0 text-[#14301F]" />
                                <div>
                                    <p className="text-sm font-bold text-[#14301F]">
                                        Account created successfully!
                                    </p>
                                    <p className="text-xs font-medium text-[#14301F]/60">
                                        We've sent a verification email to your inbox. Please verify to get started.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="mb-7 text-center lg:text-left">
                            <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#14301F] ring-4 ring-[#72BB83]/15 ring-offset-2 ring-offset-white lg:mx-0">
                                <Image src={FooterLogo} alt="The Eco Lens" className="h-8 w-8 object-contain" />
                            </div>
                            <h1 className="text-[1.7rem] font-extrabold tracking-tight text-[#14301F] sm:text-[1.8rem]">
                                Create your account
                            </h1>
                            <p className="mt-2 text-sm font-medium text-[#14301F]/55">
                                Join thousands of learners. Start your financial education journey today.
                                It's completely free!
                            </p>
                        </div>

                        {/* Google Sign-up — logic untouched, only the surrounding frame is restyled */}
                        <div className="mb-5 [&_button]:!rounded-xl [&_button]:!border-2 [&_button]:!border-[#14301F]/10 [&_button]:!py-3 [&_button]:!font-bold [&_button]:!transition-all [&_button]:hover:!border-[#72BB83]/40 [&_button]:hover:!bg-[#72BB83]/[0.06]">
                            <GoogleLoginButton
                                isLoading={isGoogleLoading}
                                setIsLoading={setIsGoogleLoading}
                                isSignup={true}
                            />
                        </div>

                        {/* Divider */}
                        <div className="mb-6 flex items-center gap-3">
                            <div className="h-px flex-1 bg-[#14301F]/10" />
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#14301F]/35">
                                or sign up with email
                            </span>
                            <div className="h-px flex-1 bg-[#14301F]/10" />
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                            <Field
                                id="sfFullName"
                                label="Full Name"
                                icon={User}
                                type="text"
                                placeholder="John Doe"
                                register={register}
                                error={errors.full_name?.message}
                                field="full_name"
                                focused={focused}
                                setFocused={setFocused}
                                showPassword={showPassword}
                                setShowPassword={setShowPassword}
                            />

                            <Field
                                id="sfEmail"
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
                                id="sfPassword"
                                label="Password"
                                icon={Lock}
                                type="password"
                                placeholder="Minimum 8 characters"
                                register={register}
                                error={errors.password?.message}
                                field="password"
                                focused={focused}
                                setFocused={setFocused}
                                showPassword={showPassword}
                                setShowPassword={setShowPassword}
                                isPassword={true}
                            />

                            <Field
                                id="sfConfirmPassword"
                                label="Confirm Password"
                                icon={Lock}
                                type="password"
                                placeholder="Confirm your password"
                                register={register}
                                error={errors.confirmPassword?.message}
                                field="confirmPassword"
                                focused={focused}
                                setFocused={setFocused}
                                showPassword={showConfirmPassword}
                                setShowPassword={setShowConfirmPassword}
                                isPassword={true}
                            />

                            {/* Password Strength Indicator — segmented, on-brand */}
                            {password && password.length > 0 && (
                                <div className="space-y-1.5">
                                    <div className="flex gap-1.5">
                                        {[0, 1, 2, 3].map((i) => (
                                            <div
                                                key={i}
                                                className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#14301F]/10"
                                            >
                                                <div
                                                    className="h-full rounded-full transition-all duration-300"
                                                    style={{
                                                        width: stage > i ? "100%" : "0%",
                                                        backgroundColor: stageColor[stage],
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <p className="flex items-center gap-1.5 text-xs font-semibold text-[#14301F]/60">
                                        <Sprout className="h-3.5 w-3.5 text-[#72BB83]" />
                                        {stageCopy[stage]}
                                        {stage < 4 ? " — keep going" : " — great password"}
                                    </p>
                                </div>
                            )}

                            <button
                                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#14301F] px-6 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[#0d2015] hover:shadow-lg hover:shadow-[#14301F]/25 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                                type="submit"
                                disabled={isLoading || isGoogleLoading || signupSuccess}
                            >
                                {isLoading ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : (
                                    <>
                                        <UserPlus className="h-4 w-4" strokeWidth={2.5} />
                                        Create Account
                                    </>
                                )}
                            </button>

                            <p className="text-center text-sm text-[#14301F]/55">
                                Already have an account?{" "}
                                <a
                                    href="/login"
                                    className="font-bold text-[#72BB83] transition-colors hover:text-[#5aa86e]"
                                >
                                    Sign in here
                                </a>
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
                .growth-leaf {
                    transform-origin: center;
                    transition: opacity 0.4s ease-out, transform 0.4s ease-out;
                }
                @keyframes fade-up {
                    from { opacity: 0; transform: translateY(14px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes draw-vine {
                    to { stroke-dashoffset: 0; }
                }
                @media (prefers-reduced-motion: reduce) {
                    .fade-up, .vine-path {
                        animation: none !important;
                        opacity: 1 !important;
                        stroke-dashoffset: 0 !important;
                        transform: none !important;
                    }
                    .growth-leaf {
                        transition: none !important;
                    }
                }
            `}</style>
        </section>
    );
};

export default SignupComp;