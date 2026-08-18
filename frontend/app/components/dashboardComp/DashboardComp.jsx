// app/components/dashboardComp/DashboardComp.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    BookOpen,
    CheckCircle2,
    Award,
    Clock,
    User,
    LogOut,
    Download,
    GraduationCap,
    ArrowRight,
    Lock,
    Trophy,
    Loader2,
    X,
    Edit2,
    Save,
    Sparkles,
} from "lucide-react";

const DashboardComp = () => {
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        rows: [],
        started: [],
        doneCourses: 0,
        doneLessons: 0,
        totalMinutes: 0,
        name: "",
        certs: [],
        byId: {},
        catalog: [],
    });
    const [mounted, setMounted] = useState(false);
    const [showNameModal, setShowNameModal] = useState(false);
    const [newName, setNewName] = useState("");

    useEffect(() => {
        setMounted(true);
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        if (typeof window !== "undefined") {
            const user = localStorage.getItem("efp.user");
            if (!user) {
                window.location.href = "/login?next=dashboard";
                return;
            }

            try {
                const userData = JSON.parse(user);
                const { getTopics, getCourses, getCourseBySlug } = await import("@/lib/data");
                const { progress } = await import("@/lib/app");

                const [topicsData, catalogData] = await Promise.all([
                    getTopics(),
                    getCourses(),
                ]);

                const byId = Object.fromEntries(topicsData.map((t) => [t.id, t]));
                const mine = progress.all();
                const started = Object.keys(mine);

                let doneCourses = 0,
                    doneLessons = 0,
                    totalMinutes = 0;
                const rows = [];

                for (const slug of started) {
                    let course;
                    try {
                        course = await getCourseBySlug(slug);
                    } catch (_) {
                        continue;
                    }
                    if (!course) continue;

                    const s = progress.stats(slug, course);
                    if (s.done === 0 && !mine[slug]?.startedAt) continue;

                    doneLessons += s.done;
                    if (s.complete) {
                        doneCourses++;
                        totalMinutes += course.lengthMin || 0;
                    }
                    rows.push({ slug, course, s });
                }

                const certs = rows.filter((r) => r.s.complete);
                const name = progress.name() || userData.name || "";

                setDashboardData({
                    rows,
                    started,
                    doneCourses,
                    doneLessons,
                    totalMinutes,
                    name,
                    certs,
                    byId,
                    catalog: catalogData,
                });

                setLoading(false);
            } catch (error) {
                console.error("Failed to load dashboard:", error);
                setLoading(false);
            }
        }
    };

    const handleOpenNameModal = () => {
        setNewName(dashboardData.name || "");
        setShowNameModal(true);
    };

    const handleSaveName = () => {
        if (newName && newName.trim()) {
            if (typeof window !== "undefined") {
                const data = JSON.parse(localStorage.getItem("finlearn.v1") || "{}");
                data.name = newName.trim();
                localStorage.setItem("finlearn.v1", JSON.stringify(data));
                setDashboardData({ ...dashboardData, name: newName.trim() });
                showToast("✓ Name saved successfully!");
            }
            setShowNameModal(false);
        } else {
            showToast("⚠️ Please enter a valid name");
        }
    };

    const handleDownloadCert = async (slug) => {
        try {
            const { getCourseBySlug } = await import("@/lib/data");
            const { downloadCertificate } = await import("@/lib/cert");
            const course = await getCourseBySlug(slug);
            if (course) {
                downloadCertificate(slug, course);
                showToast("📄 Certificate downloaded!");
            }
        } catch (error) {
            showToast("Failed to download certificate");
        }
    };

    const showToast = (msg) => {
        const toast = document.getElementById("flToast");
        if (toast) {
            toast.textContent = msg;
            toast.dataset.show = "true";
            setTimeout(() => (toast.dataset.show = "false"), 3000);
        }
    };

    const handleLogout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("efp.user");
            window.location.href = "/";
        }
    };

    if (!mounted || loading) {
        return (
            <section className="flex min-h-[calc(100vh-200px)] items-center justify-center bg-cream py-20">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-brand" strokeWidth={2} />
                </div>
            </section>
        );
    }

    const { rows, doneCourses, doneLessons, name, certs, byId } = dashboardData;

    return (
        <>
            {/* ========== HERO SECTION ========== */}
            <section className="relative overflow-hidden border-b border-line-soft bg-cream-2 py-12 sm:py-16 lg:py-20">
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(600px 400px at 90% 20%, rgba(67,56,202,.06), transparent 60%), radial-gradient(500px 400px at 10% 80%, rgba(99,102,241,.05), transparent 55%)",
                    }}
                />
                <div className="relative mx-auto max-w-[1180px] px-4 sm:px-6">
                    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <span className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.16em] text-brand-deep">
                                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                                Dashboard
                            </span>
                            <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
                                {name
                                    ? `Welcome back, ${name.split(" ")[0]}`
                                    : "My learning"}
                            </h1>
                            <p className="mt-2 text-sm font-medium text-muted sm:text-base">
                                Your progress is saved privately on this device — no account needed.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={handleOpenNameModal}
                                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-4 py-2 text-sm font-bold text-ink-2 transition-colors hover:border-brand/40 hover:text-brand-deep"
                            >
                                <Edit2 className="h-4 w-4" strokeWidth={2} />
                                {name ? "Change name" : "Set name"}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-4 py-2 text-sm font-bold text-rose-600 transition-colors hover:border-rose-300 hover:bg-rose-50"
                            >
                                <LogOut className="h-4 w-4" strokeWidth={2} />
                                Log out
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== STATS CARDS ========== */}
            <section className="py-8 sm:py-10">
                <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="group rounded-xl2 border border-line bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-card-lg">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="mb-2 inline-flex rounded-full bg-blue-50 p-2.5">
                                        <BookOpen className="h-5 w-5 text-blue-500" strokeWidth={2} />
                                    </div>
                                    <div className="text-3xl font-extrabold text-brand-deep group-hover:text-brand">
                                        {rows.length}
                                    </div>
                                    <div className="text-sm font-medium text-muted">courses started</div>
                                </div>
                                <div className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-bold text-brand-deep">
                                    {rows.length > 0 ? `${Math.round((doneLessons / (rows.reduce((acc, r) => acc + r.s.total, 0) || 1)) * 100)}%` : "0%"}
                                </div>
                            </div>
                        </div>

                        <div className="group rounded-xl2 border border-line bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-card-lg">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="mb-2 inline-flex rounded-full bg-purple-50 p-2.5">
                                        <CheckCircle2 className="h-5 w-5 text-purple-500" strokeWidth={2} />
                                    </div>
                                    <div className="text-3xl font-extrabold text-brand-deep group-hover:text-brand">
                                        {doneLessons}
                                    </div>
                                    <div className="text-sm font-medium text-muted">lessons completed</div>
                                </div>
                                <div className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-bold text-brand-deep">
                                    <Clock className="h-3 w-3" strokeWidth={2} />
                                    <span>{Math.round(dashboardData.totalMinutes / 60)}h</span>
                                </div>
                            </div>
                        </div>

                        <div className="group rounded-xl2 border border-line bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-card-lg">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="mb-2 inline-flex rounded-full bg-emerald-50 p-2.5">
                                        <Award className="h-5 w-5 text-emerald-500" strokeWidth={2} />
                                    </div>
                                    <div className="text-3xl font-extrabold text-brand-deep group-hover:text-brand">
                                        {doneCourses}
                                    </div>
                                    <div className="text-sm font-medium text-muted">certificates earned</div>
                                </div>
                                <div className="rounded-full bg-emerald-50 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-brand-deep text-emerald-600">
                                    <Trophy className="inline h-3 w-3" strokeWidth={2} />
                                    {doneCourses > 0 ? "🎓" : "Keep going"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== COURSES SECTION ========== */}
            <section className="py-8 sm:py-12">
                <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
                    <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-[0.16em] text-brand-deep">
                                In progress
                            </span>
                            <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                                Your courses
                            </h2>
                        </div>
                        <Link
                            href="/catalog"
                            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-deep transition-colors hover:underline"
                        >
                            Find a new course
                            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                        </Link>
                    </div>

                    {rows.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl2 border border-line bg-card px-6 py-16 text-center">
                            <div className="mb-4 rounded-full bg-brand-soft p-4">
                                <GraduationCap className="h-10 w-10 text-brand-deep" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-ink">Nothing started yet</h3>
                            <p className="mt-1 text-sm text-muted">
                                Pick any course — they're all free.
                            </p>
                            <Link
                                href="/catalog"
                                className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-deep px-6 py-3 font-bold text-white transition-colors hover:bg-[#241f6b]"
                            >
                                Browse the catalog
                                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {rows
                                .sort((a, b) => b.s.pct - a.s.pct)
                                .map(({ slug, course, s }) => {
                                    const topic = byId[course.topic];
                                    const hue = topic?.hue || 245;

                                    return (
                                        <Link
                                            key={slug}
                                            href={`/course/${slug}`}
                                            style={{ "--hue": hue }}
                                            className="group block overflow-hidden rounded-xl2 border border-line bg-card transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-card-lg"
                                        >
                                            <div
                                                className="relative flex h-28 items-center justify-center sm:h-32"
                                                style={{
                                                    background: `linear-gradient(135deg, hsl(var(--hue) 70% 94%), hsl(var(--hue) 55% 85%))`,
                                                }}
                                            >
                                                <span className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-ink-2 backdrop-blur-sm sm:left-4 sm:top-4">
                                                    {course.level || "Beginner"}
                                                </span>
                                                <span className="text-4xl sm:text-5xl">
                                                    {topic?.icon || "📚"}
                                                </span>
                                                <span className="absolute right-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-xs font-bold text-brand-deep backdrop-blur-sm">
                                                    {s.pct}%
                                                </span>
                                            </div>

                                            <div className="h-1.5 w-full bg-cream-2">
                                                <div
                                                    className="h-full transition-all duration-500"
                                                    style={{
                                                        width: `${s.pct}%`,
                                                        background: `hsl(var(--hue) 55% 42%)`,
                                                    }}
                                                />
                                            </div>

                                            <div className="p-4 sm:p-5">
                                                <span
                                                    className="text-xs font-bold uppercase tracking-wide"
                                                    style={{ color: `hsl(var(--hue) 45% 38%)` }}
                                                >
                                                    {topic?.name || course?.topic || "Course"}
                                                </span>
                                                <h3 className="mt-1 text-base font-bold leading-snug tracking-tight text-ink sm:text-lg">
                                                    {course.title}
                                                </h3>

                                                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-medium text-muted">
                                                    <span className="flex items-center gap-1">
                                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" strokeWidth={2} />
                                                        {s.done} / {s.total} lessons
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3.5 w-3.5" strokeWidth={2} />
                                                        {Math.round((s.done / (s.total || 1)) * 100)}%
                                                    </span>
                                                    {s.complete && (
                                                        <span className="flex items-center gap-1 text-emerald-600">
                                                            <Award className="h-3.5 w-3.5" strokeWidth={2} />
                                                            Complete
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                        </div>
                    )}
                </div>
            </section>

            {/* ========== CERTIFICATES SECTION ========== */}
            {certs.length > 0 && (
                <section className="py-8 sm:py-12">
                    <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
                        <div className="mb-6">
                            <span className="text-xs font-bold uppercase tracking-[0.16em] text-brand-deep">
                                Earned
                            </span>
                            <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                                Your certificates
                            </h2>
                        </div>

                        <div className="space-y-3">
                            {certs.map(({ slug, course }) => {
                                const courseData = JSON.parse(
                                    localStorage.getItem("finlearn.v1") || "{}"
                                )?.courses?.[slug] || {};
                                const completedDate = courseData.completedAt
                                    ? new Date(courseData.completedAt).toLocaleDateString("en-GB", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })
                                    : "Recently";

                                return (
                                    <div
                                        key={slug}
                                        className="flex flex-wrap items-center gap-4 rounded-xl2 border border-line bg-card p-4 transition-all hover:border-brand/30 hover:shadow-card sm:p-5"
                                    >
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft">
                                            <GraduationCap className="h-6 w-6 text-accent-deep" strokeWidth={2} />
                                        </div>
                                        <div className="flex-1 min-w-[140px]">
                                            <h3 className="font-bold text-ink">{course.title}</h3>
                                            <p className="text-sm text-muted">
                                                Completed {completedDate} · ID {courseData.certId || "N/A"}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDownloadCert(slug)}
                                            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
                                        >
                                            <Download className="h-4 w-4" strokeWidth={2.5} />
                                            Download PDF
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* ========== PRIVACY NOTICE ========== */}
            <section className="py-8 sm:py-12">
                <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
                    <div className="rounded-xl2 border border-line bg-card p-5 shadow-card sm:p-6">
                        <div className="flex items-start gap-3">
                            <div className="rounded-full bg-brand-soft p-2">
                                <Lock className="h-5 w-5 text-brand-deep" strokeWidth={2} />
                            </div>
                            <div>
                                <p className="font-bold text-ink">Private by design.</p>
                                <p className="text-sm text-muted">
                                    Progress lives only in this browser's storage. Clearing site data
                                    resets it. Set or change the name that appears on certificates:
                                </p>
                                <button
                                    onClick={handleOpenNameModal}
                                    className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-4 py-1.5 text-sm font-bold text-ink-2 transition-colors hover:border-brand/40 hover:text-brand-deep"
                                >
                                    <Edit2 className="h-4 w-4" strokeWidth={2} />
                                    {name ? "Change name" : "Set name"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== NAME MODAL ========== */}
            {showNameModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setShowNameModal(false)}
                >
                    <div
                        className="w-full max-w-md mx-4 rounded-xl2 border border-line bg-card p-6 shadow-card-lg animate-in zoom-in-95 duration-200 sm:p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-brand-soft p-2">
                                    <User className="h-5 w-5 text-brand-deep" strokeWidth={2} />
                                </div>
                                <h3 className="text-xl font-bold text-ink">
                                    {name ? "Change your name" : "Set your name"}
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowNameModal(false)}
                                className="rounded-full p-1.5 text-muted transition-colors hover:bg-cream-2 hover:text-ink"
                            >
                                <X className="h-5 w-5" strokeWidth={2} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <p className="mb-4 text-sm text-muted">
                            This name will appear on your certificates. You can change it anytime.
                        </p>

                        <div className="mb-6">
                            <label
                                htmlFor="nameInput"
                                className="mb-1.5 block text-sm font-bold text-ink-2"
                            >
                                Your full name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" strokeWidth={2} />
                                <input
                                    id="nameInput"
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="e.g. Amina Yusuf"
                                    className="w-full rounded-lg border border-line bg-cream-2/50 px-10 py-2.5 text-sm font-medium text-ink placeholder:text-muted focus:border-brand/50 focus:outline-none focus:ring-4 focus:ring-brand/15"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleSaveName();
                                        if (e.key === "Escape") setShowNameModal(false);
                                    }}
                                />
                            </div>
                            <p className="mt-1.5 text-xs text-muted">
                                <Sparkles className="inline h-3 w-3 text-brand" strokeWidth={2} />
                                This name is stored locally on your device only.
                            </p>
                        </div>

                        {/* Modal Actions */}
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={handleSaveName}
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-brand-deep px-6 py-2.5 font-bold text-white transition-colors hover:bg-[#241f6b] min-w-[120px]"
                            >
                                <Save className="h-4 w-4" strokeWidth={2.5} />
                                Save name
                            </button>
                            <button
                                onClick={() => setShowNameModal(false)}
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-line bg-card px-6 py-2.5 font-bold text-ink-2 transition-colors hover:border-brand/40 hover:bg-brand-soft/30 hover:text-brand-deep min-w-[120px]"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DashboardComp;