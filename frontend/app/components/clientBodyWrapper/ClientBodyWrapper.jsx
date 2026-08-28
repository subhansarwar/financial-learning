// app/components/ClientBodyWrapper.jsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ClientBodyWrapper({ children }) {
    const pathname = usePathname();

    // Pages with white background
    const whiteBgPages = ["/", "/about"];
    const isWhiteBg = whiteBgPages.includes(pathname);

    useEffect(() => {
        // Using direct style manipulation
        document.body.style.backgroundColor = isWhiteBg ? "#ffffff" : "#E6FBF1";

        return () => {
            // Reset on unmount (optional)
            document.body.style.backgroundColor = "";
        };
    }, [isWhiteBg]);

    return <>{children}</>;
}