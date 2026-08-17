// app/catalog/CatalogComp.js
"use client";

import React, { useEffect, useState } from 'react';
import { getCourses } from '@/lib/data';
import CourseCard from '../CourseCard'

const CatalogComp = ({ topics, initialFilters }) => {
    const [filters, setFilters] = useState({
        q: initialFilters.q || "",
        topic: initialFilters.topic || "",
        level: "",
        length: "",
    });
    const [courses, setCourses] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const coursesData = await getCourses();
                console.log('Courses loaded:', coursesData);
                setCourses(coursesData);
                setFiltered(coursesData);
            } catch (error) {
                console.error('Error loading courses:', error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    useEffect(() => {
        let result = [...courses];

        if (filters.q) {
            const q = filters.q.toLowerCase();
            result = result.filter(c =>
                c.title?.toLowerCase().includes(q) ||
                c.tagline?.toLowerCase().includes(q) ||
                c.instructor?.name?.toLowerCase().includes(q)
            );
        }

        if (filters.topic) {
            result = result.filter(c => c.topic === filters.topic);
        }

        if (filters.level) {
            result = result.filter(c => c.level === filters.level);
        }

        if (filters.length === "short") {
            result = result.filter(c => c.lengthMin < 60);
        } else if (filters.length === "mid") {
            result = result.filter(c => c.lengthMin >= 60 && c.lengthMin <= 120);
        } else if (filters.length === "long") {
            result = result.filter(c => c.lengthMin > 120);
        }

        setFiltered(result);
    }, [filters, courses]);

    if (loading) {
        return <div className="text-muted" style={{ padding: '20px' }}>Loading courses...</div>;
    }

    return (
        <>
            <div className="filter-bar">
                <div className="field">
                    <label htmlFor="fQ">Search</label>
                    <input
                        type="search"
                        id="fQ"
                        value={filters.q}
                        onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                        placeholder="Title, instructor, keyword…"
                    />
                </div>
                <div className="field">
                    <label htmlFor="fTopic">Topic</label>
                    <select
                        id="fTopic"
                        value={filters.topic}
                        onChange={(e) => setFilters({ ...filters, topic: e.target.value })}
                    >
                        <option value="">All topics</option>
                        {topics?.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                </div>
                <div className="field">
                    <label htmlFor="fLevel">Level</label>
                    <select
                        id="fLevel"
                        value={filters.level}
                        onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                    >
                        <option value="">All levels</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                </div>
                <div className="field">
                    <label htmlFor="fLen">Length</label>
                    <select
                        id="fLen"
                        value={filters.length}
                        onChange={(e) => setFilters({ ...filters, length: e.target.value })}
                    >
                        <option value="">Any length</option>
                        <option value="short">Under 1 hour</option>
                        <option value="mid">1–2 hours</option>
                        <option value="long">2+ hours</option>
                    </select>
                </div>
            </div>

            <p className="results-line">{filtered.length} course{filtered.length === 1 ? "" : "s"} found</p>

            {filtered.length > 0 ? (
                <div className="grid cols-3">
                    {filtered?.map(course => (
                        <CourseCard key={course.slug} course={course} />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="big">🔍</div>
                    <p><b>No courses match those filters.</b><br />Try widening the topic or clearing the search.</p>
                </div>
            )}
        </>
    );
};

export default CatalogComp;