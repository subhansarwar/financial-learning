// app/components/adminPanelComp/manageCourse/courseComp/CourseFormModal.jsx
"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { X, ArrowLeft, ArrowRight, Send } from "lucide-react";
import StepIndicator from "./StepIndicator";
import StepOneInfo from "./StepOneInfo";
import StepTwoCurriculum from "./StepTwoCurriculum";
import { emptyCourseDraft } from "./dummyCourses";

export default function CourseFormModal({
    isOpen,
    mode,
    initialData,
    categories,
    onClose,
    onSaveStepOne,
    onPublish,
    isLoading,
    courseId,
}) {
    const [step, setStep] = useState(1);
    const [data, setData] = useState(emptyCourseDraft());
    const [savingStepOne, setSavingStepOne] = useState(false);
    const [publishing, setPublishing] = useState(false);

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
                instructor_bio: initialData.instructor_bio || "",
                outcomes: Array.isArray(initialData.outcomes) ? initialData.outcomes : [],
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
                if (lecture?.title?.trim()) {
                    // A quiz lesson also needs at least one real question before it counts as complete
                    if (lecture?.type === "quiz") {
                        const hasQuestion = (lecture?.quiz_questions || []).some(
                            (q) => q?.q?.trim() && (q?.choices || []).filter((c) => c?.trim()).length >= 2
                        );
                        if (hasQuestion) {
                            sectionHasValidLecture = true;
                            hasValidLecture = true;
                            break;
                        }
                    } else {
                        sectionHasValidLecture = true;
                        hasValidLecture = true;
                        break;
                    }
                }
            }

            if (!sectionHasValidLecture) {
                allSectionsValid = false;
                break;
            }
        }

        return allSectionsValid && hasValidLecture;
    };

    // Step 1 → Step 2: creates the course on first save, updates it on every
    // return visit (edit mode), never re-creates it.
    const goNext = async () => {
        if (!isStepOneValid()) {
            toast.error("Please fill in all required fields before continuing");
            return;
        }
        try {
            setSavingStepOne(true);
            const result = await onSaveStepOne(data);
            setData((prev) => ({
                ...prev,
                id: result?.id || prev.id,
                slug: result?.slug || prev.slug,
            }));
            setStep(2);
        } catch (error) {
            console.error("Error saving course info:", error);
            toast.error(error?.response?.data?.detail || error?.message || "Failed to save course info");
        } finally {
            setSavingStepOne(false);
        }
    };

    const handlePublish = async () => {
        if (!isStepTwoValid()) {
            toast.error("Please add at least one module with a completed lesson before publishing");
            return;
        }
        try {
            setPublishing(true);
            await onPublish({ ...data, status: "Published" });
        } catch (error) {
            // onPublish already surfaces a toast with the server's error detail
        } finally {
            setPublishing(false);
        }
    };

    const isPublishedAlready = data?.status === "Published";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm animate-in fade-in duration-200 sm:p-4"
            onClick={onClose}
        >
            <div
                className="flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl2 border border-line bg-card shadow-card-lg animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-line-soft p-4 sm:p-5 md:p-6">
                    <div className="min-w-0">
                        <h3 className="text-lg font-bold tracking-tight text-ink sm:text-xl md:text-2xl">
                            {mode === "edit" ? "Edit Course" : "Create New Course"}
                        </h3>
                        <p className="mt-1 text-xs text-muted sm:text-sm">
                            Make sure you have filled in all the necessary fields and have uploaded
                            all the required files.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-cream-2 hover:text-ink sm:h-9 sm:w-9"
                    >
                        <X className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6">
                    <div className="mb-5 sm:mb-6">
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
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line-soft p-4 sm:p-5 md:p-6">
                    {step === 2 ? (
                        <button
                            onClick={() => setStep(1)}
                            className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2.5 text-sm font-bold text-ink-2 transition-colors hover:border-brand/40 hover:bg-brand-soft/30 hover:text-brand-deep sm:px-5"
                        >
                            <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
                            Back
                        </button>
                    ) : (
                        <button
                            onClick={onClose}
                            className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2.5 text-sm font-bold text-ink-2 transition-colors hover:border-brand/40 hover:bg-brand-soft/30 hover:text-brand-deep sm:px-5"
                        >
                            Cancel
                        </button>
                    )}

                    {step === 1 ? (
                        <button
                            onClick={goNext}
                            disabled={!isStepOneValid() || savingStepOne}
                            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white transition-colors sm:px-6 ${isStepOneValid() && !savingStepOne
                                ? "bg-[#47735B] hover:bg-[#3a5f4a]"
                                : "bg-muted cursor-not-allowed opacity-60"
                                }`}
                        >
                            {savingStepOne ? "Saving..." : "Continue"}
                            {!savingStepOne && <ArrowRight className="h-4 w-4" strokeWidth={2.5} />}
                        </button>
                    ) : (
                        <button
                            onClick={handlePublish}
                            disabled={!isStepTwoValid() || publishing}
                            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white transition-colors sm:px-6 ${isStepTwoValid() && !publishing
                                ? "bg-[#47735B] hover:bg-[#3a5f4a]"
                                : "bg-muted cursor-not-allowed opacity-60"
                                }`}
                        >
                            <Send className="h-4 w-4" strokeWidth={2.5} />
                            {publishing ? "Saving..." : isPublishedAlready ? "Save Changes" : "Publish Course"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}