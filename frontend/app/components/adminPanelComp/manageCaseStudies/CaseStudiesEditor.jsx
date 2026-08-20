// app/components/adminPanelComp/manageCaseStudies/CaseStudiesEditor.jsx
"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import CaseStudiesTable from "./caseStudiesComp/CaseStudiesTable";
import CaseStudiesViewModal from "./caseStudiesComp/CaseStudiesViewModal";
import CaseStudiesFormModal from "./caseStudiesComp/CaseStudiesFormModal";
import DeleteConfirmModal from "./caseStudiesComp/DeleteConfirmModal";
import { initialCaseStudies, nextCaseId } from "./caseStudiesComp/dummyCaseStudies";

export default function CaseStudiesEditor({ onDataChange }) {
    const [caseStudies, setCaseStudies] = useState(initialCaseStudies);
    const [viewCase, setViewCase] = useState(null);
    const [formState, setFormState] = useState({ open: false, mode: "create", case: null });
    const [deleteCase, setDeleteCase] = useState(null);

    const openCreate = () => setFormState({ open: true, mode: "create", case: null });
    const openEdit = (caseItem) => {
        setViewCase(null);
        setFormState({ open: true, mode: "edit", case: caseItem });
    };
    const closeForm = () => setFormState((s) => ({ ...s, open: false }));

    const handleSave = (data) => {
        if (formState.mode === "create") {
            const newCase = {
                ...data,
                id: nextCaseId(),
                createdAt: new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                }),
                updatedAt: new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                }),
                publishedAt: data.status === "Published"
                    ? new Date().toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                    })
                    : null,
            };
            setCaseStudies((prev) => [newCase, ...prev]);
            toast.success("Case study created successfully!");
        } else {
            const updatedCase = {
                ...data,
                updatedAt: new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                }),
                publishedAt: data.status === "Published"
                    ? new Date().toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                    })
                    : null,
            };
            setCaseStudies((prev) => prev.map((c) => (c.id === data.id ? updatedCase : c)));
            toast.success("Case study updated!");
        }
        onDataChange?.();
        closeForm();
    };

    const handleDeleteConfirm = () => {
        setCaseStudies((prev) => prev.filter((c) => c.id !== deleteCase.id));
        toast.success("Case study deleted!");
        setDeleteCase(null);
        onDataChange?.();
    };

    return (
        <>
            <CaseStudiesTable
                caseStudies={caseStudies}
                onCreateNew={openCreate}
                onView={setViewCase}
                onEdit={openEdit}
                onDelete={setDeleteCase}
            />

            <CaseStudiesViewModal
                caseStudy={viewCase}
                onClose={() => setViewCase(null)}
            />

            <CaseStudiesFormModal
                isOpen={formState.open}
                mode={formState.mode}
                initialData={formState.case}
                onClose={closeForm}
                onSave={handleSave}
            />

            <DeleteConfirmModal
                isOpen={!!deleteCase}
                onClose={() => setDeleteCase(null)}
                onConfirm={handleDeleteConfirm}
                caseTitle={deleteCase?.title}
            />
        </>
    );
}