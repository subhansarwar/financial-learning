// app/components/adminPanelComp/HelpPanel.jsx
"use client";

import {
    Award,
    BookOpen,
    CheckCircle2,
    Clock,
    Database,
    Download,
    FileText,
    HelpCircle,
    Layers,
    Lightbulb,
    ListChecks,
    PlayCircle,
    RefreshCw,
    Shield,
    Sparkles,
    Tags,
    Zap,
    GraduationCap,
    Users,
    BarChart3,
    Leaf,
    FileCheck,
    FolderOpen,
    ImageIcon,
    Video,
    PenTool,
    Settings,
    Globe,
    TrendingUp,
    ShieldCheck,
    BookMarked,
    ClipboardList,
    Briefcase,
} from "lucide-react";

export default function HelpPanel() {
    const adminFeatures = [
        {
            icon: BookOpen,
            label: "Manage Courses",
            description: "Create, edit, and publish courses. Add modules, lessons, quizzes, and track course status.",
            color: "text-blue-500",
            bg: "bg-blue-50",
        },
        {
            icon: FileText,
            label: "Case Studies",
            description: "Create and manage case studies with images, content sections, and publish them instantly.",
            color: "text-purple-500",
            bg: "bg-purple-50",
        },
        {
            icon: Tags,
            label: "Research Papers",
            description: "Review student submissions, approve, reject, or delete research papers.",
            color: "text-cyan-500",
            bg: "bg-cyan-50",
        },
        {
            icon: Leaf,
            label: "ESG Data",
            description: "Manage ESG comparison data for companies. Edit JSON data directly.",
            color: "text-emerald-500",
            bg: "bg-emerald-50",
        },
    ];

    const quickGuides = [
        {
            icon: PenTool,
            title: "Creating Content",
            items: [
                "Click 'New Course' to create a course",
                "Fill in all required fields marked with *",
                "Add modules and lessons to build curriculum",
                "Upload images and videos for course materials"
            ],
        },
        {
            icon: FileCheck,
            title: "Publishing Workflow",
            items: [
                "All fields must be filled before publishing",
                "Publish button enables only when form is valid",
                "Case studies are published immediately",
                "Research papers go through approval process"
            ],
        },
        {
            icon: Settings,
            title: "Managing Content",
            items: [
                "View, edit, or delete any content",
                "Search and filter through tables",
                "Sort columns by clicking headers",
                "View details in modal popups"
            ],
        },
    ];

    const bestPractices = [
        {
            icon: Clock,
            text: "Keep course lessons under ~10 minutes for better engagement",
        },
        {
            icon: Award,
            text: "Include quizzes at the end of each course module",
        },
        {
            icon: Shield,
            text: "Never give financial advice teach concepts only",
        },
        {
            icon: Users,
            text: "Review research papers promptly for student satisfaction",
        },
        {
            icon: ImageIcon,
            text: "Use high-quality images (1280x720 recommended) for case studies",
        },
        {
            icon: Video,
            text: "Upload videos in MP4 format for best compatibility",
        },
    ];

    return (
        <div className="space-y-8">
            {/* ===== HEADER ===== */}
            <div className="flex items-start gap-4 border-b border-line-soft pb-5">
                <div className="rounded-xl bg-brand-soft p-3">
                    <HelpCircle className="h-7 w-7 text-brand-deep" strokeWidth={2} />
                </div>
                <div>
                    <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                        Admin Guide
                    </h2>
                    <p className="mt-1 text-sm text-muted">
                        Everything you need to know about managing content on the Finance Platform
                    </p>
                </div>
            </div>

            {/* ===== OVERVIEW ===== */}
            <div className="rounded-xl2 border border-brand/20 bg-brand-soft/20 p-5 sm:p-6">
                <div className="flex items-start gap-3">
                    <div className="rounded-full bg-brand-soft p-2">
                        <Database className="h-5 w-5 text-brand-deep" strokeWidth={2} />
                    </div>
                    <div>
                        <h3 className="font-bold text-ink">How Publishing Works</h3>
                        <p className="mt-1 text-sm text-ink-2">
                            The site ships with starter content. Anything you save here{" "}
                            <span className="font-bold text-brand-deep">overrides</span> the built-in
                            content instantly no rebuild, no developers, no downtime. All changes
                            are saved locally and applied immediately.
                        </p>
                    </div>
                </div>
            </div>

            {/* ===== ADMIN FEATURES ===== */}
            <div>
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted">
                    <Sparkles className="h-4 w-4" strokeWidth={2} />
                    Admin Features
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {adminFeatures.map((feature, i) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={i}
                                className="group rounded-xl2 border border-line bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-card"
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`rounded-full ${feature.bg} p-2.5`}>
                                        <Icon className={`h-4 w-4 ${feature.color}`} strokeWidth={2} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-ink">{feature.label}</h4>
                                        <p className="text-sm text-muted">{feature.description}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ===== QUICK GUIDES ===== */}
            <div>
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted">
                    <BookMarked className="h-4 w-4" strokeWidth={2} />
                    Quick Guides
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {quickGuides.map((guide, i) => (
                        <div
                            key={i}
                            className="rounded-xl2 border border-line bg-card p-4 transition-all hover:border-brand/20 hover:shadow-card"
                        >
                            <div className="mb-3 flex items-center gap-2">
                                <div className="rounded-full bg-brand-soft p-1.5">
                                    <guide.icon className="h-4 w-4 text-brand-deep" strokeWidth={2} />
                                </div>
                                <h4 className="font-bold text-ink">{guide.title}</h4>
                            </div>
                            <ul className="space-y-1.5">
                                {guide.items.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-ink-2">
                                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand/50" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* ===== BEST PRACTICES ===== */}
            <div>
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted">
                    <Lightbulb className="h-4 w-4 text-amber-500" strokeWidth={2} />
                    Best Practices
                </h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {bestPractices.map((practice, i) => {
                        const Icon = practice.icon;
                        return (
                            <div
                                key={i}
                                className="flex items-start gap-3 rounded-lg border border-line-soft bg-cream-2/30 px-4 py-3 transition-all hover:border-brand/20"
                            >
                                <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" strokeWidth={2} />
                                <p className="text-sm text-ink-2">{practice.text}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ===== QUICK TIPS ===== */}
            <div className="rounded-xl2 border border-accent-soft bg-accent-soft/20 p-5 sm:p-6">
                <div className="flex items-start gap-3">
                    <div className="rounded-full bg-accent-soft p-2.5">
                        <Zap className="h-5 w-5 text-accent-deep" strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-accent-deep">Pro Tips</h4>
                        <ul className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                            <li className="flex items-start gap-2 text-sm text-ink-2">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                                Use <span className="font-mono rounded bg-white/50 px-1.5 py-0.5 text-xs font-bold">## heading</span> for section titles
                            </li>
                            <li className="flex items-start gap-2 text-sm text-ink-2">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                                Set pass marks between <span className="font-bold">60-80%</span> for quizzes
                            </li>
                            <li className="flex items-start gap-2 text-sm text-ink-2">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                                Embed videos using the full <span className="font-mono rounded bg-white/50 px-1.5 py-0.5 text-xs font-bold">embed</span> URL
                            </li>
                            <li className="flex items-start gap-2 text-sm text-ink-2">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                                Always include <span className="font-bold">outcomes</span> so learners know what they'll achieve
                            </li>
                            <li className="flex items-start gap-2 text-sm text-ink-2">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                                Upload images in <span className="font-bold">JPG, PNG, WEBP</span> format
                            </li>
                            <li className="flex items-start gap-2 text-sm text-ink-2">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                                Use <span className="font-bold">drag & drop</span> for faster image uploads
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* ===== FOOTER NOTE ===== */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl2 border border-line bg-card p-4">
                <div className="flex items-center gap-2 text-xs text-muted">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" strokeWidth={2} />
                    <span>
                        All changes are saved locally. Use the{" "}
                        <span className="font-bold text-ink">Download JSON</span> button to backup your work.
                    </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted">
                    <Globe className="h-3.5 w-3.5" strokeWidth={2} />
                    <span>Live updates no restart needed</span>
                </div>
            </div>
        </div>
    );
}