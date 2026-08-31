// app/store/website/websiteCourseThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import apiCall from "../api/apiClient";
import {
    clearError,
    setCourses,
    setCurrentCourse,
    setError,
    setErrorDetail,
    setErrorTopics,
    setFilters,
    setLoading,
    setLoadingDetail,
    setLoadingTopics,
    setPagination,
    setTopics
} from "./websiteCourseSlice";

// ============================================
// COURSE CRUD
// ============================================
// Get all courses with pagination and filters
export const getAllCourses = createAsyncThunk(
    "websiteCourse/getAllCourses",
    async ({ skip = 0, limit = 50, topic = "", level = "", search = "" }, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            const params = new URLSearchParams();
            params.append("skip", skip);
            params.append("limit", limit);
            if (topic) params.append("topic", topic);
            if (level) params.append("level", level);
            if (search) params.append("search", search);

            const res = await apiCall({
                path: `v1/admin/courses/all?${params.toString()}`,
                method: "get",
            });
            console.log('res website course ===>', res)
            dispatch(setLoading(false));

            if (res) {

                let courses = [];
                let total = 0;

                if (Array.isArray(res)) {
                    courses = res;
                    total = res.length;
                } else if (res.courses && Array.isArray(res.courses)) {
                    courses = res.courses;
                    total = res.total || courses.length;
                } else if (res.data && Array.isArray(res.data)) {
                    courses = res.data;
                    total = res.total || courses.length;
                }
                console.log('res ===>', res)
                dispatch(setCourses(res));
                dispatch(setPagination({ skip, limit, total }));
                dispatch(setFilters({ topic, level, search }));

                return { courses, total, skip, limit, topic, level, search };
            }
            throw new Error("No courses found");
        } catch (error) {
            dispatch(setLoading(false));
            const errorMsg = error?.response?.data?.detail || error?.detail || "Failed to fetch courses. Please try again.";
            // toast.error(errorMsg);
            throw error;
        }
    }
);

// Get single course by slug
export const getCourseBySlug = createAsyncThunk(
    "websiteCourse/getCourseBySlug",
    async (slug, { dispatch }) => {
        try {
            dispatch(setLoadingDetail(true));
            dispatch(clearError());

            // CORRECT ROUTE: v1/admin/courses/slug/{slug}
            const res = await apiCall({
                path: `v1/admin/courses/slug/${slug}`,
                method: "get",
            });

            dispatch(setLoadingDetail(false));

            if (res) {
                const course = res.course || res.data || res;
                dispatch(setCurrentCourse(course));
                return course;
            }
            throw new Error("Course not found");
        } catch (error) {
            dispatch(setLoadingDetail(false));
            const errorMsg = error?.response?.data?.detail || error?.detail || "Failed to fetch course. Please try again.";
            toast.error(errorMsg);
            throw error;
        }
    }
);

// Get all topics
export const getAllTopics = createAsyncThunk(
    "websiteCourse/getAllTopics",
    async (_, { dispatch }) => {
        try {
            dispatch(setLoadingTopics(true));
            dispatch(clearError());

            // CORRECT ROUTE: v1/admin/topics/all
            const res = await apiCall({
                path: "v1/admin/topics/all",
                method: "get",
            });

            dispatch(setLoadingTopics(false));

            if (res) {
                const topics = res.topics || res.data || res || [];
                dispatch(setTopics(topics));
                return topics;
            }
            throw new Error("No topics found");
        } catch (error) {
            dispatch(setLoadingTopics(false));
            const errorMsg = error?.response?.data?.detail || error?.detail || "Failed to fetch topics. Please try again.";
            dispatch(setErrorTopics(errorMsg));
            toast.error(errorMsg);
            throw error;
        }
    }
);

// ============================================
// COURSE PROGRESS (Optional - if needed)
// ============================================

// Get user progress for a course
export const getCourseProgress = createAsyncThunk(
    "websiteCourse/getCourseProgress",
    async (courseId, { dispatch }) => {
        try {
            dispatch(setLoadingDetail(true));
            dispatch(clearError());

            const res = await apiCall({
                path: `v1/courses/progress/${courseId}`,
                method: "get",
            });

            dispatch(setLoadingDetail(false));
            return res;
        } catch (error) {
            dispatch(setLoadingDetail(false));
            const errorMsg = error?.response?.data?.detail || error?.detail || "Failed to fetch course progress";
            dispatch(setErrorDetail(errorMsg));
            toast.error(errorMsg);
            throw error;
        }
    }
);

// Update lesson progress
export const updateLessonProgress = createAsyncThunk(
    "websiteCourse/updateLessonProgress",
    async ({ lessonId, completed }, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            const res = await apiCall({
                path: `v1/courses/lesson-progress/${lessonId}`,
                method: "patch",
                body: { completed },
            });

            dispatch(setLoading(false));
            toast.success("Progress updated!");
            return res;
        } catch (error) {
            dispatch(setLoading(false));
            const errorMsg = error?.response?.data?.detail || error?.detail || "Failed to update progress";
            toast.error(errorMsg);
            throw error;
        }
    }
);

// ============================================
// COURSE ENROLLMENT (Optional - if needed)
// ============================================

// Enroll in a course
export const enrollInCourse = createAsyncThunk(
    "websiteCourse/enrollInCourse",
    async (courseId, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            const res = await apiCall({
                path: `v1/courses/enroll/${courseId}`,
                method: "post",
            });

            dispatch(setLoading(false));
            toast.success("Successfully enrolled in course!");
            return res;
        } catch (error) {
            dispatch(setLoading(false));
            const errorMsg = error?.response?.data?.detail || error?.detail || "Failed to enroll in course";
            toast.error(errorMsg);
            throw error;
        }
    }
);

// Get enrolled courses
export const getEnrolledCourses = createAsyncThunk(
    "websiteCourse/getEnrolledCourses",
    async (_, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            const res = await apiCall({
                path: "v1/courses/enrolled",
                method: "get",
            });

            dispatch(setLoading(false));

            if (res) {
                const courses = res.courses || res.data || [];
                dispatch(setCourses(courses));
                return courses;
            }
            throw new Error("No enrolled courses found");
        } catch (error) {
            dispatch(setLoading(false));
            const errorMsg = error?.response?.data?.detail || error?.detail || "Failed to fetch enrolled courses";
            toast.error(errorMsg);
            throw error;
        }
    }
);