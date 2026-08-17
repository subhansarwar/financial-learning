// app/lesson/[slug]/page.js
import { getCourseBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import LessonClient from "./LessonClient";

// Generate metadata for SEO
export async function generateMetadata({ params }) {
    const { slug } = await params;

    // Extract course slug and lesson ID from the slug parameter
    // Format: "course-slug--lesson-id"
    const parts = slug.split('--');
    const courseSlug = parts[0];
    const lessonId = parts[1] || parts[0];

    const courseData = await getCourseBySlug(courseSlug);

    if (!courseData) {
        return {
            title: "Lesson Not Found",
            description: "The lesson you're looking for doesn't exist.",
        };
    }

    // Find the lesson
    const modules = Array.isArray(courseData.modules) ? courseData.modules : [];
    let lesson = null;
    for (const m of modules) {
        const found = m.lessons?.find(l => l.id === lessonId);
        if (found) {
            lesson = found;
            break;
        }
    }

    if (!lesson) {
        return {
            title: "Lesson Not Found",
            description: "The lesson you're looking for doesn't exist.",
        };
    }

    return {
        title: `${lesson.title} — ${courseData.title} | Finance Platform Demo`,
        description: `Learn ${lesson.title} in ${courseData.title}. Free finance education lesson.`,
        keywords: `${lesson.title}, ${courseData.title}, finance lesson, ${lesson.type}`,
    };
}

// Main Page Component
export default async function LessonPage({ params, searchParams }) {
    const { slug } = await params;

    // ✅ Check if old query parameter format is used and redirect
    if (searchParams?.c && searchParams?.l) {
        // Redirect to new URL format
        const { redirect } = await import("next/navigation");
        redirect(`/lesson/${searchParams.c}--${searchParams.l}`);
    }

    // Extract course slug and lesson ID from slug
    const parts = slug.split('--');
    const courseSlug = parts[0];
    const lessonId = parts[1] || parts[0];

    // ✅ Fetch course data (use different variable name)
    const courseData = await getCourseBySlug(courseSlug);

    if (!courseData) {
        return notFound();
    }

    // Ensure modules is an array
    const modules = Array.isArray(courseData.modules) ? courseData.modules : [];

    // Find the lesson and its module
    let currentLesson = null;
    let currentModule = null;
    let moduleIndex = -1;

    for (let i = 0; i < modules.length; i++) {
        const m = modules[i];
        const found = m.lessons?.find(l => l.id === lessonId);
        if (found) {
            currentLesson = found;
            currentModule = m;
            moduleIndex = i;
            break;
        }
    }

    // If lesson not found, return 404
    if (!currentLesson) {
        return notFound();
    }

    // Get all lessons flat for navigation
    const allLessons = modules.flatMap(m =>
        (m.lessons || []).map(l => ({ ...l, moduleId: m.id, moduleTitle: m.title }))
    );

    const currentIndex = allLessons.findIndex(l => l.id === lessonId);
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

    // Check if module is locked (for gated courses)
    const isLocked = courseData.gated && moduleIndex > 0 && !isModulePassed(courseData, moduleIndex - 1);

    return (
        <section className="section" style={{ paddingTop: "36px" }}>
            <div className="wrap">
                <div className="lesson-shell">
                    {/* Table of Contents */}
                    <aside className="lesson-toc" aria-label="Course contents">
                        <LessonTOC
                            course={courseData}
                            slug={courseSlug}
                            currentLessonId={lessonId}
                            isGated={courseData.gated}
                        />
                    </aside>

                    {/* Lesson Content */}
                    <div className="lesson-content">
                        <LessonClient
                            course={courseData}
                            slug={courseSlug}
                            lesson={currentLesson}
                            module={currentModule}
                            prevLesson={prevLesson}
                            nextLesson={nextLesson}
                            isLocked={isLocked}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

// Helper: Check if module is passed
function isModulePassed(courseData, moduleIndex) {
    // This will be handled on client side with localStorage
    // For server side, we'll pass the data to client
    return false;
}

// TOC Component
function LessonTOC({ course, slug, currentLessonId, isGated }) {
    const modules = Array.isArray(course.modules) ? course.modules : [];
    const typeIcon = { reading: "📖", video: "▶️", quiz: "✍️" };

    return (
        <>
            <div className="toc-head">
                <a href={`/course/${slug}`} style={{ color: "inherit" }}>
                    ← {course.title}
                </a>
            </div>
            {modules.map((m, mi) => {
                const mLocked = isGated && mi > 0; // Will be checked on client
                return (
                    <div key={m.id || mi}>
                        <div className="toc-mod">
                            {mLocked ? "🔒 " : ""}{m.title}
                        </div>
                        {(m.lessons || []).map(l => {
                            const isCurrent = l.id === currentLessonId;
                            return (
                                <a
                                    key={l.id}
                                    href={`/lesson/${slug}--${l.id}`}
                                    className={`${isCurrent ? "current" : ""}`}
                                >
                                    <span className="l-done"></span>
                                    <span style={{ flex: 1 }}>{l.title}</span>
                                    <span style={{ fontSize: ".8rem" }}>
                                        {typeIcon[l.type] || ""}
                                    </span>
                                </a>
                            );
                        })}
                    </div>
                );
            })}
        </>
    );
}