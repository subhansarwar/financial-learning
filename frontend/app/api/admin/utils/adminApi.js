// app/api/admin/utils/adminApi.js

const getToken = () => {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem("fl_admin") || "";
};

const fetchApi = async (endpoint, options = {}) => {
    const token = getToken();
    const response = await fetch(`/api/admin/${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
    });

    if (response.status === 401) {
        sessionStorage.removeItem("fl_admin");
        throw new Error("Unauthorized");
    }

    return response;
};

export const adminApi = {
    getKeys: async () => {
        const response = await fetchApi("keys");
        if (!response.ok) throw new Error("Failed to fetch keys");
        const data = await response.json();
        return data.keys || [];
    },

    getCourse: async (slug) => {
        const response = await fetch(`/api/content/course:${slug}`);
        if (!response.ok) throw new Error("Course not found");
        return response.json();
    },

    saveCourse: async (course) => {
        const response = await fetchApi("save", {
            method: "POST",
            body: JSON.stringify({ key: `course:${course.slug}`, data: course }),
        });
        if (!response.ok) throw new Error("Failed to save course");
        return response.json();
    },

    deleteCourse: async (slug) => {
        const response = await fetchApi("delete", {
            method: "POST",
            body: JSON.stringify({ key: `course:${slug}` }),
        });
        if (!response.ok) throw new Error("Failed to delete course");
        return response.json();
    },

    saveTopics: async (topics) => {
        const response = await fetchApi("save", {
            method: "POST",
            body: JSON.stringify({ key: "topics", data: topics }),
        });
        if (!response.ok) throw new Error("Failed to save topics");
        return response.json();
    },

    saveEsg: async (esgData) => {
        const response = await fetchApi("save", {
            method: "POST",
            body: JSON.stringify({ key: "esg", data: esgData }),
        });
        if (!response.ok) throw new Error("Failed to save ESG data");
        return response.json();
    },
};