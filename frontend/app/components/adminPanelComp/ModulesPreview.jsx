// app/admin/components/ModulesPreview.jsx
"use client";

import { ChevronRight, ChevronDown, Layers, FileText } from "lucide-react";

export default function ModulesPreview({ modules, expandedModules, onToggle }) {
    if (!modules?.length) return null;

    return (
        <div className="mt-4">
            <div className="mb-2 flex items-center gap-2">
                <Layers className="h-4 w-4 text-brand" strokeWidth={2} />
                <h4 className="font-bold text-ink">Modules</h4>
                <span className="text-xs text-muted">({modules.length})</span>
            </div>
            <div className="space-y-1.5">
                {modules.map((module, idx) => (
                    <div key={module.id} className="rounded-lg border border-line-soft bg-cream-2/30 overflow-hidden">
                        <button
                            onClick={() => onToggle(module.id)}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-ink transition-colors hover:bg-cream-2/50"
                        >
                            {expandedModules[module.id] ? (
                                <ChevronDown className="h-4 w-4 text-muted" strokeWidth={2} />
                            ) : (
                                <ChevronRight className="h-4 w-4 text-muted" strokeWidth={2} />
                            )}
                            <span className="text-xs text-muted">#{idx + 1}</span>
                            <span>{module.title}</span>
                            <span className="ml-auto text-xs text-muted">{module.lessons?.length || 0} lessons</span>
                        </button>
                        {expandedModules[module.id] && (
                            <div className="border-t border-line-soft px-3 py-2">
                                {module.lessons?.map((lesson) => (
                                    <div key={lesson.id} className="flex items-center gap-2 py-1 text-xs text-ink-2">
                                        <FileText className="h-3 w-3 text-muted" strokeWidth={2} />
                                        <span>{lesson.title}</span>
                                        <span className="ml-auto text-muted">{lesson.durationMin}m</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}