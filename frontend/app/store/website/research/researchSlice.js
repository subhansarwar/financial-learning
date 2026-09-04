// app/store/website/research/researchSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    publications: [],
    currentPublication: null,
    loading: false,
    creating: false,
    error: null,
};

const researchSlice = createSlice({
    name: "research",
    initialState,
    reducers: {
        setPublications: (state, action) => {
            state.publications = action.payload;
        },
        addPublication: (state, action) => {
            state.publications = [action.payload, ...state.publications];
        },
        updatePublicationFileUrl: (state, action) => {
            const { id, file_url } = action.payload;
            state.publications = state.publications.map((p) =>
                p.id === id ? { ...p, file_url } : p
            );
        },
        setCurrentPublication: (state, action) => {
            state.currentPublication = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setCreating: (state, action) => {
            state.creating = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        resetResearch: () => initialState,
    },
});

export const {
    setPublications,
    addPublication,
    updatePublicationFileUrl,
    setCurrentPublication,
    setLoading,
    setCreating,
    setError,
    clearError,
    resetResearch,
} = researchSlice.actions;

export default researchSlice.reducer;