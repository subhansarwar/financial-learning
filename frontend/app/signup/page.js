// app/signup/page.js
import { Suspense } from "react";
import SignupComp from "../components/signupComp/SignupComp";

export default function SignupPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#72BB83]/20 border-t-[#72BB83]" />
            </div>
        }>
            <SignupComp />
        </Suspense>
    );
}