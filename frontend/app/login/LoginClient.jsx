// app/login/LoginClient.jsx
"use client";

import { Suspense } from "react";
import LoginComp from "../components/loginComp/LoginComp";
import { Loader2 } from "lucide-react";

// Wrap LoginComp in Suspense
export default function LoginClient() {
    return (
        <Suspense fallback={
            <div className="flex min-h-[calc(100vh-160px)] items-center justify-center bg-cream py-20">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-brand" strokeWidth={2} />
                </div>
            </div>
        }>
            <LoginComp />
        </Suspense>
    );
}