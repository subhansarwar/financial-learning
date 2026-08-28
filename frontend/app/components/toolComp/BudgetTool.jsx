// app/components/toolComp/BudgetTool.jsx
"use client";

import { useState } from "react";
import {
    Wallet,
    DollarSign,
    Home,
    Coffee,
    PiggyBank,
    PieChart,
    Lightbulb,
    AlertCircle,
    Info,
    CheckCircle2,
} from "lucide-react";
import {
    PieChart as RePieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";

// Three tones of the brand green — differentiated by lightness, not hue,
// so the chart stays inside the site's single-color identity.
const COLORS = ["#14301F", "#72BB83", "#A9D3B4"];

const inputClass =
    "w-full rounded-lg border border-[#14301F]/15 bg-[#14301F]/[0.02] px-4 py-2.5 text-sm font-medium text-[#14301F] focus:border-[#72BB83] focus:outline-none focus:ring-4 focus:ring-[#72BB83]/15";

export default function BudgetTool() {
    const [budget, setBudget] = useState({
        income: 3000,
        needs: 50,
        wants: 30,
        save: 20,
    });

    const formatCurrency = (n) => "$" + n.toLocaleString(undefined, { maximumFractionDigits: 0 });

    const calculateBudget = () => {
        const { income, needs, wants, save } = budget;
        const total = needs + wants + save;
        const warning =
            total === 100
                ? ""
                : total > 100
                    ? `Adds up to ${total}% — trim ${total - 100}%.`
                    : `You have ${100 - total}% unallocated.`;

        const data = [
            { name: "Needs", value: (income * needs) / 100, percentage: needs },
            { name: "Wants", value: (income * wants) / 100, percentage: wants },
            { name: "Savings", value: (income * save) / 100, percentage: save },
        ];

        return { total, warning, data };
    };

    const result = calculateBudget();

    const getWarningType = () => {
        if (result.warning.includes("trim")) return "error";
        if (result.warning.includes("unallocated")) return "warning";
        return "success";
    };

    const WarningIcon = () => {
        const type = getWarningType();
        if (type === "error") return <AlertCircle className="h-4 w-4 flex-shrink-0" strokeWidth={2} />;
        if (type === "warning") return <Info className="h-4 w-4 flex-shrink-0" strokeWidth={2} />;
        return <CheckCircle2 className="h-4 w-4 flex-shrink-0" strokeWidth={2} />;
    };

    const getWarningColor = () => {
        const type = getWarningType();
        if (type === "error") return "bg-rose-50 text-rose-700";
        if (type === "warning") return "bg-amber-50 text-amber-700";
        return "bg-[#72BB83]/10 text-[#14301F]";
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-8">
                {/* Form */}
                <div className="rounded-2xl border border-[#14301F]/10 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
                    <div className="mb-6 flex items-center gap-2.5">
                        <div className="inline-flex items-center justify-center rounded-lg bg-[#72BB83]/10 p-2 ring-1 ring-inset ring-[#72BB83]/20">
                            <Wallet className="h-5 w-5 text-[#72BB83]" strokeWidth={2.25} />
                        </div>
                        <h2 className="text-base font-bold text-[#14301F] sm:text-lg">
                            Your monthly budget
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-1.5 flex items-center gap-2 text-sm font-bold text-[#14301F]/70">
                                <DollarSign className="h-4 w-4 text-[#14301F]/35" strokeWidth={2} />
                                Monthly take-home income
                            </label>
                            <input
                                type="number"
                                value={budget.income}
                                onChange={(e) => setBudget({ ...budget, income: +e.target.value })}
                                min="0"
                                step="50"
                                className={inputClass}
                            />
                            <p className="mt-1.5 text-xs text-[#14301F]/45">After tax, in your currency.</p>
                        </div>

                        <div>
                            <label className="mb-1.5 flex items-center gap-2 text-sm font-bold text-[#14301F]/70">
                                <Home className="h-4 w-4 text-[#14301F]/35" strokeWidth={2} />
                                Needs rent, bills, groceries (%)
                            </label>
                            <input
                                type="number"
                                value={budget.needs}
                                onChange={(e) => setBudget({ ...budget, needs: +e.target.value })}
                                min="0"
                                max="100"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 flex items-center gap-2 text-sm font-bold text-[#14301F]/70">
                                <Coffee className="h-4 w-4 text-[#14301F]/35" strokeWidth={2} />
                                Wants fun, eating out (%)
                            </label>
                            <input
                                type="number"
                                value={budget.wants}
                                onChange={(e) => setBudget({ ...budget, wants: +e.target.value })}
                                min="0"
                                max="100"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 flex items-center gap-2 text-sm font-bold text-[#14301F]/70">
                                <PiggyBank className="h-4 w-4 text-[#14301F]/35" strokeWidth={2} />
                                Savings & extra debt payments (%)
                            </label>
                            <input
                                type="number"
                                value={budget.save}
                                onChange={(e) => setBudget({ ...budget, save: +e.target.value })}
                                min="0"
                                max="100"
                                className={inputClass}
                            />
                        </div>

                        <div className={`mt-2 rounded-lg p-3 text-sm font-medium ${getWarningColor()}`}>
                            <span className="flex items-start gap-2">
                                <WarningIcon />
                                <span>{result.warning || "Perfect 50/30/20 split!"}</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Results with Chart */}
                <div className="rounded-2xl border border-[#14301F]/10 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
                    <div className="mb-5 flex items-center gap-2.5 sm:mb-6">
                        <div className="inline-flex items-center justify-center rounded-lg bg-[#72BB83]/10 p-2 ring-1 ring-inset ring-[#72BB83]/20">
                            <PieChart className="h-5 w-5 text-[#72BB83]" strokeWidth={2.25} />
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#14301F]/45 sm:text-xs">
                            Your monthly plan
                        </span>
                    </div>

                    {/* Chart */}
                    <div className="h-[200px] w-full sm:h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RePieChart>
                                <Pie
                                    data={result.data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {result.data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => formatCurrency(value)}
                                    contentStyle={{
                                        background: "#fff",
                                        border: "1px solid rgba(20,48,31,0.12)",
                                        borderRadius: "10px",
                                        padding: "8px 12px",
                                        fontSize: "12px",
                                    }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    formatter={(value) => {
                                        const item = result.data.find((d) => d.name === value);
                                        return `${value} (${item?.percentage || 0}%)`;
                                    }}
                                    wrapperStyle={{ fontSize: "12px", color: "#14301F" }}
                                />
                            </RePieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Breakdown */}
                    <div className="mt-4 space-y-2.5">
                        {result.data.map((item, index) => (
                            <div key={item.name} className="rounded-lg bg-[#14301F]/[0.03] p-3">
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-sm font-medium text-[#14301F]/70">
                                        <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: COLORS[index] }} />
                                        {item.name} ({item.percentage}%)
                                    </span>
                                    <span className="text-base font-bold sm:text-lg" style={{ color: COLORS[index] }}>
                                        {formatCurrency(item.value)}
                                    </span>
                                </div>
                                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#14301F]/[0.06]">
                                    <div
                                        className="h-full rounded-full transition-all duration-300"
                                        style={{ width: `${item.percentage}%`, background: COLORS[index] }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}