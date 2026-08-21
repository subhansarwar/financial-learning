// app/components/adminPanelComp/manageCourse/courseComp/StepOneInfo.jsx
"use client";

import { useRef, useState } from "react";
import { ImageIcon, UploadCloud } from "lucide-react";
import { CATEGORY_OPTIONS, LANGUAGE_OPTIONS, LEVEL_OPTIONS } from "./dummyCourses";
import Image from "next/image";

const NAME_MAX = 60;
const SUBTITLE_MAX = 80;
const DESC_MAX = 400;

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
    const fileInputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [touched, setTouched] = useState({
        title: false,
        subtitle: false,
        description: false,
        language: false,
        level: false,
        category: false,
        price: false,
    });

    const categoryOptions = categories?.length ? categories : CATEGORY_OPTIONS;

    const set = (patch) => onChange({ ...data, ...patch });

    const handleFile = (file) => {
        if (!file) return;
        set({ coverImageName: file.name });
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    // Validation functions
    const isFieldValid = (field, value) => {
        switch (field) {
            case "title":
                return value.trim() !== "";
            case "subtitle":
                return value.trim() !== "";
            case "description":
                return value.trim() !== "";
            case "language":
                return value !== "";
            case "level":
                return value !== "";
            case "category":
                return value !== "";
            case "price":
                return value >= 0;
            default:
                return true;
        }
    };

    const showError = (field, value) => {
        return touched[field] && !isFieldValid(field, value);
    };

    const getErrorMessage = (field) => {
        const messages = {
            title: "Course name is required",
            subtitle: "Course subtitle is required",
            description: "Course description is required",
            language: "Please select a language",
            level: "Please select a level",
            category: "Please select a category",
            price: "Price cannot be negative",
        };
        return messages[field] || "This field is required";
    };

    return (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr,0.9fr]">
            {/* Left: course information */}
            <div className="space-y-4">
                <Field
                    label={`Course Name (${data.title.length}/${NAME_MAX})`}
                    required
                    error={showError("title", data.title)}
                    errorMessage={getErrorMessage("title")}
                >
                    <input
                        value={data.title}
                        maxLength={NAME_MAX}
                        onChange={(e) => set({ title: e.target.value })}
                        onBlur={() => handleBlur("title")}
                        placeholder="e.g. Microfinance Foundations"
                        className={`${inputClass} ${showError("title", data.title)
                            ? "border-rose-300 focus:border-rose-500 focus:ring-rose-15"
                            : ""
                            }`}
                    />
                </Field>

                <Field
                    label={`Course Subtitle (${data.subtitle.length}/${SUBTITLE_MAX})`}
                    required
                    error={showError("subtitle", data.subtitle)}
                    errorMessage={getErrorMessage("subtitle")}
                >
                    <input
                        value={data.subtitle}
                        maxLength={SUBTITLE_MAX}
                        onChange={(e) => set({ subtitle: e.target.value })}
                        onBlur={() => handleBlur("subtitle")}
                        placeholder="A short one-line description"
                        className={`${inputClass} ${showError("subtitle", data.subtitle)
                            ? "border-rose-300 focus:border-rose-500 focus:ring-rose-15"
                            : ""
                            }`}
                    />
                </Field>

                <Field
                    label={`Course Description (${data.description.length}/${DESC_MAX})`}
                    required
                    error={showError("description", data.description)}
                    errorMessage={getErrorMessage("description")}
                >
                    <textarea
                        rows={4}
                        value={data.description}
                        maxLength={DESC_MAX}
                        onChange={(e) => set({ description: e.target.value })}
                        onBlur={() => handleBlur("description")}
                        placeholder="Enter description"
                        className={`${inputClass} ${showError("description", data.description)
                            ? "border-rose-300 focus:border-rose-500 focus:ring-rose-15"
                            : ""
                            }`}
                    />
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field
                        label="Course Language"
                        required
                        error={showError("language", data.language)}
                        errorMessage={getErrorMessage("language")}
                    >
                        <select
                            value={data.language}
                            onChange={(e) => set({ language: e.target.value })}
                            onBlur={() => handleBlur("language")}
                            className={`${inputClass} ${showError("language", data.language)
                                ? "border-rose-300 focus:border-rose-500 focus:ring-rose-15"
                                : ""
                                }`}
                        >
                            <option value="">Select Language</option>
                            {LANGUAGE_OPTIONS.map((l) => (
                                <option key={l} value={l}>
                                    {l}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field
                        label="Course Level"
                        required
                        error={showError("level", data.level)}
                        errorMessage={getErrorMessage("level")}
                    >
                        <select
                            value={data.level}
                            onChange={(e) => set({ level: e.target.value })}
                            onBlur={() => handleBlur("level")}
                            className={`${inputClass} ${showError("level", data.level)
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
                </div>

                <Field
                    label="Course Category"
                    required
                    error={showError("category", data.category)}
                    errorMessage={getErrorMessage("category")}
                >
                    <select
                        value={data.category}
                        onChange={(e) => set({ category: e.target.value })}
                        onBlur={() => handleBlur("category")}
                        className={`${inputClass} ${showError("category", data.category)
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

                <Field
                    label="Price"
                    required
                    error={showError("price", data.price)}
                    errorMessage={getErrorMessage("price")}
                >
                    <div
                        className={`flex items-center rounded-lg border ${showError("price", data.price)
                            ? "border-rose-300 focus-within:border-rose-500 focus-within:ring-rose-15"
                            : "border-line"
                            } bg-cream-2/50 focus-within:border-[#365B50]/50 focus-within:ring-4 focus-within:ring-[#365B50]/15`}
                    >
                        <span className="pl-3.5 text-sm font-bold text-muted">$</span>
                        <input
                            type="number"
                            min={0}
                            value={data.price}
                            onChange={(e) => set({ price: Number(e.target.value) || 0 })}
                            onBlur={() => handleBlur("price")}
                            className="w-full bg-transparent px-2.5 py-2.5 text-sm text-ink focus:outline-none"
                        />
                    </div>
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
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            handleFile(e.dataTransfer.files?.[0]);
                        }}
                        className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-xl2 border-2 border-dashed border-[#365B50]/40 bg-[#365B50]-soft/30 p-6 text-center transition-colors hover:bg-[#365B50]-soft/50"
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFile(e.target.files?.[0])}
                        />
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="Cover preview"
                                className="mb-3 h-28 w-full rounded-lg object-cover"
                            />
                        ) : (
                            <ImageIcon className="mb-3 h-8 w-8 text-[#365B50]" strokeWidth={1.5} />
                        )}
                        <p className="text-sm font-bold text-brand-deep">
                            <UploadCloud className="mr-1 inline h-4 w-4" strokeWidth={2} />
                            Click to replace <span className="font-medium text-ink-2">or drag and drop</span>
                        </p>
                        <p className="mt-1 text-xs text-muted">SVG, PNG, JPG or (max. 1280 x 720px)</p>
                        {data.coverImageName && (
                            <p className="mt-2 truncate text-xs font-semibold text-ink-2">
                                {data.coverImageName}
                            </p>
                        )}
                    </div>
                </Field>
            </div>
        </div>
    );
}