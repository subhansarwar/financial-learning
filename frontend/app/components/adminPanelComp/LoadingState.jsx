// app/admin/components/LoadingState.jsx
"use client";

import { RefreshCw } from "lucide-react";

export default function LoadingState() {
    return (
        <div className="flex h-64 flex-col items-center justify-center text-center">
            <RefreshCw className="mb-3 h-8 w-8 animate-spin text-brand" strokeWidth={2} />
        </div>
    );
}