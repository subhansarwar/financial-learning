import { createAsyncThunk } from "@reduxjs/toolkit";
import apiCall from "../api/apiClient";
import {
    setSummary,
    setSummaryLoading,
    setSummaryError,
    setAgenda,
    setAgendaLoading,
    setAgendaError,
    setUpcomingTasks,
    setUpcomingTasksLoading,
    setUpcomingTasksError,
} from "./dashboardSlice";

export const SUMMARY_CACHE_PREFIX = "dashboard_summary_";
export const AGENDA_CACHE_PREFIX = "dashboard_agenda_";
export const TASKS_CACHE_PREFIX = "dashboard_tasks_";

// GET v1/dashboard/summary?period=daily|weekly|monthly
export const getDashboardSummary = createAsyncThunk(
    "dashboard/getSummary",
    async (period = "weekly", { dispatch }) => {
        try {
            dispatch(setSummaryLoading(true));
            dispatch(setSummaryError(null));

            const res = await apiCall({
                path: `v1/dashboard/summary?period=${period}`,
                method: "get",
            });

            dispatch(setSummary({ period, data: res }));
            dispatch(setSummaryLoading(false));

            if (typeof window !== "undefined") {
                localStorage.setItem(`${SUMMARY_CACHE_PREFIX}${period}`, JSON.stringify(res));
            }

            return res;
        } catch (error) {
            throw error;
        }
    }
);

// GET v1/dashboard/upcoming-tasks?limit=10&skip=0
export const getUpcomingTasks = createAsyncThunk(
    "dashboard/getUpcomingTasks",
    async ({ limit = 10, skip = 0 } = {}, { dispatch }) => {
        try {
            dispatch(setUpcomingTasksLoading(true));
            dispatch(setUpcomingTasksError(null));

            const res = await apiCall({
                path: `v1/dashboard/upcoming-tasks?limit=${limit}&skip=${skip}`,
                method: "get",
            });

            const payload = {
                tasks: res?.tasks || [],
                total: res?.total || 0,
            };

            dispatch(setUpcomingTasks(payload));
            dispatch(setUpcomingTasksLoading(false));

            if (typeof window !== "undefined") {
                localStorage.setItem(
                    `${TASKS_CACHE_PREFIX}${limit}_${skip}`,
                    JSON.stringify(payload)
                );
            }

            return payload;
        } catch (error) {
            throw error;
        }
    }
);

// GET v1/dashboard/upcoming-agenda?view=day|week|month
export const getUpcomingAgenda = createAsyncThunk(
    "dashboard/getUpcomingAgenda",
    async ({ view = "month", cacheKey } = {}, { dispatch }) => {
        try {
            dispatch(setAgendaLoading(true));
            dispatch(setAgendaError(null));

            const res = await apiCall({
                path: `v1/dashboard/upcoming-agenda?view=${view}`,
                method: "get",
            });

            const key = cacheKey || view;
            dispatch(setAgenda({ key, data: res }));
            dispatch(setAgendaLoading(false));

            if (typeof window !== "undefined") {
                localStorage.setItem(`${AGENDA_CACHE_PREFIX}${key}`, JSON.stringify(res));
            }

            return res;
        } catch (error) {
            throw error;
        }
    }
);