// app/page.tsx
import ExploreCoursesSection from '@/app/components/websiteComp/homeComp/ExploreCoursesSection';
import { getCourses, getCourseStats, getTopics } from "@/lib/data";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  FileText,
  GraduationCap,
  Plus,
  Unlock,
  UserCircle2,
  Wrench
} from "lucide-react";
import Link from "next/link";
import CourseCard from "../components/CourseCard";
import MoreCoursesSection from '@/app/components/websiteComp/homeComp/MoreCoursesSection'
import HowToBuySection from '@/app/components/websiteComp/homeComp/HowToBuySection'
import TopicCard from "../components/TopicCard";
import HeroSection from '../components/websiteComp/homeComp/HeroSection';
import FeaturesSection from '@/app/components/websiteComp/homeComp/FeaturesSection'
import WhyUsSection from '@/app/components/websiteComp/homeComp/WhyUsSection'
import TestimonialsSection from '@/app/components/websiteComp/homeComp/TestimonialsSection'
import FaqSection from '@/app/components/websiteComp/homeComp/FaqSection'

export default async function HomePage() {
  const topics = await getTopics();
  const catalog = await getCourses();
  const stats = getCourseStats(catalog);

  // Flagship courses (microfinance and sustainability)
  const flagshipSlugs = ["microfinance", "sustainability-and-finance"];
  const flagship = catalog.filter((c: any) => flagshipSlugs.includes(c.slug));


  return (
    <>
      {/* ========== HERO SECTION ========== */}
      <HeroSection />

      {/* ========== EXPLORE OUR COURSES ========== */}
      <ExploreCoursesSection />

      {/* ========== FLAGSHIP PROGRAMS ========== */}
      <MoreCoursesSection />

      <HowToBuySection />

      <FeaturesSection />
      <WhyUsSection />
      <TestimonialsSection />\
      <FaqSection />
      {/* <section className="py-14 sm:py-[78px]">
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
      </section> */}

      {/* ========== EXPLORE SECTIONS ========== */}
      {/* <section className="border-y border-line-soft bg-cream-2 py-14 sm:py-16">
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
      </section> */}

      {/* ========== TOPICS ========== */}
      {/* <section className="py-14 sm:py-[78px]">
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
      </section> */}

      {/* ========== HOW IT WORKS ========== */}
      {/* <section className="py-14 sm:py-[78px]">
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
              Signature moment: the only place the amber accent appears,
                  set inside a soft dashed "seal" ring for the certificate step.
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
      </section> */}

      {/* ========== TOOLS TEASER ========== */}
      {/* <section className="py-8 sm:py-12">
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
      </section> */}
    </>
  );
}