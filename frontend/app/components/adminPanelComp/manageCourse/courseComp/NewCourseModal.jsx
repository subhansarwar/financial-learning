// app/components/adminPanelComp/manageCourse/courseComp/NewCourseModal.jsx
"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Plus, X } from "lucide-react";

export default function NewCourseModal({ isOpen, onClose, onSubmit }) {
    const [title, setTitle] = useState("");

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (title.trim()) {
            onSubmit(title.trim());
            setTitle("");
            onClose();
        } else {
            toast.error("Please enter a course title");
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md mx-4 rounded-xl2 border border-line bg-card p-6 shadow-card-lg animate-in zoom-in-95 duration-200 sm:p-8"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-brand-soft p-2">
                            <Plus className="h-5 w-5 text-brand-deep" strokeWidth={2} />
                        </div>
                        <h3 className="text-xl font-bold text-ink">New Course</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1.5 text-muted transition-colors hover:bg-cream-2 hover:text-ink"
                    >
                        <X className="h-5 w-5" strokeWidth={2} />
                    </button>
                </div>

                <p className="mb-4 text-sm text-muted">Enter the title for your new course.</p>

                <div className="mb-6">
                    <label htmlFor="courseTitle" className="mb-1.5 block text-sm font-bold text-ink-2">
                        Course Title
                    </label>
                    <input
                        id="courseTitle"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Introduction to Microfinance"
                        className="w-full rounded-lg border border-line bg-cream-2/50 px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:border-brand/50 focus:outline-none focus:ring-4 focus:ring-brand/15"
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSubmit();
                            if (e.key === "Escape") onClose();
                        }}
                    />
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handleSubmit}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#47735B] px-6 py-2.5 font-bold text-base text-white transition-colors hover:bg-[#47735B]"
                    >
                        <Plus className="h-4 w-4" strokeWidth={2.5} />
                        Create Course
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-line bg-card px-6 py-2.5 font-bold text-ink-2 transition-colors hover:border-brand/40 hover:bg-brand-soft/30 hover:text-brand-deep"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}