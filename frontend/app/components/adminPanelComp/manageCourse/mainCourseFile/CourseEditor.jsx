// app/components/adminPanelComp/manageCourse/CourseEditor.jsx
"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { normalizeCurriculum } from "../../../../../lib/curriculum";
import {
    clearCurrentCourse,
    clearError,
} from '../../../../store/admin/adminCourses/adminCoursesSlice';
import {
    createCourse,
    deleteCourseById,
    getAllCourses,
    getModulesByCourse,
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

    const [viewCourse, setViewCourse] = useState(null);
    const [formState, setFormState] = useState({ open: false, mode: "create", course: null });
    const [deleteCourse, setDeleteCourse] = useState(null);
    const [createdCourseId, setCreatedCourseId] = useState(null); // Store created course ID
    const [loadingModules, setLoadingModules] = useState(false);

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

    const openEdit = async (course) => {
        setViewCourse(null);
        setCreatedCourseId(course?.id); // Set course ID for edit mode
        setLoadingModules(true);
        try {
            const modulesRes = await dispatch(getModulesByCourse(course.id)).unwrap();
            console.log("modules response ===>", modulesRes); // shape check karne ke liye
            const curriculum = normalizeCurriculum(modulesRes);
            setFormState({ open: true, mode: "edit", course: { ...course, curriculum } });
        } catch (error) {
            // Modules fetch fail ho jaye to bhi form khul jaye, khaali curriculum ke saath
            setFormState({ open: true, mode: "edit", course: { ...course, curriculum: [] } });
        } finally {
            setLoadingModules(false);
        }

        // setFormState({ open: true, mode: "edit", course });
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
    const handleSaveStepOne = async (data) => {
        if (formState.mode === "edit" && data?.id) {
            const updateData = prepareCourseData(data, true);
            const result = await dispatch(updateCourse({
                courseId: data.id,
                updateData,
            })).unwrap();
            setCreatedCourseId(data.id);
            return { ...updateData, id: data.id, ...result };
        }

        const courseData = prepareCourseData(data, false);
        const result = await dispatch(createCourse(courseData)).unwrap();
        setCreatedCourseId(result?.id);
        return result;
    };

    const handlePublish = async (data) => {
        try {
            const updateData = prepareCourseData(data, true);
            await dispatch(updateCourse({
                courseId: data?.id,
                updateData,
            })).unwrap();

            await dispatch(getAllCourses({
                skip: pagination.skip || 0,
                limit: pagination.limit || 50,
            })).unwrap();

            onDataChange?.();
            closeForm();
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
                editLoading={loadingModules}
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
                onSaveStepOne={handleSaveStepOne}
                onPublish={handlePublish}
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