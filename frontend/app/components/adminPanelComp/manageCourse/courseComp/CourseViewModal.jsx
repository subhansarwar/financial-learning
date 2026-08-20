// app/components/adminPanelComp/manageCourse/courseComp/CourseViewModal.jsx
"use client";

import { X, Pencil, Globe, Layers, DollarSign, Tag, Layers3, PlayCircle, ImageIcon, Video, FileText, Calendar, Users, Star, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import StatusBadge from "./StatusBadge";
import Image from "next/image";
import { useState } from "react";

function InfoItem({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-2.5">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={2} />
            <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-wide text-muted">{label}</p>
                <p className="text-sm font-semibold text-ink truncate">{value || "—"}</p>
            </div>
        </div>
    );
}

export default function CourseViewModal({ course, onClose, onEdit }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!course) return null;

    // Get all images from course
    const allImages = course.images || [];
    const coverImage = course.coverImageName || course.coverImage || course.image || (allImages.length > 0 ? allImages[0] : null);
    const hasImages = allImages.length > 0;
    const hasVideos = course.videos && course.videos.length > 0;

    // Filter valid image URLs
    const validImages = allImages.filter(img => {
        return img && (
            img.startsWith('data:image') ||
            img.startsWith('/') ||
            img.startsWith('http') ||
            img.startsWith('blob:')
        );
    });

    const hasValidImages = validImages.length > 0;

    const getVideoUrl = (video) => {
        return video.url || video.src || video.videoUrl || null;
    };

    const getVideoThumbnail = (video) => {
        return video.thumbnail || video.poster || null;
    };

    const openLightbox = (index) => {
        setCurrentImageIndex(index);
        setSelectedImage(validImages[index]);
    };

    const closeLightbox = () => {
        setSelectedImage(null);
        setCurrentImageIndex(0);
    };

    const nextImage = (e) => {
        e.stopPropagation();
        if (currentImageIndex < validImages.length - 1) {
            const newIndex = currentImageIndex + 1;
            setCurrentImageIndex(newIndex);
            setSelectedImage(validImages[newIndex]);
        }
    };

    const prevImage = (e) => {
        e.stopPropagation();
        if (currentImageIndex > 0) {
            const newIndex = currentImageIndex - 1;
            setCurrentImageIndex(newIndex);
            setSelectedImage(validImages[newIndex]);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm animate-in fade-in duration-200 sm:p-4"
            onClick={onClose}
        >
            <div
                className="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-xl2 border border-line bg-card shadow-card-lg animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-line-soft bg-card p-4 sm:p-5 md:p-6">
                    <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <StatusBadge status={course.status} />
                            <span className="text-xs font-bold uppercase tracking-wide text-muted">
                                {course.category}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold tracking-tight text-ink sm:text-xl md:text-2xl line-clamp-2">
                            {course.title}
                        </h3>
                        <p className="mt-1 text-sm text-muted line-clamp-2">{course.subtitle}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-cream-2 hover:text-ink sm:h-9 sm:w-9"
                    >
                        <X className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
                    </button>
                </div>

                {/* Body */}
                <div className="space-y-5 p-4 sm:p-5 md:p-6">
                    {/* Cover Image - Smaller size like Case Studies */}
                    {coverImage && (
                        <div className="relative w-full overflow-hidden rounded-xl2 bg-gradient-to-br from-brand-soft/20 to-cream-2">
                            <div className="aspect-[16/9] w-full relative max-h-[280px]">
                                {coverImage.startsWith('data:image') || coverImage.startsWith('/') || coverImage.startsWith('http') || coverImage.startsWith('blob:') ? (
                                    <Image
                                        src={coverImage}
                                        alt={course.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        priority
                                    />
                                ) : (
                                    <div className="flex h-full w-full flex-col items-center justify-center bg-cream-2/50">
                                        <ImageIcon className="h-12 w-12 text-brand/30" strokeWidth={1.5} />
                                        <p className="mt-2 text-sm text-muted font-medium">{coverImage}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Info Grid - 4 columns */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <InfoItem icon={Globe} label="Language" value={course.language} />
                        <InfoItem icon={Layers} label="Level" value={course.level} />
                        <InfoItem
                            icon={DollarSign}
                            label="Price"
                            value={course.price > 0 ? `$${course.price}` : "Free"}
                        />
                        <InfoItem icon={Tag} label="Category" value={course.category} />
                    </div>

                    {/* Description */}
                    <div>
                        <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted">
                            <FileText className="h-3.5 w-3.5" strokeWidth={2} />
                            Description
                        </p>
                        <div className="rounded-lg border border-line-soft bg-cream-2/30 p-3 sm:p-4">
                            <p className="text-sm leading-relaxed text-ink-2">
                                {course.description || "No description provided."}
                            </p>
                        </div>
                    </div>

                    {/* Images Gallery - Like Case Studies */}
                    {hasValidImages && (
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted">
                                    <ImageIcon className="h-3.5 w-3.5" strokeWidth={2} />
                                    Images ({validImages.length})
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                                {validImages.map((img, index) => (
                                    <div
                                        key={index}
                                        className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg border border-line-soft bg-cream-2/30 transition-all duration-300 hover:shadow-md"
                                        onClick={() => openLightbox(index)}
                                    >
                                        <Image
                                            src={img}
                                            alt={`Image ${index + 1}`}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                                        />
                                        <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/40" />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                                            <p className="text-xs text-white truncate">Image {index + 1}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Fallback: Show image names if no valid images */}
                    {!hasValidImages && allImages.length > 0 && (
                        <div>
                            <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted">
                                <ImageIcon className="h-3.5 w-3.5" strokeWidth={2} />
                                Uploaded Files ({allImages.length})
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {allImages.map((img, index) => (
                                    <div key={index} className="flex items-center gap-2 rounded-lg border border-line-soft bg-cream-2/30 px-3 py-2">
                                        <ImageIcon className="h-4 w-4 text-brand" strokeWidth={2} />
                                        <span className="text-sm text-ink-2 truncate max-w-[150px]">{img}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Videos Section */}
                    {hasVideos && (
                        <div>
                            <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted">
                                <Video className="h-3.5 w-3.5" strokeWidth={2} />
                                Videos ({course.videos.length})
                            </p>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {course.videos.map((video, index) => {
                                    const videoUrl = getVideoUrl(video);
                                    const thumbnail = getVideoThumbnail(video);
                                    return (
                                        <div key={index} className="overflow-hidden rounded-lg border border-line-soft bg-cream-2/30">
                                            {videoUrl ? (
                                                <div className="aspect-video w-full bg-black">
                                                    <video
                                                        src={videoUrl}
                                                        controls
                                                        className="h-full w-full object-contain"
                                                        poster={thumbnail}
                                                        controlsList="nodownload"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex aspect-video w-full flex-col items-center justify-center bg-cream-2/50 p-4 text-center">
                                                    <Video className="h-8 w-8 text-muted" strokeWidth={1.5} />
                                                    <p className="mt-1 text-sm text-muted">{video.name || `Video ${index + 1}`}</p>
                                                </div>
                                            )}
                                            {video.name && (
                                                <div className="p-2">
                                                    <p className="text-sm font-medium text-ink truncate">{video.name}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Curriculum */}
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <Layers3 className="h-4 w-4 text-brand" strokeWidth={2} />
                            <p className="text-sm font-bold text-ink">Curriculum</p>
                            {course.curriculum && (
                                <span className="text-xs text-muted bg-cream-2/50 px-2 py-0.5 rounded-full">
                                    {course.curriculum.length} sections
                                </span>
                            )}
                        </div>
                        <div className="space-y-2">
                            {(course.curriculum || []).length > 0 ? (
                                course.curriculum.map((section, idx) => (
                                    <div
                                        key={section.id || idx}
                                        className="rounded-lg border border-line-soft bg-cream-2/30 p-3 sm:p-4"
                                    >
                                        <p className="font-bold text-ink text-sm sm:text-base">
                                            {section.name || "Untitled section"}
                                        </p>
                                        <div className="mt-1.5 space-y-1">
                                            {(section.lectures || []).map((lecture, lIdx) => (
                                                <div
                                                    key={lecture.id || lIdx}
                                                    className="flex items-center gap-2 rounded-md px-2 py-1 text-xs text-ink-2 hover:bg-cream-2/50"
                                                >
                                                    <PlayCircle className="h-3.5 w-3.5 text-brand/70" strokeWidth={2} />
                                                    <span className="truncate flex-1">{lecture.name || "Untitled lecture"}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-lg border border-dashed border-line-soft bg-cream-2/30 p-6 text-center">
                                    <Layers3 className="mx-auto h-8 w-8 text-muted" strokeWidth={1.5} />
                                    <p className="mt-2 text-sm text-muted">No curriculum available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 flex flex-wrap gap-3 border-t border-line-soft bg-card p-4 sm:p-5 md:p-6">
                    <button
                        onClick={onEdit}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-brand-deep px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#241f6b]"
                    >
                        <Pencil className="h-4 w-4" strokeWidth={2.5} />
                        Edit Course
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-line bg-card px-6 py-2.5 text-sm font-bold text-ink-2 transition-colors hover:border-brand/40 hover:bg-brand-soft/30 hover:text-brand-deep"
                    >
                        Close
                    </button>
                </div>

                {/* Image Lightbox - Like Case Studies */}
                {selectedImage && (
                    <div
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-200"
                        onClick={closeLightbox}
                    >
                        <button
                            onClick={closeLightbox}
                            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
                        >
                            <X className="h-5 w-5" strokeWidth={2.5} />
                        </button>

                        {validImages.length > 1 && currentImageIndex > 0 && (
                            <button
                                onClick={prevImage}
                                className="absolute left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
                            >
                                <ChevronLeft className="h-6 w-6" strokeWidth={2.5} />
                            </button>
                        )}

                        {validImages.length > 1 && currentImageIndex < validImages.length - 1 && (
                            <button
                                onClick={nextImage}
                                className="absolute right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
                            >
                                <ChevronRight className="h-6 w-6" strokeWidth={2.5} />
                            </button>
                        )}

                        <div className="relative max-h-[85vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
                            <Image
                                src={selectedImage}
                                alt={`Image ${currentImageIndex + 1}`}
                                width={1200}
                                height={800}
                                className="max-h-[85vh] w-auto max-w-[90vw] rounded-lg object-contain"
                                priority
                            />
                            {validImages.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
                                    {currentImageIndex + 1} / {validImages.length}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}