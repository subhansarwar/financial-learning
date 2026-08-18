// app/admin/components/TopicsInfo.jsx
"use client";

import { HelpCircle } from "lucide-react";

export default function TopicsInfo() {
    return (
        <div className="flex items-start gap-2 rounded-lg bg-blue-50/50 p-3 border border-blue-100">
            <HelpCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" strokeWidth={2} />
            <div className="text-xs text-ink-2">
                <span className="font-bold text-blue-700">Pro tip:</span> Topics help organize courses.
                Each topic needs a unique ID, name, and icon. The hue value determines the color scheme.
            </div>
        </div>
    );
}