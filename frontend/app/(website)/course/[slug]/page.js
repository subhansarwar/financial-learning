// app/(website)/course/[slug]/page.jsx
import { getCourseBySlug, getTopics } from "@/lib/data";
import {
    ArrowLeft,
    Award,
    BookOpen,
    Clock,
    Layers,
    Lock,
    PlayCircle,
    Shield,
    Target
} from "lucide-react";
import CourseClient from "./CourseClient";

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
        title: `${course.title} Free Finance Course | Finance Platform`,
        description: `${course.tagline} Learn ${course.title} with ${course.lessons} lessons. Free course with certificate.`,
        keywords: `${course.title}, ${course.level} course, finance education, ${course.topic}`,
        openGraph: {
            title: `${course.title} Free Finance Course`,
            description: course.tagline,
        },
    };
}

export default async function CoursePage({ params }) {
    const { slug } = await params;
    const [course, topics] = await Promise.all([getCourseBySlug(slug), getTopics()]);

    if (!course) {
        return (
            <section className="flex min-h-[60vh] items-center justify-center bg-cream py-20">
                <div className="text-center">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-brand-soft">
                        <BookOpen className="h-12 w-12 text-brand-deep" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">Course not found</h1>
                    <p className="mt-2 text-muted">The course you're looking for doesn't exist.</p>
                    <a href="/catalog" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-deep px-6 py-3 font-bold text-white hover:bg-[#241f6b]">
                        <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
                        Browse courses
                    </a>
                </div>
            </section>
        );
    }

    const topic = topics.find((t) => t.id === course.topic) || {
        id: course.topic,
        name: course.topic,
        icon: "📚",
        hue: 160,
    };

    const modules = Array.isArray(course?.modules) ? course.modules : [];
    const lessons = modules.flatMap((m) => m?.lessons || []) || [];
    const totalLessons = lessons.length;
    const gated = !!course?.gated;

    return (
        <>
            {/* Hero Section */}
            <section
                className="relative overflow-hidden border-b border-line-soft py-12 sm:py-16 lg:py-20"
                style={{ background: `hsl(${topic.hue || 160} 70% 94%)` }}
            >
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 20% 50%, hsl(${topic.hue || 160} 55% 42%) 0%, transparent 50%)` }} />
                <div className="relative mx-6 px-4 sm:px-6">
                    {/* Breadcrumbs */}
                    <nav className="mb-4 flex flex-wrap items-center gap-1 text-sm font-medium text-ink-2">
                        <a href="/catalog" className="hover:text-brand-deep">Catalog</a>
                        <span>/</span>
                        <a href={`/catalog?topic=${topic.id}`} className="hover:text-brand-deep">{topic.name}</a>
                        <span>/</span>
                        <span className="text-ink">{course.title}</span>
                    </nav>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
                                {course.title}
                            </h1>
                            <p className="mt-3 text-lg font-medium text-ink-2">{course.tagline}</p>

                            {/* Meta Row */}
                            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-ink-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1">
                                    <Award className="h-3.5 w-3.5 text-brand" strokeWidth={2.5} />
                                    <b>{course.level}</b>
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1">
                                    <Clock className="h-3.5 w-3.5 text-brand" strokeWidth={2.5} />
                                    <b>{formatDuration(course.lengthMin)}</b>
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1">
                                    <Layers className="h-3.5 w-3.5 text-brand" strokeWidth={2.5} />
                                    <b>{course.modules?.length || 0}</b> modules
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1">
                                    <BookOpen className="h-3.5 w-3.5 text-brand" strokeWidth={2.5} />
                                    <b>{course.lessons || 0}</b> lessons
                                </span>
                                {gated && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-amber-700">
                                        <Lock className="h-3.5 w-3.5" strokeWidth={2.5} />
                                        Pass each module at 70%+
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Sidebar CTA - Desktop */}
                        <div className="hidden lg:block">
                            <div className="sticky top-24 rounded-xl2 border border-line bg-card p-6 shadow-card">
                                <div className="flex items-center gap-3 border-b border-line-soft pb-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-lg font-bold text-brand-deep">
                                        {getInitials(course.instructor?.name)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-ink">{course.instructor?.name || "Instructor"}</p>
                                        <p className="text-sm text-muted">{course.instructor?.title || ""}</p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-muted">Your progress</span>
                                        <b className="text-brand-deep">0%</b>
                                    </div>
                                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-cream-2">
                                        <div className="h-full w-0 rounded-full bg-brand" />
                                    </div>
                                    <p className="mt-1.5 text-xs text-muted">0 of {totalLessons} lessons complete</p>
                                </div>
                                <a
                                    href={`/lesson?c=${encodeURIComponent(slug)}&l=${encodeURIComponent(lessons[0]?.id || "")}`}
                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand-deep px-6 py-3 font-bold text-white transition-colors hover:bg-[#241f6b]"
                                >
                                    <PlayCircle className="h-4 w-4" strokeWidth={2.5} />
                                    Start course free
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Course Content */}
            <section className="py-12 sm:py-16">
                <div className="mx-6 px-4 sm:px-6">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <h2 className="mb-4 flex items-center gap-2.5 text-xl font-bold text-ink sm:text-2xl">
                                <BookOpen className="h-5 w-5 text-brand" strokeWidth={2} />
                                Course content
                            </h2>
                            <CourseClient slug={slug} course={course} topic={topic} />

                            <div className="mt-6 rounded-lg border-l-4 border-brand bg-brand-soft/50 p-4">
                                <div className="flex items-start gap-3">
                                    <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" strokeWidth={2} />
                                    <div className="text-sm text-ink-2">
                                        <span className="font-bold text-ink">Education, not advice.</span> This course
                                        teaches general concepts. It is not a recommendation to buy, sell or use any
                                        financial product.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar - Desktop */}
                        <aside className="hidden lg:block">
                            <div className="sticky top-24 space-y-4">
                                <div className="rounded-xl2 border border-line bg-card p-6 shadow-card">
                                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
                                        <Target className="h-4 w-4 text-brand" strokeWidth={2} />
                                        What you'll learn
                                    </h3>
                                    <ul className="space-y-2">
                                        {(course.outcomes || []).map((o, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-ink-2">
                                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand" />
                                                {o}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </>
    );
}

function formatDuration(min) {
    if (!min || min <= 0) return "";
    const h = Math.floor(min / 60);
    const m = min % 60;
    if (h && m) return `${h}h ${m}m`;
    if (h) return `${h}h`;
    return `${m} min`;
}

function getInitials(name) {
    if (!name) return "?";
    return name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}