// app/components/adminPanelComp/manageResearch/ResearchEditor.jsx
"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
    getPendingPublications,
    getPublicationById,
    approvePublication,
    rejectPublication,
    deletePublication,
} from "../../../store/admin/publications/publicationsThunks";
import ResearchTable from "./researchComp/ResearchTable";
import ResearchViewModal from "./researchComp/ResearchViewModal";
import NotesConfirmModal from "./researchComp/NotesConfirmModal";

const LIMIT = 10;

export default function ResearchEditor({ onDataChange }) {
    const dispatch = useAppDispatch();
    const { list, skip, limit, hasMore, listLoading, listError, selected, actionLoading } =
        useAppSelector((s) => s.publications);
    const [viewId, setViewId] = useState(null); // jis paper ka Read modal open hai uska id
    const [confirmModal, setConfirmModal] = useState(null); // { mode: "approve"|"reject"|"delete", paper }

    useEffect(() => {
        dispatch(getPendingPublications({ skip: 0, limit: LIMIT }));
    }, [dispatch]);

    const handleView = (paper) => {
        setViewId(paper.id);
        dispatch(getPublicationById(paper.id));
    };

    const closeView = () => setViewId(null);

    const openConfirm = (mode, paper) => setConfirmModal({ mode, paper });
    const closeConfirm = () => setConfirmModal(null);

    const handleConfirmSubmit = async (notes) => {
        if (!confirmModal) return;
        const { mode, paper } = confirmModal;
        try {
            if (mode === "approve") {
                await dispatch(approvePublication({ id: paper.id, notes })).unwrap();
                toast.success(`${paper.title} approved!`);
            } else if (mode === "reject") {
                await dispatch(rejectPublication({ id: paper.id, notes })).unwrap();
                toast.success(`${paper.title} rejected.`);
            } else if (mode === "delete") {
                await dispatch(deletePublication({ id: paper.id, notes })).unwrap();
                toast.success("Research paper deleted!");
            }
            closeConfirm();
            if (viewId === paper.id) closeView();
            onDataChange?.();
        } catch (error) {
        }
    };

    const handleNextPage = () => {
        if (!hasMore || listLoading) return;
        dispatch(getPendingPublications({ skip: skip + limit, limit }));
    };

    const handlePrevPage = () => {
        if (skip === 0 || listLoading) return;
        dispatch(getPendingPublications({ skip: Math.max(0, skip - limit), limit }));
    };

    return (
        <>
            <ResearchTable
                research={list}
                loading={listLoading}
                error={listError}
                skip={skip}
                limit={limit}
                hasMore={hasMore}
                onNextPage={handleNextPage}
                onPrevPage={handlePrevPage}
                onView={handleView}
                onDelete={(paper) => openConfirm("delete", paper)}
                onApprove={(paper) => openConfirm("approve", paper)}
                onReject={(paper) => openConfirm("reject", paper)}
            />

            <ResearchViewModal
                paper={viewId ? selected : null}
                onClose={closeView}
                onApprove={(paper) => openConfirm("approve", paper)}
                onReject={(paper) => openConfirm("reject", paper)}
            />

            <NotesConfirmModal
                isOpen={!!confirmModal}
                mode={confirmModal?.mode}
                paperTitle={confirmModal?.paper?.title}
                loading={actionLoading}
                onClose={closeConfirm}
                onConfirm={handleConfirmSubmit}
            />
        </>
    );
}