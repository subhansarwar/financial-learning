// app/case-studies/page.js
import { getCaseStudies } from "@/lib/data";
import CaseStudiesClient from "../components/caseStudies/CaseStudiesClient";

export const metadata = {
    title: "Case Studies Real Finance Examples | Finance Platform Demo",
    description: "Explore real case studies from Grameen Bank, M-Pesa, Ørsted, and more. Learn from real organizations and their impact on microfinance and sustainable finance.",
    keywords: "finance case studies, microfinance cases, sustainable finance cases, real examples, Grameen Bank, M-Pesa, Ørsted",
    openGraph: {
        title: "Case Studies Real Finance Examples",
        description: "Explore real case studies from Grameen Bank, M-Pesa, Ørsted, and more.",
        url: "https://your-domain.com/case-studies",
    },
    twitter: {
        title: "Case Studies Real Finance Examples",
        description: "Explore real case studies from Grameen Bank, M-Pesa, Ørsted, and more.",
    },
};

export default async function CaseStudiesPage() {
    const cases = await getCaseStudies();

    return (
        <>
            <section className="page-hero">
                <div className="wrap">
                    <h1>Case studies</h1>
                    <p className="tagline">
                        Real organisations, real numbers, real lessons — from Grameen's village groups to Ørsted's wind-farm pivot.
                    </p>
                </div>
            </section>

            <section className="section tight">
                <div className="wrap">
                    <CaseStudiesClient cases={cases} />
                </div>
            </section>
        </>
    );
}