// app/verify-otp/page.js
import { Suspense } from "react";
import OtpVerification from "../components/otpVerification/OtpVerification";

export default function VerifyOtpPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#72BB83]/20 border-t-[#72BB83]" />
                </div>
            </div>
        }>
            <OtpVerification />
        </Suspense>
    );
}