import { Suspense } from "react";
import CatalogComp from "./CatalogComp";
import { getCourses, getTopics } from "@/lib/data";

export default async function CatalogPage({ searchParams }) {
    const [courses, topics] = await Promise.all([
        getCourses(),
        getTopics()
    ]);

    const initialFilters = {
        q: searchParams?.q || "",
        topic: searchParams?.topic || "",
    };

    return (
        <section className="section tight" style={{ paddingTop: "48px" }}>
            <div className="wrap">
                <span className="overline">Course catalog</span>
                <h1 className="section-title">Find your next course</h1>
                <p className="text-muted">Every course is completely free — search, filter, and start in one click.</p>

                <Suspense fallback={<div className="text-muted">Loading filters...</div>}>
                    <CatalogComp topics={topics} initialFilters={initialFilters} />
                </Suspense>
            </div>
        </section>
    );
}