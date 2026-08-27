"use client";

import {
    BookOpen,
    Calendar,
    ChevronDown,
    ChevronUp,
    Download,
    FileText,
    Leaf,
    Search,
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
        const stored = localStorage.getItem("research_papers");
        if (stored) {
            setPapers(JSON.parse(stored));
        } else {
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.author.trim() || !form.abstract.trim()) {
            alert("Please fill in all fields");
            return;
        }

        setUploading(true);

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
            alert("Paper published successfully!");
        }, 1000);
    };

    const toggleExpand = (id) => {
        setExpandedPaper(expandedPaper === id ? null : id);
    };

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
                    <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#72BB83]/20 border-t-[#72BB83]" />
                    <p className="text-sm font-medium text-[#14301F]/50">Loading papers…</p>
                </div>
            </div>
        );
    }

    const topics = ["all", "microfinance", "sustainability", "green-energy", "other"];

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
            {/* ========== PAPERS LIST ========== */}
            <div className="lg:col-span-2">
                {/* Heading — index-style, not a dashboard title */}
                <div className="mb-6 flex items-end justify-between border-b border-[#14301F]/10 pb-4">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#72BB83]">
                            Research index
                        </p>
                        <h2 className="mt-1 font-serif text-2xl font-bold tracking-tight text-[#14301F] sm:text-[1.75rem]">
                            Published papers
                        </h2>
                    </div>
                    <span className="pb-1 text-sm font-semibold text-[#14301F]/40">
                        {filteredPapers.length} {filteredPapers.length === 1 ? "entry" : "entries"}
                    </span>
                </div>

                {/* Search and Filter */}
                <div className="mb-8 flex flex-col gap-3">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#14301F]/35" strokeWidth={2} />
                        <input
                            type="text"
                            placeholder="Search by title, author, or abstract…"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-[#14301F]/15 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-[#14301F] placeholder:text-[#14301F]/35 focus:border-[#72BB83] focus:outline-none focus:ring-4 focus:ring-[#72BB83]/15"
                        />
                    </div>
                    <div className="flex gap-1.5 overflow-x-auto pb-1">
                        {topics.map((t) => (
                            <button
                                key={t}
                                onClick={() => setFilterTopic(t)}
                                className={`whitespace-nowrap rounded-md border px-3 py-1.5 text-xs font-bold transition-colors duration-150 ${filterTopic === t
                                    ? "border-[#14301F] bg-[#14301F] text-white"
                                    : "border-[#14301F]/15 bg-white text-[#14301F]/60 hover:border-[#72BB83]/50 hover:text-[#14301F]"
                                    }`}
                            >
                                {t === "all" ? "All" : topicLabel(t)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    {filteredPapers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#14301F]/20 px-6 py-16 text-center">
                            <FileText className="mb-3 h-7 w-7 text-[#14301F]/25" strokeWidth={1.5} />
                            <h3 className="text-base font-bold text-[#14301F]">No papers found</h3>
                            <p className="mt-1 text-sm text-[#14301F]/50">
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
                                    className="mt-4 rounded-md bg-[#14301F] px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-[#0d2015]"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    ) : (
                        filteredPapers.map((p, idx) => {
                            const Icon = topicIcon(p.topic);
                            const isExpanded = expandedPaper === p.id;

                            return (
                                <article
                                    key={p.id}
                                    className="group relative overflow-hidden rounded-lg border border-[#14301F]/10 bg-white transition-colors duration-200 hover:border-[#72BB83]/40"
                                >
                                    {/* Left accent bar */}
                                    <div className="absolute inset-y-0 left-0 w-[3px] bg-[#72BB83]/0 transition-colors duration-200 group-hover:bg-[#72BB83]" />

                                    <div className="p-5 pl-6 sm:p-6 sm:pl-7">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[#72BB83]">
                                                <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
                                                {topicLabel(p.topic)}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs font-medium text-[#14301F]/40">
                                                <Calendar className="h-3 w-3" strokeWidth={2} />
                                                {new Date(p.at).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </span>
                                        </div>

                                        <h3 className="mt-2.5 font-serif text-lg font-bold leading-snug text-[#14301F] sm:text-xl">
                                            {p.title}
                                        </h3>

                                        <div className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-[#14301F]/55">
                                            <User className="h-3.5 w-3.5" strokeWidth={2} />
                                            {p.author}
                                        </div>

                                        <p className="mt-3 text-sm leading-relaxed text-[#14301F]/65">
                                            {p.abstract.length > 180 && !isExpanded
                                                ? `${p.abstract.slice(0, 180)}…`
                                                : p.abstract}
                                        </p>

                                        {p.abstract.length > 180 && (
                                            <button
                                                onClick={() => toggleExpand(p.id)}
                                                className="mt-2 flex items-center gap-1 text-xs font-bold text-[#72BB83] transition-colors hover:text-[#5DA870]"
                                            >
                                                {isExpanded ? (
                                                    <>
                                                        Show less <ChevronUp className="h-3.5 w-3.5" strokeWidth={2.5} />
                                                    </>
                                                ) : (
                                                    <>
                                                        Read more <ChevronDown className="h-3.5 w-3.5" strokeWidth={2.5} />
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-[#14301F]/8 pt-4">
                                            <a
                                                href={p.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 rounded-md bg-[#14301F] px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#0d2015]"
                                            >
                                                <Download className="h-3.5 w-3.5" strokeWidth={2.5} />
                                                Read PDF
                                            </a>
                                            <span className="text-xs text-[#14301F]/35">Student contribution</span>
                                            <span className="text-xs text-[#14301F]/35">Not peer-reviewed</span>
                                        </div>
                                    </div>
                                </article>
                            );
                        })
                    )}
                </div>
            </div>
        </div >
    )
}

export default ResearchComp