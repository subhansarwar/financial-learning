// app/login/page.js
import { Suspense } from "react";
import LoginComp from "../components/loginComp/LoginComp";

export const metadata = {
    title: "Log in Free Finance Education | Finance Platform Demo",
    description: "Sign in to track your progress, unlock modules and earn certificates. Free, private, and no real account required.",
    keywords: "login, finance learning, free courses, progress tracking",
    robots: "index, follow",
};

//  Wrap LoginComp in Suspense
export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-muted">Loading...</div>
            </div>
        }>
            <LoginComp />
        </Suspense>
    );
}