// app/components/adminPanelComp/manageCaseStudies/CaseStudiesEditor.jsx
"use client";

import { useEffect, useState } from "react";
import {
    clearCurrentCaseStudy,
    clearError,
    setCaseStudies,
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
import { useAppDispatch, useAppSelector } from "../../../store/hooks";

const CACHE_KEY = "admin_case_studies_list";

export default function CaseStudiesEditor({ onDataChange }) {
    const dispatch = useAppDispatch();
    const {
        caseStudies,
        loading,
        error,
        pagination,
        loadingCreate,
        loadingUpdate,
        loadingDelete,
    } = useAppSelector((state) => state.caseStudies);

    const [viewCase, setViewCase] = useState(null);
    const [formState, setFormState] = useState({ open: false, mode: "create", case: null });
    const [deleteCase, setDeleteCase] = useState(null);
    const [hasHydratedFromCache, setHasHydratedFromCache] = useState(false);

    // Cache-first: pehle localStorage se dikhao (loader nahi), fir background me fresh fetch
    useEffect(() => {
        if (typeof window !== "undefined") {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                try {
                    const parsed = JSON.parse(cached);
                    if (Array.isArray(parsed)) {
                        dispatch(setCaseStudies(parsed));
                    }
                } catch (e) {
                    // corrupt cache, ignore
                }
            }
        }
        setHasHydratedFromCache(true);
    }, [dispatch]);

    useEffect(() => {
        if (!hasHydratedFromCache) return;
        dispatch(getAllCaseStudies({
            skip: pagination.skip || 0,
            limit: pagination.limit || 50,
        }))
            .unwrap()
            .then((res) => {
                if (typeof window !== "undefined" && Array.isArray(res)) {
                    localStorage.setItem(CACHE_KEY, JSON.stringify(res));
                }
            })
            .catch(() => {
                // fetch fail ho to jo cache/state hai wahi rehne do
            });
    }, [dispatch, pagination.skip, pagination.limit, hasHydratedFromCache]);

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

    const syncCache = (list) => {
        if (typeof window !== "undefined" && Array.isArray(list)) {
            localStorage.setItem(CACHE_KEY, JSON.stringify(list));
        }
    };

    // API ke exact fields ke mutabiq payload banata hai
    const prepareCaseData = (data) => {
        // content sections (heading/text) ko ek plain string me join karo, kyunke API "content" string leti hai
        const joinedContent = Array.isArray(data?.content)
            ? data.content
                .filter((s) => s?.heading?.trim() || s?.text?.trim())
                .map((s) => (s.heading ? `${s.heading}\n${s.text || ""}` : s.text || ""))
                .join("\n\n")
            : (data?.content || "");

        return {
            slug: data?.slug?.trim() || `${(data?.title || "case").toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
            title: data?.title?.trim() || "Untitled Case Study",
            summary: data?.summary?.trim() || "",
            content: data?.introduction?.trim()
                ? `${data.introduction.trim()}\n\n${joinedContent}`
                : joinedContent,
            industry: data?.industry?.trim() || "",
            tags: Array.isArray(data?.tags) ? data.tags : [],
            thumbnail_url: data?.thumbnail_url || data?.coverImageName || "",
            source: data?.source?.trim() || "",
            date: data?.date || "",
            location: data?.location?.trim() || "",
            company_name: data?.company_name?.trim() || "",
            key_results: Array.isArray(data?.key_results) ? data.key_results : [],
            is_published: data?.status === "Published" ? true : Boolean(data?.is_published),
        };
    };

    const handleSave = async (data, isCreateMode = false) => {
        try {
            let result;
            if (isCreateMode || formState.mode === "create") {
                const caseData = prepareCaseData(data);
                result = await dispatch(createCaseStudy(caseData)).unwrap();

                if (isCreateMode) {
                    return result;
                }

                const fresh = await dispatch(getAllCaseStudies({
                    skip: pagination.skip || 0,
                    limit: pagination.limit || 50,
                })).unwrap();
                syncCache(fresh);
            } else {
                const updateData = prepareCaseData(data);
                result = await dispatch(updateCaseStudy({
                    id: data?.id,
                    updateData,
                })).unwrap();

                const fresh = await dispatch(getAllCaseStudies({
                    skip: pagination.skip || 0,
                    limit: pagination.limit || 50,
                })).unwrap();
                syncCache(fresh);
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
            const fresh = await dispatch(getAllCaseStudies({
                skip: pagination.skip || 0,
                limit: pagination.limit || 50,
            })).unwrap();
            syncCache(fresh);
            setDeleteCase(null);
            onDataChange?.();
        } catch (error) {
            // error toast thunk ke andar already ho raha hai
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
                loading={false}
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