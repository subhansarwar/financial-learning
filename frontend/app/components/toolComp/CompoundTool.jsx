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
} from "recharts";

const inputClass =
    "w-full rounded-lg border border-[#14301F]/15 bg-[#14301F]/[0.02] px-4 py-2.5 text-sm font-medium text-[#14301F] focus:border-[#72BB83] focus:outline-none focus:ring-4 focus:ring-[#72BB83]/15";

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
        let bal = principal;
        let paid = principal;
        const yearlyData = [];

        for (let year = 1; year <= years; year++) {
            for (let m = 1; m <= 12; m++) {
                bal = bal * (1 + i) + monthly;
                paid += monthly;
            }
            yearlyData.push({ year, balance: bal, paid, growth: bal - paid });
        }

        return { final: bal, paid, growth: bal - paid, yearlyData };
    };

    const result = calculateCompound();

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-8">
                {/* Form */}
                <div className="rounded-2xl border border-[#14301F]/10 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
                    <div className="mb-6 flex items-center gap-2.5">
                        <div className="inline-flex items-center justify-center rounded-lg bg-[#72BB83]/10 p-2 ring-1 ring-inset ring-[#72BB83]/20">
                            <TrendingUp className="h-5 w-5 text-[#72BB83]" strokeWidth={2.25} />
                        </div>
                        <h2 className="text-base font-bold text-[#14301F] sm:text-lg">
                            Compound interest explorer
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-1.5 flex items-center gap-2 text-sm font-bold text-[#14301F]/70">
                                <Banknote className="h-4 w-4 text-[#14301F]/35" strokeWidth={2} />
                                Starting amount
                            </label>
                            <input
                                type="number"
                                value={compound.principal}
                                onChange={(e) => setCompound({ ...compound, principal: +e.target.value })}
                                min="0"
                                step="100"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 flex items-center gap-2 text-sm font-bold text-[#14301F]/70">
                                <WalletCards className="h-4 w-4 text-[#14301F]/35" strokeWidth={2} />
                                Monthly contribution
                            </label>
                            <input
                                type="number"
                                value={compound.monthly}
                                onChange={(e) => setCompound({ ...compound, monthly: +e.target.value })}
                                min="0"
                                step="10"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 flex items-center gap-2 text-sm font-bold text-[#14301F]/70">
                                <Percent className="h-4 w-4 text-[#14301F]/35" strokeWidth={2} />
                                Annual return (%)
                            </label>
                            <input
                                type="number"
                                value={compound.rate}
                                onChange={(e) => setCompound({ ...compound, rate: +e.target.value })}
                                step="0.1"
                                className={inputClass}
                            />
                            <p className="mt-1.5 text-xs text-[#14301F]/45">
                                Long-run stock-market averages are often quoted around 7% before inflation.
                            </p>
                        </div>

                        <div>
                            <label className="mb-1.5 flex items-center gap-2 text-sm font-bold text-[#14301F]/70">
                                <Calendar className="h-4 w-4 text-[#14301F]/35" strokeWidth={2} />
                                Years
                            </label>
                            <input
                                type="number"
                                value={compound.years}
                                onChange={(e) => setCompound({ ...compound, years: +e.target.value })}
                                min="1"
                                max="60"
                                className={inputClass}
                            />
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="rounded-2xl border border-[#14301F]/10 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
                    <div className="mb-5 flex items-center gap-2.5 sm:mb-6">
                        <div className="inline-flex items-center justify-center rounded-lg bg-[#72BB83]/10 p-2 ring-1 ring-inset ring-[#72BB83]/20">
                            <LineChart className="h-5 w-5 text-[#72BB83]" strokeWidth={2.25} />
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#14301F]/45 sm:text-xs">
                            Projected balance
                        </span>
                    </div>

                    <div className="text-center">
                        <div className="text-3xl font-extrabold tracking-tight text-[#14301F] sm:text-4xl lg:text-5xl">
                            {formatCurrency(result.final)}
                        </div>
                        <p className="mt-1 text-sm text-[#14301F]/50">after {compound.years} years</p>
                    </div>

                    {/* Chart */}
                    <div className="mt-4 h-[160px] w-full sm:h-[180px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ReLineChart data={result.yearlyData} margin={{ left: -18, right: 8 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#14301F" strokeOpacity={0.06} />
                                <XAxis
                                    dataKey="year"
                                    tick={{ fontSize: 10, fill: "#14301F", fillOpacity: 0.4 }}
                                    tickFormatter={(v) => `Y${v}`}
                                    axisLine={{ stroke: "#14301F", strokeOpacity: 0.1 }}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 10, fill: "#14301F", fillOpacity: 0.4 }}
                                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    formatter={(value) => formatCurrency(value)}
                                    contentStyle={{
                                        background: "#fff",
                                        border: "1px solid rgba(20,48,31,0.12)",
                                        borderRadius: "10px",
                                        fontSize: "12px",
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="balance"
                                    name="Balance"
                                    stroke="#72BB83"
                                    strokeWidth={2.5}
                                    dot={false}
                                    activeDot={{ r: 5 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="paid"
                                    name="Paid in"
                                    stroke="#14301F"
                                    strokeOpacity={0.3}
                                    strokeWidth={2}
                                    dot={false}
                                    strokeDasharray="5 5"
                                />
                            </ReLineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between rounded-lg bg-[#14301F]/[0.03] px-4 py-2.5">
                            <span className="flex items-center gap-2 text-sm font-medium text-[#14301F]/65">
                                <HandCoins className="h-4 w-4 text-[#14301F]/35" strokeWidth={2} />
                                You paid in
                            </span>
                            <span className="font-bold text-[#14301F]">{formatCurrency(result.paid)}</span>
                        </div>

                        <div className="flex items-center justify-between rounded-lg bg-[#72BB83]/10 px-4 py-2.5">
                            <span className="flex items-center gap-2 text-sm font-medium text-[#14301F]/65">
                                <ArrowUpRight className="h-4 w-4 text-[#72BB83]" strokeWidth={2.5} />
                                Growth from compounding
                            </span>
                            <span className="font-bold text-[#5DA870]">{formatCurrency(result.growth)}</span>
                        </div>

                        <div className="flex items-center justify-between rounded-lg bg-[#14301F]/[0.03] px-4 py-2.5">
                            <span className="flex items-center gap-2 text-sm font-medium text-[#14301F]/65">
                                <Target className="h-4 w-4 text-[#14301F]/40" strokeWidth={2} />
                                Growth multiple
                            </span>
                            <span className="font-bold text-[#14301F]">
                                {result.paid ? (result.final / result.paid).toFixed(2) : ""}×
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}