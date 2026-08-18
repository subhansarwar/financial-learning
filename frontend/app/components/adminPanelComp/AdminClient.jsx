// app/admin/components/AdminClient.jsx
"use client";

import { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import { Loader2 } from "lucide-react";

export default function AdminClient({ initialCourses, initialTopics }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState(initialCourses);
    const [topics, setTopics] = useState(initialTopics);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = sessionStorage.getItem("fl_admin");
            if (token) {
                setIsAuthenticated(true);
            }
        }
        setLoading(false);
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        if (typeof window !== "undefined") {
            sessionStorage.removeItem("fl_admin");
        }
        setIsAuthenticated(false);
    };
    const refreshData = async () => {
        try {
            const response = await fetch("/api/admin/refresh");
            if (response.ok) {
                const data = await response.json();
                setCourses(data.courses || initialCourses);
                setTopics(data.topics || initialTopics);
            }
        } catch (_) {
            // Fallback to initial data
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[calc(100vh-160px)] items-center justify-center bg-cream py-20">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-10 w-10 animate-spin text-brand" strokeWidth={2} />
                </div>
            </div>
        );
    }

    return (
        <>
            {!isAuthenticated ? (
                <AdminLogin onLogin={handleLogin} />
            ) : (
                <AdminDashboard
                    courses={courses}
                    topics={topics}
                    onLogout={handleLogout}
                    onDataChange={refreshData}
                />
            )}
        </>
    );
}