// app/components/adminPanelComp/AdminDashboard.jsx
"use client";

import { toast } from "@/lib/app";
import { LayoutDashboard } from "lucide-react";
import { useState } from "react";
import HelpPanel from "./HelpPanel";
import CaseStudiesEditor from "./manageCaseStudies/CaseStudiesEditor";
import CourseEditor from "./manageCourse/mainCourseFile/CourseEditor";
import ResearchEditor from "./manageResearch/ResearchEditor";

// Dashboard Component
function DashboardView() {
    return (
        <div className="flex min-h-[calc(100vh-300px)] items-center justify-center">
            <div className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-soft">
                    <LayoutDashboard className="h-10 w-10 text-brand-deep" strokeWidth={2} />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
                    Admin Dashboard
                </h1>
                <p className="mt-3 text-lg text-muted">
                    Welcome to the Finance Platform Admin Panel
                </p>
                <p className="mt-1 text-sm text-muted">
                    Select a section from the sidebar to manage content
                </p>
            </div>
        </div>
    );
}

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
                return <DashboardView />;
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