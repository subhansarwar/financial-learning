/* Finance Platform Demo certificate generator (client-side PDF via jsPDF) */
(function () {
    "use strict";

    function ensureName() {
        let name = FL.progress.name();
        if (!name) {
            name = (prompt("Name for your certificate:", "") || "").trim();
            if (!name) return null;
            FL.progress.setName(name);
        }
        return name;
    }

    FL.cert = {
        download(slug, course) {
            const name = ensureName();
            if (!name) return;
            const prog = FL.progress.course(slug);
            if (!prog.completedAt) { FL.toast("Finish all lessons first"); return; }
            if (!window.jspdf) { FL.toast("PDF engine still loading try again in a second"); return; }

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
            const W = doc.internal.pageSize.getWidth();   // 842
            const H = doc.internal.pageSize.getHeight();  // 595

            // background
            doc.setFillColor(250, 248, 244);
            doc.rect(0, 0, W, H, "F");
            // border bands
            doc.setFillColor(13, 59, 46);
            doc.rect(0, 0, W, 18, "F");
            doc.rect(0, H - 18, W, 18, "F");
            // inner frame
            doc.setDrawColor(201, 155, 74);
            doc.setLineWidth(1.6);
            doc.rect(34, 34, W - 68, H - 68);

            // brand
            doc.setFont("times", "bold");
            doc.setTextColor(13, 59, 46);
            doc.setFontSize(22);
            doc.text("Finance Platform Demo", W / 2, 84, { align: "center" });

            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            doc.setTextColor(100, 114, 106);
            doc.text("CERTIFICATE OF COMPLETION", W / 2, 116, { align: "center", charSpace: 2 });

            // name
            doc.setFont("times", "italic");
            doc.setFontSize(38);
            doc.setTextColor(23, 33, 28);
            doc.text(name, W / 2, 188, { align: "center" });

            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            doc.setTextColor(100, 114, 106);
            doc.text("has successfully completed the free Finance Platform Demo course", W / 2, 222, { align: "center" });

            // course title
            doc.setFont("times", "bold");
            doc.setFontSize(26);
            doc.setTextColor(13, 59, 46);
            const titleLines = doc.splitTextToSize(course.title, W - 220);
            doc.text(titleLines, W / 2, 262, { align: "center" });

            // meta
            const dateStr = new Date(prog.completedAt).toLocaleDateString("en-GB", {
                day: "numeric", month: "long", year: "numeric",
            });
            doc.setFont("helvetica", "normal");
            doc.setFontSize(11.5);
            doc.setTextColor(61, 74, 67);
            doc.text(`Instructor: ${course.instructor.name}   ·   Level: ${course.level}   ·   Length: ${FL.fmtMin(course.lengthMin)}`, W / 2, 330, { align: "center" });
            doc.text(`Awarded on ${dateStr}`, W / 2, 352, { align: "center" });

            // seal
            doc.setDrawColor(201, 155, 74);
            doc.setFillColor(247, 236, 217);
            doc.circle(W / 2, 428, 40, "FD");
            doc.setFont("times", "bold");
            doc.setFontSize(20);
            doc.setTextColor(122, 92, 30);
            doc.text("FP", W / 2, 436, { align: "center" });

            // cert id + disclaimer
            doc.setFont("courier", "normal");
            doc.setFontSize(10);
            doc.setTextColor(100, 114, 106);
            doc.text("Certificate ID: " + FL.progress.certId(slug), W / 2, 500, { align: "center" });
            doc.setFont("helvetica", "italic");
            doc.setFontSize(9);
            doc.text(
                "Finance Platform Demo certificates recognise completion of a free educational course. They are not accredited qualifications.",
                W / 2, 520, { align: "center" }
            );

            doc.save(`FPD-${slug}-certificate.pdf`);
            FL.toast("Certificate downloaded 🎓");
        },
    };
})();
