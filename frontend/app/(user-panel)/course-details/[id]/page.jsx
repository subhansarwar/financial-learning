// app/(user-panel)/course-details/[id]/page.jsx
import { notFound } from "next/navigation";
import { initialCourses } from "../../../components/userDashboardComp/userCoursesComp/dummyCourses";
import CourseDetailsClient from "./CourseDetailsClient";

export async function generateMetadata({ params }) {
    const { id } = await params;
    const course = initialCourses.find((c) => c.id === parseInt(id));

    if (!course) {
        return {
            title: "Course Not Found",
            description: "The course you're looking for doesn't exist.",
        };
    }

    return {
        title: `${course.title} — Course Details | Finance Platform`,
        description: course.description || `Learn ${course.title} with detailed course content.`,
    };
}

export default async function CourseDetailsPageRoute({ params }) {
    const { id } = await params;
    const course = initialCourses.find((c) => c.id === parseInt(id));

    if (!course) {
        return notFound();
    }

    return <CourseDetailsClient course={course} />;
}