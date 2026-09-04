// app/store/slices/common/commonThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import apiCall from "../../api/apiClient";
import {
    setUploadLoading,
    setUploadProgress,
    setUploadError,
    clearUploadError,
    addUploadedImage,
    removeUploadedImage,
    setDeleteLoading,
    resetUploadState,
} from "./commonSlice";

export const uploadImage = createAsyncThunk(
    "common/uploadImage",
    async ({ file, container = "website", title = "", alt_text = "" }, { dispatch }) => {
        try {
            dispatch(clearUploadError());
            dispatch(setUploadLoading(true));
            dispatch(setUploadProgress(0));

            // Create FormData
            const formData = new FormData();
            formData.append("file", file, file.name);
            formData.append("container", container);
            if (title) formData.append("title", title);
            if (alt_text) formData.append("alt_text", alt_text);

            // 🔥 DEBUG: Log FormData entries
            console.log("📦 FormData entries:");
            for (let pair of formData.entries()) {
                console.log("  ➜", pair[0], pair[1]);
            }

            dispatch(setUploadProgress(30));

            // ============ IMPORTANT: Content-Type MAT BHEJO ============
            const response = await apiCall({
                path: "v1/admin/media/images",
                method: "post",
                body: formData,
                // headers: { "Content-Type": "multipart/form-data" }, // <-- YEH HATAO!
            });

            console.log("✅ Upload response:", response);

            dispatch(setUploadProgress(100));

            if (response?.file_url) {
                dispatch(addUploadedImage(response));
                toast.success("Image uploaded successfully!");
                return response;
            }

            throw new Error("Failed to get image URL from server");
        } catch (error) {
            throw error;
        } finally {
            dispatch(setUploadLoading(false));
            setTimeout(() => {
                dispatch(resetUploadState());
            }, 3000);
        }
    }
);

// Delete image from media
export const deleteImage = createAsyncThunk(
    "common/deleteImage",
    async (imageId, { dispatch }) => {
        try {
            dispatch(setDeleteLoading(true));

            const response = await apiCall({
                path: `v1/admin/media/images/${imageId}`,
                method: "delete",
            });

            dispatch(removeUploadedImage(imageId));
            toast.success("Image deleted successfully!");
            return response;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setDeleteLoading(false));
        }
    }
);

// Get uploaded images
export const getUploadedImages = createAsyncThunk(
    "common/getUploadedImages",
    async ({ container = "website", skip = 0, limit = 50 }, { dispatch }) => {
        try {
            dispatch(setUploadLoading(false));

            const response = await apiCall({
                path: "v1/admin/media/images",
                method: "get",
                params: { container, skip, limit },
            });

            return response;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setUploadLoading(false));
        }
    }
);