// app/components/adminPanelComp/manageCourse/courseComp/StepTwoCurriculum.jsx
"use client";

import { useRef } from "react";
import { Plus, X, Video, Layers3 } from "lucide-react";

const inputClass =
    "w-full rounded-lg border border-line bg-cream-2/50 px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:border-brand/50 focus:outline-none focus:ring-4 focus:ring-brand/15";

function LectureVideoDrop({ lecture, onFile }) {
    const inputRef = useRef(null);
    return (
        <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
                e.preventDefault();
                onFile(e.dataTransfer.files?.[0]);
            }}
            className="flex min-h-[110px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-brand/40 bg-brand-soft/30 p-4 text-center transition-colors hover:bg-brand-soft/50"
        >
            <input
                ref={inputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0])}
            />
            <Video className="mb-2 h-6 w-6 text-brand" strokeWidth={1.5} />
            <p className="text-xs font-bold text-brand-deep">
                Click to replace <span className="font-medium text-ink-2">or drag and drop</span>
            </p>
            <p className="mt-1 text-[11px] text-muted">MP4, MOV (max. 500MB)</p>
            {lecture.videoName && (
                <p className="mt-1.5 truncate text-[11px] font-semibold text-ink-2">{lecture.videoName}</p>
            )}
        </div>
    );
}

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

export default function StepTwoCurriculum({ sections, onChange }) {
    const updateSection = (sectionId, patch) => {
        onChange(sections.map((s) => (s.id === sectionId ? { ...s, ...patch } : s)));
    };

    const updateLecture = (sectionId, lectureId, patch) => {
        onChange(
            sections.map((s) =>
                s.id !== sectionId
                    ? s
                    : {
                        ...s,
                        lectures: s.lectures.map((l) =>
                            l.id === lectureId ? { ...l, ...patch } : l
                        ),
                    }
            )
        );
    };

    const addLecture = (sectionId) => {
        updateSection(sectionId, {
            lectures: [
                ...sections.find((s) => s.id === sectionId).lectures,
                { id: `lec-${Date.now()}`, name: "", videoName: "" },
            ],
        });
    };

    const removeLecture = (sectionId, lectureId) => {
        const section = sections.find((s) => s.id === sectionId);
        if (section.lectures.length <= 1) return;
        updateSection(sectionId, {
            lectures: section.lectures.filter((l) => l.id !== lectureId),
        });
    };

    const addSection = () => {
        onChange([
            ...sections,
            {
                id: `cur-${Date.now()}`,
                name: "",
                lectures: [{ id: `lec-${Date.now()}`, name: "", videoName: "" }],
            },
        ]);
    };

    const removeSection = (sectionId) => {
        if (sections.length <= 1) return;
        onChange(sections.filter((s) => s.id !== sectionId));
    };

    // Check if all sections have names
    const hasEmptySectionName = sections.some((s) => !s.name.trim());

    // Check if any section has at least one valid lecture name
    const hasValidLecture = sections.some((section) =>
        section.lectures.some((l) => l.name.trim() !== "")
    );

    return (
        <div className="space-y-5">
            {sections.map((section) => (
                <div key={section.id} className="rounded-xl2 border border-line bg-cream-2/30 p-4 sm:p-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <div className="flex flex-1 items-center gap-2">
                            <Layers3 className="h-4 w-4 shrink-0 text-brand" strokeWidth={2} />
                            <div className="flex-1">
                                <Field label="Curriculum Name" required>
                                    <input
                                        value={section.name}
                                        onChange={(e) => updateSection(section.id, { name: e.target.value })}
                                        placeholder="e.g. Module 1: Introduction"
                                        className={`${inputClass} ${!section.name.trim() ? "border-rose-300 focus:border-rose-500 focus:ring-rose-15" : ""}`}
                                    />
                                    {!section.name.trim() && (
                                        <p className="mt-1 text-xs text-rose-500">Section name is required</p>
                                    )}
                                </Field>
                            </div>
                        </div>
                        {sections.length > 1 && (
                            <button
                                onClick={() => removeSection(section.id)}
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-rose-500 transition-colors hover:bg-rose-50"
                                aria-label="Remove section"
                            >
                                <X className="h-4 w-4" strokeWidth={2} />
                            </button>
                        )}
                    </div>

                    <div className="space-y-4">
                        {section.lectures.map((lecture) => (
                            <div
                                key={lecture.id}
                                className="grid grid-cols-1 gap-3 rounded-lg border border-line-soft bg-card p-3 sm:grid-cols-[1fr,1fr] sm:p-4"
                            >
                                <div>
                                    <Field label="Lecture Name" required>
                                        <input
                                            value={lecture.name}
                                            onChange={(e) =>
                                                updateLecture(section.id, lecture.id, { name: e.target.value })
                                            }
                                            placeholder="e.g. What is microfinance?"
                                            className={`${inputClass} ${!lecture.name.trim() ? "border-rose-300 focus:border-rose-500 focus:ring-rose-15" : ""}`}
                                        />
                                        {!lecture.name.trim() && (
                                            <p className="mt-1 text-xs text-rose-500">Lecture name is required</p>
                                        )}
                                    </Field>
                                    {section.lectures.length > 1 && (
                                        <button
                                            onClick={() => removeLecture(section.id, lecture.id)}
                                            className="mt-2 text-xs font-bold text-rose-500 hover:underline"
                                        >
                                            Remove lecture
                                        </button>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted">
                                        Lecture Video
                                    </label>
                                    <LectureVideoDrop
                                        lecture={lecture}
                                        onFile={(file) =>
                                            file &&
                                            updateLecture(section.id, lecture.id, { videoName: file.name })
                                        }
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => addLecture(section.id)}
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-brand-deep hover:underline"
                    >
                        <Plus className="h-4 w-4" strokeWidth={2.5} />
                        Add More Lecture
                    </button>
                </div>
            ))}

            <button
                onClick={addSection}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-deep hover:underline"
            >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                Add Curriculum Section
            </button>
        </div>
    );
}