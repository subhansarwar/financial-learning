/* Finance Platform Demo — admin panel */
(function () {
    "use strict";

    const $ = (id) => document.getElementById(id);
    let token = sessionStorage.getItem("fl_admin") || "";
    let overridden = new Set();
    let catalog = [], topics = [];
    let current = null;          // course object being edited
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
        if (r.status === 401) { logout(); throw new Error("unauthorized"); }
        return r;
    };

    /* ---------------- auth ---------------- */
    function logout() {
        token = "";
        sessionStorage.removeItem("fl_admin");
        $("adminShell").style.display = "none";
        $("loginBox").style.display = "block";
    }

    async function login() {
        const pw = $("pw").value;
        $("loginMsg").textContent = "";
        let r;
        try {
            r = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ password: pw }),
            });
        } catch (_) {
            $("loginMsg").textContent = "Admin API unreachable — this only works on the live Cloudflare deployment.";
            return;
        }
        if (r.status === 503) { $("loginMsg").textContent = "Admin not configured on the server yet."; return; }
        if (!r.ok) { $("loginMsg").textContent = "Wrong password."; return; }
        const d = await r.json();
        token = d.token;
        sessionStorage.setItem("fl_admin", token);
        boot();
    }

    $("loginBtn").addEventListener("click", login);
    $("pw").addEventListener("keydown", (e) => e.key === "Enter" && login());
    $("logoutBtn").addEventListener("click", logout);

    /* ---------------- boot ---------------- */
    async function boot() {
        $("loginBox").style.display = "none";
        $("adminShell").style.display = "block";
        [catalog, topics] = await Promise.all([FL.catalog(), FL.topics()]);
        await refreshKeys();
        renderCourseList();
        renderTopics();
        loadEsg();
    }

    async function refreshKeys() {
        try {
            const r = await api("admin/keys");
            const d = await r.json();
            overridden = new Set(d.keys);
        } catch (_) { overridden = new Set(); }
    }

    /* ---------------- tabs ---------------- */
    document.querySelectorAll(".admin-tabs button").forEach((b) => {
        b.addEventListener("click", () => {
            document.querySelectorAll(".admin-tabs button").forEach((x) => x.classList.remove("active"));
            b.classList.add("active");
            ["courses", "topics", "esg", "help"].forEach((t) => {
                $("tab-" + t).style.display = t === b.dataset.tab ? "block" : "none";
            });
        });
    });

    /* ---------------- course list ---------------- */
    function renderCourseList() {
        $("courseList").innerHTML = catalog.map((c) => `
      <button data-slug="${FL.esc(c.slug)}" class="${currentKey === "course:" + c.slug ? "active" : ""}">
        <span>${FL.esc(c.title)}</span>
        ${overridden.has("course:" + c.slug) ? '<span class="badge gold">edited</span>' : ""}
      </button>`).join("");
        $("courseList").querySelectorAll("button").forEach((b) =>
            b.addEventListener("click", () => openCourse(b.dataset.slug)));
    }

    async function openCourse(slug) {
        current = await FL.course(slug);
        currentKey = "course:" + slug;
        renderCourseList();
        renderEditor();
    }

    /* ---------------- course editor ---------------- */
    const uid = () => "x" + Math.random().toString(36).slice(2, 8);

    function lessonTypeFields(l) {
        if (l.type === "video")
            return `<div class="field"><label>Video embed URL (YouTube/Vimeo embed)</label>
        <input data-lf="videoUrl" value="${FL.esc(l.videoUrl || "")}" placeholder="https://www.youtube.com/embed/…"></div>
        <div class="field"><label>Intro text (shown above the video)</label>
        <textarea data-lf="content" style="min-height:70px">${FL.esc(l.content || "")}</textarea></div>`;
        if (l.type === "quiz")
            return `<div class="field"><label>Quiz JSON — {passPct, questions:[{q, choices[4], answer(0-3), explain}]}</label>
        <textarea data-lf="quiz" style="min-height:220px">${FL.esc(JSON.stringify(l.quiz || { passPct: 70, questions: [] }, null, 2))}</textarea>
        <p class="hint quiz-hint"></p></div>`;
        return `<div class="field"><label>Lesson content (markdown)</label>
      <textarea data-lf="content" style="min-height:220px">${FL.esc(l.content || "")}</textarea></div>`;
    }

    function renderEditor() {
        const c = current;
        $("courseEditor").innerHTML = `
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:18px">
        <b style="font-size:1.1rem">${FL.esc(c.title)}</b>
        ${overridden.has(currentKey) ? '<span class="badge gold">customized</span>' : '<span class="badge green">built-in</span>'}
        <span style="flex:1"></span>
        <button class="btn btn-outline btn-sm" id="dlBtn">Download JSON</button>
        ${overridden.has(currentKey) ? '<button class="btn btn-outline btn-sm" id="resetBtn">Reset to built-in</button>' : ""}
        <button class="btn btn-outline btn-sm" id="delBtn" style="color:var(--danger);border-color:#e5b7b0">Delete</button>
        <button class="btn btn-primary btn-sm" id="saveBtn">Save & publish</button>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
        <div class="field"><label>Title</label><input data-f="title" value="${FL.esc(c.title)}"></div>
        <div class="field"><label>Slug (URL id)</label><input data-f="slug" value="${FL.esc(c.slug)}"></div>
        <div class="field" style="grid-column:1/-1"><label>Tagline</label><input data-f="tagline" value="${FL.esc(c.tagline)}"></div>
        <div class="field"><label>Topic</label>
          <select data-f="topic">${topics.map((t) => `<option value="${t.id}" ${t.id === c.topic ? "selected" : ""}>${FL.esc(t.name)}</option>`).join("")}</select></div>
        <div class="field"><label>Level</label>
          <select data-f="level">${["Beginner", "Intermediate", "Advanced"].map((l) => `<option ${l === c.level ? "selected" : ""}>${l}</option>`).join("")}</select></div>
        <div class="field"><label>Length (minutes)</label><input type="number" data-f="lengthMin" value="${c.lengthMin || 60}"></div>
        <div class="field"><label>Featured on homepage</label>
          <select data-f="featured"><option value="false" ${!c.featured ? "selected" : ""}>No</option><option value="true" ${c.featured ? "selected" : ""}>Yes</option></select></div>
        <div class="field"><label>Instructor name</label><input data-f="instructor.name" value="${FL.esc(c.instructor.name)}"></div>
        <div class="field"><label>Instructor title</label><input data-f="instructor.title" value="${FL.esc(c.instructor.title)}"></div>
        <div class="field" style="grid-column:1/-1"><label>Instructor bio</label><textarea data-f="instructor.bio" style="min-height:60px">${FL.esc(c.instructor.bio || "")}</textarea></div>
        <div class="field" style="grid-column:1/-1"><label>Learning outcomes (one per line)</label>
          <textarea data-f="outcomes" style="min-height:80px">${FL.esc((c.outcomes || []).join("\n"))}</textarea></div>
      </div>

      <h3 style="margin:22px 0 12px;font-family:var(--font-display)">Modules & lessons</h3>
      <div id="modsEditor"></div>
      <button class="btn btn-outline btn-sm" id="addModBtn" style="margin-top:12px">+ Add module</button>
    `;

        // meta bindings
        $("courseEditor").querySelectorAll("[data-f]").forEach((el) => {
            el.addEventListener("input", () => {
                const f = el.dataset.f;
                if (f === "instructor.name") c.instructor.name = el.value;
                else if (f === "instructor.title") c.instructor.title = el.value;
                else if (f === "instructor.bio") c.instructor.bio = el.value;
                else if (f === "lengthMin") c.lengthMin = +el.value || 0;
                else if (f === "featured") c.featured = el.value === "true";
                else if (f === "outcomes") c.outcomes = el.value.split("\n").map((s) => s.trim()).filter(Boolean);
                else c[f] = el.value;
            });
        });

        renderMods();

        $("addModBtn").addEventListener("click", () => {
            c.modules.push({ id: uid(), title: "New module", lessons: [{ id: uid(), title: "New lesson", type: "reading", durationMin: 8, content: "## New lesson\n\nWrite here…" }] });
            renderMods();
        });
        $("saveBtn").addEventListener("click", saveCourse);
        $("dlBtn").addEventListener("click", () => {
            const blob = new Blob([JSON.stringify(c, null, 2)], { type: "application/json" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = c.slug + ".json";
            a.click();
        });
        const resetBtn = $("resetBtn");
        if (resetBtn) resetBtn.addEventListener("click", async () => {
            if (!confirm("Discard your edits and restore the built-in version of this course?")) return;
            await api("admin/delete", { method: "POST", body: JSON.stringify({ key: currentKey }) });
            FL.toast("Reset done — reloading");
            setTimeout(() => location.reload(), 800);
        });
        $("delBtn").addEventListener("click", async () => {
            if (!confirm(`Delete “${c.title}” entirely? This removes it from the catalog.`)) return;
            await api("admin/delete", { method: "POST", body: JSON.stringify({ key: currentKey }) });
            catalog = catalog.filter((x) => x.slug !== c.slug);
            await api("admin/save", { method: "POST", body: JSON.stringify({ key: "courses", data: catalog }) });
            current = null; currentKey = "";
            await refreshKeys();
            renderCourseList();
            $("courseEditor").innerHTML = `<div class="empty-state"><div class="big">🗑️</div><p>Course deleted.</p></div>`;
            FL.toast("Course deleted");
        });
    }

    function renderMods() {
        const c = current;
        $("modsEditor").innerHTML = c.modules.map((m, mi) => `
      <div style="border:1px solid var(--line);border-radius:14px;padding:16px;margin-bottom:14px;background:var(--card)">
        <div style="display:flex;gap:10px;align-items:center;margin-bottom:10px">
          <span class="m-num" style="width:28px;height:28px;border-radius:8px;background:var(--emerald-soft);display:grid;place-items:center;font-weight:700;font-size:.82rem">${mi + 1}</span>
          <input data-mi="${mi}" value="${FL.esc(m.title)}" style="flex:1;border:1px solid var(--line);border-radius:10px;padding:9px 12px;background:#fff;color:var(--ink);font-weight:600">
          <button class="btn btn-outline btn-sm" data-modup="${mi}" ${mi === 0 ? "disabled" : ""}>↑</button>
          <button class="btn btn-outline btn-sm" data-moddown="${mi}" ${mi === c.modules.length - 1 ? "disabled" : ""}>↓</button>
          <button class="btn btn-outline btn-sm" data-moddel="${mi}" style="color:var(--danger)">✕</button>
        </div>
        ${m.lessons.map((l, li) => `
          <div style="border:1px solid var(--line-soft);border-radius:12px;padding:14px;margin-bottom:10px;background:#f6f5ec">
            <div style="display:grid;grid-template-columns:2fr 1fr 90px auto;gap:10px;align-items:center">
              <input data-lt="${mi}:${li}" value="${FL.esc(l.title)}" placeholder="Lesson title" style="border:1px solid var(--line);border-radius:10px;padding:8px 12px;background:#fff;color:var(--ink)">
              <select data-ltype="${mi}:${li}" style="border:1px solid var(--line);border-radius:10px;padding:8px;background:#fff;color:var(--ink)">
                ${["reading", "video", "quiz"].map((t) => `<option ${l.type === t ? "selected" : ""}>${t}</option>`).join("")}
              </select>
              <input type="number" data-ldur="${mi}:${li}" value="${l.durationMin || 5}" title="Minutes" style="border:1px solid var(--line);border-radius:10px;padding:8px;background:#fff;color:var(--ink)">
              <span style="white-space:nowrap">
                <button class="btn btn-outline btn-sm" data-lup="${mi}:${li}" ${li === 0 ? "disabled" : ""}>↑</button>
                <button class="btn btn-outline btn-sm" data-ldown="${mi}:${li}" ${li === m.lessons.length - 1 ? "disabled" : ""}>↓</button>
                <button class="btn btn-outline btn-sm" data-ldel="${mi}:${li}" style="color:var(--danger)">✕</button>
              </span>
            </div>
            <div style="margin-top:10px" data-lbody="${mi}:${li}">${lessonTypeFields(l)}</div>
          </div>`).join("")}
        <button class="btn btn-outline btn-sm" data-addlesson="${mi}">+ Add lesson</button>
      </div>`).join("");

        // bindings
        $("modsEditor").querySelectorAll("[data-mi]").forEach((el) =>
            el.addEventListener("input", () => (current.modules[+el.dataset.mi].title = el.value)));
        $("modsEditor").querySelectorAll("[data-lt]").forEach((el) =>
            el.addEventListener("input", () => { const [mi, li] = el.dataset.lt.split(":"); current.modules[mi].lessons[li].title = el.value; }));
        $("modsEditor").querySelectorAll("[data-ldur]").forEach((el) =>
            el.addEventListener("input", () => { const [mi, li] = el.dataset.ldur.split(":"); current.modules[mi].lessons[li].durationMin = +el.value || 0; }));
        $("modsEditor").querySelectorAll("[data-ltype]").forEach((el) =>
            el.addEventListener("change", () => {
                const [mi, li] = el.dataset.ltype.split(":");
                const l = current.modules[mi].lessons[li];
                l.type = el.value;
                if (l.type === "quiz" && !l.quiz) l.quiz = { passPct: 70, questions: [{ q: "Question?", choices: ["A", "B", "C", "D"], answer: 0, explain: "…" }] };
                if (l.type === "video" && !l.videoUrl) l.videoUrl = "";
                if (l.type === "reading" && !l.content) l.content = "";
                renderMods();
            }));
        $("modsEditor").querySelectorAll("[data-lf]").forEach((el) =>
            el.addEventListener("input", () => {
                const box = el.closest("[data-lbody]");
                const [mi, li] = box.dataset.lbody.split(":");
                const l = current.modules[mi].lessons[li];
                if (el.dataset.lf === "quiz") {
                    try {
                        l.quiz = JSON.parse(el.value);
                        box.querySelector(".quiz-hint").textContent = "✓ valid JSON";
                    } catch (e) {
                        box.querySelector(".quiz-hint").textContent = "⚠ invalid JSON — fix before saving";
                    }
                } else l[el.dataset.lf] = el.value;
            }));

        const swap = (arr, i, j) => { const t = arr[i]; arr[i] = arr[j]; arr[j] = t; };
        $("modsEditor").querySelectorAll("[data-modup]").forEach((b) => b.addEventListener("click", () => { swap(current.modules, +b.dataset.modup, +b.dataset.modup - 1); renderMods(); }));
        $("modsEditor").querySelectorAll("[data-moddown]").forEach((b) => b.addEventListener("click", () => { swap(current.modules, +b.dataset.moddown, +b.dataset.moddown + 1); renderMods(); }));
        $("modsEditor").querySelectorAll("[data-moddel]").forEach((b) => b.addEventListener("click", () => { if (confirm("Delete this module and its lessons?")) { current.modules.splice(+b.dataset.moddel, 1); renderMods(); } }));
        $("modsEditor").querySelectorAll("[data-lup]").forEach((b) => b.addEventListener("click", () => { const [mi, li] = b.dataset.lup.split(":").map(Number); swap(current.modules[mi].lessons, li, li - 1); renderMods(); }));
        $("modsEditor").querySelectorAll("[data-ldown]").forEach((b) => b.addEventListener("click", () => { const [mi, li] = b.dataset.ldown.split(":").map(Number); swap(current.modules[mi].lessons, li, li + 1); renderMods(); }));
        $("modsEditor").querySelectorAll("[data-ldel]").forEach((b) => b.addEventListener("click", () => { const [mi, li] = b.dataset.ldel.split(":").map(Number); if (confirm("Delete this lesson?")) { current.modules[mi].lessons.splice(li, 1); renderMods(); } }));
        $("modsEditor").querySelectorAll("[data-addlesson]").forEach((b) => b.addEventListener("click", () => {
            current.modules[+b.dataset.addlesson].lessons.push({ id: uid(), title: "New lesson", type: "reading", durationMin: 8, content: "## New lesson\n\nWrite here…" });
            renderMods();
        }));
    }

    /* ---------------- save ---------------- */
    function validateCourse(c) {
        if (!c.title || !c.slug) return "Title and slug are required.";
        if (!/^[a-z0-9-]+$/.test(c.slug)) return "Slug must be lowercase letters, numbers and hyphens only.";
        if (!c.modules.length) return "Add at least one module.";
        for (const m of c.modules) {
            if (!m.lessons.length) return `Module “${m.title}” has no lessons.`;
            for (const l of m.lessons) {
                if (!l.title) return "A lesson is missing a title.";
                if (l.type === "quiz") {
                    if (!l.quiz || !Array.isArray(l.quiz.questions) || !l.quiz.questions.length)
                        return `Quiz lesson “${l.title}” has no valid questions.`;
                    for (const q of l.quiz.questions)
                        if (!q.q || !Array.isArray(q.choices) || q.choices.length < 2 || typeof q.answer !== "number")
                            return `Quiz lesson “${l.title}” has a malformed question.`;
                }
                if (l.type === "video" && !l.videoUrl) return `Video lesson “${l.title}” needs an embed URL.`;
            }
        }
        return null;
    }

    async function syncCatalogDelete() { /* placeholder for symmetry; catalog resync happens on save */ }

    async function saveCourse() {
        const c = current;
        const err = validateCourse(c);
        if (err) { FL.toast("⚠ " + err); return; }

        // keep module/lesson ids stable & unique
        c.modules.forEach((m, i) => { if (!m.id) m.id = "m" + (i + 1); m.lessons.forEach((l, j) => { if (!l.id) l.id = m.id + "l" + (j + 1); }); });

        await api("admin/save", { method: "POST", body: JSON.stringify({ key: currentKey, data: c }) });

        // sync catalog index
        const lessons = c.modules.reduce((n, m) => n + m.lessons.length, 0);
        const entry = {
            slug: c.slug, title: c.title, tagline: c.tagline, topic: c.topic, level: c.level,
            lengthMin: c.lengthMin, lessons, modules: c.modules.length,
            instructor: { name: c.instructor.name, title: c.instructor.title },
            featured: !!c.featured, tags: c.tags || [],
        };
        const i = catalog.findIndex((x) => x.slug === c.slug);
        if (i >= 0) catalog[i] = { ...catalog[i], ...entry }; else catalog.push(entry);
        await api("admin/save", { method: "POST", body: JSON.stringify({ key: "courses", data: catalog }) });

        await refreshKeys();
        renderCourseList();
        renderEditor();
        FL.toast("Published ✓ — live on the site now");
    }

    /* ---------------- new course ---------------- */
    $("newCourseBtn").addEventListener("click", async () => {
        const title = (prompt("Course title:", "New Course") || "").trim();
        if (!title) return;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "course-" + uid();
        if (catalog.some((c) => c.slug === slug)) { FL.toast("A course with that slug exists"); return; }
        const c = {
            slug, title, tagline: "A short, inviting one-line description.",
            topic: topics[0] ? topics[0].id : "personal-finance", level: "Beginner", lengthMin: 45,
            instructor: { name: "EFP Team", title: "EFP editorial", bio: "" },
            outcomes: ["Understand the core ideas"],
            modules: [
                {
                    id: "m1", title: "Getting started", lessons: [
                        { id: "m1l1", title: "Introduction", type: "reading", durationMin: 6, content: "## Welcome\n\nIntroduce the big idea in plain language…" },
                        { id: "m1l2", title: "Quick check", type: "quiz", durationMin: 4, quiz: { passPct: 70, questions: [{ q: "Sample question?", choices: ["A", "B", "C", "D"], answer: 0, explain: "Why A is right…" }] } },
                    ]
                },
            ],
        };
        await api("admin/save", { method: "POST", body: JSON.stringify({ key: "course:" + slug, data: c }) });
        catalog.push({ slug, title, tagline: c.tagline, topic: c.topic, level: c.level, lengthMin: c.lengthMin, lessons: 2, modules: 1, instructor: { name: c.instructor.name, title: c.instructor.title }, featured: false, tags: [] });
        await api("admin/save", { method: "POST", body: JSON.stringify({ key: "courses", data: catalog }) });
        await refreshKeys();
        renderCourseList();
        openCourse(slug);
        FL.toast("Course created — edit and publish when ready");
    });

    /* ---------------- topics editor ---------------- */
    function renderTopics() {
        $("topicsEditor").innerHTML = topics.map((t, i) => `
      <div style="display:grid;grid-template-columns:120px 1fr 1fr 70px 90px 40px;gap:10px;align-items:center;margin-bottom:10px">
        <input data-tf="id" data-i="${i}" value="${FL.esc(t.id)}" title="id" style="border:1px solid var(--line);border-radius:10px;padding:9px;background:#fff;color:var(--ink)">
        <input data-tf="name" data-i="${i}" value="${FL.esc(t.name)}" title="name" style="border:1px solid var(--line);border-radius:10px;padding:9px;background:#fff;color:var(--ink)">
        <input data-tf="blurb" data-i="${i}" value="${FL.esc(t.blurb)}" title="blurb" style="border:1px solid var(--line);border-radius:10px;padding:9px;background:#fff;color:var(--ink)">
        <input data-tf="icon" data-i="${i}" value="${FL.esc(t.icon)}" title="icon (emoji)" style="border:1px solid var(--line);border-radius:10px;padding:9px;background:#fff;color:var(--ink)">
        <input type="number" data-tf="hue" data-i="${i}" value="${t.hue}" title="hue 0-360" style="border:1px solid var(--line);border-radius:10px;padding:9px;background:#fff;color:var(--ink)">
        <button class="btn btn-outline btn-sm" data-tdel="${i}" style="color:var(--danger)">✕</button>
      </div>`).join("");
        $("topicsEditor").querySelectorAll("[data-tf]").forEach((el) =>
            el.addEventListener("input", () => {
                const t = topics[+el.dataset.i];
                t[el.dataset.tf] = el.dataset.tf === "hue" ? +el.value || 160 : el.value;
            }));
        $("topicsEditor").querySelectorAll("[data-tdel]").forEach((b) =>
            b.addEventListener("click", () => {
                const t = topics[+b.dataset.tdel];
                if (catalog.some((c) => c.topic === t.id)) { FL.toast("⚠ A course still uses this topic"); return; }
                if (confirm(`Delete topic “${t.name}”?`)) { topics.splice(+b.dataset.tdel, 1); renderTopics(); }
            }));
    }
    $("addTopicBtn").addEventListener("click", () => {
        topics.push({ id: "topic-" + uid(), name: "New topic", blurb: "Short description.", icon: "📚", hue: 200 });
        renderTopics();
    });
    $("saveTopicsBtn").addEventListener("click", async () => {
        const ids = topics.map((t) => t.id);
        if (new Set(ids).size !== ids.length) { FL.toast("⚠ Topic ids must be unique"); return; }
        await api("admin/save", { method: "POST", body: JSON.stringify({ key: "topics", data: topics }) });
        FL.toast("Topics published ✓");
    });

    /* ---------------- ESG editor ---------------- */
    async function loadEsg() {
        const d = await FL.data("esg");
        $("esgEditor").value = JSON.stringify(d, null, 2);
    }
    $("validateEsgBtn").addEventListener("click", () => {
        try {
            const d = JSON.parse($("esgEditor").value);
            if (!Array.isArray(d.companies)) throw new Error("needs a companies array");
            $("esgMsg").textContent = `✓ valid — ${d.companies.length} companies`;
        } catch (e) { $("esgMsg").textContent = "⚠ " + e.message; }
    });
    $("saveEsgBtn").addEventListener("click", async () => {
        try {
            const d = JSON.parse($("esgEditor").value);
            if (!Array.isArray(d.companies)) throw new Error("needs a companies array");
            await api("admin/save", { method: "POST", body: JSON.stringify({ key: "esg", data: d }) });
            $("esgMsg").textContent = "Published ✓";
            FL.toast("ESG data published ✓");
        } catch (e) { $("esgMsg").textContent = "⚠ " + e.message; }
    });

    /* ---------------- auto-login ---------------- */
    if (token) boot();
})();
