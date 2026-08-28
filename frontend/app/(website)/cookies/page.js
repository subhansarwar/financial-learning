// app/(website)/cookies/page.js
import LegalPageShell from "../../components/websiteComp/legal/LegalPageShell";
import CookiePreferences from "../../components/websiteComp/legal/CookiePreferences";

export const metadata = {
    title: "Cookies Policy | The Eco Lens",
    description:
        "What cookies and local storage The Eco Lens uses, why we use them, how long they last and how to control them. No advertising cookies.",
    keywords:
        "cookies policy, cookie consent, local storage, tracking, finance education, GDPR cookies",
    robots: "index, follow",
    openGraph: {
        title: "Cookies Policy | The Eco Lens",
        description:
            "What cookies we use, why, and how to control them. No advertising cookies.",
        url: "https://your-domain.com/cookies",
    },
};

const LAST_UPDATED = "August 2026";

const sections = [
    {
        id: "what-are-cookies",
        title: "What cookies are",
        icon: "Cookie",
        blocks: [
            {
                type: "p",
                text: "Cookies are small text files a website stores on your device. They let a site remember things between page loads and visits — like the fact that you are signed in. We also use similar technologies such as your browser’s local storage, and this policy covers those too.",
            },
            {
                type: "list",
                items: [
                    { term: "First-party:", text: "set by The Eco Lens." },
                    { term: "Third-party:", text: "set by another service whose content appears on a page, such as an embedded video." },
                    { term: "Session:", text: "deleted when you close your browser." },
                    { term: "Persistent:", text: "stay until they expire or you clear them." },
                ],
            },
        ],
    },
    {
        id: "how-we-use",
        title: "How we use cookies",
        icon: "Settings2",
        blocks: [
            {
                type: "p",
                text: "We keep our use of cookies deliberately small. We use them to run the platform, remember your preferences and understand how the courses are used so we can improve them.",
            },
            {
                type: "note",
                tone: "green",
                text: "We do not use advertising cookies, we are not part of any ad network, and we do not sell data collected through cookies.",
            },
        ],
    },
    {
        id: "categories",
        title: "Categories of cookies we use",
        icon: "SlidersHorizontal",
        blocks: [
            {
                type: "table",
                head: ["Category", "Purpose", "Consent"],
                rows: [
                    ["Strictly necessary", "Sign-in sessions, security tokens, load balancing, remembering your place in a course.", "Always active"],
                    ["Preferences", "Remembers choices such as layout, language and dismissed banners.", "Optional"],
                    ["Analytics", "Aggregated, privacy-friendly usage statistics about lessons and pages.", "Optional"],
                    ["Marketing / attribution", "Measures whether a campaign or partner link referred you. Off by default.", "Optional"],
                ],
            },
        ],
    },
    {
        id: "specific-cookies",
        title: "Examples of specific cookies",
        icon: "Cookie",
        blocks: [
            {
                type: "table",
                head: ["Name", "Type", "Duration", "What it does"],
                rows: [
                    ["ecolens.session", "Necessary", "Session", "Keeps you signed in during a visit."],
                    ["ecolens.csrf", "Necessary", "Session", "Protects forms against cross-site request forgery."],
                    ["ecolens.cookiePrefs", "Necessary", "12 months", "Stores the cookie choices you make on this page."],
                    ["ecolens.theme", "Preferences", "12 months", "Remembers display and layout preferences."],
                    ["_ecl_stats", "Analytics", "13 months", "Anonymous identifier for aggregated usage stats."],
                ],
            },
            {
                type: "note",
                tone: "blue",
                text: "Exact names and durations can change as we update the platform. This table is kept broadly accurate and reviewed regularly.",
            },
        ],
    },
    {
        id: "third-party",
        title: "Third-party cookies",
        icon: "Globe2",
        blocks: [
            {
                type: "p",
                text: "Some lessons embed content from other services. When that content loads, the provider may set its own cookies under its own policy:",
            },
            {
                type: "list",
                items: [
                    { term: "Video embeds (e.g. YouTube):", text: "set when you play an embedded video, for playback and their own analytics." },
                    { term: "Web fonts / CDNs:", text: "your browser connects to the provider to fetch assets; this can involve technical cookies." },
                ],
            },
            {
                type: "p",
                text: "We choose privacy-respecting embed options where they are available, but we do not control third-party cookies. Check the provider’s policy for detail and controls.",
            },
        ],
    },
    {
        id: "managing",
        title: "Managing your choices",
        icon: "SlidersHorizontal",
        blocks: [
            {
                type: "list",
                items: [
                    { term: "On this page:", text: "use the preferences panel above to turn optional categories on or off. Your choice is saved on this device." },
                    { term: "In your browser:", text: "every major browser lets you block or delete cookies in its settings. Blocking strictly necessary cookies will break sign-in and course progress." },
                    { term: "Device controls:", text: "clearing site data or using private browsing removes stored identifiers when the window closes." },
                ],
            },
        ],
    },
    {
        id: "do-not-track",
        title: "“Do Not Track” & global signals",
        icon: "ShieldCheck",
        blocks: [
            {
                type: "p",
                text: "Because we run no advertising cookies and no cross-site tracking, there is little for a “Do Not Track” or Global Privacy Control signal to limit. Where such a signal is legally recognised, we treat it as a request to keep optional analytics and attribution cookies off.",
            },
        ],
    },
    {
        id: "retention",
        title: "How long cookies last",
        icon: "Timer",
        blocks: [
            {
                type: "p",
                text: "Session cookies clear when you close your browser. Persistent cookies we set expire within 13 months at most, and usually sooner. When a consent-based cookie’s purpose ends, we remove it.",
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
                text: "We update this Cookies Policy when our use of cookies changes or the law changes. The date at the top shows the current version, and material changes are highlighted on the site.",
            },
        ],
    },
    {
        id: "contact",
        title: "Questions",
        icon: "HelpCircle",
        blocks: [
            {
                type: "p",
                text: "If you have questions about how we use cookies, contact the team through our About page. For more on data generally, see our Privacy Policy.",
            },
        ],
    },
];

export default function CookiesPage() {
    return (
        <LegalPageShell
            badge="Cookies Policy"
            badgeIcon="Cookie"
            title={
                <>
                    A small number of cookies, <span className="text-[#72BB83]">and full control over them</span>.
                </>
            }
            intro="This page lists every category of cookie The Eco Lens uses, what each one is for and how long it lasts — and lets you switch the optional ones on or off right here."
            lastUpdated={LAST_UPDATED}
            readTime="5 min read"
            sections={sections}
            topSlot={<CookiePreferences />}
            relatedLinks={[
                ["Privacy Policy", "/privacy"],
                ["Terms & Conditions", "/terms"],
                ["About The Eco Lens", "/about"],
            ]}
        />
    );
}
