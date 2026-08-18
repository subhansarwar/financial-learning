// app/admin/components/TopicsEditor.jsx
"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { adminApi } from "../../api/admin/utils/adminApi";
import TopicsHeader from "./TopicsHeader";
// import TopicsGrid from "./TopicsGrid";
import TopicsActions from "./TopicsActions";
import DeleteTopicModal from "./DeleteTopicModal";
import TopicCard from "./TopicCard";

export default function TopicsEditor({ topics, onDataChange }) {
    const [editingTopics, setEditingTopics] = useState(topics);
    const [saving, setSaving] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const updateTopic = (index, field, value) => {
        const updated = [...editingTopics];
        updated[index] = { ...updated[index], [field]: value };
        setEditingTopics(updated);
    };

    const addTopic = () => {
        setEditingTopics([
            ...editingTopics,
            {
                id: "topic-" + Date.now(),
                name: "New Topic",
                blurb: "Short description...",
                icon: "📚",
                hue: 200,
            },
        ]);
        toast.success("New topic added");
    };

    const confirmDelete = (index) => {
        setDeleteIndex(index);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (deleteIndex === null) return;
        const updated = editingTopics.filter((_, i) => i !== deleteIndex);
        setEditingTopics(updated);
        setShowDeleteModal(false);
        setDeleteIndex(null);
        toast.success("Topic deleted successfully");
    };

    const saveTopics = async () => {
        setSaving(true);
        try {
            await adminApi.saveTopics(editingTopics);
            await onDataChange();
            toast.success("Topics published successfully!");
        } catch (error) {
            // toast.error("Error saving topics: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    const getDeletedTopicName = () => {
        if (deleteIndex === null) return "";
        return editingTopics[deleteIndex]?.name || "Unknown";
    };

    return (
        <>
            <div className="space-y-6">
                <TopicsHeader topicCount={editingTopics.length} onAddTopic={addTopic} />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {editingTopics.map((topic, index) => (
                        <TopicCard
                            key={index}
                            topic={topic}
                            index={index}
                            onUpdate={updateTopic}
                            onDelete={confirmDelete}
                        />
                    ))}
                </div>

                <TopicsActions
                    topicCount={editingTopics.length}
                    saving={saving}
                    onSave={saveTopics}
                />
            </div>

            <DeleteTopicModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                topicName={getDeletedTopicName()}
            />
        </>
    );
}