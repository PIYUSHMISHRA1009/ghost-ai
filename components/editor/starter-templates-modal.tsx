"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import {
  CANVAS_TEMPLATES,
  type CanvasTemplate,
} from "@/components/editor/starter-templates";

interface StarterTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (template: CanvasTemplate) => void;
}

/* ─── Download icon (matches the reference's ↓ with underline) ──────────── */
function DownloadSvgIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M7 1.75V9.25M7 9.25L4.5 6.75M7 9.25L9.5 6.75"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.75 11.75H12.25"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── Microservices diagram ──────────────────────────────────────────────── */
/*
  Layout:
    [Blue pill]──┬──[Purple rect]──[Grey block]
                 ├──[Purple rect]──[Grey block]
                 ├──[Purple rect]──[Grey block]
                 └──[Purple rect]──[Grey block]
    [Purple hex] (below-left, connected by a line from the blue pill)
*/
function MicroservicesSvg() {
  return (
    <svg
      viewBox="0 0 240 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%" }}
    >
      {/* Blue pill → 4 purple service nodes (fan-out lines) */}
      <line x1="62" y1="70" x2="90" y2="22" stroke="#363748" strokeWidth="1" />
      <line x1="62" y1="70" x2="90" y2="47" stroke="#363748" strokeWidth="1" />
      <line x1="62" y1="70" x2="90" y2="72" stroke="#363748" strokeWidth="1" />
      <line x1="62" y1="70" x2="90" y2="97" stroke="#363748" strokeWidth="1" />

      {/* 4 purple nodes → 4 dark grey blocks */}
      <line x1="140" y1="22" x2="168" y2="22" stroke="#363748" strokeWidth="1" />
      <line x1="140" y1="47" x2="168" y2="47" stroke="#363748" strokeWidth="1" />
      <line x1="140" y1="72" x2="168" y2="72" stroke="#363748" strokeWidth="1" />
      <line x1="140" y1="97" x2="168" y2="97" stroke="#363748" strokeWidth="1" />

      {/* Blue pill down to hexagon */}
      <line x1="34" y1="79" x2="52" y2="116" stroke="#363748" strokeWidth="1" />

      {/* Blue API Gateway pill */}
      <rect x="6" y="61" width="56" height="18" rx="4" fill="#1e4e8c" />

      {/* 4 purple service node rectangles */}
      <rect x="90" y="13" width="50" height="18" rx="3" fill="#5c2490" />
      <rect x="90" y="38" width="50" height="18" rx="3" fill="#5c2490" />
      <rect x="90" y="63" width="50" height="18" rx="3" fill="#5c2490" />
      <rect x="90" y="88" width="50" height="18" rx="3" fill="#5c2490" />

      {/* 4 dark grey storage/db blocks */}
      <rect x="168" y="13" width="46" height="18" rx="3" fill="#1e2030" />
      <rect x="168" y="38" width="46" height="18" rx="3" fill="#1e2030" />
      <rect x="168" y="63" width="46" height="18" rx="3" fill="#1e2030" />
      <rect x="168" y="88" width="46" height="18" rx="3" fill="#1e2030" />

      {/* Purple hexagon (message bus / shared bus) */}
      {/* flat-top hexagon: center (55,130), r=18 */}
      <polygon
        points="55,112 70.6,121 70.6,139 55,148 39.4,139 39.4,121"
        fill="#5c2490"
      />
    </svg>
  );
}

/* ─── CI/CD Pipeline diagram ─────────────────────────────────────────────── */
/*
  Layout (horizontal chain):
  [Blue]─[Teal]─[Teal]─[Teal]─[◆ Orange]─[Teal]
*/
function CicdSvg() {
  // viewBox taller than chain so the diagram is vertically centered in container
  return (
    <svg
      viewBox="0 0 240 165"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%" }}
    >
      {/* Connector lines at y=83 (vertical center of 165) */}
      <line x1="40" y1="83" x2="48" y2="83" stroke="#363748" strokeWidth="1" />
      <line x1="78" y1="83" x2="86" y2="83" stroke="#363748" strokeWidth="1" />
      <line x1="116" y1="83" x2="124" y2="83" stroke="#363748" strokeWidth="1" />
      <line x1="154" y1="83" x2="162" y2="83" stroke="#363748" strokeWidth="1" />
      <line x1="192" y1="83" x2="200" y2="83" stroke="#363748" strokeWidth="1" />

      {/* Blue source node */}
      <rect x="10" y="74" width="30" height="18" rx="3" fill="#1e4e8c" />
      {/* Teal build/test/stage nodes */}
      <rect x="48" y="74" width="30" height="18" rx="3" fill="#1a6e52" />
      <rect x="86" y="74" width="30" height="18" rx="3" fill="#1a6e52" />
      <rect x="124" y="74" width="30" height="18" rx="3" fill="#1a6e52" />
      {/* Orange diamond (deploy/gate) */}
      <polygon points="177,74 192,83 177,92 162,83" fill="#9c3c1a" />
      {/* Teal production node */}
      <rect x="200" y="74" width="30" height="18" rx="3" fill="#1a6e52" />
    </svg>
  );
}

/* ─── Event-Driven System diagram ────────────────────────────────────────── */
/*
  Layout:
    [Blue pill]──┐
    [Blue pill]──┤
    [Blue pill]──┼──[◆ Purple hexagon]──[Teal rect]
    [Blue pill]──┘                    ──[Teal rect]
                                      ──[Teal rect]
                                      ──[Red  rect]
*/
function EventDrivenSvg() {
  // hexagon center (130, 72)
  const hx = 130;
  const hy = 72;
  return (
    <svg
      viewBox="0 0 240 145"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%" }}
    >
      {/* Left pills → hexagon center */}
      <line x1="66" y1="20"  x2={hx} y2={hy} stroke="#363748" strokeWidth="1" />
      <line x1="66" y1="51"  x2={hx} y2={hy} stroke="#363748" strokeWidth="1" />
      <line x1="66" y1="82"  x2={hx} y2={hy} stroke="#363748" strokeWidth="1" />
      <line x1="66" y1="113" x2={hx} y2={hy} stroke="#363748" strokeWidth="1" />

      {/* Hexagon center → right rects */}
      <line x1={hx} y1={hy} x2="173" y2="20"  stroke="#363748" strokeWidth="1" />
      <line x1={hx} y1={hy} x2="173" y2="51"  stroke="#363748" strokeWidth="1" />
      <line x1={hx} y1={hy} x2="173" y2="82"  stroke="#363748" strokeWidth="1" />
      <line x1={hx} y1={hy} x2="173" y2="113" stroke="#363748" strokeWidth="1" />

      {/* Left: 4 blue pill nodes (producers) */}
      <rect x="5"  y="11"  width="61" height="18" rx="9" fill="#1e4e8c" />
      <rect x="5"  y="42"  width="61" height="18" rx="9" fill="#1e4e8c" />
      <rect x="5"  y="73"  width="61" height="18" rx="9" fill="#1e4e8c" />
      <rect x="5"  y="104" width="61" height="18" rx="9" fill="#1e4e8c" />

      {/* Center: Purple hexagon (event bus) */}
      {/* pointy-top hexagon: center (130,72), r=30 */}
      <polygon
        points="130,42 155.98,57 155.98,87 130,102 104.02,87 104.02,57"
        fill="#5c2490"
      />

      {/* Right: 3 teal consumer rects */}
      <rect x="173" y="11"  width="56" height="18" rx="3" fill="#1a6e52" />
      <rect x="173" y="42"  width="56" height="18" rx="3" fill="#1a6e52" />
      <rect x="173" y="73"  width="56" height="18" rx="3" fill="#1a6e52" />
      {/* Right: 1 red error-queue rect */}
      <rect x="173" y="104" width="56" height="18" rx="3" fill="#7f1a26" />
    </svg>
  );
}

const DIAGRAM_MAP: Record<string, React.ReactNode> = {
  microservices: <MicroservicesSvg />,
  cicd: <CicdSvg />,
  "event-driven": <EventDrivenSvg />,
};

/* ─── Main Modal ─────────────────────────────────────────────────────────── */
export function StarterTemplatesModal({
  isOpen,
  onClose,
  onImport,
}: StarterTemplatesModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        style={{
          /* Override every base Tailwind class with explicit inline styles */
          background: "#1c1d27",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "20px",
          padding: "28px",
          maxWidth: "720px",
          width: "calc(100vw - 2rem)",
          gap: 0,
          boxShadow: "0 24px 64px rgba(0,0,0,0.75)",
          outline: "none",
        }}
      >
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "14px",
          }}
        >
          <div>
            {/* Title */}
            <DialogTitle
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1.25,
                marginBottom: "8px",
                fontFamily: "inherit",
                letterSpacing: "-0.01em",
              }}
            >
              Import Template
            </DialogTitle>

            {/* Subtitle with ⌘Z badge */}
            <DialogDescription
              style={{
                fontSize: "13px",
                color: "#8a8a9c",
                lineHeight: 1.5,
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "4px",
              }}
            >
              Choose a starter template to pre-populate your canvas. Any
              existing nodes will be replaced — use{" "}
              <kbd
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "1px 5px",
                  height: "18px",
                  borderRadius: "4px",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.13)",
                  fontSize: "11px",
                  fontFamily: "ui-monospace, SFMono-Regular, monospace",
                  color: "#c8c8dc",
                  lineHeight: 1,
                }}
              >
                ⌘Z
              </kbd>{" "}
              to undo.
            </DialogDescription>
          </div>

          {/* × Close button */}
          <DialogClose asChild>
            <button
              type="button"
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
                color: "#707082",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
                marginLeft: 16,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.10)";
                e.currentTarget.style.color = "#b0b0c4";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.color = "#707082";
              }}
            >
              <X size={12} strokeWidth={2} />
              <span className="sr-only">Close</span>
            </button>
          </DialogClose>
        </div>

        {/* ── 3-Column Template Grid ───────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "12px",
          }}
        >
          {CANVAS_TEMPLATES.map((template) => (
            <div
              key={template.id}
              style={{
                background: "#111220",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "12px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Diagram preview box */}
              <div
                style={{
                  background: "#08090f",
                  height: 152,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "14px",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                {DIAGRAM_MAP[template.id] ?? null}
              </div>

              {/* Text + action */}
              <div
                style={{
                  padding: "14px",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  gap: 10,
                }}
              >
                {/* Template name */}
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#f0f0f8",
                    margin: 0,
                    marginBottom: 4,
                    lineHeight: 1.3,
                  }}
                >
                  {template.name}
                </p>

                {/* Description */}
                <p
                  style={{
                    fontSize: "12px",
                    color: "#70708a",
                    lineHeight: 1.6,
                    margin: 0,
                    flexGrow: 1,
                    minHeight: "58px",
                  }}
                >
                  {template.description}
                </p>

                {/* Import button */}
                <button
                  type="button"
                  onClick={() => {
                    onImport(template);
                    onClose();
                  }}
                  style={{
                    width: "100%",
                    height: 36,
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.10)",
                    borderRadius: "8px",
                    color: "#dcdcec",
                    fontSize: "13px",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    cursor: "pointer",
                    transition: "background 0.12s ease",
                    marginTop: "auto",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "rgba(255,255,255,0.07)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <DownloadSvgIcon />
                  Import
                </button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
