// app/admin/components/AdminDashboard.jsx
"use client";

import { useState } from "react";
import CourseEditor from "./CourseEditor";
import TopicsEditor from "./TopicsEditor";
import EsgEditor from "./EsgEditor";
import HelpPanel from "./HelpPanel";
import { toast } from "@/lib/app";

export default function AdminDashboard({ courses, topics, onLogout, onDataChange }) {
    const [activeTab, setActiveTab] = useState("courses");

    const tabs = [
        { id: "courses", label: "📚 Courses" },
        { id: "topics", label: "🏷️ Topics" },
        { id: "esg", label: "🌱 ESG data" },
        { id: "help", label: "❓ How it works" },
    ];

    return (
        <div className="admin-shell">
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.7rem" }}>Content manager</h1>
                <span className="badge green">connected</span>
                <span style={{ flex: 1 }}></span>
                <button className="btn btn-outline btn-sm" onClick={onLogout}>
                    Sign out
                </button>
            </div>

            {/* Tabs */}
            <div className="admin-tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={activeTab === tab.id ? "active" : ""}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === "courses" && (
                <CourseEditor
                    courses={courses}
                    topics={topics}
                    onDataChange={onDataChange}
                />
            )}

            {activeTab === "topics" && (
                <TopicsEditor
                    topics={topics}
                    onDataChange={onDataChange}
                />
            )}

            {activeTab === "esg" && (
                <EsgEditor />
            )}

            {activeTab === "help" && (
                <HelpPanel />
            )}
        </div>
    );
}