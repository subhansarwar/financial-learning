// app/store/slices/course/courseThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import apiCall from "../../api/apiClient";
import {
    addCourse,
    clearError,
    removeCourse,
    setCourses,
    setCurrentCourse,
    setCurrentCourseProgress,
    setEnrolledCourses,
    setEnrolledStats,
    setLoading,
    setLoadingComplete,
    setLoadingCreate,
    setLoadingDelete,
    setLoadingDetail,
    setLoadingEnroll,
    setLoadingProgress,
    setLoadingUpdate,
    setPagination,
    updateCourseInList,
    updateEnrolledCourse
} from "./courseSlice";

// ============================================
// PUBLIC COURSE ACTIONS
// ============================================
export const getCourses = createAsyncThunk(
    "course/getCourses",
    async ({ search = "", topic = "", level = "", skip = 0, limit = 12 }, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            const params = new URLSearchParams();
            if (search) params.append("q", search);
            if (topic) params.append("topic", topic);
            if (level) params.append("level", level);
            if (skip) params.append("skip", skip);
            if (limit) params.append("limit", limit);

            const res = await apiCall({
                path: `v1/courses/all?${params.toString()}`,
                method: "get",
            });

            console.log("getCourses Response:", res);

            dispatch(setLoading(false));

            // Check if response is array or has data property
            let coursesData = [];
            let totalCount = 0;

            if (Array.isArray(res)) {
                coursesData = res;
                totalCount = res.length;
            } else if (res?.data && Array.isArray(res.data)) {
                coursesData = res.data;
                totalCount = res.total || res.data.length;
            } else if (res?.courses && Array.isArray(res.courses)) {
                coursesData = res.courses;
                totalCount = res.total || res.courses.length;
            }

            if (coursesData.length > 0) {
                dispatch(setCourses(coursesData));
                dispatch(setPagination({
                    total: totalCount,
                    totalPages: Math.ceil(totalCount / limit),
                    page: Math.floor(skip / limit) + 1,
                    limit,
                    skip,
                }));
                return coursesData;
            }

            dispatch(setCourses([]));
            dispatch(setPagination({
                total: 0,
                totalPages: 0,
                page: 1,
                limit,
                skip,
            }));
            return [];
        } catch (error) {
            // console.error("Get Courses Error:", error);
            // dispatch(setLoading(false));
            // toast.error("Failed to load courses");
            throw error;
        }
    }
);

export const getCourseBySlug = createAsyncThunk(
    "course/getCourseBySlug",
    async (slug, { dispatch }) => {
        try {
            dispatch(setLoadingDetail(true));
            dispatch(clearError());

            const res = await apiCall({
                path: `v1/admin/courses/read/${slug}`,
                method: "get",
            });

            dispatch(setLoadingDetail(false));

            if (res?.id) {
                dispatch(setCurrentCourse(res));
                return res;
            }
            throw new Error("Course not found");
        } catch (error) {
            // console.error("Get Course Detail Error:", error);
            dispatch(setLoadingDetail(false));
            // dispatch(setError(error?.message || "Failed to load course details"));
            toast.error("Failed to load course details");
            throw error;
        }
    }
);

// ============================================
// USER ENROLLMENT ACTIONS
// ============================================

export const getEnrolledCourses = createAsyncThunk(
    "course/getEnrolledCourses",
    async (_, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            const res = await apiCall({
                path: "v1/courses/me/enrollments",
                method: "get",
            });

            dispatch(setLoading(false));

            if (Array.isArray(res)) {
                dispatch(setEnrolledCourses(res));

                const stats = {
                    total: res.length,
                    completed: res.filter(c => c.status === "completed").length,
                    inProgress: res.filter(c => c.status === "in_progress").length,
                    notStarted: res.filter(c => c.status === "not_started" || !c.status).length,
                };
                dispatch(setEnrolledStats(stats));

                return { courses: res, stats };
            }
            return { courses: [], stats: { total: 0, completed: 0, inProgress: 0, notStarted: 0 } };
        } catch (error) {
            // console.error("Get Enrolled Courses Error:", error);
            dispatch(setLoading(false));
            // dispatch(setError(error?.message || "Failed to load enrolled courses"));
            toast.error("Failed to load enrolled courses");
            throw error;
        }
    }
);

export const enrollCourse = createAsyncThunk(
    "course/enrollCourse",
    async (courseId, { dispatch }) => {
        try {
            dispatch(setLoadingEnroll(true));
            dispatch(clearError());

            const res = await apiCall({
                path: `v1/courses/${courseId}/enroll`,
                method: "post",
                body: {},
            });

            dispatch(setLoadingEnroll(false));

            if (res?.id) {
                toast.success("Successfully enrolled in course!");
                await dispatch(getEnrolledCourses());
                return res;
            }
            throw new Error("Failed to enroll in course");
        } catch (error) {
            // console.error("Enroll Course Error:", error);
            dispatch(setLoadingEnroll(false));
            const msg = error?.response?.data?.message || "Failed to enroll in course";
            // dispatch(setError(msg));
            toast.error(msg);
            throw error;
        }
    }
);

export const getCourseProgress = createAsyncThunk(
    "course/getCourseProgress",
    async (courseId, { dispatch }) => {
        try {
            dispatch(setLoadingProgress(true));

            const res = await apiCall({
                path: `v1/courses/${courseId}/progress`,
                method: "get",
            });

            dispatch(setLoadingProgress(false));

            if (res?.course_id) {
                dispatch(setCurrentCourseProgress(res));
                return res;
            }
            return null;
        } catch (error) {
            // console.error("Get Course Progress Error:", error);
            dispatch(setLoadingProgress(false));
            return null;
        }
    }
);

export const completeLesson = createAsyncThunk(
    "course/completeLesson",
    async ({ lessonId, courseId }, { dispatch }) => {
        try {
            dispatch(setLoadingComplete(true));
            dispatch(clearError());

            const res = await apiCall({
                path: `v1/courses/lessons/${lessonId}/complete`,
                method: "post",
                body: {},
            });

            dispatch(setLoadingComplete(false));

            if (res?.course_id) {
                toast.success("Lesson completed!");
                dispatch(updateEnrolledCourse({
                    courseId: res.course_id,
                    progress: res,
                }));
                return res;
            }
            return null;
        } catch (error) {
            // console.error("Complete Lesson Error:", error);
            dispatch(setLoadingComplete(false));
            toast.error(error?.response?.data?.message || "Failed to complete lesson");
            throw error;
        }
    }
);

// ============================================
// ADMIN COURSE ACTIONS (CREATE/UPDATE/DELETE)
// ============================================

export const createCourse = createAsyncThunk(
    "course/createCourse",
    async (courseData, { dispatch }) => {
        try {
            dispatch(setLoadingCreate(true));
            dispatch(clearError());

            const res = await apiCall({
                path: "v1/courses",
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
            // console.error("Create Course Error:", error);
            dispatch(setLoadingCreate(false));
            const msg = error?.response?.data?.message || "Failed to create course";
            // dispatch(setError(msg));
            toast.error(msg);
            throw error;
        }
    }
);

export const updateCourse = createAsyncThunk(
    "course/updateCourse",
    async ({ courseId, courseData }, { dispatch }) => {
        try {
            dispatch(setLoadingUpdate(true));
            dispatch(clearError());

            const res = await apiCall({
                path: `v1/courses/${courseId}`,
                method: "put",
                body: courseData,
            });

            dispatch(setLoadingUpdate(false));

            if (res?.id) {
                dispatch(updateCourseInList(res));
                toast.success("Course updated successfully!");
                return res;
            }
            throw new Error("Failed to update course");
        } catch (error) {
            // console.error("Update Course Error:", error);
            dispatch(setLoadingUpdate(false));
            const msg = error?.response?.data?.message || "Failed to update course";
            // dispatch(setError(msg));
            toast.error(msg);
            throw error;
        }
    }
);

export const deleteCourse = createAsyncThunk(
    "course/deleteCourse",
    async (courseId, { dispatch }) => {
        try {
            dispatch(setLoadingDelete(true));
            dispatch(clearError());

            const res = await apiCall({
                path: `v1/courses/${courseId}`,
                method: "delete",
            });

            dispatch(setLoadingDelete(false));

            dispatch(removeCourse(courseId));
            toast.success("Course deleted successfully!");
            return courseId;
        } catch (error) {
            // console.error("Delete Course Error:", error);
            dispatch(setLoadingDelete(false));
            const msg = error?.response?.data?.message || "Failed to delete course";
            // dispatch(setError(msg));
            toast.error(msg);
            throw error;
        }
    }
);