// app/store/slices/user/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: null,
    refreshToken: null,
    signupToken: null,
    stats: {
        coursesCompleted: 0,
        lessonsCompleted: 0,
        quizzesPassed: 0,
        certificatesEarned: 0,
    },
    isAuthenticated: false,
    loading: false,
    error: null,
    initialized: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
            if (typeof window !== "undefined") {
                localStorage.setItem("auth_token", action.payload);
            }
        },
        setRefreshToken: (state, action) => {
            state.refreshToken = action.payload;
            if (typeof window !== "undefined") {
                localStorage.setItem("refresh_token", action.payload);
            }
        },
        setSignupToken: (state, action) => {
            state.signupToken = action.payload;
            if (typeof window !== "undefined") {
                localStorage.setItem("signup_token", action.payload);
            }
        },
        setStats: (state, action) => {
            state.stats = { ...state.stats, ...action.payload };
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setInitialized: (state, action) => {
            state.initialized = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.signupToken = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            if (typeof window !== "undefined") {
                localStorage.removeItem("auth_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("signup_token");
                localStorage.removeItem("efp.user");
                localStorage.removeItem("finlearn.v1");
                window.dispatchEvent(new Event("userUpdate"));
            }
        },
        resetUser: () => initialState,
    },
});

export const {
    setUser,
    setToken,
    setRefreshToken,
    setSignupToken,
    setStats,
    setLoading,
    setError,
    setInitialized,
    logout,
    resetUser,
} = userSlice.actions;

export default userSlice.reducer;