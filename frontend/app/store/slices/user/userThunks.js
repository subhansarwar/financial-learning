// app/store/slices/user/userThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import apiCall from "../../api/apiClient";
import {
    setUser,
    setToken,
    setRefreshToken,
    setSignupToken,
    setPreferences,
    setStats,
    setLoading,
    setError,
    setInitialized,
    logout,
} from "./userSlice";

// ============================================
// AUTH ACTIONS
// ============================================

// 1. Register/Signup Action
export const registerUser = createAsyncThunk(
    "user/register",
    async (data, { dispatch }) => {
        try {
            dispatch(setLoading(true));

            const res = await apiCall({
                path: "/auth/signup",
                method: "post",
                body: data,
            });

            dispatch(setLoading(false));

            if (res?.success === true) {
                dispatch(setUser(res?.data?.user));
                dispatch(setSignupToken(res?.token));
                toast.success(res?.message || "Account created successfully!");
                return res;
            } else {
                toast.error(res?.message || "Signup failed. Please try again.");
                return res;
            }
        } catch (error) {
            dispatch(setLoading(false));
            toast.error(error?.message || "Something went wrong. Please try again.");
            throw error;
        }
    }
);

// 2. Login Action
export const loginUser = createAsyncThunk(
    "user/login",
    async ({ email, password }, { dispatch }) => {
        try {
            dispatch(setLoading(true));

            const res = await apiCall({
                path: "/auth/login",
                method: "post",
                body: { email, password },
            });

            dispatch(setLoading(false));

            if (res?.success === true) {
                dispatch(setUser(res?.data?.user));
                dispatch(setToken(res?.token));
                dispatch(setRefreshToken(res?.refreshToken));
                toast.success(res?.message || "Welcome back!");
                return res;
            } else {
                toast.error(res?.message || "Login failed. Please try again.");
                return res;
            }
        } catch (error) {
            dispatch(setLoading(false));
            toast.error(error?.message || "Something went wrong. Please try again.");
            throw error;
        }
    }
);

// 3. Logout Action
export const logoutUser = createAsyncThunk(
    "user/logout",
    async (_, { dispatch }) => {
        try {
            dispatch(setLoading(true));

            const res = await apiCall({
                path: "/auth/logout",
                method: "post",
            });

            dispatch(setLoading(false));
            dispatch(logout());

            if (res?.success === true) {
                toast.success(res?.message || "Logged out successfully");
            }
            return res;
        } catch (error) {
            dispatch(setLoading(false));
            dispatch(logout());
            toast.success("Logged out successfully");
            throw error;
        }
    }
);

// 4. Forgot Password Action
export const forgotPassword = createAsyncThunk(
    "user/forgotPassword",
    async (email, { dispatch }) => {
        try {
            dispatch(setLoading(true));

            const res = await apiCall({
                path: "/auth/forgot-password",
                method: "post",
                body: { email },
            });

            dispatch(setLoading(false));

            if (res?.success === true) {
                toast.success(res?.message || "Password reset link sent to your email!");
                return res;
            } else {
                toast.error(res?.message || "Failed to send reset link. Please try again.");
                return res;
            }
        } catch (error) {
            dispatch(setLoading(false));
            toast.error(error?.message || "Something went wrong. Please try again.");
            throw error;
        }
    }
);

// 5. Reset Password Action
export const resetPassword = createAsyncThunk(
    "user/resetPassword",
    async ({ token, newPassword }, { dispatch }) => {
        try {
            dispatch(setLoading(true));

            const res = await apiCall({
                path: "/auth/reset-password",
                method: "post",
                body: { token, newPassword },
            });

            dispatch(setLoading(false));

            if (res?.success === true) {
                toast.success(res?.message || "Password reset successfully!");
                return res;
            } else {
                toast.error(res?.message || "Failed to reset password. Please try again.");
                return res;
            }
        } catch (error) {
            dispatch(setLoading(false));
            toast.error(error?.message || "Something went wrong. Please try again.");
            throw error;
        }
    }
);

// 6. Verify Email Action
export const verifyEmail = createAsyncThunk(
    "user/verifyEmail",
    async (token, { dispatch }) => {
        try {
            dispatch(setLoading(true));

            const res = await apiCall({
                path: "/auth/verify-email",
                method: "post",
                body: { token },
            });

            dispatch(setLoading(false));

            if (res?.success === true) {
                toast.success(res?.message || "Email verified successfully!");
                return res;
            } else {
                toast.error(res?.message || "Verification failed. Please try again.");
                return res;
            }
        } catch (error) {
            dispatch(setLoading(false));
            toast.error(error?.message || "Something went wrong. Please try again.");
            throw error;
        }
    }
);

// 7. Get Current User Action
export const getCurrentUser = createAsyncThunk(
    "user/getCurrentUser",
    async (_, { dispatch }) => {
        try {
            dispatch(setLoading(true));

            const res = await apiCall({
                path: "/auth/me",
                method: "get",
            });

            dispatch(setLoading(false));

            if (res?.success === true) {
                dispatch(setUser(res?.data?.user));
                dispatch(setInitialized(true));
                return res;
            } else {
                dispatch(setInitialized(true));
                return res;
            }
        } catch (error) {
            dispatch(setLoading(false));
            dispatch(setInitialized(true));
            throw error;
        }
    }
);

// 8. Update Profile Action
export const updateProfile = createAsyncThunk(
    "user/updateProfile",
    async (data, { dispatch }) => {
        try {
            dispatch(setLoading(true));

            const res = await apiCall({
                path: "/user/profile",
                method: "put",
                body: data,
            });

            dispatch(setLoading(false));

            if (res?.success === true) {
                dispatch(setUser(res?.data?.user));
                toast.success(res?.message || "Profile updated successfully!");
                return res;
            } else {
                toast.error(res?.message || "Failed to update profile.");
                return res;
            }
        } catch (error) {
            dispatch(setLoading(false));
            toast.error(error?.message || "Something went wrong. Please try again.");
            throw error;
        }
    }
);

// 9. Change Password Action
export const changePassword = createAsyncThunk(
    "user/changePassword",
    async ({ currentPassword, newPassword }, { dispatch }) => {
        try {
            dispatch(setLoading(true));

            const res = await apiCall({
                path: "/user/change-password",
                method: "post",
                body: { currentPassword, newPassword },
            });

            dispatch(setLoading(false));

            if (res?.success === true) {
                toast.success(res?.message || "Password changed successfully!");
                return res;
            } else {
                toast.error(res?.message || "Failed to change password.");
                return res;
            }
        } catch (error) {
            dispatch(setLoading(false));
            toast.error(error?.message || "Something went wrong. Please try again.");
            throw error;
        }
    }
);