// app/components/adminPanelComp/manageCourse/CourseEditor.jsx
"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import CourseTable from "../courseComp/CourseTable";
import CourseViewModal from "../courseComp/CourseViewModal";
import CourseFormModal from "../courseComp/CourseFormModal";
import DeleteConfirmModal from "../courseComp/DeleteConfirmModal";
import { initialCourses, nextCourseId } from "../courseComp/dummyCourses";

export default function CourseEditor({ topics, onDataChange }) {
    const [courses, setCourses] = useState(initialCourses);
    const [viewCourse, setViewCourse] = useState(null);
    const [formState, setFormState] = useState({ open: false, mode: "create", course: null });
    const [deleteCourse, setDeleteCourse] = useState(null);

    // Reuse real topic names as categories when the parent passes them in,
    // otherwise StepOneInfo falls back to its own default list.
    const categories = topics?.length ? topics.map((t) => t.name) : undefined;

    const openCreate = () => setFormState({ open: true, mode: "create", course: null });
    const openEdit = (course) => {
        setViewCourse(null);
        setFormState({ open: true, mode: "edit", course });
    };
    const closeForm = () => setFormState((s) => ({ ...s, open: false }));

    const handleSave = (data) => {
        if (formState.mode === "create") {
            const newCourse = {
                ...data,
                id: nextCourseId(),
                creationDate: new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                }),
                sales: 0,
                enrollments: 0,
                status: "Draft",
            };
            setCourses((prev) => [newCourse, ...prev]);
            toast.success("Course created as Draft");
        } else {
            setCourses((prev) => prev.map((c) => (c.id === data.id ? { ...c, ...data } : c)));
            toast.success("Course updated");
        }
        onDataChange?.();
        closeForm();
    };

    const handleDeleteConfirm = () => {
        setCourses((prev) => prev.filter((c) => c.id !== deleteCourse.id));
        toast.success("Course deleted");
        setDeleteCourse(null);
        onDataChange?.();
    };

    return (
        <>
            <CourseTable
                courses={courses}
                onCreateNew={openCreate}
                onView={setViewCourse}
                onEdit={openEdit}
                onDelete={setDeleteCourse}
            />

            <CourseViewModal
                course={viewCourse}
                onClose={() => setViewCourse(null)}
                onEdit={() => openEdit(viewCourse)}
            />

            <CourseFormModal
                isOpen={formState.open}
                mode={formState.mode}
                initialData={formState.course}
                categories={categories}
                onClose={closeForm}
                onSave={handleSave}
            />

            <DeleteConfirmModal
                isOpen={!!deleteCourse}
                onClose={() => setDeleteCourse(null)}
                onConfirm={handleDeleteConfirm}
                courseTitle={deleteCourse?.title}
            />
        </>
    );
}