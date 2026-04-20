"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();

  const handle = () => {
    router.push("/dashboard/demo");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "#09090b",
        fontFamily: "'Instrument Sans','Helvetica Neue',sans-serif",
      }}
    >
      {/* Background glow */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(124,58,237,0.12) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm"
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <div
            className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-[10px]"
            style={{ background: "#7c3aed" }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="2" width="10" height="14" rx="1.5" stroke="white" strokeWidth="1.4" />
              <path d="M6 6h4M6 9h4M6 12h2" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M13 9l4 4-4 4" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1
            className="text-[22px] font-medium text-white"
            style={{ fontFamily: "'Playfair Display',serif", letterSpacing: "-0.02em" }}
          >
            ResumeAI
          </h1>
          <p className="mt-1 text-[12px] text-white/35">
            Build your resume with AI
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-[16px] p-6"
          style={{
            background: "#111113",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* CTA */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handle}
            className="w-full rounded-[8px] py-3 text-[14px] font-semibold text-white"
            style={{ background: "#7c3aed" }}
          >
            Enter Dashboard
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}