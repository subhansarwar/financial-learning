// app/store/api/apiClient.js
import toast from "react-hot-toast";

const apiCall = async ({ path, method = "get", body = null, token = null }) => {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

        const headers = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        // Get token from localStorage if not provided
        if (!token && typeof window !== "undefined") {
            const storedToken = localStorage.getItem("auth_token");
            if (storedToken) {
                headers["Authorization"] = `Bearer ${storedToken}`;
            }
        }

        const options = {
            method,
            headers,
        };

        if (body && method !== "get" && method !== "delete") {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(`${baseUrl}${path}`, options);

        // Check if response is JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            return data;
        }

        // If not JSON, return status
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return { success: true, status: response.status };
    } catch (error) {
        console.error("API Call Error:", error);
        throw error;
    }
};

export default apiCall;