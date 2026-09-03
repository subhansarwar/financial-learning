// lib/curriculum.js

// Backend list-modules response ko StepTwoCurriculum ke expected shape
// { name, lectures } me convert karta hai
export function normalizeCurriculum(modules) {
    const list = Array.isArray(modules) ? modules : modules?.modules || [];
    return list.map((mod) => ({
        id: mod.id,
        name: mod.name ?? mod.title ?? "",
        order_index: mod.order_index ?? 0,
        lectures: (mod.lectures ?? mod.lessons ?? []).map((lesson) => ({
            id: lesson.id,
            title: lesson.title ?? "",
            type: lesson.type ?? "reading",
            duration_min: lesson.duration_min ?? 0,
            order_index: lesson.order_index ?? 0,
            content: lesson.content ?? "",
            video_url: lesson.video_url ?? "",
            quiz_pass_pct: lesson.quiz_pass_pct ?? 100,
            quiz_questions: lesson.quiz_questions ?? [],
        })),
    }));
}