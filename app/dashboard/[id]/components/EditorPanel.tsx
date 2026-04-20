"use client";
// src/app/dashboard/[id]/components/EditorPanel.tsx

import { useState } from "react";
import { v4 as uuid } from "uuid";
import { ResumeContent, ExperienceItem, EducationItem, ProjectItem, CertificationItem } from "@/types/resume";

interface Props {
  content: ResumeContent;
  onChange: (c: ResumeContent) => void;
}

type Section = "personal" | "experience" | "education" | "skills" | "projects" | "certifications";

const SECTIONS: { key: Section; label: string; icon: string }[] = [
  { key: "personal", label: "Personal Info", icon: "👤" },
  { key: "experience", label: "Experience", icon: "💼" },
  { key: "education", label: "Education", icon: "🎓" },
  { key: "skills", label: "Skills", icon: "⚡" },
  { key: "projects", label: "Projects", icon: "🛠" },
  { key: "certifications", label: "Certifications", icon: "🏅" },
];

function Field({
  label, value, onChange, placeholder, multiline = false, small = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; multiline?: boolean; small?: boolean;
}) {
  const base: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "white",
    width: "100%",
    borderRadius: 8,
    padding: multiline ? "8px 10px" : "7px 10px",
    fontSize: small ? 11 : 12,
    outline: "none",
    resize: multiline ? "vertical" : undefined,
    fontFamily: "inherit",
  };

  return (
    <div className="mb-3">
      <label
        className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.06em]"
        style={{ color: "rgba(255,255,255,0.35)" }}
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          style={base}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={base}
        />
      )}
    </div>
  );
}

export function EditorPanel({ content, onChange }: Props) {
  const [active, setActive] = useState<Section>("personal");
  const [skillInput, setSkillInput] = useState("");

  const set = (patch: Partial<ResumeContent>) => onChange({ ...content, ...patch });

  // ── Personal ────────────────────────────────────────────────────────────────
  const PersonalSection = (
    <div>
      <Field label="Full Name" value={content.personal.name} onChange={(v) => set({ personal: { ...content.personal, name: v } })} placeholder="Jane Doe" />
      <div className="grid grid-cols-2 gap-2">
        <Field label="Email" value={content.personal.email} onChange={(v) => set({ personal: { ...content.personal, email: v } })} placeholder="jane@example.com" />
        <Field label="Phone" value={content.personal.phone} onChange={(v) => set({ personal: { ...content.personal, phone: v } })} placeholder="+1 555 0100" />
      </div>
      <Field label="Location" value={content.personal.location} onChange={(v) => set({ personal: { ...content.personal, location: v } })} placeholder="San Francisco, CA" />
      <div className="grid grid-cols-2 gap-2">
        <Field label="LinkedIn" value={content.personal.linkedin} onChange={(v) => set({ personal: { ...content.personal, linkedin: v } })} placeholder="linkedin.com/in/..." />
        <Field label="Website" value={content.personal.website} onChange={(v) => set({ personal: { ...content.personal, website: v } })} placeholder="yoursite.dev" />
      </div>
      <Field label="Professional Summary" value={content.personal.summary} onChange={(v) => set({ personal: { ...content.personal, summary: v } })} placeholder="Experienced engineer with..." multiline />
    </div>
  );

  // ── Experience ──────────────────────────────────────────────────────────────
  const addExp = () => set({
    experience: [...content.experience, { id: uuid(), company: "", role: "", start: "", end: "", bullets: [""] }],
  });

  const updateExp = (id: string, patch: Partial<ExperienceItem>) =>
    set({ experience: content.experience.map((e) => e.id === id ? { ...e, ...patch } : e) });

  const removeExp = (id: string) =>
    set({ experience: content.experience.filter((e) => e.id !== id) });

  const ExperienceSection = (
    <div>
      {content.experience.map((exp) => (
        <div
          key={exp.id}
          className="mb-4 rounded-[10px] p-3"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="grid grid-cols-2 gap-2">
            <Field label="Company" value={exp.company} onChange={(v) => updateExp(exp.id, { company: v })} placeholder="Acme Corp" />
            <Field label="Role" value={exp.role} onChange={(v) => updateExp(exp.id, { role: v })} placeholder="Senior Engineer" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Start" value={exp.start} onChange={(v) => updateExp(exp.id, { start: v })} placeholder="Jan 2021" />
            <Field label="End" value={exp.end} onChange={(v) => updateExp(exp.id, { end: v })} placeholder="Present" />
          </div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.06em]" style={{ color: "rgba(255,255,255,0.35)" }}>Bullets</label>
          {exp.bullets.map((b, i) => (
            <div key={i} className="mb-1.5 flex gap-1">
              <textarea
                value={b}
                onChange={(e) => {
                  const bullets = [...exp.bullets];
                  bullets[i] = e.target.value;
                  updateExp(exp.id, { bullets });
                }}
                rows={2}
                placeholder="Led refactor that reduced load time by 40%"
                style={{
                  flex: 1, background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 6, padding: "6px 8px", fontSize: 11,
                  color: "white", outline: "none", resize: "none", fontFamily: "inherit",
                }}
              />
              <button
                onClick={() => updateExp(exp.id, { bullets: exp.bullets.filter((_, j) => j !== i) })}
                className="text-white/20 hover:text-red-400 text-[10px] px-1"
              >✕</button>
            </div>
          ))}
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => updateExp(exp.id, { bullets: [...exp.bullets, ""] })}
              className="text-[10px] font-semibold text-white/30 hover:text-white/60"
            >+ Add bullet</button>
            <button onClick={() => removeExp(exp.id)} className="ml-auto text-[10px] font-semibold text-red-400/50 hover:text-red-400">Remove</button>
          </div>
        </div>
      ))}
      <button
        onClick={addExp}
        className="w-full rounded-[8px] py-2 text-[11px] font-semibold"
        style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", color: "#a78bfa" }}
      >+ Add experience</button>
    </div>
  );

  // ── Education ───────────────────────────────────────────────────────────────
  const addEdu = () => set({
    education: [...content.education, { id: uuid(), institution: "", degree: "", start: "", end: "", gpa: "" }],
  });
  const updateEdu = (id: string, patch: Partial<EducationItem>) =>
    set({ education: content.education.map((e) => e.id === id ? { ...e, ...patch } : e) });

  const EducationSection = (
    <div>
      {content.education.map((edu) => (
        <div key={edu.id} className="mb-4 rounded-[10px] p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <Field label="Institution" value={edu.institution} onChange={(v) => updateEdu(edu.id, { institution: v })} placeholder="MIT" />
          <Field label="Degree" value={edu.degree} onChange={(v) => updateEdu(edu.id, { degree: v })} placeholder="B.S. Computer Science" />
          <div className="grid grid-cols-3 gap-2">
            <Field label="Start" value={edu.start} onChange={(v) => updateEdu(edu.id, { start: v })} placeholder="2015" />
            <Field label="End" value={edu.end} onChange={(v) => updateEdu(edu.id, { end: v })} placeholder="2019" />
            <Field label="GPA" value={edu.gpa} onChange={(v) => updateEdu(edu.id, { gpa: v })} placeholder="3.9" />
          </div>
          <button onClick={() => set({ education: content.education.filter((e) => e.id !== edu.id) })} className="text-[10px] text-red-400/50 hover:text-red-400">Remove</button>
        </div>
      ))}
      <button onClick={addEdu} className="w-full rounded-[8px] py-2 text-[11px] font-semibold" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", color: "#a78bfa" }}>
        + Add education
      </button>
    </div>
  );

  // ── Skills ──────────────────────────────────────────────────────────────────
  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !content.skills.includes(s)) {
      set({ skills: [...content.skills, s] });
    }
    setSkillInput("");
  };

  const SkillsSection = (
    <div>
      <div className="flex gap-2 mb-3">
        <input
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addSkill()}
          placeholder="Type a skill and press Enter"
          style={{
            flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8, padding: "7px 10px", fontSize: 12, color: "white", outline: "none",
          }}
        />
        <button onClick={addSkill} className="rounded-[7px] px-3 text-[11px] font-semibold" style={{ background: "#7c3aed", color: "white" }}>Add</button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {content.skills.map((s) => (
          <span
            key={s}
            className="flex items-center gap-1 rounded px-2 py-1 text-[11px] font-semibold"
            style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", color: "#a78bfa" }}
          >
            {s}
            <button onClick={() => set({ skills: content.skills.filter((x) => x !== s) })} className="text-white/20 hover:text-red-400">✕</button>
          </span>
        ))}
      </div>
    </div>
  );

  // ── Projects ────────────────────────────────────────────────────────────────
  const addProject = () => set({
    projects: [...content.projects, { id: uuid(), name: "", description: "", url: "", tech: [] }],
  });
  const updateProject = (id: string, patch: Partial<ProjectItem>) =>
    set({ projects: content.projects.map((p) => p.id === id ? { ...p, ...patch } : p) });

  const ProjectsSection = (
    <div>
      {content.projects.map((p) => (
        <div key={p.id} className="mb-4 rounded-[10px] p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Project Name" value={p.name} onChange={(v) => updateProject(p.id, { name: v })} placeholder="OpenResume" />
            <Field label="URL" value={p.url} onChange={(v) => updateProject(p.id, { url: v })} placeholder="github.com/..." />
          </div>
          <Field label="Description" value={p.description} onChange={(v) => updateProject(p.id, { description: v })} placeholder="What does it do?" multiline />
          <Field
            label="Tech (comma separated)"
            value={p.tech.join(", ")}
            onChange={(v) => updateProject(p.id, { tech: v.split(",").map((t) => t.trim()).filter(Boolean) })}
            placeholder="React, TypeScript, Supabase"
          />
          <button onClick={() => set({ projects: content.projects.filter((x) => x.id !== p.id) })} className="text-[10px] text-red-400/50 hover:text-red-400">Remove</button>
        </div>
      ))}
      <button onClick={addProject} className="w-full rounded-[8px] py-2 text-[11px] font-semibold" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", color: "#a78bfa" }}>
        + Add project
      </button>
    </div>
  );

  // ── Certifications ──────────────────────────────────────────────────────────
  const addCert = () => set({
    certifications: [...content.certifications, { id: uuid(), name: "", issuer: "", date: "" }],
  });
  const updateCert = (id: string, patch: Partial<CertificationItem>) =>
    set({ certifications: content.certifications.map((c) => c.id === id ? { ...c, ...patch } : c) });

  const CertificationsSection = (
    <div>
      {content.certifications.map((c) => (
        <div key={c.id} className="mb-3 rounded-[10px] p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Certification" value={c.name} onChange={(v) => updateCert(c.id, { name: v })} placeholder="AWS Solutions Architect" />
            <Field label="Issuer" value={c.issuer} onChange={(v) => updateCert(c.id, { issuer: v })} placeholder="Amazon" />
          </div>
          <Field label="Date" value={c.date} onChange={(v) => updateCert(c.id, { date: v })} placeholder="2022" />
          <button onClick={() => set({ certifications: content.certifications.filter((x) => x.id !== c.id) })} className="text-[10px] text-red-400/50 hover:text-red-400">Remove</button>
        </div>
      ))}
      <button onClick={addCert} className="w-full rounded-[8px] py-2 text-[11px] font-semibold" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", color: "#a78bfa" }}>
        + Add certification
      </button>
    </div>
  );

  const panels: Record<Section, React.ReactNode> = {
    personal: PersonalSection,
    experience: ExperienceSection,
    education: EducationSection,
    skills: SkillsSection,
    projects: ProjectsSection,
    certifications: CertificationsSection,
  };

  return (
    <div className="p-5" style={{ fontFamily: "'Instrument Sans',sans-serif" }}>
      {/* Section nav */}
      <div className="mb-5 flex flex-wrap gap-1.5">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => setActive(s.key)}
            className="rounded-[6px] px-2.5 py-1 text-[11px] font-semibold transition-all"
            style={{
              background: active === s.key ? "#7c3aed" : "rgba(255,255,255,0.05)",
              color: active === s.key ? "white" : "rgba(255,255,255,0.45)",
              border: active === s.key ? "1px solid transparent" : "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {/* Active panel */}
      {panels[active]}
    </div>
  );
}