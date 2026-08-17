export const metadata = {
    title: "PocketPilot Mock Money Management App | Finance Platform Demo",
    description: "Practice money management with PocketPilot, a mock budgeting and debt tracking app. Interactive financial tools for learning.",
    keywords: "money management app, budgeting app, debt tracking, financial literacy, mock app",
    robots: "index, follow",
};


import AppComp from "../components/appComp/AppComp";

export default function AppPage() {


    // Since the PocketPilot app is complex, we'll load it dynamically
    // You can copy the entire PocketPilot HTML/JS into a separate component
    return (
        <>
            <AppComp />
        </>
    );
}