// app/store/admin/adminCourses/adminCoursesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    courses: [],
    currentCourse: null,
    pagination: {
        skip: 0,
        limit: 50,
        total: 0,
    },
    loading: false,
    loadingDetail: false,
    loadingCreate: false,
    loadingUpdate: false,
    loadingDelete: false,
};

const adminCoursesSlice = createSlice({
    name: "adminCourses",
    initialState,
    reducers: {
        setCourses: (state, action) => {
            state.courses = action.payload;
        },
        setCurrentCourse: (state, action) => {
            state.currentCourse = action.payload;
        },
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setLoadingDetail: (state, action) => {
            state.loadingDetail = action.payload;
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
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentCourse: (state) => {
            state.currentCourse = null;
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
        resetAdminCoursesState: () => initialState,
    },
});

export const {
    setCourses,
    setCurrentCourse,
    setPagination,
    setLoading,
    setLoadingDetail,
    setLoadingCreate,
    setLoadingUpdate,
    setLoadingDelete,
    clearError,
    clearCurrentCourse,
    addCourse,
    updateCourseInList,
    removeCourse,
    resetAdminCoursesState,
} = adminCoursesSlice.actions;

export default adminCoursesSlice.reducer;