// app/admin/components/EsgEditor.jsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "@/lib/app";
import { adminApi } from "../../api/admin/utils/adminApi";

export default function EsgEditor() {
    const [esgData, setEsgData] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

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
            }
        } catch (_) {
            setEsgData('{\n  "companies": []\n}');
        } finally {
            setLoading(false);
        }
    };

    const validateJson = () => {
        try {
            const data = JSON.parse(esgData);
            if (!Array.isArray(data.companies)) {
                setMessage("Needs a 'companies' array");
                return;
            }
            setMessage(`Valid — ${data.companies.length} companies`);
        } catch (error) {
            setMessage("Invalid JSON: " + error.message);
        }
    };

    const saveEsg = async () => {
        setSaving(true);
        try {
            const data = JSON.parse(esgData);
            if (!Array.isArray(data.companies)) {
                throw new Error("Needs a 'companies' array");
            }
            await adminApi.saveEsg(data);
            setMessage(" Published!");
            toast("ESG data published ✓");
        } catch (error) {
            setMessage("" + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="admin-editor"><p>Loading ESG data...</p></div>;
    }

    return (
        <div className="admin-editor">
            <p className="text-muted" style={{ marginBottom: "12px" }}>
                JSON powering the ESG comparison tool. Each company needs: id, name, sector, e, s, g (0–100), summary.
            </p>
            <textarea
                style={{ minHeight: "420px", width: "100%", border: "1px solid var(--line)", borderRadius: "12px", padding: "14px", fontFamily: "monospace", background: "var(--cream)" }}
                value={esgData}
                onChange={(e) => setEsgData(e.target.value)}
            />
            <div style={{ display: "flex", gap: "10px", marginTop: "14px", alignItems: "center", flexWrap: "wrap" }}>
                <button className="btn btn-outline btn-sm" onClick={validateJson}>Validate JSON</button>
                <button className="btn btn-primary btn-sm" onClick={saveEsg} disabled={saving}>
                    {saving ? "Saving..." : "Save ESG data"}
                </button>
                <span className="text-muted" style={{ fontSize: ".85rem" }}>{message}</span>
            </div>
        </div>
    );
}