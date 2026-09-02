// app/components/adminPanelComp/manageCourse/courseComp/CourseFormModal.jsx
"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { X, ArrowLeft, ArrowRight, Send } from "lucide-react";
import StepIndicator from "./StepIndicator";
import StepOneInfo from "./StepOneInfo";
import StepTwoCurriculum from "./StepTwoCurriculum";
import { emptyCourseDraft } from "./dummyCourses";

export default function CourseFormModal({ isOpen, mode, initialData, categories, onClose, onSave, courseId }) {
    const [step, setStep] = useState(1);
    const [data, setData] = useState(emptyCourseDraft());

    // Reset / prefill whenever the modal opens
    useEffect(() => {
        if (!isOpen) return;
        setStep(1);
        if (mode === "edit" && initialData) {
            setData({
                id: initialData.id || "",
                title: initialData.title || "",
                tagline: initialData.tagline || "",
                description: initialData.description || "",
                level: initialData.level || "",
                category: initialData.topic || "",
                instructor_name: initialData.instructor_name || "",
                instructor_title: initialData.instructor_title || "",
                coverImageName: initialData.thumbnail_url || "",
                curriculum: initialData.curriculum || [],
                status: initialData.is_published ? "Published" : "Draft",
                slug: initialData.slug || "",
            });
        } else {
            setData(emptyCourseDraft());
        }
    }, [isOpen, mode, initialData]);

    if (!isOpen) return null;

    // Check if Step 1 is valid
    const isStepOneValid = () => {
        return (
            data?.title?.trim() !== "" &&
            data?.tagline?.trim() !== "" &&
            data?.description?.trim() !== "" &&
            data?.category?.trim() !== "" &&
            data?.level?.trim() !== "" &&
            data?.instructor_name?.trim() !== "" &&
            data?.instructor_title?.trim() !== ""
        );
    };

    // Check if Step 2 is valid
    const isStepTwoValid = () => {
        if (!data?.curriculum || !Array.isArray(data?.curriculum) || data?.curriculum?.length === 0) {
            return false;
        }

        let hasValidLecture = false;
        let allSectionsValid = true;

        for (const section of data.curriculum) {
            if (!section?.name?.trim()) {
                allSectionsValid = false;
                break;
            }

            if (!section?.lectures || !Array.isArray(section?.lectures) || section?.lectures?.length === 0) {
                allSectionsValid = false;
                break;
            }

            let sectionHasValidLecture = false;
            for (const lecture of section.lectures) {
                if (lecture?.name?.trim() !== "") {
                    sectionHasValidLecture = true;
                    hasValidLecture = true;
                    break;
                }
            }

            if (!sectionHasValidLecture) {
                allSectionsValid = false;
                break;
            }
        }

        return allSectionsValid && hasValidLecture;
    };

    const goNext = async () => {
        if (!isStepOneValid()) {
            toast.error("Please fill in all required fields before continuing");
            return;
        }
        try {
            const courseData = {
                slug: data?.title?.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
                title: data?.title || "",
                tagline: data?.tagline || "", // tagline ko tagline bhej rahe
                description: data?.description || "",
                topic: data?.category?.trim() || "General",
                level: data?.level || "Beginner",
                length_min: 0,
                thumbnail_url: data?.coverImageName || "",
                instructor_name: data?.instructor_name || "Instructor Name",
                instructor_title: data?.instructor_title || "Instructor Title",
                instructor_bio: "Instructor Bio",
                outcomes: [],
                is_published: false,
            };

            const result = await onSave(courseData, true);
            if (result?.id) {
                // Update data with course ID
                setData(prev => ({ ...prev, id: result.id }));
                // toast.success("Course created successfully!");
                setStep(2);
            }
        } catch (error) {
            console.error('Error creating course:', error);
            toast.error(error?.message || "Failed to create course");
        }
    };

    const handlePublish = () => {
        if (!isStepTwoValid()) {
            toast.error("Please fill in all required curriculum fields before publishing");
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
                className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl2 border border-line bg-card shadow-card-lg animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-line-soft p-5 sm:p-6">
                    <div>
                        <h3 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                            {mode === "edit" ? "Edit Course" : "Create New Course"}
                        </h3>
                        <p className="mt-1 text-sm text-muted">
                            Make sure you have filled in all the necessary fields and have uploaded
                            all the required files.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-cream-2 hover:text-ink"
                    >
                        <X className="h-4 w-4" strokeWidth={2} />
                    </button>
                </div>

                <div className="p-5 sm:p-6">
                    <div className="mb-6">
                        <StepIndicator step={step} />
                    </div>

                    {step === 1 ? (
                        <StepOneInfo data={data} onChange={setData} categories={categories} />
                    ) : (
                        <StepTwoCurriculum
                            sections={data?.curriculum}
                            onChange={(curriculum) => setData({ ...data, curriculum })}
                            courseId={data?.id || courseId}
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line-soft p-5 sm:p-6">
                    {step === 2 ? (
                        <button
                            onClick={() => setStep(1)}
                            className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-5 py-2.5 text-sm font-bold text-ink-2 transition-colors hover:border-brand/40 hover:bg-brand-soft/30 hover:text-brand-deep"
                        >
                            <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
                            Back
                        </button>
                    ) : (
                        <button
                            onClick={onClose}
                            className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-5 py-2.5 text-sm font-bold text-ink-2 transition-colors hover:border-brand/40 hover:bg-brand-soft/30 hover:text-brand-deep"
                        >
                            Cancel
                        </button>
                    )}

                    {step === 1 ? (
                        <button
                            onClick={goNext}
                            disabled={!isStepOneValid()}
                            className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold text-white transition-colors ${isStepOneValid()
                                ? "bg-[#47735B] hover:bg-[#47735B]"
                                : "bg-muted cursor-not-allowed opacity-60"
                                }`}
                        >
                            Continue
                            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                        </button>
                    ) : (
                        <button
                            onClick={handlePublish}
                            disabled={!isStepTwoValid()}
                            className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold text-white transition-colors ${isStepTwoValid()
                                ? "bg-[#47735B] hover:bg-[#47735B]"
                                : "bg-muted cursor-not-allowed opacity-60"
                                }`}
                        >
                            <Send className="h-4 w-4" strokeWidth={2.5} />
                            Publish
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}