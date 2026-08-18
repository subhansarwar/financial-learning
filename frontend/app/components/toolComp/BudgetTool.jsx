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

const COLORS = ["#6366f1", "#f59e0b", "#10b981"];

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
        return "bg-emerald-50 text-emerald-700";
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
                {/* Form */}
                <div className="rounded-xl2 border border-line bg-card p-6 shadow-sm sm:p-8">
                    <div className="mb-6 flex items-center gap-2.5">
                        <div className="rounded-full bg-blue-50 p-2">
                            <Wallet className="h-5 w-5 text-blue-500" strokeWidth={2} />
                        </div>
                        <h2 className="text-lg font-bold text-ink">Your monthly budget</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-1.5 flex items-center gap-2 text-sm font-bold text-ink-2">
                                <DollarSign className="h-4 w-4 text-muted" strokeWidth={2} />
                                Monthly take-home income
                            </label>
                            <input
                                type="number"
                                value={budget.income}
                                onChange={(e) => setBudget({ ...budget, income: +e.target.value })}
                                min="0"
                                step="50"
                                className="w-full rounded-lg border border-line bg-cream-2/50 px-4 py-2.5 text-sm font-medium text-ink focus:border-brand/50 focus:outline-none focus:ring-4 focus:ring-brand/15"
                            />
                            <p className="mt-1.5 text-xs text-muted">After tax, in your currency.</p>
                        </div>

                        <div>
                            <label className="mb-1.5 flex items-center gap-2 text-sm font-bold text-ink-2">
                                <Home className="h-4 w-4 text-indigo-500" strokeWidth={2} />
                                Needs — rent, bills, groceries (%)
                            </label>
                            <input
                                type="number"
                                value={budget.needs}
                                onChange={(e) => setBudget({ ...budget, needs: +e.target.value })}
                                min="0"
                                max="100"
                                className="w-full rounded-lg border border-line bg-cream-2/50 px-4 py-2.5 text-sm font-medium text-ink focus:border-brand/50 focus:outline-none focus:ring-4 focus:ring-brand/15"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 flex items-center gap-2 text-sm font-bold text-ink-2">
                                <Coffee className="h-4 w-4 text-amber-500" strokeWidth={2} />
                                Wants — fun, eating out (%)
                            </label>
                            <input
                                type="number"
                                value={budget.wants}
                                onChange={(e) => setBudget({ ...budget, wants: +e.target.value })}
                                min="0"
                                max="100"
                                className="w-full rounded-lg border border-line bg-cream-2/50 px-4 py-2.5 text-sm font-medium text-ink focus:border-brand/50 focus:outline-none focus:ring-4 focus:ring-brand/15"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 flex items-center gap-2 text-sm font-bold text-ink-2">
                                <PiggyBank className="h-4 w-4 text-emerald-500" strokeWidth={2} />
                                Savings & extra debt payments (%)
                            </label>
                            <input
                                type="number"
                                value={budget.save}
                                onChange={(e) => setBudget({ ...budget, save: +e.target.value })}
                                min="0"
                                max="100"
                                className="w-full rounded-lg border border-line bg-cream-2/50 px-4 py-2.5 text-sm font-medium text-ink focus:border-brand/50 focus:outline-none focus:ring-4 focus:ring-brand/15"
                            />
                        </div>

                        <div className={`mt-2 rounded-lg p-3 text-sm ${getWarningColor()}`}>
                            <span className="flex items-start gap-2">
                                <WarningIcon />
                                <span>{result.warning || "Perfect 50/30/20 split!"}</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Results with Chart */}
                <div className="rounded-xl2 border border-line bg-card p-6 shadow-sm sm:p-8">
                    <div className="mb-6 flex items-center gap-2.5">
                        <div className="rounded-full bg-emerald-50 p-2">
                            <PieChart className="h-5 w-5 text-emerald-500" strokeWidth={2} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-muted">
                            Your monthly plan
                        </span>
                    </div>

                    {/* Chart */}
                    <div className="h-[220px] w-full">
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
                                        border: "1px solid #e2e5ef",
                                        borderRadius: "12px",
                                        padding: "8px 12px",
                                    }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    formatter={(value, entry) => {
                                        const item = result.data.find((d) => d.name === value);
                                        return `${value} (${item?.percentage || 0}%)`;
                                    }}
                                />
                            </RePieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Breakdown */}
                    <div className="mt-4 space-y-3">
                        {result.data.map((item, index) => (
                            <div key={item.name} className="rounded-lg bg-cream-2/50 p-3">
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-sm font-medium text-ink-2">
                                        <span className="h-3 w-3 rounded-full" style={{ background: COLORS[index] }} />
                                        {item.name} ({item.percentage}%)
                                    </span>
                                    <span className="text-lg font-bold" style={{ color: COLORS[index] }}>
                                        {formatCurrency(item.value)}
                                    </span>
                                </div>
                                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-cream-2">
                                    <div
                                        className="h-full rounded-full transition-all duration-300"
                                        style={{
                                            width: `${item.percentage}%`,
                                            background: COLORS[index],
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 rounded-lg border-l-4 border-brand bg-brand-soft/50 p-4">
                        <div className="flex items-start gap-2">
                            <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" strokeWidth={2} />
                            <div className="text-sm text-ink-2">
                                <span className="font-bold">50/30/20 rule:</span> The classic starting point.
                                High-rent city? Trim wants first — keep the savings habit alive, even at 5%.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}