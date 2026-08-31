// app/(user-panel)/my-courses/MyCoursesClient.jsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CourseTable from "../../components/userDashboardComp/userCoursesComp/CourseTable";
import DeleteConfirmModal from "../../components/userDashboardComp/userCoursesComp/DeleteConfirmModal";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { resetFilters, setFilters, setPagination } from "../../store/slices/courses/courseSlice";
import { deleteCourse, getCourses } from "../../store/slices/courses/courseThunks";

export default function MyCoursesClient() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { courses, loading, pagination, filters } = useAppSelector((state) => state.courses);

    const [deleteCourseData, setDeleteCourseData] = useState(null);

    // Fetch courses on mount and when filters/pagination change
    useEffect(() => {
        const fetchCourses = async () => {
            const skip = (pagination.page - 1) * pagination.limit;
            await dispatch(getCourses({
                search: filters.search,
                topic: filters.topic,
                level: filters.level,
                skip,
                limit: pagination.limit,
            }));
        };

        fetchCourses();
    }, [dispatch, filters.search, filters.topic, filters.level, pagination.page, pagination.limit]);

    const handleFilterChange = (newFilters) => {
        dispatch(setFilters(newFilters));
        dispatch(setPagination({ page: 1, skip: 0 }));
    };

    const handleReset = () => {
        dispatch(resetFilters());
        dispatch(setPagination({ page: 1, skip: 0 }));
    };

    const handlePageChange = (page) => {
        dispatch(setPagination({ page, skip: (page - 1) * pagination.limit }));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleView = (course) => {
        router.push(`/course-details/${course?.slug}`);
    };

    const handleEdit = (course) => {
        router.push(`/admin/courses/edit/${course?.id}`);
    };

    const handleDelete = (course) => {
        setDeleteCourseData(course);
    };

    const handleDeleteConfirm = async () => {
        if (deleteCourseData) {
            await dispatch(deleteCourse(deleteCourseData.id));
            setDeleteCourseData(null);
            // Refresh courses
            const skip = (pagination.page - 1) * pagination.limit;
            await dispatch(getCourses({
                search: filters.search,
                topic: filters.topic,
                level: filters.level,
                skip,
                limit: pagination.limit,
            }));
        }
    };

    // Transform API data to match CourseTable expected format
    const transformCourses = (courses) => {
        if (!courses || !Array.isArray(courses)) return [];

        return courses.map((course) => ({
            id: course.id,
            slug: course.slug,
            title: course.title || "Untitled Course",
            category: course.topic || "General",
            level: course.level || "Beginner",
            status: course.is_published ? "Published" : "Draft",
            creationDate: course.created_at ?
                new Date(course.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                }) : "N/A",
            sales: 0,
            enrollments: 0,
            tone: "#365B50",
            progress: 0,
            instructor_name: course.instructor_name || "Instructor",
            thumbnail_url: course.thumbnail_url || "",
            length_min: course.length_min || 0,
        }));
    };

    const transformedCourses = transformCourses(courses);

    return (
        <section className="min-h-screen bg-[#FFF7ED] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
            <div className="mx-6">
                {/* Course Table */}
                <CourseTable
                    courses={transformedCourses}
                    onCreateNew={() => router.push("/admin/courses/create")}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    pagination={{
                        currentPage: pagination.page,
                        totalPages: pagination.totalPages,
                        onPageChange: handlePageChange,
                    }}
                    loading={loading}
                />

                <DeleteConfirmModal
                    isOpen={!!deleteCourseData}
                    onClose={() => setDeleteCourseData(null)}
                    onConfirm={handleDeleteConfirm}
                    courseTitle={deleteCourseData?.title || ""}
                />
            </div>
        </section>
    );
}