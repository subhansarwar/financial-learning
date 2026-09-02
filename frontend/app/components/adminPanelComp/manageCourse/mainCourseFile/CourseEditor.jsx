// app/components/adminPanelComp/manageCourse/CourseEditor.jsx
"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CourseTable from "../courseComp/CourseTable";
import CourseViewModal from "../courseComp/CourseViewModal";
import CourseFormModal from "../courseComp/CourseFormModal";
import DeleteConfirmModal from "../courseComp/DeleteConfirmModal";
import {
    getAllCourses,
    createCourse,
    updateCourse,
    deleteCourseById,
} from "../../../../store/admin/adminCourses/adminCoursesThunks";
import {
    clearCurrentCourse,
    clearError,
} from '../../../../store/admin/adminCourses/adminCoursesSlice';

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

    const [viewCourse, setViewCourse] = useState(null);
    const [formState, setFormState] = useState({ open: false, mode: "create", course: null });
    const [deleteCourse, setDeleteCourse] = useState(null);
    const [createdCourseId, setCreatedCourseId] = useState(null); // Store created course ID

    const categories = topics?.length ? topics.map((t) => t.name) : undefined;

    useEffect(() => {
        dispatch(getAllCourses({
            skip: pagination.skip || 0,
            limit: pagination.limit || 50,
        }));
    }, [dispatch, pagination.skip, pagination.limit]);

    useEffect(() => {
        return () => {
            dispatch(clearError());
            dispatch(clearCurrentCourse());
        };
    }, [dispatch]);

    const openCreate = () => {
        setCreatedCourseId(null); // Reset course ID
        setFormState({ open: true, mode: "create", course: null });
    };

    const openEdit = (course) => {
        setViewCourse(null);
        setCreatedCourseId(course?.id); // Set course ID for edit mode
        setFormState({ open: true, mode: "edit", course });
    };

    const closeForm = () => setFormState((s) => ({ ...s, open: false }));

    const prepareCourseData = (data, isEdit = false) => {
        const topicValue = data?.category?.trim() || "General";
        const slugValue = data?.slug || data?.title?.toLowerCase().replace(/\s+/g, '-');
        console.log('data ===>', data)
        return {
            slug: isEdit ? slugValue : slugValue + '-' + Date.now(),
            title: data?.title || "",
            tagline: data?.tagline,
            description: data?.description || "",
            topic: topicValue,
            level: data?.level || "Beginner",
            length_min: 0,
            thumbnail_url: data?.coverImageName || "",
            instructor_name: data?.instructor_name || "Instructor Name",
            instructor_title: data?.instructor_title || "Instructor Title",
            instructor_bio: "Instructor Bio",
            outcomes: [],
            is_published: data?.status === "Published" ? true : false,
        };
    };

    const handleSave = async (data, isCreateMode = false) => {
        try {
            if (isCreateMode || formState.mode === "create") {
                const courseData = prepareCourseData(data, false);
                const result = await dispatch(createCourse(courseData)).unwrap();
                setCreatedCourseId(result?.id);

                // Agar create mode hai toh sirf ID return karo
                if (isCreateMode) {
                    return result;
                }

                await dispatch(getAllCourses({
                    skip: pagination.skip || 0,
                    limit: pagination.limit || 50,
                })).unwrap();
            } else {
                const updateData = prepareCourseData(data, true);
                await dispatch(updateCourse({
                    courseId: data?.id,
                    updateData,
                })).unwrap();

                await dispatch(getAllCourses({
                    skip: pagination.skip || 0,
                    limit: pagination.limit || 50,
                })).unwrap();
            }

            onDataChange?.();
            closeForm();
            return data;
        } catch (error) {
            throw error;
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await dispatch(deleteCourseById(deleteCourse.id)).unwrap();
            await dispatch(getAllCourses({
                skip: pagination.skip || 0,
                limit: pagination.limit || 50,
            })).unwrap();
            setDeleteCourse(null);
            onDataChange?.();
        } catch (error) {
            console.error('Error deleting course:', error);
            toast.error(error?.response?.data?.detail || "Failed to delete course");
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
                courseId={createdCourseId || formState.course?.id} // Pass course ID
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