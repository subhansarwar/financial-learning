// app/(user-panel)/dashboard/page.jsx
import DashboardPreview from "./DashboardClient";

export const metadata = {
    title: "Dashboard My Learning | The Eco Lens",
    description: "Track your learning progress, view completed courses, and download certificates.",
};

export default async function DashboardPage() {

    return <DashboardPreview />;
}