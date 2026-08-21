// app/components/userDashboardComp/userCoursesComp/dummyCourses.js
export const initialCourses = [
    {
        id: 1,
        title: "UX Design Foundations",
        subtitle: "Learn the fundamentals of UX design",
        category: "UI/UX Design",
        level: "Beginner",
        language: "English",
        duration: "12 hours",
        price: 128,
        sales: 128,
        enrollments: 80,
        status: "Publish",
        creationDate: "Oct 26, 2023",
        description: "This course covers the fundamentals of UX design including user research, wireframing, prototyping, and usability testing.",
        tone: "#7C6AE8",
        curriculum: [
            {
                id: "sec-1",
                name: "Introduction to UX Design",
                lectures: [
                    { id: "lec-1", name: "What is UX Design?" },
                    { id: "lec-2", name: "UX vs UI: Understanding the Difference" },
                ],
            },
            {
                id: "sec-2",
                name: "User Research",
                lectures: [
                    { id: "lec-3", name: "User Research Methods" },
                    { id: "lec-4", name: "Creating User Personas" },
                ],
            },
        ],
    },
    {
        id: 2,
        title: "UX Design Terminology",
        subtitle: "Master UX design terminology",
        category: "UI/UX Design",
        level: "Intermediate",
        language: "English",
        duration: "8 hours",
        price: 128,
        sales: 128,
        enrollments: 80,
        status: "Publish",
        creationDate: "Oct 26, 2023",
        description: "Master the essential terminology used in UX design industry.",
        tone: "#4FA3D1",
        curriculum: [],
    },
    {
        id: 3,
        title: "Common Design Patterns",
        subtitle: "Learn common design patterns",
        category: "UI/UX Design",
        level: "Beginner",
        language: "English",
        duration: "10 hours",
        price: 128,
        sales: 128,
        enrollments: 50,
        status: "Draft",
        creationDate: "Oct 26, 2023",
        description: "Learn the most common design patterns used in modern applications.",
        tone: "#E0A93E",
        curriculum: [],
    },
    {
        id: 4,
        title: "UI/UX Design Mastery",
        subtitle: "Complete UI/UX design course",
        category: "UI/UX Design",
        level: "Advanced",
        language: "English",
        duration: "20 hours",
        price: 128,
        sales: 128,
        enrollments: 50,
        status: "Archived",
        creationDate: "Oct 26, 2023",
        description: "Master UI/UX design with this comprehensive course.",
        tone: "#D9727B",
        curriculum: [],
    },
];

export const CATEGORY_OPTIONS = ["UI/UX Design", "Design", "Finance", "Development", "Marketing"];
export const LANGUAGE_OPTIONS = ["English", "Spanish", "French", "German", "Arabic", "Urdu"];
export const LEVEL_OPTIONS = ["Beginner", "Intermediate", "Advanced"];

let idCounter = 10;
export function nextCourseId() {
    return idCounter++;
}

export function emptyCourseDraft() {
    return {
        id: null,
        title: "",
        subtitle: "",
        category: "",
        level: "Beginner",
        language: "English",
        price: 0,
        description: "",
        curriculum: [
            {
                id: `sec-${Date.now()}`,
                name: "",
                lectures: [{ id: `lec-${Date.now()}`, name: "" }],
            },
        ],
        tone: "#365B50",
    };
}