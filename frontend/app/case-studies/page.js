// app/case-studies/page.jsx
import { getCaseStudies } from "@/lib/data";
import CaseStudiesClient from "../components/caseStudies/CaseStudiesClient";

export const metadata = {
    title: "Case Studies Real Finance Examples | Finance Platform Demo",
    description:
        "Explore real case studies from Grameen Bank, M-Pesa, Ørsted, and more. Learn from real organizations and their impact on microfinance and sustainable finance.",
    keywords:
        "finance case studies, microfinance cases, sustainable finance cases, real examples, Grameen Bank, M-Pesa, Ørsted",
    openGraph: {
        title: "Case Studies Real Finance Examples",
        description:
            "Explore real case studies from Grameen Bank, M-Pesa, Ørsted, and more.",
        url: "https://your-domain.com/case-studies",
    },
    twitter: {
        title: "Case Studies Real Finance Examples",
        description:
            "Explore real case studies from Grameen Bank, M-Pesa, Ørsted, and more.",
    },
};

export default async function CaseStudiesPage() {
    const cases = await getCaseStudies();

    return (
        <>
            {/* ========== HERO SECTION ========== */}
            <section className="relative overflow-hidden border-b border-line-soft bg-cream-2 py-16 sm:py-20 lg:py-[88px]">
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(600px 400px at 90% 20%, rgba(67,56,202,.06), transparent 60%), radial-gradient(500px 400px at 10% 80%, rgba(99,102,241,.05), transparent 55%)",
                    }}
                />
                <div className="relative mx-6 px-4 sm:px-6">
                    <div className="max-w-[48rem]">
                        <span className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.16em] text-brand-deep">
                            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                            Learn from real examples
                        </span>
                        <h1 className="mt-5 text-[2.2rem] font-extrabold leading-[1.08] tracking-tight text-ink sm:text-[2.8rem] lg:text-[3.6rem]">
                            Case studies
                        </h1>
                        <p className="mt-4 max-w-[55ch] text-base font-medium text-ink-2 sm:text-lg">
                            Real organisations, real numbers, real lessons from Grameen's
                            village groups to Ørsted's wind-farm pivot.
                        </p>
                    </div>
                </div>
            </section>

            {/* ========== CASES SECTION ========== */}
            <section className="py-14 sm:py-[78px]">
                <div className="mx-6 px-4 sm:px-6">
                    <CaseStudiesClient cases={cases} />
                </div>
            </section>
        </>
    );
}