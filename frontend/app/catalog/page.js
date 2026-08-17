import CatalogPage from "../components/catalogComp/CatalogPage";

export const metadata = {
    title: "Course Catalog Free Finance Courses | Finance Platform",
    description: "Browse our free course catalog. Learn microfinance, sustainable finance, investing, banking, fintech and more. All courses are 100% free with certificates.",
    keywords: "finance courses, microfinance course, sustainable finance, free finance education, investing course, fintech course",
    openGraph: {
        title: "Course Catalog Free Finance Courses",
        description: "Browse 100+ free finance courses. Learn at your own pace and earn certificates.",
        url: "https://your-domain.com/catalog",
    },
    twitter: {
        title: "Course Catalog Free Finance Courses",
        description: "Browse our free finance course catalog. Start learning today!",
    },
};


export default function CatalogFilters({ searchParams }) {


    return (
        <>
            <CatalogPage searchParams={searchParams} />
        </>
    );
}
