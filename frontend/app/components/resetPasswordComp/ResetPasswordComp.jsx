// app/components/loginComp/ResetPasswordComp.jsx
"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound, Lock, Mail, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import FooterLogo from "../../../public/assets/footerImages/Logo.webp";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { resetPassword } from "../../store/slices/user/userThunks";
import { clearError } from "../../store/slices/user/userSlice";
import { resetPasswordSchema } from "../../validations/authValidation";

const strengthLabel = (pwd = "") => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { label: "Weak", width: "25%", color: "bg-rose-500" };
    if (score === 2) return { label: "Fair", width: "50%", color: "bg-amber-500" };
    if (score === 3) return { label: "Good", width: "75%", color: "bg-[#72BB83]" };
    return { label: "Strong", width: "100%", color: "bg-[#14301F]" };
};

const ResetPasswordComp = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.user);

    const emailFromQuery = searchParams.get("email") || "";
    const codeFromQuery = searchParams.get("code") || "";

    const [focused, setFocused] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: yupResolver(resetPasswordSchema),
        defaultValues: {
            email: emailFromQuery,
            code: codeFromQuery,
            new_password: "",
            confirm_password: ""
        },
    });

    const pwdValue = watch("new_password");
    const strength = strengthLabel(pwdValue);

    // Clear error when component unmounts
    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    // Handle error from Redux
    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const onSubmit = async (data) => {
        try {
            const result = await dispatch(resetPassword({
                email: data.email.trim(),
                code: data.code.trim(),
                new_password: data.new_password,
            })).unwrap();

            if (result?.success) {
                setSuccess(true);
                reset();

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    router.push("/login");
                }, 3000);
            }
        } catch (error) {
            // Error is already handled in thunk
            console.error("Reset password error:", error);
        }
    };

    return (
        <section className="relative min-h-screen overflow-hidden bg-white">
            <div className="mx-6 flex min-h-screen items-center justify-center px-4 sm:px-6">
                <div className="relative z-10 w-full max-w-md rounded-2xl border border-[#14301F]/10 bg-white p-6 shadow-lg sm:p-8">
                    {!success ? (
                        <>
                            {/* Back button */}
                            <button
                                onClick={() => router.push("/login")}
                                className="group mb-4 flex items-center gap-1.5 text-sm font-medium text-[#14301F]/55 transition-colors hover:text-[#14301F]"
                            >
                                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" strokeWidth={2} />                            </button>

                            {/* Header */}
                            <div className="mb-6 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#14301F]">
                                    <Image src={FooterLogo} alt="Logo" className="h-9 w-9 object-contain" />
                                </div>
                                <h1 className="text-2xl font-extrabold tracking-tight text-[#14301F] sm:text-[1.7rem]">
                                    Reset your password
                                </h1>
                                <p className="mt-2 text-sm font-medium text-[#14301F]/55">
                                    Enter the code we sent you and choose a new password.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                                {/* Email Field */}
                                <div>
                                    <label htmlFor="rpEmail" className="mb-1.5 flex items-center gap-2 text-sm font-bold text-[#14301F]/75">
                                        <Mail className="h-4 w-4 text-[#72BB83]" strokeWidth={2} />
                                        Email
                                    </label>
                                    <div
                                        className={`relative rounded-lg border bg-[#14301F]/[0.02] transition-all duration-200 ${errors.email
                                            ? "border-rose-500 ring-4 ring-rose-500/15"
                                            : focused === "email"
                                                ? "border-[#72BB83] ring-4 ring-[#72BB83]/15"
                                                : "border-[#14301F]/15"
                                            }`}
                                    >
                                        <input
                                            id="rpEmail"
                                            type="email"
                                            placeholder="you@example.org"
                                            {...register("email")}
                                            onFocus={() => setFocused("email")}
                                            onBlur={() => setFocused(null)}
                                            autoComplete="email"
                                            className="w-full rounded-lg bg-transparent px-4 py-2.5 text-sm font-medium text-[#14301F] placeholder:text-[#14301F]/35 outline-none focus:outline-none focus:ring-0"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1.5 text-xs font-medium text-rose-600">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                {/* Code Field */}
                                <div>
                                    <label htmlFor="rpCode" className="mb-1.5 flex items-center gap-2 text-sm font-bold text-[#14301F]/75">
                                        <KeyRound className="h-4 w-4 text-[#72BB83]" strokeWidth={2} />
                                        Verification code
                                    </label>
                                    <div
                                        className={`relative rounded-lg border bg-[#14301F]/[0.02] transition-all duration-200 ${errors.code
                                            ? "border-rose-500 ring-4 ring-rose-500/15"
                                            : focused === "code"
                                                ? "border-[#72BB83] ring-4 ring-[#72BB83]/15"
                                                : "border-[#14301F]/15"
                                            }`}
                                    >
                                        <input
                                            id="rpCode"
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="Enter the 6-digit code"
                                            {...register("code")}
                                            onFocus={() => setFocused("code")}
                                            onBlur={() => setFocused(null)}
                                            className="w-full rounded-lg bg-transparent px-4 py-2.5 text-sm font-medium tracking-widest text-[#14301F] placeholder:text-[#14301F]/35 placeholder:tracking-normal outline-none focus:outline-none focus:ring-0"
                                        />
                                    </div>
                                    {errors.code && (
                                        <p className="mt-1.5 text-xs font-medium text-rose-600">
                                            {errors.code.message}
                                        </p>
                                    )}
                                </div>

                                {/* New Password Field */}
                                <div>
                                    <label htmlFor="rpNewPass" className="mb-1.5 flex items-center gap-2 text-sm font-bold text-[#14301F]/75">
                                        <Lock className="h-4 w-4 text-[#72BB83]" strokeWidth={2} />
                                        New password
                                    </label>
                                    <div
                                        className={`relative rounded-lg border bg-[#14301F]/[0.02] transition-all duration-200 ${errors.new_password
                                            ? "border-rose-500 ring-4 ring-rose-500/15"
                                            : focused === "new_password"
                                                ? "border-[#72BB83] ring-4 ring-[#72BB83]/15"
                                                : "border-[#14301F]/15"
                                            }`}
                                    >
                                        <input
                                            id="rpNewPass"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="At least 8 characters"
                                            {...register("new_password")}
                                            onFocus={() => setFocused("new_password")}
                                            onBlur={() => setFocused(null)}
                                            autoComplete="new-password"
                                            className="w-full rounded-lg bg-transparent px-4 py-2.5 pr-12 text-sm font-medium text-[#14301F] placeholder:text-[#14301F]/35 outline-none focus:outline-none focus:ring-0"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((p) => !p)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#14301F]/35 transition-colors hover:text-[#14301F]/70"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" strokeWidth={2} />
                                            ) : (
                                                <Eye className="h-4 w-4" strokeWidth={2} />
                                            )}
                                        </button>
                                    </div>

                                    {/* Password Strength Indicator */}
                                    {pwdValue && (
                                        <div className="mt-2">
                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#14301F]/[0.08]">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                                                    style={{ width: strength.width }}
                                                />
                                            </div>
                                            <p className="mt-1 text-xs font-medium text-[#14301F]/45">
                                                {strength.label} password
                                            </p>
                                        </div>
                                    )}
                                    {errors.new_password && (
                                        <p className="mt-1.5 text-xs font-medium text-rose-600">
                                            {errors.new_password.message}
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password Field */}
                                <div>
                                    <label htmlFor="rpConfirmPass" className="mb-1.5 flex items-center gap-2 text-sm font-bold text-[#14301F]/75">
                                        <ShieldCheck className="h-4 w-4 text-[#72BB83]" strokeWidth={2} />
                                        Confirm new password
                                    </label>
                                    <div
                                        className={`relative rounded-lg border bg-[#14301F]/[0.02] transition-all duration-200 ${errors.confirm_password
                                            ? "border-rose-500 ring-4 ring-rose-500/15"
                                            : focused === "confirm_password"
                                                ? "border-[#72BB83] ring-4 ring-[#72BB83]/15"
                                                : "border-[#14301F]/15"
                                            }`}
                                    >
                                        <input
                                            id="rpConfirmPass"
                                            type={showConfirm ? "text" : "password"}
                                            placeholder="Re-enter your new password"
                                            {...register("confirm_password")}
                                            onFocus={() => setFocused("confirm_password")}
                                            onBlur={() => setFocused(null)}
                                            autoComplete="new-password"
                                            className="w-full rounded-lg bg-transparent px-4 py-2.5 pr-12 text-sm font-medium text-[#14301F] placeholder:text-[#14301F]/35 outline-none focus:outline-none focus:ring-0"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm((p) => !p)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#14301F]/35 transition-colors hover:text-[#14301F]/70"
                                            aria-label={showConfirm ? "Hide password" : "Show password"}
                                        >
                                            {showConfirm ? (
                                                <EyeOff className="h-4 w-4" strokeWidth={2} />
                                            ) : (
                                                <Eye className="h-4 w-4" strokeWidth={2} />
                                            )}
                                        </button>
                                    </div>
                                    {errors.confirm_password && (
                                        <p className="mt-1.5 text-xs font-medium text-rose-600">
                                            {errors.confirm_password.message}
                                        </p>
                                    )}
                                </div>

                                <button
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#14301F] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0d2015] disabled:cursor-not-allowed disabled:opacity-60"
                                    type="submit"
                                    disabled={isSubmitting || loading}
                                >
                                    {isSubmitting || loading ? (
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    ) : (
                                        <>
                                            <Lock className="h-4 w-4" strokeWidth={2.5} />
                                            Reset password
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        // Success State
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#72BB83]/10 ring-1 ring-inset ring-[#72BB83]/20">
                                <CheckCircle2 className="h-8 w-8 text-[#72BB83]" strokeWidth={2} />
                            </div>
                            <h1 className="text-xl font-extrabold tracking-tight text-[#14301F] sm:text-2xl">
                                Password reset successful!
                            </h1>
                            <p className="mt-2 text-sm font-medium text-[#14301F]/55">
                                Your password has been updated. You can now log in with your new password.
                            </p>

                            <div className="mt-6 rounded-lg border-l-[3px] border-[#72BB83] bg-[#72BB83]/[0.07] p-3.5 text-left">
                                <div className="flex items-start gap-2">
                                    <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#72BB83]" strokeWidth={2} />
                                    <p className="text-sm text-[#14301F]/70">
                                        You will be redirected to login in a few seconds.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => router.push("/login")}
                                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#14301F] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0d2015]"
                            >
                                Go to login
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ResetPasswordComp;