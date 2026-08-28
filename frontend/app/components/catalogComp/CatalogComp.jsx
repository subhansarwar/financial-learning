// app/components/catalogComp/CatalogComp.jsx
"use client";

import { getCourses } from "@/lib/data";
import { motion } from "framer-motion";
import {
    ChevronDown,
    Loader2,
    Search,
    SearchX,
    X
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import certificateIcon from "../../../public/assets/aboutUsSectionImages/certificate-icon.webp";
import CourseCard from "../../components/CourseCard";

const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const LENGTHS = [
    { value: "short", label: "Under 1 hour" },
    { value: "mid", label: "1–2 hours" },
    { value: "long", label: "2+ hours" },
];

const selectClasses =
    "w-full appearance-none rounded-lg border border-[#E5E5E5] bg-white py-2.5 pl-3.5 pr-9 text-sm font-medium text-[#14301F] transition-colors focus:border-[#72BB83] focus:outline-none focus:ring-4 focus:ring-[#72BB83]/20";

const labelClasses = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#14301F]/60";

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
            <div className="flex items-center justify-center rounded-2xl border border-[#E5E5E5] bg-white px-5 py-12">
                <Loader2 className="h-6 w-6 animate-spin text-[#72BB83]" strokeWidth={2.5} />
                <span className="ml-3 text-sm font-medium text-[#14301F]/60">Loading courses...</span>
            </div>
        );
    }

    return (
        <>
            {/* ========== FILTER BAR ========== */}
            <div className="rounded-2xl border border-[#E5E5E5] bg-white p-4 shadow-sm sm:p-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="sm:col-span-2 lg:col-span-1">
                        <label htmlFor="fQ" className={labelClasses}>
                            Search
                        </label>
                        <div className="relative">
                            <Search
                                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#14301F]/40"
                                strokeWidth={2.25}
                            />
                            <input
                                type="search"
                                id="fQ"
                                value={filters.q}
                                onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                                placeholder="Title, instructor, keyword…"
                                className="w-full rounded-lg border border-[#E5E5E5] bg-white py-2.5 pl-9.5 pr-3.5 text-sm font-medium text-[#14301F] placeholder:text-[#14301F]/40 focus:border-[#72BB83] focus:outline-none focus:ring-4 focus:ring-[#72BB83]/20"
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
                                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#14301F]/40"
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
                                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#14301F]/40"
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
                                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#14301F]/40"
                                strokeWidth={2.25}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ========== RESULTS HEADER ========== */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 sm:mt-7">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#14301F]/60">
                        Showing <span className="font-bold text-[#14301F]">{filtered.length}</span>{" "}
                        course{filtered.length === 1 ? "" : "s"}
                    </span>
                    {hasActiveFilters && (
                        <span className="rounded-full bg-[#72BB83]/10 px-2.5 py-0.5 text-xs font-medium text-[#72BB83]">
                            {filters.q ? "Search" : ""}
                            {filters.topic ? "Topic" : ""}
                            {filters.level ? "Level" : ""}
                            {filters.length ? "Length" : ""}
                        </span>
                    )}
                </div>
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="flex items-center gap-1.5 text-sm font-medium text-[#14301F]/60 transition-colors hover:text-[#14301F]"
                    >
                        <X className="h-4 w-4" strokeWidth={2.5} />
                        Clear filters
                    </button>
                )}
            </div>

            {/* ========== RESULTS GRID ========== */}
            {filtered.length > 0 ? (
                <div className="mt-5 grid grid-cols-1 gap-6 sm:mt-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                    {filtered.map((course) => {
                        const topic = topics?.find((t) => t.id === course.topic);
                        return <CourseCard key={course.slug} course={course} topic={topic} progress={null} />;
                    })}
                </div>
            ) : (
                <div className="mt-5 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#E5E5E5] bg-white px-6 py-16 text-center sm:mt-6">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#72BB83]/10">
                        <SearchX className="h-8 w-8 text-[#72BB83]" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-bold text-[#14301F]">No courses found</h3>
                    <p className="mt-1 text-sm text-[#14301F]/60">
                        Try adjusting your filters or search terms
                    </p>
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-4 rounded-full bg-[#72BB83] px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#72BB83]/80 hover:shadow-md"
                        >
                            Clear all filters
                        </button>
                    )}
                </div>
            )}
            
            {/* --------------------------------------------------------------- */}
            {/* CERTIFICATE STRIP - USING whileInView */}
            {/* --------------------------------------------------------------- */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="mt-10 rounded-3xl bg-[#ffffff] px-6 py-6 sm:px-8 sm:py-8 lg:px-10"
            >
                <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4 sm:items-center">
                        {/* Circular light-blue backdrop behind the certificate icon */}
                        <motion.span
                            whileHover={{ scale: 1.1, rotate: 10 }}
                            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#A7E6FF]"
                        >
                            <Image
                                src={certificateIcon}
                                alt="Certificate icon"
                                width={48}
                                height={48}
                                quality={100}
                                className="h-6 w-6 object-contain"
                            />
                        </motion.span>
                        <div>
                            <h3 className="font-serif text-xl text-slate-900 sm:text-2xl">
                                Certificate
                            </h3>
                            <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-500">
                                Finish a course and you can download a free certificate of
                                completion. It recognises your effort and learning it is
                                not an accredited qualification, and we say so on the
                                certificate itself.
                            </p>
                        </div>
                    </div>

                    <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full sm:w-auto"
                    >
                        <button
                            type="button"
                            className="w-full flex-shrink-0 rounded-md bg-[#1D6E96] px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#175877] sm:w-auto"
                        >
                            Get Today
                        </button>
                    </motion.div>
                </div>
            </motion.div>
        </>
    );
};

export default CatalogComp;