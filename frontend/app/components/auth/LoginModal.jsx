// app/components/auth/LoginModal.jsx
"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowRight,
    Eye,
    EyeOff,
    Leaf,
    Lock,
    Mail,
    X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearError } from "../../store/slices/user/userSlice";
import { loginUser } from "../../store/slices/user/userThunks";
import { loginSchema } from "../../validations/authValidation";
import GoogleLoginButton from "../googleLogin/GoogleLogin";

export default function LoginModal({ isOpen, onClose, redirectPath }) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { loading: authLoading, error } = useAppSelector((state) => state.user);
    const [mounted, setMounted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState(null);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
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
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // useEffect(() => {
    //     if (error) {
    //         toast.error(error);
    //         dispatch(clearError());
    //     }
    // }, [error, dispatch]);

    if (!mounted) return null;

    const onSubmit = async (data) => {
        const { email, password } = data;
        setIsSubmitting(true);
        try {
            const result = await dispatch(loginUser({ email, password })).unwrap();
            if (result?.access_token) {
                reset();
                onClose();
                // Redirect to the page user was on or dashboard
                if (redirectPath) {
                    router.push(redirectPath);
                } else {
                    router.refresh(); // Refresh current page
                }
            }
        } catch (error) {
            // Error is already handled in thunk
            // console.error("Login error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSignupClick = () => {
        onClose();
        router.push('/signup');
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    const isLoading = isSubmitting || authLoading || isGoogleLoading;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-[#14301F]/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 300
                        }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={handleBackdropClick}
                    >
                        <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">

                            {/* Header */}
                            <div className="relative bg-gradient-to-br from-[#14301F] to-[#1a3d2a] px-6 py-6 text-center">
                                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:20px_20px]" />
                                <div className="relative">
                                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
                                        <Leaf className="h-7 w-7 text-[#72BB83]" strokeWidth={2} />
                                    </div>
                                    <h2 className="text-xl font-extrabold text-white">
                                        Welcome Back
                                    </h2>
                                    <p className="mt-1.5 text-sm font-medium text-white/60">
                                        Sign in to continue your learning journey
                                    </p>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="px-6 py-6">
                                {/* Google Login */}
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

                                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                                    {/* Email Field */}
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="mb-1.5 flex items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-wide text-[#14301F]/55"
                                        >
                                            <Mail className="h-3.5 w-3.5 text-[#72BB83]" strokeWidth={2.5} />
                                            Email
                                        </label>
                                        <div
                                            className={`relative rounded-xl border-2 bg-[#14301F]/[0.02] transition-all duration-200 ${errors.email
                                                ? "border-rose-500 ring-4 ring-rose-500/10"
                                                : focused === "email"
                                                    ? "border-[#72BB83] bg-white shadow-[0_0_0_4px_rgba(114,187,131,0.15)]"
                                                    : "border-[#14301F]/10 hover:border-[#14301F]/20"
                                                }`}
                                        >
                                            <input
                                                id="email"
                                                type="email"
                                                placeholder="you@example.org"
                                                {...register("email")}
                                                onFocus={() => setFocused("email")}
                                                onBlur={() => setFocused(null)}
                                                className="w-full rounded-xl bg-transparent px-4 py-3 text-sm font-medium text-[#14301F] placeholder:text-[#14301F]/30 outline-none focus:outline-none focus:ring-0"
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="mt-1.5 text-xs font-medium text-rose-600">
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Password Field */}
                                    <div>
                                        <div className="mb-1.5 flex items-center justify-between">
                                            <label
                                                htmlFor="password"
                                                className="flex items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-wide text-[#14301F]/55"
                                            >
                                                <Lock className="h-3.5 w-3.5 text-[#72BB83]" strokeWidth={2.5} />
                                                Password
                                            </label>
                                        </div>
                                        <div
                                            className={`relative rounded-xl border-2 bg-[#14301F]/[0.02] transition-all duration-200 ${errors.password
                                                ? "border-rose-500 ring-4 ring-rose-500/10"
                                                : focused === "password"
                                                    ? "border-[#72BB83] bg-white shadow-[0_0_0_4px_rgba(114,187,131,0.15)]"
                                                    : "border-[#14301F]/10 hover:border-[#14301F]/20"
                                                }`}
                                        >
                                            <input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter your password"
                                                {...register("password")}
                                                onFocus={() => setFocused("password")}
                                                onBlur={() => setFocused(null)}
                                                className="w-full rounded-xl bg-transparent px-4 py-3 text-sm font-medium text-[#14301F] placeholder:text-[#14301F]/30 outline-none focus:outline-none focus:ring-0 pr-12"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#14301F]/35 transition-colors hover:text-[#72BB83]"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" strokeWidth={2} />
                                                ) : (
                                                    <Eye className="h-4 w-4" strokeWidth={2} />
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="mt-1.5 text-xs font-medium text-rose-600">
                                                {errors.password.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Forgot Password Link */}
                                    <div className="text-right">
                                        <button
                                            type="button"
                                            className="text-sm font-semibold text-[#72BB83] transition-colors hover:text-[#5aa86e]"
                                            onClick={() => {
                                                onClose();
                                                router.push('/forgot-password');
                                            }}
                                        >
                                            Forgot password?
                                        </button>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#14301F] px-6 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[#0d2015] hover:shadow-lg hover:shadow-[#14301F]/25 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {isLoading ? (
                                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        ) : (
                                            <>
                                                Log In
                                                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                                            </>
                                        )}
                                    </button>

                                    {/* Signup Link */}
                                    <p className="text-center text-sm font-medium text-[#14301F]/55">
                                        Don't have an account?{" "}
                                        <button
                                            type="button"
                                            onClick={handleSignupClick}
                                            className="font-bold text-[#72BB83] transition-colors hover:text-[#5aa86e]"
                                        >
                                            Sign Up
                                        </button>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}