"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.1 + i * 0.1,
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

type BillingCycle = "monthly" | "annual";

interface Plan {
  id: string;
  name: string;
  prices: Record<BillingCycle, string>;
  originalMonthly?: string;
  desc: Record<BillingCycle, string>;
  cta: string;
  ctaStyle: "ghost" | "primary" | "outline";
  featured?: boolean;
  badge?: string;
  features: { text: React.ReactNode; included: boolean }[];
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    prices: { monthly: "$0", annual: "$0" },
    desc: { monthly: "Everything you need to get started.", annual: "Everything you need to get started." },
    cta: "Get started free",
    ctaStyle: "ghost",
    features: [
      { text: <><strong className="text-white/75 font-medium">3 resumes</strong></>, included: true },
      { text: <><strong className="text-white/75 font-medium">8 templates</strong></>, included: true },
      { text: <>PDF export</>, included: true },
      { text: <>Basic ATS score</>, included: true },
      { text: <>AI bullet suggestions</>, included: false },
      { text: <>Job-match tailoring</>, included: false },
      { text: <>Live shareable link</>, included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    prices: { monthly: "$14", annual: "$9" },
    originalMonthly: "$22",
    desc: {
      monthly: "Billed monthly. Cancel any time.",
      annual: "Billed annually — you save 35%.",
    },
    cta: "Start 7-day free trial",
    ctaStyle: "primary",
    featured: true,
    badge: "Most popular",
    features: [
      { text: <><strong className="text-white/80 font-medium">Unlimited resumes</strong></>, included: true },
      { text: <><strong className="text-white/80 font-medium">All 40+ templates</strong></>, included: true },
      { text: <>PDF + DOCX export</>, included: true },
      { text: <><strong className="text-white/80 font-medium">AI bullet suggestions</strong> — unlimited</>, included: true },
      { text: <><strong className="text-white/80 font-medium">Job-match tailoring</strong> + keyword scan</>, included: true },
      { text: <>Full ATS score breakdown</>, included: true },
      { text: <>Live shareable link</>, included: true },
    ],
  },
  {
    id: "teams",
    name: "Teams",
    prices: { monthly: "$9", annual: "$6" },
    originalMonthly: "$14",
    desc: {
      monthly: "Per seat / mo. Min. 3 seats.",
      annual: "Per seat / mo, billed annually.",
    },
    cta: "Contact sales",
    ctaStyle: "outline",
    features: [
      { text: <>Everything in <strong className="text-white/75 font-medium">Pro</strong></>, included: true },
      { text: <>Team admin dashboard</>, included: true },
      { text: <>Shared brand templates</>, included: true },
      { text: <>Bulk DOCX export</>, included: true },
      { text: <>Priority support + SLA</>, included: true },
      { text: <>SSO + audit logs</>, included: true },
      { text: <>Custom onboarding</>, included: true },
    ],
  },
];

const FAQ_ITEMS = [
  {
    q: "Does the free plan ever expire?",
    a: "No — it's free forever with no time limit. Upgrade only when you need unlimited resumes or AI features.",
  },
  {
    q: 'What counts as a "resume" on the free plan?',
    a: "Each saved document in your account counts as one resume. You can edit and re-export a resume as many times as you like — only the number of saved documents is capped.",
  },
  {
    q: "Can I switch plans mid-cycle?",
    a: "Yes. Upgrades take effect immediately and are prorated. Downgrades take effect at the end of your billing period.",
  },
  {
    q: "Do exports include branding?",
    a: "Free plan exports include a small footer watermark. Pro and Teams exports are completely clean — no branding of any kind.",
  },
];


function CheckIcon({ included, featured }: { included: boolean; featured?: boolean }) {
  if (included) {
    return (
      <svg className="w-3.5 h-3.5 flex-shrink-0 mt-[1px]" viewBox="0 0 14 14" fill="none">
        <circle
          cx="7" cy="7" r="6"
          stroke={featured ? "rgba(124,58,237,0.35)" : "rgba(255,255,255,0.15)"}
          strokeWidth="1"
        />
        <path
          d="M4.5 7l2 2 3-3"
          stroke={featured ? "#a78bfa" : "rgba(255,255,255,0.4)"}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg className="w-3.5 h-3.5 flex-shrink-0 mt-[1px]" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <path d="M4 7h6" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function FaqItem({ q, a, delay }: { q: string; a: string; delay: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className="border-b"
      style={{ borderColor: "rgba(255,255,255,0.06)" }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left group"
      >
        <span
          className="text-[13px] transition-colors duration-150"
          style={{ color: open ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.45)" }}
        >
          {q}
        </span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="flex-shrink-0"
          width="12" height="12" viewBox="0 0 12 12" fill="none"
        >
          <path
            d="M2 4l4 4 4-4"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p
              className="pb-4 text-[12px] leading-relaxed"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Pricing() {
  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const isAnnual = billing === "annual";

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "#09090b",
        fontFamily: "'Instrument Sans', 'Helvetica Neue', sans-serif",
      }}
      id="pricing"
    >
      <div className="mx-auto max-w-6xl px-6 pt-24 pb-24 md:px-10 md:pt-28">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center"
        >
          {/* Label */}
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="h-px w-6" style={{ background: "#7c3aed", opacity: 0.5 }} />
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.07em]"
              style={{ color: "#a78bfa" }}
            >
              Pricing
            </span>
            <span className="h-px w-6" style={{ background: "#7c3aed", opacity: 0.5 }} />
          </div>

          <h2
            className="mb-3.5 text-[32px] font-medium leading-[1.15] tracking-[-0.02em] text-white md:text-[38px]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            One resume. One price.{" "}
            <em className="not-italic" style={{ color: "#a78bfa" }}>
              Unlimited interviews.
            </em>
          </h2>
          <p
            className="mx-auto max-w-[340px] text-[14px] leading-[1.65]"
            style={{ color: "rgba(255,255,255,0.38)" }}
          >
            Start free — upgrade when you're ready. No contracts, cancel any time.
          </p>
        </motion.div>

        {/* ── Billing toggle ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 flex items-center justify-center gap-3"
        >
          <span
            className="text-[12px] transition-colors duration-200"
            style={{ color: isAnnual ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.7)" }}
          >
            Monthly
          </span>

          <button
            onClick={() => setBilling(isAnnual ? "monthly" : "annual")}
            className="relative h-[22px] w-10 rounded-full transition-colors duration-200 focus:outline-none"
            style={{
              background: isAnnual ? "rgba(124,58,237,0.25)" : "#1e1e23",
              border: isAnnual
                ? "1px solid rgba(124,58,237,0.4)"
                : "1px solid rgba(255,255,255,0.1)",
            }}
            aria-label="Toggle billing cycle"
          >
            <motion.span
              layout
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
              className="absolute top-[3px] h-3.5 w-3.5 rounded-full"
              style={{
                left: isAnnual ? "calc(100% - 17px)" : "3px",
                background: isAnnual ? "#a78bfa" : "rgba(255,255,255,0.35)",
              }}
            />
          </button>

          <span
            className="text-[12px] transition-colors duration-200"
            style={{ color: isAnnual ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)" }}
          >
            Annual
          </span>

          <motion.span
            animate={{ opacity: isAnnual ? 1 : 0.3, scale: isAnnual ? 1 : 0.95 }}
            transition={{ duration: 0.2 }}
            className="text-[10px] font-semibold px-2 py-0.5 rounded"
            style={{
              background: "rgba(124,58,237,0.12)",
              border: "1px solid rgba(124,58,237,0.2)",
              color: "#a78bfa",
              letterSpacing: "0.03em",
            }}
          >
            Save 35%
          </motion.span>
        </motion.div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              custom={i}
              variants={CARD_VARIANTS}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              whileHover={
                plan.featured
                  ? { borderColor: "rgba(124,58,237,0.6)", scale: 1.01 }
                  : { borderColor: "rgba(255,255,255,0.12)", scale: 1.005 }
              }
              transition={{ duration: 0.2 }}
              className="relative flex flex-col rounded-[12px] p-7"
              style={{
                background: plan.featured ? "#0f0f12" : "#111113",
                border: plan.featured
                  ? "1px solid rgba(124,58,237,0.4)"
                  : "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {plan.badge && (
                <div className="absolute -top-[11px] left-1/2 -translate-x-1/2">
                  <span
                    className="whitespace-nowrap rounded px-3 py-[3px] text-[10px] font-semibold uppercase tracking-[0.06em] text-white"
                    style={{ background: "#7c3aed" }}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              <p
                className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.07em]"
                style={{ color: plan.featured ? "#a78bfa" : "rgba(255,255,255,0.35)" }}
              >
                {plan.name}
              </p>

              <div className="mb-1 flex items-baseline gap-1">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`${plan.id}-${billing}`}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="text-[36px] font-medium leading-none text-white"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {plan.prices[billing]}
                  </motion.span>
                </AnimatePresence>
                <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {plan.id === "teams" ? "/seat/mo" : "/mo"}
                </span>
                {isAnnual && plan.originalMonthly && (
                  <motion.span
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[11px] line-through"
                    style={{ color: "rgba(255,255,255,0.2)" }}
                  >
                    {plan.originalMonthly}
                  </motion.span>
                )}
              </div>

              <p className="mb-5 text-[11px] leading-[1.55]" style={{ color: "rgba(255,255,255,0.3)" }}>
                {plan.desc[billing]}
              </p>

              {plan.ctaStyle === "primary" && (
                <motion.a
                  href="/register"
                  whileHover={{ background: "#6d28d9" }}
                  whileTap={{ scale: 0.98 }}
                  className="mb-5 flex items-center justify-center gap-2 rounded-[7px] py-2.5 text-[13px] font-semibold text-white"
                  style={{ background: "#7c3aed", textDecoration: "none" }}
                >
                  {plan.cta}
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.a>
              )}
              {plan.ctaStyle === "ghost" && (
                <motion.a
                  href="/register"
                  whileTap={{ scale: 0.98 }}
                  className="mb-5 flex items-center justify-center rounded-[7px] py-2.5 text-[13px] font-semibold transition-colors duration-150"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.45)",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)";
                  }}
                >
                  {plan.cta}
                </motion.a>
              )}
              {plan.ctaStyle === "outline" && (
                <motion.a
                  href="/contact"
                  whileTap={{ scale: 0.98 }}
                  className="mb-5 flex items-center justify-center rounded-[7px] py-2.5 text-[13px] font-semibold transition-colors duration-150"
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(124,58,237,0.3)",
                    color: "#a78bfa",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.07)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  {plan.cta}
                </motion.a>
              )}

              <div className="mb-4 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />

              <div className="flex flex-col gap-2.5">
                {plan.features.map((feat, fi) => (
                  <div key={fi} className="flex items-start gap-2.5">
                    <CheckIcon included={feat.included} featured={plan.featured} />
                    <span
                      className="text-[12px] leading-[1.55]"
                      style={{
                        color: feat.included
                          ? "rgba(255,255,255,0.5)"
                          : "rgba(255,255,255,0.2)",
                      }}
                    >
                      {feat.text}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          custom={3}
          variants={FADE_UP}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          {["7-day free trial", "No credit card required", "Cancel any time"].map((item, i) => (
            <span key={item} className="flex items-center gap-3">
              <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.22)" }}>
                {item}
              </span>
              {i < 2 && (
                <span
                  className="h-[3px] w-[3px] rounded-full"
                  style={{ background: "rgba(255,255,255,0.12)" }}
                />
              )}
            </span>
          ))}
        </motion.div>

        <div className="mx-auto mt-16 max-w-[560px]">
          <motion.p
            custom={4}
            variants={FADE_UP}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="mb-5 text-center text-[11px] font-semibold uppercase tracking-[0.07em]"
            style={{ color: "rgba(255,255,255,0.22)" }}
          >
            Common questions
          </motion.p>

          {FAQ_ITEMS.map((item, i) => (
            <FaqItem
              key={item.q}
              q={item.q}
              a={item.a}
              delay={0.05 * i}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 flex flex-wrap items-center justify-center gap-4"
        >
          <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.22)" }}>
            Free forever — no credit card needed
          </span>
          <div className="h-4 w-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          <motion.a
            href="/register"
            whileHover={{ background: "#6d28d9" }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-[7px] px-5 py-2.5 text-[13px] font-semibold text-white"
            style={{ background: "#7c3aed", textDecoration: "none" }}
          >
            Start building now
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.a>
          <div className="h-4 w-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.22)" }}>
            Takes less than 5 minutes
          </span>
        </motion.div>

      </div>
    </section>
  );
}