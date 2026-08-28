// app/(website)/privacy/page.js
import LegalPageShell from "../../components/websiteComp/legal/LegalPageShell";

export const metadata = {
<<<<<<< HEAD
    title: "Privacy Policy | The Eco Lens",
    description:
        "How The Eco Lens collects, uses and protects your data across our free finance education platform. Plain-language, GDPR and CCPA aligned.",
    keywords:
        "privacy policy, data protection, GDPR, CCPA, finance education, edtech privacy, learner data",
=======
    title: "Privacy Policy Private by Design | The Eco Lens",
    description: "We don't collect your data. No accounts, no tracking, no analytics. Your progress stays on your device. Read our full privacy policy.",
    keywords: "privacy policy, data privacy, no tracking, local storage, finance education",
>>>>>>> 45706cf7d18248289b1f24a92f4d9642e172f404
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
<<<<<<< HEAD
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
=======
  const dontCollect = [
    {
      icon: Users,
      label: "No accounts",
      desc: "No email addresses, no passwords, no usernames.",
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      icon: EyeOff,
      label: "No tracking",
      desc: "No tracking pixels, no advertising networks, no data brokers.",
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      icon: BarChart3,
      label: "No analytics",
      desc: "No analytics that identify you personally.",
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
  ];

  const staysOnDevice = [
    {
      icon: HardDrive,
      label: "Local storage",
      desc: "Your course progress, quiz scores and name are stored in your browser's local storage.",
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      icon: Laptop,
      label: "Never leaves your device",
      desc: "We can't see your data there is no server database of learners to breach.",
      color: "text-brand",
      bg: "bg-brand-soft",
    },
    {
      icon: Smartphone,
      label: "Device-specific",
      desc: "Progress does not sync between devices (that's the trade-off of having no accounts).",
      color: "text-cyan-500",
      bg: "bg-cyan-50",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-cream py-12 sm:py-16 lg:py-20">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[20%] -top-[30%] h-[600px] w-[600px] rounded-full bg-gradient-radial from-brand/6 to-transparent" />
        <div className="absolute -right-[20%] -bottom-[30%] h-[600px] w-[600px] rounded-full bg-gradient-radial from-brand/5 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1180px] px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.16em] text-brand-deep">
            <Shield className="h-3.5 w-3.5" strokeWidth={2.5} />
            Privacy
          </span>
          <h1 className="mt-5 text-[2.2rem] font-extrabold leading-[1.08] tracking-tight text-ink sm:text-[2.8rem] lg:text-[3.6rem]">
            Private by <span className="text-brand-gradient">design</span>.
          </h1>
          <p className="mt-4 text-base font-medium text-ink-2 sm:text-lg">
            The Eco Lens Demo is built so that learning about money doesn't
            cost you your data. This page explains, in plain language, exactly
            what we collect and what we don't.
          </p>
        </div>

        {/* Content */}
        <div className="mx-auto mt-10 max-w-3xl sm:mt-14">
          {/* What we don't collect */}
          <div className="mb-10">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="rounded-full bg-rose-50 p-2">
                <XCircle className="h-5 w-5 text-rose-500" strokeWidth={2} />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                What we don't collect
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {dontCollect.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="rounded-lg border border-line-soft bg-card p-4 transition-all hover:border-brand/30 hover:shadow-card"
                  >
                    <div className={`inline-flex rounded-full ${item.bg} p-2`}>
                      <Icon className={`h-4 w-4 ${item.color}`} strokeWidth={2} />
                    </div>
                    <h3 className="mt-2 font-bold text-ink">{item.label}</h3>
                    <p className="text-sm text-muted">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* What stays on your device */}
          <div className="mb-10">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="rounded-full bg-emerald-50 p-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" strokeWidth={2} />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                What stays on your device
              </h2>
            </div>
            <p className="mb-4 text-base font-medium leading-relaxed text-ink-2">
              Your course progress, quiz scores and the name you choose for
              certificates are stored in your own browser's local storage. This
              data <span className="font-bold text-brand-deep">never leaves your device</span>{" "}
              we can't see it, and there is no server database of learners to
              breach.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {staysOnDevice.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="rounded-lg border border-line-soft bg-card p-4 transition-all hover:border-brand/30 hover:shadow-card"
                  >
                    <div className={`inline-flex rounded-full ${item.bg} p-2`}>
                      <Icon className={`h-4 w-4 ${item.color}`} strokeWidth={2} />
                    </div>
                    <h3 className="mt-2 font-bold text-ink">{item.label}</h3>
                    <p className="text-sm text-muted">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Third-party content */}
          <div className="mb-10 rounded-xl2 border border-line bg-card p-6 shadow-card sm:p-8">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-blue-50 p-2.5">
                <Globe className="h-5 w-5 text-blue-500" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                  Third-party content
                </h2>
                <div className="mt-3 space-y-3">
                  <div className="flex items-start gap-2 rounded-lg bg-cream-2/50 p-3">
                    <Cookie className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" strokeWidth={2} />
                    <div>
                      <p className="text-sm font-medium text-ink-2">
                        <span className="font-bold text-ink">YouTube:</span> Some lessons embed
                        videos. When you play a video, YouTube may set its own cookies under its
                        own privacy policy.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 rounded-lg bg-cream-2/50 p-3">
                    <FileText className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-500" strokeWidth={2} />
                    <div>
                      <p className="text-sm font-medium text-ink-2">
                        <span className="font-bold text-ink">Google Fonts:</span> Fonts are loaded
                        from Google Fonts. Your browser connects to Google to fetch them.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Your rights */}
          <div className="rounded-xl2 border border-accent-soft bg-accent-soft/30 p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-accent-soft p-2.5">
                <Fingerprint className="h-5 w-5 text-accent-deep" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                  Your rights
                </h2>
                <p className="mt-2 text-base font-medium leading-relaxed text-ink-2">
                  Because we hold no personal data about you, there is nothing to
                  request, correct or delete on our side the delete button is in
                  your own browser settings. If you have questions about this
                  policy, contact the team through the channels listed on the{" "}
                  <a href="/about" className="font-bold text-brand-deep hover:underline">
                    About page
                  </a>
                  .
                </p>
                <div className="mt-3 flex items-start gap-2 rounded-lg bg-white/50 p-3">
                  <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" strokeWidth={2} />
                  <p className="text-xs text-muted">
                    <span className="font-bold text-ink-2">Last updated:</span> 2026. This
                    policy may evolve as The Eco Lens grows; the principle
                    won't.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
>>>>>>> 45706cf7d18248289b1f24a92f4d9642e172f404
