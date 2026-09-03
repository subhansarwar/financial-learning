// app/store/website/websiteCourseSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // Courses list
    courses: [],
    currentCourse: null,

    // Topics
    topics: [],

    // Pagination
    pagination: {
        skip: 0,
        limit: 50,
        total: 0,
    },

    // Filters
    filters: {
        topic: "",
        level: "",
        search: "",
    },

    // Loading states
    loading: false,
    loadingDetail: false,
    loadingTopics: false,

    // Errors
    error: null,
    errorDetail: null,
    errorTopics: null,
    //Certificate
    certificate: null,

};

const websiteCourseSlice = createSlice({
    name: "websiteCourse",
    initialState,
    reducers: {
        // Course list actions
        setCourses: (state, action) => {
            state.courses = action.payload;
        },

        setCurrentCourse: (state, action) => {
            state.currentCourse = action.payload;
        },

        setTopics: (state, action) => {
            state.topics = action.payload;
        },

        // Pagination actions
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },

        // Filter actions
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },

        setFilter: (state, action) => {
            const { key, value } = action.payload;
            state.filters[key] = value;
        },

        clearFilters: (state) => {
            state.filters = {
                topic: "",
                level: "",
                search: "",
            };
        },

        resetPagination: (state) => {
            state.pagination = {
                skip: 0,
                limit: 50,
                total: 0,
            };
        },

        // Loading actions
        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        setLoadingDetail: (state, action) => {
            state.loadingDetail = action.payload;
        },

        setLoadingTopics: (state, action) => {
            state.loadingTopics = action.payload;
        },

        // Error actions
        setError: (state, action) => {
            state.error = action.payload;
        },

        setErrorDetail: (state, action) => {
            state.errorDetail = action.payload;
        },

        setErrorTopics: (state, action) => {
            state.errorTopics = action.payload;
        },

        clearError: (state) => {
            state.error = null;
            state.errorDetail = null;
            state.errorTopics = null;
        },

        clearCurrentCourse: (state) => {
            state.currentCourse = null;
        },
        setCertificate: (state, action) => {
            state.certificate = action.payload;
        },

        clearCertificate: (state) => {
            state.certificate = null;
        },
        // Course list mutation actions
        addCourse: (state, action) => {
            state.courses = [action.payload, ...state.courses];
            state.pagination.total += 1;
        },

        updateCourseInList: (state, action) => {
            const index = state.courses.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.courses[index] = action.payload;
            }
        },

        removeCourse: (state, action) => {
            state.courses = state.courses.filter(c => c.id !== action.payload);
            state.pagination.total -= 1;
        },

        resetWebsiteCourseState: () => initialState,
    },
});

export const {
    setCourses,
    setCurrentCourse,
    setTopics,
    setPagination,
    setFilters,
    setFilter,
    clearFilters,
    resetPagination,
    setLoading,
    setLoadingDetail,
    setLoadingTopics,
    setError,
    setErrorDetail,
    setErrorTopics,
    clearError,
    clearCurrentCourse,
    addCourse,
    updateCourseInList,
    removeCourse,
    resetWebsiteCourseState,
    setCertificate,
    clearCertificate,
} = websiteCourseSlice.actions;

export default websiteCourseSlice.reducer;