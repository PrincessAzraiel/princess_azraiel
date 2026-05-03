import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Experience Ended | Princess Azraiel",
};

export default function StoppedLayout() {
  return <DiscontinuedPage />;
}

function DiscontinuedPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050306",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "Georgia, serif",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "400px" }}>
        <p
          style={{
            color: "#ec4899",
            fontSize: "10px",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            fontFamily: "monospace",
            marginBottom: "16px",
            opacity: 0.8,
          }}
        >
          · Experience Ended ·
        </p>
        <h1 style={{ fontSize: "1.9rem", marginBottom: "12px", lineHeight: 1.2, fontWeight: 400 }}>
          This protocol has ended.
        </h1>
        <p
          style={{
            color: "rgba(253,242,248,0.5)",
            fontSize: "14px",
            lineHeight: 1.7,
            marginBottom: "28px",
            fontFamily: "sans-serif",
          }}
        >
          This experience has been retired from active rotation. Explore her current
          programs instead.
        </p>
        <a
          href="/programs"
          style={{
            display: "inline-block",
            padding: "10px 24px",
            background: "rgba(236,72,153,0.12)",
            border: "1px solid rgba(236,72,153,0.35)",
            color: "#fbcfe8",
            borderRadius: "999px",
            fontSize: "13px",
            textDecoration: "none",
            fontFamily: "sans-serif",
          }}
        >
          View Active Programs →
        </a>
        <br />
        <br />
        <a
          href="/"
          style={{
            color: "rgba(255,255,255,0.25)",
            fontSize: "12px",
            textDecoration: "none",
            fontFamily: "sans-serif",
          }}
        >
          ← Return Home
        </a>
      </div>
    </div>
  );
}
