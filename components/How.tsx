"use client";

import { useRef, useState } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

const STEPS = [
  {
    title: "Pick a template",
    desc: "Choose from 40+ ATS-friendly designs built for your industry.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="4" y="3" width="14" height="16" rx="2" stroke="#a78bfa" strokeWidth="1.3" />
        <path d="M7 7h8M7 10h8M7 13h5" stroke="#a78bfa" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Add your details",
    desc: "Fill in your experience — our AI suggests bullet points as you type.",
    active: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="7" stroke="#a78bfa" strokeWidth="1.3" />
        <path d="M8 11l2 2 4-4" stroke="#a78bfa" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Tailor to the job",
    desc: "Paste the job listing — we match keywords and score your ATS fit.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 4v3M11 15v3M4 11h3M15 11h3" stroke="#a78bfa" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="11" cy="11" r="3.5" stroke="#a78bfa" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    title: "Export & apply",
    desc: "Download as PDF, DOCX, or share a live link directly to recruiters.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M7 11l4 4 4-4M11 4v11" stroke="#a78bfa" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 17h14" stroke="#a78bfa" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
];

const ATS_BARS = [
  { label: "Keywords",    score: 91, color: "#a78bfa" },
  { label: "Formatting",  score: 88, color: "#a78bfa" },
  { label: "Readability", score: 95, color: "#a78bfa" },
  { label: "Experience",  score: 78, color: "#a78bfa" },
  { label: "Skills match",score: 84, color: "#a78bfa" },
];

const EXPORTS = [
  {
    label: "PDF download",
    sub: "Print-ready, pixel-perfect",
    active: true,
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="2" y="1.5" width="10" height="11" rx="1.5" stroke="#a78bfa" strokeWidth="1.2" />
        <path d="M4 5h6M4 7.5h6M4 10h4" stroke="#a78bfa" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "DOCX file",
    sub: "Editable in Word",
    active: false,
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="2" y="1.5" width="10" height="11" rx="1.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
        <path d="M4.5 5.5L6.5 7.5L4.5 9.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 5.5h2.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Live link",
    sub: "Share with one click",
    active: false,
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
        <path d="M7 4v3l2 1.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

// Animated counter that triggers when inView
function AnimatedScore({ target, inView }: { target: number; inView: boolean }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, target, { duration: 1.2, delay: 0.3, ease: "easeOut" });
    return controls.stop;
  }, [inView, target, count]);
  return <motion.span>{rounded}</motion.span>;
}

// Animated bar that fills on inView
function AnimatedBar({ score, inView, delay }: { score: number; inView: boolean; delay: number }) {
  return (
    <div className="h-[3px] flex-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: "#7c3aed" }}
        initial={{ width: "0%" }}
        animate={inView ? { width: `${score}%` } : { width: "0%" }}
        transition={{ duration: 0.9, delay, ease: "easeOut" }}
      />
    </div>
  );
}

function PreviewCard({ title, children, delay }: { title: string; children: React.ReactNode; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2, ease: "easeOut" } }}
      className="overflow-hidden rounded-[10px]"
      style={{
        background: "#111113",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 0 0 0 transparent",
        transition: "box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(124,58,237,0.12)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 0 transparent";
      }}
    >
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#7c3aed" }} />
        <span className="text-[11px] font-semibold uppercase tracking-[0.03em]" style={{ color: "rgba(255,255,255,0.5)" }}>
          {title}
        </span>
      </div>
      <div className="p-4">{children}</div>
    </motion.div>
  );
}

// Wrapper so ATS bars card can access its own inView
function ATSCard({ delay }: { delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2, ease: "easeOut" } }}
      className="overflow-hidden rounded-[10px]"
      style={{ background: "#111113", border: "1px solid rgba(255,255,255,0.07)" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(124,58,237,0.12)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#7c3aed" }} />
        <span className="text-[11px] font-semibold uppercase tracking-[0.03em]" style={{ color: "rgba(255,255,255,0.5)" }}>
          ATS score breakdown
        </span>
      </div>
      <div className="p-4">
        <div className="flex flex-col gap-1.5">
          {ATS_BARS.map((item, i) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="w-20 flex-shrink-0 text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                {item.label}
              </span>
              <AnimatedBar score={item.score} inView={inView} delay={0.2 + i * 0.07} />
              <span className="w-7 text-right text-[10px] font-semibold" style={{ color: "rgba(255,255,255,0.6)" }}>
                {item.score}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-baseline gap-1.5 border-t pt-2.5" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <span className="text-[20px] font-bold text-white">
            <AnimatedScore target={87} inView={inView} />
          </span>
          <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>/ 100 overall</span>
          <span className="ml-auto text-[10px] font-semibold" style={{ color: "#34d399" }}>↑ Good</span>
        </div>
      </div>
    </motion.div>
  );
}

function ChevronRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="rgba(255,255,255,0.2)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function How() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [hoveredExport, setHoveredExport] = useState<string | null>(null);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: "#09090b", fontFamily: "'Instrument Sans', 'Helvetica Neue', sans-serif" }}
      id="how"
    >
      {/* Subtle radial glow at section center */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
        style={{
          width: "700px",
          height: "400px",
          background: "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.07) 0%, transparent 65%)",
        }}
      />

      {/* ── Section header ── */}
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-24 md:px-10 md:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="h-px w-6" style={{ background: "#7c3aed", opacity: 0.5 }} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.07em]" style={{ color: "#a78bfa" }}>
              How it works
            </span>
            <span className="h-px w-6" style={{ background: "#7c3aed", opacity: 0.5 }} />
          </div>
          <h2
            className="mb-3.5 text-[32px] font-medium leading-[1.15] tracking-[-0.02em] text-white md:text-[38px]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            From blank page to{" "}
            <em className="not-italic" style={{ color: "#a78bfa" }}>interview invite</em>
            {" "}in minutes.
          </h2>
          <p className="mx-auto max-w-[360px] text-[14px] leading-[1.65]" style={{ color: "rgba(255,255,255,0.38)" }}>
            Four simple steps — no design skills needed, no templates that look like everyone else's.
          </p>
        </motion.div>

        {/* ── Steps ── */}
        <div className="relative">
          {/* Connector line — draws in from left to right on scroll */}
          {/* top: 48px = step number height (~20px) + half icon height (56/2=28px) */}
          <div
            className="pointer-events-none absolute hidden md:block"
            style={{ top: 48, left: "calc(12.5% + 28px)", right: "calc(12.5% + 28px)", height: 1 }}
          >
            {/* Static dashed base */}
            <div
              className="absolute inset-0"
              style={{ borderTop: "1px dashed rgba(124,58,237,0.12)" }}
            />
            {/* Animated fill overlay */}
            <motion.div
              className="absolute inset-y-0 left-0"
              style={{ borderTop: "1px dashed rgba(124,58,237,0.45)" }}
              initial={{ width: "0%" }}
              animate={inView ? { width: "100%" } : { width: "0%" }}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeInOut" }}
            />
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-0">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                custom={i}
                variants={FADE_UP}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                className="flex flex-col items-center px-4 text-center"
              >
                {/* Step number */}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
                  className="mb-2 text-[10px] font-bold tracking-[0.1em]"
                  style={{ color: "rgba(124,58,237,0.5)", fontVariantNumeric: "tabular-nums" }}
                >
                  0{i + 1}
                </motion.span>

                {/* Icon box — active step gets a pulse ring */}
                <div className="relative z-10 mb-5">
                  {step.active && (
                    <motion.div
                      className="absolute inset-0 rounded-[14px]"
                      style={{ border: "1px solid rgba(124,58,237,0.4)" }}
                      animate={{ scale: [1, 1.18, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-[14px]"
                    style={{
                      background: step.active ? "rgba(124,58,237,0.12)" : "#111113",
                      border: step.active
                        ? "1px solid rgba(124,58,237,0.3)"
                        : "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    {step.icon}
                  </div>
                </div>

                <p className="mb-1.5 text-[13px] font-semibold leading-snug tracking-[-0.01em] text-white">
                  {step.title}
                </p>
                <p className="text-[12px] leading-[1.6]" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Preview cards 2×2 ── */}
        <div className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-2">

          {/* Template picker */}
          <PreviewCard title="Template picker" delay={0.1}>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Modern",    selected: true,  accentHeader: false },
                { label: "Classic",   selected: false, accentHeader: false },
                { label: "Executive", selected: false, accentHeader: true },
              ].map((t) => (
                <div
                  key={t.label}
                  className="relative overflow-hidden rounded-md"
                  style={{
                    aspectRatio: "3/4",
                    background: "#1a1a1f",
                    border: t.selected
                      ? "1px solid rgba(124,58,237,0.5)"
                      : "1px solid rgba(255,255,255,0.07)",
                    transition: "border-color 0.15s ease",
                  }}
                >
                  {t.accentHeader && (
                    <div className="h-6" style={{ background: "rgba(124,58,237,0.08)" }} />
                  )}
                  <div className="flex flex-col gap-[3px] p-2">
                    {[100, 75, 55, 100, 80, 65, 100].map((w, i) => (
                      <div
                        key={i}
                        className="h-[2px] rounded-sm"
                        style={{
                          width: `${w}%`,
                          background:
                            i === 0 && t.selected
                              ? "rgba(124,58,237,0.4)"
                              : "rgba(255,255,255,0.1)",
                        }}
                      />
                    ))}
                  </div>
                  {t.selected && (
                    <div
                      className="absolute right-[5px] top-[5px] flex h-3.5 w-3.5 items-center justify-center rounded-full"
                      style={{ background: "#7c3aed" }}
                    >
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4l2 2 3-3" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                  <p
                    className="absolute bottom-[5px] left-0 right-0 text-center text-[9px] font-semibold uppercase tracking-[0.04em]"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    {t.label}
                  </p>
                </div>
              ))}
            </div>
          </PreviewCard>

          {/* AI suggestions */}
          <PreviewCard title="AI suggestions" delay={0.15}>
            <div
              className="mb-2 rounded-lg p-2.5"
              style={{ background: "#1a1a1f", border: "1px solid rgba(124,58,237,0.3)" }}
            >
              <div className="mb-1.5 flex items-center gap-1">
                <span className="h-1 w-1 rounded-full" style={{ background: "#7c3aed" }} />
                <span className="text-[9px] font-bold uppercase tracking-[0.06em]" style={{ color: "#a78bfa" }}>
                  AI suggestion
                </span>
              </div>
              <p className="text-[11px] leading-[1.55]" style={{ color: "rgba(255,255,255,0.45)" }}>
                Led redesign of{" "}
                <span style={{ color: "#c4b5fd", fontWeight: 500 }}>core checkout flow</span>,
                reducing drop-off by{" "}
                <span style={{ color: "#c4b5fd", fontWeight: 500 }}>23%</span> and increasing
                revenue $1.2M annually.
              </p>
            </div>
            <div
              className="mb-2.5 rounded-lg p-2.5"
              style={{ background: "#1a1a1f", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <p className="text-[11px] leading-[1.55]" style={{ color: "rgba(255,255,255,0.4)" }}>
                Collaborated with engineering on{" "}
                <span style={{ color: "rgba(255,255,255,0.6)" }}>API integration</span> for
                payment processing across 12 markets.
              </p>
            </div>
            <div className="flex gap-1.5">
              {["Use this", "Try again"].map((label, i) => (
                <button
                  key={label}
                  className="flex-1 rounded-[5px] py-1.5 text-[10px] font-semibold transition-all duration-150"
                  style={
                    i === 0
                      ? { background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", color: "#a78bfa" }
                      : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.3)" }
                  }
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = "0.75";
                    (e.currentTarget as HTMLElement).style.transform = "scale(0.98)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = "1";
                    (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </PreviewCard>

          {/* ATS score breakdown — has its own inView for animated bars + counter */}
          <ATSCard delay={0.2} />

          {/* Export options */}
          <PreviewCard title="Export options" delay={0.25}>
            <div className="flex flex-col gap-1.5">
              {EXPORTS.map((exp) => (
                <div
                  key={exp.label}
                  className="flex cursor-default items-center gap-2.5 rounded-[7px] px-3 py-2 transition-all duration-150"
                  style={{
                    background: hoveredExport === exp.label ? "rgba(124,58,237,0.07)" : "#1a1a1f",
                    border: hoveredExport === exp.label
                      ? "1px solid rgba(124,58,237,0.22)"
                      : "1px solid rgba(255,255,255,0.06)",
                  }}
                  onMouseEnter={() => setHoveredExport(exp.label)}
                  onMouseLeave={() => setHoveredExport(null)}
                >
                  <div
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[6px]"
                    style={
                      exp.active || hoveredExport === exp.label
                        ? { background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.2)" }
                        : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }
                    }
                  >
                    {exp.icon}
                  </div>
                  <div>
                    <p
                      className="text-[11px] font-semibold"
                      style={{
                        color: exp.active || hoveredExport === exp.label
                          ? "rgba(255,255,255,0.85)"
                          : "rgba(255,255,255,0.5)",
                      }}
                    >
                      {exp.label}
                    </p>
                    <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.28)" }}>
                      {exp.sub}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <ChevronRight />
                  </div>
                </div>
              ))}
            </div>
          </PreviewCard>
        </div>

        {/* ── Bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 flex flex-wrap items-center justify-center gap-4"
        >
          <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.25)" }}>
            Free forever — no credit card needed
          </span>
          <div className="h-4 w-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          <a
            href="/register"
            className="inline-flex items-center gap-2 rounded-[7px] px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-150"
            style={{ background: "#7c3aed", letterSpacing: "0.01em", textDecoration: "none" }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "#6d28d9";
              el.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "#7c3aed";
              el.style.transform = "translateY(0)";
            }}
          >
            Start building now
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <div className="h-4 w-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.25)" }}>
            Takes less than 5 minutes
          </span>
        </motion.div>
      </div>
    </section>
  );
}
