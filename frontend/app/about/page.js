// app/about/page.js
import Link from "next/link";

export const metadata = {
    title: "About Free Finance Education Platform | Finance Platform",
    description: "Learn about our mission: free, clear, and accessible finance education for everyone. No paywalls, no accounts required, private by design.",
    keywords: "about finance platform, free finance education, mission, microfinance, sustainable finance",
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
        <section className="section tight" style={{ paddingTop: "56px" }}>
            <div className="wrap-narrow">
                <span className="overline">About the Platform</span>
                <h1 className="section-title" style={{ marginBottom: "18px" }}>
                    Finance education should be free, clear and for everyone.
                </h1>
                <AboutContent />
                <AboutActions />
            </div>
        </section>
    );
}

// Content Component
function AboutContent() {
    return (
        <div className="prose">
            <p>
                The Finance Platform Demo is a free online school for microfinance and sustainable finance.
                We believe the gap between people who understand money and people who don't is not about
                intelligence — it's about access to clear, honest teaching. So we built the school we wished
                existed.
            </p>

            <h2>What we cover</h2>
            <p>
                Personal finance, sustainable finance, banking, investing, fintech, Islamic finance — and
                more topics added over time. Every course is split into modules and bite-size lessons:
                short readings, videos and quizzes, designed to work as well on a phone as on a desktop.
            </p>

            <h2>Our promises</h2>
            <ul>
                <li>
                    <b>Free, completely.</b> No payments, no subscriptions, no locked lessons, no "premium" tier.
                </li>
                <li>
                    <b>Plain language.</b> Written to be understood on first read, whatever your background.
                </li>
                <li>
                    <b>Private by design.</b> No accounts. Your progress stays on your device.
                </li>
                <li>
                    <b>Honest about limits.</b> We teach concepts. We never tell you what to buy.
                </li>
            </ul>

            <h2>Education, not advice</h2>
            <p>
                Everything on this platform is general financial education. Nothing here is financial,
                investment, legal or tax advice, or a recommendation of any product or provider. Money
                decisions depend on your circumstances, your country and your goals — for those, speak
                to a licensed professional.
            </p>

            <h2>Certificates</h2>
            <p>
                Finish a course and you can download a free certificate of completion. It recognises your
                effort and learning — it is not an accredited qualification, and we say so on the
                certificate itself.
            </p>
        </div>
    );
}

// Actions Component
function AboutActions() {
    return (
        <div className="mt-3" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link className="btn btn-primary" href="/catalog">
                Start learning — free
            </Link>
            <Link className="btn btn-outline" href="/tools">
                Try the tools
            </Link>
        </div>
    );
}