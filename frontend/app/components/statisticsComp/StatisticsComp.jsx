"use client";
import React, { useState } from 'react'
import statisticsData from "@/data/statistics.json";

const StatisticsComp = () => {
    const [data, setData] = useState(statisticsData);

    // Helper to render tables
    const renderTable = (block) => {
        if (!block || !block.rows) return null;
        return (
            <table className="stat-table">
                <thead>
                    <tr>
                        {block?.columns?.map((col, i) => (
                            <th key={i}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {block?.rows?.map((row, i) => (
                        <tr key={i}>
                            {row?.map((cell, j) => (
                                <td key={j} className={j === 0 ? "t-lead" : ""}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };
    return (
        <>
            <section className="page-hero">
                <div className="wrap">
                    <h1>Statistics</h1>
                    <p className="tagline">The shape of financial inclusion and sustainable finance — by country and by institution.</p>
                </div>
            </section>

            <section className="section tight">
                <div className="wrap">
                    {/* Fact Cards */}
                    <div className="stat-facts">
                        {data?.facts?.map((fact, i) => (
                            <div className="fact-card" key={i}>
                                <div className="fact-value">{fact.value}</div>
                                <div className="fact-label">{fact.label}</div>
                                <div className="fact-src">{fact.source}</div>
                            </div>
                        ))}
                    </div>

                    {/* Country Stats */}
                    <div className="stat-block">
                        <h2 className="section-title">{data.countryStats.title}</h2>
                        <div className="table-wrap">
                            {renderTable(data.countryStats)}
                        </div>
                        <p className="stat-note">
                            {data.countryStats.note} — Source: {data.countryStats.source}
                        </p>
                    </div>

                    {/* Company Stats */}
                    <div className="stat-block">
                        <h2 className="section-title">{data.companyStats.title}</h2>
                        <div className="table-wrap">
                            {renderTable(data.companyStats)}
                        </div>
                        <p className="stat-note">
                            {data.companyStats.note} — Source: {data.companyStats.source}
                        </p>
                    </div>

                    {/* Green Stats */}
                    <div className="stat-block">
                        <h2 className="section-title">{data.greenStats.title}</h2>
                        <div className="green-bars">
                            {data.greenStats.rows.map((row, i) => (
                                <div className="pulse-row" key={i}>
                                    <span className="pulse-name">{row[0]}</span>
                                    <span className="pulse-value">{row[1]}</span>
                                    <span className="pulse-trend">{row[2]}</span>
                                </div>
                            ))}
                        </div>
                        <p className="stat-note">
                            {data.greenStats.note} — Source: {data.greenStats.source}
                        </p>
                    </div>
                </div>
            </section>
        </>
    )
}

export default StatisticsComp
