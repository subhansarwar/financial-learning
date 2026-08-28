// app/components/adminPanelComp/AdminLogin.jsx
"use client";

import {
    Shield,
    ShieldCheck
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import loginBg from '../../../public/assets/loginPageImage/financial-information.webp';
import googlelogo from '../../../public/assets/loginPageImage/googleLogo.webp';
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearError } from "../../store/slices/user/userSlice";
import { googleLogin, logoutUser } from "../../store/slices/user/userThunks";

export default function AdminLogin({ onLogin }) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { loading, error, isAuthenticated, user } = useAppSelector((state) => state.user);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    // Check if already logged in
    useEffect(() => {
        if (isAuthenticated && user) {
            // Check if user has admin role
            if (user.role === "admin" || user.isAdmin) {
                sessionStorage.setItem("fl_admin", "true");
                if (onLogin) {
                    onLogin();
                } else {
                    router.push("/admin/dashboard");
                }
            } else {
                toast.error("You don't have admin access.");
                dispatch(logoutUser());
            }
        }
    }, [isAuthenticated, user, router, onLogin, dispatch]);

    // Show error toast
    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleGoogleLogin = () => {
        setIsGoogleLoading(true);
        dispatch(googleLogin())
            .unwrap()
            .then(() => {
                setIsGoogleLoading(false);
            })
            .catch((err) => {
                setIsGoogleLoading(false);
                toast.error(err || "Google login failed. Please try again.");
            });
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream px-4 py-12 sm:px-6 sm:py-16">
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
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            </div>

            {/* ===== Content ===== */}
            <div className="relative z-10 w-full max-w-md">
                <div className="rounded-xl2 border border-white/10 bg-white/95 p-5 shadow-card backdrop-blur-sm sm:p-6 md:p-8">
                    {/* Header */}
                    <div className="mb-5 text-center sm:mb-6">
                        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#47735B]/10 sm:h-16 sm:w-16">
                            <Shield className="h-7 w-7 text-[#47735B] sm:h-8 sm:w-8" strokeWidth={2} />
                        </div>
                        <h1 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl md:text-3xl">
                            Admin Access
                        </h1>
                        <p className="mt-1.5 text-xs font-medium text-muted sm:text-sm">
                            Sign in with your Google account to manage content.
                        </p>
                    </div>

                    {/* ===== Google Login Button ===== */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading || isGoogleLoading}
                        className="group relative flex w-full items-center justify-center gap-1 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-300 hover:border-[#47735B] hover:bg-[#47735B]/5 hover:shadow-lg hover:shadow-[#47735B]/10 disabled:opacity-60 disabled:cursor-not-allowed sm:px-6 sm:py-3 sm:text-base"
                    >
                        {/* Google Logo - Bigger Size */}
                        <Image
                            src={googlelogo}
                            alt="Google"
                            width={28}
                            height={28}
                            className="h-6 w-6 object-contain sm:h-7 sm:w-7 md:h-8 md:w-8"
                        />
                        {loading || isGoogleLoading ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#47735B] border-t-transparent" />
                            </>
                        ) : (
                            <span className="text-sm sm:text-base">Sign in with Google</span>
                        )}
                    </button>

                    {/* ===== Divider ===== */}
                    <div className="relative my-5 sm:my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-white px-4 text-muted sm:text-sm">Admin Access Only</span>
                        </div>
                    </div>

                    {/* ===== Security Note ===== */}
                    <div className="flex items-start gap-2 rounded-lg bg-[#47735B]/10 p-3 sm:p-3.5">
                        <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#47735B]" strokeWidth={2} />
                        <p className="text-xs leading-relaxed text-ink-2 sm:text-sm">
                            <span className="font-bold text-[#47735B]">Secure access:</span>{" "}
                            Only authorized administrators can access this panel.
                            All logins are authenticated via Google.
                        </p>
                    </div>

                    {/* ===== Footer Hint ===== */}
                    <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted sm:mt-4">
                        <Shield className="h-3.5 w-3.5" strokeWidth={2} />
                        <span>Admin access only</span>
                    </div>
                </div>
            </div>
        </div>
    );
}