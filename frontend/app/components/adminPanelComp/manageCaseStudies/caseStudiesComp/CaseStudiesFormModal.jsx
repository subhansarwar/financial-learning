// app/components/adminPanelComp/manageCaseStudies/caseStudiesComp/CaseStudiesFormModal.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { X, Save, Plus, Trash2, ImageIcon, Send, Upload, X as XIcon, Loader2, Star } from "lucide-react";
import { emptyCaseDraft } from "./dummyCaseStudies";
import Image from "next/image";
import { deleteImage, uploadImage } from "../../../../store/slices/common/commonThunks";
import { useAppDispatch } from "../../../../store/hooks";

const inputClass =
    "w-full rounded-lg border border-line bg-cream-2/50 px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:border-[#365B50]/50 focus:outline-none focus:ring-4 focus:ring-[#365B50]/15";

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

export default function CaseStudiesFormModal({ isOpen, mode, initialData, onClose, onSave }) {
    const [data, setData] = useState(emptyCaseDraft());
    const dispatch = useAppDispatch();
    const [touched, setTouched] = useState({
        title: false,
        slug: false,
        content: false,
        summary: false,
    });
    const [images, setImages] = useState([]);
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [imagePreviews, setImagePreviews] = useState([]);
    const fileInputRef = useRef(null);
    const dropRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        if (mode === "edit" && initialData) {
            const contentArray = Array.isArray(initialData.content)
                ? initialData.content
                : initialData.content
                    ? [{ heading: "Content", text: initialData.content }]
                    : [{ heading: "", text: "" }];

            setData({
                ...initialData,
                content: contentArray,
                status: initialData.status || "Draft",
                summary: initialData.summary || "",
                updatedAt: initialData.updatedAt || "",
                publishedAt: initialData.publishedAt || "",
            });

            if (initialData?.thumbnail_url) {
                setImages([{ id: "existing", url: initialData.thumbnail_url, uploading: false }]);
                setThumbnailUrl(initialData.thumbnail_url);
            } else {
                setImages([]);
                setThumbnailUrl("");
            }
        } else {
            const draft = emptyCaseDraft();
            setData({
                ...draft,
                content: Array.isArray(draft.content) ? draft.content : [{ heading: "", text: "" }],
                status: draft.status || "Draft",
                updatedAt: draft.updatedAt || "",
                publishedAt: draft.publishedAt || "",
            });
            setImages([]);
            setThumbnailUrl("");
        }

        setTouched({
            title: false,
            slug: false,
            content: false,
            summary: false,
        });
    }, [isOpen, mode, initialData]);

    if (!isOpen) return null;

    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const isFieldValid = (field, value) => {
        switch (field) {
            case "title":
                return value.trim() !== "";
            case "slug":
                return value.trim() !== "" && /^[a-z0-9-]+$/.test(value);
            case "summary":
                return value.trim() !== "";
            case "content":
                return data.content.some((s) => s.heading.trim() !== "" && s.text.trim() !== "");
            default:
                return true;
        }
    };

    const showError = (field, value) => {
        return touched[field] && !isFieldValid(field, value);
    };

    const isFormValid = () => {
        return (
            data?.title?.trim() !== "" &&
            data?.slug?.trim() !== "" &&
            /^[a-z0-9-]+$/.test(data?.slug) &&
            data?.summary?.trim() !== "" &&
            data?.content?.some((s) => s?.heading?.trim() !== "" && s?.text?.trim() !== "")
        );
    };

    const handleSave = () => {
        if (!isFormValid()) {
            toast.error("Please fill in all required fields");
            return;
        }
        const saveData = {
            ...data,
            thumbnail_url: thumbnailUrl || images.find((i) => i.url)?.url || data.thumbnail_url || "",
            status: "Published",
            updatedAt: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
            }),
            publishedAt: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
            }),
        };
        onSave(saveData);
    };

    const addContentSection = () => {
        setData({
            ...data,
            content: [...data.content, { heading: "", text: "" }],
        });
    };

    const removeContentSection = (index) => {
        if (data.content.length <= 1) {
            toast.error("At least one content section is required");
            return;
        }
        setData({
            ...data,
            content: data.content.filter((_, i) => i !== index),
        });
    };

    const updateContentSection = (index, field, value) => {
        const updated = [...data.content];
        updated[index] = { ...updated[index], [field]: value };
        setData({ ...data, content: updated });
        setTouched((prev) => ({ ...prev, content: true }));
    };

    const handleImageUpload = (files) => {
        const fileArray = Array.from(files);
        fileArray.forEach((file) => {
            if (!file.type.startsWith("image/")) {
                toast.error("Please upload image files only");
                return;
            }

            const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;

            // Optimistic placeholder — uploading spinner ke sath
            setImages((prev) => [...prev, { id: tempId, url: null, uploading: true }]);

            dispatch(uploadImage({ file, container: "case_studies", title: data?.title || "", alt_text: data?.title || "" }))
                .unwrap()
                .then((res) => {
                    setImages((prev) =>
                        prev.map((img) =>
                            img.id === tempId
                                ? { id: res.id || res.image_id || tempId, url: res.file_url, uploading: false }
                                : img
                        )
                    );
                    // Agar abhi tak koi thumbnail select nahi hui, pehli successful upload ko thumbnail bana do
                    setThumbnailUrl((prev) => prev || res.file_url);
                })
                .catch(() => {
                    // Fail hone par placeholder hata do
                    setImages((prev) => prev.filter((img) => img.id !== tempId));
                });
        });
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleImageUpload(e.target.files);
            e.target.value = "";
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleImageUpload(e.dataTransfer.files);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const removeImage = (img) => {
        setImages((prev) => prev.filter((i) => i.id !== img.id));

        if (thumbnailUrl === img.url) {
            setThumbnailUrl("");
        }

        // Sirf real uploaded image (jiska server id hai, "existing" nahi) delete API call karo
        if (img.url && img.id !== "existing" && !img.uploading) {
            dispatch(deleteImage(img.id)).catch(() => {
            });
        }
    };
    const setAsThumbnail = (img) => {
        if (img.uploading || !img.url) return;
        setThumbnailUrl(img.url);
    };
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            {/* Modal Size Increased - max-w-5xl instead of max-w-4xl */}
            <div
                className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-xl2 border border-line bg-card shadow-card-lg animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line-soft bg-card p-5 sm:p-6">
                    <div>
                        <h3 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                            {mode === "edit" ? "Edit Case Study" : "Create New Case Study"}
                        </h3>
                        <p className="mt-1 text-sm text-muted">
                            {mode === "edit" ? "Update the case study details." : "Enter the case study details below."}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-cream-2 hover:text-ink"
                    >
                        <X className="h-4 w-4" strokeWidth={2} />
                    </button>
                </div>

                {/* Body - More padding for larger modal */}
                <div className="p-6 sm:p-8">
                    <div className="space-y-5">
                        {/* Title & Slug - Full width now */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <Field label="Title" required>
                                <input
                                    value={data.title}
                                    onChange={(e) => setData({ ...data, title: e.target.value })}
                                    onBlur={() => handleBlur("title")}
                                    placeholder="e.g. Grameen Bank: Microfinance Revolution"
                                    className={`${inputClass} ${showError("title", data.title) ? "border-rose-300 focus:border-rose-500 focus:ring-rose-15" : ""}`}
                                />
                                {showError("title", data.title) && (
                                    <p className="mt-1 text-xs text-rose-500">Title is required</p>
                                )}
                            </Field>
                            <Field label="Slug" required>
                                <input
                                    value={data.slug}
                                    onChange={(e) => setData({ ...data, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-") })}
                                    onBlur={() => handleBlur("slug")}
                                    placeholder="e.g. grameen-bank-microfinance-revolution"
                                    className={`${inputClass} ${showError("slug", data.slug) ? "border-rose-300 focus:border-rose-500 focus:ring-rose-15" : ""}`}
                                />
                                {showError("slug", data.slug) && (
                                    <p className="mt-1 text-xs text-rose-500">Slug is required (lowercase, hyphens only)</p>
                                )}
                            </Field>
                            {/* Summary */}
                            <Field label="Summary" required>
                                <textarea
                                    rows={2}
                                    value={data.summary || ""}
                                    onChange={(e) => setData({ ...data, summary: e.target.value })}
                                    onBlur={() => handleBlur("summary")}
                                    placeholder="A brief summary of the case study"
                                    className={`${inputClass} ${showError("summary", data.summary) ? "border-rose-300 focus:border-rose-500 focus:ring-rose-15" : ""}`}
                                />
                                {showError("summary", data.summary) && (
                                    <p className="mt-1 text-xs text-rose-500">Summary is required</p>
                                )}
                            </Field>
                        </div>
                        {/* Industry, Tags, Source */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                            <Field label="Industry">
                                <input
                                    value={data.industry}
                                    onChange={(e) => setData({ ...data, industry: e.target.value })}
                                    placeholder="e.g. Microfinance"
                                    className={inputClass}
                                />
                            </Field>
                            <Field label="Tags (comma separated)">
                                <input
                                    value={Array.isArray(data.tags) ? data.tags.join(", ") : ""}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                                        })
                                    }
                                    placeholder="e.g. finance, growth, microloans"
                                    className={inputClass}
                                />
                            </Field>
                            <Field label="Source">
                                <input
                                    value={data.source}
                                    onChange={(e) => setData({ ...data, source: e.target.value })}
                                    placeholder="e.g. Company blog, Interview"
                                    className={inputClass}
                                />
                            </Field>
                        </div>

                        {/* Date, Location, Company Name */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                            <Field label="Date">
                                <input
                                    type="date"
                                    value={data.date}
                                    onChange={(e) => setData({ ...data, date: e.target.value })}
                                    className={inputClass}
                                />
                            </Field>
                            <Field label="Location">
                                <input
                                    value={data.location}
                                    onChange={(e) => setData({ ...data, location: e.target.value })}
                                    placeholder="e.g. Dhaka, Bangladesh"
                                    className={inputClass}
                                />
                            </Field>
                            <Field label="Company Name">
                                <input
                                    value={data.company_name}
                                    onChange={(e) => setData({ ...data, company_name: e.target.value })}
                                    placeholder="e.g. Grameen Bank"
                                    className={inputClass}
                                />
                            </Field>
                        </div>

                        {/* Key Results */}
                        <Field label="Key Results (comma separated)">
                            <input
                                value={Array.isArray(data.key_results) ? data.key_results.join(", ") : ""}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        key_results: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                                    })
                                }
                                placeholder="e.g. 40% revenue growth, 10k new users"
                                className={inputClass}
                            />
                        </Field>

                        {/* Content Sections */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted">
                                    Content Sections <span className="text-rose-500">*</span>
                                </label>
                                <button
                                    onClick={addContentSection}
                                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-deep hover:underline"
                                >
                                    <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                                    Add Section
                                </button>
                            </div>
                            {data?.content?.map((section, index) => (
                                <div key={index} className="mb-3 rounded-lg border border-line-soft bg-cream-2/30 p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 space-y-2">
                                            <input
                                                value={section.heading}
                                                onChange={(e) => updateContentSection(index, "heading", e.target.value)}
                                                placeholder="Section Heading"
                                                className={`${inputClass} ${showError("content", data.content) ? "border-rose-300 focus:border-rose-500 focus:ring-rose-15" : ""}`}
                                            />
                                            <textarea
                                                rows={2}
                                                value={section.text}
                                                onChange={(e) => updateContentSection(index, "text", e.target.value)}
                                                placeholder="Section content..."
                                                className={`${inputClass} ${showError("content", data.content) ? "border-rose-300 focus:border-rose-500 focus:ring-rose-15" : ""}`}
                                            />
                                        </div>
                                        {data.content.length > 1 && (
                                            <button
                                                onClick={() => removeContentSection(index)}
                                                className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-rose-500 transition-colors hover:bg-rose-50"
                                            >
                                                <Trash2 className="h-4 w-4" strokeWidth={2} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {showError("content", data.content) && (
                                <p className="mt-1 text-xs text-rose-500">At least one content section is required</p>
                            )}
                        </div>

                        {/* Images - Larger drop zone */}
                        <div>
                            <label className="mb-1.5 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-muted">
                                Images
                            </label>

                            <div
                                ref={dropRef}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                className="relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl2 border-2 border-dashed border-[#365B50]/40 bg-[#365B50]-soft/20 p-8 text-center transition-colors hover:bg-[#365B50]-soft/30"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={handleFileSelect}
                                />
                                <Upload className="mb-3 h-12 w-12 text-[#365B50]/60" strokeWidth={1.5} />
                                <p className="text-base font-bold text-[#365B50]-deep">
                                    Drag & drop images here
                                </p>
                                <p className="mt-1 text-sm text-muted">
                                    or <span className="font-bold text-[#72BB83]">browse</span> from your computer
                                </p>
                                <p className="mt-2 text-xs text-muted">
                                    Supports: JPG, PNG, WEBP, SVG
                                </p>
                            </div>

                            {images.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-3">
                                    {images.map((img) => (
                                        <div
                                            key={img.id}
                                            className={`group relative h-24 w-24 overflow-hidden rounded-lg border-2 ${thumbnailUrl === img.url ? "border-[#47735B]" : "border-line-soft"
                                                }`}
                                        >
                                            {img.uploading ? (
                                                <div className="flex h-full w-full items-center justify-center bg-cream-2/50">
                                                    <Loader2 className="h-6 w-6 animate-spin text-[#72BB83]" />
                                                </div>
                                            ) : (
                                                <>
                                                    <Image
                                                        src={img.url}
                                                        alt="Uploaded image"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setAsThumbnail(img)}
                                                        title={thumbnailUrl === img.url ? "Thumbnail" : "Set as thumbnail"}
                                                        className={`absolute -left-1 -top-1 rounded-full p-0.5 transition-opacity ${thumbnailUrl === img.url
                                                            ? "bg-[#47735B] text-white opacity-100"
                                                            : "bg-white/90 text-muted opacity-0 group-hover:opacity-100"
                                                            }`}
                                                    >
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => removeImage(img)}
                                                className="absolute -right-1 -top-1 rounded-full bg-rose-500 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                            >
                                                <XIcon className="h-4 w-4" strokeWidth={2} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {imagePreviews.length === 0 && (
                                <p className="mt-2 text-sm text-muted">No images uploaded yet</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 flex flex-wrap items-center justify-end gap-3 border-t border-line-soft bg-card p-5 sm:p-6">
                    <button
                        onClick={onClose}
                        className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-6 py-2.5 text-sm font-bold text-ink-2 transition-colors hover:border-brand/40 hover:bg-brand-soft/30 hover:text-brand-deep"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!isFormValid()}
                        className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold text-white transition-colors ${isFormValid()
                            ? "bg-[#47735B] hover:bg-[#47735B]"
                            : "bg-muted cursor-not-allowed opacity-60"
                            }`}
                    >
                        <Send className="h-4 w-4" strokeWidth={2.5} />
                        {mode === "edit" ? "Update Case Study" : "Publish"}
                    </button>
                </div>
            </div>
        </div>
    );
}