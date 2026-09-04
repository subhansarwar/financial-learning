// app/components/adminPanelComp/manageCaseStudies/caseStudiesComp/CaseStudiesViewModal.jsx
"use client";

import { X, User, Calendar, Clock, ImageIcon, FileText, BookOpen, UserCircle2, CalendarDays } from "lucide-react";
import Image from "next/image";

function InfoItem({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-2.5">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={2} />
            <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-muted">{label}</p>
                <p className="text-sm font-semibold text-ink truncate">{value || "—"}</p>
            </div>
        </div>
    );
}

export default function CaseStudiesViewModal({ caseStudy, onClose }) {
    if (!caseStudy) return null;

    const contentArray = Array.isArray(caseStudy?.content)
        ? caseStudy.content
        : caseStudy?.content
            ? [{ heading: "Content", text: caseStudy.content }]
            : [];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm animate-in fade-in duration-200 sm:p-4"
            onClick={onClose}
        >
            <div
                className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl2 border border-line bg-card shadow-card-lg animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 border-b border-line-soft p-4 sm:p-5 md:p-6">
                    <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Published
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wide text-muted">
                                {caseStudy.slug}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold tracking-tight text-ink sm:text-xl md:text-2xl line-clamp-2">
                            {caseStudy.title}
                        </h3>
                        <p className="mt-1 text-sm text-muted">by {caseStudy.author}</p>
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
                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                        <InfoItem icon={User} label="Author" value={caseStudy.author} />
                        <InfoItem icon={Clock} label="Created" value={caseStudy.createdAt} />
                        <InfoItem icon={Calendar} label="Updated" value={caseStudy.updatedAt} />
                        {caseStudy.publishedAt && (
                            <InfoItem icon={CalendarDays} label="Published" value={caseStudy.publishedAt} />
                        )}
                    </div>

                    {/* Short Description */}
                    <div>
                        <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted">
                            <FileText className="h-3.5 w-3.5" strokeWidth={2} />
                            Short Description
                        </p>
                        <p className="text-sm leading-relaxed text-ink-2">{caseStudy.shortDescription}</p>
                    </div>

                    {/* Introduction */}
                    <div>
                        <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted">
                            <BookOpen className="h-3.5 w-3.5" strokeWidth={2} />
                            Introduction
                        </p>
                        <p className="text-sm leading-relaxed text-ink-2">{caseStudy.introduction}</p>
                    </div>

                    {/* Content Sections */}
                    <div>
                        <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted">
                            <UserCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
                            Content
                        </p>
                        <div className="space-y-3">
                            {contentArray.length > 0 ? (
                                contentArray.map((section, index) => (
                                    <div key={index} className="rounded-lg border border-line-soft bg-cream-2/30 p-3 sm:p-4">
                                        <h4 className="font-bold text-ink text-sm sm:text-base">
                                            {section.heading || "Untitled Section"}
                                        </h4>
                                        <p className="mt-1 text-sm text-ink-2 leading-relaxed">
                                            {section.text || "No content provided."}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted">No content sections available.</p>
                            )}
                        </div>
                    </div>

                    {/* Images */}
                    <div>
                        <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted">
                            <ImageIcon className="h-3.5 w-3.5" strokeWidth={2} />
                            Images
                        </p>
                        {caseStudy.images && caseStudy.images.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                                {caseStudy.images.map((img, index) => (
                                    <div
                                        key={index}
                                        className="group relative aspect-square overflow-hidden rounded-lg border border-line-soft bg-cream-2/30"
                                    >
                                        {img.startsWith('data:image') || img.startsWith('/') || img.startsWith('http') ? (
                                            <Image
                                                src={img}
                                                alt={`Image ${index + 1}`}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full flex-col items-center justify-center text-muted">
                                                <ImageIcon className="h-8 w-8" strokeWidth={1.5} />
                                                <span className="mt-1 text-xs truncate px-2">{img}</span>
                                            </div>
                                        )}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                                            <p className="text-xs text-white truncate">Image {index + 1}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-line-soft bg-cream-2/30 p-6 text-center">
                                <ImageIcon className="h-8 w-8 text-muted" strokeWidth={1.5} />
                                <p className="mt-1 text-sm text-muted">No images uploaded</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex flex-wrap gap-3 border-t border-line-soft p-4 sm:p-5 md:p-6">
                    <button
                        onClick={onClose}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-brand-deep px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#241f6b]"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}