// app/components/adminPanelComp/AgendaCard.jsx
"use client";

import { GraduationCap, Monitor, Target, MoreHorizontal } from "lucide-react";

const SIDEBAR = "#365B50";

const AGENDA = [
    {
        title: "UX Design Foundations",
        subtitle: "Sen Janson · 27 July, 7.00–9.00 PM",
        fieldLabel: "Progress",
        fieldValue: "Lesson 4",
        duration: "60 min",
        activity: "Course",
        tone: "#E0A93E",
        icon: GraduationCap,
    },
    {
        title: "Webinar UX Design in Digital Era",
        subtitle: "Sen Janson · 27 July, 7.00–9.00 PM",
        fieldLabel: "Category",
        fieldValue: "UI/UX Design",
        duration: "90 min",
        activity: "Event",
        tone: "#D9727B",
        icon: Monitor,
    },
    {
        title: "Challenge Designer Tool Kit",
        subtitle: "Challenge · 27 July, 7.00–9.00 PM",
        fieldLabel: "Category",
        fieldValue: "UI/UX Design",
        duration: "30 min",
        activity: "Challenge",
        tone: "#5B7FE0",
        icon: Target,
    },
];

export default function AgendaCard({ onViewAll }) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 sm:text-xl">Upcoming Agenda</h2>
                <button
                    onClick={onViewAll}
                    className="flex items-center gap-1 text-xs font-bold sm:text-sm"
                    style={{ color: SIDEBAR }}
                >
                    View All <span aria-hidden>→</span>
                </button>
            </div>

            <div className="-mx-2 overflow-x-auto">
                <div className="min-w-[640px] px-2">
                    <div className="divide-y divide-gray-100">
                        {AGENDA.map((a) => {
                            const Icon = a.icon;
                            return (
                                <div
                                    key={a.title}
                                    className="grid grid-cols-[1fr_110px_100px_100px_28px] items-center gap-4 py-4"
                                >
                                    {/* Icon + title/subtitle */}
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div
                                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                                            style={{ background: `${a.tone}22` }}
                                        >
                                            <Icon className="h-5 w-5" style={{ color: a.tone }} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-bold text-gray-900">{a.title}</p>
                                            <p className="truncate text-xs text-gray-400">{a.subtitle}</p>
                                        </div>
                                    </div>

                                    {/* Progress / Category */}
                                    <div>
                                        <p className="text-[11px] text-gray-400">{a.fieldLabel}</p>
                                        <p className="text-sm font-semibold text-gray-900">{a.fieldValue}</p>
                                    </div>

                                    {/* Duration */}
                                    <div>
                                        <p className="text-[11px] text-gray-400">Duration</p>
                                        <p className="text-sm font-semibold text-gray-900">{a.duration}</p>
                                    </div>

                                    {/* Activity */}
                                    <div>
                                        <p className="text-[11px] text-gray-400">Activity</p>
                                        <p className="text-sm font-semibold text-gray-900">{a.activity}</p>
                                    </div>

                                    {/* More button */}
                                    <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}