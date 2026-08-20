// app/(admin-panel)/admin/page.jsx
import { getCourses, getTopics } from "@/lib/data";
import AdminClient from "../../components/adminPanelComp/AdminClient";

export const metadata = {
    title: "Admin Dashboard — Content Manager",
    description: "Admin dashboard for managing platform content.",
    robots: "noindex, nofollow",
};

export default async function AdminPage() {
    const [courses, topics] = await Promise.all([getCourses(), getTopics()]);

    return (
        <AdminClient initialCourses={courses} initialTopics={topics} />
    );
}