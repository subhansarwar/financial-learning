// app/components/toolComp/ToolTabs.jsx
"use client";

export default function ToolTabs({ tools, activeTool, onToolChange }) {
    return (
        <div
            className="mb-8 flex gap-1.5 overflow-x-auto rounded-xl border border-[#14301F]/10 bg-[#14301F]/[0.03] p-1.5 sm:mb-10 sm:gap-2"
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
                        className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-bold transition-all duration-200 sm:px-4 sm:py-3 ${isActive
                            ? "bg-[#14301F] text-white shadow-sm"
                            : "text-[#14301F]/55 hover:bg-[#72BB83]/10 hover:text-[#14301F]"
                            }`}
                    >
                        <Icon
                            className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-[#72BB83]" : "text-[#14301F]/40"}`}
                            strokeWidth={2.5}
                        />
                        <span className="hidden sm:inline">{tool.label}</span>
                        <span className="sm:hidden">{tool.shortLabel}</span>
                    </button>
                );
            })}
        </div>
    );
}