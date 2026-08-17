// app/admin/components/CourseEditor.jsx
"use client";

import { useState, useEffect } from "react";
import { toast, esc } from "@/lib/app";
import { adminApi } from "../../api/admin/utils/adminApi";

export default function CourseEditor({ courses, topics, onDataChange }) {
    const [selectedSlug, setSelectedSlug] = useState(null);
    const [courseData, setCourseData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [overriddenKeys, setOverriddenKeys] = useState(new Set());

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
        } catch (error) {
            toast("Failed to load course: " + error.message);
            setCourseData(null);
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
            toast("Course published successfully!");
        } catch (error) {
            toast("Error saving: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    const deleteCourse = async () => {
        if (!courseData) return;
        if (!confirm(`Delete "${courseData.title}" entirely?`)) return;
        setSaving(true);
        try {
            await adminApi.deleteCourse(courseData.slug);
            await refreshKeys();
            await onDataChange();
            setCourseData(null);
            setSelectedSlug(null);
            toast("🗑️ Course deleted");
        } catch (error) {
            toast("Error deleting: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    const resetCourse = async () => {
        if (!courseData) return;
        if (!confirm("Discard your edits and restore the built-in version?")) return;
        setSaving(true);
        try {
            await adminApi.deleteCourse(courseData.slug);
            await refreshKeys();
            await loadCourse(courseData.slug);
            toast("🔄 Reset done");
        } catch (error) {
            toast("Error resetting: " + error.message);
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
    };

    const createNewCourse = () => {
        const title = prompt("Course title:", "New Course");
        if (!title) return;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "course-" + Date.now();

        const newCourse = {
            slug,
            title,
            tagline: "A short, inviting one-line description.",
            topic: topics[0]?.id || "general",
            level: "Beginner",
            lengthMin: 45,
            gated: false,
            instructor: {
                name: "EFP Team",
                title: "EFP editorial",
                bio: ""
            },
            outcomes: ["Understand the core ideas"],
            modules: [
                {
                    id: "m1",
                    title: "Getting started",
                    lessons: [
                        {
                            id: "m1l1",
                            title: "Introduction",
                            type: "reading",
                            durationMin: 6,
                            content: "## Welcome\n\nIntroduce the big idea in plain language…"
                        }
                    ]
                }
            ]
        };
        setCourseData(newCourse);
        setSelectedSlug(slug);
        toast("📝 New course created — edit and publish when ready");
    };

    return (
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "22px", alignItems: "start" }} className="admin-cols">
            {/* Course List */}
            <div>
                <button className="btn btn-emerald btn-sm" style={{ width: "100%", marginBottom: "12px" }} onClick={createNewCourse}>
                    + New course
                </button>
                <div className="admin-list">
                    {courses.map((c) => (
                        <button
                            key={c.slug}
                            onClick={() => loadCourse(c.slug)}
                            className={selectedSlug === c.slug ? "active" : ""}
                        >
                            <span>{esc(c.title)}</span>
                            {overriddenKeys.has(`course:${c.slug}`) && (
                                <span className="badge gold">edited</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Course Editor */}
            <div className="admin-editor">
                {loading ? (
                    <div className="empty-state"><p>Loading course...</p></div>
                ) : !courseData ? (
                    <div className="empty-state">
                        <div className="big">👈</div>
                        <p>Pick a course to edit, or create a new one.</p>
                    </div>
                ) : (
                    <>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", marginBottom: "18px" }}>
                            <b style={{ fontSize: "1.1rem" }}>{esc(courseData.title)}</b>
                            {overriddenKeys.has(`course:${courseData.slug}`) ? (
                                <span className="badge gold">customized</span>
                            ) : (
                                <span className="badge green">built-in</span>
                            )}
                            <span style={{ flex: 1 }}></span>
                            <button className="btn btn-outline btn-sm" onClick={downloadCourse}>Download JSON</button>
                            {overriddenKeys.has(`course:${courseData.slug}`) && (
                                <button className="btn btn-outline btn-sm" onClick={resetCourse} disabled={saving}>
                                    Reset
                                </button>
                            )}
                            <button className="btn btn-outline btn-sm" style={{ color: "var(--danger)", borderColor: "#e5b7b0" }} onClick={deleteCourse} disabled={saving}>
                                Delete
                            </button>
                            <button className="btn btn-primary btn-sm" onClick={saveCourse} disabled={saving}>
                                {saving ? "Saving..." : "Save & publish"}
                            </button>
                        </div>

                        {/* Course Form */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                            <div className="field">
                                <label>Title</label>
                                <input value={courseData.title || ""} onChange={(e) => setCourseData({ ...courseData, title: e.target.value })} />
                            </div>
                            <div className="field">
                                <label>Slug</label>
                                <input value={courseData.slug || ""} onChange={(e) => setCourseData({ ...courseData, slug: e.target.value })} />
                            </div>
                            <div className="field" style={{ gridColumn: "1/-1" }}>
                                <label>Tagline</label>
                                <input value={courseData.tagline || ""} onChange={(e) => setCourseData({ ...courseData, tagline: e.target.value })} />
                            </div>
                            <div className="field">
                                <label>Topic</label>
                                <select value={courseData.topic || ""} onChange={(e) => setCourseData({ ...courseData, topic: e.target.value })}>
                                    {topics.map((t) => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="field">
                                <label>Level</label>
                                <select value={courseData.level || "Beginner"} onChange={(e) => setCourseData({ ...courseData, level: e.target.value })}>
                                    <option>Beginner</option>
                                    <option>Intermediate</option>
                                    <option>Advanced</option>
                                </select>
                            </div>
                            <div className="field">
                                <label>Length (minutes)</label>
                                <input type="number" value={courseData.lengthMin || 60} onChange={(e) => setCourseData({ ...courseData, lengthMin: parseInt(e.target.value) || 0 })} />
                            </div>
                            <div className="field">
                                <label>Gated</label>
                                <select value={courseData.gated ? "true" : "false"} onChange={(e) => setCourseData({ ...courseData, gated: e.target.value === "true" })}>
                                    <option value="false">No</option>
                                    <option value="true">Yes</option>
                                </select>
                            </div>
                            <div className="field" style={{ gridColumn: "1/-1" }}>
                                <label>Instructor Name</label>
                                <input value={courseData.instructor?.name || ""} onChange={(e) => setCourseData({ ...courseData, instructor: { ...courseData.instructor, name: e.target.value } })} />
                            </div>
                            <div className="field" style={{ gridColumn: "1/-1" }}>
                                <label>Instructor Title</label>
                                <input value={courseData.instructor?.title || ""} onChange={(e) => setCourseData({ ...courseData, instructor: { ...courseData.instructor, title: e.target.value } })} />
                            </div>
                            <div className="field" style={{ gridColumn: "1/-1" }}>
                                <label>Outcomes (one per line)</label>
                                <textarea style={{ minHeight: "80px" }} value={(courseData.outcomes || []).join("\n")} onChange={(e) => setCourseData({ ...courseData, outcomes: e.target.value.split("\n").filter(Boolean) })} />
                            </div>
                        </div>

                        <div style={{ marginTop: "20px", padding: "16px", background: "var(--cream-2)", borderRadius: "12px" }}>
                            <p className="text-muted" style={{ fontSize: ".85rem" }}>
                                ⚠️ Full course editor with modules and lessons available in complete version.
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}