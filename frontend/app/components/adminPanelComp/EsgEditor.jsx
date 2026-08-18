// app/admin/components/EsgEditor.jsx
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminApi } from "../../api/admin/utils/adminApi";
import {
    Leaf,
    Save,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    Database,
    Code,
    Play,
    RotateCcw,
    FileJson,
    Sparkles,
    XCircle,
    Loader2,
} from "lucide-react";

// ========== SUB-COMPONENTS ==========

// Status Badge Component
const StatusBadge = ({ type, message }) => {
    const configs = {
        success: {
            bg: "bg-emerald-50",
            text: "text-emerald-700",
            border: "border-emerald-200",
            icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" strokeWidth={2} />,
        },
        error: {
            bg: "bg-rose-50",
            text: "text-rose-700",
            border: "border-rose-200",
            icon: <XCircle className="h-4 w-4 text-rose-500" strokeWidth={2} />,
        },
        warning: {
            bg: "bg-amber-50",
            text: "text-amber-700",
            border: "border-amber-200",
            icon: <AlertCircle className="h-4 w-4 text-amber-500" strokeWidth={2} />,
        },
        info: {
            bg: "bg-blue-50",
            text: "text-blue-700",
            border: "border-blue-200",
            icon: <Sparkles className="h-4 w-4 text-blue-500" strokeWidth={2} />,
        },
    };

    const config = configs[type] || configs.info;

    return (
        <div className={`flex items-center gap-2 rounded-lg border ${config.border} ${config.bg} px-3 py-2`}>
            {config.icon}
            <span className={`text-sm font-medium ${config.text}`}>
                {message || "Ready to edit"}
            </span>
        </div>
    );
};

// Action Button Component
const ActionButton = ({ icon: Icon, label, onClick, variant = "outline", disabled = false, loading = false }) => {
    const baseStyles = "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold transition-all duration-200";

    const variants = {
        outline: `border border-line text-ink-2 hover:border-brand/40 hover:bg-brand-soft/30 hover:text-brand-deep ${disabled ? "opacity-50 cursor-not-allowed hover:border-line hover:bg-transparent hover:text-ink-2" : ""}`,
        primary: `bg-brand-deep text-white hover:bg-[#241f6b] ${disabled ? "opacity-50 cursor-not-allowed hover:bg-brand-deep" : "hover:shadow-md"}`,
        danger: `border border-rose-200 text-rose-600 hover:border-rose-300 hover:bg-rose-50 ${disabled ? "opacity-50 cursor-not-allowed hover:border-rose-200 hover:bg-transparent hover:text-rose-600" : ""}`,
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${variants[variant]}`}
        >
            {loading ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" strokeWidth={2.5} />
            ) : (
                <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
            )}
            {loading ? "" : label}
        </button>
    );
};

// ========== MAIN COMPONENT ==========

export default function EsgEditor() {
    const [esgData, setEsgData] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [validating, setValidating] = useState(false);
    const [formatting, setFormatting] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("info");

    useEffect(() => {
        loadEsgData();
    }, []);

    const loadEsgData = async () => {
        setLoading(true);

        try {
            const response = await fetch("/data/esg.json");
            if (response.ok) {
                const data = await response.json();
                setEsgData(JSON.stringify(data, null, 2));
                const count = data.companies?.length || 0;
                toast.success(`Loaded ${count} companies`);
            } else {
                throw new Error("Failed to fetch");
            }
        } catch (_) {
            setEsgData('{\n  "companies": []\n}');
        } finally {
            setLoading(false);
        }
    };

    const validateJson = () => {
        setValidating(true);

        setTimeout(() => {
            try {
                const data = JSON.parse(esgData);

                if (!Array.isArray(data.companies)) {
                    toast.error("Invalid JSON: Missing 'companies' array");
                    setValidating(false);
                    return;
                }

                const errors = [];
                data.companies.forEach((c, i) => {
                    if (!c.id) errors.push(`Company ${i + 1}: missing id`);
                    if (!c.name) errors.push(`Company ${i + 1}: missing name`);
                    if (typeof c.e !== "number") errors.push(`Company ${i + 1}: missing e (number)`);
                    if (typeof c.s !== "number") errors.push(`Company ${i + 1}: missing s (number)`);
                    if (typeof c.g !== "number") errors.push(`Company ${i + 1}: missing g (number)`);
                    if (!c.summary) errors.push(`Company ${i + 1}: missing summary`);
                });

                if (errors.length > 0) {
                    const errorMsg = errors.slice(0, 3).join(", ") + (errors.length > 3 ? `... (${errors.length} total)` : "");
                    setValidating(false);
                    return;
                }
                toast.success(`Valid JSON with ${data.companies.length} companies`);
            } catch (error) {
            } finally {
                setValidating(false);
            }
        }, 300);
    };

    const formatJson = () => {
        setFormatting(true);

        setTimeout(() => {
            try {
                const data = JSON.parse(esgData);
                setEsgData(JSON.stringify(data, null, 2));
                toast.success("JSON formatted");
            } catch (error) {
            } finally {
                setFormatting(false);
            }
        }, 300);
    };

    const saveEsg = async () => {
        setSaving(true);
        try {
            const data = JSON.parse(esgData);

            if (!Array.isArray(data.companies)) {
                throw new Error("Needs a 'companies' array");
            }

            // Validate before saving
            const errors = [];
            data.companies.forEach((c, i) => {
                if (!c.id) errors.push(`Company ${i + 1}: missing id`);
                if (!c.name) errors.push(`Company ${i + 1}: missing name`);
            });

            if (errors.length > 0) {
                throw new Error(`Validation failed: ${errors.join(", ")}`);
            }

            await adminApi.saveEsg(data);
            toast.success("ESG data published successfully!");
        } catch (error) {
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 flex-col items-center justify-center">
                <Loader2 className="mb-3 h-8 w-8 animate-spin text-brand" strokeWidth={2} />
                <p className="text-sm text-muted">Loading ESG data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <div className="rounded-full bg-emerald-50 p-2.5">
                        <Leaf className="h-5 w-5 text-emerald-500" strokeWidth={2} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-ink sm:text-xl">ESG Data Editor</h3>
                        <p className="text-xs text-muted">Manage ESG comparison tool data</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
                        JSON
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <ActionButton
                        icon={Play}
                        label="Validate"
                        onClick={validateJson}
                        disabled={validating || saving}
                        loading={validating}
                    />
                    <ActionButton
                        icon={Code}
                        label="Format"
                        onClick={formatJson}
                        disabled={formatting || saving}
                        loading={formatting}
                    />
                    <ActionButton
                        icon={RotateCcw}
                        label="Reset"
                        onClick={loadEsgData}
                        disabled={loading || saving}
                    />
                    <ActionButton
                        icon={Save}
                        label="Save"
                        onClick={saveEsg}
                        variant="primary"
                        disabled={saving}
                        loading={saving}
                    />
                </div>
            </div>

            {/* Info Box */}
            <div className="rounded-lg bg-brand-soft/50 p-3 border border-brand-soft/30">
                <div className="flex items-start gap-2.5">
                    <div className="rounded-full bg-brand-soft p-1.5 mt-0.5">
                        <Database className="h-4 w-4 text-brand-deep" strokeWidth={2} />
                    </div>
                    <div>
                        <p className="text-xs text-ink-2">
                            <span className="font-bold text-ink">JSON format:</span> Each company needs:{" "}
                            <code className="rounded bg-white/50 px-1.5 py-0.5 font-mono text-xs font-bold text-brand">id</code>,{" "}
                            <code className="rounded bg-white/50 px-1.5 py-0.5 font-mono text-xs font-bold text-brand">name</code>,{" "}
                            <code className="rounded bg-white/50 px-1.5 py-0.5 font-mono text-xs font-bold text-brand">sector</code>,{" "}
                            <code className="rounded bg-white/50 px-1.5 py-0.5 font-mono text-xs font-bold text-brand">e</code>,{" "}
                            <code className="rounded bg-white/50 px-1.5 py-0.5 font-mono text-xs font-bold text-brand">s</code>,{" "}
                            <code className="rounded bg-white/50 px-1.5 py-0.5 font-mono text-xs font-bold text-brand">g</code> (0–100),{" "}
                            <code className="rounded bg-white/50 px-1.5 py-0.5 font-mono text-xs font-bold text-brand">summary</code>
                        </p>
                    </div>
                </div>
            </div>

            {/* Editor */}
            <div className="relative rounded-xl2 border border-line overflow-hidden">
                <div className="absolute top-2 right-3 flex items-center gap-1.5 text-xs text-muted">
                    <FileJson className="h-3.5 w-3.5" strokeWidth={2} />
                    <span>{esgData.split('\n').length} lines</span>
                </div>
                <textarea
                    rows={18}
                    value={esgData}
                    onChange={(e) => setEsgData(e.target.value)}
                    className="w-full font-mono text-sm bg-cream-2/30 px-4 py-3 pr-24 text-ink placeholder:text-muted focus:outline-none resize-none"
                    spellCheck="false"
                    disabled={saving}
                />
            </div>

            {/* Status */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <StatusBadge type={messageType} message={message} />

                <div className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" strokeWidth={2} />
                    <p className="text-xs text-muted">
                        Changes apply immediately to the ESG comparison tool.
                    </p>
                </div>
            </div>
        </div>
    );
}