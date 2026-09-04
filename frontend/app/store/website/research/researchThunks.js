// app/store/website/research/researchThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import apiCall from "../../api/apiClient";
import {
    setPublications,
    addPublication,
    updatePublicationFileUrl,
    setCurrentPublication,
    setLoading,
    setCreating,
    updatePublication,
    setError,
    clearError,
} from "./researchSlice";

export const RESEARCH_CACHE_KEY = "research_publications_cache";

// Get logged-in student's own publications
export const getMyPublications = createAsyncThunk(
    "research/getMyPublications",
    async (_, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            const res = await apiCall({
                path: "v1/publications/student/me",
                method: "get",
            });

            dispatch(setLoading(false));

            const publications = Array.isArray(res) ? res : res?.data || [];
            dispatch(setPublications(publications));

            if (typeof window !== "undefined") {
                localStorage.setItem(RESEARCH_CACHE_KEY, JSON.stringify(publications));
            }

            return publications;
        } catch (error) {
            dispatch(setLoading(false));
            // const errorMsg = error?.message || "Failed to fetch your publications";
            // dispatch(setError(errorMsg));
            throw error;
        }
    }
);

export const submitPublication = createAsyncThunk(
    "research/submitPublication",
    async (publicationId, { dispatch }) => {
        try {
            const res = await apiCall({
                path: `v1/publications/student/me/submit/${publicationId}/submit`,
                method: "post",
            });

            if (res?.id) {
                dispatch(updatePublication(res));
            }

            return res;
        } catch (error) {
            // Silent fail — user ko pata nahi chalna chahiye
            throw error;
        }
    }
);
// Create a new publication (Step 1)
export const createPublication = createAsyncThunk(
    "research/createPublication",
    async (data, { dispatch }) => {
        try {
            dispatch(setCreating(true));
            dispatch(clearError());

            const res = await apiCall({
                path: "v1/publications/student/create",
                method: "post",
                body: data,
            });

            dispatch(setCreating(false));

            if (res?.id) {
                return res;
            }
            throw new Error("Failed to create publication");
        } catch (error) {
            dispatch(setCreating(false));
            // const errorMsg = error?.message || "Failed to publish paper";
            // dispatch(setError(errorMsg));
            // toast.error(errorMsg);
            throw error;
        }
    }
);

// Upload PDF for a publication (Step 2 — silent, runs in background)
export const uploadPublicationFile = createAsyncThunk(
    "research/uploadPublicationFile",
    async ({ publicationId, file }, { dispatch }) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await apiCall({
                path: `v1/publications/student/me/upload/${publicationId}/file`,
                method: "post",
                body: formData,
            });

            if (res?.file_url) {
                dispatch(updatePublicationFileUrl({ id: publicationId, file_url: res.file_url }));
            }

            return res;
        } catch (error) {
            // Silent fail — user should not notice this step
            throw error;
        }
    }
);

// Read a single publication by publication_number
export const getPublicationByNumber = createAsyncThunk(
    "research/getPublicationByNumber",
    async (publicationNumber, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            const res = await apiCall({
                path: `v1/publications/catalog/read/${publicationNumber}`,
                method: "get",
            });

            dispatch(setLoading(false));
            dispatch(setCurrentPublication(res));
            return res;
        } catch (error) {
            dispatch(setLoading(false));
            // const errorMsg = error?.message || "Failed to fetch publication";
            // dispatch(setError(errorMsg));
            throw error;
        }
    }
);

// Download a publication's PDF
export const downloadPublication = createAsyncThunk(
    "research/downloadPublication",
    async (publicationNumber, { dispatch }) => {
        try {
            const res = await apiCall({
                path: `v1/publications/catalog/download/${publicationNumber}/download`,
                method: "get",
            });

            const fileUrl =
                res?.file_url || res?.url || (typeof res === "string" ? res : null);

            if (fileUrl && typeof window !== "undefined") {
                window.open(fileUrl, "_blank");
            } else {
                toast.error("Download link not available");
            }

            return res;
        } catch (error) {
            // toast.error("Failed to download paper");
            throw error;
        }
    }
);