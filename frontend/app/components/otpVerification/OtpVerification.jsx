// app/components/otpVerification/OtpVerification.jsx
"use client";

import {
    AlertCircle,
    ArrowLeft,
    CheckCircle,
    Clock,
    RefreshCw,
    Shield
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import FooterLogo from "../../../public/assets/footerImages/Logo.webp";
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearError } from "../../store/slices/user/userSlice";
import { resendOTP, verifyOTP } from "../../store/slices/user/userThunks";

// ============================================
// OTP INPUT COMPONENT
// ============================================

const OtpInput = ({ value, index, onChange, onKeyDown, inputRef, error }) => {
    return (
        <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={value}
            onChange={(e) => onChange(e, index)}  // Pass event and index
            onKeyDown={(e) => onKeyDown(e, index)}  // Pass event and index
            className={`h-11 w-9 flex-1 rounded-lg border bg-[#14301F]/[0.02] text-center text-lg font-bold text-[#14301F] outline-none transition-all duration-150 focus:bg-white focus:ring-4 xs:h-12 xs:w-10 sm:h-14 sm:w-12 sm:text-xl ${error
                    ? "border-rose-400 ring-4 ring-rose-500/10 focus:border-rose-500 focus:ring-rose-500/15"
                    : value
                        ? "border-[#72BB83] bg-[#72BB83]/[0.06] focus:border-[#72BB83] focus:ring-[#72BB83]/15"
                        : "border-[#14301F]/15 focus:border-[#72BB83] focus:ring-[#72BB83]/15"
                }`}
        />
    );
};

// ============================================
// MAIN OTP VERIFICATION COMPONENT
// ============================================

const OtpVerification = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();
    const { loading, error, user } = useAppSelector((state) => state.user);

    const email = searchParams.get("email") || user?.email || "";
    const from = searchParams.get("from") || "signup";

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const [canResend, setCanResend] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [verificationSuccess, setVerificationSuccess] = useState(false);

    const inputRefs = useRef([]);

    // Timer for OTP expiry
    useEffect(() => {
        setMounted(true);

        // Start countdown timer
        if (timeLeft > 0 && !canResend) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            setCanResend(true);
        }
    }, [timeLeft, canResend]);

    // Clear error after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setErrorMessage("");
                dispatch(clearError());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, dispatch]);

    // Redirect if no email
    useEffect(() => {
        if (!email && mounted) {
            toast.error("Email is required for verification");
            router.push(from === "signup" ? "/signup" : "/login");
        }
    }, [email, router, from, mounted]);

    // Handle OTP input change - FIXED
    const handleOtpChange = (e, index) => {
        const value = e.target.value;

        // Only allow numbers
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(0, 1);
        setOtp(newOtp);

        // Auto-advance to next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Clear error on input
        if (errorMessage) {
            setErrorMessage("");
        }
    };

    // Handle key down events - FIXED
    const handleOtpKeyDown = (e, index) => {
        // Move to previous input on backspace
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        // Handle paste
        if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            navigator.clipboard.readText().then((text) => {
                const numbers = text.replace(/\D/g, "").slice(0, 6);
                const newOtp = [...otp];
                numbers.split("").forEach((num, i) => {
                    if (i < 6) newOtp[i] = num;
                });
                setOtp(newOtp);
                // Focus last filled input
                const lastIndex = Math.min(numbers.length, 5);
                if (lastIndex > 0) {
                    inputRefs.current[lastIndex - 1]?.focus();
                }
            });
        }
    };

    // Handle OTP verification - UPDATED with 'code' instead of 'otp'
    const handleVerify = async () => {
        const otpCode = otp.join("");

        if (otpCode.length !== 6) {
            toast.error("Please enter all 6 digits");
            return;
        }

        setIsVerifying(true);
        try {
            const result = await dispatch(verifyOTP({
                email,
                code: otpCode  // Changed from 'otp' to 'code'
            })).unwrap();

            if (result?.access_token) {  // Check for access_token
                setVerificationSuccess(true);
                toast.success("Email verified successfully!");

                // Redirect after 2 seconds
                setTimeout(() => {
                    router.push("/dashboard");
                }, 2000);
            }
        } catch (error) {
            // Clear OTP on error
            setOtp(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } finally {
            setIsVerifying(false);
        }
    };

    // Handle resend OTP - UPDATED
    const handleResend = async () => {
        if (!canResend) return;

        setIsResending(true);
        try {
            const result = await dispatch(resendOTP({ email })).unwrap();

            if (result?.message) {
                toast.success(result.message || "New OTP sent to your email");
                setCanResend(false);
                setTimeLeft(300);
                setOtp(["", "", "", "", "", ""]);
                inputRefs.current[0]?.focus();
                setErrorMessage("");
            }
        } catch (error) {
        } finally {
            setIsResending(false);
        }
    };

    // Format time
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
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

    return (
        <section className="relative min-h-[calc(100vh-160px)] overflow-hidden bg-white py-12 sm:py-16 lg:py-20">
            <div className="relative mx-4 flex items-center justify-center px-3 sm:px-4 md:px-6">
                <div className="flex items-center justify-center w-full">
                    <div className="relative z-10 w-full max-w-md rounded-2xl border border-[#14301F]/10 bg-white p-5 shadow-lg sm:p-7 md:p-8">

                        {/* Back Button */}
                        <button
                            onClick={() => router.back()}
                            className="group mb-4 flex items-center gap-2 text-sm font-medium text-[#14301F]/55 transition-colors hover:text-[#14301F]"
                        >
                            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        </button>

                        {/* Success Message */}
                        {verificationSuccess && (
                            <div className="mb-6 flex items-start gap-3 rounded-lg bg-green-50 p-4 border border-green-200">
                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-green-800">
                                        Email Verified Successfully!
                                    </p>
                                    <p className="text-xs text-green-600">
                                        Redirecting to dashboard...
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {errorMessage && !verificationSuccess && (
                            <div className="mb-6 flex items-start gap-3 rounded-lg bg-rose-50 p-4 border border-rose-200">
                                <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-rose-800">
                                        Verification Failed
                                    </p>
                                    <p className="text-xs text-rose-600">
                                        {errorMessage}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="mb-6 text-center">
                            {/* <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#14301F]">
                                <Image src={FooterLogo} alt="Logo" className="h-9 w-9 object-contain" />
                            </div> */}
                            <h1 className="text-xl font-extrabold tracking-tight text-[#14301F] sm:text-2xl md:text-[1.7rem]">
                                Verify Your Email
                            </h1>
                            <p className="mt-2 text-sm font-medium text-[#14301F]/55">
                                We've sent a 6-digit verification code to
                            </p>
                            <p className="mt-1 font-semibold text-[#14301F] text-sm sm:text-base">
                                {email}
                            </p>
                            <p className="mt-1 text-xs text-[#14301F]/40">
                                {from === "signup" ? "Please verify to complete your registration" : "Enter the code to verify your email"}
                            </p>
                        </div>

                        {/* OTP Input Fields */}
                        <div className="mb-6">
                            <div className="flex justify-center gap-2 sm:gap-3 md:gap-4">
                                {otp.map((digit, index) => (
                                    <OtpInput
                                        key={index}
                                        value={digit}
                                        index={index}
                                        onChange={handleOtpChange}
                                        onKeyDown={handleOtpKeyDown}
                                        inputRef={(el) => (inputRefs.current[index] = el)}
                                        error={!!errorMessage}
                                    />
                                ))}
                            </div>

                            {/* Entered OTP Display */}
                            <div className="mt-3 text-center">
                                <p className="text-xs text-[#14301F]/40">
                                    Enter the 6-digit code sent to your email
                                </p>
                            </div>
                        </div>

                        {/* Timer and Resend */}
                        <div className="mb-6 flex flex-col items-center gap-2">
                            <div className="flex items-center gap-3 text-sm">
                                <Clock className="h-4 w-4 text-[#14301F]/40" />
                                <span className="font-medium text-[#14301F]">
                                    {formatTime(timeLeft)}
                                </span>
                                <span className="text-[#14301F]/40">remaining</span>
                            </div>

                            <button
                                onClick={handleResend}
                                disabled={!canResend || isResending}
                                className={`flex items-center gap-2 text-sm font-medium transition-all duration-300 ${canResend && !isResending
                                        ? "text-[#72BB83] hover:text-[#5aa86e] cursor-pointer"
                                        : "text-[#14301F]/30 cursor-not-allowed"
                                    }`}
                            >
                                <RefreshCw className={`h-4 w-4 ${isResending ? "animate-spin" : ""}`} />
                                {isResending
                                    ? "Sending..."
                                    : canResend
                                        ? "Resend OTP"
                                        : "Resend OTP"}
                            </button>
                        </div>

                        {/* Verify Button */}
                        <button
                            onClick={handleVerify}
                            disabled={isVerifying || verificationSuccess || loading}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#14301F] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0d2015] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isVerifying || loading ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                                <>
                                    <Shield className="h-4 w-4" strokeWidth={2.5} />
                                    Verify Email
                                </>
                            )}
                        </button>

                        {/* Help Text */}
                        <p className="mt-4 text-center text-xs text-[#14301F]/40">
                            Didn't receive the code? Check your spam folder or try resending.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OtpVerification;