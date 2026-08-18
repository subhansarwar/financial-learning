// app/components/toolComp/EsgTool.jsx
"use client";

import { useState, useEffect } from "react";
import esgData from "@/data/esg.json";
import {
    Leaf,
    Building2,
    BarChart3,
    Globe,
    Users,
    Shield,
    Award,
    Info,
} from "lucide-react";

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
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
                {/* Form */}
                <div className="rounded-xl2 border border-line bg-card p-6 shadow-sm sm:p-8">
                    <div className="mb-6 flex items-center gap-2.5">
                        <div className="rounded-full bg-amber-50 p-2">
                            <Leaf className="h-5 w-5 text-amber-500" strokeWidth={2} />
                        </div>
                        <h2 className="text-lg font-bold text-ink">Compare companies</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-1.5 flex items-center gap-2 text-sm font-bold text-ink-2">
                                <Building2 className="h-4 w-4 text-muted" strokeWidth={2} />
                                Company A
                            </label>
                            <select
                                value={esg.companyA}
                                onChange={(e) => setEsg({ ...esg, companyA: e.target.value })}
                                className="w-full rounded-lg border border-line bg-cream-2/50 px-4 py-2.5 text-sm font-medium text-ink focus:border-brand/50 focus:outline-none focus:ring-4 focus:ring-brand/15"
                            >
                                {esgData.companies.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} — {c.sector}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1.5 flex items-center gap-2 text-sm font-bold text-ink-2">
                                <Building2 className="h-4 w-4 text-muted" strokeWidth={2} />
                                Company B
                            </label>
                            <select
                                value={esg.companyB}
                                onChange={(e) => setEsg({ ...esg, companyB: e.target.value })}
                                className="w-full rounded-lg border border-line bg-cream-2/50 px-4 py-2.5 text-sm font-medium text-ink focus:border-brand/50 focus:outline-none focus:ring-4 focus:ring-brand/15"
                            >
                                {esgData.companies.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} — {c.sector}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="rounded-lg bg-brand-soft/50 p-3">
                            <div className="flex items-start gap-2">
                                <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" strokeWidth={2} />
                                <p className="text-xs text-ink-2">
                                    Demo dataset fictional companies for learning.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="rounded-xl2 border border-line bg-card p-6 shadow-sm sm:p-8">
                    <div className="mb-6 flex items-center gap-2.5">
                        <div className="rounded-full bg-purple-50 p-2">
                            <BarChart3 className="h-5 w-5 text-purple-500" strokeWidth={2} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-muted">
                            Head to head
                        </span>
                    </div>

                    {esgCompanies.A && esgCompanies.B && (
                        <>
                            <div className="mb-4 flex flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-full bg-amber-500" />
                                    <span className="text-sm font-semibold text-ink-2">
                                        {esgCompanies.A.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-full bg-emerald-500" />
                                    <span className="text-sm font-semibold text-ink-2">
                                        {esgCompanies.B.name}
                                    </span>
                                </div>
                            </div>

                            {/* Environmental */}
                            <div className="mb-4">
                                <div className="mb-1.5 flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 text-sm font-bold text-ink-2">
                                        <Globe className="h-4 w-4 text-blue-500" strokeWidth={2} />
                                        Environmental
                                    </span>
                                    <span className="text-sm font-medium text-muted">
                                        {esgCompanies.A.e} vs {esgCompanies.B.e}
                                    </span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-cream-2">
                                    <div
                                        className="h-full rounded-full bg-amber-500 transition-all duration-500"
                                        style={{ width: `${esgCompanies.A.e}%` }}
                                    />
                                </div>
                                <div className="mt-1 h-2 overflow-hidden rounded-full bg-cream-2">
                                    <div
                                        className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                                        style={{ width: `${esgCompanies.B.e}%` }}
                                    />
                                </div>
                            </div>

                            {/* Social */}
                            <div className="mb-4">
                                <div className="mb-1.5 flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 text-sm font-bold text-ink-2">
                                        <Users className="h-4 w-4 text-purple-500" strokeWidth={2} />
                                        Social
                                    </span>
                                    <span className="text-sm font-medium text-muted">
                                        {esgCompanies.A.s} vs {esgCompanies.B.s}
                                    </span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-cream-2">
                                    <div
                                        className="h-full rounded-full bg-amber-500 transition-all duration-500"
                                        style={{ width: `${esgCompanies.A.s}%` }}
                                    />
                                </div>
                                <div className="mt-1 h-2 overflow-hidden rounded-full bg-cream-2">
                                    <div
                                        className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                                        style={{ width: `${esgCompanies.B.s}%` }}
                                    />
                                </div>
                            </div>

                            {/* Governance */}
                            <div className="mb-4">
                                <div className="mb-1.5 flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 text-sm font-bold text-ink-2">
                                        <Shield className="h-4 w-4 text-indigo-500" strokeWidth={2} />
                                        Governance
                                    </span>
                                    <span className="text-sm font-medium text-muted">
                                        {esgCompanies.A.g} vs {esgCompanies.B.g}
                                    </span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-cream-2">
                                    <div
                                        className="h-full rounded-full bg-amber-500 transition-all duration-500"
                                        style={{ width: `${esgCompanies.A.g}%` }}
                                    />
                                </div>
                                <div className="mt-1 h-2 overflow-hidden rounded-full bg-cream-2">
                                    <div
                                        className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                                        style={{ width: `${esgCompanies.B.g}%` }}
                                    />
                                </div>
                            </div>

                            {/* Verdict */}
                            <div className="mt-4 rounded-lg border border-line-soft bg-cream-2/50 p-4">
                                <div className="flex items-start gap-2">
                                    <Award className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" strokeWidth={2} />
                                    <div>
                                        <p className="font-bold text-ink">
                                            {esgCompanies.A.name} scores higher overall.
                                        </p>
                                        <p className="mt-1 text-sm text-ink-2">
                                            {esgCompanies.A.summary}
                                            <br />
                                            {esgCompanies.B.summary}
                                        </p>
                                        <p className="mt-2 text-xs text-muted">
                                            Remember: always read the methodology behind a score.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}