// app/(website)/privacy/page.js
import LegalPageShell from "../../components/websiteComp/legal/LegalPageShell";

export const metadata = {
    title: "Privacy Policy | The Eco Lens",
    description:
        "How The Eco Lens collects, uses and protects your data across our free finance education platform. Plain-language, GDPR and CCPA aligned.",
    keywords:
        "privacy policy, data protection, GDPR, CCPA, finance education, edtech privacy, learner data",
    robots: "index, follow",
    openGraph: {
        title: "Privacy Policy | The Eco Lens",
        description:
            "How we collect, use and protect your data on our free finance education platform.",
        url: "https://your-domain.com/privacy",
    },
};

const LAST_UPDATED = "August 2026";

const sections = [
    {
        id: "overview",
        title: "Overview & scope",
        icon: "ShieldCheck",
        blocks: [
            {
                type: "p",
                text: "The Eco Lens (“we”, “us”, “our”) runs a free online platform for learning about microfinance and sustainable finance. This Privacy Policy explains what personal data we process when you visit the site, create an account, take a course or use our financial tools, and the choices you have.",
            },
            {
                type: "p",
                text: "It applies to the website, learner dashboard and any related pages that link to this policy. It does not apply to third-party sites we link to, which run under their own policies.",
            },
            {
                type: "note",
                tone: "green",
                text: "Short version: we collect the minimum needed to run an education service, we never sell your data, and you can access, export or delete your account information at any time.",
            },
        ],
    },
    {
        id: "who-we-are",
        title: "Who is responsible for your data",
        icon: "Scale",
        blocks: [
            {
                type: "p",
                text: "The Eco Lens is the data controller for personal data processed through this platform. For data-protection questions, contact our privacy team using the details in the “Contact us” section below.",
            },
            {
                type: "p",
                text: "Where we use service providers to operate the platform (hosting, email delivery, error monitoring), those providers act as data processors and may only use your data on our instructions.",
            },
        ],
    },
    {
        id: "data-we-collect",
        title: "Data we collect",
        icon: "Database",
        blocks: [
            { type: "subhead", text: "You give us directly" },
            {
                type: "list",
                items: [
                    { term: "Account details:", text: "name, email address and a hashed password when you register, or a Google account identifier if you sign in with Google." },
                    { term: "Profile information:", text: "any optional details you add, such as a display name, country or learning goals." },
                    { term: "Learning activity:", text: "courses you enrol in, lessons and quizzes you complete, scores, and the name you choose to appear on certificates." },
                    { term: "Communications:", text: "messages you send us for support, feedback or partnership enquiries." },
                ],
            },
            { type: "subhead", text: "Collected automatically" },
            {
                type: "list",
                items: [
                    { term: "Device and log data:", text: "IP address, browser type, operating system, referring page and timestamps, kept in server logs for security and troubleshooting." },
                    { term: "Usage analytics:", text: "aggregated, privacy-friendly statistics about which pages and lessons are used, so we can improve the curriculum." },
                    { term: "Cookies and local storage:", text: "small identifiers used to keep you signed in and remember preferences — see our Cookies Policy for the full list." },
                ],
            },
            {
                type: "note",
                tone: "amber",
                text: "We do not intentionally collect special-category data (such as health, ethnicity or political views) and ask that you not submit it through free-text fields.",
            },
        ],
    },
    {
        id: "how-we-use",
        title: "How we use your data",
        icon: "UserCog",
        blocks: [
            {
                type: "list",
                items: [
                    { term: "Provide the service:", text: "create your account, deliver courses, track progress and issue certificates." },
                    { term: "Improve learning:", text: "understand which lessons work, fix confusing content and plan new courses using aggregated data." },
                    { term: "Keep the platform secure:", text: "detect abuse, prevent fraud, debug errors and protect learners." },
                    { term: "Communicate with you:", text: "send account and service messages, respond to support requests and — only if you opt in — occasional product updates." },
                    { term: "Meet legal obligations:", text: "keep records we are required to keep and respond to lawful requests." },
                ],
            },
        ],
    },
    {
        id: "legal-bases",
        title: "Legal bases for processing (GDPR)",
        icon: "Scale",
        blocks: [
            {
                type: "p",
                text: "If you are in the UK or European Economic Area, we rely on the following legal bases:",
            },
            {
                type: "list",
                items: [
                    { term: "Contract:", text: "processing needed to give you an account and deliver the courses you request." },
                    { term: "Legitimate interests:", text: "keeping the platform secure, preventing abuse and improving our content, balanced against your rights." },
                    { term: "Consent:", text: "optional analytics and preference cookies, and any marketing email — you can withdraw consent at any time." },
                    { term: "Legal obligation:", text: "retaining certain records and responding to valid legal requests." },
                ],
            },
        ],
    },
    {
        id: "cookies",
        title: "Cookies & similar technologies",
        icon: "Cookie",
        blocks: [
            {
                type: "p",
                text: "We use strictly necessary cookies to run the site and, with your consent, preference and privacy-friendly analytics cookies. We do not use advertising cookies or third-party ad networks.",
            },
            {
                type: "note",
                tone: "blue",
                text: "You can review every cookie and change your choices on the Cookies Policy page at any time.",
            },
        ],
    },
    {
        id: "sharing",
        title: "When we share data",
        icon: "Globe2",
        blocks: [
            {
                type: "p",
                text: "We do not sell your personal data and we do not share it for others’ marketing. We share limited data only in these cases:",
            },
            {
                type: "list",
                items: [
                    { term: "Service providers:", text: "hosting, email delivery, error monitoring and analytics vendors bound by contract to protect it." },
                    { term: "Embedded content:", text: "when a lesson embeds a video, the provider (for example YouTube) receives your request for that video under its own policy." },
                    { term: "Legal and safety:", text: "where required by law, or to protect the rights, safety and security of learners and the platform." },
                    { term: "Business transfers:", text: "if the project is transferred to a new operator, data would move with it under this same policy." },
                ],
            },
        ],
    },
    {
        id: "transfers",
        title: "International data transfers",
        icon: "Server",
        blocks: [
            {
                type: "p",
                text: "Our providers may process data in countries outside your own. Where that happens, we rely on recognised safeguards — such as an adequacy decision or Standard Contractual Clauses — to ensure your data keeps an equivalent level of protection.",
            },
        ],
    },
    {
        id: "retention",
        title: "How long we keep it",
        icon: "RefreshCw",
        blocks: [
            {
                type: "list",
                items: [
                    { term: "Account and learning data:", text: "kept while your account is active, then deleted or anonymised within 12 months of account closure." },
                    { term: "Server logs:", text: "typically retained for up to 90 days, longer only where needed to investigate an incident." },
                    { term: "Support messages:", text: "kept for up to 24 months to help with follow-up questions." },
                ],
            },
        ],
    },
    {
        id: "your-rights",
        title: "Your rights & choices",
        icon: "UserCog",
        blocks: [
            {
                type: "p",
                text: "Depending on where you live, you have some or all of these rights over your personal data:",
            },
            {
                type: "list",
                items: [
                    "Access a copy of the data we hold about you.",
                    "Correct information that is inaccurate or incomplete.",
                    "Delete your account and associated data.",
                    "Export your data in a portable format.",
                    "Object to or restrict certain processing, and withdraw consent.",
                    "Opt out of the “sale” or “sharing” of personal information (we do neither) under US state laws such as the CCPA/CPRA.",
                ],
            },
            {
                type: "p",
                text: "Most actions are available directly in your dashboard settings. For anything else, contact us and we will respond within the timeframe the law requires (usually 30 days). You also have the right to complain to your local data-protection authority.",
            },
        ],
    },
    {
        id: "security",
        title: "How we protect your data",
        icon: "Lock",
        blocks: [
            {
                type: "list",
                items: [
                    "Encryption in transit (HTTPS) across the whole platform.",
                    "Passwords stored only as salted hashes, never in plain text.",
                    "Access to production data limited to staff who need it, with logging.",
                    "Regular dependency updates and monitoring for suspicious activity.",
                ],
            },
            {
                type: "note",
                tone: "amber",
                text: "No system is perfectly secure. If we ever discover a breach affecting your data, we will notify you and the relevant authority as required by law.",
            },
        ],
    },
    {
        id: "children",
        title: "Children’s privacy",
        icon: "Baby",
        blocks: [
            {
                type: "p",
                text: "The platform is intended for users aged 16 and over. We do not knowingly collect data from children under 16. If you believe a child has given us personal data, contact us and we will delete it.",
            },
        ],
    },
    {
        id: "changes",
        title: "Changes to this policy",
        icon: "RefreshCw",
        blocks: [
            {
                type: "p",
                text: "We may update this policy as the platform evolves or the law changes. We will post the new version here and update the date at the top. For material changes we will give prominent notice, such as an in-app message or email.",
            },
        ],
    },
    {
        id: "contact",
        title: "Contact us",
        icon: "Mail",
        blocks: [
            {
                type: "p",
                text: "For privacy questions or to exercise your rights, reach the team through the contact channels listed on our About page. We aim to reply within a few working days.",
            },
        ],
    },
];

export default function PrivacyPage() {
    return (
        <LegalPageShell
            badge="Privacy Policy"
            badgeIcon="ShieldCheck"
            title={
                <>
                    Learning about money, <span className="text-[#72BB83]">without giving up your privacy</span>.
                </>
            }
            intro="This policy explains, in plain language, what data The Eco Lens collects, why we collect it, how long we keep it and the control you have over it."
            lastUpdated={LAST_UPDATED}
            readTime="7 min read"
            sections={sections}
            relatedLinks={[
                ["Terms & Conditions", "/terms"],
                ["Cookies Policy", "/cookies"],
                ["About The Eco Lens", "/about"],
            ]}
        />
    );
}
