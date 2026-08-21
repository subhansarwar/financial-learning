// app/(user-panel)/layout.jsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import UserSidebar from "../components/userDashboardComp/UserSidebar";

export default function UserPanelLayout({ children }) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("dashboard");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const userData = localStorage.getItem("efp.user");
            if (userData) {
                try {
                    const user = JSON.parse(userData);
                    setIsAuthenticated(true);
                    setUser(user);
                } catch (e) {
                    setIsAuthenticated(false);
                }
            } else {
                router.push("/login");
            }
        }
        setLoading(false);
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("efp.user");
        window.location.href = "/";
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-cream">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-brand" strokeWidth={2} />
                    <p className="text-sm text-muted">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-cream">
            <UserSidebar
                user={user}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onLogout={handleLogout}
            />
            <main className="flex-1 overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}