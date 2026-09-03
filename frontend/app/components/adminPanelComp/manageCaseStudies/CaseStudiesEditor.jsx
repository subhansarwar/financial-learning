// app/components/adminPanelComp/manageCaseStudies/CaseStudiesEditor.jsx
"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    clearCurrentCaseStudy,
    clearError,
} from "../../../store/admin/caseStudy/caseStudiesSlice";
import {
    createCaseStudy,
    deleteCaseStudy,
    getAllCaseStudies,
    updateCaseStudy
} from "../../../store/admin/caseStudy/caseStudiesThunks";
import CaseStudiesFormModal from "./caseStudiesComp/CaseStudiesFormModal";
import CaseStudiesTable from "./caseStudiesComp/CaseStudiesTable";
import CaseStudiesViewModal from "./caseStudiesComp/CaseStudiesViewModal";
import DeleteConfirmModal from "./caseStudiesComp/DeleteConfirmModal";

export default function CaseStudiesEditor({ onDataChange }) {
    const dispatch = useDispatch();
    const {
        caseStudies,
        loading,
        error,
        pagination,
        loadingCreate,
        loadingUpdate,
        loadingDelete,
    } = useSelector((state) => state.caseStudies);

    const [viewCase, setViewCase] = useState(null);
    const [formState, setFormState] = useState({ open: false, mode: "create", case: null });
    const [deleteCase, setDeleteCase] = useState(null);

    // Fetch case studies on mount and when pagination changes
    useEffect(() => {
        dispatch(getAllCaseStudies({
            skip: pagination.skip || 0,
            limit: pagination.limit || 50,
        }));
    }, [dispatch, pagination.skip, pagination.limit]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            dispatch(clearError());
            dispatch(clearCurrentCaseStudy());
        };
    }, [dispatch]);

    const openCreate = () => {
        setFormState({ open: true, mode: "create", case: null });
    };

    const openEdit = (caseItem) => {
        setViewCase(null);
        setFormState({ open: true, mode: "edit", case: caseItem });
    };

    const closeForm = () => setFormState((s) => ({ ...s, open: false }));

    const prepareCaseData = (data, isEdit = false) => {
        return {
            slug: data?.slug || data?.title?.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
            title: data?.title?.trim() || "Untitled Case Study",
            summary: data?.shortDescription?.trim() || "Case study summary",
            content: data?.introduction?.trim() || "",
            industry: data?.category || data?.industry || "General",
            tags: data?.tags || [],
            thumbnail_url: data?.coverImageName || data?.thumbnail_url || "",
            is_published: data?.status === "Published" ? true : false,
        };
    };

    const handleSave = async (data, isCreateMode = false) => {
        try {
            let result;
            if (isCreateMode || formState.mode === "create") {
                const caseData = prepareCaseData(data, false);
                result = await dispatch(createCaseStudy(caseData)).unwrap();

                if (isCreateMode) {
                    return result;
                }

                await dispatch(getAllCaseStudies({
                    skip: pagination.skip || 0,
                    limit: pagination.limit || 50,
                })).unwrap();
            } else {
                const updateData = prepareCaseData(data, true);
                result = await dispatch(updateCaseStudy({
                    id: data?.id,
                    updateData,
                })).unwrap();

                await dispatch(getAllCaseStudies({
                    skip: pagination.skip || 0,
                    limit: pagination.limit || 50,
                })).unwrap();
            }

            onDataChange?.();
            closeForm();
            return result;
        } catch (error) {
            throw error;
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await dispatch(deleteCaseStudy(deleteCase.id)).unwrap();
            await dispatch(getAllCaseStudies({
                skip: pagination.skip || 0,
                limit: pagination.limit || 50,
            })).unwrap();
            setDeleteCase(null);
            onDataChange?.();
        } catch (error) {
        }
    };

    return (
        <>
            <CaseStudiesTable
                caseStudies={caseStudies}
                onCreateNew={openCreate}
                onView={setViewCase}
                onEdit={openEdit}
                onDelete={setDeleteCase}
                loading={loading}
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
                isLoading={loadingCreate || loadingUpdate}
            />

            <DeleteConfirmModal
                isOpen={!!deleteCase}
                onClose={() => setDeleteCase(null)}
                onConfirm={handleDeleteConfirm}
                caseTitle={deleteCase?.title}
                isLoading={loadingDelete}
            />
        </>
    );
}