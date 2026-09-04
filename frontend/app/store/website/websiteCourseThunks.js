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
    setTopics,
    setCertificate,
    clearCertificate,
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

            // 🔥 IMPORTANT: Use 'name' instead of 'search' for API
            if (search) params.append("name", search);
            if (topic) params.append("topic", topic);
            if (level) params.append("level", level);

            const res = await apiCall({
                path: `v1/admin/courses/all?${params.toString()}`,
                method: "get",
            });

            console.log('✅ API Response:', res);
            console.log('✅ API URL:', `v1/admin/courses/all?${params.toString()}`);

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

                console.log('✅ Processed courses:', courses);
                console.log('✅ Total:', total);

                dispatch(setCourses(courses));
                dispatch(setPagination({ skip, limit, total }));
                dispatch(setFilters({ topic, level, search }));

                return { courses, total, skip, limit, topic, level, search };
            }
            throw new Error("No courses found");
        } catch (error) {
            dispatch(setLoading(false));
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

            console.log('🔵 Fetching course with slug:', slug);

            const res = await apiCall({
                path: `v1/admin/courses/read/${slug}`,
                method: "get",
            });

            console.log('🟢 Course API Response:', res);

            dispatch(setLoadingDetail(false));

            if (res) {
                const course = res.course || res.data || res;
                console.log('🟢 Processed course:', course);
                dispatch(setCurrentCourse(course));
                return course;
            }
            throw new Error("Course not found");
        } catch (error) {
            dispatch(setLoadingDetail(false));
            const errorMsg = error?.response?.data?.detail ||
                error?.detail ||
                error?.message ||
                "Failed to fetch course. Please try again.";
            toast.error(errorMsg);
            throw error;
        }
    }
);


// ============================================
// COURSE ENROLLMENT (FIXED ROUTE)
// ============================================

// Enroll in a course
export const enrollInCourse = createAsyncThunk(
    "websiteCourse/enrollInCourse",
    async (courseId, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            console.log('🔵 Enrolling in course:', courseId);

            // CORRECT ROUTE: v1/courses/{courseId}/enroll
            const res = await apiCall({
                path: `v1/courses/${courseId}/enroll`,
                method: "post",
            });

            console.log('🟢 Enrollment Response:', res);

            dispatch(setLoading(false));
            toast.success("Successfully enrolled in course!");

            return res;
        } catch (error) {
            dispatch(setLoading(false));
            const errorMsg = error?.response?.data?.detail ||
                error?.detail ||
                error?.message ||
                "Failed to enroll in course. Please try again.";
            toast.error(errorMsg);
            throw error;
        }
    }
);

// ============================================
// LESSON COMPLETION (FIXED)
// ============================================

// Complete a lesson
export const completeLesson = createAsyncThunk(
    "websiteCourse/completeLesson",
    async (lessonId, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            console.log('🔵 Completing lesson:', lessonId);

            // CORRECT ROUTE: v1/courses/lessons/{lessonId}/complete
            const res = await apiCall({
                path: `v1/courses/lessons/${lessonId}/complete`,
                method: "post",
                token: true,
            });

            console.log('🟢 Lesson Completion Response:', res);
            if (res) {
                dispatch(setLoading(false));
                toast.success("Lesson completed!");
                return { lessonId, progress: res };
            }

        } catch (error) {
            dispatch(setLoading(false));
            // const errorMsg = error?.response?.data?.detail ||
            //     error?.detail ||
            //     error?.message ||
            //     "Failed to complete lesson. Please try again.";
            // toast.error(errorMsg);
            throw error;
        }
    }
);

// Get course progress
export const getCourseProgress = createAsyncThunk(
    "websiteCourse/getCourseProgress",
    async (courseId, { dispatch }) => {
        try {
            dispatch(setLoadingDetail(true));
            dispatch(clearError());

            console.log('🔵 Fetching progress for course:', courseId);

            const res = await apiCall({
                path: `v1/courses/${courseId}/progress`,
                method: "get",
            });

            console.log('🟢 Progress Response:', res);

            dispatch(setLoadingDetail(false));
            return res;
        } catch (error) {
            dispatch(setLoadingDetail(false));
            const errorMsg = error?.response?.data?.detail ||
                error?.detail ||
                error?.message ||
                "Failed to fetch course progress";
            toast.error(errorMsg);
            throw error;
        }
    }
);

// ============================================
// HELPER FUNCTIONS
// ============================================

const extractTopicsFromCourses = (courses) => {
    if (!courses || !Array.isArray(courses) || courses.length === 0) {
        return [];
    }

    const topicMap = new Map();

    courses.forEach(course => {
        if (course.topic) {
            let topicId, topicName;

            if (typeof course.topic === 'object' && course.topic !== null) {
                topicId = course.topic.id || course.topic._id;
                topicName = course.topic.name || course.topic.title;
            } else if (typeof course.topic === 'string') {
                topicId = course.topic;
                topicName = course.topicName || course.topic;
            }

            if (topicId && !topicMap.has(topicId)) {
                topicMap.set(topicId, {
                    id: topicId,
                    name: topicName || topicId,
                    icon: course.topic?.icon || '📚',
                    hue: course.topic?.hue || 160
                });
            }
        }
    });

    return Array.from(topicMap.values());
};

// Get all topics
export const getAllTopics = createAsyncThunk(
    "websiteCourse/getAllTopics",
    async (_, { dispatch }) => {
        try {
            dispatch(setLoadingTopics(true));
            dispatch(clearError());

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

// Update lesson progress (legacy - keep for compatibility)
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

// ============================================
// QUIZ SUBMISSION
// ============================================

// Submit quiz answers
export const submitQuiz = createAsyncThunk(
    "websiteCourse/submitQuiz",
    async ({ lessonId, answers }, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            console.log('🔵 Submitting quiz for lesson:', lessonId);
            console.log('📝 Quiz answers:', answers);

            const res = await apiCall({
                path: `v1/courses/lessons/${lessonId}/quiz/submit`,
                method: "post",
                body: { answers },
            });

            console.log('🟢 Quiz Submission Response:', res);

            dispatch(setLoading(false));

            // If quiz passed, also call complete lesson
            if (res?.passed) {
                toast.success(`Quiz passed! Score: ${res.score_pct}%`);
                // Optionally call completeLesson here if not already done
            } else {
                toast.error(`Quiz failed! Score: ${res.score_pct}%. Need ${res.pass_pct}% to pass.`);
            }

            return res;
        } catch (error) {
            dispatch(setLoading(false));
            // const errorMsg = error?.response?.data?.detail ||
            //     error?.detail ||
            //     error?.message ||
            //     "Failed to submit quiz. Please try again.";
            // toast.error(errorMsg);
            throw error;
        }
    }
);

// Get quiz attempts for a lesson
export const getQuizAttempts = createAsyncThunk(
    "websiteCourse/getQuizAttempts",
    async (lessonId, { dispatch }) => {
        try {
            dispatch(setLoadingDetail(true));
            dispatch(clearError());

            console.log('🔵 Fetching quiz attempts for lesson:', lessonId);

            const res = await apiCall({
                path: `v1/courses/lessons/${lessonId}/quiz/attempts`,
                method: "get",
            });

            console.log('🟢 Quiz Attempts Response:', res);

            dispatch(setLoadingDetail(false));
            return res;
        } catch (error) {
            dispatch(setLoadingDetail(false));
            // const errorMsg = error?.response?.data?.detail ||
            //     error?.detail ||
            //     error?.message ||
            //     "Failed to fetch quiz attempts";
            // toast.error(errorMsg);
            throw error;
        }
    }
);

// Get course quiz results
export const getCourseQuizResults = createAsyncThunk(
    "websiteCourse/getCourseQuizResults",
    async (courseId, { dispatch }) => {
        try {
            dispatch(setLoadingDetail(true));
            dispatch(clearError());

            console.log('🔵 Fetching quiz results for course:', courseId);

            const res = await apiCall({
                path: `v1/courses/${courseId}/quiz-results`,
                method: "get",
            });

            console.log('🟢 Course Quiz Results Response:', res);

            dispatch(setLoadingDetail(false));
            if (res) {
                dispatch(setCertificate(res));
                return res;
            }
            return res;
        } catch (error) {
            dispatch(setLoadingDetail(false));
            // const errorMsg = error?.response?.data?.detail ||
            //     error?.detail ||
            //     error?.message ||
            //     "Failed to fetch quiz results";
            // toast.error(errorMsg);
            throw error;
        }
    }
);


// ============================================
// CERTIFICATE
// ============================================

// Get certificate by course ID
export const getCertificate = createAsyncThunk(
    "websiteCourse/getCertificate",
    async (courseId, { dispatch }) => {
        try {
            dispatch(setLoadingDetail(true));
            dispatch(clearError());

            console.log('🔵 Fetching certificate for course:', courseId);

            const res = await apiCall({
                path: `v1/certificates/read/${courseId}`,
                method: "get",
            });

            console.log('🟢 Certificate Response:', res);

            dispatch(setLoadingDetail(false));

            if (res) {
                return res;
            }
            throw new Error("Certificate not found");
        } catch (error) {
            dispatch(setLoadingDetail(false));
            // console.error('❌ Certificate fetch error:', error);
            // dispatch(setLoadingDetail(false));
            // const errorMsg = error?.response?.data?.detail ||
            //     error?.detail ||
            //     error?.message ||
            //     "Failed to fetch certificate";
            // dispatch(setErrorDetail(errorMsg));
            // toast.error(errorMsg);
            throw error;
        }
    }
);

// Download certificate (open PDF in new tab)
export const downloadCertificate = createAsyncThunk(
    "websiteCourse/downloadCertificate",
    async (pdfUrl, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            console.log('Downloading certificate from:', pdfUrl);

            if (!pdfUrl) {
                throw new Error("PDF URL not available");
            }

            // Open PDF in new tab for download
            window.open(pdfUrl, '_blank');

            dispatch(setLoading(false));
            toast.success("Certificate downloaded successfully!");
            return pdfUrl;
        } catch (error) {
            // console.error('❌ Certificate download error:', error);
            // dispatch(setLoading(false));
            // const errorMsg = error?.message || "Failed to download certificate";
            // toast.error(errorMsg);
            throw error;
        }
    }
);