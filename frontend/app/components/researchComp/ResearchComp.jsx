"use client";

import { useEffect, useState } from "react";
const ResearchComp = () => {
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        title: "",
        author: "",
        topic: "microfinance",
        abstract: "",
        file: null
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        // Load papers from localStorage
        const stored = localStorage.getItem("research_papers");
        if (stored) {
            setPapers(JSON.parse(stored));
        } else {
            // Seed with some example papers
            const examples = [
                {
                    id: "1",
                    title: "Group Lending and Women's Empowerment in Rural Sindh",
                    author: "Amina Yusuf",
                    topic: "microfinance",
                    abstract: "This paper examines the impact of group lending models on women's economic participation and household decision-making in rural Pakistan.",
                    url: "#",
                    at: Date.now() - 86400000 * 30
                },
                {
                    id: "2",
                    title: "Green Bonds: Financing the Energy Transition",
                    author: "Dr. Omar Khan",
                    topic: "sustainability",
                    abstract: "An analysis of the green bond market growth, impact measurement, and the role of institutional investors in climate finance.",
                    url: "#",
                    at: Date.now() - 86400000 * 15
                }
            ];
            localStorage.setItem("research_papers", JSON.stringify(examples));
            setPapers(examples);
        }
        setLoading(false);

        // Set author name from login
        const user = localStorage.getItem("efp.user");
        if (user) {
            try {
                const u = JSON.parse(user);
                setForm(prev => ({ ...prev, author: u.name || "" }));
            } catch (e) { }
        }
    }, []);

    const topicLabel = (t) => ({
        microfinance: "🤝 Microfinance",
        sustainability: "🌱 Sustainability",
        "green-energy": "⚡ Green energy",
        other: "📚 Other"
    }[t] || t);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.author.trim() || !form.abstract.trim()) {
            alert("Please fill in all fields");
            return;
        }

        setUploading(true);

        // Simulate upload
        setTimeout(() => {
            const newPaper = {
                id: Date.now().toString(),
                title: form.title.trim(),
                author: form.author.trim(),
                topic: form.topic,
                abstract: form.abstract.trim(),
                url: "#",
                at: Date.now()
            };

            const updated = [newPaper, ...papers];
            localStorage.setItem("research_papers", JSON.stringify(updated));
            setPapers(updated);
            setForm({ ...form, title: "", abstract: "", file: null });
            setUploading(false);
            alert("🎉 Paper published successfully!");
        }, 1000);
    };

    if (loading) {
        return (
            <section className="page-hero">
                <div className="wrap">
                    <h1>Research corner</h1>
                    <p className="tagline">Loading papers...</p>
                </div>
            </section>
        );
    }
    return (
        <>
            <section className="page-hero">
                <div className="wrap">
                    <h1>Research corner</h1>
                    <p className="tagline">Student papers on microfinance, sustainability and green finance — read what others wrote, publish your own.</p>
                </div>
            </section>

            <section className="section tight">
                <div className="wrap research-layout">
                    <div>
                        <h2 className="section-title" style={{ fontSize: "1.4rem" }}>Published papers</h2>
                        <div id="papersList" className="papers-list">
                            {papers.length === 0 ? (
                                <div className="empty-state">
                                    <div style={{ fontSize: "2.4rem" }}>📄</div>
                                    <p><b>No papers yet — be the first to publish.</b></p>
                                    <p className="text-muted">Upload your essay or research using the form.</p>
                                </div>
                            ) : (
                                papers.map(p => (
                                    <article className="paper-card" key={p.id}>
                                        <div className="case-top">
                                            <span className="pill">{topicLabel(p.topic)}</span>
                                            <span className="text-muted" style={{ fontSize: ".82rem" }}>
                                                {new Date(p.at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3>{p.title}</h3>
                                        <p className="case-org">by {p.author}</p>
                                        <p>{p.abstract}</p>
                                        <a className="btn btn-outline btn-sm" href={p.url} target="_blank" rel="noopener">Read PDF ↗</a>
                                    </article>
                                ))
                            )}
                        </div>
                    </div>

                    <aside>
                        <div className="side-card" id="uploadCard">
                            <b style={{ fontSize: "1.05rem" }}>📄 Publish your paper</b>
                            <p className="text-muted" style={{ fontSize: ".88rem", margin: "10px 0 16px" }}>
                                Share your essay or research with other learners. PDF only, up to 10&nbsp;MB.
                                Papers are student contributions — they are <b>not peer-reviewed</b> by the platform.
                            </p>
                            <form onSubmit={handleSubmit}>
                                <label htmlFor="pTitle">Paper title</label>
                                <input
                                    id="pTitle"
                                    required
                                    maxLength="140"
                                    placeholder="e.g. Group lending and women's empowerment in rural Sindh"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                />
                                <label htmlFor="pAuthor">Author name</label>
                                <input
                                    id="pAuthor"
                                    required
                                    maxLength="80"
                                    placeholder="Your name"
                                    value={form.author}
                                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                                />
                                <label htmlFor="pTopic">Topic</label>
                                <select
                                    id="pTopic"
                                    value={form.topic}
                                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                                >
                                    <option value="microfinance">Microfinance</option>
                                    <option value="sustainability">Sustainability &amp; finance</option>
                                    <option value="green-energy">Green energy</option>
                                    <option value="other">Other</option>
                                </select>
                                <label htmlFor="pAbstract">Abstract (2–3 sentences)</label>
                                <textarea
                                    id="pAbstract"
                                    required
                                    maxLength="600"
                                    rows="3"
                                    placeholder="What question does the paper ask, and what does it find?"
                                    value={form.abstract}
                                    onChange={(e) => setForm({ ...form, abstract: e.target.value })}
                                />
                                <label htmlFor="pFile">PDF file</label>
                                <input
                                    id="pFile"
                                    type="file"
                                    accept="application/pdf,.pdf"
                                    required
                                    onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
                                />
                                <button className="btn btn-primary" type="submit" style={{ width: "100%", marginTop: "14px" }} disabled={uploading}>
                                    {uploading ? "Uploading..." : "Upload paper"}
                                </button>
                            </form>
                        </div>
                    </aside>
                </div>
            </section>
        </>
    )
}

export default ResearchComp
