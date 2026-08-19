// lib/cert.js
// Finance Platform Demo certificate generator (client-side PDF via jsPDF)

"use client";

import { progress, toast, fmtMin, esc } from "./app";

const ensureName = () => {
    let name = progress.name();
    if (!name) {
        name = prompt("Name for your certificate:", "")?.trim() || "";
        if (!name) return null;
        progress.setName(name);
    }
    return name;
};

export const downloadCertificate = (slug, course) => {
    // Check if jsPDF is available
    if (typeof window === "undefined") {
        toast("Certificate generation only works in the browser");
        return;
    }

    const name = ensureName();
    if (!name) return;

    const prog = progress.course(slug);
    if (!prog.completedAt) {
        toast("Finish all lessons first");
        return;
    }

    // Dynamically import jsPDF
    import("jspdf").then(({ jsPDF }) => {
        const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
        const W = doc.internal.pageSize.getWidth();   // 842
        const H = doc.internal.pageSize.getHeight();  // 595

        // Background
        doc.setFillColor(250, 248, 244);
        doc.rect(0, 0, W, H, "F");

        // Border bands
        doc.setFillColor(13, 59, 46);
        doc.rect(0, 0, W, 18, "F");
        doc.rect(0, H - 18, W, 18, "F");

        // Inner frame
        doc.setDrawColor(201, 155, 74);
        doc.setLineWidth(1.6);
        doc.rect(34, 34, W - 68, H - 68);

        // Brand
        doc.setFont("times", "bold");
        doc.setTextColor(13, 59, 46);
        doc.setFontSize(22);
        doc.text("Finance Platform Demo", W / 2, 84, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(100, 114, 106);
        doc.text("CERTIFICATE OF COMPLETION", W / 2, 116, { align: "center", charSpace: 2 });

        // Name
        doc.setFont("times", "italic");
        doc.setFontSize(38);
        doc.setTextColor(23, 33, 28);
        doc.text(name, W / 2, 188, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setTextColor(100, 114, 106);
        doc.text("has successfully completed the free Finance Platform Demo course", W / 2, 222, { align: "center" });

        // Course title
        doc.setFont("times", "bold");
        doc.setFontSize(26);
        doc.setTextColor(13, 59, 46);
        const titleLines = doc.splitTextToSize(course.title, W - 220);
        doc.text(titleLines, W / 2, 262, { align: "center" });

        // Meta
        const dateStr = new Date(prog.completedAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11.5);
        doc.setTextColor(61, 74, 67);
        doc.text(
            `Instructor: ${course.instructor.name}   ·   Level: ${course.level}   ·   Length: ${fmtMin(course.lengthMin)}`,
            W / 2,
            330,
            { align: "center" }
        );
        doc.text(`Awarded on ${dateStr}`, W / 2, 352, { align: "center" });

        // Seal
        doc.setDrawColor(201, 155, 74);
        doc.setFillColor(247, 236, 217);
        doc.circle(W / 2, 428, 40, "FD");
        doc.setFont("times", "bold");
        doc.setFontSize(20);
        doc.setTextColor(122, 92, 30);
        doc.text("FP", W / 2, 436, { align: "center" });

        // Cert ID + disclaimer
        doc.setFont("courier", "normal");
        doc.setFontSize(10);
        doc.setTextColor(100, 114, 106);
        doc.text("Certificate ID: " + progress.certId(slug), W / 2, 500, { align: "center" });
        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        doc.text(
            "Finance Platform Demo certificates recognise completion of a free educational course. They are not accredited qualifications.",
            W / 2,
            520,
            { align: "center" }
        );

        doc.save(`FPD-${slug}-certificate.pdf`);
        toast("Certificate downloaded 🎓");
    }).catch((err) => {
        console.error("Failed to load jsPDF:", err);
        toast("Failed to generate certificate. Please try again.");
    });
};

export const cert = {
    download: downloadCertificate
};

export default cert;