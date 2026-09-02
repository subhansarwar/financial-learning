// app/components/auth/AuthModal.jsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, LogIn, UserPlus, Leaf, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoginModal from "./LoginModal";

export default function AuthModal({ isOpen, onClose, redirectPath }) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

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

    if (!mounted) return null;

    const handleLoginClick = () => {
        onClose();
        setShowLoginModal(true);
    };

    const handleSignup = () => {
        onClose();
        router.push('/signup');
    };
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    return (
        <>
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
                            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

                                {/* Decorative Header */}
                                <div className="relative bg-gradient-to-br from-[#14301F] to-[#1a3d2a] px-6 py-8 text-center">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:20px_20px]" />
                                    <div className="relative">
                                        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
                                            <Leaf className="h-7 w-7 text-[#72BB83]" strokeWidth={2} />
                                        </div>
                                        <h2 className="text-xl font-extrabold text-white">
                                            Welcome to The Eco Lens
                                        </h2>
                                        <p className="mt-1.5 text-sm font-medium text-white/60">
                                            Learn finance, track progress & earn certificates
                                        </p>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="px-6 py-6">
                                    <div className="mb-6 text-center">
                                        <p className="text-sm text-[#14301F]/60">
                                            Please log in or create an account to access this course
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-3">
                                        <button
                                            onClick={handleLoginClick}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#14301F] px-4 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[#0d2015] hover:shadow-lg hover:shadow-[#14301F]/25 active:scale-[0.98]"
                                        >
                                            <LogIn className="h-4 w-4" strokeWidth={2.5} />
                                            Log In
                                        </button>

                                        <button
                                            onClick={handleSignup}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#14301F]/10 bg-white px-4 py-3.5 text-sm font-bold text-[#14301F] transition-all duration-200 hover:border-[#72BB83]/40 hover:bg-[#F8FBF6] active:scale-[0.98]"
                                        >
                                            <UserPlus className="h-4 w-4" strokeWidth={2.5} />
                                            Create Account
                                        </button>

                                        <p className="text-center text-xs text-[#14301F]/40">
                                            By continuing, you agree to our Terms of Service
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                redirectPath={redirectPath}
            />
        </>
    );
}