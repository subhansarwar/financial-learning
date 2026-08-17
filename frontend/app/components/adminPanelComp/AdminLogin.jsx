// app/admin/components/AdminLogin.jsx
"use client";

import { useState } from "react";

export default function AdminLogin({ onLogin }) {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 503) {
                    setError("Admin not configured on the server yet.");
                } else {
                    setError(data.error || "Wrong password.");
                }
                setLoading(false);
                return;
            }

            sessionStorage.setItem("fl_admin", data.token);
            onLogin();
        } catch (_) {
            setError("Admin API unreachable.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login">
            <span className="overline">Platform team</span>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", marginBottom: "6px" }}>
                Admin panel
            </h1>
            <p className="text-muted" style={{ fontSize: ".92rem", marginBottom: "20px" }}>
                Add and edit courses, topics and tool data — no developers needed.
            </p>
            <form onSubmit={handleSubmit}>
                <div className="field" style={{ marginBottom: "14px" }}>
                    <label htmlFor="pw" style={{ display: "block", fontSize: ".82rem", fontWeight: "700", marginBottom: "6px" }}>
                        Team password
                    </label>
                    <input
                        type="password"
                        id="pw"
                        style={{
                            width: "100%",
                            border: "1px solid var(--line)",
                            borderRadius: "12px",
                            padding: "12px 14px",
                            background: "#fff",
                            color: "var(--ink)"
                        }}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <button className="btn btn-primary" style={{ width: "100%" }} type="submit" disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                </button>
                {error && (
                    <p className="text-muted" style={{ fontSize: ".82rem", marginTop: "14px", color: "var(--danger)" }}>
                        {error}
                    </p>
                )}
            </form>
        </div>
    );
}