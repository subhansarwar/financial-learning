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
        setData(mode === "edit" && initialData ? { ...initialData } : emptyCourseDraft());
    }, [isOpen, mode, initialData]);

    if (!isOpen) return null;

    // Check if Step 1 is valid
    const isStepOneValid = () => {
        return (
            data?.title?.trim() !== "" &&
            data?.subtitle?.trim() !== "" &&
            data?.description?.trim() !== "" &&
            data?.category?.trim() !== "" &&
            data?.level?.trim() !== "" &&
            data?.language?.trim() !== "" &&
            data?.price >= 0
        );
    };

    // Check if Step 2 is valid
    const isStepTwoValid = () => {
        // Check if curriculum exists and is an array
        if (!data?.curriculum || !Array.isArray(data?.curriculum) || data?.curriculum?.length === 0) {
            return false;
        }

        // Check if all sections have names and at least one lecture with a name
        let hasValidLecture = false;
        let allSectionsValid = true;

        for (const section of data.curriculum) {
            // Section name must be filled
            if (!section?.name?.trim()) {
                allSectionsValid = false;
                break;
            }

            // Check if section has lectures
            if (!section?.lectures || !Array.isArray(section?.lectures) || section?.lectures?.length === 0) {
                allSectionsValid = false;
                break;
            }

            // Check lectures in this section
            let sectionHasValidLecture = false;
            for (const lecture of section.lectures) {
                if (lecture?.name?.trim() !== "") {
                    sectionHasValidLecture = true;
                    hasValidLecture = true;
                    break;
                }
            }

            // Each section must have at least one valid lecture
            if (!sectionHasValidLecture) {
                allSectionsValid = false;
                break;
            }
        }

        return allSectionsValid && hasValidLecture;
    };

    const goNext = () => {
        if (!isStepOneValid()) {
            toast.error("Please fill in all required fields before continuing");
            return;
        }
        setStep(2);
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
                            courseId={courseId}
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