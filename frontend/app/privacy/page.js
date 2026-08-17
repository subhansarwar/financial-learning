export const metadata = {
    title: "Privacy Policy Private by Design | Finance Platform Demo",
    description: "We don't collect your data. No accounts, no tracking, no analytics. Your progress stays on your device. Read our full privacy policy.",
    keywords: "privacy policy, data privacy, no tracking, local storage, finance education",
    robots: "index, follow",
};

export default function PrivacyPage() {
    return (
        <section className="section tight" style={{ paddingTop: "56px" }}>
            <div className="wrap-narrow">
                <span className="overline">Privacy</span>
                <h1 className="section-title" style={{ marginBottom: "18px" }}>Private by design.</h1>
                <div className="prose">
                    <p>Finance Platform Demo is built so that learning about money doesn't cost you your data. This page explains, in plain language, exactly what we collect and what we don't.</p>

                    <h2>What we don't collect</h2>
                    <ul>
                        <li>No accounts, no email addresses, no passwords.</li>
                        <li>No tracking pixels, no advertising networks, no data brokers.</li>
                        <li>No analytics that identify you.</li>
                    </ul>

                    <h2>What stays on your device</h2>
                    <p>Your course progress, quiz scores and the name you choose for certificates are stored in your own browser's local storage. This data <b>never leaves your device</b> — we can't see it, and there is no server database of learners to breach.</p>
                    <ul>
                        <li>Clearing your browser's site data resets your progress.</li>
                        <li>Progress does not sync between devices (that's the trade-off of having no accounts).</li>
                    </ul>

                    <h2>Third-party content</h2>
                    <p>Some lessons embed videos from YouTube. When you play a video, YouTube may set its own cookies under its own privacy policy. We embed videos using standard players; you can choose not to play them.</p>
                    <p>Fonts are loaded from Google Fonts. Your browser connects to Google to fetch them.</p>

                    <h2>Your rights</h2>
                    <p>Because we hold no personal data about you, there is nothing to request, correct or delete on our side — the delete button is in your own browser settings. If you have questions about this policy, contact the team through the channels listed on the About page.</p>

                    <p className="text-muted" style={{ fontSize: ".9rem" }}>Last updated: 2026. This policy may evolve as Finance Platform Demo grows; the principle won't.</p>
                </div>
            </div>
        </section>
    );
}