// lib/admin.js
// Finance Platform Demo admin panel

"use client";

import { toast, catalog, topics, data, esc } from "./app";

let token = "";
let overridden = new Set();
let currentCourse = null;
let currentKey = "";

const api = async (path, opts = {}) => {
    const r = await fetch("/api/" + path, {
        ...opts,
        headers: {
            "content-type": "application/json",
            ...(token ? { authorization: "Bearer " + token } : {}),
            ...(opts.headers || {}),
        },
    });
    if (r.status === 401) {
        logout();
        throw new Error("unauthorized");
    }
    return r;
};

export const logout = () => {
    token = "";
    if (typeof window !== "undefined") {
        sessionStorage.removeItem("fl_admin");
    }
};

export const login = async (password) => {
    try {
        const r = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ password }),
        });
        if (!r.ok) {
            if (r.status === 503) {
                throw new Error("Admin not configured on the server yet.");
            }
            throw new Error("Wrong password.");
        }
        const d = await r.json();
        token = d.token;
        if (typeof window !== "undefined") {
            sessionStorage.setItem("fl_admin", token);
        }
        return true;
    } catch (err) {
        toast(err.message);
        return false;
    }
};

export const isAdmin = () => {
    if (typeof window === "undefined") return false;
    const t = sessionStorage.getItem("fl_admin");
    return !!t;
};

export const getToken = () => {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem("fl_admin") || "";
};

export const refreshKeys = async () => {
    try {
        const r = await api("admin/keys");
        const d = await r.json();
        overridden = new Set(d.keys);
    } catch (_) {
        overridden = new Set();
    }
    return overridden;
};

export const saveCourse = async (course, courseKey, catalogData) => {
    // Validate
    if (!course.title || !course.slug) {
        toast("Title and slug are required.");
        return false;
    }
    if (!/^[a-z0-9-]+$/.test(course.slug)) {
        toast("Slug must be lowercase letters, numbers and hyphens only.");
        return false;
    }
    if (!course.modules.length) {
        toast("Add at least one module.");
        return false;
    }
    for (const m of course.modules) {
        if (!m.lessons.length) {
            toast(`Module "${m.title}" has no lessons.`);
            return false;
        }
        for (const l of m.lessons) {
            if (!l.title) {
                toast("A lesson is missing a title.");
                return false;
            }
            if (l.type === "quiz") {
                if (!l.quiz || !Array.isArray(l.quiz.questions) || !l.quiz.questions.length) {
                    toast(`Quiz lesson "${l.title}" has no valid questions.`);
                    return false;
                }
                for (const q of l.quiz.questions) {
                    if (!q.q || !Array.isArray(q.choices) || q.choices.length < 2 || typeof q.answer !== "number") {
                        toast(`Quiz lesson "${l.title}" has a malformed question.`);
                        return false;
                    }
                }
            }
            if (l.type === "video" && !l.videoUrl) {
                toast(`Video lesson "${l.title}" needs an embed URL.`);
                return false;
            }
        }
    }

    // Keep IDs stable
    course.modules.forEach((m, i) => {
        if (!m.id) m.id = "m" + (i + 1);
        m.lessons.forEach((l, j) => {
            if (!l.id) l.id = m.id + "l" + (j + 1);
        });
    });

    try {
        await api("admin/save", {
            method: "POST",
            body: JSON.stringify({ key: courseKey, data: course }),
        });

        // Sync catalog
        const lessons = course.modules.reduce((n, m) => n + m.lessons.length, 0);
        const entry = {
            slug: course.slug,
            title: course.title,
            tagline: course.tagline,
            topic: course.topic,
            level: course.level,
            lengthMin: course.lengthMin,
            lessons,
            modules: course.modules.length,
            instructor: { name: course.instructor.name, title: course.instructor.title },
            featured: !!course.featured,
            tags: course.tags || [],
        };
        const idx = catalogData.findIndex((x) => x.slug === course.slug);
        if (idx >= 0) {
            catalogData[idx] = { ...catalogData[idx], ...entry };
        } else {
            catalogData.push(entry);
        }
        await api("admin/save", {
            method: "POST",
            body: JSON.stringify({ key: "courses", data: catalogData }),
        });

        await refreshKeys();
        toast("Published live on the site now");
        return true;
    } catch (err) {
        // toast("Error saving: " + err.message);
        return false;
    }
};

export const deleteCourse = async (courseKey, slug, catalogData) => {
    try {
        await api("admin/delete", {
            method: "POST",
            body: JSON.stringify({ key: courseKey }),
        });
        const idx = catalogData.findIndex((x) => x.slug === slug);
        if (idx >= 0) {
            catalogData.splice(idx, 1);
            await api("admin/save", {
                method: "POST",
                body: JSON.stringify({ key: "courses", data: catalogData }),
            });
        }
        await refreshKeys();
        toast("Course deleted");
        return true;
    } catch (err) {
        toast("Error deleting: " + err.message);
        return false;
    }
};

export const resetCourse = async (courseKey) => {
    try {
        await api("admin/delete", {
            method: "POST",
            body: JSON.stringify({ key: courseKey }),
        });
        await refreshKeys();
        toast("Reset done reloading");
        if (typeof window !== "undefined") {
            setTimeout(() => window.location.reload(), 800);
        }
        return true;
    } catch (err) {
        toast("Error resetting: " + err.message);
        return false;
    }
};

export const saveTopics = async (topicsData) => {
    const ids = topicsData.map((t) => t.id);
    if (new Set(ids).size !== ids.length) {
        toast("Topic ids must be unique");
        return false;
    }
    try {
        await api("admin/save", {
            method: "POST",
            body: JSON.stringify({ key: "topics", data: topicsData }),
        });
        toast("Topics published ✓");
        return true;
    } catch (err) {
        toast("Error saving topics: " + err.message);
        return false;
    }
};

export const saveEsg = async (esgData) => {
    if (!Array.isArray(esgData.companies)) {
        toast("ESG data needs a companies array");
        return false;
    }
    try {
        await api("admin/save", {
            method: "POST",
            body: JSON.stringify({ key: "esg", data: esgData }),
        });
        toast("ESG data published ✓");
        return true;
    } catch (err) {
        toast("Error saving ESG: " + err.message);
        return false;
    }
};

export const admin = {
    login,
    logout,
    isAdmin,
    getToken,
    refreshKeys,
    saveCourse,
    deleteCourse,
    resetCourse,
    saveTopics,
    saveEsg,
    api,
};

export default admin;