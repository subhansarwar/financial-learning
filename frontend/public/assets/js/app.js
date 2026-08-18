/* Finance Platform Demo shared core: chrome, auth, data, progress, markdown, utils */
(function () {
    "use strict";

    const FL = (window.FL = {});

    /* ---------------- Mock auth (no real accounts name + email only) ------- */
    const USER_KEY = "efp.user";
    FL.auth = {
        user() {
            try { return JSON.parse(localStorage.getItem(USER_KEY)) || null; }
            catch (_) { return null; }
        },
        login(name, email) {
            localStorage.setItem(USER_KEY, JSON.stringify({ name: String(name || "").trim(), email: String(email || "").trim(), at: Date.now() }));
        },
        logout() { localStorage.removeItem(USER_KEY); },
        /** Redirect to the mock login page if not signed in. Returns true when signed in. */
        require() {
            if (FL.auth.user()) return true;
            const next = encodeURIComponent(location.pathname.split("/").pop() + location.search);
            location.href = "login.html?next=" + next;
            return false;
        },
    };

    /* ---------------- Module gating (courses with "gated": true) -------------
       Module 1 is always open. Module N opens when every quiz lesson in module
       N-1 has been passed (score >= that quiz's passPct).                    */
    FL.gating = {
        moduleQuizIds(mod) { return mod.lessons.filter((l) => l.type === "quiz").map((l) => l.id); },
        modulePassed(slug, mod) {
            const ids = FL.gating.moduleQuizIds(mod);
            if (!ids.length) return true;
            return ids.every((id) => { const s = FL.progress.quizScore(slug, id); return s && s.passed; });
        },
        isModuleLocked(slug, course, modIdx) {
            if (!course.gated || modIdx <= 0) return false;
            return !FL.gating.modulePassed(slug, course.modules[modIdx - 1]);
        },
        isLessonLocked(slug, course, lessonId) {
            if (!course.gated) return false;
            const i = course.modules.findIndex((m) => m.lessons.some((l) => l.id === lessonId));
            return i < 0 ? false : FL.gating.isModuleLocked(slug, course, i);
        },
        firstOpenLesson(slug, course) {
            for (let i = 0; i < course.modules.length; i++) {
                if (!FL.gating.isModuleLocked(slug, course, i)) {
                    const l = course.modules[i].lessons.find((x) => !FL.progress.isDone(slug, x.id));
                    if (l) return l;
                }
            }
            return course.modules[0].lessons[0];
        },
        passPct(course) {
            for (const m of course.modules) for (const l of m.lessons)
                if (l.type === "quiz" && l.quiz && l.quiz.passPct) return l.quiz.passPct;
            return 70;
        },
    };

    /* ---------------- Utils (needed by chrome, so defined first) ------------ */
    FL.esc = (s) =>
        String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

    /* ---------------- Chrome (nav + footer) ---------------- */
    const PAGE = document.body.dataset.page || "";

    function nav() {
        const links = [
            ["catalog", "Courses", "catalog.html"],
            ["cases", "Case Studies", "case-studies.html"],
            ["stats", "Statistics", "statistics.html"],
            ["research", "Research", "research.html"],
            ["tools", "Tools", "tools.html"],
        ];
        const u = FL.auth ? FL.auth.user() : null;
        return `
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header">
      <div class="wrap">
        <a class="brand" href="index.html"><span class="mark">🎓</span>Finance Platform Demo</a>
        <button class="nav-toggle" aria-label="Menu" aria-expanded="false">☰</button>
        <nav class="main-nav" id="mainNav" aria-label="Main">
          ${links
                .map(
                    ([id, label, href]) =>
                        `<a href="${href}" class="${PAGE === id ? "active" : ""}">${label}</a>`
                )
                .join("")}
          ${u
                ? `<span class="user-chip" title="${FL.esc(u.email || "")}">👤 ${FL.esc(u.name)}</span>
               <a href="dashboard.html" class="${PAGE === "dashboard" ? "active" : ""}">My Learning</a>
               <a href="#" id="navLogout" class="nav-cta-outline">Log out</a>`
                : `<a href="login.html" class="nav-cta">Log in free</a>`}
        </nav>
      </div>
    </header>`;
    }

    function footer() {
        return `
    <footer class="site-footer">
      <div class="wrap">
        <div class="cols">
          <div>
            <a class="brand" href="index.html"><span class="mark">🎓</span>Finance Platform Demo</a>
            <p style="margin-top:14px;font-size:.92rem;max-width:36ch">
              Free, plain-language education in microfinance and sustainable finance. No paywalls, no jargon.
            </p>
          </div>
          <div>
            <h4>LEARN</h4>
            <a href="catalog.html">Course catalog</a>
            <a href="dashboard.html">My learning</a>
            <a href="tools.html">Financial tools</a>
          </div>
          <div>
            <h4>EXPLORE</h4>
            <a href="case-studies.html">Case studies</a>
            <a href="statistics.html">Statistics</a>
            <a href="research.html">Research papers</a>
          </div>
          <div>
            <h4>PLATFORM</h4>
            <a href="about.html">About us</a>
            <a href="privacy.html">Privacy</a>
            <a href="terms.html">Terms & disclaimer</a>
            <a href="admin.html">Admin panel</a>
          </div>
        </div>
        <div class="f-note">
          <strong>Education, not advice.</strong> The Finance Platform Demo provides general financial
          education only. Nothing on this site is financial, investment, legal or tax advice, and no content is a
          recommendation to buy or sell any product. Always consider your own circumstances and,
          where needed, consult a licensed professional in your country.<br><br>
          © ${new Date().getFullYear()} Finance Platform Demo. Free forever built for learners everywhere.
        </div>
      </div>
    </footer>
    <div class="toast" id="flToast" role="status"></div>`;
    }

    document.body.insertAdjacentHTML("afterbegin", nav());
    document.body.insertAdjacentHTML("beforeend", footer());

    const toggle = document.querySelector(".nav-toggle");
    const mainNav = document.getElementById("mainNav");
    toggle.addEventListener("click", () => {
        const open = mainNav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(open));
    });

    const logoutLink = document.getElementById("navLogout");
    if (logoutLink) logoutLink.addEventListener("click", (e) => {
        e.preventDefault();
        FL.auth.logout();
        FL.toast("Logged out see you soon");
        setTimeout(() => (location.href = "index.html"), 500);
    });

    /* ---------------- Utils ---------------- */
    FL.fmtMin = (min) => {
        if (!min) return "";
        const h = Math.floor(min / 60), m = min % 60;
        if (h && m) return `${h}h ${m}m`;
        if (h) return `${h}h`;
        return `${m} min`;
    };

    FL.initials = (name) =>
        name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

    FL.qs = (k) => new URLSearchParams(location.search).get(k);

    let toastTimer;
    FL.toast = (msg) => {
        const t = document.getElementById("flToast");
        t.textContent = msg;
        t.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
    };

    /* ---------------- Mini markdown ---------------- */
    FL.md = (src) => {
        if (!src) return "";
        const inline = (t) =>
            FL.esc(t)
                .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
                .replace(/\*([^*]+)\*/g, "<em>$1</em>")
                .replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
        const lines = src.split("\n");
        let html = "", list = null;
        const closeList = () => { if (list) { html += `</${list}>`; list = null; } };
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

    /* ---------------- Data layer ----------------
       Try the Cloudflare content API (KV overrides) first,
       fall back to bundled static JSON. Works fully static too. */
    const KEY_TO_PATH = {
        topics: "data/topics.json",
        courses: "data/courses.json",
        esg: "data/esg-data.json",
        casestudies: "data/case-studies.json",
        statistics: "data/statistics.json",
    };
    const cache = {};
    FL.data = async (key) => {
        if (cache[key]) return cache[key];
        const staticPath = KEY_TO_PATH[key] || `data/courses/${key.replace("course:", "")}.json`;
        let data = null;
        try {
            const r = await fetch(`/api/content/${encodeURIComponent(key)}`, { cache: "no-store" });
            if (r.ok) data = await r.json();
        } catch (_) { /* static hosting fine */ }
        if (!data) {
            const r = await fetch(staticPath, { cache: "no-store" });
            if (!r.ok) throw new Error("Missing data: " + key);
            data = await r.json();
        }
        cache[key] = data;
        return data;
    };

    FL.topics = () => FL.data("topics");
    FL.catalog = () => FL.data("courses");
    FL.course = (slug) => FL.data("course:" + slug);
    FL.topicById = async (id) => (await FL.topics()).find((t) => t.id === id) || { id, name: id, icon: "📚", hue: 160 };

    /* ---------------- Progress store (localStorage) ---------------- */
    const LS_KEY = "finlearn.v1";
    const blank = { name: "", courses: {} };
    let store;
    try { store = JSON.parse(localStorage.getItem(LS_KEY)) || blank; } catch (_) { store = blank; }
    if (!store.courses) store = blank;
    const save = () => localStorage.setItem(LS_KEY, JSON.stringify(store));

    FL.progress = {
        name: () => store.name || "",
        setName(n) { store.name = n; save(); },
        course(slug) {
            return store.courses[slug] || { done: [], quiz: {}, startedAt: null, completedAt: null };
        },
        ensure(slug) {
            if (!store.courses[slug]) {
                store.courses[slug] = { done: [], quiz: {}, startedAt: Date.now(), completedAt: null };
                save();
            }
            return store.courses[slug];
        },
        isDone: (slug, lessonId) => FL.progress.course(slug).done.includes(lessonId),
        complete(slug, lessonId) {
            const c = FL.progress.ensure(slug);
            if (!c.done.includes(lessonId)) { c.done.push(lessonId); save(); }
        },
        quizScore: (slug, lessonId) => FL.progress.course(slug).quiz[lessonId],
        recordQuiz(slug, lessonId, pct, passed) {
            const c = FL.progress.ensure(slug);
            const prev = c.quiz[lessonId];
            c.quiz[lessonId] = { pct: Math.max(pct, prev ? prev.pct : 0), passed: (prev && prev.passed) || passed, at: Date.now() };
            if (c.quiz[lessonId].passed && !c.done.includes(lessonId)) c.done.push(lessonId);
            save();
        },
        stats(slug, course) {
            const c = FL.progress.course(slug);
            const all = course.modules.flatMap((m) => m.lessons);
            const total = all.length;
            const done = all.filter((l) => c.done.includes(l.id)).length;
            const pct = total ? Math.round((done / total) * 100) : 0;
            return { total, done, pct, complete: total > 0 && done === total };
        },
        markCompletedIfDone(slug, course) {
            const s = FL.progress.stats(slug, course);
            const c = FL.progress.ensure(slug);
            if (s.complete && !c.completedAt) { c.completedAt = Date.now(); save(); }
            return s;
        },
        all: () => store.courses,
        certId(slug) {
            const c = FL.progress.course(slug);
            const seed = `${slug}|${c.completedAt || ""}|${store.name || "learner"}`;
            let h = 0;
            for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
            return "FL-" + h.toString(36).toUpperCase().padStart(7, "0");
        },
    };

    /* ---------------- Reveal on scroll ---------------- */
    const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
        { threshold: 0.08 }
    );
    FL.observeReveals = () => {
        document.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
        // fail-safe: if the observer never fires (old browsers, prerenderers,
        // headless), reveal everything after a short delay instead of leaving
        // content invisible forever
        clearTimeout(FL._revealFallback);
        FL._revealFallback = setTimeout(
            () => document.querySelectorAll(".reveal:not(.in)").forEach((el) => el.classList.add("in")),
            1200
        );
    };

    /* ---------------- Shared card renderer ---------------- */
    FL.courseCard = (c, topic, prog) => {
        const hue = topic ? topic.hue : 160;
        const strip = prog && prog.done > 0
            ? `<div class="course-progress-strip"><i style="width:${prog.pct}%"></i></div>` : "";
        return `
    <a class="course-card reveal" style="--hue:${hue}" href="course.html?c=${encodeURIComponent(c.slug)}">
      <div class="course-cover">
        <span class="c-level">${FL.esc(c.level)}</span>
        <span class="c-icon">${topic ? topic.icon : "📚"}</span>
      </div>
      ${strip}
      <div class="course-body">
        <span class="course-topic">${FL.esc(topic ? topic.name : c.topic)}</span>
        <h3>${FL.esc(c.title)}</h3>
        <p class="tagline">${FL.esc(c.tagline)}</p>
        <div class="course-meta">
          <span class="instr"><span class="avatar">${FL.initials(c.instructor.name)}</span>${FL.esc(c.instructor.name)}</span>
          <span>⏱ ${FL.fmtMin(c.lengthMin)}</span>
          <span>▦ ${c.lessons} lessons</span>
        </div>
      </div>
    </a>`;
    };
})();
