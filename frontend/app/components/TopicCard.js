"use client"
import Link from "next/link";

export default function TopicCard({ topic, count }) {
    const { id, name, icon, hue, blurb } = topic;

    return (
        <Link href={`/catalog?topic=${id}`} className="topic-card">
            <span className="t-count">{count} course{count === 1 ? "" : "s"}</span>
            <div className="t-icon">{icon}</div>
            <h3>{name}</h3>
            <p>{blurb}</p>

            <style jsx>{`
        .topic-card {
          background: var(--card);
          border: 1px solid var(--line);
          border-radius: var(--radius);
          padding: 24px;
          text-decoration: none;
          color: var(--ink);
          transition: all 0.25s ease;
          position: relative;
          display: block;
          --hue: ${hue || 160};
        }

        .topic-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow);
          border-color: var(--gold);
        }

        .t-icon {
          font-size: 2.2rem;
          margin-bottom: 12px;
        }

        .t-count {
          position: absolute;
          top: 16px;
          right: 16px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--muted);
          background: var(--bg);
          padding: 2px 12px;
          border-radius: 99px;
        }

        .topic-card h3 {
          font-size: 1.15rem;
          font-weight: 700;
          margin-bottom: 8px;
          color: var(--ink);
        }

        .topic-card p {
          font-size: 0.92rem;
          color: var(--ink-2);
          line-height: 1.5;
          margin: 0;
        }

        .topic-card:hover h3 {
          color: var(--gold-deep);
        }

        @media (max-width: 640px) {
          .topic-card {
            padding: 18px;
          }
          .topic-card h3 {
            font-size: 1rem;
          }
          .t-icon {
            font-size: 1.8rem;
          }
        }
      `}</style>
        </Link>
    );
}