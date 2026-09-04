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
    Zap,
    Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
    getMyPublications,
    createPublication,
    uploadPublicationFile,
    submitPublication,
    downloadPublication,
    RESEARCH_CACHE_KEY,
} from "../../store/website/research/researchThunks";
import { setPublications } from "../../store/website/research/researchSlice";
import AuthModal from "../auth/AuthModal";

const ResearchComp = () => {
    const dispatch = useAppDispatch();
    const { publications, loading } = useAppSelector((state) => state.research);
    const { user, isAuthenticated } = useAppSelector((state) => state.user);

    const [form, setForm] = useState({
        title: "",
        topic: "microfinance",
        abstract: "",
        file: null,
        coAuthors: "",
    });
    const [uploading, setUploading] = useState(false);
    const [expandedPaper, setExpandedPaper] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterTopic, setFilterTopic] = useState("all");
    const [showAuthModal, setShowAuthModal] = useState(false);

    // Load once: cache se ho to wahi use karo, warna sirf ek dafa GET karo
    useEffect(() => {
        if (typeof window === "undefined") return;

        const cached = localStorage.getItem(RESEARCH_CACHE_KEY);
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                dispatch(setPublications(parsed));
                return;
            } catch (e) {
                // corrupt cache — fallback to fresh fetch
            }
        }

        if (isAuthenticated) {
            dispatch(getMyPublications());
        }
    }, [dispatch, isAuthenticated]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Auth check — login/signup na hone par AuthModal dikhao
        if (!isAuthenticated) {
            setShowAuthModal(true);
            return;
        }

        if (!form.title.trim() || !form.abstract.trim() || !form.file) {
            toast.error("Please fill in all fields");
            return;
        }

        setUploading(true);

        try {
            const keywords = form.topic && form.topic !== "other" ? [form.topic] : [];
            const coAuthorsArray = form.coAuthors
                .split(",")
                .map((name) => name.trim())
                .filter((name) => name.length > 0)
            const created = await dispatch(
                createPublication({
                    title: form.title.trim(),
                    abstract: form.abstract.trim(),
                    category: "research_paper",
                    keywords,
                    co_authors: coAuthorsArray,
                })
            ).unwrap();

            // List mein turant dikhao (user ko wait na karna pade)
            const updatedCache = [created, ...publications];
            dispatch(setPublications(updatedCache));
            if (typeof window !== "undefined") {
                localStorage.setItem(RESEARCH_CACHE_KEY, JSON.stringify(updatedCache));
            }

            toast.success("Paper published successfully!");

            const fileToUpload = form.file;
            setForm({ ...form, title: "", abstract: "", file: null, coAuthors: "" });
            setUploading(false);

            // 1 second baad chup-chaap PDF upload, phir list silently refresh
            setTimeout(async () => {
                try {
                    await dispatch(
                        uploadPublicationFile({
                            publicationId: created.id,
                            file: fileToUpload,
                        })
                    ).unwrap();

                    // ADDED: upload ke turant baad, submit bhi silently kar do
                    await dispatch(submitPublication(created.id)).unwrap();

                    // Sab ho jaane ke baad ek dafa GET karke cache refresh karo
                    dispatch(getMyPublications());
                    setForm({ ...form, title: "", abstract: "", file: null, coAuthors: "" });
                } catch (err) {
                    // Silent — user ko pata nahi chalna chahiye
                }
            }, 1000);
        } catch (error) {
            setUploading(false);
        }
    };

    const handleDownload = (pub) => {
        if (pub.file_url) {
            window.open(pub.file_url, "_blank");
            return;
        }
        if (pub.publication_number) {
            dispatch(downloadPublication(pub.publication_number));
        } else {
            toast.error("File not available yet");
        }
    };

    const toggleExpand = (id) => {
        setExpandedPaper(expandedPaper === id ? null : id);
    };

    const filteredPapers = publications.filter((p) => {
        const matchesSearch =
            p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.abstract?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTopic =
            filterTopic === "all" || (p.keywords || []).includes(filterTopic);
        return matchesSearch && matchesTopic;
    });

    if (loading && publications.length === 0) {
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

                <div className="mb-8 flex flex-col gap-3">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#14301F]/35" strokeWidth={2} />
                        <input
                            type="text"
                            placeholder="Search by title or abstract…"
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
                        filteredPapers.map((p) => {
                            const primaryTopic = (p.keywords || [])[0] || "other";
                            const Icon = topicIcon(primaryTopic);
                            const isExpanded = expandedPaper === p.id;
                            const abstractText = p.abstract || "";

                            return (
                                <article
                                    key={p.id}
                                    className="group relative overflow-hidden rounded-lg border border-[#14301F]/10 bg-white transition-colors duration-200 hover:border-[#72BB83]/40"
                                >
                                    <div className="absolute inset-y-0 left-0 w-[3px] bg-[#72BB83]/0 transition-colors duration-200 group-hover:bg-[#72BB83]" />

                                    <div className="p-5 pl-6 sm:p-6 sm:pl-7">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[#72BB83]">
                                                <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
                                                {topicLabel(primaryTopic)}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs font-medium text-[#14301F]/40">
                                                <Calendar className="h-3 w-3" strokeWidth={2} />
                                                {p.created_at
                                                    ? new Date(p.created_at).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    })
                                                    : ""}
                                            </span>
                                        </div>

                                        <h3 className="mt-2.5 font-serif text-lg font-bold leading-snug text-[#14301F] sm:text-xl">
                                            {p.title}
                                        </h3>

                                        <div className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-[#14301F]/55">
                                            <User className="h-3.5 w-3.5" strokeWidth={2} />
                                            {user?.name || "You"}
                                        </div>

                                        <p className="mt-3 text-sm leading-relaxed text-[#14301F]/65">
                                            {abstractText.length > 180 && !isExpanded
                                                ? `${abstractText.slice(0, 180)}…`
                                                : abstractText}
                                        </p>

                                        {abstractText.length > 180 && (
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
                                            <button
                                                onClick={() => handleDownload(p)}
                                                className="inline-flex items-center gap-1.5 rounded-md bg-[#14301F] px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#0d2015]"
                                            >
                                                <Download className="h-3.5 w-3.5" strokeWidth={2.5} />
                                                Read PDF
                                            </button>
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

            {/* ========== UPLOAD FORM ========== */}
            <aside>
                <div className="sticky top-24 rounded-xl2 border border-line bg-card p-5 sm:p-6">
                    <div className="mb-4 flex items-center gap-2">
                        <div className="rounded-full bg-[#E6FBF1] p-2">
                            <Upload className="h-5 w-5 text-[#1E4D35]" strokeWidth={2} />
                        </div>
                        <h3 className="text-lg font-bold tracking-tight text-ink">
                            Publish your paper
                        </h3>
                    </div>

                    <p className="mb-4 text-sm font-medium leading-relaxed text-muted">
                        Share your essay or research with other learners. PDF only, up to 10
                        MB. Papers are student contributions they are{" "}
                        <strong className="text-ink-2">not peer-reviewed</strong> by the
                        platform.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="pTitle" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted">
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
                                disabled={!isAuthenticated}
                                className="w-full rounded-lg border border-line bg-cream-2/50 px-3.5 py-2.5 text-sm font-medium text-ink placeholder:text-muted focus:border-[#E6FBF1] focus:outline-none focus:ring-4 focus:ring-[#E6FBF1] disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label htmlFor="pCoAuthors" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted">
                                Co-authors <span className="normal-case font-normal text-muted/70">(optional, comma separated)</span>
                            </label>
                            <input
                                id="pCoAuthors"
                                type="text"
                                placeholder="e.g. Ahmed Raza, Sara Khan"
                                value={form.coAuthors}
                                onChange={(e) => setForm({ ...form, coAuthors: e.target.value })}
                                disabled={!isAuthenticated}
                                className="w-full rounded-lg border border-line bg-cream-2/50 px-3.5 py-2.5 text-sm font-medium text-ink placeholder:text-muted focus:border-[#E6FBF1] focus:outline-none focus:ring-4 focus:ring-[#E6FBF1] disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label htmlFor="pTopic" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted">
                                Topic
                            </label>
                            <select
                                id="pTopic"
                                value={form.topic}
                                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                                disabled={!isAuthenticated}
                                className="w-full rounded-lg border border-line bg-cream-2/50 px-3.5 py-2.5 text-sm font-medium text-ink focus:border-[#E6FBF1] focus:outline-none focus:ring-4 focus:ring-[#E6FBF1] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="microfinance">Microfinance</option>
                                <option value="sustainability">Sustainability &amp; finance</option>
                                <option value="green-energy">Green energy</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="pAbstract" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted">
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
                                disabled={!isAuthenticated}
                                className="w-full rounded-lg border border-line bg-cream-2/50 px-3.5 py-2.5 text-sm font-medium text-ink placeholder:text-muted focus:border-[#E6FBF1] focus:outline-none focus:ring-4 focus:ring-[#E6FBF1] disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label htmlFor="pFile" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted">
                                PDF file
                            </label>
                            <div className="relative">
                                <input
                                    id="pFile"
                                    type="file"
                                    accept="application/pdf,.pdf"
                                    required
                                    onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
                                    disabled={!isAuthenticated}
                                    className="w-full cursor-pointer rounded-lg border border-line bg-cream-2/50 px-3.5 py-2.5 text-sm font-medium text-ink file:mr-3 file:rounded-full file:border-0 file:bg-[#E6FBF1] file:px-4 file:py-1.5 file:text-xs file:font-bold file:text-[#1E4D35] file:transition-colors hover:file:bg-[#E6FBF1] focus:border-[#E6FBF1] focus:outline-none focus:ring-4 focus:ring-[#E6FBF1] disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <button
                            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1E4D35] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1E4D35] disabled:opacity-60 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={uploading}
                        >
                            {uploading ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                                <>
                                    <Upload className="h-4 w-4 text-[#E6FBF1]" strokeWidth={2.5} />
                                    Upload paper
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </aside>

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                redirectPath="/research"
            />
        </div>
    );
};

export default ResearchComp;