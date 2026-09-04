// app/store/slices/common/commonSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    message: null,
    messageType: "info",
    uploadedImages: [],
    currentUpload: null,
    uploadLoading: false,
    uploadProgress: 0,
    uploadError: null,
    deleteLoading: false,
};

const commonSlice = createSlice({
    name: "common",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setMessage: (state, action) => {
            state.message = action.payload.message;
            state.messageType = action.payload.type || "info";
        },
        clearMessage: (state) => {
            state.message = null;
            state.messageType = "info";
        },
        // Image upload reducers
        setUploadLoading: (state, action) => {
            state.uploadLoading = action.payload;
        },
        setUploadProgress: (state, action) => {
            state.uploadProgress = action.payload;
        },
        setUploadError: (state, action) => {
            state.uploadError = action.payload;
        },
        clearUploadError: (state) => {
            state.uploadError = null;
        },
        addUploadedImage: (state, action) => {
            state.uploadedImages.push(action.payload);
            state.currentUpload = action.payload;
        },
        removeUploadedImage: (state, action) => {
            state.uploadedImages = state.uploadedImages.filter(
                (img) => img.id !== action.payload
            );
            if (state.currentUpload?.id === action.payload) {
                state.currentUpload = null;
            }
        },
        clearUploadedImages: (state) => {
            state.uploadedImages = [];
            state.currentUpload = null;
        },
        setDeleteLoading: (state, action) => {
            state.deleteLoading = action.payload;
        },
        resetUploadState: (state) => {
            state.uploadLoading = false;
            state.uploadProgress = 0;
            state.uploadError = null;
        },
    },
});

export const {
    setLoading,
    setMessage,
    clearMessage,
    setUploadLoading,
    setUploadProgress,
    setUploadError,
    clearUploadError,
    addUploadedImage,
    removeUploadedImage,
    clearUploadedImages,
    setDeleteLoading,
    resetUploadState, } = commonSlice.actions;
export default commonSlice.reducer;