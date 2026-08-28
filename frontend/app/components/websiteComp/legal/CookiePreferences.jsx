// app/components/websiteComp/legal/CookiePreferences.jsx
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Cookie, Lock, RotateCcw, Save, ShieldCheck } from "lucide-react";

const STORAGE_KEY = "ecolens.cookiePrefs";

const CATEGORIES = [
    {
        id: "essential",
        label: "Strictly necessary",
        locked: true,
        desc: "Keeps you signed in, remembers your place in a course and secures form submissions. The platform cannot run without these.",
    },
    {
        id: "preferences",
        label: "Preferences",
        locked: false,
        desc: "Remembers choices like your dashboard layout, language and whether you have dismissed a banner.",
    },
    {
        id: "analytics",
        label: "Analytics",
        locked: false,
        desc: "Privacy-friendly, aggregated usage stats that tell us which lessons are working and where learners drop off.",
    },
    {
        id: "marketing",
        label: "Marketing",
        locked: false,
        desc: "Measures whether a campaign or partner link brought you here. Off by default — we do not sell data or run ad networks.",
    },
];

const DEFAULTS = {
    essential: true,
    preferences: true,
    analytics: false,
    marketing: false,
};

export default function CookiePreferences() {
    const [prefs, setPrefs] = useState(DEFAULTS);
    const [savedAt, setSavedAt] = useState(null);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                setPrefs({ ...DEFAULTS, ...parsed.prefs, essential: true });
                setSavedAt(parsed.savedAt || null);
            }
        } catch {
            /* ignore corrupt storage */
        }
    }, []);

    const toggle = (id) => {
        setPrefs((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const persist = (next, message) => {
        const payload = { prefs: next, savedAt: new Date().toISOString() };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
            setSavedAt(payload.savedAt);
            toast.success(message);
        } catch {
            toast.error("Your browser blocked local storage, so we couldn't save that.");
        }
    };

    const save = () => persist(prefs, "Cookie preferences saved on this device.");

    const acceptAll = () => {
        const next = { essential: true, preferences: true, analytics: true, marketing: true };
        setPrefs(next);
        persist(next, "All cookies enabled.");
    };

    const rejectAll = () => {
        const next = { ...DEFAULTS, preferences: false, analytics: false, marketing: false };
        setPrefs(next);
        persist(next, "Non-essential cookies turned off.");
    };

    return (
        <div className="overflow-hidden rounded-3xl border border-[#E5E5E5] bg-white shadow-[0_24px_60px_-40px_rgba(20,48,31,0.4)]">
            <div className="flex items-start gap-3 border-b border-[#E5E5E5]/70 bg-[#F8FAF9] px-6 py-5 sm:px-8">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#72BB83]/12">
                    <Cookie className="h-5 w-5 text-[#72BB83]" strokeWidth={2} />
                </span>
                <div>
                    <h2 className="text-[17px] font-bold tracking-tight text-[#14301F]">
                        Manage your cookie preferences
                    </h2>
                    <p className="mt-1 text-[13.5px] font-normal leading-[1.6] text-[#14301F]/65">
                        Changes apply to this browser and take effect immediately. You can
                        return to this page any time to update them.
                    </p>
                </div>
            </div>

            <div className="divide-y divide-[#E5E5E5]/70">
                {CATEGORIES.map((cat) => {
                    const on = prefs[cat.id];
                    return (
                        <div
                            key={cat.id}
                            className="flex items-start justify-between gap-4 px-6 py-5 sm:px-8"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-[14.5px] font-bold text-[#14301F]">
                                        {cat.label}
                                    </h3>
                                    {cat.locked && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-[#14301F]/8 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#14301F]/60">
                                            <Lock className="h-2.5 w-2.5" strokeWidth={2.5} />
                                            Always on
                                        </span>
                                    )}
                                </div>
                                <p className="mt-1 text-[13px] font-normal leading-[1.6] text-[#14301F]/65">
                                    {cat.desc}
                                </p>
                            </div>

                            <button
                                type="button"
                                role="switch"
                                aria-checked={on}
                                aria-label={`Toggle ${cat.label} cookies`}
                                disabled={cat.locked}
                                onClick={() => !cat.locked && toggle(cat.id)}
                                className={`relative mt-0.5 h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-300 ${on ? "bg-[#72BB83]" : "bg-[#14301F]/15"
                                    } ${cat.locked ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
                            >
                                <span
                                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${on ? "translate-x-5" : "translate-x-0"
                                        }`}
                                />
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-col gap-3 border-t border-[#E5E5E5]/70 bg-[#F8FAF9] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                <span className="flex items-center gap-1.5 text-[12px] font-medium text-[#14301F]/55">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#72BB83]" strokeWidth={2.25} />
                    {savedAt
                        ? `Saved ${new Date(savedAt).toLocaleDateString()}`
                        : "No preference saved yet"}
                </span>

                <div className="flex flex-wrap items-center gap-2.5">
                    <button
                        type="button"
                        onClick={rejectAll}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E5E5] bg-white px-4 py-2 text-[12.5px] font-bold text-[#14301F]/70 transition-colors hover:border-[#72BB83]/40 hover:text-[#14301F]"
                    >
                        <RotateCcw className="h-3.5 w-3.5 text-[#72BB83]" strokeWidth={2.5} />
                        Reject non-essential
                    </button>
                    <button
                        type="button"
                        onClick={acceptAll}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E5E5] bg-white px-4 py-2 text-[12.5px] font-bold text-[#14301F]/70 transition-colors hover:border-[#72BB83]/40 hover:text-[#14301F]"
                    >
                        Accept all
                    </button>
                    <button
                        type="button"
                        onClick={save}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#14301F] px-5 py-2 text-[12.5px] font-bold text-white transition-colors hover:bg-[#72BB83]"
                    >
                        <Save className="h-3.5 w-3.5" strokeWidth={2.5} />
                        Save choices
                    </button>
                </div>
            </div>
        </div>
    );
}
