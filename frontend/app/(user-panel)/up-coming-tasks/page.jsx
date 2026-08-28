// app/(user-panel)/upcoming/page.jsx
import UpcomingClient from "./UpcomingClient";

export const metadata = {
    title: "Upcoming Tasks Learning Dashboard | The Eco Lens",
    description: "View your upcoming tasks, deadlines, events, and learning milestones. Stay on track with your study schedule.",
    keywords: "upcoming tasks, learning schedule, deadlines, study plan, finance courses",
    openGraph: {
        title: "Upcoming Tasks Learning Dashboard",
        description: "View your upcoming tasks, deadlines, events, and learning milestones.",
        url: "https://your-domain.com/upcoming",
    },
    twitter: {
        title: "Upcoming Tasks Learning Dashboard",
        description: "View your upcoming tasks, deadlines, and learning milestones.",
    },
};

export default function UpcomingPage() {
    return <UpcomingClient />;
}