// app/components/adminPanelComp/Sidebar.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
    BookOpen,
    Tags,
    HelpCircle,
    LogOut,
    LayoutDashboard,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    BarChart3,
    FileText,
} from "lucide-react";

const NAV_ITEMS = [
    {
        id: "courses",
        label: "Courses",
        icon: BookOpen,
        color: "text-blue-500",
    },
    {
        id: "research",
        label: "Research Papers",
        icon: Tags,
        color: "text-cyan-500",
    },
    {
        id: "case-studies",
        label: "Case Studies",
        icon: FileText,
        color: "text-purple-500",
    },
    {
        id: "help",
        label: "Help",
        icon: HelpCircle,
        color: "text-amber-500",
    },
];

export default function Sidebar({
    activeTab,
    onTabChange,
    onLogout,
    courses,
    topics,
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

    return (
        <div className="bg-[#FFF7ED]">
            {/* ===== MOBILE OVERLAY ===== */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* ===== SIDEBAR — inset from top/bottom, rounded corners ===== */}
            <aside
                className={`
                    fixed inset-y-4 left-0 z-50 flex flex-col overflow-hidden rounded-r-[28px]
                    border border-white/10 bg-[#365B50] shadow-xl transition-all duration-300
                    lg:sticky lg:inset-y-auto lg:left-auto lg:top-4 lg:my-4 lg:ml-0 lg:h-[calc(100vh-2rem)]
                    ${isCollapsed ? "w-[76px]" : "w-[240px]"}
                    ${
                        isMobileOpen
                            ? "translate-x-0"
                            : "-translate-x-[120%] lg:translate-x-0"
                    }
                `}
            >
                {/* ===== HEADER ===== */}
                <div
                    className={`flex items-center pb-4 pt-5 ${
                        isCollapsed
                            ? "justify-center gap-2 px-4"
                            : "justify-between gap-3 px-3"
                    }`}
                >
                    <div className={`flex min-w-0 items-center gap-2.5 ${isCollapsed ? "justify-center" : ""}`}>
                        {!isCollapsed && (
                            <>
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#47735B]">
                                    <LayoutDashboard
                                        className="h-4.5 w-4.5 text-white"
                                        strokeWidth={2.25}
                                    />
                                </div>

                                <span className="truncate text-base font-extrabold tracking-tight text-white">
                                    TheEcoLens<span className="text-brand-light">.</span>
                                </span>
                            </>
                        )}
                    </div>

                    {/* ===== DESKTOP COLLAPSE ===== */}
                    <button
                        onClick={toggleSidebar}
                        className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white lg:flex"
                        aria-label={
                            isCollapsed
                                ? "Expand sidebar"
                                : "Collapse sidebar"
                        }
                    >
                        {isCollapsed ? (
                            <ChevronRight
                                className="h-4 w-4"
                                strokeWidth={2.5}
                            />
                        ) : (
                            <ChevronLeft
                                className="h-4 w-4"
                                strokeWidth={2.5}
                            />
                        )}
                    </button>

                    {/* ===== MOBILE CLOSE ===== */}
                    <button
                        onClick={toggleMobile}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
                        aria-label="Close menu"
                    >
                        <X
                            className="h-5 w-5"
                            strokeWidth={2}
                        />
                    </button>
                </div>

                {/* ===== NAVIGATION ===== */}
                <nav className="flex-1 space-y-1 overflow-y-auto px-3">
                    {/* ===== DASHBOARD ===== */}
                    <Link
                        href="/admin"
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${
                            activeTab === "dashboard"
                                ? "bg-white/20 text-white"
                                : "text-white/70 hover:bg-white/10 hover:text-white"
                        } ${isCollapsed ? "justify-center" : ""}`}
                        onClick={() => {
                            onTabChange("dashboard");
                            setIsMobileOpen(false);
                        }}
                    >
                        <BarChart3
                            className={`h-5 w-5 shrink-0 ${
                                activeTab === "dashboard"
                                    ? "text-white"
                                    : "text-white/50"
                            }`}
                            strokeWidth={2}
                        />

                        {!isCollapsed && <span>Dashboard</span>}
                    </Link>

                    {/* ===== DIVIDER ===== */}
                    <div className="my-3 border-t border-white/10" />

                    {/* ===== GENERAL TITLE ===== */}
                    {!isCollapsed && (
                        <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-white/50">
                            General
                        </p>
                    )}

                    {/* ===== GENERAL NAV ITEMS ===== */}
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    onTabChange(item.id);
                                    setIsMobileOpen(false);
                                }}
                                title={
                                    isCollapsed
                                        ? item.label
                                        : undefined
                                }
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${
                                    isActive
                                        ? "bg-white/20 text-white"
                                        : "text-white/70 hover:bg-white/10 hover:text-white"
                                } ${isCollapsed ? "justify-center" : ""}`}
                            >
                                <Icon
                                    className={`h-5 w-5 shrink-0 ${
                                        isActive
                                            ? "text-white"
                                            : "text-white/50"
                                    }`}
                                    strokeWidth={2}
                                />

                                {!isCollapsed && (
                                    <span className="truncate">
                                        {item.label}
                                    </span>
                                )}

                                {isActive && !isCollapsed && (
                                    <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* ===== FOOTER ===== */}
                <div className="border-t border-white/10 px-3 pb-4 pt-3">
                    <button
                        onClick={onLogout}
                        title={isCollapsed ? "Sign out" : undefined}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-white/70 transition-colors hover:bg-white/10 hover:text-white ${
                            isCollapsed ? "justify-center" : ""
                        }`}
                    >
                        <LogOut
                            className="h-5 w-5 shrink-0 text-white/50"
                            strokeWidth={2}
                        />

                        {!isCollapsed && <span>Sign out</span>}
                    </button>

                    {!isCollapsed && (
                        <p className="mt-3 text-center text-[11px] font-medium text-white/50">
                            {courses?.length || 0} courses ·{" "}
                            {topics?.length || 0} topics
                        </p>
                        
                    )}
                    {!isCollapsed &&(
                    <p className="mt-2 text-center text-[7px] font-medium text-white/50">
                            @2026THEECOLENS-V1.0
                        </p>
                        )}
                </div>
            </aside>

            {/* ===== MOBILE TOGGLE BUTTON ===== */}
            <button
                onClick={toggleMobile}
                className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#79A68E] text-white shadow-lg transition-all hover:bg-[#6b957c] hover:shadow-xl lg:hidden"
                aria-label="Toggle menu"
            >
                <Menu
                    className="h-5 w-5"
                    strokeWidth={2.5}
                />
            </button>
        </div>
    );
}