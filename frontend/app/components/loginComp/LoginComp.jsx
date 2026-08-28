// app/components/loginComp/LoginComp.jsx
"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import {
    Eye,
    EyeOff,
    Lock,
    LogIn,
    Mail,
    User
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import FooterLogo from "../../../public/assets/footerImages/Logo.webp";
import googlelogo from "../../../public/assets/loginPageImage/googleLogo.webp";
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
                    className="flex items-center gap-2 text-sm font-bold text-[#14301F]/75"
                >
                    <Icon className="h-4 w-4 text-[#72BB83]" strokeWidth={2} />
                    {label}
                </label>
            </div>

            <div
                className={`relative rounded-lg border bg-[#14301F]/[0.02] transition-all duration-200 ${error
                    ? "border-rose-500 ring-4 ring-rose-500/15"
                    : focused === field
                        ? "border-[#72BB83] ring-4 ring-[#72BB83]/15"
                        : "border-[#14301F]/15"
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
                    className={`w-full rounded-lg bg-transparent px-4 py-2.5 text-sm font-medium text-[#14301F] placeholder:text-[#14301F]/35 outline-none focus:outline-none focus:ring-0 ${type === "password" ? "pr-12" : ""
                        }`}
                />

                {type === "password" && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#14301F]/35 transition-colors hover:text-[#14301F]/70"
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
    const next = searchParams.get("next") || "dashboard";

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
        const { email, password } = data;
        try {
            const result = await dispatch(loginUser({ email, password })).unwrap();
            if (result?.access_token) {
                // Reset form
                reset();

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
        <section className="relative min-h-[calc(100vh-160px)] overflow-hidden bg-white py-12 sm:py-16 lg:py-20">
            <div className="relative mx-6 flex items-center justify-center px-4 sm:px-6">
                {/* ========== RIGHT: LOGIN FORM ========== */}
                <div className="flex items-center justify-center">
                    <div className="relative z-10 w-full max-w-md rounded-2xl border border-[#14301F]/10 bg-white p-6 shadow-lg sm:p-8">
                        <div className="mb-6 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#14301F]">
                                <Image src={FooterLogo} alt="Logo" className="h-9 w-9 object-contain" />
                            </div>
                            <h1 className="text-2xl font-extrabold tracking-tight text-[#14301F] sm:text-[1.7rem]">
                                Welcome back, learner
                            </h1>
                            <p className="mt-2 text-sm font-medium text-[#14301F]/55">
                                Sign in to track your progress, unlock modules and earn your
                                certificates. Everything stays free.
                            </p>
                        </div>

                        {/* Google Sign-in */}
                        <div className="mb-4">
                            <GoogleLoginButton
                                isLoading={isGoogleLoading}
                                setIsLoading={setIsGoogleLoading}
                            />
                        </div>

                        {/* Divider */}
                        <div className="my-5 flex items-center gap-3">
                            <div className="h-px flex-1 bg-[#14301F]/10" />
                            <span className="text-xs font-bold uppercase tracking-wide text-[#14301F]/35">
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
                                placeholder="Anything you like this is a demo login"
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
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#14301F] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0d2015] disabled:cursor-not-allowed disabled:opacity-60"
                                type="submit"
                                disabled={isLoading || isGoogleLoading}
                            >
                                {isLoading ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : (
                                    <>
                                        <LogIn className="h-4 w-4" strokeWidth={2.5} />
                                        Log in free
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
        </section>
    );
};

export default LoginComp;