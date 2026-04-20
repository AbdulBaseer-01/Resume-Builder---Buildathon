"use client";
// src/app/dashboard/[id]/components/AIAssistant.tsx

import { useState } from "react";
import { Resume, ResumeContent } from "@/types/resume";
import {
  getATSScore, ATSResult,
  suggestSummary, suggestBullets, suggestSkills,
  tailorToJobDescription, TailoringResult,
  improveText,
} from "@/lib/gemini";

interface Props {
  resume: Resume;
  onContentChange: (c: ResumeContent) => void;
  onATSUpdate: (score: number) => void;
}

type AITab = "ats" | "suggest" | "tailor" | "improve";

const AI_TABS: { key: AITab; label: string; emoji: string; desc: string }[] = [
  { key: "ats", label: "ATS Score", emoji: "📊", desc: "Analyze your resume against ATS systems" },
  { key: "suggest", label: "AI Fill", emoji: "✨", desc: "Generate content for any section" },
  { key: "tailor", label: "Tailor to JD", emoji: "🎯", desc: "Optimize for a job description" },
  { key: "improve", label: "Improve Text", emoji: "✍️", desc: "Fix grammar & strengthen your writing" },
];

function Spinner() {
  return (
    <div className="flex justify-center py-8">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-1.5 w-1.5 rounded-full animate-bounce"
            style={{ background: "#7c3aed", animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function ResultCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[10px] p-4" style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)" }}>
      {children}
    </div>
  );
}

// ── ATS Panel ────────────────────────────────────────────────────────────────
function ATSPanel({ resume, onATSUpdate }: { resume: Resume; onATSUpdate: (n: number) => void }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ATSResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setLoading(true); setError(null);
    try {
      const r = await getATSScore(resume.content);
      setResult(r);
      onATSUpdate(r.score);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="mb-4 text-[12px] text-white/45">Get an ATS compatibility score plus actionable feedback to improve your resume.</p>
      <button onClick={run} disabled={loading} className="w-full rounded-[8px] py-2.5 text-[13px] font-semibold text-white mb-4" style={{ background: loading ? "rgba(124,58,237,0.4)" : "#7c3aed" }}>
        {loading ? "Analyzing…" : "Analyze Resume"}
      </button>
      {loading && <Spinner />}
      {error && <p className="text-[11px] text-red-400">{error}</p>}
      {result && (
        <div className="space-y-3">
          {/* Score ring */}
          <ResultCard>
            <div className="flex items-center gap-4">
              <div className="relative flex h-16 w-16 items-center justify-center shrink-0">
                <svg width="64" height="64" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(124,58,237,0.15)" strokeWidth="6" />
                  <circle
                    cx="32" cy="32" r="26" fill="none" stroke="#7c3aed" strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${(result.score / 100) * 163} 163`}
                    transform="rotate(-90 32 32)"
                  />
                </svg>
                <span className="absolute text-[14px] font-bold text-white">{result.score}</span>
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white">ATS Score</p>
                <p className="text-[11px] text-white/40">
                  {result.score >= 80 ? "Excellent" : result.score >= 60 ? "Good" : result.score >= 40 ? "Needs work" : "Poor"}
                </p>
              </div>
            </div>
          </ResultCard>

          {/* Strengths */}
          <ResultCard>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.07em] text-emerald-400">Strengths</p>
            <ul className="space-y-1">
              {result.strengths.map((s, i) => (
                <li key={i} className="flex gap-2 text-[11.5px] text-white/70"><span className="text-emerald-400">✓</span>{s}</li>
              ))}
            </ul>
          </ResultCard>

          {/* Improvements */}
          <ResultCard>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.07em] text-amber-400">Improvements</p>
            <ul className="space-y-1">
              {result.improvements.map((s, i) => (
                <li key={i} className="flex gap-2 text-[11.5px] text-white/70"><span className="text-amber-400">→</span>{s}</li>
              ))}
            </ul>
          </ResultCard>

          {/* Missing keywords */}
          {result.keywords.length > 0 && (
            <ResultCard>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.07em] text-white/40">Missing Keywords</p>
              <div className="flex flex-wrap gap-1.5">
                {result.keywords.map((k) => (
                  <span key={k} className="rounded px-2 py-0.5 text-[10px] font-semibold" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>{k}</span>
                ))}
              </div>
            </ResultCard>
          )}
        </div>
      )}
    </div>
  );
}

// ── Suggest Panel ────────────────────────────────────────────────────────────
function SuggestPanel({ resume, onContentChange }: { resume: Resume; onContentChange: (c: ResumeContent) => void }) {
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [summaryResult, setSummaryResult] = useState<string | null>(null);
  const [bulletsExpId, setBulletsExpId] = useState<string>("");
  const [bulletsResult, setBulletsResult] = useState<string[] | null>(null);
  const [skillsResult, setSkillsResult] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runSummary = async () => {
    setLoading("summary"); setError(null);
    try {
      const r = await suggestSummary(resume.content.personal.name, targetRole, resume.content.skills);
      setSummaryResult(r);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(null); }
  };

  const runBullets = async () => {
    if (!bulletsExpId) return;
    const exp = resume.content.experience.find((e) => e.id === bulletsExpId);
    if (!exp) return;
    setLoading("bullets"); setError(null);
    try {
      const r = await suggestBullets(exp.role, exp.company, exp.bullets);
      setBulletsResult(r);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(null); }
  };

  const runSkills = async () => {
    setLoading("skills"); setError(null);
    try {
      const r = await suggestSkills(targetRole, resume.content.skills);
      setSkillsResult(r);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(null); }
  };

  const applyField = (label: string): React.CSSProperties => ({
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 8, padding: "7px 10px", fontSize: 12, color: "white", outline: "none", width: "100%",
  });

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.06em] text-white/35">Target Role</label>
        <input value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="e.g. Senior Software Engineer" style={applyField("role")} />
      </div>

      {error && <p className="text-[11px] text-red-400">{error}</p>}

      {/* Summary */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[12px] font-semibold text-white/70">✨ Generate Summary</p>
          <button onClick={runSummary} disabled={loading === "summary" || !targetRole} className="rounded-[6px] px-3 py-1 text-[11px] font-semibold text-white disabled:opacity-40" style={{ background: "#7c3aed" }}>
            {loading === "summary" ? "…" : "Generate"}
          </button>
        </div>
        {loading === "summary" && <Spinner />}
        {summaryResult && (
          <ResultCard>
            <p className="text-[11.5px] text-white/70 leading-relaxed mb-3">{summaryResult}</p>
            <button
              onClick={() => {
                onContentChange({ ...resume.content, personal: { ...resume.content.personal, summary: summaryResult } });
                setSummaryResult(null);
              }}
              className="text-[10px] font-semibold text-violet-400 hover:text-violet-300"
            >Apply →</button>
          </ResultCard>
        )}
      </div>

      {/* Bullets */}
      {resume.content.experience.length > 0 && (
        <div>
          <p className="text-[12px] font-semibold text-white/70 mb-2">✨ Generate Bullets</p>
          <select value={bulletsExpId} onChange={(e) => setBulletsExpId(e.target.value)} style={{ ...applyField("exp"), marginBottom: 8 }}>
            <option value="">Select experience…</option>
            {resume.content.experience.map((e) => (
              <option key={e.id} value={e.id}>{e.role} @ {e.company}</option>
            ))}
          </select>
          <button onClick={runBullets} disabled={loading === "bullets" || !bulletsExpId} className="w-full rounded-[7px] py-1.5 text-[11px] font-semibold text-white disabled:opacity-40" style={{ background: "#7c3aed" }}>
            {loading === "bullets" ? "…" : "Generate bullets"}
          </button>
          {loading === "bullets" && <Spinner />}
          {bulletsResult && (
            <ResultCard>
              <ul className="space-y-1 mb-3">
                {bulletsResult.map((b, i) => <li key={i} className="text-[11.5px] text-white/70">• {b}</li>)}
              </ul>
              <button
                onClick={() => {
                  const updated = resume.content.experience.map((e) =>
                    e.id === bulletsExpId ? { ...e, bullets: bulletsResult } : e
                  );
                  onContentChange({ ...resume.content, experience: updated });
                  setBulletsResult(null);
                }}
                className="text-[10px] font-semibold text-violet-400 hover:text-violet-300"
              >Apply →</button>
            </ResultCard>
          )}
        </div>
      )}

      {/* Skills */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[12px] font-semibold text-white/70">✨ Suggest Skills</p>
          <button onClick={runSkills} disabled={loading === "skills" || !targetRole} className="rounded-[6px] px-3 py-1 text-[11px] font-semibold text-white disabled:opacity-40" style={{ background: "#7c3aed" }}>
            {loading === "skills" ? "…" : "Suggest"}
          </button>
        </div>
        {loading === "skills" && <Spinner />}
        {skillsResult && (
          <ResultCard>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {skillsResult.map((s) => (
                <span key={s} className="rounded px-2 py-0.5 text-[10px] font-semibold" style={{ background: "rgba(124,58,237,0.1)", color: "#a78bfa" }}>{s}</span>
              ))}
            </div>
            <button
              onClick={() => {
                const merged = Array.from(new Set([...resume.content.skills, ...skillsResult]));
                onContentChange({ ...resume.content, skills: merged });
                setSkillsResult(null);
              }}
              className="text-[10px] font-semibold text-violet-400 hover:text-violet-300"
            >Add all →</button>
          </ResultCard>
        )}
      </div>
    </div>
  );
}

// ── Tailor Panel ─────────────────────────────────────────────────────────────
function TailorPanel({ resume, onContentChange }: { resume: Resume; onContentChange: (c: ResumeContent) => void }) {
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TailoringResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setLoading(true); setError(null);
    try {
      const r = await tailorToJobDescription(resume.content, jd);
      setResult(r);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <p className="mb-3 text-[12px] text-white/45">Paste a job description and Gemini will rewrite your resume to match.</p>
      <textarea
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        placeholder="Paste job description here…"
        rows={6}
        style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "10px", fontSize: 12, color: "white", outline: "none", resize: "vertical", marginBottom: 12, fontFamily: "inherit" }}
      />
      <button onClick={run} disabled={loading || !jd} className="w-full rounded-[8px] py-2.5 text-[13px] font-semibold text-white disabled:opacity-40 mb-4" style={{ background: "#7c3aed" }}>
        {loading ? "Tailoring…" : "Tailor Resume"}
      </button>
      {loading && <Spinner />}
      {error && <p className="text-[11px] text-red-400">{error}</p>}
      {result && (
        <div className="space-y-3">
          {result.summaryRewrite && (
            <ResultCard>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.07em] text-violet-400">Rewritten Summary</p>
              <p className="text-[11.5px] text-white/70 leading-relaxed mb-3">{result.summaryRewrite}</p>
              <button
                onClick={() => onContentChange({ ...resume.content, personal: { ...resume.content.personal, summary: result.summaryRewrite } })}
                className="text-[10px] font-semibold text-violet-400"
              >Apply →</button>
            </ResultCard>
          )}
          {result.bulletRewrites.length > 0 && (
            <ResultCard>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.07em] text-violet-400">Bullet Rewrites</p>
              {result.bulletRewrites.map((br, i) => (
                <div key={i} className="mb-3">
                  <p className="text-[10px] text-white/30 mb-0.5">Original: {br.original}</p>
                  <p className="text-[11.5px] text-white/70">→ {br.improved}</p>
                </div>
              ))}
            </ResultCard>
          )}
          {result.addKeywords.length > 0 && (
            <ResultCard>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.07em] text-violet-400">Add These Keywords</p>
              <div className="flex flex-wrap gap-1.5">
                {result.addKeywords.map((k) => (
                  <span key={k} className="rounded px-2 py-0.5 text-[10px] font-semibold" style={{ background: "rgba(124,58,237,0.1)", color: "#a78bfa" }}>{k}</span>
                ))}
              </div>
            </ResultCard>
          )}
        </div>
      )}
    </div>
  );
}

// ── Improve Panel ─────────────────────────────────────────────────────────────
function ImprovePanel({ resume, onContentChange }: { resume: Resume; onContentChange: (c: ResumeContent) => void }) {
  const [text, setText] = useState("");
  const [ctx, setCtx] = useState<"summary" | "bullet" | "general">("general");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setLoading(true); setError(null);
    try { setResult(await improveText(text, ctx)); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <p className="mb-3 text-[12px] text-white/45">Paste any text from your resume to fix grammar and improve impact.</p>
      <div className="flex gap-1.5 mb-3">
        {(["summary", "bullet", "general"] as const).map((c) => (
          <button key={c} onClick={() => setCtx(c)} className="rounded-[6px] px-2.5 py-1 text-[11px] font-semibold capitalize" style={{ background: ctx === c ? "#7c3aed" : "rgba(255,255,255,0.05)", color: ctx === c ? "white" : "rgba(255,255,255,0.4)" }}>
            {c}
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your text here…"
        rows={4}
        style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "10px", fontSize: 12, color: "white", outline: "none", resize: "vertical", marginBottom: 12, fontFamily: "inherit" }}
      />
      <button onClick={run} disabled={loading || !text} className="w-full rounded-[8px] py-2.5 text-[13px] font-semibold text-white disabled:opacity-40 mb-4" style={{ background: "#7c3aed" }}>
        {loading ? "Improving…" : "Improve Text"}
      </button>
      {loading && <Spinner />}
      {error && <p className="text-[11px] text-red-400">{error}</p>}
      {result && (
        <ResultCard>
          <p className="text-[11.5px] text-white/70 leading-relaxed mb-3">{result}</p>
          <button onClick={() => { navigator.clipboard.writeText(result); }} className="text-[10px] font-semibold text-violet-400">Copy →</button>
        </ResultCard>
      )}
    </div>
  );
}

// ── Main AIAssistant ──────────────────────────────────────────────────────────
export function AIAssistant({ resume, onContentChange, onATSUpdate }: Props) {
  const [tab, setTab] = useState<AITab>("ats");
  const active = AI_TABS.find((t) => t.key === tab)!;

  return (
    <div
      className="min-h-full"
      style={{ background: "#09090b", fontFamily: "'Instrument Sans',sans-serif" }}
    >
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.07em] mb-1" style={{ color: "#a78bfa" }}>✦ AI Assistant</p>
          <h2 className="text-[20px] font-medium text-white" style={{ fontFamily: "'Playfair Display',serif" }}>
            Powered by Gemini
          </h2>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 gap-2 mb-6 sm:grid-cols-4">
          {AI_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="rounded-[10px] p-3 text-left transition-all"
              style={{
                background: tab === t.key ? "rgba(124,58,237,0.15)" : "rgba(255,255,255,0.03)",
                border: tab === t.key ? "1px solid rgba(124,58,237,0.3)" : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p className="text-[16px] mb-1">{t.emoji}</p>
              <p className="text-[11px] font-semibold" style={{ color: tab === t.key ? "#a78bfa" : "rgba(255,255,255,0.5)" }}>{t.label}</p>
            </button>
          ))}
        </div>

        {/* Panel */}
        <div className="rounded-[14px] p-5" style={{ background: "#111113", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="mb-4 text-[11px] text-white/30">{active.desc}</p>
          {tab === "ats" && <ATSPanel resume={resume} onATSUpdate={onATSUpdate} />}
          {tab === "suggest" && <SuggestPanel resume={resume} onContentChange={onContentChange} />}
          {tab === "tailor" && <TailorPanel resume={resume} onContentChange={onContentChange} />}
          {tab === "improve" && <ImprovePanel resume={resume} onContentChange={onContentChange} />}
        </div>
      </div>
    </div>
  );
}