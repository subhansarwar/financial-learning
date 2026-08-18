// app/admin/components/HelpPanel.jsx
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
    Zap
} from "lucide-react";

export default function HelpPanel() {
    const features = [
        {
            icon: BookOpen,
            label: "Courses",
            description: "Edit text, modules, lessons and quizzes. Saving updates the catalog automatically.",
            color: "text-blue-500",
            bg: "bg-blue-50",
        },
        {
            icon: Tags,
            label: "Topics",
            description: "Add a new topic here, then assign courses to it in the course editor. New topics appear across the site immediately.",
            color: "text-purple-500",
            bg: "bg-purple-50",
        },
        {
            icon: RefreshCw,
            label: "Reset",
            description: "Use Reset to built-in on any course to discard your override and restore the original.",
            color: "text-amber-500",
            bg: "bg-amber-50",
        },
        {
            icon: Download,
            label: "Backups",
            description: "Use Download JSON to keep a copy of any course on your computer.",
            color: "text-emerald-500",
            bg: "bg-emerald-50",
        },
    ];

    const lessonTypes = [
        {
            icon: FileText,
            label: "Reading",
            description: "Markdown text: ## heading, **bold**, - bullet, > quote, numbered lists.",
            color: "text-blue-500",
            bg: "bg-blue-50",
        },
        {
            icon: PlayCircle,
            label: "Video",
            description: "Paste a YouTube or Vimeo embed URL (e.g. https://www.youtube.com/embed/VIDEO_ID).",
            color: "text-rose-500",
            bg: "bg-rose-50",
        },
        {
            icon: ListChecks,
            label: "Quiz",
            description: "Questions with 4 choices each; learners must reach the pass mark. Explanations show after answering.",
            color: "text-amber-500",
            bg: "bg-amber-50",
        },
    ];

    const bestPractices = [
        {
            icon: Clock,
            text: "Keep lessons under ~10 minutes; plain language; one idea per lesson.",
        },
        {
            icon: Award,
            text: "Every course should end with a quiz so learners can complete it and earn a certificate.",
        },
        {
            icon: Shield,
            text: "Never give financial advice teach concepts, include the 'education not advice' spirit.",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-line-soft pb-4">
                <div className="rounded-full bg-brand-soft p-2.5">
                    <HelpCircle className="h-6 w-6 text-brand-deep" strokeWidth={2} />
                </div>
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                        How publishing works
                    </h2>
                    <p className="text-sm text-muted">
                        Everything you need to know about managing content on the platform
                    </p>
                </div>
            </div>

            {/* Overview */}
            <div className="rounded-lg border-l-4 border-brand bg-brand-soft/30 p-4">
                <div className="flex items-start gap-3">
                    <Database className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-deep" strokeWidth={2} />
                    <div>
                        <p className="text-sm font-medium text-ink-2">
                            <span className="font-bold text-ink">Built-in content:</span> The site ships with
                            starter content. Anything you save here <span className="font-bold text-brand-deep">overrides</span>{" "}
                            the built-in content instantly — no rebuild, no developers, no downtime.
                        </p>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted">
                    <Sparkles className="h-4 w-4" strokeWidth={2} />
                    Key Features
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {features.map((feature, i) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={i}
                                className="group rounded-xl2 border border-line bg-card p-4 transition-all duration-200 hover:border-brand/30 hover:shadow-card"
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`rounded-full ${feature.bg} p-2`}>
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

            {/* Lesson Types */}
            <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted">
                    <Layers className="h-4 w-4" strokeWidth={2} />
                    Lesson Types
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {lessonTypes.map((type, i) => {
                        const Icon = type.icon;
                        return (
                            <div
                                key={i}
                                className="rounded-xl2 border border-line bg-card p-4 transition-all duration-200 hover:border-brand/30 hover:shadow-card"
                            >
                                <div className={`inline-flex rounded-full ${type.bg} p-2`}>
                                    <Icon className={`h-4 w-4 ${type.color}`} strokeWidth={2} />
                                </div>
                                <h4 className="mt-2 font-bold text-ink">{type.label}</h4>
                                <p className="text-sm text-muted">{type.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Best Practices */}
            <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted">
                    <Lightbulb className="h-4 w-4 text-amber-500" strokeWidth={2} />
                    Good Practice
                </h3>
                <div className="space-y-2">
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

            {/* Quick Tips */}
            <div className="rounded-xl2 border border-accent-soft bg-accent-soft/20 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                    <div className="rounded-full bg-accent-soft p-2">
                        <Zap className="h-5 w-5 text-accent-deep" strokeWidth={2} />
                    </div>
                    <div>
                        <h4 className="font-bold text-accent-deep">Quick Tips</h4>
                        <ul className="mt-1 space-y-1 text-sm text-ink-2">
                            <li className="flex items-start gap-2">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                                Use <span className="font-mono text-xs font-bold bg-white/50 px-1.5 py-0.5 rounded">## heading</span> for section titles
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                                Embed videos using the full <span className="font-mono text-xs font-bold bg-white/50 px-1.5 py-0.5 rounded">embed</span> URL
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                                Set pass marks between <span className="font-bold">60-80%</span> for quizzes
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                                Always include <span className="font-bold">outcomes</span> so learners know what they'll achieve
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Footer Note */}
            <div className="flex items-center gap-2 text-xs text-muted">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" strokeWidth={2} />
                <span>
                    All changes are saved locally. Use the <span className="font-bold">Download JSON</span> button to backup your work.
                </span>
            </div>
        </div>
    );
}