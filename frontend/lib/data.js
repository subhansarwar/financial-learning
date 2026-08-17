// lib/data.js
import courses from "@/data/courses.json";
import topics from "@/data/topics.json";
import caseStudies from "@/data/caseStudies.json";

const courseCache = {};

export async function getCourses() {
    return courses;
}

export async function getTopics() {
    return topics;
}

export async function getCourseBySlug(slug) {
    // Check cache first
    if (courseCache[slug]) {
        return courseCache[slug];
    }

    // Try to load course-specific JSON file from courses folder
    try {
        const courseModule = await import(`@/data/courses/${slug}.json`);
        const course = courseModule.default;

        // Ensure modules is an array
        if (!Array.isArray(course.modules)) {
            course.modules = [];
        }

        // Ensure each module has lessons as array
        course.modules = course.modules.map(m => ({
            ...m,
            lessons: Array.isArray(m?.lessons) ? m.lessons : []
        }));

        // Cache the course
        courseCache[slug] = course;
        return course;
    } catch (error) {
        console.warn(`Course file not found for slug: ${slug}`, error);

        //Fallback to catalog data
        const catalogCourse = coursesData.find(c => c.slug === slug);
        if (catalogCourse) {
            const minimalCourse = {
                ...catalogCourse,
                modules: [],
                instructor: {
                    ...catalogCourse.instructor,
                    bio: ""
                },
                outcomes: []
            };
            courseCache[slug] = minimalCourse;
            return minimalCourse;
        }
        return null;
    }
}

export async function getTopicById(id) {
    const topics = await getTopics();
    return topics.find(t => t.id === id) || { id, name: id, icon: "📚", hue: 160 };
}

export function getCourseStats(catalog) {
    const totalCourses = catalog.length;
    const totalLessons = catalog.reduce((sum, c) => sum + (c.lessons || 0), 0);
    const totalMinutes = catalog.reduce((sum, c) => sum + (c.lengthMin || 0), 0);
    return { totalCourses, totalLessons, totalMinutes };
}

export async function getCaseStudies() {
    try {
        const caseStudies = await import("@/data/caseStudies.json");
        return caseStudies.default;
    } catch (_) {
        return [];
    }
}

export async function getStatistics() {
    try {
        const stats = await import("@/data/statistics.json");
        return stats.default;
    } catch (_) {
        return { facts: [], countryStats: {}, companyStats: {}, greenStats: {} };
    }
}