// app/components/websiteComp/cursorProvider/CursorProvider.jsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function CursorProvider({ children }) {
    const pathname = usePathname();

    useEffect(() => {
        // ✅ Check if we're on website routes (not admin or user panel)
        const isAdminRoute = pathname?.startsWith("/admin");
        const isUserPanelRoute = pathname?.startsWith("/dashboard") ||
            pathname?.startsWith("/my-courses") ||
            pathname?.startsWith("/course-details") ||
            pathname?.startsWith("/progress") ||
            pathname?.startsWith("/up-coming-tasks") ||
            pathname?.startsWith("/login");

        const isWebsiteRoute = !isAdminRoute && !isUserPanelRoute;

        // Agar touch device hai, toh custom cursor mat lagao
        if (window.matchMedia("(pointer: coarse)").matches) return;

        const ring = document.querySelector('.cursor-ring');
        const dot = document.querySelector('.cursor-dot');

        if (!ring || !dot) return;

        // ✅ Agar website route nahi hai toh cursor hide karo
        if (!isWebsiteRoute) {
            ring.style.display = 'none';
            dot.style.display = 'none';
            document.body.style.cursor = 'auto';
            return;
        }

        // ✅ Website route hai toh cursor show karo
        ring.style.display = 'block';
        dot.style.display = 'block';
        document.body.style.cursor = 'none';

        let mx = -100, my = -100, rx = -100, ry = -100;

        const onMouseMove = (e) => {
            mx = e.clientX;
            my = e.clientY;
            dot.style.left = mx + 'px';
            dot.style.top = my + 'px';
        };

        let rafId;
        const animate = () => {
            rx += (mx - rx) * 0.18;
            ry += (my - ry) * 0.18;
            ring.style.left = rx + 'px';
            ring.style.top = ry + 'px';
            rafId = requestAnimationFrame(animate);
        };

        const onMouseOver = (e) => {
            const t = e.target;
            ring.classList.remove('hover', 'hover-strong', 'hover-seal');

            if (t.tagName === 'CANVAS') {
                ring.classList.add('hover');
                return;
            }

            if (t.closest('.certificate')) {
                ring.classList.add('hover-seal');
            } else if (t.closest('.btn')) {
                ring.classList.add(t.closest('[data-hover="strong"]') ? 'hover-strong' : 'hover');
            } else if (t.closest("a, button, input, textarea, select, [role='button'], .cursor-pointer")) {
                ring.classList.add('hover');
            }
        };

        window.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseover', onMouseOver);
        animate();

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseover', onMouseOver);
            cancelAnimationFrame(rafId);
            document.body.style.cursor = 'auto';
        };
    }, [pathname]);

    return <>{children}</>;
}