// app/store/admin/caseStudy/caseStudiesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    caseStudies: [],
    currentCaseStudy: null,
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
    error: null,
};

const caseStudiesSlice = createSlice({
    name: "caseStudies",
    initialState,
    reducers: {
        setCaseStudies: (state, action) => {
            state.caseStudies = action.payload;
        },
        setCurrentCaseStudy: (state, action) => {
            state.currentCaseStudy = action.payload;
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
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentCaseStudy: (state) => {
            state.currentCaseStudy = null;
        },
        addCaseStudy: (state, action) => {
            state.caseStudies = [action.payload, ...state.caseStudies];
            state.pagination.total += 1;
        },
        updateCaseStudyInList: (state, action) => {
            const index = state.caseStudies.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.caseStudies[index] = action.payload;
            }
            if (state.currentCaseStudy?.id === action.payload.id) {
                state.currentCaseStudy = action.payload;
            }
        },
        removeCaseStudy: (state, action) => {
            state.caseStudies = state.caseStudies.filter(c => c.id !== action.payload);
            state.pagination.total -= 1;
            if (state.currentCaseStudy?.id === action.payload) {
                state.currentCaseStudy = null;
            }
        },
        resetCaseStudiesState: () => initialState,
    },
});

export const {
    setCaseStudies,
    setCurrentCaseStudy,
    setPagination,
    setLoading,
    setLoadingDetail,
    setLoadingCreate,
    setLoadingUpdate,
    setLoadingDelete,
    setError,
    clearError,
    clearCurrentCaseStudy,
    addCaseStudy,
    updateCaseStudyInList,
    removeCaseStudy,
    resetCaseStudiesState,
} = caseStudiesSlice.actions;

export default caseStudiesSlice.reducer;