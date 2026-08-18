// app/components/toolComp/ToolTabs.jsx
"use client";

export default function ToolTabs({ tools, activeTool, onToolChange }) {
    return (
        <div
            className="mb-8 flex flex-wrap gap-2 rounded-xl2 border border-line bg-card p-1.5 sm:gap-1"
            role="tablist"
        >
            {tools.map((tool) => {
                const Icon = tool.icon;
                const isActive = activeTool === tool.id;
                return (
                    <button
                        key={tool.id}
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => onToolChange(tool.id)}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 sm:py-3.5 ${isActive
                                ? "bg-brand-deep text-white shadow-lg"
                                : "text-ink-2 hover:bg-brand-soft/50 hover:text-brand-deep"
                            }`}
                    >
                        <Icon
                            className={`h-4 w-4 ${isActive ? "text-white" : tool.color}`}
                            strokeWidth={2.5}
                        />
                        <span className="hidden sm:inline">{tool.label}</span>
                        <span className="sm:hidden">
                            {tool.id === "budget"
                                ? "Budget"
                                : tool.id === "compound"
                                    ? "Interest"
                                    : "ESG"}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}