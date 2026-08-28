// app/(website)/resarch/page.js
export const metadata = {
    title: "Research Corner Student Papers | The Eco Lens",
    description: "Read and publish student research papers on microfinance, sustainability, green finance, and more. Share your knowledge with the community.",
    keywords: "research papers, student essays, microfinance research, sustainability research, publish paper",
    robots: "index, follow",
};

import ResearchComp from "../../components/researchComp/ResearchComp";

export default function ResearchPage() {


    return (
        <section className="py-14 flex bg-[#E6FBF1] min-h-[calc(100vh-160px)] sm:py-[78px]">
            <div className="mx-6 px-4 sm:px-6">
                <ResearchComp />
            </div>
        </section>
    );
}