// app/components/adminPanelComp/manageCourse/courseComp/StepTwoCurriculum.jsx
"use client";

import { useState, useRef } from "react";
import { Plus, X, Video, Layers3, Edit2, Trash2, Save, ChevronDown, ChevronRight } from "lucide-react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
    createModule,
    updateModule,
    deleteModule,
    createLesson,
    updateLesson,
    deleteLesson,
} from "../../../../store/admin/adminCourses/adminCoursesThunks";

const inputClass =
    "w-full rounded-lg border border-line bg-cream-2/50 px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:border-brand/50 focus:outline-none focus:ring-4 focus:ring-brand/15";

function Field({ label, children, required = false }) {
    return (
        <div>
            <label className="mb-1.5 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-muted">
                {label}
                {required && <span className="text-rose-500">*</span>}
            </label>
            {children}
        </div>
    );
}

function LessonForm({ lesson, onSave, onCancel, moduleId }) {
    const [formData, setFormData] = useState(lesson || {
        title: "",
        type: "reading",
        duration_min: 0,
        order_index: 0,
        content: "",
        video_url: "",
        quiz_pass_pct: 100,
        quiz_questions: [],
    });

    const handleSubmit = () => {
        if (!formData.title?.trim()) {
            toast.error("Lesson title is required");
            return;
        }
        onSave(formData);
    };

    return (
        <div className="rounded-lg border border-line-soft bg-cream-2/30 p-4 space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Lesson Title" required>
                    <input
                        value={formData.title || ""}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Lesson title"
                        className={inputClass}
                    />
                </Field>
                <Field label="Type" required>
                    <select
                        value={formData.type || "reading"}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className={inputClass}
                    >
                        <option value="reading">Reading</option>
                        <option value="video">Video</option>
                        <option value="quiz">Quiz</option>
                    </select>
                </Field>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Duration (minutes)">
                    <input
                        type="number"
                        min={0}
                        value={formData.duration_min || 0}
                        onChange={(e) => setFormData({ ...formData, duration_min: Number(e.target.value) || 0 })}
                        className={inputClass}
                    />
                </Field>
                <Field label="Order Index">
                    <input
                        type="number"
                        min={0}
                        value={formData.order_index || 0}
                        onChange={(e) => setFormData({ ...formData, order_index: Number(e.target.value) || 0 })}
                        className={inputClass}
                    />
                </Field>
            </div>
            <Field label="Content">
                <textarea
                    rows={3}
                    value={formData.content || ""}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Lesson content"
                    className={inputClass}
                />
            </Field>
            {formData.type === "video" && (
                <Field label="Video URL">
                    <input
                        value={formData.video_url || ""}
                        onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                        placeholder="https://example.com/video.mp4"
                        className={inputClass}
                    />
                </Field>
            )}
            <div className="flex gap-2 pt-2">
                <button
                    onClick={handleSubmit}
                    className="inline-flex items-center gap-2 rounded-full bg-[#47735B] px-4 py-2 text-sm font-bold text-white hover:bg-[#3a5f4a]"
                >
                    <Save className="h-4 w-4" />
                    Save Lesson
                </button>
                <button
                    onClick={onCancel}
                    className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-bold text-ink-2 hover:bg-cream-2"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default function StepTwoCurriculum({ sections = [], onChange, courseId }) {
    const dispatch = useDispatch();
    const [editingModule, setEditingModule] = useState(null);
    const [editingLesson, setEditingLesson] = useState(null);
    const [expandedModules, setExpandedModules] = useState({});
    const [loading, setLoading] = useState(false);

    const safeSections = Array.isArray(sections) ? sections : [];

    const toggleModule = (moduleId) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
    };

    // Module CRUD
    const handleCreateModule = async () => {
        if (!courseId) {
            toast.error("Please save course first");
            return;
        }
        try {
            setLoading(true);
            const result = await dispatch(createModule({
                courseId,
                data: {
                    title: "New Module",
                    order_index: safeSections.length,
                }
            })).unwrap();

            const newModule = {
                id: result.id,
                name: result.title,
                lectures: result.lessons || [],
            };
            onChange([...safeSections, newModule]);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateModule = async (moduleId, title) => {
        try {
            setLoading(true);
            await dispatch(updateModule({
                moduleId,
                data: { title }
            })).unwrap();

            const updatedSections = safeSections.map(s =>
                s.id === moduleId ? { ...s, name: title } : s
            );
            onChange(updatedSections);
            setEditingModule(null);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteModule = async (moduleId) => {
        if (!confirm("Are you sure you want to delete this module?")) return;
        try {
            setLoading(true);
            await dispatch(deleteModule(moduleId)).unwrap();
            onChange(safeSections.filter(s => s.id !== moduleId));
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    // Lesson CRUD
    const handleCreateLesson = async (moduleId, lessonData) => {
        try {
            setLoading(true);
            const result = await dispatch(createLesson({
                moduleId,
                data: lessonData
            })).unwrap();

            const updatedSections = safeSections.map(s =>
                s.id === moduleId ? {
                    ...s,
                    lectures: [...(s.lectures || []), result]
                } : s
            );
            onChange(updatedSections);
            setEditingLesson(null);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateLesson = async (moduleId, lessonId, lessonData) => {
        try {
            setLoading(true);
            await dispatch(updateLesson({
                lessonId,
                data: lessonData
            })).unwrap();

            const updatedSections = safeSections.map(s =>
                s.id === moduleId ? {
                    ...s,
                    lectures: (s.lectures || []).map(l =>
                        l.id === lessonId ? { ...l, ...lessonData } : l
                    )
                } : s
            );
            onChange(updatedSections);
            setEditingLesson(null);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteLesson = async (moduleId, lessonId) => {
        if (!confirm("Are you sure you want to delete this lesson?")) return;
        try {
            setLoading(true);
            await dispatch(deleteLesson(lessonId)).unwrap();

            const updatedSections = safeSections.map(s =>
                s.id === moduleId ? {
                    ...s,
                    lectures: (s.lectures || []).filter(l => l.id !== lessonId)
                } : s
            );
            onChange(updatedSections);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-5">
            {safeSections?.length === 0 ? (
                <div className="rounded-xl2 border border-dashed border-line bg-cream-2/30 p-8 text-center">
                    <Layers3 className="mx-auto h-10 w-10 text-muted" strokeWidth={1.5} />
                    <p className="mt-2 text-sm text-muted">No modules added yet.</p>
                    <p className="text-xs text-muted">Click "Add Module" below to get started.</p>
                </div>
            ) : (
                safeSections?.map((section) => (
                    <div key={section?.id || `section-${Math.random()}`} className="rounded-xl2 border border-line bg-cream-2/30 p-4 sm:p-5">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div className="flex flex-1 items-center gap-2">
                                <button
                                    onClick={() => toggleModule(section?.id)}
                                    className="p-1 hover:bg-cream-2 rounded"
                                >
                                    {expandedModules[section?.id] ? (
                                        <ChevronDown className="h-4 w-4 text-muted" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4 text-muted" />
                                    )}
                                </button>
                                {editingModule === section?.id ? (
                                    <div className="flex-1 flex gap-2">
                                        <input
                                            value={section?.name || ""}
                                            onChange={(e) => {
                                                const updated = safeSections.map(s =>
                                                    s.id === section?.id ? { ...s, name: e.target.value } : s
                                                );
                                                onChange(updated);
                                            }}
                                            className={inputClass}
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => handleUpdateModule(section?.id, section?.name)}
                                            className="px-4 py-2 bg-[#47735B] text-white rounded-full text-sm font-bold"
                                            disabled={loading}
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditingModule(null)}
                                            className="px-4 py-2 border rounded-full text-sm font-bold"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Layers3 className="h-4 w-4 shrink-0 text-brand" strokeWidth={2} />
                                        <span className="font-bold text-ink">{section?.name || "Untitled Module"}</span>
                                        <span className="text-xs text-muted">
                                            ({section?.lectures?.length || 0} lessons)
                                        </span>
                                    </>
                                )}
                            </div>
                            <div className="flex gap-1">
                                {!editingModule && (
                                    <button
                                        onClick={() => setEditingModule(section?.id)}
                                        className="p-2 text-muted hover:text-brand rounded-full hover:bg-cream-2"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDeleteModule(section?.id)}
                                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-full"
                                    disabled={loading}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {expandedModules[section?.id] && (
                            <div className="space-y-4 pl-6">
                                {(section?.lectures || [])?.length === 0 ? (
                                    <div className="rounded-lg border border-dashed border-line-soft bg-cream-2/30 p-4 text-center">
                                        <p className="text-sm text-muted">No lessons in this module.</p>
                                    </div>
                                ) : (
                                    (section?.lectures || [])?.map((lecture) => (
                                        <div key={lecture?.id || `lecture-${Math.random()}`} className="rounded-lg border border-line-soft bg-card p-3">
                                            {editingLesson === lecture?.id ? (
                                                <LessonForm
                                                    lesson={lecture}
                                                    moduleId={section?.id}
                                                    onSave={(data) => handleUpdateLesson(section?.id, lecture?.id, data)}
                                                    onCancel={() => setEditingLesson(null)}
                                                />
                                            ) : (
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Video className="h-4 w-4 text-brand" />
                                                        <div>
                                                            <p className="font-semibold text-ink">{lecture?.title}</p>
                                                            <p className="text-xs text-muted">
                                                                {lecture?.type} • {lecture?.duration_min || 0} min
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={() => setEditingLesson(lecture?.id)}
                                                            className="p-2 text-muted hover:text-brand rounded-full hover:bg-cream-2"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteLesson(section?.id, lecture?.id)}
                                                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-full"
                                                            disabled={loading}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}

                                {editingLesson === null && (
                                    <button
                                        onClick={() => setEditingLesson('new')}
                                        className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-deep hover:underline"
                                    >
                                        <Plus className="h-4 w-4" strokeWidth={2.5} />
                                        Add Lesson
                                    </button>
                                )}

                                {editingLesson === 'new' && (
                                    <LessonForm
                                        moduleId={section?.id}
                                        onSave={(data) => handleCreateLesson(section?.id, data)}
                                        onCancel={() => setEditingLesson(null)}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                ))
            )}

            <button
                onClick={handleCreateModule}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-deep hover:underline"
                disabled={loading}
            >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                Add Module
            </button>
        </div>
    );
}