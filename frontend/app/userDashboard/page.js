import DashboardComp from "../components/dashboardComp/DashboardComp";

export const metadata = {
    title: "Dashboard | Finance Platform",
    description: "Track your learning progress, view completed courses, and download certificates.",
    openGraph: {
        title: "Dashboard",
        description: "Track your learning progress on Finance Platform.",
        url: "https://your-domain.com/dashboard",
    },
};

export default function DashboardPage() {


    return (
        <DashboardComp />
    );
}