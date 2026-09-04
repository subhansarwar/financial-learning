import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    summary: {},
    summaryLoading: false,
    summaryError: null,

    agenda: {},
    agendaLoading: false,
    agendaError: null,

    upcomingTasks: [],
    upcomingTasksTotal: 0,
    upcomingTasksLoading: false,
    upcomingTasksError: null,
};

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        setSummary: (state, action) => {
            const { period, data } = action.payload;
            state.summary[period] = data;
        },
        setSummaryLoading: (state, action) => {
            state.summaryLoading = action.payload;
        },
        setSummaryError: (state, action) => {
            state.summaryError = action.payload;
        },

        setAgenda: (state, action) => {
            const { key, data } = action.payload;
            state.agenda[key] = data;
        },
        setAgendaLoading: (state, action) => {
            state.agendaLoading = action.payload;
        },
        setAgendaError: (state, action) => {
            state.agendaError = action.payload;
        },

        setUpcomingTasks: (state, action) => {
            state.upcomingTasks = action.payload.tasks;
            state.upcomingTasksTotal = action.payload.total;
        },
        setUpcomingTasksLoading: (state, action) => {
            state.upcomingTasksLoading = action.payload;
        },
        setUpcomingTasksError: (state, action) => {
            state.upcomingTasksError = action.payload;
        },

        resetDashboard: () => initialState,
    },
});

export const {
    setSummary,
    setSummaryLoading,
    setSummaryError,
    setAgenda,
    setAgendaLoading,
    setAgendaError,
    setUpcomingTasks,
    setUpcomingTasksLoading,
    setUpcomingTasksError,
    resetDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;