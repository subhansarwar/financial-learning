// app/store/api/apiClient.js
import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/";

// Create a single axios instance
const axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Flag to prevent multiple refresh requests
let isRefreshing = false;
let failedQueue = [];

// Process queued requests
const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Refresh token function - Fixed error handling
const refreshAccessToken = async () => {
    try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
            // No refresh token, just throw error
            // throw new Error("No refresh token available");
        }

        const response = await axios.post(`${baseUrl}v1/auth/refresh`, {
            refresh_token: refreshToken,
        });

        const { access_token, refresh_token } = response.data;

        if (access_token) {
            localStorage.setItem("auth_token", access_token);
            axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
        }
        if (refresh_token) {
            localStorage.setItem("refresh_token", refresh_token);
        }

        return access_token;
    } catch (error) {
        // Clear tokens on refresh failure
        localStorage.removeItem("auth_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("efp.user");
        delete axiosInstance.defaults.headers.common["Authorization"];

        // Don't redirect here, just throw error
        throw error;
    }
};

// Request interceptor - Add token to every request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle token refresh with better error handling
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // 🔥 Only handle 401 errors, not 422 validation errors
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newToken = await refreshAccessToken();
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                processQueue(null, newToken);
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                // 🔥 Don't redirect here, let the caller handle it
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // 🔥 Don't redirect on 422 or other errors
        // Only redirect if it's a 401 and we're not in the middle of a request
        if (error.response?.status === 401 && originalRequest._retry) {
            // Only redirect if not on login page already
            if (typeof window !== "undefined" && !window.location.pathname.includes('/login')) {
                localStorage.removeItem("auth_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("efp.user");
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

// API Call function
const apiCall = async ({ path, method = "get", body = null, token = null }) => {
    try {
        if (token) {
            axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }

        const response = await axiosInstance({
            method,
            url: path,
            data: body && method !== "get" && method !== "delete" ? body : undefined,
        });

        return response.data;
    } catch (error) {
        console.error("API Call Error:", error);

        if (error.response) {
            const errorData = error.response.data;
            const errorMessage = errorData?.message || errorData?.error || errorData?.detail || error.message;

            throw {
                message: errorMessage,
                status: error.response.status,
                data: errorData,
                response: error.response,
            };
        } else if (error.request) {
            throw {
                message: "No response from server. Please check your network connection.",
                request: error.request,
            };
        } else {
            throw {
                message: error.message || "Something went wrong",
                error: error,
            };
        }
    }
};

export default apiCall;