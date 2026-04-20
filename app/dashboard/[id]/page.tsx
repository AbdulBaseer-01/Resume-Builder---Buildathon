"use client";
// src/app/dashboard/[id]/page.tsx

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase, fetchResume, updateResume, saveResumeContent } from "@/lib/supabase";
import { Resume, ResumeContent, Template, EMPTY_CONTENT } from "@/types/resume";
import { EditorPanel } from "./components/EditorPanel";
import { PreviewPanel } from "./components/PreviewPanel";
import { AIAssistant } from "./components/AIAssisstant";

const MOCK_RESUME: Resume = {
  id: "demo",
  user_id: "demo",
  title: "Demo Resume",
  template: "modern",
  ats_score: 85,
  content: {
    personal: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "(555) 123-4567",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/johndoe",
      website: "johndoe.com",
      summary: "Experienced software engineer with a passion for building scalable web applications.",
    },
    experience: [
      {
        id: "1",
        company: "Tech Corp",
        role: "Senior Software Engineer",
        start: "Jan 2020",
        end: "Present",
        bullets: [
          "Led development of microservices architecture serving 1M+ users",
          "Improved application performance by 40% through optimization",
          "Mentored junior developers and conducted code reviews",
        ],
      },
    ],
    education: [
      {
        id: "1",
        institution: "University of California",
        degree: "Bachelor of Science in Computer Science",
        start: "2016",
        end: "2020",
        gpa: "3.8",
      },
    ],
    skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python"],
    projects: [],
    certifications: [],
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

type Tab = "edit" | "preview" | "ai";

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement>(null);

  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<Tab>("edit");

  // Load resume
  useEffect(() => {
    if (id === "demo") {
      setResume(MOCK_RESUME);
      setLoading(false);
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) { router.push("/dashboard"); return; }
        fetchResume(id)
          .then(setResume)
          .catch(() => router.push("/dashboard"))
          .finally(() => setLoading(false));
      });
    }
  }, [id, router]);

  // Auto-save debounced
  const saveContent = useCallback(
    async (content: ResumeContent) => {
      if (!resume || id === "demo") return; // No save for demo
      setSaving(true);
      try {
        await saveResumeContent(id, content);
      } finally {
        setTimeout(() => setSaving(false), 600);
      }
    },
    [id, resume]
  );

  const handleContentChange = (content: ResumeContent) => {
    setResume((prev) => prev ? { ...prev, content } : prev);
    saveContent(content);
  };

  const handleTemplateChange = async (template: Template) => {
    if (!resume) return;
    setResume((prev) => prev ? { ...prev, template } : prev);
    if (id !== "demo") {
      await updateResume(id, { template });
    }
  };

  const handleTitleChange = async (title: string) => {
    if (!resume) return;
    setResume((prev) => prev ? { ...prev, title } : prev);
    if (id !== "demo") {
      await updateResume(id, { title });
    }
  };

  const handleATSUpdate = async (score: number) => {
    if (!resume) return;
    setResume((prev) => prev ? { ...prev, ats_score: score } : prev);
    if (id !== "demo") {
      await updateResume(id, { ats_score: score });
    }
  };

  const handleDownload = async () => {
    if (tab !== "preview") setTab("preview");
    // Wait for render
    setTimeout(async () => {
      if (!previewRef.current || !resume) return;
      try {
        // Assuming html2canvas and jsPDF are installed
        const html2canvas = (await import('html2canvas')).default;
        const jsPDF = (await import('jspdf')).default;

        const canvas = await html2canvas(previewRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${resume.title || 'resume'}.pdf`);
      } catch (error) {
        console.error('Download failed:', error);
        alert('Download failed. Please try again.');
      }
    }, 100);
  };

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: "#09090b" }}
      >
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "#7c3aed" }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!resume) return null;

  return (
    <div
      className="flex min-h-screen flex-col overflow-hidden"
      style={{
        background: "#09090b",
        fontFamily: "'Instrument Sans','Helvetica Neue',sans-serif",
      }}
    >
      {/* Top nav */}
      <header
        className="flex items-center justify-between px-5 py-3 border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)", background: "#0c0c0e" }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-[11px] text-white/30 hover:text-white/60 transition-colors"
          >
            ← Back
          </button>
          <span className="text-white/15 text-xs">|</span>
          <input
            value={resume.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="bg-transparent text-[13px] font-semibold text-white/70 outline-none hover:text-white focus:text-white w-48 truncate"
          />
        </div>

        {/* Tab switcher */}
        <div
          className="flex rounded-[8px] mt-26 sticky top-0 p-0.5 gap-0.5"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          {(["edit", "preview", "ai"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="rounded-[6px] px-3 py-1.5 text-[11px] font-semibold capitalize transition-all"
              style={{
                background: tab === t ? "#7c3aed" : "transparent",
                color: tab === t ? "white" : "rgba(255,255,255,0.35)",
              }}
            >
              {t === "ai" ? "✦ AI" : t}
            </button>
          ))}
        </div>

        {/* Status + template */}
        <div className="flex items-center gap-3">
          {/* Print button */}
          <button
            onClick={() => {
              if (tab !== "preview") setTab("preview");
              setTimeout(() => window.print(), 100);
            }}
            className="rounded-[6px] px-3 py-1.5 text-[11px] font-semibold text-white hover:text-white transition-colors"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            📄 Print
          </button>

          {/* Download button */}
          <button
            onClick={handleDownload}
            className="rounded-[6px] px-3 py-1.5 text-[11px] font-semibold text-white hover:text-white transition-colors"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            ⬇️ Download PDF
          </button>

          {/* Template selector */}
          <select
            value={resume.template}
            onChange={(e) => handleTemplateChange(e.target.value as Template)}
            className="rounded-[6px] px-2 py-1 text-[11px] font-semibold text-white outline-none cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <option value="modern" className="text-black">Modern</option>
            <option value="classic" className="text-black">Classic</option>
            <option value="executive" className="text-black">Executive</option>
          </select>

          {/* ATS badge */}
          {resume.ats_score != null && (
            <div
              className="rounded px-2 py-0.5 text-[10px] font-semibold"
              style={{
                background: "rgba(124,58,237,0.1)",
                border: "1px solid rgba(124,58,237,0.2)",
                color: "#a78bfa",
              }}
            >
              ATS {resume.ats_score}
            </div>
          )}

          {/* Save indicator */}
          <span className="text-[10px] text-white/25 min-w-[50px] text-right">
            {saving ? "Saving…" : "Saved"}
          </span>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {tab === "edit" && (
          <>
            <div
              className="w-[420px] shrink-0 overflow-y-auto border-r"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}
            >
              <EditorPanel
                content={resume.content}
                onChange={handleContentChange}
              />
            </div>
            <div className="flex-1 overflow-auto p-8 flex justify-center">
              <div ref={previewRef}>
                <PreviewPanel resume={resume} />
              </div>
            </div>
          </>
        )}

        {tab === "preview" && (
          <div className="flex-1 overflow-auto p-8 flex justify-center">
            <div ref={previewRef}>
              <PreviewPanel resume={resume} />
            </div>
          </div>
        )}

        {tab === "ai" && (
          <div className="flex-1 overflow-y-auto">
            <AIAssistant
              resume={resume}
              onContentChange={handleContentChange}
              onATSUpdate={handleATSUpdate}
            />
          </div>
        )}
      </div>
    </div>
  );
}