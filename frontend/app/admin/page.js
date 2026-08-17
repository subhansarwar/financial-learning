// app/admin/page.js
import { getCourses, getTopics } from "@/lib/data";
import AdminClient from "../components/adminPanelComp/AdminClient";

export const metadata = {
    title: "Admin Panel Content Manager | Finance Platform",
    description: "Manage courses, topics, and tool data. No developers needed edit content directly.",
    robots: "noindex, nofollow",
};

export default async function AdminPage() {
    // Fetch data on server side
    const [courses, topics] = await Promise.all([
        getCourses(),
        getTopics()
    ]);

    return (
        <div className="admin-page">
            <AdminClient
                initialCourses={courses}
                initialTopics={topics}
            />
        </div>
    );
}