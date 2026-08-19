export const metadata = {
    title: "Finance Tools Calculators & Simulators | Finance Platform Demo",
    description: "Use our free finance tools: budgeting calculator, compound interest explorer, ESG comparison, and more. All tools run in your browser.",
    keywords: "finance tools, budgeting calculator, compound interest, ESG comparison, financial simulators",
    robots: "index, follow",
};

import ToolComp from "../components/toolComp/ToolComp";

export default function ToolsPage() {


    return (
        <div className="min-h-[calc(100vh-160px)]">
            <ToolComp />
        </div>
    );
}