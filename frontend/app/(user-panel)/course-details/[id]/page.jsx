// app/(user-panel)/course-details/[id]/page.jsx
import CourseDetailsClient from "./CourseDetailsClient";

export const metadata = {
    title: "Course Details | The Eco Lens",
    description: "Learn with our comprehensive course content.",
};

export default async function CourseDetailsPage({ params }) {
    const { id } = await params;
    // id is the slug (e.g., "course-02")
    return <CourseDetailsClient courseId={id} />;
}