// app/components/toolComp/EsgTool.jsx
"use client";

import { useState, useEffect } from "react";
import esgData from "@/data/esg.json";
import { Leaf, Building2, BarChart3, Globe, Users, Shield, Award, Info } from "lucide-react";

const selectClass =
    "w-full rounded-lg border border-[#14301F]/15 bg-[#14301F]/[0.02] px-4 py-2.5 text-sm font-medium text-[#14301F] focus:border-[#72BB83] focus:outline-none focus:ring-4 focus:ring-[#72BB83]/15";

// Company A = deep green, Company B = bright brand green — keeps comparisons
// on-theme instead of an unrelated rainbow of colors.
const COLOR_A = "#14301F";
const COLOR_B = "#72BB83";

function CompareBar({ icon: Icon, label, valueA, valueB, nameA, nameB }) {
    return (
        <div className="mb-4">
            <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-sm font-bold text-[#14301F]/75">
                    <Icon className="h-4 w-4 text-[#72BB83]" strokeWidth={2} />
                    {label}
                </span>
                <span className="text-xs font-medium text-[#14301F]/45">
                    {valueA} vs {valueB}
                </span>
            </div>
            <div className="space-y-1">
                <div className="h-2 overflow-hidden rounded-full bg-[#14301F]/[0.06]">
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${valueA}%`, backgroundColor: COLOR_A }}
                    />
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#14301F]/[0.06]">
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${valueB}%`, backgroundColor: COLOR_B }}
                    />
                </div>
            </div>
        </div>
    );
}

export default function EsgTool() {
    const [esg, setEsg] = useState({ companyA: "", companyB: "" });

    useEffect(() => {
        if (esgData.companies.length > 0) {
            setEsg({
                companyA: esgData.companies[0].id,
                companyB: esgData.companies[1]?.id || esgData.companies[0].id,
            });
        }
    }, []);

    const getESGCompanies = () => {
        const A = esgData.companies.find((c) => c.id === esg.companyA);
        const B = esgData.companies.find((c) => c.id === esg.companyB);
        return { A, B };
    };

    const esgCompanies = getESGCompanies();

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-8">
                {/* Form */}
                <div className="rounded-2xl border border-[#14301F]/10 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
                    <div className="mb-6 flex items-center gap-2.5">
                        <div className="inline-flex items-center justify-center rounded-lg bg-[#72BB83]/10 p-2 ring-1 ring-inset ring-[#72BB83]/20">
                            <Leaf className="h-5 w-5 text-[#72BB83]" strokeWidth={2.25} />
                        </div>
                        <h2 className="text-base font-bold text-[#14301F] sm:text-lg">
                            Compare companies
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-1.5 flex items-center gap-2 text-sm font-bold text-[#14301F]/70">
                                <Building2 className="h-4 w-4 text-[#14301F]/35" strokeWidth={2} />
                                Company A
                            </label>
                            <select
                                value={esg.companyA}
                                onChange={(e) => setEsg({ ...esg, companyA: e.target.value })}
                                className={selectClass}
                            >
                                {esgData.companies.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} — {c.sector}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1.5 flex items-center gap-2 text-sm font-bold text-[#14301F]/70">
                                <Building2 className="h-4 w-4 text-[#14301F]/35" strokeWidth={2} />
                                Company B
                            </label>
                            <select
                                value={esg.companyB}
                                onChange={(e) => setEsg({ ...esg, companyB: e.target.value })}
                                className={selectClass}
                            >
                                {esgData.companies.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} — {c.sector}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="rounded-lg bg-[#72BB83]/[0.07] p-3">
                            <div className="flex items-start gap-2">
                                <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#72BB83]" strokeWidth={2} />
                                <p className="text-xs text-[#14301F]/60">
                                    Demo dataset fictional companies for learning.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="rounded-2xl border border-[#14301F]/10 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
                    <div className="mb-5 flex items-center gap-2.5 sm:mb-6">
                        <div className="inline-flex items-center justify-center rounded-lg bg-[#72BB83]/10 p-2 ring-1 ring-inset ring-[#72BB83]/20">
                            <BarChart3 className="h-5 w-5 text-[#72BB83]" strokeWidth={2.25} />
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#14301F]/45 sm:text-xs">
                            Head to head
                        </span>
                    </div>

                    {esgCompanies.A && esgCompanies.B && (
                        <>
                            <div className="mb-5 flex flex-wrap gap-x-5 gap-y-2">
                                <div className="flex items-center gap-2">
                                    <span
                                        className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                                        style={{ backgroundColor: COLOR_A }}
                                    />
                                    <span className="text-sm font-semibold text-[#14301F]/75">
                                        {esgCompanies.A.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                                        style={{ backgroundColor: COLOR_B }}
                                    />
                                    <span className="text-sm font-semibold text-[#14301F]/75">
                                        {esgCompanies.B.name}
                                    </span>
                                </div>
                            </div>

                            <CompareBar
                                icon={Globe}
                                label="Environmental"
                                valueA={esgCompanies.A.e}
                                valueB={esgCompanies.B.e}
                                nameA={esgCompanies.A.name}
                                nameB={esgCompanies.B.name}
                            />
                            <CompareBar
                                icon={Users}
                                label="Social"
                                valueA={esgCompanies.A.s}
                                valueB={esgCompanies.B.s}
                                nameA={esgCompanies.A.name}
                                nameB={esgCompanies.B.name}
                            />
                            <CompareBar
                                icon={Shield}
                                label="Governance"
                                valueA={esgCompanies.A.g}
                                valueB={esgCompanies.B.g}
                                nameA={esgCompanies.A.name}
                                nameB={esgCompanies.B.name}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}