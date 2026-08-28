// app/store/slices/user/userThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import apiCall from "../../api/apiClient";
import {
    setUser,
    setToken,
    setRefreshToken,
    setSignupToken,
    setStats,
    setLoading,
    setError,
    clearError,
    setInitialized,
    logout,
} from "./userSlice";

export const getUserProfile = createAsyncThunk(
    "user/getProfile",
    async (_, { dispatch, getState }) => {
        try {
            const res = await apiCall({
                path: "v1/users/me",
                method: "get",
            });

            console.log("User Profile Response:", res); // Debug log

            // Check if response has user data
            if (res?.is_verified) {
                const userData = res;
                dispatch(setUser(userData));
                if (typeof window !== "undefined") {
                    localStorage.setItem("efp.user", JSON.stringify(userData));
                }
                return userData;
            } else {
                // If no user data in response, use email from state
                const state = getState();
                const userEmail = state?.email || state.user?.email;
                if (userEmail) {
                    const userData = { email: userEmail };
                    dispatch(setUser(userData));
                    if (typeof window !== "undefined") {
                        localStorage.setItem("efp.user", JSON.stringify(userData));
                    }
                    return userData;
                }
                throw new Error("No user data received");
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            // Don't throw error, just return null so login still works
            return null;
        }
    }
);

// ============================================
// AUTH ACTIONS
// ============================================

// 1. Login Action (Email/Password)
export const loginUser = createAsyncThunk(
    "user/login",
    async ({ email, password }, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            const res = await apiCall({
                path: "v1/auth/login",
                method: "post",
                body: { email, password },
            });

            dispatch(setLoading(false));

            if (res?.access_token) {
                await dispatch(getUserProfile());
                // Store tokens if present
                if (res.access_token) {
                    dispatch(setToken(res.access_token));
                }
                if (res.refresh_token) {
                    dispatch(setRefreshToken(res.refresh_token));
                }

                dispatch(setInitialized(true));
                toast.success('Login successful!');
                return res;
            }
        } catch (error) {
            console.log('error ====>', error?.response?.data?.detail)
            dispatch(setLoading(false));
            toast.error(error?.response?.data?.detail);
            throw error;
        }
    }
);

// 2. Google Login Action
export const googleLogin = createAsyncThunk(
    "user/googleLogin",
    async (idToken, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            // Send id_token to backend
            const res = await apiCall({
                path: "/auth/google",
                method: "post",
                body: { id_token: idToken },
            });

            dispatch(setLoading(false));

            if (res?.success === true && res?.data) {
                // Store user data
                dispatch(setUser(res.data.user || res.data));

                // Store tokens if present
                if (res.data.access_token) {
                    dispatch(setToken(res.data.access_token));
                }
                if (res.data.refresh_token) {
                    dispatch(setRefreshToken(res.data.refresh_token));
                }

                dispatch(setInitialized(true));
                toast.success(res?.message || "Google login successful!");
                return res;
            } else {
                const errorMsg = res?.message || "Google login failed. Please try again.";
                dispatch(setError(errorMsg));
                toast.error(errorMsg);
                return res;
            }
        } catch (error) {
            dispatch(setLoading(false));
            const errorMsg = error?.message || "Google login failed. Please try again.";
            dispatch(setError(errorMsg));
            toast.error(errorMsg);
            throw error;
        }
    }
);

// 3. Register Action
export const registerUser = createAsyncThunk(
    "user/register",
    async (data, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            const res = await apiCall({
                path: "v1/auth/signup", // Adjust path as needed
                method: "post",
                body: data,
            });

            dispatch(setLoading(false));

            // Check if registration was successful
            if (res?.success === true || res?.message) {
                // Store signup token if present
                if (res?.data?.signupToken) {
                    dispatch(setSignupToken(res.data.signupToken));
                }

                // Store user data if present
                if (res?.data?.user) {
                    dispatch(setUser(res.data.user));
                }

                // Show success message
                toast.success(res?.message || "Account created successfully!");

                // Return the response for component use
                return {
                    success: true,
                    message: res.message,
                    email: res.email || data.email,
                    data: res.data,
                };
            }
        } catch (error) {
            dispatch(setLoading(false));
            const errorMsg = error?.message || "Something went wrong. Please try again.";
            dispatch(setError(errorMsg));
            toast.error(errorMsg);
            throw error;
        }
    }
);

// 2. Verify OTP Action (Updated)
export const verifyOTP = createAsyncThunk(
    "user/verifyOTP",
    async ({ email, code }, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            const res = await apiCall({
                path: "v1/auth/verify-otp",
                method: "post",
                body: { email, code },
            });

            dispatch(setLoading(false));

            // Check if response has tokens
            if (res?.access_token) {
                // Store tokens
                dispatch(setToken(res.access_token));
                await dispatch(getUserProfile());
                if (typeof window !== "undefined") {
                    localStorage.setItem("auth_token", res.access_token);
                }

                if (res?.refresh_token) {
                    dispatch(setRefreshToken(res.refresh_token));
                    if (typeof window !== "undefined") {
                        localStorage.setItem("refresh_token", res.refresh_token);
                    }
                }

                // Store token type and expiry if needed
                if (res?.token_type) {
                    localStorage.setItem("token_type", res.token_type);
                }
                if (res?.expires_in) {
                    localStorage.setItem("expires_in", res.expires_in.toString());
                }

                dispatch(setInitialized(true));

                return {
                    success: true,
                    access_token: res.access_token,
                    refresh_token: res.refresh_token,
                    token_type: res.token_type,
                    expires_in: res.expires_in,
                };
            }
        } catch (error) {
            console.log('OTP Verification Error:', error?.response?.data?.detail);
            dispatch(setLoading(false));

            let errorMsg = error?.response?.data?.detail || "OTP verification failed. Please try again.";
            toast.error(errorMsg);
            throw new Error(errorMsg);
        }
    }
);

// 3. Resend OTP Action (Updated)
export const resendOTP = createAsyncThunk(
    "user/resendOTP",
    async ({ email }, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            const res = await apiCall({
                path: "v1/auth/resend-otp",
                method: "post",
                body: { email },
            });

            dispatch(setLoading(false));

            // Check if response has message
            if (res?.message) {
                return {
                    success: true,
                    message: res.message,
                };
            }
        } catch (error) {
            console.error('Resend OTP Error:', error);
            dispatch(setLoading(false));
            toast.error(errorMsg);
            throw new Error(errorMsg);
        }
    }
);
// 4. Logout Action
export const logoutUser = createAsyncThunk(
    "user/logout",
    async (_, { dispatch }) => {
        try {
            dispatch(setLoading(true));

            // Get refresh token from localStorage
            const refreshToken = localStorage.getItem("refresh_token");
            const accessToken = localStorage.getItem("auth_token");

            // Call logout API with refresh token
            if (refreshToken) {
                try {
                    await apiCall({
                        path: "v1/auth/logout",
                        method: "post",
                        body: { refresh_token: refreshToken },
                        token: accessToken,
                    });
                } catch (apiError) {
                    console.log("Logout API error:", apiError);
                    // Continue with logout even if API fails
                }
            }

            // Clear all storage
            if (typeof window !== "undefined") {
                localStorage.removeItem("efp.user");
                localStorage.removeItem("auth_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("signup_token");
                localStorage.removeItem("token_type");
                localStorage.removeItem("expires_in");
            }

            // Clear Redux state
            dispatch(logout()); // Make sure you have this action in your slice

            dispatch(setLoading(false));
            toast.success("Logged out successfully");

            return { success: true };
        } catch (error) {
            console.error("Logout error:", error);

            // Even if API fails, clear local data
            if (typeof window !== "undefined") {
                localStorage.removeItem("efp.user");
                localStorage.removeItem("auth_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("signup_token");
                localStorage.removeItem("token_type");
                localStorage.removeItem("expires_in");
            }

            dispatch(logout());
            dispatch(setLoading(false));

            throw error;
        }
    }
);

// 5. Get Current User Action
export const getCurrentUser = createAsyncThunk(
    "user/getCurrentUser",
    async (_, { dispatch }) => {
        try {
            dispatch(setLoading(true));

            const token = localStorage.getItem("auth_token");
            const res = await apiCall({
                path: "/auth/me",
                method: "get",
                token: token,
            });

            dispatch(setLoading(false));

            if (res?.success === true && res?.data) {
                dispatch(setUser(res.data.user || res.data));
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

// 6. Refresh Token Action
export const refreshToken = createAsyncThunk(
    "user/refreshToken",
    async (_, { dispatch }) => {
        try {
            const refreshToken = localStorage.getItem("refresh_token");
            if (!refreshToken) {
                throw new Error("No refresh token available");
            }

            const res = await apiCall({
                path: "/auth/refresh",
                method: "post",
                body: { refresh_token: refreshToken },
            });

            if (res?.success === true && res?.data?.access_token) {
                dispatch(setToken(res.data.access_token));
                if (res.data.refresh_token) {
                    dispatch(setRefreshToken(res.data.refresh_token));
                }
                return res;
            } else {
                throw new Error("Token refresh failed");
            }
        } catch (error) {
            console.error("Token refresh error:", error);
            throw error;
        }
    }
);

// Forgot Password Action (Updated - Redirect to OTP)
export const forgotPassword = createAsyncThunk(
    "user/forgotPassword",
    async ({ email }, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            const res = await apiCall({
                path: "v1/auth/forgot-password",
                method: "post",
                body: { email },
            });

            console.log("Forgot Password Response:", res);

            dispatch(setLoading(false));

            // Check if response has message
            if (res?.message) {
                toast.success(res.message);
                return {
                    success: true,
                    message: res.message,
                    email: email,
                    redirectTo: "/reset-password?from=forgot-password",
                };
            } else {
                const errorMsg = res?.message || "Failed to send reset link. Please try again.";
                throw new Error(errorMsg);
            }
        } catch (error) {
            console.error("Forgot Password Error:", error);
            dispatch(setLoading(false));

            let errorMsg = "Something went wrong. Please try again.";
            toast.error(errorMsg);
            throw new Error(errorMsg);
        }
    }
);

// 8. Reset Password Action
export const resetPassword = createAsyncThunk(
    "user/resetPassword",
    async ({ email, code, new_password }, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            const res = await apiCall({
                path: "v1/auth/reset-password",
                method: "post",
                body: { email, code, new_password },
            });

            console.log("Reset Password Response:", res);

            dispatch(setLoading(false));

            // Check if response has message
            if (res?.message) {
                toast.success(res.message);
                return {
                    success: true,
                    message: res.message,
                };
            }
        } catch (error) {
            console.error("Reset Password Error:", error);
            dispatch(setLoading(false));

            let errorMsg = "Something went wrong. Please try again.";

            dispatch(setError(errorMsg));
            toast.error(errorMsg);
            throw new Error(errorMsg);
        }
    }
);

// 9. Verify Email Action
export const verifyEmail = createAsyncThunk(
    "user/verifyEmail",
    async (token, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

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
                const errorMsg = res?.message || "Verification failed. Please try again.";
                dispatch(setError(errorMsg));
                toast.error(errorMsg);
                return res;
            }
        } catch (error) {
            dispatch(setLoading(false));
            const errorMsg = error?.message || "Something went wrong. Please try again.";
            dispatch(setError(errorMsg));
            toast.error(errorMsg);
            throw error;
        }
    }
);

// 10. Update Profile Action
export const updateProfile = createAsyncThunk(
    "user/updateProfile",
    async (data, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            const token = localStorage.getItem("auth_token");
            const res = await apiCall({
                path: "/user/profile",
                method: "put",
                body: data,
                token: token,
            });

            dispatch(setLoading(false));

            if (res?.success === true) {
                dispatch(setUser(res?.data?.user));
                toast.success(res?.message || "Profile updated successfully!");
                return res;
            } else {
                const errorMsg = res?.message || "Failed to update profile.";
                dispatch(setError(errorMsg));
                toast.error(errorMsg);
                return res;
            }
        } catch (error) {
            dispatch(setLoading(false));
            const errorMsg = error?.message || "Something went wrong. Please try again.";
            dispatch(setError(errorMsg));
            // toast.error(errorMsg);
            throw error;
        }
    }
);

// 11. Change Password Action
export const changePassword = createAsyncThunk(
    "user/changePassword",
    async ({ currentPassword, newPassword }, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            const token = localStorage.getItem("auth_token");
            const res = await apiCall({
                path: "/user/change-password",
                method: "post",
                body: { current_password: currentPassword, new_password: newPassword },
                token: token,
            });

            dispatch(setLoading(false));

            if (res?.success === true) {
                toast.success(res?.message || "Password changed successfully!");
                return res;
            } else {
                const errorMsg = res?.message || "Failed to change password.";
                dispatch(setError(errorMsg));
                toast.error(errorMsg);
                return res;
            }
        } catch (error) {
            dispatch(setLoading(false));
            const errorMsg = error?.message || "Something went wrong. Please try again.";
            dispatch(setError(errorMsg));
            toast.error(errorMsg);
            throw error;
        }
    }
);