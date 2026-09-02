// app/components/website/courses/CourseCard.jsx
"use client";

import { BookOpen, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../store/hooks";
import toast from "react-hot-toast";

export default function CourseCard({ course }) {
    const router = useRouter();

    // Get user authentication state
    const { isAuthenticated } = useAppSelector((state) => state.user);

    console.log('course ===>', course);
    console.log('isAuthenticated ===>', isAuthenticated);

    const getLevelColor = (level) => {
        const colors = {
            Beginner: "bg-green-100 text-green-700",
            Intermediate: "bg-yellow-100 text-yellow-700",
            Advanced: "bg-red-100 text-red-700",
        };
        return colors[level] || "bg-gray-100 text-gray-700";
    };

    const isValidImageUrl = (url) => {
        if (!url) return false;
        try {
            const parsedUrl = new URL(url);
            const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
            const pathname = parsedUrl.pathname.toLowerCase();
            const isValid = validExtensions.some(ext => pathname.endsWith(ext)) ||
                pathname.includes('image') ||
                pathname.includes('photo') ||
                pathname.includes('img');
            return isValid;
        } catch {
            return false;
        }
    };

    const hasValidImage = course?.thumbnail_url &&
        typeof course.thumbnail_url === 'string' &&
        course.thumbnail_url.trim() !== '' &&
        !course.thumbnail_url.includes('string') &&
        isValidImageUrl(course.thumbnail_url);

    console.log('hasValidImage ===>', hasValidImage);

    // Handle link click - check if user is authenticated
    const handleLinkClick = (e) => {
        if (!isAuthenticated) {
            e.preventDefault();
            e.stopPropagation();
            toast.error("Please login to access course details");
            // Optional: Redirect to login page
            // router.push('/login');
            return;
        }
    };

    return (
        <Link
            href={`/courses/${course.slug}`}
            className="group block"
            onClick={handleLinkClick}
        >
            <div className="overflow-hidden rounded-xl border border-[#14301F]/10 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-[#14301F]/5">
                    {hasValidImage ? (
                        <Image
                            src={course?.thumbnail_url}
                            alt={course?.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#72BB83]/20 to-[#14301F]/20">
                            <BookOpen className="h-12 w-12 text-[#14301F]/20" />
                        </div>
                    )}

                    {/* Level Badge */}
                    <span className={`absolute top-3 right-3 rounded-full px-2.5 py-1 text-xs font-bold ${getLevelColor(course.level)}`}>
                        {course.level}
                    </span>
                </div>

                {/* Content */}
                <div className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                        <span className="text-xs font-medium text-[#72BB83]">{course.topic}</span>
                        <span className="h-1 w-1 rounded-full bg-[#14301F]/20" />
                        <span className="text-xs text-[#14301F]/40">{course.length_min} min</span>
                    </div>

                    <h3 className="text-base font-bold text-[#14301F] line-clamp-2 group-hover:text-[#72BB83] transition-colors">
                        {course.title}
                    </h3>

                    {course.tagline && (
                        <p className="mt-1 text-sm text-[#14301F]/55 line-clamp-2">
                            {course.tagline}
                        </p>
                    )}

                    <div className="mt-3 flex items-center justify-between border-t border-[#14301F]/10 pt-3">
                        <div className="flex items-center gap-2 text-sm text-[#14301F]/55">
                            <User className="h-3.5 w-3.5" />
                            <span>{course.instructor_name || "Instructor"}</span>
                        </div>
                        {course.is_published && (
                            <span className="text-xs font-medium text-green-600">Published</span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}