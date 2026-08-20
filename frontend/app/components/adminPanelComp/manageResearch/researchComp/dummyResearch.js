// app/components/adminPanelComp/manageResearch/researchComp/dummyResearch.js

export const initialResearch = [
    {
        id: "res-1",
        title: "Group Lending and Women's Empowerment in Rural Sindh",
        author: "Amina Yusuf",
        email: "amina.y@example.com",
        topic: "Microfinance",
        abstract: "This paper examines the impact of group lending models on women's economic participation and household decision-making in rural Pakistan.",
        submissionDate: "15 Jan 2026",
        status: "Approved",
        fileUrl: "#",
        createdAt: Date.now() - 86400000 * 30,
    },
    {
        id: "res-2",
        title: "Green Bonds: Financing the Energy Transition",
        author: "Dr. Omar Khan",
        email: "omar.k@example.com",
        topic: "Sustainability",
        abstract: "An analysis of the green bond market growth, impact measurement, and the role of institutional investors in climate finance.",
        submissionDate: "28 Feb 2026",
        status: "Pending",
        fileUrl: "#",
        createdAt: Date.now() - 86400000 * 15,
    },
    {
        id: "res-3",
        title: "Solar Energy Adoption in Rural Communities",
        author: "Fatima Ahmed",
        email: "fatima.a@example.com",
        topic: "Green Energy",
        abstract: "This research explores the factors influencing solar energy adoption in off-grid communities, focusing on financing mechanisms.",
        submissionDate: "10 Mar 2026",
        status: "Rejected",
        fileUrl: "#",
        createdAt: Date.now() - 86400000 * 7,
    },
    {
        id: "res-4",
        title: "Microinsurance and Climate Resilience",
        author: "Muhammad Ali",
        email: "m.ali@example.com",
        topic: "Microfinance",
        abstract: "A study on how microinsurance products can help vulnerable communities build resilience against climate-related shocks.",
        submissionDate: "05 Apr 2026",
        status: "Pending",
        fileUrl: "#",
        createdAt: Date.now() - 86400000 * 3,
    },
];

export const TOPIC_OPTIONS = ["Microfinance", "Sustainability", "Green Energy", "Fintech", "Banking", "Other"];

export const STATUS_OPTIONS = ["Pending", "Approved", "Rejected"];

export function nextResearchId() {
    return `res-${Date.now()}`;
}

export function emptyResearchDraft() {
    return {
        id: "",
        title: "",
        author: "",
        email: "",
        topic: "",
        abstract: "",
        submissionDate: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        }),
        status: "Pending",
        fileUrl: "#",
        createdAt: Date.now(),
    };
}