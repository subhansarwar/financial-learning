// lib/app.js - Complete file with all exports

// "use client";

// ---------- Constants ----------
const USER_KEY = "efp.user";
const LS_KEY = "finlearn.v1";
const KEY_TO_PATH = {
    topics: "/data/topics.json",
    courses: "/data/courses.json",
    esg: "/data/esg.json",
    casestudies: "/data/caseStudies.json",
    statistics: "/data/statistics.json",
};

const cache = {};

// ---------- Auth ----------
export const auth = {
    user() {
        if (typeof window === "undefined") return null;
        try {
            const data = localStorage.getItem(USER_KEY);
            return data ? JSON.parse(data) : null;
        } catch (_) {
            return null;
        }
    },
    login(name, email) {
        if (typeof window === "undefined") return;
        localStorage.setItem(USER_KEY, JSON.stringify({
            name: String(name || "").trim(),
            email: String(email || "").trim(),
            at: Date.now()
        }));
    },
    logout() {
        if (typeof window === "undefined") return;
        localStorage.removeItem(USER_KEY);
    },
    require() {
        if (this.user()) return true;
        if (typeof window === "undefined") return false;
        const next = encodeURIComponent(window.location.pathname.split("/").pop() + window.location.search);
        window.location.href = "/login?next=" + next;
        return false;
    }
};

// ---------- Utils ----------
export const esc = (s) => {
    if (!s) return "";
    return String(s).replace(/[&<>"']/g, (c) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[c]));
};

export const fmtMin = (min) => {
    if (!min || min <= 0) return "—";
    const h = Math.floor(min / 60);
    const m = min % 60;
    if (h && m) return `${h}h ${m}m`;
    if (h) return `${h}h`;
    return `${m} min`;
};

export const initials = (name) => {
    if (!name) return "?";
    return name.split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();
};

export const qs = (k) => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get(k);
};

let toastTimer = null;
export const toast = (msg) => {
    if (typeof window === "undefined") return;
    let t = document.getElementById("flToast");
    if (!t) {
        t = document.createElement("div");
        t.id = "flToast";
        t.className = "toast";
        document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
};

// ---------- Mini Markdown ----------
export const md = (src) => {
    if (!src) return "";
    const inline = (t) => {
        return esc(t)
            .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
            .replace(/\*([^*]+)\*/g, "<em>$1</em>")
            .replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    };
    const lines = src.split("\n");
    let html = "";
    let list = null;
    const closeList = () => {
        if (list) { html += `</${list}>`; list = null; }
    };
    for (const raw of lines) {
        const line = raw.trimEnd();
        if (!line.trim()) { closeList(); continue; }
        let m;
        if ((m = line.match(/^###\s+(.*)/))) { closeList(); html += `<h3>${inline(m[1])}</h3>`; }
        else if ((m = line.match(/^##\s+(.*)/))) { closeList(); html += `<h2>${inline(m[1])}</h2>`; }
        else if ((m = line.match(/^#\s+(.*)/))) { closeList(); html += `<h2>${inline(m[1])}</h2>`; }
        else if ((m = line.match(/^>\s?(.*)/))) { closeList(); html += `<blockquote>${inline(m[1])}</blockquote>`; }
        else if ((m = line.match(/^[-•]\s+(.*)/))) { if (list !== "ul") { closeList(); html += "<ul>"; list = "ul"; } html += `<li>${inline(m[1])}</li>`; }
        else if ((m = line.match(/^\d+[.)]\s+(.*)/))) { if (list !== "ol") { closeList(); html += "<ol>"; list = "ol"; } html += `<li>${inline(m[1])}</li>`; }
        else { closeList(); html += `<p>${inline(line)}</p>`; }
    }
    closeList();
    return html;
};

// ---------- Data Layer ----------
export const data = async (key) => {
    // Return from cache if available
    if (cache[key]) return cache[key];

    // Special handling for course:slug
    let path;
    console.log('path before key ===>', path)
    if (key.startsWith("course:")) {
        const slug = key.replace("course:", "");
        path = `/data/courses/${slug}.json`;
        console.log('path before key ===>', slug)

    } else {
        path = KEY_TO_PATH[key];
        console.log('path before key ===>', path)

    }

    if (!path) {
        throw new Error(`Unknown data key: ${key}`);
    }

    try {
        const r = await fetch(path, { cache: "no-store" });
        if (r.ok) {
            const data = await r.json();
            cache[key] = data;
            return data;
        }
    } catch (err) {
        console.error(`Failed to fetch ${key} from ${path}:`, err);
    }

    // Try API route as fallback (for KV overrides)
    try {
        const r = await fetch(`/api/content/${encodeURIComponent(key)}`, {
            cache: "no-store"
        });
        if (r.ok) {
            const data = await r.json();
            cache[key] = data;
            return data;
        }
    } catch (_) {
        // Ignore
    }

    throw new Error(`Missing data: ${key}`);
};

export const getCourses = () => data("courses");
export const getTopics = () => data("topics");
export const getCourseBySlug = (slug) => data("course:" + slug);
export const getTopicById = async (id) => {
    const all = await getTopics();
    return all.find(t => t.id === id) || { id, name: id, icon: "📚", hue: 160 };
};
export const getCaseStudies = () => data("casestudies");
export const getStatistics = () => data("statistics");

// ---------- Progress Store ----------
const getStore = () => {
    if (typeof window === "undefined") return { name: "", courses: {} };
    try {
        const s = JSON.parse(localStorage.getItem(LS_KEY));
        return s && s.courses ? s : { name: "", courses: {} };
    } catch (_) {
        return { name: "", courses: {} };
    }
};

const saveStore = (store) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(LS_KEY, JSON.stringify(store));
};

export const progress = {
    name: () => getStore().name || "",
    setName: (n) => {
        const s = getStore();
        s.name = n;
        saveStore(s);
    },
    course: (slug) => {
        const s = getStore();
        return s.courses[slug] || { done: [], quiz: {}, startedAt: null, completedAt: null };
    },
    ensure: (slug) => {
        const s = getStore();
        if (!s.courses[slug]) {
            s.courses[slug] = { done: [], quiz: {}, startedAt: Date.now(), completedAt: null };
            saveStore(s);
        }
        return s.courses[slug];
    },
    isDone: (slug, lessonId) => {
        return progress.course(slug).done.includes(lessonId);
    },
    complete: (slug, lessonId) => {
        const c = progress.ensure(slug);
        if (!c.done.includes(lessonId)) {
            c.done.push(lessonId);
            saveStore(getStore());
        }
    },
    quizScore: (slug, lessonId) => {
        return progress.course(slug).quiz[lessonId];
    },
    recordQuiz: (slug, lessonId, pct, passed) => {
        const c = progress.ensure(slug);
        const prev = c.quiz[lessonId];
        c.quiz[lessonId] = {
            pct: Math.max(pct, prev ? prev.pct : 0),
            passed: (prev && prev.passed) || passed,
            at: Date.now()
        };
        if (c.quiz[lessonId].passed && !c.done.includes(lessonId)) {
            c.done.push(lessonId);
        }
        saveStore(getStore());
    },
    stats: (slug, courseData) => {
        const c = progress.course(slug);
        const all = courseData.modules?.flatMap(m => m.lessons) || [];
        const total = all.length;
        const done = all.filter(l => c.done.includes(l.id)).length;
        const pct = total ? Math.round((done / total) * 100) : 0;
        return { total, done, pct, complete: total > 0 && done === total };
    },
    markCompletedIfDone: (slug, courseData) => {
        const s = progress.stats(slug, courseData);
        const c = progress.ensure(slug);
        if (s.complete && !c.completedAt) {
            c.completedAt = Date.now();
            saveStore(getStore());
        }
        return s;
    },
    all: () => {
        return getStore().courses || {};
    },
    certId: (slug) => {
        const c = progress.course(slug);
        const seed = `${slug}|${c.completedAt || ""}|${progress.name() || "learner"}`;
        let h = 0;
        for (let i = 0; i < seed.length; i++) {
            h = (h * 31 + seed.charCodeAt(i)) >>> 0;
        }
        return "FL-" + h.toString(36).toUpperCase().padStart(7, "0");
    }
};

// ---------- Gating ----------
export const gating = {
    moduleQuizIds: (mod) => {
        if (!mod || !mod.lessons) return [];
        return mod.lessons.filter(l => l.type === "quiz").map(l => l.id) || [];
    },
    modulePassed: (slug, mod) => {
        if (!mod || !mod.lessons) return true;
        const ids = gating.moduleQuizIds(mod);
        if (!ids.length) return true;
        return ids.every(id => {
            const s = progress.quizScore(slug, id);
            return s && s.passed;
        });
    },
    isModuleLocked: (slug, courseData, modIdx) => {
        // Check if courseData and modules exist
        if (!courseData || !courseData.modules || !Array.isArray(courseData.modules)) {
            return false;
        }
        if (!courseData.gated || modIdx <= 0) return false;
        return !gating.modulePassed(slug, courseData.modules[modIdx - 1]);
    },
    isLessonLocked: (slug, courseData, lessonId) => {
        // Check if courseData and modules exist
        if (!courseData || !courseData.modules || !Array.isArray(courseData.modules)) {
            return false;
        }
        if (!courseData.gated) return false;
        const i = courseData.modules.findIndex(m => m?.lessons?.some(l => l.id === lessonId));
        return i < 0 ? false : gating.isModuleLocked(slug, courseData, i);
    },
    firstOpenLesson: (slug, courseData) => {
        // Check if courseData and modules exist
        if (!courseData || !courseData.modules || !Array.isArray(courseData.modules)) {
            return null;
        }
        for (let i = 0; i < courseData.modules.length; i++) {
            if (!gating.isModuleLocked(slug, courseData, i)) {
                const l = courseData.modules[i]?.lessons?.find(x => !progress.isDone(slug, x.id));
                if (l) return l;
            }
        }
        return courseData.modules[0]?.lessons?.[0] || null;
    },
    passPct: (courseData) => {
        // Check if courseData and modules exist and are arrays
        if (!courseData || !courseData.modules || !Array.isArray(courseData.modules)) {
            return 70;
        }

        for (const m of courseData.modules) {
            if (!m || !m.lessons || !Array.isArray(m.lessons)) continue;
            for (const l of m.lessons) {
                if (l && l.type === "quiz" && l.quiz && l.quiz.passPct) {
                    return l.quiz.passPct;
                }
            }
        }
        return 70;
    }
};

// ---------- Course Card Renderer ----------
export const courseCard = (c, topic, prog) => {
    const hue = topic ? topic.hue : 160;
    const strip = prog && prog.done > 0
        ? `<div class="course-progress-strip"><i style="width:${prog.pct}%"></i></div>`
        : "";
    return `
    <a class="course-card" style="--hue:${hue}" href="/course/${encodeURIComponent(c.slug)}">
      <div class="course-cover">
        <span class="c-level">${esc(c.level)}</span>
        <span class="c-icon">${topic ? topic.icon : "📚"}</span>
      </div>
      ${strip}
      <div class="course-body">
        <span class="course-topic">${esc(topic ? topic.name : c.topic)}</span>
        <h3>${esc(c.title)}</h3>
        <p class="tagline">${esc(c.tagline)}</p>
        <div class="course-meta">
          <span class="instr"><span class="avatar">${initials(c.instructor?.name)}</span>${esc(c.instructor?.name)}</span>
          <span>⏱ ${fmtMin(c.lengthMin)}</span>
          <span>▦ ${c.lessons || 0} lessons</span>
        </div>
      </div>
    </a>`;
};

// ---------- Reveal Observer ----------
let io = null;
export const observeReveals = () => {
    if (typeof window === "undefined") return;
    if (!io) {
        io = new IntersectionObserver(
            (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add("in")),
            { threshold: 0.08 }
        );
    }
    document.querySelectorAll(".reveal:not(.in)").forEach(el => io.observe(el));
    clearTimeout(window._revealFallback);
    window._revealFallback = setTimeout(() => {
        document.querySelectorAll(".reveal:not(.in)").forEach(el => el.classList.add("in"));
    }, 1200);
};

// ---------- Default Export ----------
export default {
    auth,
    esc,
    fmtMin,
    initials,
    qs,
    toast,
    md,
    data,
    getCourses,
    getTopics,
    getCourseBySlug,
    getTopicById,
    progress,
    gating,
    courseCard,
    observeReveals
};