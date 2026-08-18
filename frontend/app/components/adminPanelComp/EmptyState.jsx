// app/admin/components/EmptyState.jsx
"use client";

import { FolderOpen } from "lucide-react";

export default function EmptyState() {
    return (
        <div className="flex h-64 flex-col items-center justify-center text-center">
            <div className="mb-3 rounded-full bg-brand-soft p-4">
                <FolderOpen className="h-8 w-8 text-brand-deep" strokeWidth={1.5} />
            </div>
            <p className="font-medium text-ink">Pick a course to edit</p>
            <p className="text-sm text-muted">or create a new one</p>
        </div>
    );
}