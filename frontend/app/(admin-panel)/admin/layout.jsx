// app/(admin-panel)/layout.jsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function AdminPanelLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = sessionStorage.getItem("fl_admin");
            if (token) {
                setIsAuthenticated(true);
            }

            // ✅ Only redirect if NOT on login page and NOT authenticated
            if (!token && pathname !== "/admin/login") {
                router.push("/admin/login");
            }
        }
        setLoading(false);
    }, [router, pathname]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#47735B]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-brand" strokeWidth={2} />
                    <p className="text-sm text-muted">Loading...</p>
                </div>
            </div>
        );
    }

    // Always render children - login page will show login form
    // Dashboard pages will show content only if authenticated
    return <>{children}</>;
}