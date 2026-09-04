"use client";
import {
    ArrowLeft, CalendarClock, ChevronLeft, ChevronRight,
    MonitorPlay, MoreHorizontal, Target,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getUpcomingAgenda } from "../../store/userDashboard/dashboardThunks";

// ===== THEME TOKENS =====
const LEARNING = "#34C79D";
const TONES = ["#E0A93E", "#D9727B", "#5B7FE0"];
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December",
];
const RANGE_TABS = ["Day", "Week", "Month"];
const START_HOUR = 7;
const END_HOUR = 13;
const HOUR_WIDTH_DESKTOP = 176;
const HOUR_WIDTH_MOBILE = 128;
const CARD_MIN_RATIO = 0.8;

function toKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function formatHour(h) {
    const hour = h % 24;
    return `${String(hour).padStart(2, "0")}.00`;
}
function formatClock(h, m) {
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}${m ? ":" + String(m).padStart(2, "0") : ".00"} ${period}`;
}
function buildMonthGrid(year, month) {
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = (firstOfMonth.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const cells = [];
    for (let i = startOffset; i > 0; i--) {
        cells.push({ day: daysInPrevMonth - i + 1, current: false, date: new Date(year, month - 1, daysInPrevMonth - i + 1) });
    }
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({ day: d, current: true, date: new Date(year, month, d) });
    }
    let nextDay = 1;
    while (cells.length % 7 !== 0 || cells.length < 42) {
        cells.push({ day: nextDay, current: false, date: new Date(year, month + 1, nextDay) });
        nextDay += 1;
        if (cells.length >= 42) break;
    }
    return cells;
}
function useIsNarrowViewport(breakpointPx = 640) {
    const [isNarrow, setIsNarrow] = useState(false);
    useEffect(() => {
        if (typeof window === "undefined") return;
        const mql = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);
        const update = () => setIsNarrow(mql.matches);
        update();
        mql.addEventListener("change", update);
        return () => mql.removeEventListener("change", update);
    }, [breakpointPx]);
    return isNarrow;
}

// API `days[]` ko events-map (dateKey -> items[]) mein convert karta hai
function transformAgendaResponse(apiRes) {
    const iconForType = (type) => {
        if (type === "video") return MonitorPlay;
        if (type === "quiz") return Target;
        return CalendarClock;
    };
    const map = {};
    (apiRes?.days || []).forEach((day) => {
        // day.date => "2026-09-04" — local dateKey se match karne ke liye direct use karo
        map[day.date] = (day.items || []).map((item, idx) => {
            const start = item.scheduled_start ? new Date(item.scheduled_start) : null;
            const end = item.scheduled_end ? new Date(item.scheduled_end) : null;
            return {
                id: item.lesson_id,
                title: item.title,
                subtitle: item.subtitle || item.course_title || "",
                startHour: start ? start.getHours() : START_HOUR,
                startMin: start ? start.getMinutes() : 0,
                endHour: end ? end.getHours() : START_HOUR + 1,
                endMin: end ? end.getMinutes() : 0,
                tone: TONES[idx % TONES.length],
                icon: iconForType(item.type),
            };
        });
    });
    return map;
}

const RANGE_TO_VIEW = { Day: "day", Week: "week", Month: "month" };

export default function AgendaFullView({ onBack }) {
    const dispatch = useAppDispatch();
    const agendaByView = useAppSelector((s) => s.dashboard.agenda);
    const agendaLoading = useAppSelector((s) => s.dashboard.agendaLoading);
    const agendaError = useAppSelector((s) => s.dashboard.agendaError);

    const today = useMemo(() => {
        const t = new Date();
        t.setHours(0, 0, 0, 0);
        return t;
    }, []);

    const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [selectedDate, setSelectedDate] = useState(today);
    const [range, setRange] = useState("Month");
    const scrollRef = useRef(null);
    const isNarrow = useIsNarrowViewport();

    const view = RANGE_TO_VIEW[range];

    // Jab bhi view (Day/Week/Month tab) badle, API se fresh fetch karo — koi cache nahi
    useEffect(() => {
        dispatch(getUpcomingAgenda({ view }));
    }, [view, dispatch]);

    const rawAgenda = agendaByView?.[view];
    const events = useMemo(() => transformAgendaResponse(rawAgenda), [rawAgenda]);

    const cells = useMemo(() => buildMonthGrid(cursor.getFullYear(), cursor.getMonth()), [cursor]);
    const dayEvents = events[toKey(selectedDate)] || [];
    const hours = useMemo(() => {
        const arr = [];
        for (let h = START_HOUR; h <= END_HOUR; h++) arr.push(h);
        return arr;
    }, []);
    const HOUR_WIDTH = isNarrow ? HOUR_WIDTH_MOBILE : HOUR_WIDTH_DESKTOP;
    const totalWidth = (END_HOUR - START_HOUR) * HOUR_WIDTH;
    const cardMinWidth = HOUR_WIDTH * CARD_MIN_RATIO;

    const changeMonth = (delta) => {
        setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));
    };

    return (
        <div className="w-full rounded-2xl border border-gray-200 bg-white p-3 shadow-sm xs:p-4 sm:p-6">
            {/* ===== HEADER ===== */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 sm:mb-6">
                <div className="flex min-w-0 items-center gap-2">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            aria-label="Back to overview"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </button>
                    )}
                    <h2 className="truncate text-base font-bold text-gray-900 sm:text-lg lg:text-xl">
                        Upcoming Agenda
                    </h2>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr] xl:grid-cols-[280px_1fr]">
                {/* ===== LEFT: DATE + ACTIVITY ===== */}
                <div className="space-y-6">
                    <div>
                        <h3 className="mb-3 text-sm font-bold text-gray-900">Date</h3>
                        <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:p-4">
                            <div className="mb-3 flex items-center justify-between">
                                <span className="text-sm font-bold text-gray-900">
                                    {MONTH_NAMES[cursor.getMonth()]} {cursor.getFullYear()}
                                </span>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => changeMonth(-1)} className="flex h-6 w-6 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100" aria-label="Previous month">
                                        <ChevronLeft className="h-3.5 w-3.5" />
                                    </button>
                                    <button onClick={() => changeMonth(1)} className="flex h-6 w-6 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100" aria-label="Next month">
                                        <ChevronRight className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-7 gap-y-1 text-center">
                                {WEEKDAYS.map((w) => (
                                    <span key={w} className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                                        {w[0]}
                                    </span>
                                ))}
                                {cells.map((cell, i) => {
                                    const key = toKey(cell.date);
                                    const isSelected = key === toKey(selectedDate);
                                    const isToday = key === toKey(today);
                                    const hasEvents = Boolean(events[key]?.length);
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => cell.current && setSelectedDate(cell.date)}
                                            disabled={!cell.current}
                                            className={`relative mx-auto flex aspect-square w-full max-w-[32px] items-center justify-center rounded-full text-xs font-semibold transition-colors ${!cell.current ? "text-gray-300" : "text-gray-700 hover:bg-gray-100"} ${isSelected ? "text-white hover:bg-transparent" : ""} ${isToday && !isSelected ? "ring-1 ring-inset" : ""}`}
                                            style={{
                                                background: isSelected ? LEARNING : "transparent",
                                                ...(isToday && !isSelected ? { boxShadow: `inset 0 0 0 1.5px ${LEARNING}` } : {}),
                                            }}
                                        >
                                            {cell.day}
                                            {hasEvents && cell.current && (
                                                <span
                                                    className="absolute -bottom-1 h-1 w-1 rounded-full"
                                                    style={{ background: isSelected ? "#ffffff" : LEARNING }}
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-3 text-sm font-bold text-gray-900">Activity</h3>
                        <div className="space-y-2">
                            {agendaLoading && (
                                <div className="rounded-2xl border border-dashed border-gray-200 p-4 text-center text-xs text-gray-400">
                                    Loading...
                                </div>
                            )}
                            {!agendaLoading && agendaError && (
                                <div className="rounded-2xl border border-dashed border-red-200 p-4 text-center text-xs text-red-400">
                                    {agendaError}
                                </div>
                            )}
                            {!agendaLoading && !agendaError && dayEvents.length === 0 && (
                                <div className="rounded-2xl border border-dashed border-gray-200 p-4 text-center text-xs text-gray-400">
                                    Nothing scheduled for this day.
                                </div>
                            )}
                            {!agendaLoading && dayEvents.map((ev) => (
                                <div key={ev.id} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ background: `${ev.tone}22` }}>
                                        <ev.icon className="h-4 w-4" style={{ color: ev.tone }} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-bold text-gray-900">{ev.title}</p>
                                        <p className="truncate text-xs text-gray-400">{ev.subtitle}</p>
                                    </div>
                                    <button className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ===== RIGHT: TIME TABLE ===== */}
                <div className="min-w-0">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-sm font-bold text-gray-900">Time Table</h3>
                        <div className="flex items-center gap-1 rounded-full bg-gray-100 p-1">
                            {RANGE_TABS.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setRange(tab)}
                                    className={`rounded-full px-2.5 py-1.5 text-xs font-bold transition-colors sm:px-3 ${range === tab ? "text-white" : "text-gray-500 hover:text-gray-700"}`}
                                    style={{ background: range === tab ? LEARNING : "transparent" }}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div
                        ref={scrollRef}
                        className="overflow-x-auto rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:p-4 scrollbar-hide"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
                    >
                        <div className="relative" style={{ width: totalWidth, minHeight: 260 }}>
                            <div className="relative flex text-xs font-semibold text-gray-400" style={{ height: 20 }}>
                                {hours.map((h) => (
                                    <div key={h} style={{ width: HOUR_WIDTH }} className="shrink-0">
                                        {formatHour(h)}
                                    </div>
                                ))}
                            </div>
                            <div className="absolute inset-x-0 top-6 bottom-0">
                                {hours.map((h, i) => (
                                    <div key={h} className="absolute top-0 bottom-0 border-l border-gray-100" style={{ left: i * HOUR_WIDTH }} />
                                ))}
                            </div>
                            <div className="relative mt-4" style={{ height: 220 }}>
                                {dayEvents.map((ev, idx) => {
                                    const startMin = (ev.startHour - START_HOUR) * 60 + ev.startMin;
                                    const endMin = (ev.endHour - START_HOUR) * 60 + ev.endMin;
                                    const left = (startMin / 60) * HOUR_WIDTH;
                                    const width = ((endMin - startMin) / 60) * HOUR_WIDTH;
                                    const top = (idx % 2) * 110;
                                    return (
                                        <div
                                            key={ev.id}
                                            className="absolute rounded-2xl p-3 shadow-sm"
                                            style={{ left, width: Math.max(width, cardMinWidth), top, background: `${ev.tone}1f` }}
                                        >
                                            <div className="mb-2 flex items-center justify-between gap-2">
                                                <span className="truncate rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-bold" style={{ color: ev.tone }}>
                                                    {formatClock(ev.startHour, ev.startMin)} - {formatClock(ev.endHour, ev.endMin)}
                                                </span>
                                                <button className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-white/60">
                                                    <MoreHorizontal className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                            <p className="line-clamp-2 text-sm font-bold text-gray-900">{ev.title}</p>
                                            <p className="mt-1 truncate text-xs text-gray-500">{ev.subtitle}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}