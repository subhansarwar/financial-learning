// app/store/admin/monitoring/monitoringThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import apiCall from "../../api/apiClient";
import {
    clearMonitoringError,
    setActivity,
    setActivityLoading,
    setCompletions,
    setCompletionsLoading,
    setEnrollments,
    setEnrollmentsLoading,
    setStudents,
    setStudentsLoading
} from "./monitoringSlice";

// ============ FETCH STUDENTS ============
export const fetchStudents = createAsyncThunk(
    "monitoring/fetchStudents",
    async ({ skip = 0, limit = 50 } = {}, { dispatch }) => {
        try {
            dispatch(setStudentsLoading(true));
            dispatch(clearMonitoringError({ resource: "students" }));

            const response = await apiCall({
                path: "v1/admin/monitoring/students",
                method: "get",
                params: { skip, limit },
            });

            dispatch(setStudents({
                items: response?.students || response?.items || [],
                total: response?.total || 0,
                skip: response?.skip || skip,
                limit: response?.limit || limit,
            }));

            return response;
        } catch (error) {
            throw error;
        }
    }
);

// ============ FETCH ENROLLMENTS ============
export const fetchEnrollments = createAsyncThunk(
    "monitoring/fetchEnrollments",
    async ({ skip = 0, limit = 50 } = {}, { dispatch }) => {
        try {
            dispatch(setEnrollmentsLoading(true));
            dispatch(clearMonitoringError({ resource: "enrollments" }));

            const response = await apiCall({
                path: "v1/admin/monitoring/enrollments",
                method: "get",
                params: { skip, limit },
            });

            dispatch(setEnrollments({
                items: response?.enrollments || response?.items || [],
                total: response?.total || 0,
                skip: response?.skip || skip,
                limit: response?.limit || limit,
            }));

            return response;
        } catch (error) {
            throw error;
        }
    }
);

// ============ FETCH ACTIVITY ============
export const fetchActivity = createAsyncThunk(
    "monitoring/fetchActivity",
    async ({ skip = 0, limit = 50 } = {}, { dispatch }) => {
        try {
            dispatch(setActivityLoading(true));
            dispatch(clearMonitoringError({ resource: "activity" }));

            const response = await apiCall({
                path: "v1/admin/monitoring/activity",
                method: "get",
                params: { skip, limit },
            });

            dispatch(setActivity({
                items: response?.activity || response?.items || [],
                total: response?.total || 0,
                skip: response?.skip || skip,
                limit: response?.limit || limit,
            }));

            return response;
        } catch (error) {
            throw error;
        }
    }
);

// ============ FETCH COMPLETIONS ============
export const fetchCompletions = createAsyncThunk(
    "monitoring/fetchCompletions",
    async ({ skip = 0, limit = 50 } = {}, { dispatch }) => {
        try {
            dispatch(setCompletionsLoading(true));
            dispatch(clearMonitoringError({ resource: "completions" }));

            const response = await apiCall({
                path: "v1/admin/monitoring/completions",
                method: "get",
                params: { skip, limit },
            });

            dispatch(setCompletions({
                items: response?.completions || response?.items || [],
                total: response?.total || 0,
                skip: response?.skip || skip,
                limit: response?.limit || limit,
            }));

            return response;
        } catch (error) {
            throw error;
        }
    }
);