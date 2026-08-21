// app/(user-panel)/my-courses/page.jsx
import MyCoursesClient from "./MyCoursesClient";

export const metadata = {
    title: "My Courses Learning Dashboard | Finance Platform",
    description: "View and manage your enrolled courses, track progress, and continue learning.",
};

export default function MyCoursesPage() {
    return <MyCoursesClient />;
}