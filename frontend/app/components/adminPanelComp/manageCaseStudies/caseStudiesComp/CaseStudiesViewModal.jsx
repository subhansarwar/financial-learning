// app/components/adminPanelComp/manageCaseStudies/caseStudiesComp/CaseStudiesViewModal.jsx
"use client";

import {
    X,
    Calendar,
    Clock,
    ImageIcon,
    FileText,
    Building2,
    MapPin,
    Link2,
    Tag,
    Trophy,
    CircleCheck,
    CircleDashed,
} from "lucide-react";
import Image from "next/image";

function InfoItem({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-2.5">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#47735B]" strokeWidth={2} />
            <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-muted">{label}</p>
                <p className="truncate text-sm font-semibold text-ink">{value || "—"}</p>
            </div>
        </div>
    );
}

function formatDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

export default function CaseStudiesViewModal({ caseStudy, onClose }) {
    if (!caseStudy) return null;

    // "content" backend se ek plain string aati hai, sections "\n\n" se separated hote hain,
    // aur har section ke pehle line ko heading maana jata hai (jab agli line se short/title-like ho)
    const contentSections = (caseStudy?.content || "")
        .split(/\n\n+/)
        .map((block) => block.trim())
        .filter(Boolean)
        .map((block) => {
            const lines = block.split("\n");
            if (lines.length > 1) {
                return { heading: lines[0], text: lines.slice(1).join("\n") };
            }
            return { heading: "", text: lines[0] };
        });

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
                            {caseStudy.is_published ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                                    <CircleCheck className="h-3 w-3" strokeWidth={2.5} />
                                    Published
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                                    <CircleDashed className="h-3 w-3" strokeWidth={2.5} />
                                    Draft
                                </span>
                            )}
                            {caseStudy.industry && (
                                <span className="rounded-full bg-brand-soft/50 px-2.5 py-1 text-xs font-bold text-brand-deep">
                                    {caseStudy.industry}
                                </span>
                            )}
                            <span className="text-xs font-bold uppercase tracking-wide text-muted">
                                {caseStudy.slug}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold tracking-tight text-ink sm:text-xl md:text-2xl line-clamp-2">
                            {caseStudy.title}
                        </h3>
                        {caseStudy.company_name && (
                            <p className="mt-1 text-sm text-muted">{caseStudy.company_name}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-[#47735B] hover:text-white sm:h-9 sm:w-9"
                    >
                        <X className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
                    </button>
                </div>

                {/* Body */}
                <div className="space-y-5 p-4 sm:p-5 md:p-6">
                    {/* Thumbnail Image */}
                    <div>
                        <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted">
                            <ImageIcon className="h-3.5 w-3.5" strokeWidth={2} />
                            Thumbnail
                        </p>
                        {caseStudy.thumbnail_url ? (
                            <div className="relative aspect-video w-full overflow-hidden rounded-xl2 border border-line-soft bg-cream-2/30">
                                <Image
                                    src={caseStudy.thumbnail_url}
                                    alt={caseStudy.title || "Case study thumbnail"}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 700px"
                                />
                            </div>
                        ) : (
                            <div className="flex aspect-video w-full flex-col items-center justify-center rounded-xl2 border border-dashed border-line-soft bg-cream-2/30 p-6 text-center">
                                <ImageIcon className="h-8 w-8 text-muted" strokeWidth={1.5} />
                                <p className="mt-1 text-sm text-muted">No thumbnail uploaded</p>
                            </div>
                        )}
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                        <InfoItem icon={Building2} label="Company" value={caseStudy.company_name} />
                        <InfoItem icon={MapPin} label="Location" value={caseStudy.location} />
                        <InfoItem icon={Link2} label="Source" value={caseStudy.source} />
                        <InfoItem icon={Calendar} label="Date" value={formatDate(caseStudy.date)} />
                        <InfoItem icon={Clock} label="Created" value={formatDate(caseStudy.created_at)} />
                        <InfoItem icon={Calendar} label="Updated" value={formatDate(caseStudy.updated_at)} />
                    </div>

                    {/* Tags */}
                    {caseStudy.tags?.length > 0 && (
                        <div>
                            <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted">
                                <Tag className="h-3.5 w-3.5" strokeWidth={2} />
                                Tags
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {caseStudy.tags.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="rounded-full bg-brand-soft/50 px-2.5 py-1 text-xs font-bold text-brand-deep"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Key Results */}
                    {caseStudy.key_results?.length > 0 && (
                        <div>
                            <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted">
                                <Trophy className="h-3.5 w-3.5" strokeWidth={2} />
                                Key Results
                            </p>
                            <ul className="space-y-1.5">
                                {caseStudy.key_results.map((result, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start gap-2 rounded-lg border border-line-soft bg-cream-2/30 px-3 py-2 text-sm text-ink-2"
                                    >
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                                        {result}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Summary */}
                    <div>
                        <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted">
                            <FileText className="h-3.5 w-3.5" strokeWidth={2} />
                            Summary
                        </p>
                        <p className="text-sm leading-relaxed text-ink-2">
                            {caseStudy.summary || "No summary provided."}
                        </p>
                    </div>

                    {/* Content Sections */}
                    <div>
                        <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted">
                            <FileText className="h-3.5 w-3.5" strokeWidth={2} />
                            Content
                        </p>
                        <div className="space-y-3">
                            {contentSections.length > 0 ? (
                                contentSections.map((section, index) => (
                                    <div
                                        key={index}
                                        className="rounded-lg border border-line-soft bg-cream-2/30 p-3 sm:p-4"
                                    >
                                        {section.heading && (
                                            <h4 className="font-bold text-ink text-sm sm:text-base">
                                                {section.heading}
                                            </h4>
                                        )}
                                        <p className="mt-1 whitespace-pre-line text-sm text-ink-2 leading-relaxed">
                                            {section.text || "No content provided."}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted">No content available.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex flex-wrap gap-3 border-t border-line-soft p-4 sm:p-5 md:p-6">
                    <button
                        onClick={onClose}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold text-white transition-colors bg-[#47735B] hover:bg-[#47735B]"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}