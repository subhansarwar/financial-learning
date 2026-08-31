// app/components/catalogComp/CatalogComp.jsx
"use client";

import {
    clearFilters,
    setFilter
} from "../../store/website/websiteCourseSlice";
import { getAllCourses } from "../../store/website/websiteCourseThunks";
import { motion } from "framer-motion";
import {
    ChevronDown,
    Loader2,
    Search,
    SearchX,
    X
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import certificateIcon from "../../../public/assets/aboutUsSectionImages/certificate-icon.webp";
import CourseCard from "../../components/CourseCard";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const LENGTHS = [
    { value: "short", label: "Under 1 hour" },
    { value: "mid", label: "1–2 hours" },
    { value: "long", label: "2+ hours" },
];

const selectClasses =
    "w-full appearance-none rounded-lg border border-[#E5E5E5] bg-white py-2.5 pl-3.5 pr-9 text-sm font-medium text-[#14301F] transition-colors focus:border-[#72BB83] focus:outline-none focus:ring-4 focus:ring-[#72BB83]/20";

const labelClasses = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#14301F]/60";

const CatalogComp = ({ initialFilters }) => {
    const dispatch = useAppDispatch();

    const {
        courses,
        pagination,
        filters,
        topics,
        loading,
        error
    } = useAppSelector((state) => state.websiteCourse);
    console.log('📊 Courses:', courses);

    const [localFilters, setLocalFilters] = useState({
        q: initialFilters?.q || "",
        topic: initialFilters?.topic || "",
        level: "",
        length: "",
    });

    // Debounce timer ref
    const debounceTimerRef = useRef(null);
    // Track if initial load has happened
    const initialLoadDone = useRef(false);

    // Load courses on mount - ONLY ONCE
    useEffect(() => {
        if (!initialLoadDone.current) {
            console.log('🟢 Initial load...');
            dispatch(getAllCourses({
                skip: 0,
                limit: pagination.limit,
            }));
            initialLoadDone.current = true;
        }
    }, []); // Empty dependency array - runs only once

    // Debounced search function
    const debouncedSearch = useCallback((searchValue) => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            console.log('🟢 Debounced search:', searchValue);
            dispatch(setFilter({ key: 'search', value: searchValue }));
        }, 500);
    }, [dispatch]);

    // Handle search input change with debounce
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setLocalFilters(prev => ({ ...prev, q: value }));
        debouncedSearch(value);
    };

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    // Handle filter changes (topic, level) - with debounce
    useEffect(() => {
        // Skip if initial load is not done yet
        if (!initialLoadDone.current) return;

        const topicChanged = localFilters.topic !== filters.topic;
        const levelChanged = localFilters.level !== filters.level;

        if (topicChanged || levelChanged) {
            // Clear existing debounce timer
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }

            // Debounce filter changes too
            debounceTimerRef.current = setTimeout(() => {
                console.log('🟢 Filter changed - topic:', localFilters.topic, 'level:', localFilters.level);

                // Update Redux filters
                if (topicChanged) {
                    dispatch(setFilter({ key: 'topic', value: localFilters.topic || '' }));
                }
                if (levelChanged) {
                    dispatch(setFilter({ key: 'level', value: localFilters.level || '' }));
                }
            }, 300);
        }
    }, [localFilters.topic, localFilters.level]);

    // Fetch courses when Redux filters change (only for search, topic, level)
    useEffect(() => {
        // Skip if initial load is not done yet
        if (!initialLoadDone.current) return;

        // Skip if filters are empty (initial state)
        const hasFilters = filters.topic || filters.level || filters.search;
        if (!hasFilters) return;

        console.log('🟢 Fetching courses with filters:', filters);
        dispatch(getAllCourses({
            skip: pagination.skip,
            limit: pagination.limit,
            topic: filters.topic,
            level: filters.level,
            search: filters.search
        }));
    }, [filters.topic, filters.level, filters.search]); // Only when these change

    // Apply length filter locally
    const filtered = useMemo(() => {
        let result = [...courses];

        if (localFilters.length) {
            if (localFilters.length === "short") {
                result = result.filter((c) => c.lengthMin < 60);
            } else if (localFilters.length === "mid") {
                result = result.filter((c) => c.lengthMin >= 60 && c.lengthMin <= 120);
            } else if (localFilters.length === "long") {
                result = result.filter((c) => c.lengthMin > 120);
            }
        }

        return result;
    }, [courses, localFilters.length]);

    const hasActiveFilters = !!(localFilters.q || localFilters.topic || localFilters.level || localFilters.length);

    const clearAllFilters = () => {
        setLocalFilters({ q: "", topic: "", level: "", length: "" });
        dispatch(clearFilters());
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
    };

    if (loading && courses.length === 0) {
        return (
            <div className="flex items-center justify-center rounded-2xl border border-[#E5E5E5] bg-white px-5 py-12">
                <Loader2 className="h-6 w-6 animate-spin text-[#72BB83]" strokeWidth={2.5} />
            </div>
        );
    }

    if (error && courses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E5E5E5] bg-white px-5 py-12">
                <SearchX className="h-8 w-8 text-red-500" strokeWidth={1.5} />
                <span className="mt-3 text-sm font-medium text-[#14301F]/60">{error}</span>
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
                                value={localFilters.q}
                                onChange={handleSearchChange}
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
                                value={localFilters.topic}
                                onChange={(e) => setLocalFilters({ ...localFilters, topic: e.target.value })}
                                className={selectClasses}
                            >
                                <option value="">All topics</option>
                                {topics?.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.icon} {t.name}
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
                                value={localFilters.level}
                                onChange={(e) => setLocalFilters({ ...localFilters, level: e.target.value })}
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
                                value={localFilters.length}
                                onChange={(e) => setLocalFilters({ ...localFilters, length: e.target.value })}
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
                            {localFilters.q ? "Search" : ""}
                            {localFilters.topic ? "Topic" : ""}
                            {localFilters.level ? "Level" : ""}
                            {localFilters.length ? "Length" : ""}
                        </span>
                    )}
                </div>
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={clearAllFilters}
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
                        return <CourseCard key={course.slug || course.id} course={course} topic={topic} progress={null} />;
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
                            onClick={clearAllFilters}
                            className="mt-4 rounded-full bg-[#72BB83] px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#72BB83]/80 hover:shadow-md"
                        >
                            Clear all filters
                        </button>
                    )}
                </div>
            )}

            {/* ========== CERTIFICATE STRIP ========== */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="mt-10 rounded-3xl bg-[#ffffff] px-6 py-6 sm:px-8 sm:py-8 lg:px-10"
            >
                <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4 sm:items-center">
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