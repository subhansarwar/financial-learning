// app/(website)/course/[slug]/page.jsx
import CoursePageClient from "./CoursePageClient";

// Client component for the page
export default async function CoursePage({ params }) {
    const { slug } = await params;
    return <CoursePageClient slug={slug} />;
}