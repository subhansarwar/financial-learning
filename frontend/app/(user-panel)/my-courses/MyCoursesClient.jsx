// app/(user-panel)/my-courses/MyCoursesClient.jsx
"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import CourseFormModal from "../../components/userDashboardComp/userCoursesComp/CourseFormModal";
import CourseTable from "../../components/userDashboardComp/userCoursesComp/CourseTable";
import DeleteConfirmModal from "../../components/userDashboardComp/userCoursesComp/DeleteConfirmModal";
import { initialCourses, nextCourseId } from "../../components/userDashboardComp/userCoursesComp/dummyCourses";
import { useRouter } from "next/navigation";

export default function MyCoursesClient() {
    const router = useRouter();
    const [courses, setCourses] = useState(initialCourses);
    const [formState, setFormState] = useState({ open: false, mode: "create", course: null });
    const [deleteCourse, setDeleteCourse] = useState(null);

    const openCreate = () => setFormState({ open: true, mode: "create", course: null });
    const openEdit = (course) => {
        setFormState({ open: true, mode: "edit", course });
    };
    const closeForm = () => setFormState((s) => ({ ...s, open: false }));
    const handleView = (course) => {
        router.push(`/course-details/${course.id}`);
    };
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
        closeForm();
    };

    const handleDeleteConfirm = () => {
        setCourses((prev) => prev.filter((c) => c.id !== deleteCourse.id));
        toast.success("Course deleted");
        setDeleteCourse(null);
    };

    return (
        <section className="min-h-screen bg-[#FFF7ED] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
            <CourseTable
                courses={courses}
                onCreateNew={openCreate}
                onView={handleView}
                onEdit={openEdit}
                onDelete={setDeleteCourse}
            />

            <CourseFormModal
                isOpen={formState.open}
                mode={formState.mode}
                initialData={formState.course}
                onClose={closeForm}
                onSave={handleSave}
            />

            <DeleteConfirmModal
                isOpen={!!deleteCourse}
                onClose={() => setDeleteCourse(null)}
                onConfirm={handleDeleteConfirm}
                courseTitle={deleteCourse?.title}
            />
        </section>
    );
}