"use client";

import Link from "next/link";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import Particles from "./ui/Particles";

const FADE_UP = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

const AVATARS = [
  { initials: "AK", bg: "#3b1f6e", color: "#c4b5fd" },
  { initials: "JM", bg: "#1f3b6e", color: "#93c5fd" },
  { initials: "SR", bg: "#1f6e3b", color: "#6ee7b7" },
  { initials: "DL", bg: "#6e3b1f", color: "#fca5a5" },
];

const LOGOS = ["Google", "Stripe", "Notion", "Linear", "Figma", "Vercel"];

// Animated counter hook
function useAnimatedCounter(target: number, duration = 1.4, delay = 0.6) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  useEffect(() => {
    const timeout = setTimeout(() => {
      const controls = animate(count, target, { duration, ease: "easeOut" });
      return controls.stop;
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [target, duration, delay, count]);
  return rounded;
}

export default function Hero() {
  const atsScore = useAnimatedCounter(88, 1.4, 0.8);
  const atsDelta = useAnimatedCounter(23, 1.0, 1.0);

  return (
    <section
      className="relative overflow-hidden min-h-screen"
      style={{ background: "#09090b", fontFamily: "'Instrument Sans', 'Helvetica Neue', sans-serif" }}
    >
      {/* Particles */}
      <div className="absolute inset-0">
        <Particles
          particleColors={["#a855f7"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover
          alphaParticles={false}
          disableRotation={false}
          pixelRatio={1}
          className="absolute inset-0"
        />
      </div>

      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(124,58,237,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial glow behind resume card — adds depth and focal point */}
      <div
        className="pointer-events-none absolute right-0 top-0 hidden md:block"
        style={{
          width: "600px",
          height: "600px",
          background: "radial-gradient(ellipse at 70% 30%, rgba(124,58,237,0.12) 0%, transparent 65%)",
          transform: "translate(10%, -10%)",
        }}
      />

      {/* ── Main hero grid ── */}
      <div className="relative z-10 grid max-w-screen grid-cols-1 items-center gap-12 px-6 pb-16 pt-28 md:grid-cols-2 md:gap-10 md:px-10 md:pb-20 md:pt-32">

        {/* Left — copy */}
        <div>
          {/* Badge */}
          <motion.div custom={0} variants={FADE_UP} initial="hidden" animate="show">
            <span
              className="mb-5 inline-flex items-center gap-1.5 rounded-[5px] px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em]"
              style={{
                color: "#a78bfa",
                background: "rgba(124,58,237,0.08)",
                border: "1px solid rgba(124,58,237,0.25)",
              }}
            >
              <span className="h-[5px] w-[5px] rounded-full" style={{ background: "#7c3aed" }} />
              AI-powered resume builder
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            custom={1}
            variants={FADE_UP}
            initial="hidden"
            animate="show"
            className="mb-5 text-[42px] font-medium leading-[1.1] tracking-[-0.02em] text-white md:text-[52px]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Your resume,{" "}
            <em className="not-italic" style={{ color: "#a78bfa" }}>crafted</em>
            {" "}to land<br className="hidden md:block" /> the interview.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            custom={2}
            variants={FADE_UP}
            initial="hidden"
            animate="show"
            className="mb-8 max-w-[400px] text-[15px] leading-[1.65]"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Build a polished, ATS-ready resume in minutes. Choose from expert templates,
            get real-time feedback, and tailor it to every job — all in one place.
          </motion.p>

          {/* CTAs — added scale micro-interaction */}
          <motion.div
            custom={3}
            variants={FADE_UP}
            initial="hidden"
            animate="show"
            className="mb-10 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-[7px] px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-150 active:scale-[0.97]"
              style={{ background: "#7c3aed", letterSpacing: "0.01em" }}
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
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.5 1v11M1 6.5h11" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              Build my resume — free
            </Link>

            <Link
              href="/examples"
              className="inline-flex items-center gap-2 rounded-[7px] px-5 py-2.5 text-[13px] font-medium transition-all duration-150"
              style={{
                color: "rgba(255,255,255,0.5)",
                background: "none",
                border: "1px solid rgba(255,255,255,0.1)",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = "#fff";
                el.style.borderColor = "rgba(255,255,255,0.22)";
                el.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = "rgba(255,255,255,0.5)";
                el.style.borderColor = "rgba(255,255,255,0.1)";
                el.style.transform = "translateY(0)";
              }}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 6.5h9M7.5 3l3.5 3.5L7.5 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              See examples
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            custom={4}
            variants={FADE_UP}
            initial="hidden"
            animate="show"
            className="flex items-center gap-3"
          >
            <div className="flex">
              {AVATARS.map((av, i) => (
                <div
                  key={i}
                  className="flex h-[26px] w-[26px] items-center justify-center rounded-full text-[10px] font-semibold flex-shrink-0"
                  style={{
                    background: av.bg,
                    color: av.color,
                    border: "1.5px solid #09090b",
                    marginRight: i < AVATARS.length - 1 ? "-7px" : 0,
                    zIndex: AVATARS.length - i,
                    position: "relative",
                  }}
                >
                  {av.initials}
                </div>
              ))}
            </div>

            <div className="ml-2 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="10" height="10" viewBox="0 0 10 10" fill="#f59e0b">
                  <path d="M5 1l1.12 2.27 2.5.36-1.81 1.77.43 2.5L5 6.77l-2.24 1.13.43-2.5L1.38 3.63l2.5-.36z" />
                </svg>
              ))}
            </div>

            <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.35)" }}>
              <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>4.9</span>
              {" "}from 12,000+ users
            </span>
          </motion.div>
        </div>

        {/* Right — resume mockup */}
        <motion.div
          custom={2}
          variants={FADE_UP}
          initial="hidden"
          animate="show"
          className="relative flex justify-end"
        >
          {/* ATS score chip — now with animated counter */}
          <motion.div
            initial={{ opacity: 0, x: 12, y: -8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-[-24px] top-[16px] z-10 rounded-[8px] px-3.5 py-2.5"
            style={{
              background: "#141416",
              border: "1px solid rgba(255,255,255,0.1)",
              minWidth: "130px",
              boxShadow: "0 0 0 1px rgba(124,58,237,0.1), 0 8px 24px rgba(0,0,0,0.4)",
            }}
          >
            <p className="mb-0.5 text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>ATS score</p>
            <p className="text-[22px] font-semibold leading-none tracking-tight text-white">
              <motion.span>{atsScore}</motion.span>
              <span className="text-[13px] font-normal" style={{ color: "rgba(255,255,255,0.3)" }}>/100</span>
            </p>
            <p className="mt-0.5 text-[10px] font-medium" style={{ color: "#34d399" }}>
              ↑ <motion.span>{atsDelta}</motion.span> pts from last version
            </p>
            <div className="mt-1.5 h-[3px] w-full rounded-full" style={{ background: "rgba(255,255,255,0.07)" }}>
              {/* Animated bar fill */}
              <motion.div
                className="h-full rounded-full"
                style={{ background: "#7c3aed" }}
                initial={{ width: "0%" }}
                animate={{ width: "88%" }}
                transition={{ delay: 0.9, duration: 1.2, ease: "easeOut" }}
              />
            </div>
          </motion.div>

          {/* Resume card — slight tilt-in entrance */}
          <motion.div
            initial={{ opacity: 0, rotateZ: 2, y: 16 }}
            animate={{ opacity: 1, rotateZ: 0, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[300px] overflow-hidden rounded-[10px]"
            style={{
              background: "#141416",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.06)",
              transformOrigin: "bottom center",
            }}
          >
            {/* Header */}
            <div
              className="px-[18px] pb-3.5 pt-4"
              style={{ background: "#1a1a1f", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p className="text-[14px] font-semibold tracking-[-0.01em] text-white" style={{ marginBottom: 2 }}>Alexandra Kim</p>
              <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.38)" }}>Senior Product Designer · San Francisco, CA</p>
              <div className="mt-2 flex gap-2">
                {["alex@kim.io", "linkedin", "portfolio"].map((t) => (
                  <span
                    key={t}
                    className="rounded-[4px] px-[7px] py-[2px] text-[10px] font-medium"
                    style={{ color: "rgba(255,255,255,0.38)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="px-[18px] py-3.5">
              {/* Experience */}
              <div className="mb-3.5">
                <div className="mb-2 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.1em]" style={{ color: "#7c3aed" }}>
                  Experience
                  <div className="h-px flex-1" style={{ background: "rgba(124,58,237,0.2)" }} />
                </div>
                {[
                  { title: "Lead Product Designer — Stripe", meta: "Jan 2022 – Present", bars: [92, 76, 84] },
                  { title: "Product Designer — Notion", meta: "Mar 2019 – Dec 2021", bars: [80, 65] },
                ].map((exp, expIdx) => (
                  <div key={exp.title} className="mb-2">
                    <p className="text-[11px] font-semibold" style={{ color: "rgba(255,255,255,0.8)" }}>{exp.title}</p>
                    <p className="mb-1 text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{exp.meta}</p>
                    <div className="flex flex-col gap-[3px]">
                      {exp.bars.map((w, i) => (
                        <div key={i} className="h-[3px] w-full rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: "#7c3aed", opacity: 1 - i * 0.22 }}
                            initial={{ width: "0%" }}
                            animate={{ width: `${w}%` }}
                            transition={{ delay: 0.5 + expIdx * 0.15 + i * 0.08, duration: 0.9, ease: "easeOut" }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div>
                <div className="mb-2 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.1em]" style={{ color: "#7c3aed" }}>
                  Skills
                  <div className="h-px flex-1" style={{ background: "rgba(124,58,237,0.2)" }} />
                </div>
                <div className="flex flex-wrap gap-1">
                  {["Figma", "Design systems", "User research", "Prototyping", "Motion", "SQL"].map((s, i) => (
                    <motion.span
                      key={s}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.05, duration: 0.3, ease: "easeOut" }}
                      className="rounded-[4px] px-2 py-[2px] text-[10px] font-medium"
                      style={{ color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Keyword match chip — slides in from bottom-left */}
          <motion.div
            initial={{ opacity: 0, x: -12, y: 8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-[20px] left-[-32px] z-10 flex items-center gap-2 rounded-[8px] px-3.5 py-2.5"
            style={{
              background: "#141416",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 0 0 1px rgba(124,58,237,0.08), 0 8px 24px rgba(0,0,0,0.4)",
            }}
          >
            <div
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[6px]"
              style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.2)" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5C4 1.5 1.5 4 1.5 7S4 12.5 7 12.5 12.5 10 12.5 7 10 1.5 7 1.5z" stroke="#a78bfa" strokeWidth="1.2" />
                <path d="M5 7l1.5 1.5L9.5 5" stroke="#a78bfa" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-[12px] font-semibold" style={{ color: "rgba(255,255,255,0.8)" }}>Tailored to job listing</p>
              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>Keywords matched automatically</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Logo strip — marquee animation ── */}
      <div
        className="relative z-10 overflow-hidden px-0 py-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        {/* Fade edges */}
        <div
          className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16"
          style={{ background: "linear-gradient(to right, #09090b, transparent)" }}
        />
        <div
          className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16"
          style={{ background: "linear-gradient(to left, #09090b, transparent)" }}
        />

        <div
          className="flex items-center gap-7"
          style={{
            animation: "marquee 22s linear infinite",
            width: "max-content",
          }}
        >
          {/* Duplicate logos for seamless loop */}
          {[...LOGOS, ...LOGOS].map((name, i) => (
            <span
              key={i}
              className="shrink-0 text-[12px] font-semibold tracking-[-0.01em]"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              {name}
            </span>
          ))}
        </div>

        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>
      </div>
    </section>
  );
}
