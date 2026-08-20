// app/components/adminPanelComp/manageCaseStudies/caseStudiesComp/dummyCaseStudies.js

export const initialCaseStudies = [
    {
        id: "case-1",
        title: "Grameen Bank: Microfinance Revolution in Bangladesh",
        slug: "grameen-bank-microfinance-revolution",
        author: "Dr. Muhammad Yunus",
        shortDescription: "How Grameen Bank pioneered microcredit and transformed millions of lives in Bangladesh.",
        introduction: "Grameen Bank was founded in 1983 with a mission to provide small loans to the impoverished without requiring collateral...",
        content: [
            {
                heading: "The Birth of Microcredit",
                text: "The concept of microcredit was born in the 1970s when Muhammad Yunus started experimenting with small loans..."
            },
            {
                heading: "Impact on Rural Communities",
                text: "The bank's model has been replicated in over 100 countries, demonstrating the power of financial inclusion..."
            },
            {
                heading: "Challenges and Criticism",
                text: "Despite its success, Grameen Bank has faced criticism regarding interest rates and sustainability..."
            }
        ],
        images: [
            "/images/grameen-bank-1.jpg",
            "/images/grameen-bank-2.jpg"
        ],
        createdAt: "15 Jan 2026",
        updatedAt: "20 Jan 2026",
        publishedAt: "20 Jan 2026",
    },
    {
        id: "case-2",
        title: "M-Pesa: Mobile Money in Kenya",
        slug: "m-pesa-mobile-money-kenya",
        author: "Safaricom Team",
        shortDescription: "How mobile money transformed financial access in Kenya and beyond.",
        introduction: "M-Pesa was launched in 2007 by Safaricom as a simple mobile money transfer service...",
        content: [
            {
                heading: "The Mobile Revolution",
                text: "Kenya's high mobile penetration rate created the perfect environment for mobile money..."
            },
            {
                heading: "Financial Inclusion Impact",
                text: "M-Pesa brought banking services to millions of unbanked Kenyans..."
            },
            {
                heading: "Global Expansion",
                text: "The success of M-Pesa inspired similar services across Africa and Asia..."
            }
        ],
        images: [
            "/images/mpesa-1.jpg",
            "/images/mpesa-2.jpg"
        ],
        createdAt: "28 Feb 2026",
        updatedAt: "28 Feb 2026",
        publishedAt: "01 Mar 2026",
    },
    {
        id: "case-3",
        title: "BRAC: Holistic Development in Bangladesh",
        slug: "brac-holistic-development-bangladesh",
        author: "BRAC Research Team",
        shortDescription: "BRAC's comprehensive approach to poverty alleviation through microfinance and social development.",
        introduction: "BRAC is the world's largest non-governmental development organization, founded in 1972...",
        content: [
            {
                heading: "From Relief to Development",
                text: "BRAC started as a relief organization and evolved into a development powerhouse..."
            },
            {
                heading: "Microfinance Programs",
                text: "BRAC's microfinance programs reach millions of women across Bangladesh..."
            },
            {
                heading: "Social Enterprises",
                text: "BRAC runs social enterprises to sustain its development programs..."
            }
        ],
        images: [
            "/images/brac-1.jpg",
            "/images/brac-2.jpg"
        ],
        createdAt: "10 Mar 2026",
        updatedAt: "12 Mar 2026",
        publishedAt: null,
    },
    {
        id: "case-4",
        title: "Ørsted: Green Energy Transition",
        slug: "orsted-green-energy-transition",
        author: "Ørsted Sustainability Team",
        shortDescription: "How Ørsted transformed from an oil and gas company to a renewable energy leader.",
        introduction: "Ørsted (formerly DONG Energy) has undergone a remarkable transformation since 2008...",
        content: [
            {
                heading: "The Transformation Strategy",
                text: "The company's shift to renewables was driven by both environmental concerns and business strategy..."
            },
            {
                heading: "Offshore Wind Leadership",
                text: "Ørsted has become the world's largest developer of offshore wind energy..."
            },
            {
                heading: "Future Outlook",
                text: "The company aims to become carbon neutral by 2025..."
            }
        ],
        images: [
            "/images/orsted-1.jpg",
            "/images/orsted-2.jpg"
        ],
        createdAt: "05 Apr 2026",
        updatedAt: "08 Apr 2026",
        publishedAt: null,
    },
];

export function nextCaseId() {
    return `case-${Date.now()}`;
}

export function emptyCaseDraft() {
    return {
        id: "",
        title: "",
        slug: "",
        author: "",
        shortDescription: "",
        introduction: "",
        content: [
            {
                heading: "",
                text: "",
            },
        ],
        images: [],
        createdAt: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        }),
        updatedAt: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        }),
        publishedAt: null,
    };
}