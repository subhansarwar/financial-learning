// app/store/admin/caseStudy/caseStudiesThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import apiCall from "../../api/apiClient";
import {
    setLoading,
    setLoadingDetail,
    setLoadingCreate,
    setLoadingUpdate,
    setLoadingDelete,
    clearError,
    setError,
    setCaseStudies,
    setCurrentCaseStudy,
    addCaseStudy,
    updateCaseStudyInList,
    removeCaseStudy,
    setPagination,
} from "./caseStudiesSlice";

// Get all case studies with pagination
export const getAllCaseStudies = createAsyncThunk(
    "caseStudies/getAllCaseStudies",
    async ({ skip = 0, limit = 50 }, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            const res = await apiCall({
                path: "admin/case-studies",
                method: "get",
                params: { skip, limit },
            });

            dispatch(setLoading(false));

            if (res) {
                dispatch(setCaseStudies(res));
                dispatch(setPagination({ skip, limit, total: res?.length || 0 }));
                return res;
            }
            throw new Error("No case studies found");
        } catch (error) {
            dispatch(setLoading(false));
            const errorMsg = error?.response?.data?.detail || "Failed to fetch case studies. Please try again.";
            toast.error(errorMsg);
            throw error;
        }
    }
);

// Get single case study by ID
export const getCaseStudyById = createAsyncThunk(
    "caseStudies/getCaseStudyById",
    async (id, { dispatch }) => {
        try {
            dispatch(setLoadingDetail(true));
            dispatch(clearError());

            const res = await apiCall({
                path: `admin/case-studies/${id}`,
                method: "get",
            });

            dispatch(setLoadingDetail(false));

            if (res?.id) {
                dispatch(setCurrentCaseStudy(res));
                return res;
            }
            throw new Error("Case study not found");
        } catch (error) {
            dispatch(setLoadingDetail(false));
            const errorMsg = error?.response?.data?.detail || "Failed to fetch case study details";
            toast.error(errorMsg);
            throw error;
        }
    }
);

// Create case study
export const createCaseStudy = createAsyncThunk(
    "caseStudies/createCaseStudy",
    async (caseData, { dispatch }) => {
        try {
            dispatch(setLoadingCreate(true));
            dispatch(clearError());

            const res = await apiCall({
                path: "admin/case-studies",
                method: "post",
                body: caseData,
            });

            dispatch(setLoadingCreate(false));

            if (res?.id) {
                dispatch(addCaseStudy(res));
                toast.success("Case study created successfully!");
                return res;
            }
            throw new Error("Failed to create case study");
        } catch (error) {
            dispatch(setLoadingCreate(false));
            const errorMsg = error?.response?.data?.detail || "Failed to create case study. Please try again.";
            toast.error(errorMsg);
            throw error;
        }
    }
);

// Update case study
export const updateCaseStudy = createAsyncThunk(
    "caseStudies/updateCaseStudy",
    async ({ id, updateData }, { dispatch }) => {
        try {
            dispatch(setLoadingUpdate(true));
            dispatch(clearError());

            const res = await apiCall({
                path: `admin/case-studies/${id}`,
                method: "put",
                body: updateData,
            });

            dispatch(setLoadingUpdate(false));

            if (res?.id) {
                dispatch(updateCaseStudyInList(res));
                dispatch(setCurrentCaseStudy(res));
                toast.success("Case study updated successfully!");
                return res;
            }
            throw new Error("Failed to update case study");
        } catch (error) {
            dispatch(setLoadingUpdate(false));
            const errorMsg = error?.response?.data?.detail || "Failed to update case study. Please try again.";
            toast.error(errorMsg);
            throw error;
        }
    }
);

// Delete case study
export const deleteCaseStudy = createAsyncThunk(
    "caseStudies/deleteCaseStudy",
    async (id, { dispatch }) => {
        try {
            dispatch(setLoadingDelete(true));
            dispatch(clearError());

            const res = await apiCall({
                path: `admin/case-studies/${id}`,
                method: "delete",
            });

            dispatch(setLoadingDelete(false));

            if (res?.message === "Case study deleted") {
                dispatch(removeCaseStudy(id));
                toast.success("Case study deleted successfully!");
                return { id, data: res };
            }
            throw new Error("Failed to delete case study");
        } catch (error) {
            dispatch(setLoadingDelete(false));
            const errorMsg = error?.response?.data?.detail || "Failed to delete case study. Please try again.";
            toast.error(errorMsg);
            throw error;
        }
    }
);