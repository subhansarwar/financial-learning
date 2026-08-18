// app/components/caseStudies/CaseStudiesClient.jsx
"use client";

import { useState, useEffect } from "react";
import {
    Briefcase,
    MapPin,
    Calendar,
    Building2,
    Sparkles,
    ChevronDown,
    ChevronUp,
    Filter,
    X,
    Globe,
    Handshake,
    Smartphone,
    Zap,
    Leaf,
    Lightbulb,
    CheckCircle2,
    BookOpen,
    Users,
    Award,
    DollarSign,
    TrendingUp,
} from "lucide-react";

// Sectors configuration with professional Lucide icons and colors
const SECTORS = [
    { id: "all", label: "All", icon: Briefcase, color: "text-ink-2" },
    { id: "microfinance", label: "Microfinance", icon: Handshake, color: "text-blue-600" },
    { id: "digital-finance", label: "Digital finance", icon: Smartphone, color: "text-purple-600" },
    { id: "green-energy", label: "Green energy", icon: Zap, color: "text-amber-600" },
    { id: "sustainability", label: "Sustainability", icon: Leaf, color: "text-emerald-600" },
];

const sectorIcon = (s) => {
    const map = {
        microfinance: Handshake,
        "digital-finance": Smartphone,
        "green-energy": Zap,
        sustainability: Leaf,
    };
    return map[s] || Briefcase;
};

const sectorColor = (s) => {
    const map = {
        microfinance: "text-blue-600",
        "digital-finance": "text-purple-600",
        "green-energy": "text-amber-600",
        sustainability: "text-emerald-600",
    };
    return map[s] || "text-ink-2";
};

const sectorLabel = (s) => {
    const map = {
        microfinance: "Microfinance",
        "digital-finance": "Digital finance",
        "green-energy": "Green energy",
        sustainability: "Sustainability",
    };
    return map[s] || s;
};

export default function CaseStudiesClient({ cases }) {
    const [sector, setSector] = useState("all");
    const [region, setRegion] = useState("all");
    const [filteredCases, setFilteredCases] = useState(cases);
    const [regions, setRegions] = useState(["all"]);
    const [expandedId, setExpandedId] = useState(null);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    // Extract unique regions from cases
    useEffect(() => {
        const uniqueRegions = [
            "all",
            ...new Set(cases.map((c) => c.region).filter(Boolean)),
        ];
        setRegions(uniqueRegions);
    }, [cases]);

    // Filter cases when sector or region changes
    useEffect(() => {
        const filtered = cases.filter(
            (c) =>
                (sector === "all" || c.sector === sector) &&
                (region === "all" || c.region === region)
        );
        setFilteredCases(filtered);
    }, [sector, region, cases]);

    const toggleExpand = (index) => {
        setExpandedId(expandedId === index ? null : index);
    };

    const clearFilters = () => {
        setSector("all");
        setRegion("all");
        setIsMobileFiltersOpen(false);
    };

    const activeFilterCount = (sector !== "all" ? 1 : 0) + (region !== "all" ? 1 : 0);

    return (
        <>
            {/* ========== FILTERS ========== */}
            <div className="mb-8">
                {/* Mobile filter toggle */}
                <div className="sm:hidden">
                    <button
                        onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                        className="flex w-full items-center justify-between rounded-xl2 border border-line bg-card px-5 py-3.5 text-left font-bold text-ink transition-colors hover:border-brand/50"
                    >
                        <span className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted" strokeWidth={2} />
                            Filters
                            {activeFilterCount > 0 && (
                                <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs text-brand-deep">
                                    {activeFilterCount}
                                </span>
                            )}
                        </span>
                        {isMobileFiltersOpen ? (
                            <ChevronUp className="h-4 w-4 text-muted" strokeWidth={2.5} />
                        ) : (
                            <ChevronDown className="h-4 w-4 text-muted" strokeWidth={2.5} />
                        )}
                    </button>
                </div>

                <div
                    className={`mt-3 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 ${isMobileFiltersOpen ? "flex" : "hidden sm:flex"
                        }`}
                >
                    {/* Sector filters */}
                    <div className="flex flex-wrap gap-2">
                        {SECTORS.map(({ id, label, icon: Icon, color }) => (
                            <button
                                key={id}
                                onClick={() => setSector(id)}
                                className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-bold transition-all duration-200 ${sector === id
                                        ? "border-brand bg-brand-soft text-brand-deep"
                                        : "border-line bg-card text-ink-2 hover:border-brand/40 hover:bg-brand-soft/40"
                                    }`}
                            >
                                {Icon && <Icon className={`h-4 w-4 ${color}`} strokeWidth={2} />}
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Region filters */}
                    <div className="flex flex-wrap gap-2">
                        {regions.map((r) => (
                            <button
                                key={r}
                                onClick={() => setRegion(r)}
                                className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-bold transition-all duration-200 ${region === r
                                        ? "border-brand bg-brand-soft text-brand-deep"
                                        : "border-line bg-card text-ink-2 hover:border-brand/40 hover:bg-brand-soft/40"
                                    }`}
                            >
                                {r === "all" ? (
                                    <Globe className="h-3.5 w-3.5 text-brand" strokeWidth={2.25} />
                                ) : (
                                    <MapPin className="h-3.5 w-3.5 text-rose-500" strokeWidth={2.25} />
                                )}
                                {r === "all" ? "All regions" : r}
                            </button>
                        ))}
                    </div>

                    {/* Clear filters */}
                    {activeFilterCount > 0 && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-1 text-sm font-semibold text-muted transition-colors hover:text-brand-deep"
                        >
                            <X className="h-3.5 w-3.5 text-rose-500" strokeWidth={2.5} />
                            Clear filters
                        </button>
                    )}
                </div>
            </div>

            {/* ========== RESULTS COUNT ========== */}
            <div className="mb-6 flex items-center justify-between border-b border-line-soft pb-4">
                <span className="text-sm font-medium text-muted">
                    Showing <span className="font-bold text-ink">{filteredCases.length}</span>{" "}
                    case {filteredCases.length === 1 ? "study" : "studies"}
                </span>
                {filteredCases.length === 0 && (
                    <button
                        onClick={clearFilters}
                        className="text-sm font-bold text-brand-deep transition-colors hover:underline"
                    >
                        Reset filters
                    </button>
                )}
            </div>

            {/* ========== CASE GRID ========== */}
            {filteredCases.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:gap-6">
                    {filteredCases.map((c, index) => {
                        const isExpanded = expandedId === index;
                        const Icon = sectorIcon(c.sector);
                        const iconColor = sectorColor(c.sector);

                        return (
                            <article
                                key={index}
                                className="group relative flex flex-col overflow-hidden rounded-xl2 border border-line bg-card transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-card-lg"
                            >
                                {/* Top section with sector badge and metadata */}
                                <div className="flex items-start justify-between gap-3 border-b border-line-soft bg-cream-2/50 px-5 py-4 sm:px-6 sm:py-5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-deep">
                                            <Icon className={`h-3.5 w-3.5 ${iconColor}`} strokeWidth={2.25} />
                                            {sectorLabel(c.sector)}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3 text-rose-500" strokeWidth={2.25} />
                                            {c.country}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3 text-indigo-400" strokeWidth={2.25} />
                                            {c.year}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex flex-1 flex-col p-5 sm:p-6">
                                    <div className="mb-1.5 flex items-center gap-2">
                                        <Building2 className="h-4 w-4 text-indigo-400" strokeWidth={2} />
                                        <span className="text-sm font-semibold text-ink-2">
                                            {c.org}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold leading-tight tracking-tight text-ink sm:text-xl">
                                        {c.title}
                                    </h3>

                                    <p className="mt-2.5 flex-1 text-sm font-medium leading-relaxed text-ink-2">
                                        {c.summary}
                                    </p>

                                    {/* Expandable details */}
                                    <button
                                        onClick={() => toggleExpand(index)}
                                        className="mt-4 flex w-full items-center justify-between rounded-lg border border-line-soft bg-cream-2/50 px-4 py-2.5 text-sm font-bold text-ink-2 transition-colors hover:border-brand/30 hover:bg-brand-soft/40"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Sparkles
                                                className="h-3.5 w-3.5 text-amber-500"
                                                strokeWidth={2.25}
                                            />
                                            {isExpanded ? "Hide results & lesson" : "Results & the lesson →"}
                                        </span>
                                        {isExpanded ? (
                                            <ChevronUp className="h-4 w-4 text-ink-2" strokeWidth={2.5} />
                                        ) : (
                                            <ChevronDown className="h-4 w-4 text-ink-2" strokeWidth={2.5} />
                                        )}
                                    </button>

                                    {isExpanded && (
                                        <div className="mt-4 animate-in slide-in-from-top-2 duration-200">
                                            {/* Results */}
                                            {c.results && c.results.length > 0 && (
                                                <div className="mb-4">
                                                    <h4 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted">
                                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" strokeWidth={2.5} />
                                                        Key results
                                                    </h4>
                                                    <ul className="space-y-1.5">
                                                        {c.results.map((result, i) => (
                                                            <li
                                                                key={i}
                                                                className="flex items-start gap-2 text-sm font-medium text-ink-2"
                                                            >
                                                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand" />
                                                                {result}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Lesson */}
                                            {c.lesson && (
                                                <div className="rounded-lg border-l-4 border-accent bg-accent-soft px-4 py-3">
                                                    <div className="flex items-start gap-2">
                                                        <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-deep" strokeWidth={2} />
                                                        <p className="text-sm font-medium italic text-ink-2">
                                                            "{c.lesson}"
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Source */}
                                            {c.source && (
                                                <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-muted">
                                                    <BookOpen className="h-3 w-3 text-brand" strokeWidth={2} />
                                                    Sources: {c.source}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-xl2 border border-line bg-card px-6 py-16 text-center">
                    <div className="mb-4 rounded-full bg-brand-soft p-4">
                        <Filter className="h-8 w-8 text-brand-deep" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-bold text-ink">No case studies found</h3>
                    <p className="mt-1 text-sm text-muted">
                        Try adjusting your filters to see more results
                    </p>
                    <button
                        onClick={clearFilters}
                        className="mt-4 rounded-full bg-brand-deep px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-[#241f6b]"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </>
    );
}