// app/components/adminPanelComp/manageCourse/courseComp/dummyCourses.js

export const CATEGORY_OPTIONS = [
    "Microfinance",
    "Sustainability & Finance",
    "ESG",
    "Financial Inclusion",
    "Fintech",
];

export const LANGUAGE_OPTIONS = ["English", "Urdu", "Spanish", "French", "Arabic"];

export const LEVEL_OPTIONS = ["Beginner", "Intermediate", "Advanced"];

let idCounter = 200;
export function nextCourseId() {
    idCounter += 1;
    return `course-${idCounter}`;
}

function emptyCurriculum() {
    return [
        {
            id: `cur-${Date.now()}`,
            name: "",
            lectures: [{ id: `lec-${Date.now()}`, name: "", videoName: "" }],
        },
    ];
}

export function emptyCourseDraft() {
    return {
        id: null,
        title: "",
        subtitle: "",
        description: "",
        category: CATEGORY_OPTIONS[0],
        language: LANGUAGE_OPTIONS[0],
        level: LEVEL_OPTIONS[0],
        price: 0,
        coverImageName: "",
        curriculum: emptyCurriculum(),
    };
}

export const initialCourses = [
    {
        id: "course-1",
        title: "Microfinance Foundations",
        subtitle: "The basics of microcredit and micro-savings.",
        description:
            "A beginner-friendly walkthrough of how microfinance institutions extend small loans to underserved communities and why it matters.",
        category: "Microfinance",
        language: "English",
        level: "Beginner",
        price: 0,
        coverImageName: "microfinance-foundations.png",
        creationDate: "August 26, 2026",
        sales: 128,
        enrollments: 80,
        status: "Publish",
        curriculum: [
            {
                id: "cur-1",
                name: "Getting Started",
                lectures: [
                    { id: "lec-1", name: "What is microfinance?", videoName: "intro.mp4" },
                    { id: "lec-2", name: "How microcredit works", videoName: "microcredit.mp4" },
                ],
            },
        ],
    },
    {
        id: "course-2",
        title: "Understanding Microcredit",
        subtitle: "Loans, interest, and repayment cycles explained.",
        description: "Dive into how microcredit loans are structured and repaid in practice.",
        category: "Microfinance",
        language: "English",
        level: "Beginner",
        price: 0,
        coverImageName: "microcredit.png",
        creationDate: "August 24, 2026",
        sales: 96,
        enrollments: 64,
        status: "Publish",
        curriculum: emptyCurriculum(),
    },
    {
        id: "course-3",
        title: "Green Bonds Explained",
        subtitle: "Financing climate projects through debt markets.",
        description: "Learn how green bonds channel capital into renewable energy and climate resilience.",
        category: "Sustainability & Finance",
        language: "English",
        level: "Intermediate",
        price: 0,
        coverImageName: "green-bonds.png",
        creationDate: "Jan 20, 2026",
        sales: 54,
        enrollments: 41,
        status: "Publish",
        curriculum: emptyCurriculum(),
    },
    {
        id: "course-4",
        title: "ESG Investing Basics",
        subtitle: "Environmental, social and governance screening.",
        description: "An introduction to how investors weigh ESG factors when picking assets.",
        category: "ESG",
        language: "English",
        level: "Beginner",
        price: 0,
        coverImageName: "esg-basics.png",
        creationDate: "Feb 18, 2026",
        sales: 38,
        enrollments: 30,
        status: "Draft",
        curriculum: emptyCurriculum(),
    },
    {
        id: "course-5",
        title: "Sustainable Finance 101",
        subtitle: "Where climate and capital markets meet.",
        description: "A survey course covering the sustainable finance landscape end to end.",
        category: "Sustainability & Finance",
        language: "English",
        level: "Beginner",
        price: 0,
        coverImageName: "sustainable-finance.png",
        creationDate: "Feb 15, 2026",
        sales: 71,
        enrollments: 55,
        status: "Publish",
        curriculum: emptyCurriculum(),
    },
    {
        id: "course-6",
        title: "Financial Inclusion Metrics",
        subtitle: "Measuring access, usage, and quality.",
        description: "Understand the indicators used to track financial inclusion across countries.",
        category: "Financial Inclusion",
        language: "English",
        level: "Advanced",
        price: 0,
        coverImageName: "inclusion-metrics.png",
        creationDate: "June 09, 2026",
        sales: 12,
        enrollments: 9,
        status: "Draft",
        curriculum: emptyCurriculum(),
    },
    {
        id: "course-7",
        title: "Digital Lending & Fintech",
        subtitle: "How mobile money changed microfinance.",
        description: "Explore the rise of digital lenders and their impact on financial inclusion.",
        category: "Fintech",
        language: "English",
        level: "Intermediate",
        price: 0,
        coverImageName: "digital-lending.png",
        creationDate: "Sep 30, 2026",
        sales: 20,
        enrollments: 17,
        status: "Archived",
        curriculum: emptyCurriculum(),
    },
];