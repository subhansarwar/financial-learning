// app/page.js
import { getCourses, getCourseStats, getTopics } from "@/lib/data";
import Link from "next/link";
import CourseCard from "./components/CourseCard";
import TopicCard from "./components/TopicCard";

export default async function HomePage() {
  const topics = await getTopics();
  const catalog = await getCourses();
  const stats = getCourseStats(catalog);

  // Flagship courses (microfinance and sustainability)
  const flagshipSlugs = ["microfinance", "sustainability-and-finance"];
  const flagship = catalog.filter(c => flagshipSlugs.includes(c.slug));

  // Hero stats calculation
  const lessons = catalog.reduce((n, c) => n + (c.lessons || 0), 0);
  const minutes = catalog.reduce((n, c) => n + (c.lengthMin || 0), 0);
  const totalCourses = catalog.length;
  const totalTopics = topics.length;
  const totalHours = Math.round(minutes / 60);

  return (
    <>
      {/* ========== HERO SECTION ========== */}
      <section className="hero">
        <div className="hero-arcs"></div>
        <span className="hero-plus" style={{ top: "16%", left: "5%" }}>+</span>
        <span className="hero-plus" style={{ top: "34%", right: "8%" }}>+</span>
        <span className="hero-plus" style={{ bottom: "22%", left: "11%" }}>+</span>
        <span className="hero-plus" style={{ top: "12%", right: "30%" }}>+</span>
        <div className="wrap">
          <span className="kicker">✦ 100% free — no paywalls, ever</span>
          <h1>
            Learn how finance <em>includes</em> people — and how it heals the <em>planet</em>.
          </h1>
          <p className="lede">
            Two flagship 12-module programs — <b>Microfinance</b> and <b>Sustainability &amp; Finance</b> —
            plus case studies, country statistics and a student research corner.
            Pass each module at 70% to unlock the next, and earn your certificate.
          </p>
          <form className="hero-search" action="/catalog" method="get" role="search">
            <input
              type="search"
              name="q"
              placeholder="What do you want to learn? Try “microcredit” or “green bonds”…"
              aria-label="Search courses"
            />
            <button type="submit">Search</button>
          </form>
          <div className="hero-stats">
            <div className="stat">
              <b>{totalCourses}</b>
              <span>free courses</span>
            </div>
            <div className="stat">
              <b>{lessons}</b>
              <span>lessons & quizzes</span>
            </div>
            <div className="stat">
              <b>{totalTopics}</b>
              <span>finance topics</span>
            </div>
            <div className="stat">
              <b>{totalHours}+</b>
              <span>hours of learning</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FLAGSHIP PROGRAMS ========== */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="overline">Flagship programs</span>
              <h2>Twelve modules each. Pass at 70% to move on.</h2>
            </div>
            <Link className="link-more" href="/catalog">Browse all courses →</Link>
          </div>
          <div className="grid cols-2" id="flagshipGrid">
            {flagship.map(course => {
              const topic = topics.find(t => t.id === course.topic);
              return (
                <CourseCard
                  key={course.slug}
                  course={course}
                  topic={topic}
                  progress={null}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== EXPLORE SECTIONS ========== */}
      <section
        className="section"
        style={{
          background: "var(--bg-2)",
          borderTop: "1px solid var(--line-soft)",
          borderBottom: "1px solid var(--line-soft)",
          paddingTop: "64px",
          paddingBottom: "64px"
        }}
      >
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="overline">Beyond the courses</span>
              <h2>Case studies, statistics &amp; student research</h2>
            </div>
          </div>
          <div className="grid cols-3">
            <Link className="topic-card" href="/case-studies">
              <div className="t-icon">📚</div>
              <h3>Case studies</h3>
              <p>Grameen, BRAC, M-Pesa, M-KOPA, Ørsted and more — real organisations, real results, and the lessons each one teaches.</p>
            </Link>
            <Link className="topic-card" href="/statistics">
              <div className="t-icon">📊</div>
              <h3>Statistics</h3>
              <p>Financial-inclusion numbers by country and a snapshot of the institutions and the sustainable-finance market.</p>
            </Link>
            <Link className="topic-card" href="/research">
              <div className="t-icon">📄</div>
              <h3>Research corner</h3>
              <p>Read papers written by students — and publish your own microfinance or sustainability research as a PDF.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ========== TOPICS ========== */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="overline">Explore by topic</span>
              <h2>Every corner of finance, one home</h2>
            </div>
            <Link className="link-more" href="/catalog">Full catalog →</Link>
          </div>
          <div className="grid cols-3" id="topicsGrid">
            {topics.map(topic => {
              const count = catalog.filter(c => c.topic === topic.id).length;
              return <TopicCard key={topic.id} topic={topic} count={count} />;
            })}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="overline">How it works</span>
              <h2>Learn it. Prove it. Keep the certificate.</h2>
            </div>
          </div>
          <div className="grid cols-3">
            <div className="topic-card">
              <div className="t-icon">👤</div>
              <h3>1. Log in &amp; pick a course</h3>
              <p>A quick demo sign-in (no real account) personalises your progress and certificates. Courses split into modules and bite-size lessons.</p>
            </div>
            <div className="topic-card">
              <div className="t-icon">🔓</div>
              <h3>2. Pass to unlock</h3>
              <p>Each module ends with a quiz. Score 70% or higher to unlock the next module — your progress is saved automatically on your device.</p>
            </div>
            <div className="topic-card">
              <div className="t-icon">🎓</div>
              <h3>3. Download your certificate</h3>
              <p>Finish all twelve modules and download a free certificate of completion instantly. Unaccredited, honest, and yours to keep.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TOOLS TEASER ========== */}
      <section className="section tight">
        <div className="wrap">
          <div className="cta-band">
            <div>
              <h2>Handy tools, built right in</h2>
              <p>Turn theory into numbers: a budgeting calculator, a compound interest explorer, and an ESG comparison sandbox.</p>
            </div>
            <Link className="btn btn-emerald" href="/tools">Open the tools →</Link>
          </div>
        </div>
      </section>
    </>
  );
}