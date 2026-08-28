// app/(website)/case-studies/page.jsx
import { getCaseStudies } from "@/lib/data";
import CaseStudiesClient from "../../components/caseStudies/CaseStudiesClient";
import ClientHeroSection from "../../components/websiteComp/clientHeroSectionCaseStudy/ClientHeroSection";

export const metadata = {
    title: "Case Studies — Real Finance Examples | The Eco Lens",
    description:
        "Explore real case studies from Grameen Bank, M-Pesa, Ørsted, and more. Learn from real organizations and their impact on microfinance and sustainable finance.",
    keywords:
        "finance case studies, microfinance cases, sustainable finance cases, real examples, Grameen Bank, M-Pesa, Ørsted",
    openGraph: {
        title: "Case Studies — Real Finance Examples",
        description:
            "Explore real case studies from Grameen Bank, M-Pesa, Ørsted, and more.",
        url: "https://your-domain.com/case-studies",
    },
    twitter: {
        title: "Case Studies — Real Finance Examples",
        description:
            "Explore real case studies from Grameen Bank, M-Pesa, Ørsted, and more.",
    },
};

export default async function CaseStudiesPage() {
    const cases = await getCaseStudies();

    return (
        <>
            {/* ========== MODERN HERO SECTION ========== */}
            <ClientHeroSection cases={cases} />

            {/* ========== CASES SECTION ========== */}
            <section className="bg-[#E6FBF1] py-14 sm:py-[78px]">
                <div className="mx-6 px-4 sm:px-6">
                    <CaseStudiesClient cases={cases} />
                </div>
            </section>
        </>
    );
}