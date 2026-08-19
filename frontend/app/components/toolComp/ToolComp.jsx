// app/components/toolComp/ToolComp.jsx
"use client";

import { useState } from "react";
import { Calculator, TrendingUp, Leaf } from "lucide-react";
import ToolTabs from "./ToolTabs";
import BudgetTool from "./BudgetTool";
import CompoundTool from "./CompoundTool";
import EsgTool from "./EsgTool";

const TOOLS = [
    {
        id: "budget",
        label: "Budgeting Calculator",
        icon: Calculator,
        color: "text-blue-500",
        bg: "bg-blue-50",
    },
    {
        id: "compound",
        label: "Compound Interest",
        icon: TrendingUp,
        color: "text-emerald-500",
        bg: "bg-emerald-50",
    },
    {
        id: "esg",
        label: "ESG Comparison",
        icon: Leaf,
        color: "text-amber-500",
        bg: "bg-amber-50",
    },
];

export default function ToolComp() {
    const [activeTool, setActiveTool] = useState("budget");

    return (
        <>
            {/* Hero Section */}
            <section className="relative overflow-hidden border-b border-line-soft bg-cream-2 py-16 sm:py-20 lg:py-[88px]">
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(600px 400px at 80% 20%, rgba(67,56,202,.06), transparent 60%), radial-gradient(500px 400px at 20% 80%, rgba(99,102,241,.05), transparent 55%)",
                    }}
                />
                <div className="relative  mx-6 px-4 sm:px-6">
                    <div className="max-w-[48rem]">
                        <span className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.16em] text-brand-deep">
                            <Calculator className="h-3.5 w-3.5" strokeWidth={2.5} />
                            Interactive tools
                        </span>
                        <h1 className="mt-5 text-[2.2rem] font-extrabold leading-[1.08] tracking-tight text-ink sm:text-[2.8rem] lg:text-[3.6rem]">
                            Turn theory into numbers
                        </h1>
                        <p className="mt-4 max-w-[55ch] text-base font-medium text-ink-2 sm:text-lg">
                            Free forever, no sign-up. Everything runs in your browser your
                            numbers never leave your device.
                        </p>
                    </div>
                </div>
            </section>

            {/* Tools Section */}
            <section className="py-14 sm:py-[78px]">
                <div className="mx-6 px-4 sm:px-6">
                    <ToolTabs tools={TOOLS} activeTool={activeTool} onToolChange={setActiveTool} />

                    {activeTool === "budget" && <BudgetTool />}
                    {activeTool === "compound" && <CompoundTool />}
                    {activeTool === "esg" && <EsgTool />}
                </div>
            </section>
        </>
    );
}