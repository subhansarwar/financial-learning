// app/terms/page.js
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
    return (
        <section className="section tight" style={{ paddingTop: "56px" }}>
            <div className="wrap-narrow">
                <span className="overline">Terms & disclaimer</span>
                <h1 className="section-title" style={{ marginBottom: "18px" }}>
                    The important fine print, in normal words.
                </h1>
                <div className="prose">
                    <TermsContent />
                    <LastUpdated />
                </div>
            </div>
        </section>
    );
}

// Terms Content Component
function TermsContent() {
    return (
        <>
            <h2>1. Education, not advice</h2>
            <p>
                Finance Platform Demo provides general financial education only. Nothing on this site — courses,
                lessons, quizzes, tools, or example numbers constitutes financial, investment, legal, accounting
                or tax advice, and nothing is a recommendation or offer to buy, sell or use any financial product
                or service. Examples are illustrative and simplified.
            </p>

            <h2>2. Your decisions are yours</h2>
            <p>
                Financial decisions depend on your personal circumstances, jurisdiction and goals. Before making
                significant financial decisions, consult a qualified, licensed professional in your country. You
                are responsible for how you use what you learn here.
            </p>

            <h2>3. No guarantees</h2>
            <p>
                We work hard to keep content accurate and current, but finance changes fast and we cannot guarantee
                that every figure, rule or example reflects the latest regulation or market condition. Tools such
                as the compound interest calculator show illustrations, not predictions; markets may perform better
                or worse than any example.
            </p>

            <h2>4. Certificates</h2>
            <p>
                Finance Platform Demo certificates recognise completion of a free educational course. They are{' '}
                <b>not accredited qualifications</b>, carry no academic credit, and may not be accepted by employers
                or institutions as formal credentials.
            </p>

            <h2>5. Free service, as-is</h2>
            <p>
                Finance Platform Demo is provided free of charge, "as is", without warranties of any kind. We may
                add, change or remove courses and features over time. To the extent permitted by law, we accept no
                liability for losses arising from use of the site.
            </p>

            <h2>6. Third-party content</h2>
            <p>
                Embedded videos and linked sites are the responsibility of their own publishers and are covered
                by their own terms and policies.
            </p>
        </>
    );
}

// Last Updated Component
function LastUpdated() {
    return (
        <p className="text-muted" style={{ fontSize: ".9rem", marginTop: "24px" }}>
            Last updated: {new Date().getFullYear()}.
        </p>
    );
}