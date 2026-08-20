// app/(admin-panel)/admin/login/page.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLogin from "../../../components/adminPanelComp/AdminLogin";


export default function AdminLoginPage() {
    const router = useRouter();

    // Check if already logged in
    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = sessionStorage.getItem("fl_admin");
            if (token) {
                router.push("/admin/dashboard");
            }
        }
    }, [router]);

    const handleLogin = () => {
        router.push("/admin/dashboard");
    };

    return <AdminLogin onLogin={handleLogin} />;
}