// app/(admin-panel)/admin/dashboard/page.jsx
import { getCourses, getTopics } from "@/lib/data";
import AdminClient from "../../../components/adminPanelComp/AdminClient";

export const metadata = {
    title: "Admin Dashboard Content Manager",
    description: "Manage courses, topics, and ESG data.",
    robots: "noindex, nofollow",
};

export default async function AdminDashboardPage() {
    const [courses, topics] = await Promise.all([getCourses(), getTopics()]);

    return (
        <AdminClient initialCourses={courses} initialTopics={topics} />
    );
}