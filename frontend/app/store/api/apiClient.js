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

// Refresh token function - Silent fail on 422/error
const refreshAccessToken = async () => {
    try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
            // 🔥 Silent fail - no error thrown
            return null;
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
        // 🔥 Silent fail - clear tokens but don't throw error
        localStorage.removeItem("auth_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("efp.user");
        delete axiosInstance.defaults.headers.common["Authorization"];

        // 🔥 Return null instead of throwing error
        return null;
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

        // 🔥 Only handle 401 errors, ignore 422
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (token) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            return axiosInstance(originalRequest);
                        }
                        return Promise.reject(error);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newToken = await refreshAccessToken();
                if (newToken) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    processQueue(null, newToken);
                    return axiosInstance(originalRequest);
                } else {
                    processQueue(null, null);
                    return Promise.reject(error);
                }
            } catch (refreshError) {
                processQueue(refreshError, null);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // 🔥 Ignore 422 errors - don't show anything
        if (error.response?.status === 422) {
            // 🔥 Just return the error without any toast or console
            return Promise.reject(error);
        }

        // 🔥 Only redirect on 401 after retry
        if (error.response?.status === 401 && originalRequest._retry) {
            if (typeof window !== "undefined" && !window.location.pathname.includes('/login')) {
                localStorage.removeItem("auth_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("efp.user");
                // 🔥 Silent redirect - no toast
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
        // 🔥 Silent fail for 422 - no console error
        if (error.response?.status === 422) {
            // Return the error data without throwing
            return error.response.data;
        }

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