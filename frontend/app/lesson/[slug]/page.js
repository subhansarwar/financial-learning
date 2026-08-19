// app/lesson/[slug]/page.jsx
import { getCourseBySlug } from "@/lib/data";
import { notFound, redirect } from "next/navigation";
import LessonClient from "./LessonClient";
import {
    BookOpen,
    ChevronLeft,
    CheckCircle2,
    Lock,
    PlayCircle,
    FileText,
    HelpCircle,
    Clock,
    Layers,
    Award,
    GraduationCap,
} from "lucide-react";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const parts = slug.split("--");
    const courseSlug = parts[0];
    const lessonId = parts[1] || parts[0];

    const courseData = await getCourseBySlug(courseSlug);
    if (!courseData) return { title: "Lesson Not Found" };

    const modules = Array.isArray(courseData.modules) ? courseData.modules : [];
    let lesson = null;
    for (const m of modules) {
        const found = m.lessons?.find((l) => l.id === lessonId);
        if (found) { lesson = found; break; }
    }

    if (!lesson) return { title: "Lesson Not Found" };

    return {
        title: `${lesson.title} ${courseData.title} | Finance Platform Demo`,
        description: `Learn ${lesson.title} in ${courseData.title}. Free finance education lesson.`,
        keywords: `${lesson.title}, ${courseData.title}, finance lesson, ${lesson.type}`,
    };
}

export default async function LessonPage({ params, searchParams }) {
    const { slug } = await params;

    // Redirect old format
    if (searchParams?.c && searchParams?.l) {
        redirect(`/lesson/${searchParams.c}--${searchParams.l}`);
    }

    const parts = slug.split("--");
    const courseSlug = parts[0];
    const lessonId = parts[1] || parts[0];

    const courseData = await getCourseBySlug(courseSlug);
    if (!courseData) return notFound();

    const modules = Array.isArray(courseData.modules) ? courseData.modules : [];
    let currentLesson = null;
    let currentModule = null;
    let moduleIndex = -1;

    for (let i = 0; i < modules.length; i++) {
        const m = modules[i];
        const found = m.lessons?.find((l) => l.id === lessonId);
        if (found) {
            currentLesson = found;
            currentModule = m;
            moduleIndex = i;
            break;
        }
    }

    if (!currentLesson) return notFound();

    const allLessons = modules.flatMap((m) =>
        (m.lessons || []).map((l) => ({ ...l, moduleId: m.id, moduleTitle: m.title }))
    );

    const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

    const isLocked = courseData.gated && moduleIndex > 0;

    return (
        <section className="min-h-[calc(100vh-160px)] bg-cream my-12 mb-0 sm:py-8 lg:py-10">
            <div className="mx-6 px-4 sm:px-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 lg:gap-8">
                    {/* TOC - Desktop */}
                    <aside className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-24 max-h-[calc(100vh-160px)] overflow-y-auto rounded-xl2 border border-line bg-card p-4 shadow-card">
                            <LessonTOC
                                course={courseData}
                                slug={courseSlug}
                                currentLessonId={lessonId}
                                isGated={courseData.gated}
                            />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <LessonClient
                            course={courseData}
                            slug={courseSlug}
                            lesson={currentLesson}
                            module={currentModule}
                            prevLesson={prevLesson}
                            nextLesson={nextLesson}
                            isLocked={isLocked}
                            allLessons={allLessons}
                            currentIndex={currentIndex}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

// TOC Component
function LessonTOC({ course, slug, currentLessonId, isGated }) {
    const modules = Array.isArray(course.modules) ? course.modules : [];
    const typeIconMap = {
        reading: { icon: FileText, color: "text-blue-500" },
        video: { icon: PlayCircle, color: "text-rose-500" },
        quiz: { icon: HelpCircle, color: "text-amber-500" },
    };

    return (
        <>
            <div className="mb-4 border-b border-line-soft pb-3">
                <a href={`/course/${slug}`} className="flex items-center gap-1.5 text-sm font-bold text-ink-2 transition-colors hover:text-brand-deep">
                    <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
                    {course.title}
                </a>
            </div>
            {modules.map((m, mi) => {
                const mLocked = isGated && mi > 0;
                return (
                    <div key={m.id || mi} className="mb-3">
                        <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted">
                            {mLocked && <Lock className="h-3 w-3" strokeWidth={2.5} />}
                            {m.title}
                        </div>
                        <div className="space-y-0.5">
                            {(m.lessons || []).map((l) => {
                                const isCurrent = l.id === currentLessonId;
                                const { icon: Icon, color } = typeIconMap[l.type] || typeIconMap.reading;
                                return (
                                    <a
                                        key={l.id}
                                        href={`/lesson/${slug}--${l.id}`}
                                        className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors ${isCurrent
                                                ? "bg-brand-soft font-bold text-brand-deep"
                                                : "text-ink-2 hover:bg-cream-2 hover:text-ink"
                                            }`}
                                    >
                                        <Icon className={`h-3.5 w-3.5 ${color}`} strokeWidth={2} />
                                        <span className="flex-1 truncate">{l.title}</span>
                                        <span className="text-xs text-muted">{l.durationMin}m</span>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </>
    );
}