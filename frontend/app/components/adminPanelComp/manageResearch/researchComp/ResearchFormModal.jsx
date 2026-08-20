// app/components/adminPanelComp/manageResearch/researchComp/ResearchFormModal.jsx
"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { X, Save, Send } from "lucide-react";
import { TOPIC_OPTIONS, emptyResearchDraft } from "./dummyResearch";

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

export default function ResearchFormModal({ isOpen, mode, initialData, onClose, onSave }) {
    const [data, setData] = useState(emptyResearchDraft());

    useEffect(() => {
        if (!isOpen) return;
        setData(mode === "edit" && initialData ? { ...initialData } : emptyResearchDraft());
    }, [isOpen, mode, initialData]);

    if (!isOpen) return null;

    const isFormValid = () => {
        return (
            data.title.trim() !== "" &&
            data.author.trim() !== "" &&
            data.email.trim() !== "" &&
            data.topic.trim() !== "" &&
            data.abstract.trim() !== ""
        );
    };

    const handleSave = () => {
        if (!isFormValid()) {
            toast.error("Please fill in all required fields");
            return;
        }
        onSave(data);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl2 border border-line bg-card shadow-card-lg animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-line-soft p-5 sm:p-6">
                    <div>
                        <h3 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                            {mode === "edit" ? "Edit Research Paper" : "Submit New Research Paper"}
                        </h3>
                        <p className="mt-1 text-sm text-muted">
                            {mode === "edit" ? "Update the paper details." : "Enter the paper details below."}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-cream-2 hover:text-ink"
                    >
                        <X className="h-5 w-5" strokeWidth={2} />
                    </button>
                </div>

                <div className="p-5 sm:p-6">
                    <div className="space-y-4">
                        <Field label="Paper Title" required>
                            <input
                                value={data.title}
                                onChange={(e) => setData({ ...data, title: e.target.value })}
                                placeholder="e.g. Group Lending and Women's Empowerment"
                                className={inputClass}
                            />
                        </Field>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Author Name" required>
                                <input
                                    value={data.author}
                                    onChange={(e) => setData({ ...data, author: e.target.value })}
                                    placeholder="e.g. Amina Yusuf"
                                    className={inputClass}
                                />
                            </Field>
                            <Field label="Author Email" required>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData({ ...data, email: e.target.value })}
                                    placeholder="amina@example.com"
                                    className={inputClass}
                                />
                            </Field>
                        </div>

                        <Field label="Topic" required>
                            <select
                                value={data.topic}
                                onChange={(e) => setData({ ...data, topic: e.target.value })}
                                className={inputClass}
                            >
                                <option value="">Select Topic</option>
                                {TOPIC_OPTIONS.map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Abstract" required>
                            <textarea
                                rows={4}
                                value={data.abstract}
                                onChange={(e) => setData({ ...data, abstract: e.target.value })}
                                placeholder="Enter abstract (2-3 sentences)"
                                className={inputClass}
                            />
                        </Field>

                        <Field label="PDF File">
                            <div className="flex items-center gap-3 rounded-lg border border-line bg-cream-2/50 p-3">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setData({ ...data, fileUrl: URL.createObjectURL(file) });
                                        }
                                    }}
                                    className="text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-brand-soft file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-brand-deep hover:file:bg-brand-soft/70"
                                />
                                {data.fileUrl && data.fileUrl !== "#" && (
                                    <span className="text-xs text-emerald-600">✓ File uploaded</span>
                                )}
                            </div>
                        </Field>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex flex-wrap items-center justify-end gap-3 border-t border-line-soft p-5 sm:p-6">
                    <button
                        onClick={onClose}
                        className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-5 py-2.5 text-sm font-bold text-ink-2 transition-colors hover:border-brand/40 hover:bg-brand-soft/30 hover:text-brand-deep"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!isFormValid()}
                        className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold text-white transition-colors ${isFormValid()
                                ? "bg-brand-deep hover:bg-[#241f6b]"
                                : "bg-muted cursor-not-allowed opacity-60"
                            }`}
                    >
                        <Save className="h-4 w-4" strokeWidth={2.5} />
                        {mode === "edit" ? "Update Paper" : "Submit Paper"}
                    </button>
                </div>
            </div>
        </div>
    );
}