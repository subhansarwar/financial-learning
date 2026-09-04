// app/components/userDashboardComp/AgendaCard.jsx
"use client";

import { useEffect } from "react";
import { GraduationCap, Monitor, Target, MoreHorizontal, BookOpen, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getUpcomingAgenda } from "../../store/userDashboard/dashboardThunks";

const SIDEBAR = "#365B50";
const TONES = ["#E0A93E", "#D9727B", "#5B7FE0"];
const AGENDA_VIEW = "week"; // card ke liye "week" ka data dikhaya ja raha hai

function iconForType(type) {
    if (type === "video") return Monitor;
    if (type === "quiz") return Target;
    if (type === "reading") return BookOpen;
    return GraduationCap;
}

export default function AgendaCard({ onViewAll }) {
    const dispatch = useAppDispatch();
    const agendaByView = useAppSelector((s) => s.dashboard.agenda);
    const agendaLoading = useAppSelector((s) => s.dashboard.agendaLoading);
    const agendaError = useAppSelector((s) => s.dashboard.agendaError);

    useEffect(() => {
        dispatch(getUpcomingAgenda({ view: AGENDA_VIEW }));
    }, [dispatch]);

    const raw = agendaByView?.[AGENDA_VIEW];
    // Card flat list dikhata hai, isliye top-level "items" use karo (max 5)
    const agenda = (raw?.items || []).slice(0, 5).map((item, idx) => ({
        id: item.lesson_id,
        title: item.title,
        subtitle: item.subtitle || item.course_title || "",
        fieldLabel: item.field_label || "Category",
        fieldValue: item.field_value || item.course_topic || "—",
        duration: item.duration_label || (item.duration_min ? `${item.duration_min} min` : "—"),
        activity: item.activity || item.type || "—",
        tone: TONES[idx % TONES.length],
        icon: iconForType(item.type),
    }));

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
                    {agendaLoading && (
                        <div className="flex items-center justify-center rounded-2xl border border-[#E5E5E5] bg-white px-5 py-12">
                            <Loader2 className="h-6 w-6 animate-spin text-[#72BB83]" strokeWidth={2.5} />
                        </div>
                    )}

                    {!agendaLoading && agendaError && (
                        <div className="py-10 text-center text-sm text-red-400">{agendaError}</div>
                    )}

                    {!agendaLoading && !agendaError && agenda.length === 0 && (
                        <div className="py-10 text-center text-sm text-gray-400">
                            No upcoming agenda items.
                        </div>
                    )}

                    {!agendaLoading && !agendaError && agenda.length > 0 && (
                        <div className="divide-y divide-gray-100">
                            {agenda.map((a) => {
                                const Icon = a.icon;
                                return (
                                    <div
                                        key={a.id}
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
                    )}
                </div>
            </div>
        </div>
    );
}