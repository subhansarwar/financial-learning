// app/components/adminPanelComp/manageResearch/ResearchEditor.jsx
"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import ResearchTable from "./researchComp/ResearchTable";
import ResearchViewModal from "./researchComp/ResearchViewModal";
import DeleteConfirmModal from "./researchComp/DeleteConfirmModal";
import { initialResearch } from "./researchComp/dummyResearch";

export default function ResearchEditor({ onDataChange }) {
    const [research, setResearch] = useState(initialResearch);
    const [viewPaper, setViewPaper] = useState(null);
    const [deletePaper, setDeletePaper] = useState(null);

    const handleApprove = (paper) => {
        setResearch((prev) =>
            prev.map((p) =>
                p.id === paper.id ? { ...p, status: "Approved" } : p
            )
        );
        toast.success(`${paper.title} approved!`);
        onDataChange?.();
    };

    const handleReject = (paper) => {
        setResearch((prev) =>
            prev.map((p) =>
                p.id === paper.id ? { ...p, status: "Rejected" } : p
            )
        );
        toast.success(`${paper.title} rejected.`);
        onDataChange?.();
    };

    const handleDeleteConfirm = () => {
        setResearch((prev) => prev.filter((p) => p.id !== deletePaper.id));
        toast.success("Research paper deleted!");
        setDeletePaper(null);
        onDataChange?.();
    };

    return (
        <>
            <ResearchTable
                research={research}
                onView={setViewPaper}
                onDelete={setDeletePaper}
                onApprove={handleApprove}
                onReject={handleReject}
            />

            <ResearchViewModal
                paper={viewPaper}
                onClose={() => setViewPaper(null)}
                onApprove={handleApprove}
                onReject={handleReject}
            />

            <DeleteConfirmModal
                isOpen={!!deletePaper}
                onClose={() => setDeletePaper(null)}
                onConfirm={handleDeleteConfirm}
                paperTitle={deletePaper?.title}
            />
        </>
    );
}