// app/(website)/faq/page.js
import FaqClient from "../../components/websiteComp/faq/FaqClient";

export const metadata = {
    title: "FAQ Common Questions | The Eco Lens",
    description:
        "Answers to common questions about The Eco Lens: free courses, certificates, accounts, privacy, financial tools and support.",
    keywords:
        "FAQ, help, frequently asked questions, finance education, free courses, certificates, microfinance",
    robots: "index, follow",
    openGraph: {
        title: "FAQ Common Questions | The Eco Lens",
        description:
            "Answers about free courses, certificates, accounts, privacy, tools and support.",
        url: "https://your-domain.com/faq",
    },
};

const categories = [
    { id: "all", label: "All", icon: "LayoutGrid" },
    { id: "getting-started", label: "Getting started", icon: "Rocket" },
    { id: "courses", label: "Courses & learning", icon: "BookOpen" },
    { id: "certificates", label: "Certificates", icon: "Award" },
    { id: "account", label: "Account & sign-in", icon: "UserCircle" },
    { id: "privacy", label: "Privacy & data", icon: "ShieldCheck" },
    { id: "tools", label: "Financial tools", icon: "Calculator" },
    { id: "support", label: "Cost & support", icon: "LifeBuoy" },
];

const faqs = [
    /* ---------------- Getting started ---------------- */
    {
        category: "getting-started",
        q: "What is The Eco Lens?",
        blocks: [
            {
                type: "p",
                text: "The Eco Lens is a free online learning platform for microfinance and sustainable finance. We turn topics like microcredit, micro-savings, micro-insurance, green energy financing and ESG into short, plain-language courses that anyone can follow — no jargon, no finance degree required.",
            },
            {
                type: "p",
                text: "Everything is built around one idea: understanding money should not be locked behind a paywall or a wall of technical language.",
            },
        ],
    },
    {
        category: "getting-started",
        q: "Is it really free?",
        popular: true,
        blocks: [
            {
                type: "p",
                text: "Yes — completely. Every course, quiz, tool and certificate is free to use. There is no trial that expires, no premium tier for the core material and no credit card required at any point.",
            },
            {
                type: "note",
                tone: "green",
                text: "If we ever add optional extras in future, the existing courses and certificates stay free and any paid feature would be clearly marked as optional.",
            },
        ],
    },
    {
        category: "getting-started",
        q: "Do I need an account to start learning?",
        blocks: [
            {
                type: "p",
                text: "No. You can browse the catalog and read lessons without signing in. You only need a free account when you want the platform to do something for you:",
            },
            {
                type: "list",
                items: [
                    "Save your progress and pick up where you left off",
                    "Keep a record of your quiz scores",
                    "Earn and re-download certificates",
                    "Sync your learning across devices",
                ],
            },
        ],
    },
    {
        category: "getting-started",
        q: "Who is this platform for?",
        blocks: [
            {
                type: "p",
                text: "Anyone aged 16 or over who wants to understand finance better — students, people working in NGOs and cooperatives, small business owners, community organisers, and complete beginners who have never taken a finance course before.",
            },
            {
                type: "p",
                text: "You do not need any prior background. Courses start from first principles and build up gradually.",
            },
        ],
    },
    {
        category: "getting-started",
        q: "What do I need to use the site?",
        blocks: [
            {
                type: "list",
                items: [
                    { term: "A device:", text: "any modern phone, tablet or computer." },
                    { term: "A browser:", text: "a recent version of Chrome, Firefox, Safari or Edge." },
                    { term: "An internet connection:", text: "for loading lessons and short videos. Nothing to install or download." },
                ],
            },
        ],
    },
    {
        category: "getting-started",
        q: "Which languages are courses available in?",
        blocks: [
            {
                type: "p",
                text: "Course content is currently in English, written to be readable for people who use English as a second language. Additional languages are on the roadmap and will be added course by course.",
            },
        ],
    },

    /* ---------------- Courses & learning ---------------- */
    {
        category: "courses",
        q: "How are the courses structured?",
        blocks: [
            {
                type: "p",
                text: "Each course is a set of modules. Each module contains a handful of short lessons — a mix of text, simple diagrams and occasional embedded videos — followed by a quick check-your-understanding quiz. A final quiz at the end of the course tests the whole topic.",
            },
        ],
    },
    {
        category: "courses",
        q: "How long does a course take?",
        popular: true,
        blocks: [
            {
                type: "p",
                text: "Most courses take between two and six hours in total. Because everything is self-paced, you can do that in one sitting or in ten-minute pieces over several weeks — your progress is saved either way when you are signed in.",
            },
        ],
    },
    {
        category: "courses",
        q: "Are there deadlines or a fixed schedule?",
        blocks: [
            {
                type: "p",
                text: "No. There are no cohorts, start dates or deadlines. Enrol whenever you like, pause whenever you need to, and resume months later if that is what works for you.",
            },
        ],
    },
    {
        category: "courses",
        q: "Do I have to take lessons in order?",
        blocks: [
            {
                type: "p",
                text: "We recommend the built-in order because later lessons assume the earlier ones, but nothing is locked. You are free to jump ahead to a specific lesson or revisit an earlier one at any time.",
            },
        ],
    },
    {
        category: "courses",
        q: "Can I learn offline?",
        blocks: [
            {
                type: "p",
                text: "Lessons are delivered online, so you need a connection to open them. However, every lesson page can be printed or saved as a PDF from your browser, which is handy for reading later or sharing in a workshop.",
            },
        ],
    },
    {
        category: "courses",
        q: "How is my progress tracked?",
        blocks: [
            {
                type: "p",
                text: "When you are signed in, the platform records which lessons you have completed and your score on each quiz. You can see all of it on your dashboard, including how far through each course you are.",
            },
            { type: "link", label: "Go to your dashboard", href: "/dashboard" },
        ],
    },
    {
        category: "courses",
        q: "I found a mistake in a lesson. What should I do?",
        blocks: [
            {
                type: "p",
                text: "Please tell us. Finance and regulation change quickly and we would rather fix an out-of-date figure fast. Use the contact channels on the About page and point us to the course and lesson.",
            },
            { type: "link", label: "Report it via the About page", href: "/about" },
        ],
    },

    /* ---------------- Certificates ---------------- */
    {
        category: "certificates",
        q: "How do I earn a certificate?",
        popular: true,
        blocks: [
            {
                type: "p",
                text: "Complete every lesson in a course and pass the final quiz — the pass mark is shown on the quiz and is usually around 70%. Once both are done, a certificate of completion becomes available to download from your dashboard.",
            },
        ],
    },
    {
        category: "certificates",
        q: "Is the certificate accredited or an official qualification?",
        popular: true,
        blocks: [
            {
                type: "p",
                text: "No. A Eco Lens certificate recognises that you completed a free educational course. It is not an accredited qualification, it carries no academic credit, and employers or institutions are not obliged to accept it as a formal credential.",
            },
            {
                type: "note",
                tone: "amber",
                text: "It is still a genuine record of learning — just describe it accurately as a course completion certificate.",
            },
        ],
    },
    {
        category: "certificates",
        q: "Can I add it to my CV or LinkedIn?",
        blocks: [
            {
                type: "p",
                text: "Yes. Many learners list it under certifications or professional development. Link to the course so anyone reading can see what it covered, and keep the wording honest about what it is.",
            },
        ],
    },
    {
        category: "certificates",
        q: "What name appears on the certificate?",
        blocks: [
            {
                type: "p",
                text: "The name in your profile. You can change it in your account settings before you download, so the certificate shows the name you want.",
            },
        ],
    },
    {
        category: "certificates",
        q: "I lost my certificate — can I get it again?",
        blocks: [
            {
                type: "p",
                text: "Any time. As long as the course is still marked complete on your account, you can re-download the certificate from your dashboard at no cost.",
            },
        ],
    },

    /* ---------------- Account & sign-in ---------------- */
    {
        category: "account",
        q: "How do I create an account?",
        blocks: [
            {
                type: "p",
                text: "Choose Sign up, then either register with your email address and a password, or use Sign in with Google. That is the whole process — no lengthy profile to fill in.",
            },
        ],
    },
    {
        category: "account",
        q: "I forgot my password.",
        blocks: [
            {
                type: "p",
                text: "On the login page, select “Forgot password” and enter your email. We will send a reset link. If it does not arrive within a few minutes, check your spam folder and make sure you used the address you registered with.",
            },
        ],
    },
    {
        category: "account",
        q: "Can I change my email address or name?",
        blocks: [
            {
                type: "p",
                text: "Yes, both are editable in your account settings. Changing your name updates what appears on future certificate downloads too.",
            },
        ],
    },
    {
        category: "account",
        q: "How do I delete my account?",
        blocks: [
            {
                type: "p",
                text: "There is a delete option in your account settings. When you use it, your account and learning data are removed or anonymised within 12 months, in line with our Privacy Policy.",
            },
            { type: "link", label: "Read the Privacy Policy", href: "/privacy" },
        ],
    },
    {
        category: "account",
        q: "Can I use the same account on more than one device?",
        blocks: [
            {
                type: "p",
                text: "Yes. Sign in on your phone, laptop or a library computer and your progress, scores and certificates follow you — everything is tied to your account, not the device.",
            },
        ],
    },

    /* ---------------- Privacy & data ---------------- */
    {
        category: "privacy",
        q: "What data do you collect about me?",
        popular: true,
        blocks: [
            {
                type: "p",
                text: "The minimum needed to run an education service: your account details, the courses and quizzes you complete, and basic technical logs for security. We do not sell your data and we are not part of any advertising network.",
            },
            { type: "link", label: "See the full Privacy Policy", href: "/privacy" },
        ],
    },
    {
        category: "privacy",
        q: "Do you use tracking or advertising cookies?",
        blocks: [
            {
                type: "p",
                text: "No advertising cookies and no cross-site tracking. We use strictly necessary cookies to run the site, plus optional preference and privacy-friendly analytics cookies that you control.",
            },
            { type: "link", label: "Manage cookies", href: "/cookies" },
        ],
    },
    {
        category: "privacy",
        q: "Is my learning activity shared with employers or third parties?",
        blocks: [
            {
                type: "p",
                text: "No. Your progress and scores are visible to you on your dashboard and are not shared with employers, partners or data brokers.",
            },
        ],
    },
    {
        category: "privacy",
        q: "How is my password stored?",
        blocks: [
            {
                type: "p",
                text: "As a salted hash — never in plain text. All traffic to and from the platform is encrypted over HTTPS.",
            },
        ],
    },

    /* ---------------- Financial tools ---------------- */
    {
        category: "tools",
        q: "What financial tools are available?",
        blocks: [
            {
                type: "p",
                text: "A small set of calculators that illustrate the ideas taught in the courses — for example how a microloan repayment schedule builds up, how regular small savings grow over time, and how two loan offers compare once fees are included.",
            },
            { type: "link", label: "Open the tools", href: "/tools" },
        ],
    },
    {
        category: "tools",
        q: "Are the tool results financial advice?",
        blocks: [
            {
                type: "p",
                text: "No. The tools produce illustrations to help you understand a concept, using the numbers you type in. They are not predictions, recommendations or advice. Before acting on a real financial decision, talk to a qualified, licensed professional in your country.",
            },
        ],
    },
    {
        category: "tools",
        q: "Do the tools save the numbers I enter?",
        blocks: [
            {
                type: "p",
                text: "Calculations run in your browser. Unless a tool clearly states otherwise, the figures you enter are not sent to our servers or attached to your profile.",
            },
        ],
    },

    /* ---------------- Cost & support ---------------- */
    {
        category: "support",
        q: "How is a free platform funded?",
        blocks: [
            {
                type: "p",
                text: "The Eco Lens is mission-driven and funded through a mix of grants, partnerships with education and development organisations, and donations. It is not funded by advertising, and we do not monetise learner data.",
            },
        ],
    },
    {
        category: "support",
        q: "Will you ever charge for courses?",
        blocks: [
            {
                type: "p",
                text: "The core courses, quizzes and certificates are intended to stay free. If optional paid features are ever introduced, they will be clearly separate from the free curriculum, which remains open to everyone.",
            },
        ],
    },
    {
        category: "support",
        q: "How do I contact support?",
        blocks: [
            {
                type: "p",
                text: "Use the contact channels listed on the About page. A real person reads these, and we usually reply within a few working days. Including the course or page name helps us help you faster.",
            },
            { type: "link", label: "Contact via the About page", href: "/about" },
        ],
    },
    {
        category: "support",
        q: "Can my organisation or NGO use these materials in workshops?",
        blocks: [
            {
                type: "p",
                text: "Yes for learning and internal training. Where a course is published under an open licence, the specific licence shown with that course tells you what redistribution is allowed. For partnerships or bulk use, get in touch and we will help.",
            },
        ],
    },
    {
        category: "support",
        q: "How do I report a bug or an accessibility problem?",
        blocks: [
            {
                type: "p",
                text: "Please report it through the About page. Accessibility issues are treated as priority fixes — tell us what device, browser and assistive technology you were using so we can reproduce it.",
            },
        ],
    },
];

export default function FaqPage() {
    return <FaqClient categories={categories} faqs={faqs} />;
}
