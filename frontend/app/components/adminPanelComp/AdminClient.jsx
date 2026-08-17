// app/admin/components/AdminClient.jsx
"use client";

import { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

export default function AdminClient({ initialCourses, initialTopics }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState(initialCourses);
    const [topics, setTopics] = useState(initialTopics);

    useEffect(() => {
        // Check if already authenticated
        const token = sessionStorage.getItem("fl_admin");
        if (token) {
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        sessionStorage.removeItem("fl_admin");
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
            <div className="admin-shell" style={{ textAlign: "center", padding: "60px 0" }}>
                <p>Loading admin panel...</p>
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