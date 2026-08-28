// app/(website)/terms/page.js
import LegalPageShell from "../../components/websiteComp/legal/LegalPageShell";

export const metadata = {
    title: "Terms & Conditions | The Eco Lens",
    description:
        "The terms that govern your use of The Eco Lens free finance education platform: accounts, acceptable use, certificates, disclaimers and liability.",
    keywords:
        "terms and conditions, terms of service, disclaimer, education not advice, finance education, acceptable use",
    robots: "index, follow",
    openGraph: {
        title: "Terms & Conditions | The Eco Lens",
        description:
            "The terms that govern your use of our free finance education platform.",
        url: "https://your-domain.com/terms",
    },
};

const LAST_UPDATED = "August 2026";

const sections = [
    {
        id: "acceptance",
        title: "Acceptance of these terms",
        icon: "Handshake",
        blocks: [
            {
                type: "p",
                text: "These Terms & Conditions form an agreement between you and The Eco Lens. By accessing the website, creating an account or using any course or tool, you agree to be bound by them. If you do not agree, please do not use the platform.",
            },
            {
                type: "p",
                text: "If you use the platform on behalf of an organisation, you confirm you are authorised to accept these terms for that organisation.",
            },
        ],
    },
    {
        id: "education-not-advice",
        title: "Education, not financial advice",
        icon: "BookOpenCheck",
        blocks: [
            {
                type: "p",
                text: "The Eco Lens provides general financial education only. Nothing on the platform is financial, investment, legal, accounting or tax advice, and nothing is a recommendation or offer to buy, sell or use any financial product or service.",
            },
            {
                type: "list",
                items: [
                    "Examples, figures and case studies are illustrative and simplified.",
                    "Our calculators and tools show illustrations, not predictions or guarantees.",
                    "Financial decisions depend on your personal circumstances, country and goals.",
                ],
            },
            {
                type: "note",
                tone: "amber",
                text: "Before making a significant financial decision, consult a qualified, licensed professional in your jurisdiction. You are responsible for how you use what you learn here.",
            },
        ],
    },
    {
        id: "eligibility",
        title: "Eligibility & your account",
        icon: "UserCheck",
        blocks: [
            {
                type: "list",
                items: [
                    { term: "Age:", text: "you must be at least 16 years old to create an account." },
                    { term: "Accurate details:", text: "provide correct information and keep it up to date." },
                    { term: "Account security:", text: "you are responsible for activity under your account; keep your password confidential and tell us promptly of any unauthorised use." },
                    { term: "One person per account:", text: "accounts are personal and may not be shared or transferred." },
                ],
            },
        ],
    },
    {
        id: "acceptable-use",
        title: "Acceptable use",
        icon: "ShieldAlert",
        blocks: [
            { type: "p", text: "When using the platform, you agree not to:" },
            {
                type: "list",
                items: [
                    "Break the law, infringe others’ rights or misuse the platform to harm anyone.",
                    "Copy, scrape, resell or redistribute course content except as allowed below.",
                    "Attempt to gain unauthorised access, probe security, or disrupt the service.",
                    "Upload malware, spam, or content that is abusive, hateful or misleading.",
                    "Impersonate others or misrepresent your affiliation with any person or body.",
                    "Use automated systems to access the platform in a way that harms its operation.",
                ],
            },
            {
                type: "note",
                tone: "rose",
                text: "We may suspend or close accounts that breach these rules, and remove content that violates them.",
            },
        ],
    },
    {
        id: "content-ip",
        title: "Content & intellectual property",
        icon: "ScrollText",
        blocks: [
            {
                type: "p",
                text: "Courses, text, graphics, logos and the platform itself are owned by The Eco Lens or its licensors and are protected by intellectual-property law.",
            },
            {
                type: "list",
                items: [
                    { term: "Your licence:", text: "we grant you a personal, non-exclusive, non-transferable right to access the content for your own learning, free of charge." },
                    { term: "Attribution:", text: "where content is published under an open licence, the specific licence terms shown with that content apply." },
                    { term: "Your feedback:", text: "if you send suggestions, we may use them to improve the platform without obligation to you." },
                ],
            },
        ],
    },
    {
        id: "certificates",
        title: "Certificates of completion",
        icon: "Award",
        blocks: [
            {
                type: "p",
                text: "When you complete a course you may download a certificate of completion. It recognises that you finished a free educational course.",
            },
            {
                type: "list",
                items: [
                    "Certificates are not accredited qualifications and carry no academic credit.",
                    "They may not be accepted by employers or institutions as formal credentials.",
                    "You must not alter a certificate or present it as something it is not.",
                ],
            },
        ],
    },
    {
        id: "availability",
        title: "Free service, availability & changes",
        icon: "Sparkles",
        blocks: [
            {
                type: "p",
                text: "The platform is provided free of charge. We may add, change, pause or remove courses, tools and features at any time, and we may run maintenance that interrupts access.",
            },
            {
                type: "p",
                text: "We aim for high availability but do not guarantee the platform will always be available, uninterrupted or error-free.",
            },
        ],
    },
    {
        id: "third-party",
        title: "Third-party content & links",
        icon: "Handshake",
        blocks: [
            {
                type: "p",
                text: "Lessons may embed videos or link to external research, organisations and tools. Those resources are controlled by their own publishers and governed by their own terms and privacy policies. We are not responsible for third-party content and a link is not an endorsement.",
            },
        ],
    },
    {
        id: "disclaimer",
        title: "Disclaimer of warranties",
        icon: "AlertTriangle",
        blocks: [
            {
                type: "p",
                text: "The platform and all content are provided “as is” and “as available”, without warranties of any kind, whether express or implied, including fitness for a particular purpose, accuracy or non-infringement.",
            },
            {
                type: "p",
                text: "While we work to keep content accurate and current, finance and regulation change quickly and we cannot guarantee every figure, rule or example reflects the latest position.",
            },
        ],
    },
    {
        id: "liability",
        title: "Limitation of liability",
        icon: "Gavel",
        blocks: [
            {
                type: "p",
                text: "To the fullest extent permitted by law, The Eco Lens and its team will not be liable for any indirect, incidental, special or consequential loss, or for any loss of profits, savings, data or opportunity, arising from your use of — or inability to use — the platform or your reliance on its content.",
            },
            {
                type: "note",
                tone: "blue",
                text: "Nothing in these terms excludes liability that cannot be excluded by law, such as for death or personal injury caused by negligence, or for fraud. Some jurisdictions do not allow certain exclusions, so parts of this section may not apply to you.",
            },
        ],
    },
    {
        id: "indemnity",
        title: "Your responsibility",
        icon: "Ban",
        blocks: [
            {
                type: "p",
                text: "You agree to be responsible for your use of the platform and, to the extent permitted by law, to cover reasonable costs we incur from your breach of these terms or your misuse of the service.",
            },
        ],
    },
    {
        id: "termination",
        title: "Suspension & termination",
        icon: "ShieldAlert",
        blocks: [
            {
                type: "list",
                items: [
                    { term: "By you:", text: "you can stop using the platform and delete your account at any time from your dashboard settings." },
                    { term: "By us:", text: "we may suspend or end your access if you breach these terms, if required by law, or if we discontinue the service." },
                    { term: "After termination:", text: "the sections on intellectual property, disclaimers, liability and governing law continue to apply." },
                ],
            },
        ],
    },
    {
        id: "governing-law",
        title: "Governing law & disputes",
        icon: "Gavel",
        blocks: [
            {
                type: "p",
                text: "These terms are governed by the laws applicable at The Eco Lens’s principal place of operation, without regard to conflict-of-law rules. Where you are a consumer, you keep the benefit of any mandatory protections of the country where you live.",
            },
            {
                type: "p",
                text: "We would rather resolve any concern informally — please contact us first so we can try to put things right.",
            },
        ],
    },
    {
        id: "changes",
        title: "Changes to these terms",
        icon: "RefreshCw",
        blocks: [
            {
                type: "p",
                text: "We may revise these terms from time to time. The updated version takes effect when posted here, with the date at the top refreshed. For material changes we will give reasonable notice. Continuing to use the platform after changes means you accept the revised terms.",
            },
        ],
    },
    {
        id: "contact",
        title: "Contact",
        icon: "GraduationCap",
        blocks: [
            {
                type: "p",
                text: "Questions about these terms? Reach the team through the channels on our About page and we will get back to you.",
            },
        ],
    },
];

export default function TermsPage() {
    return (
        <LegalPageShell
            badge="Terms & Conditions"
            badgeIcon="Gavel"
            title={
                <>
                    The important fine print, <span className="text-[#72BB83]">in normal words</span>.
                </>
            }
            intro="These terms set out the deal between you and The Eco Lens: what you can expect from the platform, what we expect from you, and the limits that apply because this is free education, not financial advice."
            lastUpdated={LAST_UPDATED}
            readTime="8 min read"
            sections={sections}
            relatedLinks={[
                ["Privacy Policy", "/privacy"],
                ["Cookies Policy", "/cookies"],
                ["About The Eco Lens", "/about"],
            ]}
        />
    );
}
