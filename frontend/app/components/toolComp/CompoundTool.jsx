// app/components/toolComp/CompoundTool.jsx
"use client";

import { useState } from "react";
import {
    TrendingUp,
    Banknote,
    WalletCards,
    Percent,
    Calendar,
    LineChart,
    HandCoins,
    ArrowUpRight,
    Target,
    Lightbulb,
} from "lucide-react";
import {
    LineChart as ReLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

export default function CompoundTool() {
    const [compound, setCompound] = useState({
        principal: 1000,
        monthly: 200,
        rate: 7,
        years: 30,
    });

    const formatCurrency = (n) => "$" + n.toLocaleString(undefined, { maximumFractionDigits: 0 });

    const calculateCompound = () => {
        const { principal, monthly, rate, years } = compound;
        const i = rate / 100 / 12;
        const n = years * 12;
        let bal = principal;
        let paid = principal;
        const yearlyData = [];

        for (let year = 1; year <= years; year++) {
            for (let m = 1; m <= 12; m++) {
                bal = bal * (1 + i) + monthly;
                paid += monthly;
            }
            yearlyData.push({
                year: year,
                balance: bal,
                paid: paid,
                growth: bal - paid,
            });
        }

        return { final: bal, paid, growth: bal - paid, yearlyData };
    };

    const result = calculateCompound();

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
                {/* Form */}
                <div className="rounded-xl2 border border-line bg-card p-6 shadow-sm sm:p-8">
                    <div className="mb-6 flex items-center gap-2.5">
                        <div className="rounded-full bg-emerald-50 p-2">
                            <TrendingUp className="h-5 w-5 text-emerald-500" strokeWidth={2} />
                        </div>
                        <h2 className="text-lg font-bold text-ink">Compound interest explorer</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-1.5 flex items-center gap-2 text-sm font-bold text-ink-2">
                                <Banknote className="h-4 w-4 text-muted" strokeWidth={2} />
                                Starting amount
                            </label>
                            <input
                                type="number"
                                value={compound.principal}
                                onChange={(e) => setCompound({ ...compound, principal: +e.target.value })}
                                min="0"
                                step="100"
                                className="w-full rounded-lg border border-line bg-cream-2/50 px-4 py-2.5 text-sm font-medium text-ink focus:border-brand/50 focus:outline-none focus:ring-4 focus:ring-brand/15"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 flex items-center gap-2 text-sm font-bold text-ink-2">
                                <WalletCards className="h-4 w-4 text-muted" strokeWidth={2} />
                                Monthly contribution
                            </label>
                            <input
                                type="number"
                                value={compound.monthly}
                                onChange={(e) => setCompound({ ...compound, monthly: +e.target.value })}
                                min="0"
                                step="10"
                                className="w-full rounded-lg border border-line bg-cream-2/50 px-4 py-2.5 text-sm font-medium text-ink focus:border-brand/50 focus:outline-none focus:ring-4 focus:ring-brand/15"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 flex items-center gap-2 text-sm font-bold text-ink-2">
                                <Percent className="h-4 w-4 text-muted" strokeWidth={2} />
                                Annual return (%)
                            </label>
                            <input
                                type="number"
                                value={compound.rate}
                                onChange={(e) => setCompound({ ...compound, rate: +e.target.value })}
                                step="0.1"
                                className="w-full rounded-lg border border-line bg-cream-2/50 px-4 py-2.5 text-sm font-medium text-ink focus:border-brand/50 focus:outline-none focus:ring-4 focus:ring-brand/15"
                            />
                            <p className="mt-1.5 text-xs text-muted">
                                Long-run stock-market averages are often quoted around 7% before inflation.
                            </p>
                        </div>

                        <div>
                            <label className="mb-1.5 flex items-center gap-2 text-sm font-bold text-ink-2">
                                <Calendar className="h-4 w-4 text-muted" strokeWidth={2} />
                                Years
                            </label>
                            <input
                                type="number"
                                value={compound.years}
                                onChange={(e) => setCompound({ ...compound, years: +e.target.value })}
                                min="1"
                                max="60"
                                className="w-full rounded-lg border border-line bg-cream-2/50 px-4 py-2.5 text-sm font-medium text-ink focus:border-brand/50 focus:outline-none focus:ring-4 focus:ring-brand/15"
                            />
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="rounded-xl2 border border-line bg-card p-6 shadow-sm sm:p-8">
                    <div className="mb-6 flex items-center gap-2.5">
                        <div className="rounded-full bg-purple-50 p-2">
                            <LineChart className="h-5 w-5 text-purple-500" strokeWidth={2} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-muted">
                            Projected balance
                        </span>
                    </div>

                    <div className="text-center">
                        <div className="text-4xl font-extrabold text-brand-deep sm:text-5xl">
                            {formatCurrency(result.final)}
                        </div>
                        <p className="mt-1 text-sm text-muted">after {compound.years} years</p>
                    </div>

                    {/* Chart */}
                    <div className="mt-4 h-[180px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ReLineChart data={result.yearlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="year"
                                    tick={{ fontSize: 10, fill: "#7a8094" }}
                                    tickFormatter={(v) => `Y${v}`}
                                />
                                <YAxis
                                    tick={{ fontSize: 10, fill: "#7a8094" }}
                                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                                />
                                <Tooltip
                                    formatter={(value) => formatCurrency(value)}
                                    contentStyle={{
                                        background: "#fff",
                                        border: "1px solid #e2e5ef",
                                        borderRadius: "12px",
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="balance"
                                    stroke="#4338ca"
                                    strokeWidth={2.5}
                                    dot={false}
                                    activeDot={{ r: 6 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="paid"
                                    stroke="#94a3b8"
                                    strokeWidth={2}
                                    dot={false}
                                    strokeDasharray="5 5"
                                />
                                <Legend />
                            </ReLineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between rounded-lg bg-cream-2/50 px-4 py-2.5">
                            <span className="flex items-center gap-2 text-sm font-medium text-ink-2">
                                <HandCoins className="h-4 w-4 text-muted" strokeWidth={2} />
                                You paid in
                            </span>
                            <span className="font-bold text-ink">{formatCurrency(result.paid)}</span>
                        </div>

                        <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-4 py-2.5">
                            <span className="flex items-center gap-2 text-sm font-medium text-ink-2">
                                <ArrowUpRight className="h-4 w-4 text-emerald-500" strokeWidth={2.5} />
                                Growth from compounding
                            </span>
                            <span className="font-bold text-emerald-600">{formatCurrency(result.growth)}</span>
                        </div>

                        <div className="flex items-center justify-between rounded-lg bg-brand-soft/50 px-4 py-2.5">
                            <span className="flex items-center gap-2 text-sm font-medium text-ink-2">
                                <Target className="h-4 w-4 text-brand" strokeWidth={2} />
                                Growth multiple
                            </span>
                            <span className="font-bold text-brand-deep">
                                {result.paid ? (result.final / result.paid).toFixed(2) : "—"}×
                            </span>
                        </div>
                    </div>

                    <div className="mt-4 rounded-lg border-l-4 border-brand bg-brand-soft/50 p-4">
                        <div className="flex items-start gap-2">
                            <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" strokeWidth={2} />
                            <div className="text-sm text-ink-2">
                                Try {compound.years} years vs {compound.years + 10} — that gap is the whole
                                argument for starting early.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}