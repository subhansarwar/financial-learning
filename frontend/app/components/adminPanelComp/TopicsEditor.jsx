// app/admin/components/TopicsEditor.jsx
"use client";

import { useState } from "react";
import { toast } from "@/lib/app";
import { adminApi } from "../../api/admin/utils/adminApi";

export default function TopicsEditor({ topics, onDataChange }) {
    const [editingTopics, setEditingTopics] = useState(topics);
    const [saving, setSaving] = useState(false);

    const updateTopic = (index, field, value) => {
        const updated = [...editingTopics];
        updated[index] = { ...updated[index], [field]: value };
        setEditingTopics(updated);
    };

    const addTopic = () => {
        setEditingTopics([
            ...editingTopics,
            { id: "topic-" + Date.now(), name: "New topic", blurb: "Short description.", icon: "📚", hue: 200 }
        ]);
    };

    const deleteTopic = (index) => {
        const topic = editingTopics[index];
        if (!confirm(`Delete topic "${topic.name}"?`)) return;
        const updated = editingTopics.filter((_, i) => i !== index);
        setEditingTopics(updated);
    };

    const saveTopics = async () => {
        setSaving(true);
        try {
            await adminApi.saveTopics(editingTopics);
            await onDataChange();
            toast("Topics published!");
        } catch (error) {
            toast("Error saving topics: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="admin-editor">
            <div>
                {editingTopics.map((t, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr 70px 90px 40px", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
                        <input value={t.id || ""} onChange={(e) => updateTopic(i, "id", e.target.value)} placeholder="id" style={{ border: "1px solid var(--line)", borderRadius: "10px", padding: "9px", background: "#fff" }} />
                        <input value={t.name || ""} onChange={(e) => updateTopic(i, "name", e.target.value)} placeholder="name" style={{ border: "1px solid var(--line)", borderRadius: "10px", padding: "9px", background: "#fff" }} />
                        <input value={t.blurb || ""} onChange={(e) => updateTopic(i, "blurb", e.target.value)} placeholder="blurb" style={{ border: "1px solid var(--line)", borderRadius: "10px", padding: "9px", background: "#fff" }} />
                        <input value={t.icon || ""} onChange={(e) => updateTopic(i, "icon", e.target.value)} placeholder="icon" style={{ border: "1px solid var(--line)", borderRadius: "10px", padding: "9px", background: "#fff" }} />
                        <input type="number" value={t.hue || 160} onChange={(e) => updateTopic(i, "hue", parseInt(e.target.value) || 160)} placeholder="hue" style={{ border: "1px solid var(--line)", borderRadius: "10px", padding: "9px", background: "#fff" }} />
                        <button className="btn btn-outline btn-sm" style={{ color: "var(--danger)" }} onClick={() => deleteTopic(i)}>✕</button>
                    </div>
                ))}
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "16px", flexWrap: "wrap" }}>
                <button className="btn btn-outline btn-sm" onClick={addTopic}>+ Add topic</button>
                <button className="btn btn-primary btn-sm" onClick={saveTopics} disabled={saving}>
                    {saving ? "Saving..." : "Save topics"}
                </button>
            </div>
        </div>
    );
}