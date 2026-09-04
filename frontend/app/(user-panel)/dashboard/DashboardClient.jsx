"use client";

import {
    BookOpen,
    Calendar,
    ChevronDown,
    ClipboardCheck,
    Clock,
    HelpCircle,
    ImageIcon,
    TrendingDown,
    TrendingUp
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
    Bar,
    BarChart,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getDashboardSummary, SUMMARY_CACHE_PREFIX } from "../../store/userDashboard/dashboardThunks";
import { setSummary } from "../../store/userDashboard/dashboardSlice";

// ===== CONSTANTS =====
const SIDEBAR = "#365B50";
const MAIN_BG = "#FFF7ED";
const LEARNING = "#34C79D";
const CHALLENGE = "#F2B84B";
const TONES = ["#7C6AE8", "#4FA3D1", "#E0A93E", "#D9727B", "#5B7FE0"];

// Dropdown options
const PERIOD_OPTIONS = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
];

// Fallback defaults (agar API se koi data na ho, UI khaali na dikhe)
const DEFAULT_STATS_META = [
    { label: "Courses", sub: "In Progress", key: "courses_in_progress", icon: BookOpen, bg: "#FCEFD9", fg: "#C8862B" },
    { label: "Lessons", sub: "Completed", key: "lessons_completed", icon: ClipboardCheck, bg: "#DCEFEA", fg: "#2F8574" },
    { label: "Quizzes", sub: "Completed", key: "quizzes_completed", icon: HelpCircle, bg: "#E4E9FB", fg: "#5B6BC0" },
    { label: "Time Spent", sub: null, key: "time_spent_label", icon: Clock, bg: "#FBE1E4", fg: "#C0576A" },
];

const DEFAULT_SPENT_HOURS = [
    { day: "S", learning: 6, challenge: 3 },
    { day: "M", learning: 9, challenge: 4 },
    { day: "T", learning: 5, challenge: 8 },
    { day: "W", learning: 11, challenge: 3 },
    { day: "T", learning: 4, challenge: 9 },
    { day: "F", learning: 8, challenge: 5 },
    { day: "S", learning: 3, challenge: 2 },
];

const DEFAULT_METRICS = [
    { label: "Total hours in a week", value: "140", delta: "+2%", trend: "up" },
    { label: "Average hours in a day", value: "12", delta: "-3%", trend: "down" },
    { label: "Course hours in a week", value: "80", delta: "+1%", trend: "up" },
    { label: "Challenge hours in a week", value: "40", delta: "-4%", trend: "down" },
];

const DEFAULT_RECENT_ACTIVITY = [
    { title: "Sustainable Energy Investment", author: "Prof. Marcus Webb", progress: 60, tone: "#7C6AE8" },
    { title: "Microfinance: Financial Inclusion in Action", author: "Dr. Priya Raman", progress: 50, tone: "#4FA3D1" },
];

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-[#1F2937] shadow-lg">
            <p className="mb-1 text-[10px] font-semibold uppercase text-gray-400">{label}</p>
            {payload.map((p) => (
                <p key={p.dataKey} style={{ color: p.fill }}>{p.name}: {p.value}h</p>
            ))}
        </div>
    );
}

export default function DashboardClient() {
    const [activeIndex, setActiveIndex] = useState(3);
    const [period, setPeriod] = useState("weekly"); // ab yeh dynamic hai
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const dispatch = useAppDispatch();
    const userData = useAppSelector((state) => state.user?.user);
    const summaryByPeriod = useAppSelector((state) => state.dashboard.summary);
    const summaryData = summaryByPeriod?.[period];

    const currentPeriodLabel =
        PERIOD_OPTIONS.find((p) => p.value === period)?.label || "Weekly";

    // Dropdown ke bahar click hone par close ho jaye
    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Cache-first load: agar cache mein hai to turant use karo, warna sirf ek dafa fetch karo
    useEffect(() => {
        if (typeof window === "undefined") return;

        const cached = localStorage.getItem(`${SUMMARY_CACHE_PREFIX}${period}`);
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                dispatch(setSummary({ period, data: parsed }));
                return;
            } catch (e) {
                // corrupt cache — fallback to fresh fetch
            }
        }

        dispatch(getDashboardSummary(period));
    }, [dispatch, period]); // period add kiya taake selection change hone par re-fetch ho

    function handleSelectPeriod(value) {
        setPeriod(value);
        setIsDropdownOpen(false);
    }

    // ===== Derive display data (API data available? use it, warna fallback) =====
    const stats = DEFAULT_STATS_META.map((meta) => ({
        ...meta,
        value: summaryData?.stats ? summaryData.stats[meta.key] : null,
    }));
    const hasApiStats = Boolean(summaryData?.stats);

    const spentHours = summaryData?.spent_hours?.buckets?.length
        ? summaryData.spent_hours.buckets.map((b) => ({
            day: b.label,
            learning: b.learning_hours,
            challenge: b.challenge_hours,
        }))
        : DEFAULT_SPENT_HOURS;

    const durationLabel =
        summaryData?.spent_hours?.peak?.duration_label || "5:30 Hours";

    const metrics = summaryData?.metrics?.length
        ? summaryData.metrics.map((m) => ({
            label: m.label,
            value: m.value,
            delta: `${m.delta_pct > 0 ? "+" : ""}${m.delta_pct}%`,
            trend: m.trend,
        }))
        : DEFAULT_METRICS;

    const recentActivity = summaryData?.recent_activity?.length
        ? summaryData.recent_activity.map((a, i) => ({
            title: a.title,
            author: a.instructor_name,
            progress: a.progress_pct,
            tone: TONES[i % TONES.length],
        }))
        : DEFAULT_RECENT_ACTIVITY;

    return (
        <div className="flex min-h-screen font-sans" style={{ background: MAIN_BG }}>
            <div className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
                {/* ===== HERO SECTION ===== */}
                <div className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8 rounded-2xl" style={{ background: SIDEBAR }}>
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div>
                                <h1 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl lg:text-[26px]">
                                    Welcome back, {userData?.full_name?.split(" ")[0] || "User"}
                                </h1>
                                <p className="mt-1 text-xs text-white/55 sm:text-sm">
                                    Here's an overview of your study progress this {period === "daily" ? "day" : period === "monthly" ? "month" : "week"}.
                                </p>
                            </div>
                        </div>

                        {/* ===== Period Dropdown ===== */}
                        <div className="relative hidden shrink-0 sm:block" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen((prev) => !prev)}
                                className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-white"
                            >
                                <Calendar className="h-3.5 w-3.5" />
                                {currentPeriodLabel}
                                <ChevronDown
                                    className={`h-3.5 w-3.5 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute right-0 top-full z-20 mt-2 w-36 overflow-hidden rounded-xl border border-white/10 bg-[#2C4A41] shadow-xl">
                                    {PERIOD_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => handleSelectPeriod(opt.value)}
                                            className={`block w-full px-4 py-2.5 text-left text-xs font-semibold transition-colors ${period === opt.value
                                                    ? "bg-white/15 text-white"
                                                    : "text-white/70 hover:bg-white/10 hover:text-white"
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                        {stats.map((s) => (
                            <div
                                key={s.label}
                                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4"
                            >
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: s.bg }}>
                                    <s.icon className="h-5 w-5" style={{ color: s.fg }} />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-lg font-extrabold text-white sm:text-xl">
                                        {hasApiStats
                                            ? (s.key === "time_spent_label" ? s.value : s.value ?? 0)
                                            : (s.sub ? "—" : "—")}
                                    </p>
                                    <p className="truncate text-[11px] font-medium text-white/55 sm:text-xs">
                                        {s.label}{s.sub ? ` · ${s.sub}` : ""}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.7fr_1fr]">
                        {/* Spent Hours */}
                        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-base font-bold text-white">Spent Hours</h2>
                                <div className="flex items-center gap-3 text-[11px] font-semibold text-white/60">
                                    <span className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full" style={{ background: LEARNING }} />
                                        Learning
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full" style={{ background: CHALLENGE }} />
                                        Challenge
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_160px]">
                                <div className="relative h-52 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={spentHours}
                                            barGap={4}
                                            onMouseMove={(st) => {
                                                if (st?.activeTooltipIndex !== undefined) {
                                                    setActiveIndex(st.activeTooltipIndex);
                                                }
                                            }}
                                        >
                                            <XAxis
                                                dataKey="day"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 600 }}
                                            />
                                            <YAxis hide domain={[0, 14]} />
                                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                                            <Bar dataKey="learning" name="Learning" radius={[6, 6, 6, 6]} maxBarSize={10}>
                                                {spentHours.map((_, i) => (
                                                    <Cell key={`l-${i}`} fill={LEARNING} fillOpacity={i === activeIndex ? 1 : 0.55} />
                                                ))}
                                            </Bar>
                                            <Bar dataKey="challenge" name="Challenge" radius={[6, 6, 6, 6]} maxBarSize={10}>
                                                {spentHours.map((_, i) => (
                                                    <Cell key={`c-${i}`} fill={CHALLENGE} fillOpacity={i === activeIndex ? 1 : 0.55} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                    <div className="pointer-events-none absolute left-1/2 top-1 -translate-x-1/2 rounded-lg bg-[#1F2937] px-3 py-1.5 text-center shadow-lg">
                                        <p className="text-[10px] font-semibold text-white/50">Duration</p>
                                        <p className="text-xs font-extrabold text-white">{durationLabel}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                                    {metrics.map((m) => (
                                        <div key={m.label}>
                                            <div className="flex items-baseline gap-1.5">
                                                <span className="text-lg font-extrabold text-white">{m.value}</span>
                                                <span className={`flex items-center gap-0.5 text-[10px] font-bold ${m.trend === "up" ? "text-emerald-400" : "text-rose-400"}`}>
                                                    {m.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                                    {m.delta}
                                                </span>
                                            </div>
                                            <p className="text-[11px] leading-snug text-white/50">{m.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-base font-bold text-white">Recent Activity</h2>
                                <button className="text-xs font-bold text-white/60 hover:text-white">View All →</button>
                            </div>
                            <div className="space-y-3">
                                {recentActivity.map((a, i) => (
                                    <div key={a.title + i} className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: `${a.tone}33` }}>
                                            <ImageIcon className="h-4.5 w-4.5" style={{ color: a.tone }} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-bold text-white">{a.title}</p>
                                            <p className="truncate text-xs text-white/50">{a.author}</p>
                                        </div>
                                        <div className="w-16 shrink-0 text-right">
                                            <p className="mb-1 text-[11px] font-bold text-white/70">{a.progress}%</p>
                                            <div className="h-1 w-full rounded-full bg-white/10">
                                                <div className="h-full rounded-full" style={{ width: `${a.progress}%`, background: a.tone }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}