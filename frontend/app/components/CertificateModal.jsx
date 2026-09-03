// app/components/CertificateModal.jsx
"use client";

import { X, Download, Award, CheckCircle2, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getCertificate, downloadCertificate } from "../store/website/websiteCourseThunks";
import { clearCertificate } from "../store/website/websiteCourseSlice";

export default function CertificateModal({ isOpen, onClose, courseId, courseTitle }) {
    const dispatch = useAppDispatch();
    const { certificate, loadingDetail, errorDetail } = useAppSelector(
        (state) => state.websiteCourse
    );

    useEffect(() => {
        if (isOpen && courseId) {
            dispatch(getCertificate(courseId));
        }
        return () => {
            if (!isOpen) {
                dispatch(clearCertificate());
            }
        };
    }, [isOpen, courseId, dispatch]);

    const handleDownload = async () => {
        if (certificate?.pdf_url) {
            await dispatch(downloadCertificate(certificate.pdf_url)).unwrap();
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-[#14301F]/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
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
                                Certificate of Completion
                            </h2>
                            <p className="mt-1.5 text-sm font-medium text-white/60">
                                {courseTitle || "Course"}
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-6">
                        {loadingDetail ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-[#72BB83]" strokeWidth={2.5} />
                                <span className="ml-3 text-sm font-medium text-[#14301F]/60">
                                    Loading certificate...
                                </span>
                            </div>
                        ) : errorDetail ? (
                            <div className="text-center py-8">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                                    <X className="h-8 w-8 text-red-500" strokeWidth={2} />
                                </div>
                                <h3 className="font-bold text-[#14301F]">Certificate Not Available</h3>
                                <p className="mt-2 text-sm text-[#14301F]/60">{errorDetail}</p>
                                <button
                                    onClick={() => dispatch(getCertificate(courseId))}
                                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#14301F] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#14301F]/80"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : certificate ? (
                            <div className="text-center">
                                <div className="mb-4 flex items-center justify-center">
                                    <div className="rounded-xl border-2 border-[#72BB83]/20 bg-[#F8FBF6] p-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-[#14301F]">🎓</div>
                                            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#72BB83]">
                                                Certificate
                                            </p>
                                            <p className="mt-2 text-sm font-bold text-[#14301F]">
                                                {certificate.certificate_number || "Certificate"}
                                            </p>
                                            <p className="text-xs text-[#14301F]/40">
                                                Issued: {certificate.issued_at ? new Date(certificate.issued_at).toLocaleDateString() : "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center gap-2 text-sm text-[#14301F]/60">
                                    <CheckCircle2 className="h-4 w-4 text-[#72BB83]" strokeWidth={2} />
                                    <span>Certificate ready for download</span>
                                </div>

                                <button
                                    onClick={handleDownload}
                                    disabled={!certificate.pdf_url}
                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#72BB83] px-6 py-3 font-bold text-white transition-colors hover:bg-[#72BB83]/80 disabled:opacity-50"
                                >
                                    <Download className="h-4 w-4" strokeWidth={2.5} />
                                    Download Certificate (PDF)
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-[#14301F]/60">No certificate available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}