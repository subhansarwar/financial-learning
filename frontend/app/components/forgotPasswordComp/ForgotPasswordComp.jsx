// app/components/loginComp/ForgotPasswordComp.jsx
"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeft, CheckCircle2, KeyRound, Mail, Send } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import FooterLogo from "../../../public/assets/footerImages/Logo.webp";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { forgotPassword } from "../../store/slices/user/userThunks";
import { clearError } from "../../store/slices/user/userSlice";
import { forgotPasswordSchema } from "../../validations/authValidation";

const ForgotPasswordComp = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.user);

    const [focused, setFocused] = useState(false);
    const [sent, setSent] = useState(false);
    const [sentTo, setSentTo] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: yupResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    });

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
            const result = await dispatch(forgotPassword({ email: data.email })).unwrap();

            if (result?.success) {
                setSentTo(data.email.trim());
                setSent(true);
                reset();

                // Redirect to reset-password after 2 seconds
                setTimeout(() => {
                    router.push(`/reset-password?email=${encodeURIComponent(data.email)}&from=forgot-password`);
                }, 2000);
            }
        } catch (error) {
            // Error is already handled in thunk
            console.error("Forgot password error:", error);
        }
    };

    return (
        <section className="relative min-h-screen overflow-hidden bg-white">
            <div className="mx-6 flex min-h-screen items-center justify-center px-4 sm:px-6">
                <div className="relative z-10 w-full max-w-md rounded-2xl border border-[#14301F]/10 bg-white p-6 shadow-lg sm:p-8">

                    {/* Back to login */}
                    <button
                        onClick={() => router.push("/login")}
                        className="group mb-4 flex items-center gap-1.5 text-sm font-medium text-[#14301F]/55 transition-colors hover:text-[#14301F]"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" strokeWidth={2} />
                    </button>

                    {!sent ? (
                        <>
                            {/* Header */}
                            <div className="mb-6 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#14301F]">
                                    <Image src={FooterLogo} alt="Logo" className="h-9 w-9 object-contain" />
                                </div>
                                <h1 className="text-2xl font-extrabold tracking-tight text-[#14301F] sm:text-[1.7rem]">
                                    Forgot your password?
                                </h1>
                                <p className="mt-2 text-sm font-medium text-[#14301F]/55">
                                    No worries. Enter the email on your account and we'll send you
                                    a verification code to reset it.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="fpEmail"
                                        className="mb-1.5 flex items-center gap-2 text-sm font-bold text-[#14301F]/75"
                                    >
                                        <Mail className="h-4 w-4 text-[#72BB83]" strokeWidth={2} />
                                        Email
                                    </label>
                                    <div
                                        className={`relative rounded-lg border bg-[#14301F]/[0.02] transition-all duration-200 ${errors.email
                                                ? "border-rose-500 ring-4 ring-rose-500/15"
                                                : focused
                                                    ? "border-[#72BB83] ring-4 ring-[#72BB83]/15"
                                                    : "border-[#14301F]/15"
                                            }`}
                                    >
                                        <input
                                            id="fpEmail"
                                            type="email"
                                            placeholder="you@example.org"
                                            {...register("email")}
                                            onFocus={() => setFocused(true)}
                                            onBlur={() => setFocused(false)}
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

                                <button
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#14301F] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0d2015] disabled:cursor-not-allowed disabled:opacity-60"
                                    type="submit"
                                    disabled={isSubmitting || loading}
                                >
                                    {isSubmitting || loading ? (
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4" strokeWidth={2.5} />
                                            Send verification code
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            {/* Success state */}
                            <div className="text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#72BB83]/10 ring-1 ring-inset ring-[#72BB83]/20">
                                    <CheckCircle2 className="h-8 w-8 text-[#72BB83]" strokeWidth={2} />
                                </div>
                                <h1 className="text-xl font-extrabold tracking-tight text-[#14301F] sm:text-2xl">
                                    Check your email
                                </h1>
                                <p className="mt-2 text-sm font-medium text-[#14301F]/55">
                                    We've sent a verification code to
                                </p>
                                <p className="mt-1 text-sm font-semibold text-[#14301F]">{sentTo}</p>
                                <p className="mt-2 text-xs text-[#14301F]/40">
                                    Redirecting to verification
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ForgotPasswordComp;