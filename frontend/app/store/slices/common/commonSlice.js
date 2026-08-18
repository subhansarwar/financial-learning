// app/store/slices/common/commonSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    message: null,
    messageType: "info",
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
    },
});

export const { setLoading, setMessage, clearMessage } = commonSlice.actions;
export default commonSlice.reducer;