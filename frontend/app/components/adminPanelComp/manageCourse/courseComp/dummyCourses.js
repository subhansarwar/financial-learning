// app/components/adminPanelComp/manageCourse/courseComp/dummyCourses.js

export const CATEGORY_OPTIONS = [
    "Microfinance",
    "Sustainability & Finance",
    "ESG",
    "Financial Inclusion",
    "Fintech",
];

export const LEVEL_OPTIONS = ["Beginner", "Intermediate", "Advanced"];

export const emptyCourseDraft = () => ({
    id: null,
    title: "",
    tagline: "",
    description: "",
    category: "",
    level: "",
    instructor_name: "",
    instructor_title: "",
    coverImageName: "",
    curriculum: [],
    status: "Draft",
});