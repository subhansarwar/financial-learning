import { createAsyncThunk } from "@reduxjs/toolkit";
import apiCall from "../../api/apiClient";
import {
    setPublications,
    setPublicationsLoading,
    setPublicationsError,
    setSelectedPublication,
    setSelectedPublicationLoading,
    setSelectedPublicationError,
    updatePublicationInList,
    removePublicationFromList,
    setActionLoading,
    setActionError,
} from "./publicationsSlice";

// GET v1/admin/publications/pending/all?skip=0&limit=50
export const getPendingPublications = createAsyncThunk(
    "publications/getPending",
    async ({ skip = 0, limit = 10 } = {}, { dispatch }) => {
        try {
            dispatch(setPublicationsLoading(true));
            dispatch(setPublicationsError(null));

            const res = await apiCall({
                path: `v1/admin/publications/pending/all?skip=${skip}&limit=${limit}`,
                method: "get",
            });

            const list = Array.isArray(res) ? res : [];
            dispatch(setPublications({ list, skip, limit }));
            return list;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setPublicationsLoading(false));
        }
    }
);

// GET v1/admin/publications/read/{id}
export const getPublicationById = createAsyncThunk(
    "publications/getById",
    async (id, { dispatch }) => {
        try {
            dispatch(setSelectedPublicationLoading(true));
            dispatch(setSelectedPublicationError(null));

            const res = await apiCall({
                path: `v1/admin/publications/read/${id}`,
                method: "get",
            });

            dispatch(setSelectedPublication(res));
            return res;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setSelectedPublicationLoading(false));
        }
    }
);

// POST v1/admin/publications/approve/{id}/approve  body: { notes }
export const approvePublication = createAsyncThunk(
    "publications/approve",
    async ({ id, notes = "" }, { dispatch }) => {
        try {
            dispatch(setActionLoading(true));
            dispatch(setActionError(null));

            const res = await apiCall({
                path: `v1/admin/publications/approve/${id}/approve`,
                method: "post",
                body: { notes },
            });

            dispatch(updatePublicationInList(res));
            return res;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setActionLoading(false));
        }
    }
);

// POST v1/admin/publications/reject/{id}/reject  body: { notes }
export const rejectPublication = createAsyncThunk(
    "publications/reject",
    async ({ id, notes = "" }, { dispatch }) => {
        try {
            dispatch(setActionLoading(true));
            dispatch(setActionError(null));

            const res = await apiCall({
                path: `v1/admin/publications/reject/${id}/reject`,
                method: "post",
                body: { notes },
            });

            dispatch(updatePublicationInList(res));
            return res;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setActionLoading(false));
        }
    }
);

// DELETE v1/admin/publications/delete/{id}  body: { notes }
export const deletePublication = createAsyncThunk(
    "publications/delete",
    async ({ id, notes = "" }, { dispatch }) => {
        try {
            dispatch(setActionLoading(true));
            dispatch(setActionError(null));

            const res = await apiCall({
                path: `v1/admin/publications/delete/${id}`,
                method: "delete",
                body: { notes },
            });

            dispatch(removePublicationFromList(id));
            return res;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setActionLoading(false));
        }
    }
);