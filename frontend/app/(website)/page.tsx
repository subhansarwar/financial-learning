// app/page.tsx
import { getCourses, getCourseStats, getTopics } from "@/lib/data";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  FileText,
  GraduationCap,
  Plus,
  Search,
  Sparkles,
  Unlock,
  UserCircle2,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import HeroImage from './../../public/assets/homePageImages/hero-image.webp';
import CourseCard from "../components/CourseCard";
import TopicCard from "../components/TopicCard";

export default async function HomePage() {
  const topics = await getTopics();
  const catalog = await getCourses();
  const stats = getCourseStats(catalog);

  // Flagship courses (microfinance and sustainability)
  const flagshipSlugs = ["microfinance", "sustainability-and-finance"];
  const flagship = catalog.filter((c: any) => flagshipSlugs.includes(c.slug));

  // Hero stats calculation
  const lessons = catalog.reduce((n: number, c: any) => n + (c.lessons || 0), 0);
  const minutes = catalog.reduce((n: number, c: any) => n + (c.lengthMin || 0), 0);
  const totalCourses = catalog.length;
  const totalTopics = topics.length;
  const totalHours = Math.round(minutes / 60);

  return (
    <>
      {/* ========== HERO SECTION ========== */}
      <section className="relative overflow-hidden">
        <div className="relative lg:grid lg:grid-cols-2 lg:items-stretch">
          {/* ---------- LEFT: content ---------- */}
          <div className="relative overflow-hidden py-14 sm:py-20 lg:flex lg:items-center lg:overflow-visible lg:py-20">
            <div
              className="pointer-events-none absolute -inset-0"
              style={{
                background:
                  "radial-gradient(820px 480px at 20% -12%, rgba(67,56,202,.10), transparent 62%), radial-gradient(620px 420px at -8% 110%, rgba(99,102,241,.08), transparent 58%)",
              }}
            />
            <div className="pointer-events-none absolute -bottom-[260px] -left-[180px] hidden h-[640px] w-[640px] rounded-full border border-brand/15 sm:block">
              <div className="absolute inset-[70px] rounded-full border border-brand/10" />
              <div className="absolute inset-[150px] rounded-full border border-brand/[.07]" />
            </div>
            <Plus className="pointer-events-none absolute left-[5%] top-[16%] hidden h-4 w-4 text-brand/35 sm:block" />
            <Plus className="pointer-events-none absolute right-[8%] top-[34%] hidden h-4 w-4 text-brand/35 lg:right-[10%] sm:block" />
            <Plus className="pointer-events-none absolute bottom-[22%] left-[11%] hidden h-4 w-4 text-brand/35 sm:block" />

            {/* No vw-based calc — just fluid, capped padding. Scales cleanly
          from phones up to ultra-wide monitors without breaking. */}
            <div className="mx-auto w-full max-w-2xl px-5 sm:px-8 lg:mx-0 lg:max-w-none lg:px-12 xl:px-16 2xl:px-20">
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.16em] text-brand-deep">
                  <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
                  100% free no paywalls, ever
                </span>

                <h1 className="mt-6 font-extrabold leading-[1.15] tracking-tight text-ink [font-size:clamp(1.9rem,4vw+1rem,2.75rem)]">
                  Learn how finance{" "}
                  <em className="not-italic text-brand-gradient">includes</em> people and
                  how it heals the <em className="not-italic text-brand-gradient">planet</em>.
                </h1>

                <p className="mt-5 text-base font-medium text-ink-2 sm:text-lg">
                  Two flagship 12-module programs <b>Microfinance</b> and{" "}
                  <b>Sustainability &amp; Finance</b> plus case studies, country statistics
                  and a student research corner. Pass each module at 70% to unlock the next,
                  and earn your certificate.
                </p>

                <form
                  className="mt-8 flex w-full flex-col gap-2 rounded-[28px] border border-line bg-card p-1.5 shadow-card focus-within:border-brand/55 focus-within:ring-4 focus-within:ring-brand/15 sm:flex-row sm:rounded-full"
                  action="/catalog"
                  method="get"
                  role="search"
                >
                  <input
                    type="search"
                    name="q"
                    placeholder="What do you want to learn? Try “microcredit” or “green bonds”…"
                    aria-label="Search courses"
                    className="w-full flex-1 rounded-full bg-transparent px-5 py-3 text-base font-medium text-ink placeholder:text-muted focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 rounded-full bg-brand-deep px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-[#241f6b]"
                  >
                    <Search className="h-4 w-4" strokeWidth={2.5} />
                    Search
                  </button>
                </form>

                <div className="mt-10 flex flex-wrap gap-x-8 gap-y-6 pb-10 sm:gap-x-10 lg:pb-0">
                  <div>
                    <b className="block text-3xl font-bold text-brand-deep sm:text-[2.05rem]">{totalCourses}</b>
                    <span className="text-sm font-semibold text-muted">free courses</span>
                  </div>
                  <div>
                    <b className="block text-3xl font-bold text-brand-deep sm:text-[2.05rem]">{lessons}</b>
                    <span className="text-sm font-semibold text-muted">lessons &amp; quizzes</span>
                  </div>
                  <div>
                    <b className="block text-3xl font-bold text-brand-deep sm:text-[2.05rem]">{totalTopics}</b>
                    <span className="text-sm font-semibold text-muted">finance topics</span>
                  </div>
                  <div>
                    <b className="block text-3xl font-bold text-brand-deep sm:text-[2.05rem]">{totalHours}+</b>
                    <span className="text-sm font-semibold text-muted">hours of learning</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---------- RIGHT: image, full-bleed on desktop ---------- */}
          <div className="relative h-[260px] xs:h-[320px] sm:h-[420px] lg:h-auto lg:min-h-[520px]">
            <Image
              src={HeroImage}
              alt="Student learning online"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="rounded-2xl object-cover object-[center_25%] sm:rounded-[28px] lg:rounded-none"
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-cream to-transparent lg:block" />
          </div>
        </div>
      </section>

      {/* ========== FLAGSHIP PROGRAMS ========== */}
      <section className="py-14 sm:py-[78px]">
        <div className="mx-auto lg:p-10 px-4 sm:px-6">
          <div className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-brand-deep">
                Flagship programs <Plus className="h-3 w-3 text-brand/45" strokeWidth={3} />
              </span>
              <h2 className="text-[1.8rem] font-bold leading-tight tracking-tight text-ink sm:text-[2.2rem] lg:text-[2.5rem]">
                Twelve modules each. Pass at 70% to move on.
              </h2>
            </div>
            <Link
              href="/catalog"
              className="flex items-center gap-1.5 whitespace-nowrap font-bold text-brand-deep no-underline hover:underline"
            >
              Browse all courses <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2" id="flagshipGrid">
            {flagship.map((course: any) => {
              const topic = topics.find((t: any) => t.id === course.topic);
              return (
                <CourseCard key={course.slug} course={course} topic={topic} progress={null} />
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== EXPLORE SECTIONS ========== */}
      <section className="border-y border-line-soft bg-cream-2 py-14 sm:py-16">
        <div className="mx-auto lg:p-10 px-4 sm:px-6">
          <div className="mb-9">
            <span className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-brand-deep">
              Beyond the courses <Plus className="h-3 w-3 text-brand/45" strokeWidth={3} />
            </span>
            <h2 className="text-[1.8rem] font-bold leading-tight tracking-tight text-ink sm:text-[2.2rem] lg:text-[2.5rem]">
              Case studies, statistics &amp; student research
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/case-studies"
              className="group relative block overflow-hidden rounded-xl2 border border-line bg-card p-7 text-ink no-underline transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-card-lg hover:no-underline"
            >
              <div className="mb-4.5 grid h-14 w-14 place-items-center rounded-2xl border border-brand-soft bg-brand-soft text-brand-deep">
                <BookOpen className="h-6 w-6" strokeWidth={2} />
              </div>
              <h3 className="mb-1.5 text-[1.3rem] font-bold tracking-tight">Case studies</h3>
              <p className="text-sm font-medium text-muted">
                Grameen, BRAC, M-Pesa, M-KOPA, Ørsted and more real organisations,
                real results, and the lessons each one teaches.
              </p>
            </Link>
            <Link
              href="/statistics"
              className="group relative block overflow-hidden rounded-xl2 border border-line bg-card p-7 text-ink no-underline transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-card-lg hover:no-underline"
            >
              <div className="mb-4.5 grid h-14 w-14 place-items-center rounded-2xl border border-brand-soft bg-brand-soft text-brand-deep">
                <BarChart3 className="h-6 w-6" strokeWidth={2} />
              </div>
              <h3 className="mb-1.5 text-[1.3rem] font-bold tracking-tight">Statistics</h3>
              <p className="text-sm font-medium text-muted">
                Financial-inclusion numbers by country and a snapshot of the
                institutions and the sustainable-finance market.
              </p>
            </Link>
            <Link
              href="/research"
              className="group relative block overflow-hidden rounded-xl2 border border-line bg-card p-7 text-ink no-underline transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-card-lg hover:no-underline"
            >
              <div className="mb-4.5 grid h-14 w-14 place-items-center rounded-2xl border border-brand-soft bg-brand-soft text-brand-deep">
                <FileText className="h-6 w-6" strokeWidth={2} />
              </div>
              <h3 className="mb-1.5 text-[1.3rem] font-bold tracking-tight">Research corner</h3>
              <p className="text-sm font-medium text-muted">
                Read papers written by students and publish your own microfinance
                or sustainability research as a PDF.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* ========== TOPICS ========== */}
      <section className="py-14 sm:py-[78px]">
        <div className="mx-auto lg:p-10 px-4 sm:px-6">
          <div className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-brand-deep">
                Explore by topic <Plus className="h-3 w-3 text-brand/45" strokeWidth={3} />
              </span>
              <h2 className="text-[1.8rem] font-bold leading-tight tracking-tight text-ink sm:text-[2.2rem] lg:text-[2.5rem]">
                Every corner of finance, one home
              </h2>
            </div>
            <Link
              href="/catalog"
              className="flex items-center gap-1.5 whitespace-nowrap font-bold text-brand-deep no-underline hover:underline"
            >
              Full catalog <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" id="topicsGrid">
            {topics.map((topic: any) => {
              const count = catalog.filter((c: any) => c.topic === topic.id).length;
              return <TopicCard key={topic.id} topic={topic} count={count} />;
            })}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className="py-14 sm:py-[78px]">
        <div className="mx-auto lg:p-10 px-4 sm:px-6">
          <div className="mb-9">
            <span className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-brand-deep">
              How it works <Plus className="h-3 w-3 text-brand/45" strokeWidth={3} />
            </span>
            <h2 className="text-[1.8rem] font-bold leading-tight tracking-tight text-ink sm:text-[2.2rem] lg:text-[2.5rem]">
              Learn it. Prove it. Keep the certificate.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl2 border border-line bg-card p-7">
              <div className="mb-4.5 grid h-14 w-14 place-items-center rounded-2xl border border-brand-soft bg-brand-soft text-brand-deep">
                <UserCircle2 className="h-6 w-6" strokeWidth={2} />
              </div>
              <h3 className="mb-1.5 text-[1.3rem] font-bold tracking-tight">
                1. Log in &amp; pick a course
              </h3>
              <p className="text-sm font-medium text-muted">
                A quick demo sign-in (no real account) personalises your progress
                and certificates. Courses split into modules and bite-size lessons.
              </p>
            </div>
            <div className="rounded-xl2 border border-line bg-card p-7">
              <div className="mb-4.5 grid h-14 w-14 place-items-center rounded-2xl border border-brand-soft bg-brand-soft text-brand-deep">
                <Unlock className="h-6 w-6" strokeWidth={2} />
              </div>
              <h3 className="mb-1.5 text-[1.3rem] font-bold tracking-tight">2. Pass to unlock</h3>
              <p className="text-sm font-medium text-muted">
                Each module ends with a quiz. Score 70% or higher to unlock the next
                module your progress is saved automatically on your device.
              </p>
            </div>
            <div className="rounded-xl2 border border-line bg-card p-7">
              {/* Signature moment: the only place the amber accent appears,
                  set inside a soft dashed "seal" ring for the certificate step. */}
              <div className="certificate-seal mb-5 grid h-14 w-14 place-items-center rounded-2xl border border-accent-soft bg-accent-soft text-accent-deep">
                <GraduationCap className="h-6 w-6" strokeWidth={2} />
              </div>
              <h3 className="mb-1.5 text-[1.3rem] font-bold tracking-tight">
                3. Download your certificate
              </h3>
              <p className="text-sm font-medium text-muted">
                Finish all twelve modules and download a free certificate of
                completion instantly. Unaccredited, honest, and yours to keep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TOOLS TEASER ========== */}
      <section className="py-8 sm:py-12">
        <div className="mx-auto lg:p-10 px-4 sm:px-6">
          <div
            className="relative flex flex-col items-start gap-6 overflow-hidden rounded-[26px] bg-brand-deep px-6 py-10 text-white sm:flex-row sm:items-center sm:justify-between sm:px-12 sm:py-14"
            style={{
              backgroundImage:
                "radial-gradient(600px 280px at 92% -10%, rgba(99,102,241,.20), transparent 60%)",
            }}
          >
            <div>
              <div className="mb-3 flex items-center gap-2 text-white/70">
                <Wrench className="h-4 w-4" strokeWidth={2.5} />
                <span className="text-xs font-bold uppercase tracking-[0.16em]">Built in</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-[2.1rem]">
                Handy tools, built right in
              </h2>
              <p className="mt-2 max-w-[48ch] font-medium text-white/70">
                Turn theory into numbers: a budgeting calculator, a compound
                interest explorer, and an ESG comparison sandbox.
              </p>
            </div>
            <Link
              href="/tools"
              className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/35 bg-white/10 px-6 py-3 text-sm font-bold text-white no-underline transition-colors hover:bg-white/20 hover:no-underline"
            >
              Open the tools <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}