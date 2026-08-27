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

// Refresh token function
const refreshAccessToken = async () => {
    try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
            throw new Error("No refresh token available");
        }

        const response = await axios.post(`${baseUrl}v1/auth/refresh`, {
            refresh_token: refreshToken,
        });

        const { access_token, refresh_token } = response.data;

        // Store new tokens
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
        throw error;
    }
};

// Request interceptor - Add token to every request
axiosInstance.interceptors.request.use(
    (config) => {
        // Get token from localStorage
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

// Response interceptor - Handle token refresh
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If already refreshing, queue this request
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
                // Redirect to login on refresh failure
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // If error is 401 and we already retried, redirect to login
        if (error.response?.status === 401) {
            if (typeof window !== "undefined") {
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
        // If token is provided in the call, use it
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

        // Extract error message
        if (error.response) {
            const errorData = error.response.data;
            const errorMessage = errorData?.message || errorData?.error || error.message;

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