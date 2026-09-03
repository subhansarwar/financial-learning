// app/components/website/courses/CourseCard.jsx
"use client";

import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useAppSelector } from "../store/hooks";
import AuthModal from "./auth/AuthModal";

export default function CourseCard({ course }) {
    console.log('course ===>', course)
    const router = useRouter();
    const pathname = usePathname();
    const [showAuthModal, setShowAuthModal] = useState(false);


    // Get user authentication state
    const { isAuthenticated } = useAppSelector((state) => state.user);

    console.log('course ===>', course);
    console.log('isAuthenticated ===>', isAuthenticated);

    const getRandomIcon = useMemo(() => {
        // Use course id or slug to deterministically pick an icon
        const seed = course?.id || course?.slug || '';
        const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const icons = ['📚', '🌱', '🎓'];
        return icons[hash % icons.length];
    }, [course?.id, course?.slug]);

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
            setShowAuthModal(true);
            // Optional: Redirect to login page
            // router.push('/login');
            return;
        }
    };

    return (
        <>
            <Link
                href={`/course/${course.slug}`}
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
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#72BB83]/10 to-[#14301F]/5 transition-transform duration-300 group-hover:scale-105">
                                <span className="text-6xl">{getRandomIcon}</span>
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
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                redirectPath={pathname}
            />
        </>
    );
}