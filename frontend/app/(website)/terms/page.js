// app/(website)/terms/page.js
import {
    AlertCircle,
    Award,
    Clock,
    Eye,
    Gavel,
    Globe,
    Shield,
    UserCheck
} from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "Terms & Disclaimer Finance Education | Finance Platform",
    description: "Read our terms of service and disclaimer. Education not advice. All content is for educational purposes only. Free, as-is service.",
    keywords: "terms of service, disclaimer, education not advice, finance education, legal",
    robots: "index, follow",
    openGraph: {
        title: "Terms & Disclaimer Finance Education",
        description: "Read our terms of service and disclaimer. Education not advice.",
        url: "https://your-domain.com/terms",
    },
    twitter: {
        title: "Terms & Disclaimer Finance Education",
        description: "Read our terms of service and disclaimer. Education not advice.",
    },
};

export default function TermsPage() {
    const sections = [
        {
            icon: Eye,
            title: "Education, not advice",
            desc: "Finance Platform Demo provides general financial education only. Nothing on this site constitutes financial, investment, legal, accounting or tax advice, and nothing is a recommendation or offer to buy, sell or use any financial product or service. Examples are illustrative and simplified.",
            color: "text-blue-500",
            bg: "bg-blue-50",
        },
        {
            icon: UserCheck,
            title: "Your decisions are yours",
            desc: "Financial decisions depend on your personal circumstances, jurisdiction and goals. Before making significant financial decisions, consult a qualified, licensed professional in your country. You are responsible for how you use what you learn here.",
            color: "text-purple-500",
            bg: "bg-purple-50",
        },
        {
            icon: AlertCircle,
            title: "No guarantees",
            desc: "We work hard to keep content accurate and current, but finance changes fast and we cannot guarantee that every figure, rule or example reflects the latest regulation or market condition. Tools show illustrations, not predictions.",
            color: "text-amber-500",
            bg: "bg-amber-50",
        },
        {
            icon: Award,
            title: "Certificates",
            desc: "Finance Platform Demo certificates recognise completion of a free educational course. They are not accredited qualifications, carry no academic credit, and may not be accepted by employers or institutions as formal credentials.",
            color: "text-emerald-500",
            bg: "bg-emerald-50",
        },
        {
            icon: Shield,
            title: "Free service, as-is",
            desc: "Finance Platform Demo is provided free of charge, 'as is', without warranties of any kind. We may add, change or remove courses and features over time. To the extent permitted by law, we accept no liability for losses arising from use of the site.",
            color: "text-brand",
            bg: "bg-brand-soft",
        },
        {
            icon: Globe,
            title: "Third-party content",
            desc: "Embedded videos and linked sites are the responsibility of their own publishers and are covered by their own terms and policies.",
            color: "text-cyan-500",
            bg: "bg-cyan-50",
        },
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
                        <Gavel className="h-3.5 w-3.5" strokeWidth={2.5} />
                        Terms & disclaimer
                    </span>
                    <h1 className="mt-5 text-[2.2rem] font-extrabold leading-[1.08] tracking-tight text-ink sm:text-[2.8rem] lg:text-[3.6rem]">
                        The important fine print,{" "}
                        <span className="text-brand-gradient">in normal words</span>.
                    </h1>
                    <p className="mt-4 text-base font-medium text-ink-2 sm:text-lg">
                        Read our terms of service and disclaimer. All content is for
                        educational purposes only.
                    </p>
                </div>

                {/* Content */}
                <div className="mx-auto mt-10 max-w-3xl sm:mt-14">
                    <div className="space-y-4">
                        {sections.map((section, i) => {
                            const Icon = section.icon;
                            return (
                                <div
                                    key={i}
                                    className="rounded-xl2 border border-line bg-card p-6 shadow-sm transition-all hover:border-brand/30 hover:shadow-card sm:p-8"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`rounded-full ${section.bg} p-2.5`}>
                                            <Icon className={`h-5 w-5 ${section.color}`} strokeWidth={2} />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold tracking-tight text-ink sm:text-xl">
                                                {section.title}
                                            </h2>
                                            <p className="mt-2 text-sm font-medium leading-relaxed text-ink-2 sm:text-base">
                                                {section.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Last updated */}
                    <div className="mt-8 flex items-center justify-between rounded-lg border border-line-soft bg-card p-4 sm:p-5">
                        <div className="flex items-center gap-2.5">
                            <Clock className="h-4 w-4 text-muted" strokeWidth={2} />
                            <span className="text-sm font-medium text-muted">
                                Last updated: {new Date().getFullYear()}
                            </span>
                        </div>
                        <Link
                            href="/privacy"
                            className="text-sm font-bold text-brand-deep transition-colors hover:underline"
                        >
                            View Privacy Policy →
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}