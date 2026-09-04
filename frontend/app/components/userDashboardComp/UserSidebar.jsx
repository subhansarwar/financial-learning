// app/components/userDashboardComp/Sidebar.jsx
"use client";

import {
    BarChart3,
    BookOpen,
    Calendar,
    ChevronLeft,
    ChevronRight,
    LayoutDashboard,
    LogOut,
    Menu,
    TrendingUp,
    X,
    ChevronDown,
    ChevronRight as ChevronRightIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { id: "courses", label: "My Courses", href: "/my-courses", icon: BookOpen },
    // { id: "progress", label: "Progress", href: "/progress", icon: TrendingUp },
    { id: "upcoming", label: "Upcoming Tasks", href: "/up-coming-tasks", icon: Calendar },
];

export default function UserSidebar({
    activeTab,
    onTabChange,
    onLogout,
    courses,
    topics,
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCoursesExpanded, setIsCoursesExpanded] = useState(false);

    // Check if we're on course details page
    const isCourseDetailsPage = pathname?.startsWith("/course-details");

    // Get course ID from URL
    const courseId = isCourseDetailsPage ? pathname?.split("/").pop() : null;

    // Get course title from courses list (if available)
    const currentCourse = courses?.find(c => c.id === parseInt(courseId));
    const courseTitle = currentCourse?.title || "Course Details";

    // ✅ FIXED: Auto-expand courses when on course details page
    useEffect(() => {
        if (isCourseDetailsPage) {
            setIsCoursesExpanded(true);
        } else if (activeTab !== "courses" && !isCourseDetailsPage) {
            // Collapse only when switching to other tabs AND not on course details
            setIsCoursesExpanded(false);
        }
    }, [isCourseDetailsPage, activeTab]);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

    const isActive = (href) => {
        if (href === "/dashboard") {
            return pathname === "/dashboard";
        }
        if (href === "/my-courses") {
            return pathname === "/my-courses" || pathname?.startsWith("/course-details");
        }
        return pathname?.startsWith(href);
    };

    // Handle My Courses click
    const handleCoursesClick = () => {
        setIsCoursesExpanded(false);
        setIsMobileOpen(false);
        onTabChange("courses");

        if (pathname !== "/my-courses") {
            router.push("/my-courses");
        }
    };
    // Handle collapse to go back to my-courses
    const handleCollapseCourses = () => {
        setIsCoursesExpanded(false);
        router.push("/my-courses");
        onTabChange("courses");
        setIsMobileOpen(false);
    };

    // ✅ FIXED: Check if courses should be expanded
    const shouldExpandCourses = isCourseDetailsPage;

    return (
        <div className="bg-[#FFF7ED]">
            {/* ===== MOBILE OVERLAY ===== */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* ===== SIDEBAR ===== */}
            <aside
                className={`
                    fixed inset-y-4 left-0 z-50 flex flex-col overflow-hidden rounded-r-[28px]
                    border border-white/10 bg-[#365B50] shadow-xl transition-all duration-300
                    lg:sticky lg:inset-y-auto lg:left-auto lg:top-4 lg:my-4 lg:ml-0 lg:h-[calc(100vh-2rem)]
                    ${isCollapsed ? "w-[76px]" : "w-[240px]"}
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-[120%] lg:translate-x-0"}
                `}
            >
                {/* ===== HEADER ===== */}
                <div
                    className={`flex items-center pb-4 pt-5 ${isCollapsed ? "justify-center gap-2 px-4" : "justify-between gap-3 px-3"
                        }`}
                >
                    <div className={`flex min-w-0 items-center gap-2.5 ${isCollapsed ? "justify-center" : ""}`}>
                        {!isCollapsed && (
                            <>
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#47735B]">
                                    <LayoutDashboard className="h-4.5 w-4.5 text-white" strokeWidth={2.25} />
                                </div>
                                <span className="truncate text-base font-extrabold tracking-tight text-white">
                                    The Eco Lens
                                </span>
                            </>
                        )}
                    </div>

                    <button
                        onClick={toggleSidebar}
                        className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white lg:flex"
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? (
                            <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
                        ) : (
                            <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
                        )}
                    </button>

                    <button
                        onClick={toggleMobile}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
                    >
                        <X className="h-5 w-5" strokeWidth={2} />
                    </button>
                </div>

                {/* ===== NAVIGATION ===== */}
                <nav className="flex-1 space-y-1 overflow-y-auto px-3">
                    {/* ===== DASHBOARD ===== */}
                    <Link
                        href="/dashboard"
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${pathname === "/dashboard"
                            ? "bg-white/20 text-white"
                            : "text-white/70 hover:bg-white/10 hover:text-white"
                            } ${isCollapsed ? "justify-center" : ""}`}
                        onClick={() => {
                            onTabChange("dashboard");
                            setIsMobileOpen(false);
                        }}
                    >
                        <BarChart3
                            className={`h-5 w-5 shrink-0 ${pathname === "/dashboard" ? "text-white" : "text-white/50"
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

                    {/* ===== MY COURSES (with expand/collapse) ===== */}
                    <div>
                        <button
                            onClick={handleCoursesClick}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${isActive("/my-courses")
                                ? "bg-white/20 text-white"
                                : "text-white/70 hover:bg-white/10 hover:text-white"
                                } ${isCollapsed ? "justify-center" : ""}`}
                        >
                            <BookOpen
                                className={`h-5 w-5 shrink-0 ${isActive("/my-courses") ? "text-white" : "text-white/50"
                                    }`}
                                strokeWidth={2}
                            />
                            {!isCollapsed && (
                                <>
                                    <span className="flex-1 text-left">My Courses</span>
                                    {isCourseDetailsPage && (
                                        <ChevronDown
                                            className={`h-4 w-4 transition-transform duration-200 ${isCoursesExpanded ? "rotate-180" : ""
                                                }`}
                                            strokeWidth={2.5}
                                        />
                                    )}
                                </>
                            )}
                            {isActive("/my-courses") && !isCollapsed && (
                                <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                            )}
                        </button>

                        {/* ===== SUB-MENU: Course Details (expanded) ===== */}
                        {shouldExpandCourses && !isCollapsed && (
                            <div className="ml-3 mt-1 space-y-1 border-l-2 border-white/20 pl-3">
                                <button
                                    onClick={() => {
                                        // Stay on course details page
                                        setIsMobileOpen(false);
                                    }}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors bg-white/15 text-white cursor-default"
                                >
                                    <ChevronRightIcon className="h-3.5 w-3.5 text-white/50" strokeWidth={2.5} />
                                    <span className="truncate">{courseTitle}</span>
                                    <span className="ml-auto text-[10px] text-white/40">active</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ===== OTHER NAV ITEMS ===== */}
                    {NAV_ITEMS.filter(item => item.id !== "courses" && item.id !== "dashboard").map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                onClick={() => {
                                    onTabChange(item.id);
                                    setIsMobileOpen(false);
                                }}
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${active
                                    ? "bg-white/20 text-white"
                                    : "text-white/70 hover:bg-white/10 hover:text-white"
                                    } ${isCollapsed ? "justify-center" : ""}`}
                            >
                                <Icon
                                    className={`h-5 w-5 shrink-0 ${active ? "text-white" : "text-white/50"
                                        }`}
                                    strokeWidth={2}
                                />
                                {!isCollapsed && <span className="truncate">{item.label}</span>}
                                {active && !isCollapsed && (
                                    <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* ===== FOOTER ===== */}
                <div className="border-t border-white/10 px-3 pb-4 pt-3">
                    <button
                        onClick={onLogout}
                        title={isCollapsed ? "Sign out" : undefined}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-white/70 transition-colors hover:bg-white/10 hover:text-white ${isCollapsed ? "justify-center" : ""
                            }`}
                    >
                        <LogOut className="h-5 w-5 shrink-0 text-white/50" strokeWidth={2} />
                        {!isCollapsed && <span>Sign out</span>}
                    </button>

                    {!isCollapsed && (
                        <>
                            <p className="mt-3 text-center text-[11px] font-medium text-white/50">
                                {courses?.length || 0} courses · {topics?.length || 0} topics
                            </p>
                            <p className="mt-2 text-center text-[7px] font-medium text-white/50">
                                @2026THEECOLENS-V1.0
                            </p>
                        </>
                    )}
                </div>
            </aside>

            {/* ===== MOBILE TOGGLE BUTTON ===== */}
            <button
                onClick={toggleMobile}
                className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#47735B] text-white shadow-lg transition-all hover:bg-[#365B50] hover:shadow-xl lg:hidden"
                aria-label="Toggle menu"
            >
                <Menu className="h-5 w-5" strokeWidth={2.5} />
            </button>
        </div>
    );
}