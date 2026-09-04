import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    list: [],
    skip: 0,
    limit: 10,
    hasMore: false,
    listLoading: false,
    listError: null,

    selected: null,
    selectedLoading: false,
    selectedError: null,

    actionLoading: false,
    actionError: null,
};

const publicationsSlice = createSlice({
    name: "publications",
    initialState,
    reducers: {
        setPublications: (state, action) => {
            const { list, skip, limit } = action.payload;
            state.list = list;
            state.skip = skip;
            state.limit = limit;
            state.hasMore = list.length === limit; // agar full page bhari, aage aur data ho sakta hai
        },
        setPublicationsLoading: (state, action) => {
            state.listLoading = action.payload;
        },
        setPublicationsError: (state, action) => {
            state.listError = action.payload;
        },

        setSelectedPublication: (state, action) => {
            state.selected = action.payload;
        },
        setSelectedPublicationLoading: (state, action) => {
            state.selectedLoading = action.payload;
        },
        setSelectedPublicationError: (state, action) => {
            state.selectedError = action.payload;
        },

        updatePublicationInList: (state, action) => {
            const updated = action.payload;
            state.list = state.list.map((p) => (p.id === updated.id ? updated : p));
            if (state.selected?.id === updated.id) state.selected = updated;
        },
        removePublicationFromList: (state, action) => {
            const id = action.payload;
            state.list = state.list.filter((p) => p.id !== id);
            if (state.selected?.id === id) state.selected = null;
        },

        setActionLoading: (state, action) => {
            state.actionLoading = action.payload;
        },
        setActionError: (state, action) => {
            state.actionError = action.payload;
        },

        resetPublications: () => initialState,
    },
});

export const {
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
    resetPublications,
} = publicationsSlice.actions;

export default publicationsSlice.reducer;