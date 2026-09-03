// app/components/adminPanelComp/manageCourse/courseComp/StepTwoCurriculum.jsx
"use client";

import { useState, useRef } from "react";
import { Plus, X, Video, Layers3, Edit2, Trash2, Save, ChevronDown, ChevronRight, FileText, HelpCircle, PlayCircle } from "lucide-react";
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

// Theme colors: text-[#14301F], bg-[#72BB83]
const inputClass =
    "w-full rounded-lg border border-line bg-cream-2/50 px-3.5 py-2.5 text-sm text-[#14301F] placeholder:text-muted focus:border-[#72BB83]/50 focus:outline-none focus:ring-4 focus:ring-[#72BB83]/20 transition-all duration-200";

const selectClass =
    "w-full rounded-lg border border-line bg-cream-2/50 px-3.5 py-2.5 text-sm text-[#14301F] placeholder:text-muted focus:border-[#72BB83]/50 focus:outline-none focus:ring-4 focus:ring-[#72BB83]/20 appearance-none transition-all duration-200";

const textareaClass =
    "w-full rounded-lg border border-line bg-cream-2/50 px-3.5 py-2.5 text-sm text-[#14301F] placeholder:text-muted focus:border-[#72BB83]/50 focus:outline-none focus:ring-4 focus:ring-[#72BB83]/20 resize-y transition-all duration-200";

function Field({ label, children, required = false }) {
    return (
        <div className="space-y-1.5">
            <label className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-muted">
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
        if (!formData.content?.trim()) {
            toast.error("Lesson content is required");
            return;
        }
        if (formData.type === "reading") {
            formData.video_url = "";
        }
        onSave(formData);
    };

    const addQuestion = () => {
        const questions = [...(formData.quiz_questions || [])];
        questions.push({
            q: "",
            choices: ["", "", "", ""],
            answer: 0,
            explain: ""
        });
        setFormData({ ...formData, quiz_questions: questions });
    };

    const updateQuestion = (index, field, value) => {
        const questions = [...(formData.quiz_questions || [])];
        questions[index] = { ...questions[index], [field]: value };
        setFormData({ ...formData, quiz_questions: questions });
    };

    const updateChoice = (qIndex, cIndex, value) => {
        const questions = [...(formData.quiz_questions || [])];
        const choices = [...(questions[qIndex].choices || [])];
        choices[cIndex] = value;
        questions[qIndex] = { ...questions[qIndex], choices };
        setFormData({ ...formData, quiz_questions: questions });
    };

    const removeQuestion = (index) => {
        const questions = (formData.quiz_questions || []).filter((_, i) => i !== index);
        setFormData({ ...formData, quiz_questions: questions });
    };

    return (
        <div className="rounded-xl2 border border-line bg-card p-4 sm:p-5 space-y-4 shadow-sm">
            {/* Row 1: Lesson Title + Type */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Lesson Title" required>
                    <input
                        value={formData.title || ""}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter lesson title"
                        className={inputClass}
                    />
                </Field>
                <Field label="Type" required>
                    <div className="relative">
                        <select
                            value={formData.type || "reading"}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className={selectClass}
                        >
                            <option value="reading">Reading</option>
                            <option value="quiz">Quiz</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    </div>
                </Field>
            </div>

            {/* Row 2: Duration + Order Index */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Duration (minutes)">
                    <input
                        type="number"
                        min={0}
                        value={formData.duration_min || 0}
                        onChange={(e) => setFormData({ ...formData, duration_min: Number(e.target.value) || 0 })}
                        placeholder="0"
                        className={inputClass}
                    />
                </Field>
                <Field label="Order Index">
                    <input
                        type="number"
                        min={0}
                        value={formData.order_index || 0}
                        onChange={(e) => setFormData({ ...formData, order_index: Number(e.target.value) || 0 })}
                        placeholder="0"
                        className={inputClass}
                    />
                </Field>
            </div>

            {/* Content */}
            <Field label="Content" required>
                <textarea
                    rows={4}
                    value={formData.content || ""}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder={
                        formData.type === "reading"
                            ? "Enter lesson content here..."
                            : "Enter quiz instructions or description..."
                    }
                    className={textareaClass}
                />
                {!formData.content?.trim() && (
                    <p className="mt-1 text-xs text-rose-500">Content is required</p>
                )}
            </Field>

            {/* Video URL - Optional */}
            <Field label="Video URL (Optional)">
                <input
                    value={formData.video_url || ""}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=xyz"
                    className={inputClass}
                />
                <p className="mt-1 text-xs text-muted">Add a video URL to include a video with this lesson.</p>
            </Field>

            {/* ============ QUIZ SECTION ============ */}
            {formData.type === "quiz" && (
                <div className="border-t border-line-soft pt-4 mt-2 space-y-4">
                    <div className="flex items-center gap-4">
                        <Field label="Quiz Pass Percentage">
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={formData.quiz_pass_pct || 100}
                                    onChange={(e) => setFormData({ ...formData, quiz_pass_pct: Number(e.target.value) || 100 })}
                                    className={`${inputClass} max-w-[120px]`}
                                />
                                <span className="text-sm font-bold text-[#14301F]">%</span>
                            </div>
                        </Field>
                    </div>

                    <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <p className="text-xs font-bold uppercase tracking-wider text-muted">
                                Quiz Questions ({formData.quiz_questions?.length || 0})
                            </p>
                            <button
                                onClick={addQuestion}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#72BB83] hover:text-[#5a9c6a] transition-all"
                                type="button"
                            >
                                <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                                Add Question
                            </button>
                        </div>

                        {(formData.quiz_questions || []).length === 0 ? (
                            <div className="rounded-lg border border-dashed border-line-soft bg-cream-2/30 p-6 text-center">
                                <HelpCircle className="mx-auto h-8 w-8 text-muted/40" strokeWidth={1.5} />
                                <p className="mt-1 text-sm text-muted">No questions added yet</p>
                                <p className="text-xs text-muted">Click "Add Question" to get started</p>
                            </div>
                        ) : (
                            (formData.quiz_questions || []).map((q, qIndex) => (
                                <div key={qIndex} className="rounded-lg border border-line-soft bg-cream-2/30 p-3 sm:p-4 space-y-3 hover:border-[#72BB83]/30 transition-all">
                                    {/* Question */}
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
                                        <span className="text-sm font-bold text-[#72BB83] min-w-[28px]">Q{qIndex + 1}.</span>
                                        <input
                                            value={q.q || ""}
                                            onChange={(e) => updateQuestion(qIndex, "q", e.target.value)}
                                            placeholder={`Enter question ${qIndex + 1}`}
                                            className={`${inputClass} flex-1`}
                                        />
                                        <button
                                            onClick={() => removeQuestion(qIndex)}
                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-600 self-end sm:self-auto"
                                            type="button"
                                        >
                                            <X className="h-4 w-4" strokeWidth={2} />
                                        </button>
                                    </div>

                                    {/* Choices */}
                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 pl-0 sm:pl-9">
                                        {(q.choices || ["", "", "", ""]).map((choice, cIndex) => (
                                            <div key={cIndex} className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-muted w-5 shrink-0">
                                                    {String.fromCharCode(65 + cIndex)}.
                                                </span>
                                                <input
                                                    value={choice || ""}
                                                    onChange={(e) => updateChoice(qIndex, cIndex, e.target.value)}
                                                    placeholder={`Choice ${cIndex + 1}`}
                                                    className={inputClass}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Answer + Explanation */}
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pl-0 sm:pl-9 pt-1">
                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted">Correct Answer</label>
                                            <div className="relative mt-1">
                                                <select
                                                    value={q.answer || 0}
                                                    onChange={(e) => updateQuestion(qIndex, "answer", Number(e.target.value))}
                                                    className={selectClass}
                                                >
                                                    <option value={0}>A</option>
                                                    <option value={1}>B</option>
                                                    <option value={2}>C</option>
                                                    <option value={3}>D</option>
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted">Explanation</label>
                                            <input
                                                value={q.explain || ""}
                                                onChange={(e) => updateQuestion(qIndex, "explain", e.target.value)}
                                                placeholder="Why this answer is correct"
                                                className={`${inputClass} mt-1`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 pt-3 border-t border-line-soft">
                <button
                    onClick={handleSubmit}
                    className="inline-flex items-center gap-2 rounded-full bg-[#72BB83] px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#5a9c6a]"
                >
                    <Save className="h-4 w-4" strokeWidth={2.5} />
                    Save Lesson
                </button>
                <button
                    onClick={onCancel}
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-5 py-2.5 text-sm font-bold text-[#14301F] transition-all hover:border-[#72BB83]/40 hover:bg-[#72BB83]/10 hover:text-[#14301F]"
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
                order_index: result.order_index,
            };
            onChange([...safeSections, newModule]);
            toast.success("Module created successfully!");
        } catch (error) {
            toast.error(error?.message || "Failed to create module");
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
            toast.success("Module updated successfully!");
        } catch (error) {
            toast.error(error?.message || "Failed to update module");
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
            toast.success("Module deleted successfully!");
        } catch (error) {
            toast.error(error?.message || "Failed to delete module");
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
                    lectures: [...(s.lectures || []), {
                        id: result.id,
                        title: result.title,
                        type: result.type,
                        duration_min: result.duration_min,
                        order_index: result.order_index,
                        content: result.content,
                        video_url: result.video_url,
                        quiz_pass_pct: result.quiz_pass_pct,
                        quiz_questions: result.quiz_questions || [],
                    }]
                } : s
            );
            onChange(updatedSections);
            setEditingLesson(null);
            toast.success("Lesson created successfully!");
        } catch (error) {
            toast.error(error?.message || "Failed to create lesson");
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
            toast.success("Lesson updated successfully!");
        } catch (error) {
            toast.error(error?.message || "Failed to update lesson");
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
            toast.success("Lesson deleted successfully!");
        } catch (error) {
            toast.error(error?.message || "Failed to delete lesson");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-5">
            {safeSections?.length === 0 ? (
                <div className="rounded-xl2 border-2 border-dashed border-line bg-cream-2/30 p-8 sm:p-12 text-center transition-all hover:border-[#72BB83]/30">
                    <Layers3 className="mx-auto h-12 w-12 text-muted/40" strokeWidth={1.5} />
                    <p className="mt-3 text-base font-semibold text-[#14301F]">No modules added yet</p>
                    <p className="text-sm text-muted">Click "Add Module" below to get started</p>
                </div>
            ) : (
                safeSections?.map((section) => (
                    <div key={section?.id} className="rounded-xl2 border border-line bg-card p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <button
                                    onClick={() => toggleModule(section?.id)}
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-all hover:bg-[#72BB83]/10 hover:text-[#72BB83]"
                                >
                                    {expandedModules[section?.id] ? (
                                        <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
                                    ) : (
                                        <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
                                    )}
                                </button>
                                {editingModule === section?.id ? (
                                    <div className="flex flex-1 flex-wrap gap-2">
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
                                            placeholder="Enter module name"
                                        />
                                        <button
                                            onClick={() => handleUpdateModule(section?.id, section?.name)}
                                            className="inline-flex items-center gap-1 rounded-full bg-[#72BB83] px-4 py-2 text-sm font-bold text-white transition-all hover:bg-[#5a9c6a]"
                                            disabled={loading}
                                        >
                                            <Save className="h-3.5 w-3.5" strokeWidth={2.5} />
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditingModule(null)}
                                            className="inline-flex items-center gap-1 rounded-full border border-line px-4 py-2 text-sm font-bold text-[#14301F] transition-all hover:bg-[#72BB83]/10"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Layers3 className="h-5 w-5 shrink-0 text-[#72BB83]" strokeWidth={2} />
                                        <span className="font-bold text-[#14301F] truncate">{section?.name || "Untitled Module"}</span>
                                        <span className="text-xs text-muted shrink-0 bg-[#72BB83]/10 px-2.5 py-0.5 rounded-full">
                                            {section?.lectures?.length || 0} lessons
                                        </span>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                {!editingModule && (
                                    <button
                                        onClick={() => setEditingModule(section?.id)}
                                        className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-all hover:bg-[#72BB83]/10 hover:text-[#72BB83]"
                                        title="Edit module"
                                    >
                                        <Edit2 className="h-4 w-4" strokeWidth={2} />
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDeleteModule(section?.id)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-rose-400 transition-all hover:bg-rose-50 hover:text-rose-600"
                                    disabled={loading}
                                    title="Delete module"
                                >
                                    <Trash2 className="h-4 w-4" strokeWidth={2} />
                                </button>
                            </div>
                        </div>

                        {expandedModules[section?.id] && (
                            <div className="space-y-4 pl-2 sm:pl-9">
                                {(section?.lectures || [])?.length === 0 ? (
                                    <div className="rounded-lg border border-dashed border-line-soft bg-cream-2/30 p-6 text-center">
                                        <FileText className="mx-auto h-8 w-8 text-muted/40" strokeWidth={1.5} />
                                        <p className="mt-1 text-sm text-muted">No lessons in this module</p>
                                        <p className="text-xs text-muted">Click "Add Lesson" below to get started</p>
                                    </div>
                                ) : (
                                    (section?.lectures || [])?.map((lecture) => (
                                        <div key={lecture?.id} className="rounded-lg border border-line-soft bg-cream-2/20 p-3 sm:p-4 hover:border-[#72BB83]/30 transition-all">
                                            {editingLesson === lecture?.id ? (
                                                <LessonForm
                                                    lesson={lecture}
                                                    moduleId={section?.id}
                                                    onSave={(data) => handleUpdateLesson(section?.id, lecture?.id, data)}
                                                    onCancel={() => setEditingLesson(null)}
                                                />
                                            ) : (
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                    <div className="flex items-start gap-3 min-w-0">
                                                        {lecture?.type === "reading" ? (
                                                            <FileText className="h-5 w-5 shrink-0 text-[#72BB83] mt-0.5" strokeWidth={2} />
                                                        ) : lecture?.type === "quiz" ? (
                                                            <HelpCircle className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" strokeWidth={2} />
                                                        ) : (
                                                            <Video className="h-5 w-5 shrink-0 text-[#72BB83] mt-0.5" strokeWidth={2} />
                                                        )}
                                                        <div className="min-w-0">
                                                            <p className="font-semibold text-[#14301F] truncate">{lecture?.title || "Untitled Lesson"}</p>
                                                            <div className="flex flex-wrap items-center gap-2 mt-0.5">
                                                                <span className="text-xs font-medium text-muted bg-cream-2/50 px-2 py-0.5 rounded-full capitalize">
                                                                    {lecture?.type || "reading"}
                                                                </span>
                                                                <span className="text-xs text-muted">•</span>
                                                                <span className="text-xs text-muted">{lecture?.duration_min || 0} min</span>
                                                                {lecture?.order_index !== undefined && (
                                                                    <>
                                                                        <span className="text-xs text-muted">•</span>
                                                                        <span className="text-xs text-muted">Order: {lecture?.order_index}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 shrink-0">
                                                        <button
                                                            onClick={() => setEditingLesson(lecture?.id)}
                                                            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-all hover:bg-[#72BB83]/10 hover:text-[#72BB83]"
                                                            title="Edit lesson"
                                                        >
                                                            <Edit2 className="h-4 w-4" strokeWidth={2} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteLesson(section?.id, lecture?.id)}
                                                            className="flex h-8 w-8 items-center justify-center rounded-full text-rose-400 transition-all hover:bg-rose-50 hover:text-rose-600"
                                                            disabled={loading}
                                                            title="Delete lesson"
                                                        >
                                                            <Trash2 className="h-4 w-4" strokeWidth={2} />
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
                                        className="inline-flex items-center gap-1.5 text-sm font-bold text-[#72BB83] transition-all hover:text-[#5a9c6a]"
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
                className="inline-flex items-center gap-2 text-sm font-bold text-[#72BB83] transition-all hover:text-[#5a9c6a]"
                disabled={loading}
            >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                Add Module
            </button>
        </div>
    );
}