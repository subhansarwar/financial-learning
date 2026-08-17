// app/caseStudies/CaseStudiesClient.jsx
"use client";

import { useState, useEffect } from "react";

// Sectors configuration
const SECTORS = [
    ["all", "All"],
    ["microfinance", "🤝 Microfinance"],
    ["digital-finance", "📱 Digital finance"],
    ["green-energy", "⚡ Green energy"],
    ["sustainability", "🌱 Sustainability"],
];

const sectorLabel = (s) => ({
    "microfinance": "Microfinance",
    "digital-finance": "Digital finance",
    "green-energy": "Green energy",
    "sustainability": "Sustainability"
}[s] || s);

export default function CaseStudiesClient({ cases }) {
    const [sector, setSector] = useState("all");
    const [region, setRegion] = useState("all");
    const [filteredCases, setFilteredCases] = useState(cases);
    const [regions, setRegions] = useState(["all"]);

    // Extract unique regions from cases
    useEffect(() => {
        const uniqueRegions = ["all", ...new Set(cases.map(c => c.region).filter(Boolean))];
        setRegions(uniqueRegions);
    }, [cases]);

    // Filter cases when sector or region changes
    useEffect(() => {
        const filtered = cases.filter(c =>
            (sector === "all" || c.sector === sector) &&
            (region === "all" || c.region === region)
        );
        setFilteredCases(filtered);
    }, [sector, region, cases]);

    // Escape HTML for security
    const esc = (s) => {
        if (!s) return "";
        return String(s).replace(/[&<>"']/g, (c) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[c]));
    };

    return (
        <>
            {/* Sector Filters */}
            <div className="filter-row" id="sectorFilters">
                {SECTORS.map(([id, label]) => (
                    <button
                        key={id}
                        className={`chip ${sector === id ? "on" : ""}`}
                        onClick={() => setSector(id)}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Region Filters */}
            <div className="filter-row" id="regionFilters">
                {regions.map(r => (
                    <button
                        key={r}
                        className={`chip ${region === r ? "on" : ""}`}
                        onClick={() => setRegion(r)}
                    >
                        {r === "all" ? "All regions" : r}
                    </button>
                ))}
            </div>

            {/* Case Grid */}
            <div className="case-grid" id="caseGrid">
                {filteredCases.length > 0 ? (
                    filteredCases.map((c, index) => (
                        <article className="case-card" key={index}>
                            <div className="case-top">
                                <span className="pill">{sectorLabel(c.sector)}</span>
                                <span className="text-muted" style={{ fontSize: ".82rem" }}>
                                    {esc(c.country)} · est. {c.year}
                                </span>
                            </div>
                            <h3>{esc(c.title)}</h3>
                            <p className="case-org">{esc(c.org)}</p>
                            <p>{esc(c.summary)}</p>
                            <details className="case-more">
                                <summary>Results & the lesson →</summary>
                                <ul>
                                    {c.results?.map((r, i) => (
                                        <li key={i}>{esc(r)}</li>
                                    ))}
                                </ul>
                                <blockquote>{esc(c.lesson)}</blockquote>
                                <p className="case-src">Sources: {esc(c.source)}</p>
                            </details>
                        </article>
                    ))
                ) : (
                    <p className="text-muted">No case studies match those filters.</p>
                )}
            </div>
        </>
    );
}