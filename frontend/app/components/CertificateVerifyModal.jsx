// app/components/CertificateVerifyModal.jsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Search, CheckCircle2, XCircle, Award, Calendar, User, BookOpen, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import apiCall from "../store/api/apiClient";

export default function CertificateVerifyModal({ isOpen, onClose }) {
    const [certificateNumber, setCertificateNumber] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleVerify = async (e) => {
        e.preventDefault();

        if (!certificateNumber.trim()) {
            toast.error("Please enter a certificate number");
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await apiCall({
                path: `v1/certificates/verify/${certificateNumber.trim()}`,
                method: "get",
            });

            console.log('✅ Verification Response:', response);

            // Check if the response indicates invalid certificate
            if (response && response.valid === false) {
                // Certificate is invalid
                setError("Invalid certificate number. Please check and try again.");
                setResult(null);
            } else {
                // Certificate is valid
                setResult(response);
                setError(null);
            }
        } catch (err) {
            // Check if error response has valid: false
            if (err?.data?.valid === false) {
                setError("Invalid certificate number. Please check and try again.");
            } else {
                setError(err?.data?.detail || "Failed to verify certificate. Please try again.");
            }
            setResult(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setCertificateNumber("");
        setResult(null);
        setError(null);
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    if (!isOpen) return null;

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
                        onClick={handleClose}
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
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="absolute right-4 top-4 z-10 rounded-full p-1.5 text-[#14301F]/40 transition-colors hover:bg-[#14301F]/5 hover:text-[#14301F]"
                            >
                                <X className="h-5 w-5" strokeWidth={2} />
                            </button>

                            {/* Header */}
                            <div className="relative bg-gradient-to-br from-[#14301F] to-[#1a3d2a] px-6 py-6 text-center">
                                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:20px_20px]" />
                                <div className="relative">
                                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#F0A93E]/20">
                                        <Award className="h-8 w-8 text-[#F0A93E]" strokeWidth={2} />
                                    </div>
                                    <h2 className="text-xl font-extrabold text-white">
                                        Verify Certificate
                                    </h2>
                                    <p className="mt-1.5 text-sm font-medium text-white/60">
                                        Enter your certificate number to verify its authenticity
                                    </p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="px-6 py-6">
                                {!result && !error ? (
                                    // Input Form
                                    <form onSubmit={handleVerify} className="space-y-4">
                                        <div>
                                            <label
                                                htmlFor="certificateNumber"
                                                className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#14301F]/60"
                                            >
                                                Certificate Number
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="certificateNumber"
                                                    type="text"
                                                    value={certificateNumber}
                                                    onChange={(e) => setCertificateNumber(e.target.value)}
                                                    placeholder="e.g. FLP-59E8A287A732"
                                                    className="w-full rounded-xl border-2 border-[#14301F]/10 bg-[#14301F]/[0.02] px-4 py-3 text-sm font-medium text-[#14301F] placeholder:text-[#14301F]/30 outline-none focus:border-[#72BB83] focus:ring-4 focus:ring-[#72BB83]/20 transition-all duration-200"
                                                    autoFocus
                                                />
                                            </div>
                                            <p className="mt-1.5 text-xs text-[#14301F]/40">
                                                Enter the certificate number you received
                                            </p>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isLoading || !certificateNumber.trim()}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#14301F] px-6 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[#0d2015] hover:shadow-lg hover:shadow-[#14301F]/25 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {isLoading ? (
                                                <Loader2 className="h-5 w-5 animate-spin" strokeWidth={2.5} />
                                            ) : (
                                                <>
                                                    Verify Certificate
                                                </>
                                            )}
                                        </button>
                                    </form>
                                ) : error ? (
                                    // Error State - Invalid Certificate
                                    <div className="text-center py-6">
                                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                                            <XCircle className="h-10 w-10 text-red-500" strokeWidth={1.5} />
                                        </div>
                                        <h3 className="text-lg font-bold text-[#14301F]">Invalid Certificate</h3>
                                        <p className="mt-2 text-sm text-[#14301F]/60">{error}</p>
                                        <button
                                            onClick={handleReset}
                                            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#14301F] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#14301F]/80"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                ) : (
                                    // Success State - Valid Certificate
                                    <div className="space-y-6">
                                        <div className="text-center">
                                            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#72BB83]/10">
                                                <CheckCircle2 className="h-10 w-10 text-[#72BB83]" strokeWidth={1.5} />
                                            </div>
                                            <h3 className="text-xl font-bold text-[#14301F]">Certificate Verified!</h3>
                                            <p className="mt-1 text-sm text-[#72BB83]">This certificate is valid and authentic</p>
                                        </div>

                                        {/* Certificate Details */}
                                        <div className="rounded-xl border border-[#E5E5E5] bg-[#F8FBF6] p-4 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#72BB83]/10">
                                                    <Award className="h-4 w-4 text-[#72BB83]" strokeWidth={2} />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-[#14301F]/40">Certificate Number</p>
                                                    <p className="font-bold text-[#14301F]">{result.certificate_number || certificateNumber}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#72BB83]/10">
                                                    <BookOpen className="h-4 w-4 text-[#72BB83]" strokeWidth={2} />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-[#14301F]/40">Course Title</p>
                                                    <p className="font-bold text-[#14301F]">{result.course_title || "Course"}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#72BB83]/10">
                                                    <User className="h-4 w-4 text-[#72BB83]" strokeWidth={2} />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-[#14301F]/40">Holder Name</p>
                                                    <p className="font-bold text-[#14301F]">{result.holder_name || "Student"}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#72BB83]/10">
                                                    <Calendar className="h-4 w-4 text-[#72BB83]" strokeWidth={2} />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-[#14301F]/40">Issued Date</p>
                                                    <p className="font-bold text-[#14301F]">
                                                        {result.issued_at ? new Date(result.issued_at).toLocaleDateString('en-US', {
                                                            month: 'long',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        }) : "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-center gap-3">
                                            <button
                                                onClick={handleReset}
                                                className="inline-flex items-center gap-2 rounded-full border border-[#E5E5E5] bg-white px-6 py-2.5 text-sm font-bold text-[#14301F]/60 transition-colors hover:border-[#72BB83]/40 hover:text-[#14301F]"
                                            >
                                                Verify Another
                                            </button>
                                            <button
                                                onClick={handleClose}
                                                className="inline-flex items-center gap-2 rounded-full bg-[#72BB83] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#72BB83]/80"
                                            >
                                                Done
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}