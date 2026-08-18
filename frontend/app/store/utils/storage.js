// app/store/utils/storage.js
export const StorageKeys = {
    AUTH_TOKEN: "auth_token",
    REFRESH_TOKEN: "refresh_token",
    SIGNUP_TOKEN: "signup_token",
    USER: "efp.user",
    FINLEARN: "finlearn.v1",
};

export const storage = {
    set: (key, value) => {
        if (typeof window !== "undefined") {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (error) {
                console.error("Storage set error:", error);
            }
        }
    },
    get: (key) => {
        if (typeof window !== "undefined") {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (error) {
                console.error("Storage get error:", error);
                return null;
            }
        }
        return null;
    },
    remove: (key) => {
        if (typeof window !== "undefined") {
            try {
                localStorage.removeItem(key);
            } catch (error) {
                console.error("Storage remove error:", error);
            }
        }
    },
    clear: () => {
        if (typeof window !== "undefined") {
            try {
                localStorage.clear();
            } catch (error) {
                console.error("Storage clear error:", error);
            }
        }
    },
};