"use client";

import {
    auth,
    courseCard,
    esc,
    observeReveals,
    progress,
    toast,
} from "@/lib/app";
import { downloadCertificate } from "@/lib/cert";
import { getCourseBySlug, getCourses, getTopics } from "@/lib/data";
import Link from "next/link";
import { useEffect, useState } from "react";

const DashboardComp = () => {
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        rows: [],
        started: [],
        doneCourses: 0,
        doneLessons: 0,
        totalMinutes: 0,
        name: "",
        certs: []
    });

    useEffect(() => {
        async function loadDashboard() {
            // Check if user is logged in
            const user = auth.user();
            if (!user) {
                window.location.href = "/login?next=dashboard";
                return;
            }

            // Set name if not set
            if (user && !progress.name()) {
                progress.setName(user.name);
            }

            try {
                const [topicsData, catalogData] = await Promise.all([
                    getTopics(),
                    getCourses()
                ]);

                const byId = Object.fromEntries(topicsData.map(t => [t.id, t]));
                const mine = progress.all();
                const started = Object.keys(mine);

                let doneCourses = 0, doneLessons = 0, totalMinutes = 0;
                const rows = [];

                for (const slug of started) {
                    let course;
                    try {
                        course = await getCourseBySlug(slug);
                    } catch (_) {
                        continue;
                    }
                    if (!course) continue;

                    const s = progress.stats(slug, course);
                    if (s.done === 0 && !mine[slug]?.startedAt) continue;

                    doneLessons += s.done;
                    if (s.complete) {
                        doneCourses++;
                        totalMinutes += course.lengthMin || 0;
                    }
                    rows.push({ slug, course, s });
                }

                // Get certificates
                const certs = rows.filter(r => r.s.complete);

                // Get user name
                const name = progress.name();

                setDashboardData({
                    rows,
                    started,
                    doneCourses,
                    doneLessons,
                    totalMinutes,
                    name,
                    certs,
                    byId,
                    catalog: catalogData
                });

                setLoading(false);

                // Observe reveals after render
                setTimeout(() => observeReveals(), 100);

            } catch (error) {
                console.error("Failed to load dashboard:", error);
                setLoading(false);
            }
        }

        loadDashboard();
    }, []);

    const handleSetName = () => {
        const name = prompt("Name for your certificates:", progress.name() || "");
        if (name && name.trim()) {
            progress.setName(name.trim());
            toast("Name saved");
            window.location.reload();
        }
    };

    const handleDownloadCert = async (slug) => {
        try {
            const course = await getCourseBySlug(slug);
            if (course) {
                downloadCertificate(slug, course);
            }
        } catch (error) {
            toast("Failed to download certificate");
        }
    };

    if (loading) {
        return (
            <section className="dash-hero">
                <div className="wrap">
                    <h1>My learning</h1>
                    <p>Loading your progress...</p>
                </div>
            </section>
        );
    }

    const { rows, doneCourses, doneLessons, name, certs, byId, catalog } = dashboardData;
    return (
        <>
            <section className="dash-hero">
                <div className="wrap">
                    <h1 id="dashTitle">
                        {name ? `Welcome back, ${name.split(" ")[0]}` : "My learning"}
                    </h1>
                    <p id="dashSub">
                        Your progress is saved privately on this device — no account needed.
                    </p>
                </div>
            </section>

            <div className="wrap">
                <div className="stat-cards" id="statCards">
                    <div className="stat-card">
                        <b>{rows.length}</b>
                        <span>courses started</span>
                    </div>
                    <div className="stat-card">
                        <b>{doneLessons}</b>
                        <span>lessons completed</span>
                    </div>
                    <div className="stat-card">
                        <b>{doneCourses}</b>
                        <span>certificates earned</span>
                    </div>
                </div>
            </div>

            <section className="section tight">
                <div className="wrap">
                    <div className="section-head">
                        <div>
                            <span className="overline">In progress</span>
                            <h2 style={{ fontSize: "1.6rem" }}>Your courses</h2>
                        </div>
                        <Link className="link-more" href="/catalog">Find a new course →</Link>
                    </div>

                    {rows.length === 0 ? (
                        <div className="empty-state" id="noCourses">
                            <div className="big">🌱</div>
                            <p><b>Nothing started yet.</b><br />Pick any course — they're all free.</p>
                            <Link className="btn btn-primary mt-2" href="/catalog">Browse the catalog</Link>
                        </div>
                    ) : (
                        <div className="grid cols-3" id="myCourses">
                            {rows
                                .sort((a, b) => b.s.pct - a.s.pct)
                                .map(({ slug, course, s }) => {
                                    const meta = catalog.find(c => c.slug === slug) || course;
                                    const topic = byId[course.topic];
                                    // Use the courseCard function from app.js
                                    // But since we're in React, we need to render it differently
                                    return (
                                        <div
                                            key={slug}
                                            dangerouslySetInnerHTML={{
                                                __html: courseCard(
                                                    { ...meta, lessons: s.total },
                                                    topic,
                                                    s
                                                )
                                            }}
                                        />
                                    );
                                })}
                        </div>
                    )}

                    {certs.length > 0 && (
                        <>
                            <div className="section-head mt-4" id="certHead">
                                <div>
                                    <span className="overline">Earned</span>
                                    <h2 style={{ fontSize: "1.6rem" }}>Your certificates</h2>
                                </div>
                            </div>
                            <div id="certList">
                                {certs.map(({ slug, course }) => {
                                    const courseData = progress.course(slug);
                                    const completedDate = courseData.completedAt
                                        ? new Date(courseData.completedAt).toLocaleDateString("en-GB", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric"
                                        })
                                        : "Recently";

                                    return (
                                        <div className="cert-card" key={slug}>
                                            <span className="cert-ico">🎓</span>
                                            <div className="grow">
                                                <b>{esc(course.title)}</b>
                                                <br />
                                                <span className="text-muted" style={{ fontSize: ".85rem" }}>
                                                    Completed {completedDate}
                                                    · ID {progress.certId(slug)}
                                                </span>
                                            </div>
                                            <button
                                                className="btn btn-emerald btn-sm"
                                                onClick={() => handleDownloadCert(slug)}
                                            >
                                                Download PDF
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    <div className="notice mt-4">
                        <span>🔒</span>
                        <div>
                            <b>Private by design.</b> Progress lives only in this browser's storage.
                            Clearing site data resets it.
                            Set or change the name that appears on certificates:
                            <button
                                className="btn btn-outline btn-sm"
                                id="nameBtn"
                                style={{ marginLeft: "8px" }}
                                onClick={handleSetName}
                            >
                                Set name
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default DashboardComp
