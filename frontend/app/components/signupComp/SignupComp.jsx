// app/components/signupComp/SignupComp.jsx
"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import {
    Eye,
    EyeOff,
    Lock,
    Mail,
    User,
    UserPlus,
    CheckCircle,
    AlertCircle
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
                className="mb-1.5 flex items-center gap-2 text-sm font-bold text-[#14301F]/75"
            >
                <Icon className="h-4 w-4 text-[#72BB83]" strokeWidth={2} />
                {label}
            </label>

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
                    className={`w-full rounded-lg bg-transparent px-4 py-2.5 text-sm font-medium text-[#14301F] placeholder:text-[#14301F]/35 outline-none focus:outline-none focus:ring-0 ${isPassword ? "pr-12" : ""
                        }`}
                />

                {isPassword && (
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
                <p className="mt-1.5 text-xs font-medium text-rose-600 flex items-center gap-1">
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

    return (
        <section className="relative min-h-[calc(100vh-160px)] overflow-hidden bg-white py-12 sm:py-16 lg:py-20">
            <div className="relative mx-6 flex items-center justify-center px-4 sm:px-6">
                <div className="flex items-center justify-center">
                    <div className="relative z-10 w-full max-w-md rounded-2xl border border-[#14301F]/10 bg-white p-6 shadow-lg sm:p-8">
                        {/* Success Message */}
                        {signupSuccess && (
                            <div className="mb-6 flex items-center gap-3 rounded-lg bg-green-50 p-4 border border-green-200">
                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-green-800">
                                        Account Created Successfully!
                                    </p>
                                    <p className="text-xs text-green-600">
                                        We've sent a verification email to your inbox. Please verify your email to get started.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="mb-6 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#14301F]">
                                <Image src={FooterLogo} alt="Logo" className="h-9 w-9 object-contain" />
                            </div>
                            <h1 className="text-2xl font-extrabold tracking-tight text-[#14301F] sm:text-[1.7rem]">
                                Create your account
                            </h1>
                            <p className="mt-2 text-sm font-medium text-[#14301F]/55">
                                Join thousands of learners. Start your financial education journey today.
                                It's completely free!
                            </p>
                        </div>

                        {/* Google Sign-up */}
                        <div className="mb-4">
                            <GoogleLoginButton
                                isLoading={isGoogleLoading}
                                setIsLoading={setIsGoogleLoading}
                                isSignup={true}
                            />
                        </div>

                        {/* Divider */}
                        <div className="my-5 flex items-center gap-3">
                            <div className="h-px flex-1 bg-[#14301F]/10" />
                            <span className="text-xs font-bold uppercase tracking-wide text-[#14301F]/35">
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

                            {/* Password Strength Indicator */}
                            {password && password.length > 0 && (
                                <div className="space-y-1">
                                    <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-[#14301F]/10">
                                        <div
                                            className={`h-full transition-all duration-300 ${password.length >= 8
                                                ? "w-full bg-green-500"
                                                : password.length >= 6
                                                    ? "w-3/4 bg-yellow-500"
                                                    : password.length >= 4
                                                        ? "w-1/2 bg-orange-500"
                                                        : "w-1/4 bg-red-500"
                                                }`}
                                        />
                                    </div>
                                    <p className="text-xs text-[#14301F]/55">
                                        {password.length >= 8
                                            ? "✓ Strong password"
                                            : password.length >= 6
                                                ? "✓ Good password"
                                                : password.length >= 4
                                                    ? "✓ Weak password"
                                                    : "Password is too short"}
                                    </p>
                                </div>
                            )}

                            <button
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#14301F] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0d2015] disabled:cursor-not-allowed disabled:opacity-60"
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
                                    className="font-semibold text-[#72BB83] transition-colors hover:text-[#5aa86e]"
                                >
                                    Sign in here
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SignupComp;