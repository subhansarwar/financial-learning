// app/store/admin/monitoring/monitoringSlice.js
import { createSlice } from "@reduxjs/toolkit";

const STORAGE_PREFIX = "monitoring_cache_";
const RESOURCES = ["students", "enrollments", "activity", "completions"];

const isBrowser = typeof window !== "undefined";

const readCache = (resource) => {
    if (!isBrowser) return null;
    try {
        const raw = window.localStorage.getItem(STORAGE_PREFIX + resource);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

const writeCache = (resource, payload) => {
    if (!isBrowser) return;
    try {
        window.localStorage.setItem(STORAGE_PREFIX + resource, JSON.stringify(payload));
    } catch {
        // storage full / unavailable — fail silently
    }
};

const emptyResource = (resource) => {
    const cached = readCache(resource);
    return {
        items: cached?.items ?? [],
        total: cached?.total ?? 0,
        skip: cached?.skip ?? 0,
        limit: cached?.limit ?? 50,
        lastUpdated: cached?.lastUpdated ?? null,
        loading: false,
        error: null,
    };
};

const initialState = RESOURCES.reduce((acc, r) => {
    acc[r] = emptyResource(r);
    return acc;
}, {});

const monitoringSlice = createSlice({
    name: "monitoring",
    initialState,
    reducers: {
        // Set pagination
        setPage(state, action) {
            const { resource, skip, limit } = action.payload;
            if (!state[resource]) return;
            state[resource].skip = skip;
            if (limit !== undefined) state[resource].limit = limit;
        },

        // Clear error
        clearMonitoringError(state, action) {
            const { resource } = action.payload || {};
            if (resource && state[resource]) {
                state[resource].error = null;
            } else {
                // Clear all errors if no resource specified
                RESOURCES.forEach((r) => {
                    if (state[r]) state[r].error = null;
                });
            }
        },

        // Hydrate from cache
        hydrateFromCache(state) {
            RESOURCES.forEach((r) => {
                const cached = readCache(r);
                if (cached) {
                    state[r].items = cached.items ?? [];
                    state[r].total = cached.total ?? 0;
                    state[r].skip = cached.skip ?? state[r].skip;
                    state[r].limit = cached.limit ?? state[r].limit;
                    state[r].lastUpdated = cached.lastUpdated ?? null;
                }
            });
        },

        // ============ STUDENTS REDUCERS ============
        setStudentsLoading(state, action) {
            state.students.loading = action.payload;
        },
        setStudents(state, action) {
            const { items, total, skip, limit } = action.payload;
            state.students.items = items;
            state.students.total = total;
            state.students.skip = skip || state.students.skip;
            state.students.limit = limit || state.students.limit;
            state.students.lastUpdated = Date.now();
            state.students.error = null;
            writeCache("students", {
                items,
                total,
                skip: skip || state.students.skip,
                limit: limit || state.students.limit,
                lastUpdated: state.students.lastUpdated,
            });
        },
        setStudentsError(state, action) {
            state.students.error = action.payload;
            state.students.loading = false;
        },

        // ============ ENROLLMENTS REDUCERS ============
        setEnrollmentsLoading(state, action) {
            state.enrollments.loading = action.payload;
        },
        setEnrollments(state, action) {
            const { items, total, skip, limit } = action.payload;
            state.enrollments.items = items;
            state.enrollments.total = total;
            state.enrollments.skip = skip || state.enrollments.skip;
            state.enrollments.limit = limit || state.enrollments.limit;
            state.enrollments.lastUpdated = Date.now();
            state.enrollments.error = null;
            writeCache("enrollments", {
                items,
                total,
                skip: skip || state.enrollments.skip,
                limit: limit || state.enrollments.limit,
                lastUpdated: state.enrollments.lastUpdated,
            });
        },
        setEnrollmentsError(state, action) {
            state.enrollments.error = action.payload;
            state.enrollments.loading = false;
        },

        // ============ ACTIVITY REDUCERS ============
        setActivityLoading(state, action) {
            state.activity.loading = action.payload;
        },
        setActivity(state, action) {
            const { items, total, skip, limit } = action.payload;
            state.activity.items = items;
            state.activity.total = total;
            state.activity.skip = skip || state.activity.skip;
            state.activity.limit = limit || state.activity.limit;
            state.activity.lastUpdated = Date.now();
            state.activity.error = null;
            writeCache("activity", {
                items,
                total,
                skip: skip || state.activity.skip,
                limit: limit || state.activity.limit,
                lastUpdated: state.activity.lastUpdated,
            });
        },
        setActivityError(state, action) {
            state.activity.error = action.payload;
            state.activity.loading = false;
        },

        // ============ COMPLETIONS REDUCERS ============
        setCompletionsLoading(state, action) {
            state.completions.loading = action.payload;
        },
        setCompletions(state, action) {
            const { items, total, skip, limit } = action.payload;
            state.completions.items = items;
            state.completions.total = total;
            state.completions.skip = skip || state.completions.skip;
            state.completions.limit = limit || state.completions.limit;
            state.completions.lastUpdated = Date.now();
            state.completions.error = null;
            writeCache("completions", {
                items,
                total,
                skip: skip || state.completions.skip,
                limit: limit || state.completions.limit,
                lastUpdated: state.completions.lastUpdated,
            });
        },
        setCompletionsError(state, action) {
            state.completions.error = action.payload;
            state.completions.loading = false;
        },

        // Reset all monitoring state
        resetMonitoringState() {
            return RESOURCES.reduce((acc, r) => {
                acc[r] = emptyResource(r);
                return acc;
            }, {});
        },
    },
});

export const {
    // Pagination & Cache
    setPage,
    clearMonitoringError,
    hydrateFromCache,

    // Students
    setStudentsLoading,
    setStudents,
    setStudentsError,

    // Enrollments
    setEnrollmentsLoading,
    setEnrollments,
    setEnrollmentsError,

    // Activity
    setActivityLoading,
    setActivity,
    setActivityError,

    // Completions
    setCompletionsLoading,
    setCompletions,
    setCompletionsError,

    // Reset
    resetMonitoringState,
} = monitoringSlice.actions;

export default monitoringSlice.reducer;