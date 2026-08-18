// app/components/TopicCard.js
"use client";

import Link from "next/link";

export default function TopicCard({ topic, count }) {
  const { id, name, icon, hue, blurb } = topic;

  return (
    <Link
      href={`/catalog?topic=${id}`}
      style={{ "--hue": hue || 245 }}
      className="group relative block rounded-xl2 border border-line bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-card-lg sm:p-6"
    >
      <span className="absolute right-4 top-4 rounded-full bg-cream-2 px-3 py-0.5 text-xs font-bold text-muted sm:right-5 sm:top-5">
        {count} course{count === 1 ? "" : "s"}
      </span>

      <div
        className="mb-4 grid h-12 w-12 place-items-center rounded-2xl text-2xl sm:h-14 sm:w-14 sm:text-3xl"
        style={{ background: "hsl(var(--hue) 70% 94%)" }}
      >
        {icon}
      </div>

      <h3 className="mb-2 text-base font-bold tracking-tight text-ink transition-colors duration-300 group-hover:text-brand-deep sm:text-lg">
        {name}
      </h3>

      <p className="text-sm font-medium leading-relaxed text-muted">{blurb}</p>
    </Link>
  );
}