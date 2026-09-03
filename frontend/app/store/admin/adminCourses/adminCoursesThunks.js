// app/store/admin/adminCourses/adminCoursesThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import apiCall from "../../api/apiClient";
import {
    addCourse,
    clearError,
    removeCourse,
    setCourses,
    setCurrentCourse,
    setLoading,
    setLoadingCreate,
    setLoadingDelete,
    setLoadingUpdate,
    setPagination,
    updateCourseInList
} from "./adminCoursesSlice";

// Get all courses
export const getAllCourses = createAsyncThunk(
    "adminCourses/getAllCourses",
    async ({ skip = 0, limit = 50 }, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            const res = await apiCall({
                path: "v1/admin/courses/all",
                method: "get",
                params: { skip, limit },
            });

            dispatch(setLoading(false));

            if (res) {
                dispatch(setCourses(res));
                dispatch(setPagination({ skip, limit, total: res?.length || 0 }));
                return res;
            }
            throw new Error("No courses found");
        } catch (error) {
            dispatch(setLoading(false));
            const errorMsg = error?.response?.data?.detail || "Failed to fetch courses. Please try again.";
            toast.error(errorMsg);
            throw error;
        }
    }
);

// Create new course
export const createCourse = createAsyncThunk(
    "adminCourses/createCourse",
    async (courseData, { dispatch }) => {
        try {
            dispatch(setLoadingCreate(true));
            dispatch(clearError());

            const res = await apiCall({
                path: "v1/admin/courses/create",
                method: "post",
                body: courseData,
            });

            dispatch(setLoadingCreate(false));

            if (res?.id) {
                dispatch(addCourse(res));
                toast.success("Course created successfully!");
                return res;
            }
            throw new Error("Failed to create course");
        } catch (error) {
            dispatch(setLoadingCreate(false));
            const errorMsg = error?.response?.data?.detail || "Failed to create course. Please try again.";
            toast.error(errorMsg);
            throw error;
        }
    }
);

// Update course
export const updateCourse = createAsyncThunk(
    "adminCourses/updateCourse",
    async ({ courseId, updateData }, { dispatch }) => {
        try {
            dispatch(setLoadingUpdate(true));
            dispatch(clearError());

            const res = await apiCall({
                path: `v1/admin/courses/update/${courseId}`,
                method: "patch",
                body: updateData,
            });

            dispatch(setLoadingUpdate(false));

            if (res?.id) {
                dispatch(updateCourseInList(res));
                dispatch(setCurrentCourse(res));
                toast.success("Course updated successfully!");
                return res;
            }
            throw new Error("Failed to update course");
        } catch (error) {
            dispatch(setLoadingUpdate(false));
            const errorMsg = error?.response?.data?.detail || "Failed to update course. Please try again.";
            toast.error(errorMsg);
            throw error;
        }
    }
);

// Delete course
export const deleteCourseById = createAsyncThunk(
    "adminCourses/deleteCourseById",
    async (courseId, { dispatch }) => {
        try {
            dispatch(setLoadingDelete(true));
            dispatch(clearError());

            const res = await apiCall({
                path: `v1/admin/courses/delete/${courseId}`,
                method: "delete",
            });

            dispatch(setLoadingDelete(false));

            if (res?.message === "Course deleted") {
                dispatch(removeCourse(courseId));
                toast.success("Course deleted successfully!");
                return { courseId, data: res };
            }
            throw new Error("Failed to delete course");
        } catch (error) {
            const errorMsg = error?.response?.data?.detail || "Failed to delete course. Please try again.";
            toast.error(errorMsg);
            throw error;
        }
    }
);

// ============ MODULE CRUD ============
export const createModule = createAsyncThunk(
    "adminCourses/createModule",
    async ({ courseId, data }, { dispatch }) => {
        try {
            dispatch(setLoadingCreate(true));
            dispatch(clearError());

            const res = await apiCall({
                path: `v1/admin/courses/create-modules/${courseId}`,
                method: "post",
                body: data,
            });

            dispatch(setLoadingCreate(false));
            toast.success("Module created successfully!");
            return res;
        } catch (error) {
            dispatch(setLoadingCreate(false));
            const errorMsg = error?.response?.data?.detail || "Failed to create module";
            toast.error(errorMsg)
            throw error;
        }
    }
);

export const updateModule = createAsyncThunk(
    "adminCourses/updateModule",
    async ({ moduleId, data }, { dispatch }) => {
        try {
            dispatch(setLoadingUpdate(true));
            dispatch(clearError());

            const res = await apiCall({
                path: `v1/admin/courses/update-modules/${moduleId}`,
                method: "patch",
                body: data,
            });

            dispatch(setLoadingUpdate(false));
            toast.success("Module updated successfully!");
            return res;
        } catch (error) {
            dispatch(setLoadingUpdate(false));
            const errorMsg = error?.response?.data?.detail || "Failed to update module";
            toast.error(errorMsg)
            throw error;
        }
    }
);

export const deleteModule = createAsyncThunk(
    "adminCourses/deleteModule",
    async (moduleId, { dispatch }) => {
        try {
            dispatch(setLoadingDelete(true));
            dispatch(clearError());

            const res = await apiCall({
                path: `v1/admin/courses/delete-modules/${moduleId}`,
                method: "delete",
            });

            dispatch(setLoadingDelete(false));
            toast.success(res?.message || "Module deleted successfully!");
            return res;
        } catch (error) {
            dispatch(setLoadingDelete(false));
            const errorMsg = error?.response?.data?.detail || "Failed to delete module";
            toast.error(errorMsg)
            throw error;
        }
    }
);

// ============ LESSON CRUD ============
export const createLesson = createAsyncThunk(
    "adminCourses/createLesson",
    async ({ moduleId, data }, { dispatch }) => {
        try {
            dispatch(setLoadingCreate(true));
            dispatch(clearError());

            const res = await apiCall({
                path: `v1/admin/courses/create-lessons/${moduleId}/lessons`,
                method: "post",
                body: data,
            });

            dispatch(setLoadingCreate(false));
            toast.success("Lesson created successfully!");
            return res;
        } catch (error) {
            dispatch(setLoadingCreate(false));
            const errorMsg = error?.response?.data?.detail || "Failed to create lesson";
            toast.error(errorMsg)
            throw error;
        }
    }
);

export const updateLesson = createAsyncThunk(
    "adminCourses/updateLesson",
    async ({ lessonId, data }, { dispatch }) => {
        try {
            dispatch(setLoadingUpdate(true));
            dispatch(clearError());

            const res = await apiCall({
                path: `v1/admin/courses/update-lessons/${lessonId}`,
                method: "patch",
                body: data,
            });

            dispatch(setLoadingUpdate(false));
            toast.success("Lesson updated successfully!");
            return res;
        } catch (error) {
            dispatch(setLoadingUpdate(false));
            const errorMsg = error?.response?.data?.detail || "Failed to update lesson";
            toast.error(errorMsg)
            throw error;
        }
    }
);

export const deleteLesson = createAsyncThunk(
    "adminCourses/deleteLesson",
    async (lessonId, { dispatch }) => {
        try {
            dispatch(setLoadingDelete(true));
            dispatch(clearError());

            const res = await apiCall({
                path: `v1/admin/courses/delete-lessons/${lessonId}`,
                method: "delete",
            });
            toast.success(res?.message)
            dispatch(setLoadingDelete(false));
            return res;
        } catch (error) {
            dispatch(setLoadingDelete(false));
            const errorMsg = error?.response?.data?.detail || "Failed to delete lesson";
            toast.error(errorMsg)
            throw error;
        }
    }
);