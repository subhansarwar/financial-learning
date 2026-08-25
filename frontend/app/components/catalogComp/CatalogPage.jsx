import { getTopics } from "@/lib/data";
import { Search } from "lucide-react";
import { Suspense } from "react";
import CatalogComp from "./CatalogComp";

export default async function CatalogPage({ searchParams }) {
    const topics = await getTopics();

    const initialFilters = {
        q: searchParams?.q || "",
        topic: searchParams?.topic || "",
    };

    return (
        <section className="py-10 min-h-[calc(100vh-160px)] bg-[#E5E5E5] sm:py-14 lg:py-16">
            <div className="mx-6 py-5 px-4 sm:px-6">
                <span className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#14301F]">
                    Course catalog
                </span>
                <h1 className="max-w-[20ch] text-[1.9rem] font-extrabold leading-tight tracking-tight text-ink sm:text-[2.4rem] lg:text-[2.8rem]">
                    Find your next course
                </h1>
                <p className="mt-2.5 max-w-[55ch] text-sm font-medium text-[#14301F] sm:text-base">
                    Every course is completely free search, filter, and start in one click.
                </p>

                <div className="mt-8 sm:mt-10">
                    <Suspense
                        fallback={
                            <div className="flex items-center gap-2 rounded-xl2 border border-line bg-card px-5 py-8 text-sm font-semibold text-muted">
                                <Search className="h-4 w-4 animate-pulse" strokeWidth={2.25} />
                                Loading filters…
                            </div>
                        }
                    >
                        <CatalogComp topics={topics} initialFilters={initialFilters} />
                    </Suspense>
                </div>
            </div>
        </section>
    );
}