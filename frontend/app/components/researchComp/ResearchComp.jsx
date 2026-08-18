"use client";

import {
    BookOpen,
    Calendar,
    ChevronDown,
    ChevronUp,
    Download,
    FileText,
    Leaf,
    Lightbulb,
    Search,
    Upload,
    User,
    Users,
    Zap
} from "lucide-react";
import { useEffect, useState } from "react";
const ResearchComp = () => {
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        title: "",
        author: "",
        topic: "microfinance",
        abstract: "",
        file: null,
    });
    const [uploading, setUploading] = useState(false);
    const [expandedPaper, setExpandedPaper] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterTopic, setFilterTopic] = useState("all");

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
                    abstract:
                        "This paper examines the impact of group lending models on women's economic participation and household decision-making in rural Pakistan. Findings suggest that access to microcredit significantly increases women's autonomy in financial decisions.",
                    url: "#",
                    at: Date.now() - 86400000 * 30,
                },
                {
                    id: "2",
                    title: "Green Bonds: Financing the Energy Transition",
                    author: "Dr. Omar Khan",
                    topic: "sustainability",
                    abstract:
                        "An analysis of the green bond market growth, impact measurement, and the role of institutional investors in climate finance. The paper identifies key drivers and barriers to green bond adoption in emerging markets.",
                    url: "#",
                    at: Date.now() - 86400000 * 15,
                },
                {
                    id: "3",
                    title: "Solar Energy Adoption in Rural Communities",
                    author: "Fatima Ahmed",
                    topic: "green-energy",
                    abstract:
                        "This research explores the factors influencing solar energy adoption in off-grid communities, focusing on financing mechanisms and community engagement strategies for sustainable energy access.",
                    url: "#",
                    at: Date.now() - 86400000 * 7,
                },
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
                setForm((prev) => ({ ...prev, author: u.name || "" }));
            } catch (e) { }
        }
    }, []);

    const topicLabel = (t) => {
        const map = {
            microfinance: "Microfinance",
            sustainability: "Sustainability",
            "green-energy": "Green energy",
            other: "Other",
        };
        return map[t] || t;
    };

    const topicIcon = (t) => {
        const map = {
            microfinance: Users,
            sustainability: Leaf,
            "green-energy": Zap,
            other: BookOpen,
        };
        return map[t] || BookOpen;
    };

    const topicColor = (t) => {
        const map = {
            microfinance: "text-blue-600",
            sustainability: "text-emerald-600",
            "green-energy": "text-amber-600",
            other: "text-purple-600",
        };
        return map[t] || "text-ink-2";
    };

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
                at: Date.now(),
            };

            const updated = [newPaper, ...papers];
            localStorage.setItem("research_papers", JSON.stringify(updated));
            setPapers(updated);
            setForm({ ...form, title: "", abstract: "", file: null });
            setUploading(false);
            alert("🎉 Paper published successfully!");
        }, 1000);
    };

    const toggleExpand = (id) => {
        setExpandedPaper(expandedPaper === id ? null : id);
    };

    // Filter papers
    const filteredPapers = papers.filter((p) => {
        const matchesSearch =
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.abstract.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTopic = filterTopic === "all" || p.topic === filterTopic;
        return matchesSearch && matchesTopic;
    });

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-soft border-t-brand-deep" />
                    <p className="text-sm font-medium text-muted">Loading papers...</p>
                </div>
            </div>
        );
    }

    const topics = ["all", "microfinance", "sustainability", "green-energy", "other"];

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
            {/* ========== PAPERS LIST ========== */}
            <div className="lg:col-span-2">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-ink sm:text-2xl">
                        <BookOpen className="h-5 w-5 text-brand" strokeWidth={2} />
                        Published papers
                        <span className="ml-2 rounded-full bg-brand-soft px-2.5 py-0.5 text-sm font-bold text-brand-deep">
                            {filteredPapers.length}
                        </span>
                    </h2>
                </div>

                {/* Search and Filter */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" strokeWidth={2} />
                        <input
                            type="text"
                            placeholder="Search papers by title, author, or abstract..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-full border border-line bg-card py-2.5 pl-10 pr-4 text-sm font-medium text-ink placeholder:text-muted focus:border-brand/50 focus:outline-none focus:ring-4 focus:ring-brand/15"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                        {topics.map((t) => (
                            <button
                                key={t}
                                onClick={() => setFilterTopic(t)}
                                className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all duration-200 ${filterTopic === t
                                        ? "border-brand bg-brand-soft text-brand-deep"
                                        : "border-line bg-card text-ink-2 hover:border-brand/40 hover:bg-brand-soft/40"
                                    }`}
                            >
                                {t === "all" ? "All" : topicLabel(t)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredPapers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl2 border border-line bg-card px-6 py-16 text-center">
                            <div className="mb-4 rounded-full bg-brand-soft p-4">
                                <FileText className="h-8 w-8 text-brand-deep" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-lg font-bold text-ink">No papers found</h3>
                            <p className="mt-1 text-sm text-muted">
                                {searchTerm || filterTopic !== "all"
                                    ? "Try adjusting your search or filters"
                                    : "Be the first to publish your research"}
                            </p>
                            {(searchTerm || filterTopic !== "all") && (
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setFilterTopic("all");
                                    }}
                                    className="mt-4 rounded-full bg-brand-deep px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-[#241f6b]"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    ) : (
                        filteredPapers.map((p) => {
                            const Icon = topicIcon(p.topic);
                            const color = topicColor(p.topic);
                            const isExpanded = expandedPaper === p.id;

                            return (
                                <article
                                    key={p.id}
                                    className="rounded-xl2 border border-line bg-card transition-all duration-300 hover:border-brand/30 hover:shadow-card"
                                >
                                    <div className="p-5 sm:p-6">
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-deep">
                                                    <Icon className={`h-3.5 w-3.5 ${color}`} strokeWidth={2.25} />
                                                    {topicLabel(p.topic)}
                                                </span>
                                            </div>
                                            <span className="flex items-center gap-1 text-xs font-medium text-muted">
                                                <Calendar className="h-3 w-3" strokeWidth={2} />
                                                {new Date(p.at).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </span>
                                        </div>

                                        <h3 className="mt-2 text-lg font-bold leading-tight tracking-tight text-ink sm:text-xl">
                                            {p.title}
                                        </h3>

                                        <div className="mt-1.5 flex items-center gap-2 text-sm font-medium text-ink-2">
                                            <User className="h-4 w-4 text-muted" strokeWidth={2} />
                                            by {p.author}
                                        </div>

                                        <p className="mt-3 text-sm font-medium leading-relaxed text-ink-2">
                                            {p.abstract.length > 180 && !isExpanded
                                                ? `${p.abstract.slice(0, 180)}...`
                                                : p.abstract}
                                        </p>

                                        {p.abstract.length > 180 && (
                                            <button
                                                onClick={() => toggleExpand(p.id)}
                                                className="mt-2 flex items-center gap-1 text-sm font-bold text-brand-deep transition-colors hover:underline"
                                            >
                                                {isExpanded ? (
                                                    <>
                                                        Show less <ChevronUp className="h-4 w-4" strokeWidth={2.5} />
                                                    </>
                                                ) : (
                                                    <>
                                                        Read more <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line-soft pt-4">
                                            <a
                                                href={p.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 rounded-full bg-brand-deep px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#241f6b]"
                                            >
                                                <Download className="h-3.5 w-3.5" strokeWidth={2.5} />
                                                Read PDF
                                            </a>
                                            <span className="flex items-center gap-1.5 text-xs text-muted">
                                                <span className="h-1 w-1 rounded-full bg-muted" />
                                                Student contribution
                                            </span>
                                            <span className="flex items-center gap-1.5 text-xs text-muted">
                                                <span className="h-1 w-1 rounded-full bg-muted" />
                                                Not peer-reviewed
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            );
                        })
                    )}
                </div>
            </div>

            {/* ========== UPLOAD FORM ========== */}
            <aside>
                <div className="sticky top-24 rounded-xl2 border border-line bg-card p-5 sm:p-6">
                    <div className="mb-4 flex items-center gap-2">
                        <div className="rounded-full bg-brand-soft p-2">
                            <Upload className="h-5 w-5 text-brand-deep" strokeWidth={2} />
                        </div>
                        <h3 className="text-lg font-bold tracking-tight text-ink">
                            Publish your paper
                        </h3>
                    </div>

                    <p className="mb-4 text-sm font-medium leading-relaxed text-muted">
                        Share your essay or research with other learners. PDF only, up to 10
                        MB. Papers are student contributions — they are{" "}
                        <strong className="text-ink-2">not peer-reviewed</strong> by the
                        platform.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="pTitle"
                                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted"
                            >
                                Paper title
                            </label>
                            <input
                                id="pTitle"
                                type="text"
                                required
                                maxLength="140"
                                placeholder="e.g. Group lending and women's empowerment in rural Sindh"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className="w-full rounded-lg border border-line bg-cream-2/50 px-3.5 py-2.5 text-sm font-medium text-ink placeholder:text-muted focus:border-brand/50 focus:outline-none focus:ring-4 focus:ring-brand/15"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="pAuthor"
                                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted"
                            >
                                Author name
                            </label>
                            <input
                                id="pAuthor"
                                type="text"
                                required
                                maxLength="80"
                                placeholder="Your name"
                                value={form.author}
                                onChange={(e) => setForm({ ...form, author: e.target.value })}
                                className="w-full rounded-lg border border-line bg-cream-2/50 px-3.5 py-2.5 text-sm font-medium text-ink placeholder:text-muted focus:border-brand/50 focus:outline-none focus:ring-4 focus:ring-brand/15"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="pTopic"
                                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted"
                            >
                                Topic
                            </label>
                            <select
                                id="pTopic"
                                value={form.topic}
                                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                                className="w-full rounded-lg border border-line bg-cream-2/50 px-3.5 py-2.5 text-sm font-medium text-ink focus:border-brand/50 focus:outline-none focus:ring-4 focus:ring-brand/15"
                            >
                                <option value="microfinance">Microfinance</option>
                                <option value="sustainability">Sustainability &amp; finance</option>
                                <option value="green-energy">Green energy</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="pAbstract"
                                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted"
                            >
                                Abstract (2–3 sentences)
                            </label>
                            <textarea
                                id="pAbstract"
                                required
                                maxLength="600"
                                rows="3"
                                placeholder="What question does the paper ask, and what does it find?"
                                value={form.abstract}
                                onChange={(e) => setForm({ ...form, abstract: e.target.value })}
                                className="w-full rounded-lg border border-line bg-cream-2/50 px-3.5 py-2.5 text-sm font-medium text-ink placeholder:text-muted focus:border-brand/50 focus:outline-none focus:ring-4 focus:ring-brand/15"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="pFile"
                                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted"
                            >
                                PDF file
                            </label>
                            <div className="relative">
                                <input
                                    id="pFile"
                                    type="file"
                                    accept="application/pdf,.pdf"
                                    required
                                    onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
                                    className="w-full cursor-pointer rounded-lg border border-line bg-cream-2/50 px-3.5 py-2.5 text-sm font-medium text-ink file:mr-3 file:rounded-full file:border-0 file:bg-brand-soft file:px-4 file:py-1.5 file:text-xs file:font-bold file:text-brand-deep file:transition-colors hover:file:bg-brand-soft/70 focus:border-brand/50 focus:outline-none focus:ring-4 focus:ring-brand/15"
                                />
                            </div>
                        </div>

                        <button
                            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-deep px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#241f6b] disabled:opacity-60 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={uploading}
                        >
                            {uploading ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4" strokeWidth={2.5} />
                                    Upload paper
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-4 rounded-lg bg-accent-soft/50 p-3 text-xs text-ink-2">
                        <p className="flex items-start gap-1.5">
                            <Lightbulb className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-accent-deep" strokeWidth={2} />
                            <span>
                                <strong className="text-accent-deep">Note:</strong> All papers are
                                student contributions and are not peer-reviewed. Please verify
                                information independently.
                            </span>
                        </p>
                    </div>
                </div>
            </aside>
        </div>
    )
}

export default ResearchComp
