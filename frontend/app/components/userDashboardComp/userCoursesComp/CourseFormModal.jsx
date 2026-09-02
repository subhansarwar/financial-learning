// app/components/userDashboardComp/userCoursesComp/CourseFormModal.jsx
"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { X, ArrowLeft, ArrowRight, Send } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { createCourse, updateCourse } from "../../../store/slices/courses/courseThunks";
import StepIndicator from "./StepIndicator";
import StepOneInfo from "./StepOneInfo";
import StepTwoCurriculum from "./StepTwoCurriculum";
import { emptyCourseDraft } from "./dummyCourses";

export default function CourseFormModal({ isOpen, mode, initialData, categories, onClose, onSave }) {
    const dispatch = useAppDispatch();
    const { loadingCreate, loadingUpdate } = useAppSelector((state) => state.course);
    const [step, setStep] = useState(1);
    const [data, setData] = useState(emptyCourseDraft());

    useEffect(() => {
        if (!isOpen) return;
        setStep(1);
        setData(mode === "edit" && initialData ? { ...initialData } : emptyCourseDraft());
    }, [isOpen, mode, initialData]);

    if (!isOpen) return null;

    const isStepOneValid = () => {
        return (
            data.title.trim() !== "" &&
            data.subtitle.trim() !== "" &&
            data.description.trim() !== "" &&
            data.category.trim() !== "" &&
            data.level.trim() !== "" &&
            data.language.trim() !== "" &&
            data.price >= 0
        );
    };

    const isStepTwoValid = () => {
        let hasValidLecture = false;
        let allSectionsValid = true;

        for (const section of data.curriculum) {
            if (!section.name.trim()) {
                allSectionsValid = false;
                break;
            }
            let sectionHasValidLecture = false;
            for (const lecture of section.lectures) {
                if (lecture.name.trim() !== "") {
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

    const goNext = () => {
        if (!isStepOneValid()) {
            toast.error("Please fill in all required fields before continuing");
            return;
        }
        setStep(2);
    };

    const handlePublish = async () => {
        if (!isStepTwoValid()) {
            toast.error("Please fill in all required curriculum fields before publishing");
            return;
        }

        const payload = {
            title: data.title,
            tagline: data.subtitle,
            description: data.description,
            topic: data.category,
            level: data.level,
            language: data.language,
            price: data.price,
            // curriculum: data.curriculum, // Add curriculum structure as per API
        };

        try {
            let result;
            if (mode === "edit" && initialData?.id) {
                result = await dispatch(updateCourse({
                    courseId: initialData.id,
                    courseData: payload,
                })).unwrap();
            } else {
                result = await dispatch(createCourse(payload)).unwrap();
            }

            if (result?.id) {
                toast.success(mode === "edit" ? "Course updated successfully!" : "Course created successfully!");
                onSave(result);
                onClose();
            }
        } catch (error) {
            console.error("Error saving course:", error);
        }
    };

    const isLoading = mode === "edit" ? loadingUpdate : loadingCreate;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-line bg-white shadow-card-lg animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-line-soft p-5 sm:p-6">
                    <div>
                        <h3 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                            {mode === "edit" ? "Edit Course" : "Create New Course"}
                        </h3>
                        <p className="mt-1 text-sm text-muted">
                            Make sure you have filled in all the necessary fields.
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
                    <div className="mb-6">
                        <StepIndicator step={step} />
                    </div>

                    {step === 1 ? (
                        <StepOneInfo data={data} onChange={setData} categories={categories} />
                    ) : (
                        <StepTwoCurriculum
                            sections={data.curriculum}
                            onChange={(curriculum) => setData({ ...data, curriculum })}
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line-soft p-5 sm:p-6">
                    {step === 2 ? (
                        <button
                            onClick={() => setStep(1)}
                            className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-bold text-ink-2 transition-colors hover:border-[#365B50]/40 hover:bg-[#365B50]/10"
                        >
                            <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
                            Back
                        </button>
                    ) : (
                        <button
                            onClick={onClose}
                            className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-bold text-ink-2 transition-colors hover:border-[#365B50]/40 hover:bg-[#365B50]/10"
                        >
                            Cancel
                        </button>
                    )}

                    {step === 1 ? (
                        <button
                            onClick={goNext}
                            disabled={!isStepOneValid()}
                            className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold text-white transition-colors ${isStepOneValid()
                                    ? "bg-[#47735B] hover:bg-[#365B50]"
                                    : "bg-muted cursor-not-allowed opacity-60"
                                }`}
                        >
                            Continue
                            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                        </button>
                    ) : (
                        <button
                            onClick={handlePublish}
                            disabled={!isStepTwoValid() || isLoading}
                            className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold text-white transition-colors ${isStepTwoValid() && !isLoading
                                    ? "bg-[#47735B] hover:bg-[#365B50]"
                                    : "bg-muted cursor-not-allowed opacity-60"
                                }`}
                        >
                            {isLoading ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                                <>
                                    <Send className="h-4 w-4" strokeWidth={2.5} />
                                    {mode === "edit" ? "Update" : "Publish"}
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}