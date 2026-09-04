// app/components/adminPanelComp/manageCourse/courseComp/StepOneInfo.jsx
"use client";

import { useRef, useState } from "react";
import { ImageIcon, UploadCloud, Plus, X, Award } from "lucide-react";
import { CATEGORY_OPTIONS, LEVEL_OPTIONS } from "./dummyCourses";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { uploadImage } from "../../../../store/slices/common/commonThunks";
import Image from "next/image";

const NAME_MAX = 60;
const SUBTITLE_MAX = 80;
const DESC_MAX = 400;
const BIO_MAX = 400;

function Field({ label, children, required = false, error = false, errorMessage = "" }) {
    return (
        <div>
            <label className="mb-1.5 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-muted">
                {label}
                {required && <span className="text-rose-500">*</span>}
            </label>
            {children}
            {error && errorMessage && (
                <p className="mt-1 text-xs text-rose-500">{errorMessage}</p>
            )}
        </div>
    );
}

const inputClass =
    "w-full rounded-lg border border-line bg-cream-2/50 px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:border-[#365B50]/50 focus:outline-none focus:ring-4 focus:ring-[#365B50]/15";

export default function StepOneInfo({ data, onChange, categories }) {
    console.log("StepOneInfo data:", data);
    const fileInputRef = useRef(null);
    const dispatch = useAppDispatch();
    const [previewUrl, setPreviewUrl] = useState(null);
    const { uploadLoading, uploadProgress, uploadError } = useAppSelector((state) => state.common);
    const [outcomeDraft, setOutcomeDraft] = useState("");
    const [touched, setTouched] = useState({
        title: false,
        tagline: false,
        description: false,
        level: false,
        category: false,
        instructor_name: false,
        instructor_title: false,
    });

    const categoryOptions = categories?.length ? categories : CATEGORY_OPTIONS;
    const outcomes = Array.isArray(data?.outcomes) ? data.outcomes : [];

    const set = (patch) => onChange({ ...data, ...patch });



    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const addOutcome = () => {
        const value = outcomeDraft.trim();
        if (!value) return;
        set({ outcomes: [...outcomes, value] });
        setOutcomeDraft("");
    };

    const removeOutcome = (index) => {
        set({ outcomes: outcomes.filter((_, i) => i !== index) });
    };

    // Validation functions
    const isFieldValid = (field, value) => {
        switch (field) {
            case "title":
                return value?.trim() !== "";
            case "tagline":
                return value?.trim() !== "";
            case "description":
                return value?.trim() !== "";
            case "level":
                return value !== "";
            case "category":
                return value !== "";
            case "instructor_name":
                return value?.trim() !== "";
            case "instructor_title":
                return value?.trim() !== "";
            default:
                return true;
        }
    };

    const showError = (field, value) => {
        return touched[field] && !isFieldValid(field, value);
    };

    const handleImageUpload = async (file) => {
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            return;
        }
        try {
            const result = await dispatch(uploadImage({
                file: file,
                container: "course_material",
                title: data?.title || file.name,
                alt_text: data?.title || file.name,
            })).unwrap();

            if (result?.file_url) {
                set({
                    coverImageName: file.name,
                    thumbnail_url: result.file_url,
                });
                setPreviewUrl(result?.file_url);
            }
        } catch (error) {
        }
    };
    console.log('preview ====>', previewUrl)
    const handleFile = (e) => {
        console.log('click ====>')
        const file = e?.target?.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
        e.target.value = "";
    };
    const getErrorMessage = (field) => {
        const messages = {
            title: "Course name is required",
            tagline: "Course tagline is required",
            description: "Course description is required",
            level: "Please select a level",
            category: "Please select a category",
            instructor_name: "Instructor name is required",
            instructor_title: "Instructor title is required",
        };
        return messages[field] || "This field is required";
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr,0.9fr]">
                {/* Left: course information */}
                <div className="space-y-4">
                    <Field
                        label={`Course Name (${data?.title?.length || 0}/${NAME_MAX})`}
                        required
                        error={showError("title", data?.title)}
                        errorMessage={getErrorMessage("title")}
                    >
                        <input
                            value={data?.title || ""}
                            maxLength={NAME_MAX}
                            onChange={(e) => set({ title: e?.target?.value })}
                            onBlur={() => handleBlur("title")}
                            placeholder="e.g. Microfinance Foundations"
                            className={`${inputClass} ${showError("title", data?.title)
                                ? "border-rose-300 focus:border-rose-500 focus:ring-rose-15"
                                : ""
                                }`}
                        />
                    </Field>

                    <Field
                        label={`Course Tagline (${data?.tagline?.length || 0}/${SUBTITLE_MAX})`}
                        required
                        error={showError("tagline", data?.tagline)}
                        errorMessage={getErrorMessage("tagline")}
                    >
                        <input
                            value={data?.tagline || ""}
                            maxLength={SUBTITLE_MAX}
                            onChange={(e) => set({ tagline: e.target.value })}
                            onBlur={() => handleBlur("tagline")}
                            placeholder="Enter course tagline"
                            className={`${inputClass} ${showError("tagline", data?.tagline)
                                ? "border-rose-300 focus:border-rose-500 focus:ring-rose-15"
                                : ""
                                }`}
                        />
                    </Field>

                    <Field
                        label={`Course Description (${data?.description?.length || 0}/${DESC_MAX})`}
                        required
                        error={showError("description", data?.description)}
                        errorMessage={getErrorMessage("description")}
                    >
                        <textarea
                            rows={4}
                            value={data?.description || ""}
                            maxLength={DESC_MAX}
                            onChange={(e) => set({ description: e?.target?.value })}
                            onBlur={() => handleBlur("description")}
                            placeholder="Enter description"
                            className={`${inputClass} ${showError("description", data?.description)
                                ? "border-rose-300 focus:border-rose-500 focus:ring-rose-15"
                                : ""
                                }`}
                        />
                    </Field>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field
                            label="Course Level"
                            required
                            error={showError("level", data?.level)}
                            errorMessage={getErrorMessage("level")}
                        >
                            <select
                                value={data?.level || ""}
                                onChange={(e) => set({ level: e?.target?.value })}
                                onBlur={() => handleBlur("level")}
                                className={`${inputClass} ${showError("level", data?.level)
                                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-15"
                                    : ""
                                    }`}
                            >
                                <option value="">Select Level</option>
                                {LEVEL_OPTIONS.map((l) => (
                                    <option key={l} value={l}>
                                        {l}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field
                            label="Course Category"
                            required
                            error={showError("category", data?.category)}
                            errorMessage={getErrorMessage("category")}
                        >
                            <select
                                value={data?.category || ""}
                                onChange={(e) => set({ category: e?.target?.value })}
                                onBlur={() => handleBlur("category")}
                                className={`${inputClass} ${showError("category", data?.category)
                                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-15"
                                    : ""
                                    }`}
                            >
                                <option value="">Select Category</option>
                                {categoryOptions.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </Field>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field
                            label="Instructor Name"
                            required
                            error={showError("instructor_name", data?.instructor_name)}
                            errorMessage={getErrorMessage("instructor_name")}
                        >
                            <input
                                value={data?.instructor_name || ""}
                                onChange={(e) => set({ instructor_name: e?.target?.value })}
                                onBlur={() => handleBlur("instructor_name")}
                                placeholder="e.g. John Doe"
                                className={`${inputClass} ${showError("instructor_name", data?.instructor_name)
                                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-15"
                                    : ""
                                    }`}
                            />
                        </Field>
                        <Field
                            label="Instructor Title"
                            required
                            error={showError("instructor_title", data?.instructor_title)}
                            errorMessage={getErrorMessage("instructor_title")}
                        >
                            <input
                                value={data?.instructor_title || ""}
                                onChange={(e) => set({ instructor_title: e?.target?.value })}
                                onBlur={() => handleBlur("instructor_title")}
                                placeholder="e.g. Senior Instructor"
                                className={`${inputClass} ${showError("instructor_title", data?.instructor_title)
                                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-15"
                                    : ""
                                    }`}
                            />
                        </Field>
                    </div>

                    <Field label={`Instructor Bio (${data?.instructor_bio?.length || 0}/${BIO_MAX})`}>
                        <textarea
                            rows={3}
                            value={data?.instructor_bio || ""}
                            maxLength={BIO_MAX}
                            onChange={(e) => set({ instructor_bio: e.target.value })}
                            placeholder="A short bio shown on the course page"
                            className={inputClass}
                        />
                    </Field>
                </div>

                {/* Right: cover image */}
                <div>
                    <Field label="Course Cover">
                        <p className="mb-3 -mt-0.5 text-xs text-muted">
                            Upload your course image here. It must meet our course image quality
                            standards to be accepted.
                        </p>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => e?.preventDefault()}
                            onDrop={(e) => {
                                e?.preventDefault();
                                handleFile(e?.dataTransfer?.files?.[0]);
                            }}
                            className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-xl2 border-2 border-dashed border-[#365B50]/40 bg-[#365B50]-soft/30 p-6 text-center transition-colors hover:bg-[#365B50]-soft/50"
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFile}
                            />
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Cover preview"
                                    className="mb-3 h-28 w-full rounded-lg object-cover"
                                />
                            ) : data?.coverImageName ? (
                                <img
                                    src={data?.coverImageName}
                                    alt={data?.title || "Course cover"}
                                    className="mb-3 h-28 w-full rounded-lg object-cover"
                                />
                            ) : (
                                <>
                                    <ImageIcon className="mb-3 h-8 w-8 text-[#365B50]" strokeWidth={1.5} />
                                    <p className="text-sm font-bold text-[#14301F]">
                                        <UploadCloud className="mr-1 inline h-4 w-4 text-[#365B50]" strokeWidth={2} />
                                        Click to upload <span className="font-medium text-[#14301F]">or drag and drop</span>
                                    </p>
                                    <p className="mt-1 text-xs text-muted">SVG, PNG, JPG (max. 5MB)</p>
                                </>
                            )}
                        </div>
                    </Field>
                </div>
            </div>

            {/* Learning Outcomes — full width */}
            <Field label={`Learning Outcomes (${outcomes.length})`}>
                <p className="mb-2 -mt-1 text-xs text-muted">
                    What will students be able to do after finishing this course?
                </p>
                <div className="flex gap-2">
                    <input
                        value={outcomeDraft}
                        onChange={(e) => setOutcomeDraft(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                addOutcome();
                            }
                        }}
                        placeholder="e.g. Build a simple loan repayment schedule"
                        className={inputClass}
                    />
                    <button
                        type="button"
                        onClick={addOutcome}
                        disabled={!outcomeDraft.trim()}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#47735B] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#3a5f4a] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Plus className="h-4 w-4" strokeWidth={2.5} />
                        Add
                    </button>
                </div>

                {outcomes.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                        {outcomes.map((outcome, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-2 rounded-lg border border-line-soft bg-cream-2/30 p-2.5"
                            >
                                <Award className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={2} />
                                <p className="flex-1 text-sm text-ink-2">{outcome}</p>
                                <button
                                    type="button"
                                    onClick={() => removeOutcome(index)}
                                    className="shrink-0 rounded-full p-1 text-muted hover:bg-rose-50 hover:text-rose-500"
                                >
                                    <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </Field>
        </div>
    );
}