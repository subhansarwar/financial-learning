// app/about/page.jsx
import {
    ArrowRight,
    Award,
    BarChart3,
    BookOpen,
    Building2,
    Eye,
    Globe,
    GraduationCap,
    HandCoins,
    Heart,
    Leaf,
    Lock,
    Shield,
    Sparkles,
    Target,
    Zap
} from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "About Free Finance Education Platform | Finance Platform",
    description:
        "Learn about our mission: free, clear, and accessible finance education for everyone. No paywalls, no accounts required, private by design.",
    keywords:
        "about finance platform, free finance education, mission, microfinance, sustainable finance",
    openGraph: {
        title: "About Free Finance Education Platform",
        description: "Finance education should be free, clear and for everyone.",
        url: "https://your-domain.com/about",
    },
    twitter: {
        title: "About Free Finance Education Platform",
        description: "Finance education should be free, clear and for everyone.",
    },
};

export default function AboutPage() {
    const promises = [
        {
            icon: Sparkles,
            title: "Free, completely",
            desc: "No payments, no subscriptions, no locked lessons, no 'premium' tier.",
            color: "text-emerald-500",
            bg: "bg-emerald-50",
        },
        {
            icon: BookOpen,
            title: "Plain language",
            desc: "Written to be understood on first read, whatever your background.",
            color: "text-blue-500",
            bg: "bg-blue-50",
        },
        {
            icon: Lock,
            title: "Private by design",
            desc: "No accounts. Your progress stays on your device.",
            color: "text-purple-500",
            bg: "bg-purple-50",
        },
        {
            icon: Shield,
            title: "Honest about limits",
            desc: "We teach concepts. We never tell you what to buy.",
            color: "text-amber-500",
            bg: "bg-amber-50",
        },
    ];

    const topics = [
        { icon: HandCoins, label: "Personal Finance", color: "text-blue-500" },
        { icon: Leaf, label: "Sustainable Finance", color: "text-emerald-500" },
        { icon: Building2, label: "Banking", color: "text-purple-500" },
        { icon: BarChart3, label: "Investing", color: "text-amber-500" },
        { icon: Zap, label: "Fintech", color: "text-cyan-500" },
        { icon: Globe, label: "Islamic Finance", color: "text-indigo-500" },
    ];

    return (
        <section className="relative overflow-hidden bg-cream py-12 sm:py-16 lg:py-20">
            {/* Background decorations */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-[20%] -top-[30%] h-[600px] w-[600px] rounded-full bg-gradient-radial from-brand/6 to-transparent" />
                <div className="absolute -right-[20%] -bottom-[30%] h-[600px] w-[600px] rounded-full bg-gradient-radial from-brand/5 to-transparent" />
            </div>

            <div className="relative mx-auto max-w-[1180px] px-4 sm:px-6">
                {/* Header */}
                <div className="mx-auto max-w-3xl text-center">
                    <span className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.16em] text-brand-deep">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                        About the Platform
                    </span>
                    <h1 className="mt-5 text-[2.2rem] font-extrabold leading-[1.08] tracking-tight text-ink sm:text-[2.8rem] lg:text-[3.6rem]">
                        Finance education should be <br className="hidden sm:block" />
                        <span className="text-brand-gradient">free, clear</span> and{" "}
                        <span className="text-brand-gradient">for everyone</span>.
                    </h1>
                </div>

                {/* Content */}
                <div className="mx-auto mt-10 max-w-3xl sm:mt-14">
                    {/* Main content */}
                    <div className="prose prose-ink max-w-none">
                        <p className="text-lg font-medium leading-relaxed text-ink-2">
                            The Finance Platform Demo is a free online school for microfinance and
                            sustainable finance. We believe the gap between people who understand
                            money and people who don't is not about intelligence it's about
                            access to clear, honest teaching. So we built the school we wished
                            existed.
                        </p>
                    </div>

                    {/* Topics covered */}
                    <div className="mt-10">
                        <div className="mb-4 flex items-center gap-2.5">
                            <div className="rounded-full bg-brand-soft p-2">
                                <Target className="h-5 w-5 text-brand-deep" strokeWidth={2} />
                            </div>
                            <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                                What we cover
                            </h2>
                        </div>
                        <p className="text-base font-medium text-ink-2">
                            Personal finance, sustainable finance, banking, investing, fintech,
                            Islamic finance and more topics added over time. Every course is
                            split into modules and bite-size lessons: short readings, videos and
                            quizzes, designed to work as well on a phone as on a desktop.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {topics.map((topic, i) => (
                                <span
                                    key={i}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3.5 py-1.5 text-xs font-semibold text-ink-2"
                                >
                                    <topic.icon className={`h-3.5 w-3.5 ${topic.color}`} strokeWidth={2.5} />
                                    {topic.label}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Our promises */}
                    <div className="mt-12">
                        <div className="mb-4 flex items-center gap-2.5">
                            <div className="rounded-full bg-brand-soft p-2">
                                <Heart className="h-5 w-5 text-brand-deep" strokeWidth={2} />
                            </div>
                            <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                                Our promises
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {promises.map((promise, i) => {
                                const Icon = promise.icon;
                                return (
                                    <div
                                        key={i}
                                        className="flex items-start gap-3 rounded-lg border border-line-soft bg-card p-4 transition-all hover:border-brand/30 hover:shadow-card"
                                    >
                                        <div className={`rounded-full ${promise.bg} p-2`}>
                                            <Icon className={`h-4 w-4 ${promise.color}`} strokeWidth={2} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-ink">{promise.title}</h3>
                                            <p className="text-sm text-muted">{promise.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Education not advice */}
                    <div className="mt-12 rounded-xl2 border border-line bg-card p-6 shadow-card sm:p-8">
                        <div className="flex items-start gap-3">
                            <div className="rounded-full bg-brand-soft p-2.5">
                                <Eye className="h-5 w-5 text-brand-deep" strokeWidth={2} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                                    Education, not advice
                                </h2>
                                <p className="mt-2 text-base font-medium leading-relaxed text-ink-2">
                                    Everything on this platform is general financial education.
                                    Nothing here is financial, investment, legal or tax advice, or a
                                    recommendation of any product or provider. Money decisions depend
                                    on your circumstances, your country and your goals for those,
                                    speak to a licensed professional.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Certificates */}
                    <div className="mt-10 rounded-xl2 border border-accent-soft bg-accent-soft/30 p-6 sm:p-8">
                        <div className="flex items-start gap-3">
                            <div className="rounded-full bg-accent-soft p-2.5">
                                <Award className="h-5 w-5 text-accent-deep" strokeWidth={2} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                                    Certificates
                                </h2>
                                <p className="mt-2 text-base font-medium leading-relaxed text-ink-2">
                                    Finish a course and you can download a free certificate of
                                    completion. It recognises your effort and learning it is not an
                                    accredited qualification, and we say so on the certificate itself.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Call to action */}
                    <div className="mt-12 flex flex-wrap gap-3 border-t border-line-soft pt-10">
                        <Link
                            href="/catalog"
                            className="inline-flex items-center gap-2 rounded-full bg-brand-deep px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#241f6b]"
                        >
                            <GraduationCap className="h-4 w-4" strokeWidth={2.5} />
                            Start learning free
                            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                        </Link>
                        <Link
                            href="/tools"
                            className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-6 py-3 text-sm font-bold text-ink-2 transition-colors hover:border-brand/40 hover:bg-brand-soft/30 hover:text-brand-deep"
                        >
                            <BarChart3 className="h-4 w-4" strokeWidth={2.5} />
                            Try the tools
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}