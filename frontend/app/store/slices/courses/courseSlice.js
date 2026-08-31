// app/store/slices/course/courseSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    courses: [],
    currentCourse: null,
    currentCourseProgress: null,
    enrolledCourses: [],
    enrolledStats: {
        total: 0,
        completed: 0,
        inProgress: 0,
        notStarted: 0,
    },
    pagination: {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
        skip: 0,
    },
    filters: {
        search: "",
        topic: "",
        level: "",
    },
    loading: false,
    loadingDetail: false,
    loadingEnroll: false,
    loadingProgress: false,
    loadingComplete: false,
    loadingCreate: false,
    loadingUpdate: false,
    loadingDelete: false,
    error: null,
};

const courseSlice = createSlice({
    name: "course",
    initialState,
    reducers: {
        setCourses: (state, action) => {
            state.courses = action.payload;
        },
        setCurrentCourse: (state, action) => {
            state.currentCourse = action.payload;
        },
        setCurrentCourseProgress: (state, action) => {
            state.currentCourseProgress = action.payload;
        },
        setEnrolledCourses: (state, action) => {
            state.enrolledCourses = action.payload;
        },
        setEnrolledStats: (state, action) => {
            state.enrolledStats = { ...state.enrolledStats, ...action.payload };
        },
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
            state.pagination.page = 1;
            state.pagination.skip = 0;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setLoadingDetail: (state, action) => {
            state.loadingDetail = action.payload;
        },
        setLoadingEnroll: (state, action) => {
            state.loadingEnroll = action.payload;
        },
        setLoadingProgress: (state, action) => {
            state.loadingProgress = action.payload;
        },
        setLoadingComplete: (state, action) => {
            state.loadingComplete = action.payload;
        },
        setLoadingCreate: (state, action) => {
            state.loadingCreate = action.payload;
        },
        setLoadingUpdate: (state, action) => {
            state.loadingUpdate = action.payload;
        },
        setLoadingDelete: (state, action) => {
            state.loadingDelete = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        updateEnrolledCourse: (state, action) => {
            const { courseId, progress } = action.payload;
            const index = state.enrolledCourses.findIndex(c => c.course_id === courseId);
            if (index !== -1) {
                state.enrolledCourses[index] = { ...state.enrolledCourses[index], ...progress };
            }
        },
        clearCurrentCourse: (state) => {
            state.currentCourse = null;
            state.currentCourseProgress = null;
        },
        addCourse: (state, action) => {
            state.courses = [action.payload, ...state.courses];
        },
        updateCourseInList: (state, action) => {
            const index = state.courses.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.courses[index] = action.payload;
            }
        },
        removeCourse: (state, action) => {
            state.courses = state.courses.filter(c => c.id !== action.payload);
        },
        resetCourseState: () => initialState,
    },
});

export const {
    setCourses,
    setCurrentCourse,
    setCurrentCourseProgress,
    setEnrolledCourses,
    setEnrolledStats,
    setPagination,
    setFilters,
    resetFilters,
    setLoading,
    setLoadingDetail,
    setLoadingEnroll,
    setLoadingProgress,
    setLoadingComplete,
    setLoadingCreate,
    setLoadingUpdate,
    setLoadingDelete,
    setError,
    clearError,
    updateEnrolledCourse,
    clearCurrentCourse,
    addCourse,
    updateCourseInList,
    removeCourse,
    resetCourseState,
} = courseSlice.actions;

export default courseSlice.reducer;