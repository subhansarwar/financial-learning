// app/course/[slug]/page.js
import { getCourses, getTopics, getCourseBySlug, getTopicById } from "@/lib/data";
import CourseClient from "./CourseClient";

//Generate metadata for SEO
export async function generateMetadata({ params }) {
    const { slug } = await params;
    const course = await getCourseBySlug(slug);

    if (!course) {
        return {
            title: "Course Not Found",
            description: "The course you're looking for doesn't exist.",
        };
    }

    return {
        title: `${course.title} Free Finance Course | Finance Platform Demo`,
        description: `${course.tagline} Learn ${course.title} with ${course.lessons} lessons. Free course with certificate.`,
        keywords: `${course.title}, ${course.level} course, finance education, ${course.topic}`,
        openGraph: {
            title: `${course.title} Free Finance Course`,
            description: course.tagline,
        },
    };
}

// ✅ Main Page Component
export default async function CoursePage({ params }) {
    const { slug } = await params;

    // Fetch course and topic data
    const [course, topics] = await Promise.all([
        getCourseBySlug(slug),
        getTopics()
    ]);

    // If course not found, return 404
    if (!course) {
        return (
            <section className="section">
                <div className="wrap" style={{ textAlign: "center", padding: "60px 0" }}>
                    <div style={{ fontSize: "4rem" }}>📚</div>
                    <h1 className="section-title" style={{ margin: "14px 0 10px" }}>Course not found</h1>
                    <p className="text-muted" style={{ marginBottom: "26px" }}>
                        The course you're looking for doesn't exist or has been moved.
                    </p>
                    <a className="btn btn-primary" href="/catalog">Browse courses</a>
                </div>
            </section>
        );
    }

    // Find topic
    const topic = topics.find(t => t.id === course.topic) || {
        id: course.topic,
        name: course.topic,
        icon: "📚",
        hue: 160
    };

    return (
        <>
            <section className="course-hero" id="courseHero" style={{ "--hue": topic.hue || 160 }}>
                <div className="wrap">
                    <div className="crumbs">
                        <a href="/catalog">Catalog</a> /
                        <a href={`/catalog?topic=${topic.id}`}> {topic.name}</a>
                    </div>
                    <h1>{course.title}</h1>
                    <p className="tagline">{course.tagline}</p>
                    <div className="meta-row">
                        <span>Level: <b>{course.level}</b></span>
                        <span>Length: <b>{formatDuration(course.lengthMin)}</b></span>
                        <span><b>{course.modules?.length || 0}</b> modules · <b>{course.lessons || 0}</b> lessons</span>
                        <span>Topic: <b>{topic.name}</b></span>
                        {course.gated && (
                            <span className="gate-pill">🔒 Pass each module at 70%+ to unlock the next</span>
                        )}
                    </div>
                </div>
            </section>

            <section className="section tight">
                <div className="wrap">
                    <div className="course-layout">
                        <div>
                            <h2 className="section-title" style={{ fontSize: "1.5rem", marginBottom: "16px" }}>
                                Course content
                            </h2>
                            <CourseClient
                                slug={slug}
                                course={course}
                                topic={topic}
                            />

                            <div className="notice">
                                <span>ℹ️</span>
                                <div>
                                    <b>Education, not advice.</b> This course teaches general concepts.
                                    It is not a recommendation to buy, sell or use any financial product.
                                </div>
                            </div>
                        </div>

                        <aside>
                            <div className="side-card" id="sideCard">
                                <CourseSidebar
                                    slug={slug}
                                    course={course}
                                />
                            </div>
                            <div className="side-card mt-2" style={{ position: "static" }}>
                                <b style={{ fontSize: ".95rem" }}>What you'll learn</b>
                                <ul style={{ margin: "12px 0 0 18px", fontSize: ".9rem", color: "var(--ink-2)" }}>
                                    {(course.outcomes || []).map((o, i) => (
                                        <li key={i} style={{ marginBottom: "8px" }}>{o}</li>
                                    ))}
                                </ul>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </>
    );
}

// Helper function to format duration
function formatDuration(min) {
    if (!min || min <= 0) return "—";
    const h = Math.floor(min / 60);
    const m = min % 60;
    if (h && m) return `${h}h ${m}m`;
    if (h) return `${h}h`;
    return `${m} min`;
}

// Sidebar Component (Server Component)
function CourseSidebar({ slug, course }) {
    const modules = Array.isArray(course?.modules) ? course.modules : [];
    const lessons = modules.flatMap(m => m?.lessons || []) || [];
    const totalLessons = lessons.length;
    const gated = !!course?.gated;
    const needPct = gated ? 70 : 70;

    // Find first open lesson for gated courses
    let firstLesson = lessons.length > 0 ? lessons[0] : null;

    return (
        <>
            <div className="instr-row">
                <span className="avatar">
                    {getInitials(course.instructor?.name)}
                </span>
                <div>
                    <b>{course.instructor?.name || "Instructor"}</b><br />
                    <span className="text-muted" style={{ fontSize: ".85rem" }}>
                        {course.instructor?.title || ""}
                    </span>
                </div>
            </div>
            <p className="text-muted" style={{ fontSize: ".88rem", marginBottom: "18px" }}>
                {course.instructor?.bio || ""}
            </p>
            <div className="progress-line">
                <span>Your progress</span>
                <b>0%</b>
            </div>
            <div className="progress-bar">
                <i style={{ width: "0%" }}></i>
            </div>
            <p className="text-muted" style={{ fontSize: ".82rem", margin: "8px 0 18px" }}>
                0 of {totalLessons} lessons complete
            </p>
            <a
                className="btn btn-primary"
                style={{ width: "100%" }}
                href={`/lesson?c=${encodeURIComponent(slug)}&l=${encodeURIComponent(firstLesson?.id || "")}`}
            >
                Start course — free
            </a>
            <div id="certSlot" className="mt-2"></div>
        </>
    );
}

// Helper function to get initials
function getInitials(name) {
    if (!name) return "?";
    return name.split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();
}