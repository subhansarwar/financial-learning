// app/(website)/about/page.jsx
import AboutHeroSection from "../../components/websiteComp/aboutComp/AboutHeroSection";
import AboutStorySection from "../../components/websiteComp/aboutComp/AboutStorySection";
import AboutUsFinanceSection from "../../components/websiteComp/aboutComp/Aboutusfinancesection";
import CoreValuesSection from "../../components/websiteComp/aboutComp/CoreValuesSection";
import CtaAndCertificateSection from "../../components/websiteComp/aboutComp/Ctaandcertificatesection";

export const metadata = {
    title: "About Free Finance Education Platform | The Eco Lens",
    description:
        "Learn about our mission: free, clear, and accessible finance education for everyone. No paywalls, no accounts required, private by design.",
    keywords:
        "about The Eco Lens, free finance education, mission, microfinance, sustainable finance",
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

    return (
        <>
            <AboutHeroSection />
            <CoreValuesSection />
            <AboutUsFinanceSection />
            <AboutStorySection />
            <CtaAndCertificateSection />
        </>
    );
}