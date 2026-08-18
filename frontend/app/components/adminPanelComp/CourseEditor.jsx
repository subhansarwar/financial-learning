// app/admin/components/CourseEditor.jsx
"use client";

import { toast } from "react-hot-toast";
import { BookOpen, CheckCircle2, Edit, Plus, AlertCircle, Trash2, RefreshCw, Save, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { adminApi } from "../../api/admin/utils/adminApi";

// Import all sub-components
import CourseForm from "./CourseForm";
import CourseList from "./CourseList";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";
import ModulesPreview from "./ModulesPreview";
import NewCourseModal from "./NewCourseModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import ResetConfirmModal from "./ResetConfirmModal";

export default function CourseEditor({ courses, topics, onDataChange }) {
    const [selectedSlug, setSelectedSlug] = useState(null);
    const [courseData, setCourseData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [overriddenKeys, setOverriddenKeys] = useState(new Set());
    const [expandedModules, setExpandedModules] = useState({});
    const [showNewCourseModal, setShowNewCourseModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);

    useEffect(() => {
        refreshKeys();
    }, []);

    const refreshKeys = async () => {
        try {
            const keys = await adminApi.getKeys();
            setOverriddenKeys(new Set(keys));
        } catch (_) {
            setOverriddenKeys(new Set());
        }
    };

    const loadCourse = async (slug) => {
        setLoading(true);
        setSelectedSlug(slug);
        try {
            const course = await adminApi.getCourse(slug);
            setCourseData(course);
            if (course?.modules?.length > 0) {
                setExpandedModules({ [course.modules[0].id]: true });
            }
        } catch (_) {
            setCourseData(null);
            // toast.error("Failed to load course");
        } finally {
            setLoading(false);
        }
    };

    const saveCourse = async () => {
        if (!courseData) return;
        setSaving(true);
        try {
            await adminApi.saveCourse(courseData);
            await refreshKeys();
            await onDataChange();
            toast.success("Course published successfully!");
        } catch (_) {
            // toast.error("❌ Error saving course");
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!courseData) return;
        setShowDeleteModal(false);
        setSaving(true);
        try {
            await adminApi.deleteCourse(courseData.slug);
            await refreshKeys();
            await onDataChange();
            setCourseData(null);
            setSelectedSlug(null);
            toast.success("Course deleted successfully");
        } catch (_) {
            // toast.error("❌ Error deleting course");
        } finally {
            setSaving(false);
        }
    };

    const confirmReset = async () => {
        if (!courseData) return;
        setShowResetModal(false);
        setSaving(true);
        try {
            await adminApi.deleteCourse(courseData.slug);
            await refreshKeys();
            await loadCourse(courseData.slug);
            toast.success("Course reset to built-in version");
        } catch (_) {
            // toast.error("❌ Error resetting course");
        } finally {
            setSaving(false);
        }
    };

    const downloadCourse = () => {
        if (!courseData) return;
        const blob = new Blob([JSON.stringify(courseData, null, 2)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${courseData.slug}.json`;
        a.click();
        toast.success("Course downloaded");
    };

    const createNewCourse = (title) => {
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "course-" + Date.now();

        const newCourse = {
            slug,
            title,
            tagline: "A short, inviting one-line description.",
            topic: topics[0]?.id || "general",
            level: "Beginner",
            lengthMin: 45,
            gated: false,
            instructor: { name: "EFP Team", title: "EFP editorial", bio: "" },
            outcomes: ["Understand the core ideas"],
            modules: [{
                id: "m1",
                title: "Getting started",
                lessons: [{
                    id: "m1l1",
                    title: "Introduction",
                    type: "reading",
                    durationMin: 6,
                    content: "## Welcome\n\nIntroduce the big idea in plain language…",
                }],
            }],
        };
        setCourseData(newCourse);
        setSelectedSlug(slug);
        toast.success("New course created edit and publish when ready");
    };

    const toggleModule = (moduleId) => {
        setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
    };

    const isCustomized = courseData ? overriddenKeys.has(`course:${courseData.slug}`) : false;

    return (
        <>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px,1fr]">
                {/* Left Panel - Course List */}
                <div>
                    <button
                        onClick={() => setShowNewCourseModal(true)}
                        className="mb-3 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
                    >
                        <Plus className="h-4 w-4" strokeWidth={2.5} />
                        New Course
                    </button>
                    <CourseList
                        courses={courses}
                        selectedSlug={selectedSlug}
                        overriddenKeys={overriddenKeys}
                        onSelect={loadCourse}
                    />
                </div>

                {/* Right Panel - Course Editor */}
                <div className="min-h-[400px] rounded-xl2 border border-line bg-card p-4 shadow-card sm:p-5">
                    {loading ? (
                        <LoadingState />
                    ) : !courseData ? (
                        <EmptyState />
                    ) : (
                        <>
                            {/* Header */}
                            <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-line-soft pb-4 sm:gap-3">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-brand" strokeWidth={2} />
                                    <h3 className="text-lg font-bold text-ink sm:text-xl">{courseData.title}</h3>
                                </div>
                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${isCustomized
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-emerald-100 text-emerald-700"
                                    }`}>
                                    {isCustomized ? (
                                        <><Edit className="h-3 w-3" strokeWidth={2.5} /> customized</>
                                    ) : (
                                        <><CheckCircle2 className="h-3 w-3" strokeWidth={2.5} /> built-in</>
                                    )}
                                </span>

                                {/* Toolbar */}
                                <div className="ml-auto flex flex-wrap items-center gap-1.5">
                                    <button
                                        onClick={downloadCourse}
                                        className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-bold text-ink-2 transition-colors hover:border-brand/40 hover:bg-brand-soft/30 hover:text-brand-deep"
                                    >
                                        <Download className="h-3.5 w-3.5" strokeWidth={2.5} />
                                        <span className="hidden sm:inline">JSON</span>
                                    </button>
                                    {isCustomized && (
                                        <button
                                            onClick={() => setShowResetModal(true)}
                                            disabled={saving}
                                            className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-bold text-amber-600 transition-colors hover:border-amber-300 hover:bg-amber-50 disabled:opacity-60"
                                        >
                                            <RefreshCw className="h-3.5 w-3.5" strokeWidth={2.5} />
                                            Reset
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setShowDeleteModal(true)}
                                        disabled={saving}
                                        className="inline-flex items-center gap-1 rounded-full border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-600 transition-colors hover:border-rose-300 hover:bg-rose-50 disabled:opacity-60"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" strokeWidth={2.5} />
                                        Delete
                                    </button>
                                    <button
                                        onClick={saveCourse}
                                        disabled={saving}
                                        className="inline-flex items-center gap-1 rounded-full bg-brand-deep px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#241f6b] disabled:opacity-60"
                                    >
                                        {saving ? (
                                            <><RefreshCw className="h-3.5 w-3.5 animate-spin" strokeWidth={2.5} /> Saving...</>
                                        ) : (
                                            <><Save className="h-3.5 w-3.5" strokeWidth={2.5} /> Publish</>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Form */}
                            <CourseForm data={courseData} onChange={setCourseData} topics={topics} />

                            {/* Modules */}
                            <ModulesPreview
                                modules={courseData.modules}
                                expandedModules={expandedModules}
                                onToggle={toggleModule}
                            />

                            {/* Note */}
                            <div className="mt-4 rounded-lg bg-amber-50 p-3">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" strokeWidth={2} />
                                    <p className="text-xs text-amber-700">
                                        <span className="font-bold">Note:</span> Full course editor with modules and
                                        lessons available in complete version. This is a simplified interface.
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Modals */}
            <NewCourseModal
                isOpen={showNewCourseModal}
                onClose={() => setShowNewCourseModal(false)}
                onSubmit={createNewCourse}
            />

            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                courseTitle={courseData?.title}
            />

            <ResetConfirmModal
                isOpen={showResetModal}
                onClose={() => setShowResetModal(false)}
                onConfirm={confirmReset}
                courseTitle={courseData?.title}
            />
        </>
    );
}