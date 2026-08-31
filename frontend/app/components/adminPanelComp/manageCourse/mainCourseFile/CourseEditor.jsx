// app/components/adminPanelComp/manageCourse/CourseEditor.jsx
"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    clearCurrentCourse,
    clearError
} from '../../../../store/admin/adminCourses/adminCoursesSlice';
import {
    createCourse,
    deleteCourseById,
    getAllCourses,
    updateCourse,
} from "../../../../store/admin/adminCourses/adminCoursesThunks";
import CourseFormModal from "../courseComp/CourseFormModal";
import CourseTable from "../courseComp/CourseTable";
import CourseViewModal from "../courseComp/CourseViewModal";
import DeleteConfirmModal from "../courseComp/DeleteConfirmModal";

export default function CourseEditor({ topics, onDataChange }) {
    const dispatch = useDispatch();
    const {
        courses,
        loading,
        error,
        pagination,
        loadingCreate,
        loadingUpdate,
        loadingDelete,
    } = useSelector((state) => state.adminCourses);
    console.log('courses ===>', courses)


    const [viewCourse, setViewCourse] = useState(null);
    const [formState, setFormState] = useState({ open: false, mode: "create", course: null });
    const [deleteCourse, setDeleteCourse] = useState(null);

    const categories = topics?.length ? topics.map((t) => t.name) : undefined;

    // Fetch courses on mount and when pagination changes
    useEffect(() => {
        dispatch(getAllCourses({
            skip: pagination.skip || 0,
            limit: pagination.limit || 50,
        }));
    }, [dispatch, pagination.skip, pagination.limit]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            dispatch(clearError());
            dispatch(clearCurrentCourse());
        };
    }, [dispatch]);

    const openCreate = () => setFormState({ open: true, mode: "create", course: null });
    const openEdit = (course) => {
        setViewCourse(null);
        setFormState({ open: true, mode: "edit", course });
    };
    const closeForm = () => setFormState((s) => ({ ...s, open: false }));
    // app/components/adminPanelComp/manageCourse/CourseEditor.jsx

    const handleSave = async (data) => {
        try {
            if (formState.mode === "create") {
                // Check if category is empty, use a default value
                const topicValue = data?.category?.trim() || "General";

                const courseData = {
                    slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
                    title: data.title,
                    tagline: data.subtitle || "",
                    description: data.description || "",
                    topic: topicValue, // Use validated topic
                    level: data.level || "Beginner",
                    length_min: 0,
                    thumbnail_url: data.coverImageName || "",
                    instructor_name: "Instructor Name",
                    instructor_title: "Instructor Title",
                    instructor_bio: "Instructor Bio",
                    outcomes: [],
                    is_published: data.status === "Published" ? true : false,
                };
                await dispatch(createCourse(courseData)).unwrap();
                // Refresh the list after creation
                await dispatch(getAllCourses({
                    skip: pagination.skip || 0,
                    limit: pagination.limit || 50,
                })).unwrap();
            } else {
                // Check if category is empty, use a default value
                const topicValue = data?.category?.trim() || "General";

                const updateData = {
                    slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-'),
                    title: data.title,
                    tagline: data.subtitle || "",
                    description: data.description || "",
                    topic: topicValue, // Use validated topic
                    level: data.level || "Beginner",
                    length_min: 0,
                    thumbnail_url: data.coverImageName || "",
                    instructor_name: "Instructor Name",
                    instructor_title: "Instructor Title",
                    instructor_bio: "Instructor Bio",
                    outcomes: [],
                    is_published: data.status === "Published" ? true : false,
                };
                await dispatch(updateCourse({
                    courseId: data.id,
                    updateData,
                })).unwrap();
                // Refresh the list after update
                await dispatch(getAllCourses({
                    skip: pagination.skip || 0,
                    limit: pagination.limit || 50,
                })).unwrap();
            }
            onDataChange?.();
            closeForm();
        } catch (error) {
            // console.error('Error saving course:', error);
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await dispatch(deleteCourseById(deleteCourse.id)).unwrap();
            // Refresh the list after deletion
            await dispatch(getAllCourses({
                skip: pagination.skip || 0,
                limit: pagination.limit || 50,
            })).unwrap();
            setDeleteCourse(null);
            onDataChange?.();
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    return (
        <>
            <CourseTable
                courses={courses}
                onCreateNew={openCreate}
                onView={setViewCourse}
                onEdit={openEdit}
                onDelete={setDeleteCourse}
                loading={loading}
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
                isLoading={loadingCreate || loadingUpdate}
                courseId={formState?.course?.id}
            />

            <DeleteConfirmModal
                isOpen={!!deleteCourse}
                onClose={() => setDeleteCourse(null)}
                onConfirm={handleDeleteConfirm}
                courseTitle={deleteCourse?.title}
                isLoading={loadingDelete}
            />
        </>
    );
}