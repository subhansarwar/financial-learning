// app/components/catalogComp/CatalogComp.jsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { getCourses } from "@/lib/data";
import CourseCard from "../../components/CourseCard";
import { Search, ChevronDown, SearchX, X, Loader2 } from "lucide-react";

const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const LENGTHS = [
    { value: "short", label: "Under 1 hour" },
    { value: "mid", label: "1–2 hours" },
    { value: "long", label: "2+ hours" },
];

const selectClasses =
    "w-full appearance-none rounded-lg2 border border-line bg-card py-2.5 pl-3.5 pr-9 text-sm font-semibold text-ink-2 transition-colors focus:border-brand/55 focus:outline-none focus:ring-4 focus:ring-brand/15";

const labelClasses = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted";

const CatalogComp = ({ topics, initialFilters }) => {
    const [filters, setFilters] = useState({
        q: initialFilters?.q || "",
        topic: initialFilters?.topic || "",
        level: "",
        length: "",
    });
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const coursesData = await getCourses();
                setCourses(coursesData);
            } catch (error) {
                console.error("Error loading courses:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const filtered = useMemo(() => {
        let result = [...courses];

        if (filters.q) {
            const q = filters.q.toLowerCase();
            result = result.filter(
                (c) =>
                    c.title?.toLowerCase().includes(q) ||
                    c.tagline?.toLowerCase().includes(q) ||
                    c.instructor?.name?.toLowerCase().includes(q)
            );
        }

        if (filters.topic) {
            result = result.filter((c) => c.topic === filters.topic);
        }

        if (filters.level) {
            result = result.filter((c) => c.level === filters.level);
        }

        if (filters.length === "short") {
            result = result.filter((c) => c.lengthMin < 60);
        } else if (filters.length === "mid") {
            result = result.filter((c) => c.lengthMin >= 60 && c.lengthMin <= 120);
        } else if (filters.length === "long") {
            result = result.filter((c) => c.lengthMin > 120);
        }

        return result;
    }, [filters, courses]);

    const hasActiveFilters = !!(filters.q || filters.topic || filters.level || filters.length);

    const clearFilters = () => setFilters({ q: "", topic: "", level: "", length: "" });

    if (loading) {
        return (
            <div className="flex items-center gap-2.5 rounded-xl2 border border-line bg-card px-5 py-10 text-sm font-semibold text-muted">
                <Loader2 className="h-4 w-4 animate-spin text-brand" strokeWidth={2.5} />
            </div>
        );
    }

    return (
        <>
            {/* ========== FILTER BAR ========== */}
            <div className="rounded-xl2 border border-line bg-card p-4 shadow-card sm:p-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="sm:col-span-2 lg:col-span-1">
                        <label htmlFor="fQ" className={labelClasses}>
                            Search
                        </label>
                        <div className="relative">
                            <Search
                                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                                strokeWidth={2.25}
                            />
                            <input
                                type="search"
                                id="fQ"
                                value={filters.q}
                                onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                                placeholder="Title, instructor, keyword…"
                                className="w-full rounded-lg2 border border-line bg-card py-2.5 pl-9.5 pr-3.5 text-sm font-semibold text-ink placeholder:font-medium placeholder:text-muted focus:border-brand/55 focus:outline-none focus:ring-4 focus:ring-brand/15"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="fTopic" className={labelClasses}>
                            Topic
                        </label>
                        <div className="relative">
                            <select
                                id="fTopic"
                                value={filters.topic}
                                onChange={(e) => setFilters({ ...filters, topic: e.target.value })}
                                className={selectClasses}
                            >
                                <option value="">All topics</option>
                                {topics?.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                                strokeWidth={2.25}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="fLevel" className={labelClasses}>
                            Level
                        </label>
                        <div className="relative">
                            <select
                                id="fLevel"
                                value={filters.level}
                                onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                                className={selectClasses}
                            >
                                <option value="">All levels</option>
                                {LEVELS.map((lvl) => (
                                    <option key={lvl} value={lvl}>
                                        {lvl}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                                strokeWidth={2.25}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="fLen" className={labelClasses}>
                            Length
                        </label>
                        <div className="relative">
                            <select
                                id="fLen"
                                value={filters.length}
                                onChange={(e) => setFilters({ ...filters, length: e.target.value })}
                                className={selectClasses}
                            >
                                <option value="">Any length</option>
                                {LENGTHS.map((l) => (
                                    <option key={l.value} value={l.value}>
                                        {l.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                                strokeWidth={2.25}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ========== RESULTS HEADER ========== */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 sm:mt-7">
                <p className="text-sm font-bold text-ink-2">
                    {filtered.length} course{filtered.length === 1 ? "" : "s"} found
                </p>
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="flex items-center gap-1 text-sm font-bold text-brand-deep transition-colors hover:text-brand"
                    >
                        <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                        Clear filters
                    </button>
                )}
            </div>

            {/* ========== RESULTS GRID ========== */}
            {filtered.length > 0 ? (
                <div className="mt-5 grid grid-cols-1 gap-5 sm:mt-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filtered.map((course) => {
                        const topic = topics?.find((t) => t.id === course.topic);
                        return <CourseCard key={course.slug} course={course} topic={topic} progress={null} />;
                    })}
                </div>
            ) : (
                <div className="mt-5 flex flex-col items-center gap-3 rounded-xl2 border border-dashed border-line bg-card px-6 py-14 text-center sm:mt-6">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-brand-deep">
                        <SearchX className="h-6 w-6" strokeWidth={2} />
                    </div>
                    <p className="text-sm font-medium text-muted">
                        <b className="block text-base font-bold text-ink">No courses match those filters.</b>
                        Try widening the topic or clearing the search.
                    </p>
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-1 rounded-full border border-line px-5 py-2 text-sm font-bold text-ink-2 transition-colors hover:border-brand-deep hover:text-brand-deep"
                        >
                            Clear all filters
                        </button>
                    )}
                </div>
            )}
        </>
    );
};

export default CatalogComp;