import type { ReactNode } from "react";
import { BrainCircuit, FileText, Share2 } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

const FEATURES = [
  {
    icon: BrainCircuit,
    title: "AI Architecture Generation",
    description:
      "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Share2,
    title: "Real-time Collaboration",
    description:
      "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: FileText,
    title: "Instant Spec Generation",
    description:
      "Export a complete Markdown technical spec directly from the canvas graph.",
  },
];

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          backgroundColor: "#00C8D4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: 15,
          color: "#000",
          flexShrink: 0,
          lineHeight: 1,
        }}
      >
        G
      </div>
      <span
        style={{
          fontSize: 17,
          fontWeight: 600,
          color: "#fff",
          letterSpacing: "-0.01em",
        }}
      >
        Ghost AI
      </span>
    </div>
  );
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#000",
        fontFamily: "var(--font-geist-sans, sans-serif)",
        overflow: "hidden",
      }}
      className="auth-two-col"
    >
      {/* ── LEFT MARKETING PANEL ───────────────────────────────── */}
      <section
        style={{
          backgroundColor: "#0B0C14",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "40px 48px",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Logo */}
        <Brand />

        {/* Hero Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 48, paddingBottom: 48 }}>
          <h1
            style={{
              fontSize: "clamp(36px, 4vw, 56px)",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              margin: 0,
              marginBottom: 20,
            }}
          >
            Design systems at the
            <br />
            speed of thought.
          </h1>

          <p
            style={{
              fontSize: 15,
              color: "#94A3B8",
              lineHeight: 1.65,
              margin: 0,
              marginBottom: 44,
              maxWidth: 420,
            }}
          >
            Describe your architecture in plain English. Ghost AI maps it to a
            shared canvas your whole team can refine in real time.
          </p>

          {/* Feature rows */}
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: 28,
            }}
          >
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <li
                key={title}
                style={{ display: "flex", alignItems: "flex-start", gap: 16 }}
              >
                {/* Circular icon container */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    backgroundColor: "#0D2129",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: "#00C8D4",
                  }}
                >
                  <Icon
                    style={{ width: 18, height: 18 }}
                    aria-hidden="true"
                    strokeWidth={1.75}
                  />
                </div>
                <div style={{ paddingTop: 2 }}>
                  <h2
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#fff",
                      margin: 0,
                      marginBottom: 4,
                      lineHeight: 1.3,
                    }}
                  >
                    {title}
                  </h2>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#607880",
                      margin: 0,
                      lineHeight: 1.6,
                    }}
                  >
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer copyright */}
        <p
          style={{
            fontSize: 12,
            color: "#3D4E57",
            margin: 0,
          }}
        >
          © 2026 Ghost AI. All rights reserved.
        </p>
      </section>

      {/* ── RIGHT AUTH PANEL ───────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          overflow: "auto",
          padding: "32px 40px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 460 }}>
          {children}
        </div>
      </section>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 767px) {
          .auth-two-col {
            grid-template-columns: 1fr !important;
            grid-template-rows: auto 1fr !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
          }
          .auth-two-col > section:first-child {
            height: auto !important;
            padding: 32px 24px !important;
          }
          .auth-two-col > section:last-child {
            height: auto !important;
            min-height: 60vh !important;
            padding: 32px 24px !important;
          }
        }
      `}</style>
    </main>
  );
}
