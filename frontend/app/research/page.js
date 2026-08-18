export const metadata = {
    title: "Research Corner Student Papers | Finance Platform Demo",
    description: "Read and publish student research papers on microfinance, sustainability, green finance, and more. Share your knowledge with the community.",
    keywords: "research papers, student essays, microfinance research, sustainability research, publish paper",
    robots: "index, follow",
};

import ResearchComp from "../components/researchComp/ResearchComp";

export default function ResearchPage() {


    return (
        <section className="py-14 sm:py-[78px]">
            <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
                <ResearchComp />
            </div>
        </section>
    );
}