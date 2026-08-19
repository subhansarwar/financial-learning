// app/admin/components/AdminDashboard.jsx
"use client";

import { toast } from "@/lib/app";
import {
    BookOpen,
    HelpCircle,
    Leaf,
    LogOut,
    RefreshCw,
    ShieldCheck,
    Tags
} from "lucide-react";
import { useState } from "react";
import CourseEditor from "./CourseEditor";
import EsgEditor from "./EsgEditor";
import HelpPanel from "./HelpPanel";
import TopicsEditor from "./TopicsEditor";

export default function AdminDashboard({ courses, topics, onLogout, onDataChange }) {
    const [activeTab, setActiveTab] = useState("courses");
    const [isRefreshing, setIsRefreshing] = useState(false);

    const tabs = [
        { id: "courses", label: "Courses", icon: BookOpen, color: "text-blue-500" },
        { id: "topics", label: "Topics", icon: Tags, color: "text-purple-500" },
        { id: "esg", label: "ESG Data", icon: Leaf, color: "text-emerald-500" },
        { id: "help", label: "Help", icon: HelpCircle, color: "text-amber-500" },
    ];

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await onDataChange();
        setTimeout(() => {
            setIsRefreshing(false);
            toast("Data refreshed");
        }, 500);
    };

    return (
        <div className="min-h-[calc(100vh-160px)] bg-cream my-12 mb-0 sm:py-8">
            <div className="mx-6 px-4 sm:px-6">
                {/* Header */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl2 border border-line bg-card p-4 shadow-card sm:p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft">
                            <ShieldCheck className="h-5 w-5 text-brand-deep" strokeWidth={2} />
                        </div>
                        <div>
                            <h1 className="text-lg font-extrabold tracking-tight text-ink sm:text-xl">
                                Content Manager
                            </h1>
                            <div className="flex items-center gap-2 text-xs">
                                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                <span className="font-medium text-emerald-600">connected</span>
                                <span className="text-muted">·</span>
                                <span className="text-muted">
                                    {courses?.length || 0} courses, {topics?.length || 0} topics
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3.5 py-1.5 text-sm font-bold text-ink-2 transition-colors hover:border-brand/40 hover:bg-brand-soft/30 hover:text-brand-deep disabled:opacity-60"
                        >
                            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} strokeWidth={2} />
                        </button>
                        <button
                            onClick={onLogout}
                            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3.5 py-1.5 text-sm font-bold text-rose-600 transition-colors hover:border-rose-300 hover:bg-rose-50"
                        >
                            <LogOut className="h-4 w-4" strokeWidth={2} />
                            <span className="hidden sm:inline">Sign out</span>
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6 flex flex-wrap gap-1 rounded-xl2 border border-line bg-card p-1.5 shadow-sm">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all duration-200 sm:flex-none sm:px-5 ${isActive
                                    ? "bg-brand-deep text-white shadow-md"
                                    : "text-ink-2 hover:bg-cream-2 hover:text-ink"
                                    }`}
                            >
                                <Icon
                                    className={`h-4 w-4 ${isActive ? "text-white" : tab.color}`}
                                    strokeWidth={2.5}
                                />
                                <span>{tab.label}</span>
                                {isActive && (
                                    <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-white/60" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="rounded-xl2 border border-line bg-card p-4 shadow-card sm:p-5">
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
            </div>
        </div>
    );
}