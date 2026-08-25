"use client";

import { useEffect } from "react";

export default function CursorProvider({ children }) {
    useEffect(() => {
        // Agar touch device hai, toh custom cursor mat lagao
        if (window.matchMedia("(pointer: coarse)").matches) return;

        const ring = document.querySelector('.cursor-ring');
        const dot = document.querySelector('.cursor-dot');

        // Agar elements nahi mile, toh return
        if (!ring || !dot) return;

        let mx = -100, my = -100, rx = -100, ry = -100;

        // Mouse move par position track karein
        const onMouseMove = (e) => {
            mx = e.clientX;
            my = e.clientY;
            dot.style.left = mx + 'px';
            dot.style.top = my + 'px';
        };

        // Smooth animation (Ring lag se follow karega)
        let rafId;
        const animate = () => {
            rx += (mx - rx) * 0.18;
            ry += (my - ry) * 0.18;
            ring.style.left = rx + 'px';
            ring.style.top = ry + 'px';
            rafId = requestAnimationFrame(animate);
        };

        // Only element-type detection — no background-color sniffing
        const onMouseOver = (e) => {
            const t = e.target;
            ring.classList.remove('hover', 'hover-strong', 'hover-seal');

            // ***** YEH ADD KAREIN *****
            if (t.tagName === 'CANVAS') {
                ring.classList.add('hover');
                return;
            }
            // **************************

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
        };
    }, []);

    return <>{children}</>;
}