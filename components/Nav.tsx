"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

const NAV_LINKS = [
  { label: "Editor", href: "/" },
  { label: "How it works?", href: "/#how" },
  { label: "Pricing", href: "/#pricing" },
];

export default function Nav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 12));

  return (
    <div>
      <div
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between h-16 px-6 md:px-8 transition-colors duration-300"
        style={{
          background: "#09090b",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div
            className="w-[30px] h-[30px] rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "#7c3aed" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="6" rx="1" fill="white" opacity="0.9" />
              <rect x="9" y="2" width="5" height="3" rx="1" fill="white" opacity="0.5" />
              <rect x="2" y="10" width="12" height="1.5" rx=".75" fill="white" opacity="0.5" />
              <rect x="2" y="13" width="8" height="1.5" rx=".75" fill="white" opacity="0.3" />
            </svg>
          </div>
          <span
            className="hidden sm:block text-white text-[15px] select-none"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, letterSpacing: "-0.01em" }}
          >
            Resu<span style={{ color: "#7c3aed" }}>.</span>me
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative flex items-center px-[14px] py-1.5 rounded-md text-[13px] font-medium transition-colors duration-150"
                style={{
                  fontFamily: "'Instrument Sans', 'Helvetica Neue', sans-serif",
                  color: active ? "#fff" : "rgba(255,255,255,0.45)",
                  background: "transparent",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)";
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }
                }}
              >
                {link.label}
                
                {active && (
                  <motion.span
                    layoutId="navPip"
                    className="absolute bottom-[4px] left-1/2 -translate-x-1/2 w-[3px] h-[3px] rounded-full"
                    style={{ background: "#7c3aed" }}
                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-2.5 flex-shrink-0">
          <Link
            href="/dashboard"
            className="text-[13px] font-medium px-[14px] py-[7px] rounded-md transition-colors duration-150"
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              color: "rgba(255,255,255,0.55)",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#fff";
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)";
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            Sign in
          </Link>

          <div className="w-px h-[18px]" style={{ background: "rgba(255,255,255,0.08)" }} />

          <Link
            href="/dashboard/demo"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-white px-[18px] py-[7px] rounded-md transition-colors duration-150"
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              background: "#7c3aed",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#6d28d9")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#7c3aed")}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1v10M1 6h10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            New resume
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-[5px]"
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block h-[1.5px] bg-white rounded-full origin-center"
              animate={
                menuOpen
                  ? i === 0
                    ? { rotate: 45, y: 6.5, width: 22 }
                    : i === 2
                    ? { rotate: -45, y: -6.5, width: 22 }
                    : { opacity: 0, width: 0 }
                  : { rotate: 0, y: 0, opacity: 1, width: i === 1 ? 14 : 22 }
              }
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            />
          ))}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40"
              style={{ background: "rgba(0,0,0,0.7)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              key="drawer"
              className="fixed right-0 top-0 bottom-0 z-50 w-64 flex flex-col pt-20 px-5 pb-6"
              style={{
                background: "#0f0f11",
                borderLeft: "1px solid rgba(255,255,255,0.06)",
              }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 40 }}
            >
              <ul className="flex flex-col gap-0.5">
                {NAV_LINKS.map((link, i) => {
                  const active = pathname === link.href;
                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 + 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-[13px] font-medium transition-colors duration-150"
                        style={{
                          fontFamily: "'Instrument Sans', sans-serif",
                          color: active ? "#fff" : "rgba(255,255,255,0.45)",
                          background: active ? "rgba(124,58,237,0.1)" : "transparent",
                          border: active ? "1px solid rgba(124,58,237,0.2)" : "1px solid transparent",
                        }}
                      >
                        {active && (
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#7c3aed" }} />
                        )}
                        {link.label}
                        {link.badge && (
                          <span
                            className="ml-auto text-[10px] font-semibold tracking-wider uppercase rounded px-1.5 py-0.5"
                            style={{ color: "#a78bfa", background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.2)" }}
                          >
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              <div className="mt-auto flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center w-full py-2.5 rounded-md text-[13px] font-medium transition-colors duration-150"
                  style={{
                    fontFamily: "'Instrument Sans', sans-serif",
                    color: "rgba(255,255,255,0.55)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-md text-[13px] font-semibold text-white transition-colors duration-150"
                  style={{ fontFamily: "'Instrument Sans', sans-serif", background: "#7c3aed" }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 1v10M1 6h10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  New resume
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}