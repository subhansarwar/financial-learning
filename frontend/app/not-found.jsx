import Link from "next/link";

export const metadata = {
  title: "Page Not Found Finance Platform Demo",
  description: "The page you're looking for doesn't exist. Browse our free finance courses instead.",
  robots: "noindex, follow",
};

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap-narrow" style={{ textAlign: "center", padding: "60px 0" }}>
        <div style={{ fontSize: "4rem" }}>🧭</div>
        <h1 className="section-title" style={{ margin: "14px 0 10px" }}>This page wandered off.</h1>
        <p className="text-muted" style={{ marginBottom: "26px" }}>
          The link may be old, or the page moved. The catalog is always a good place to restart.
        </p>
        <Link className="btn btn-primary" href="/catalog">Browse courses</Link>
        <Link className="btn btn-outline" href="/" style={{ marginLeft: "10px" }}>Go home</Link>
      </div>
    </section>
  );
}