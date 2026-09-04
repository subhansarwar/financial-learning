// app/components/adminPanelComp/AdminDashboard.jsx
"use client";

import { toast } from "@/lib/app";
import { useState } from "react";
import HelpPanel from "./HelpPanel";
import CaseStudiesEditor from "./manageCaseStudies/CaseStudiesEditor";
import CourseEditor from "./manageCourse/mainCourseFile/CourseEditor";
import MonitoringDashboard from "./manageMonitoring/MonitoringDashboard";
import ResearchEditor from "./manageResearch/ResearchEditor";

export default function AdminDashboard({ activeTab, courses, topics, onDataChange }) {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await onDataChange();
        setTimeout(() => {
            setIsRefreshing(false);
            toast("Data refreshed");
        }, 500);
    };

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard": // Dashboard tab
                return <MonitoringDashboard />;
            case "courses":
                return <CourseEditor courses={courses} topics={topics} onDataChange={onDataChange} />;
            case "research":
                return <ResearchEditor onDataChange={onDataChange} />;
            case "case-studies":
                return <CaseStudiesEditor onDataChange={onDataChange} />;
            case "help":
                return <HelpPanel />;
            default:
                return <DashboardView />;
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF7ED] py-3 sm:py-6 lg:py-8">
            <div className="mx-6 px-4 sm:px-6 lg:px-8">
                {/* Fixed padding for header */}
                <div>
                    {/* Content */}
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}