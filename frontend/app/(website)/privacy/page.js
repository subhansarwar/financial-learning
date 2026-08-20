import {
    BarChart3,
    CheckCircle2,
    Cookie,
    EyeOff,
    FileText,
    Fingerprint,
    Globe,
    HardDrive,
    Info,
    Laptop,
    Shield,
    Smartphone,
    Users,
    XCircle
} from "lucide-react";

export const metadata = {
    title: "Privacy Policy Private by Design | Finance Platform Demo",
    description: "We don't collect your data. No accounts, no tracking, no analytics. Your progress stays on your device. Read our full privacy policy.",
    keywords: "privacy policy, data privacy, no tracking, local storage, finance education",
    robots: "index, follow",
};

export default function PrivacyPage() {
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
            Finance Platform Demo is built so that learning about money doesn't
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
                    policy may evolve as Finance Platform Demo grows; the principle
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