"use client";
// src/app/dashboard/[id]/components/EditorPanel.tsx

import { useState, useRef, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { ResumeContent, ExperienceItem, EducationItem, ProjectItem, CertificationItem } from "@/types/resume";

interface Props {
  content: ResumeContent;
  onChange: (c: ResumeContent) => void;
}

type Section = "personal" | "experience" | "education" | "skills" | "projects" | "certifications";

const SECTIONS: { key: Section; label: string; icon: React.ReactNode }[] = [
  {
    key: "personal", label: "Personal",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    ),
  },
  {
    key: "experience", label: "Experience",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      </svg>
    ),
  },
  {
    key: "education", label: "Education",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
      </svg>
    ),
  },
  {
    key: "skills", label: "Skills",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  {
    key: "projects", label: "Projects",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
  {
    key: "certifications", label: "Certifications",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
  },
];

// ── Shared styles ─────────────────────────────────────────────────────────────
const inputBase: React.CSSProperties = {
  background: "rgba(255,255,255,0.035)",
  border: "1px solid rgba(255,255,255,0.075)",
  color: "rgba(255,255,255,0.9)",
  width: "100%",
  borderRadius: 7,
  padding: "8px 11px",
  fontSize: 12.5,
  outline: "none",
  fontFamily: "'DM Sans', 'Instrument Sans', sans-serif",
  transition: "border-color 0.15s, background 0.15s, box-shadow 0.15s",
  letterSpacing: "0.01em",
};

const inputFocusStyle = `
  .rp-input:focus, .rp-textarea:focus {
    border-color: rgba(139, 92, 246, 0.55) !important;
    background: rgba(139, 92, 246, 0.06) !important;
    box-shadow: 0 0 0 3px rgba(139,92,246,0.1) !important;
  }
  .rp-input::placeholder, .rp-textarea::placeholder {
    color: rgba(255,255,255,0.18);
  }
  .rp-card {
    transition: border-color 0.2s;
  }
  .rp-card:hover {
    border-color: rgba(255,255,255,0.1) !important;
  }
  .rp-remove-btn {
    opacity: 0;
    transition: opacity 0.15s, color 0.15s;
  }
  .rp-card:hover .rp-remove-btn {
    opacity: 1;
  }
  .rp-bullet-row:hover .rp-bullet-remove {
    opacity: 1;
  }
  .rp-bullet-remove {
    opacity: 0;
    transition: opacity 0.15s, color 0.15s;
  }
  @keyframes rp-fadein {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .rp-section-panel {
    animation: rp-fadein 0.2s ease;
  }
  .rp-add-btn:hover {
    background: rgba(139,92,246,0.18) !important;
    border-color: rgba(139,92,246,0.4) !important;
  }
  .rp-skill-tag:hover .rp-skill-remove {
    opacity: 1;
  }
  .rp-skill-remove {
    opacity: 0.3;
    transition: opacity 0.15s, color 0.15s;
  }
  .rp-skill-remove:hover {
    opacity: 1;
    color: #f87171 !important;
  }
`;

// ── Field component ───────────────────────────────────────────────────────────
function Field({
  label, value, onChange, placeholder, multiline = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; multiline?: boolean;
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{
        display: "block", marginBottom: 5,
        fontSize: 10, fontWeight: 600,
        textTransform: "uppercase", letterSpacing: "0.08em",
        color: "rgba(255,255,255,0.3)",
      }}>
        {label}
      </label>
      {multiline ? (
        <textarea
          className="rp-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          style={{ ...inputBase, resize: "vertical", lineHeight: 1.6 }}
        />
      ) : (
        <input
          className="rp-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={inputBase}
        />
      )}
    </div>
  );
}

// ── Divider ───────────────────────────────────────────────────────────────────
function SectionHeader({ title, count }: { title: string; count?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <span style={{ fontSize: 11.5, fontWeight: 600, color: "rgba(255,255,255,0.45)", letterSpacing: "0.03em" }}>
        {title}
      </span>
      {count !== undefined && count > 0 && (
        <span style={{
          fontSize: 10, fontWeight: 700,
          background: "rgba(139,92,246,0.15)",
          color: "#a78bfa",
          borderRadius: 20,
          padding: "1px 7px",
        }}>
          {count}
        </span>
      )}
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
    </div>
  );
}

// ── Card wrapper ──────────────────────────────────────────────────────────────
function Card({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <div
      className="rp-card"
      style={{
        marginBottom: 12,
        borderRadius: 10,
        padding: "14px 14px 10px",
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.06)",
        position: "relative",
      }}
    >
      {children}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.045)" }}>
        <button
          className="rp-remove-btn"
          onClick={onRemove}
          style={{
            fontSize: 10.5, fontWeight: 600,
            color: "rgba(248,113,113,0.6)",
            background: "none", border: "none", cursor: "pointer",
            padding: "2px 0",
            letterSpacing: "0.02em",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(248,113,113,0.6)")}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

// ── Add button ────────────────────────────────────────────────────────────────
function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      className="rp-add-btn"
      onClick={onClick}
      style={{
        width: "100%", borderRadius: 8, padding: "9px",
        fontSize: 11.5, fontWeight: 600,
        background: "rgba(139,92,246,0.08)",
        border: "1.5px dashed rgba(139,92,246,0.25)",
        color: "#a78bfa",
        cursor: "pointer",
        letterSpacing: "0.02em",
        transition: "background 0.15s, border-color 0.15s",
      }}
    >
      + {label}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function EditorPanel({ content, onChange }: Props) {
  const [active, setActive] = useState<Section>("personal");
  const [skillInput, setSkillInput] = useState("");
  const prevActive = useRef(active);

  useEffect(() => { prevActive.current = active; }, [active]);

  const set = (patch: Partial<ResumeContent>) => onChange({ ...content, ...patch });

  // ── Personal ─────────────────────────────────────────────────────────────
  const PersonalSection = (
    <div className="rp-section-panel">
      <SectionHeader title="Basic Details" />
      <Field label="Full Name" value={content.personal.name} onChange={(v) => set({ personal: { ...content.personal, name: v } })} placeholder="Jane Doe" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Email" value={content.personal.email} onChange={(v) => set({ personal: { ...content.personal, email: v } })} placeholder="jane@example.com" />
        <Field label="Phone" value={content.personal.phone} onChange={(v) => set({ personal: { ...content.personal, phone: v } })} placeholder="+1 555 0100" />
      </div>
      <Field label="Location" value={content.personal.location} onChange={(v) => set({ personal: { ...content.personal, location: v } })} placeholder="San Francisco, CA" />
      <SectionHeader title="Online Presence" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="LinkedIn" value={content.personal.linkedin} onChange={(v) => set({ personal: { ...content.personal, linkedin: v } })} placeholder="linkedin.com/in/jane" />
        <Field label="Website" value={content.personal.website} onChange={(v) => set({ personal: { ...content.personal, website: v } })} placeholder="yoursite.dev" />
      </div>
      <SectionHeader title="Summary" />
      <Field label="Professional Summary" value={content.personal.summary} onChange={(v) => set({ personal: { ...content.personal, summary: v } })} placeholder="Experienced engineer with a passion for..." multiline />
    </div>
  );

  // ── Experience ────────────────────────────────────────────────────────────
  const addExp = () => set({
    experience: [...content.experience, { id: uuid(), company: "", role: "", start: "", end: "", bullets: [""] }],
  });
  const updateExp = (id: string, patch: Partial<ExperienceItem>) =>
    set({ experience: content.experience.map((e) => e.id === id ? { ...e, ...patch } : e) });
  const removeExp = (id: string) =>
    set({ experience: content.experience.filter((e) => e.id !== id) });

  const ExperienceSection = (
    <div className="rp-section-panel">
      <SectionHeader title="Work History" count={content.experience.length} />
      {content.experience.map((exp) => (
        <Card key={exp.id} onRemove={() => removeExp(exp.id)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Company" value={exp.company} onChange={(v) => updateExp(exp.id, { company: v })} placeholder="Acme Corp" />
            <Field label="Role" value={exp.role} onChange={(v) => updateExp(exp.id, { role: v })} placeholder="Senior Engineer" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Start" value={exp.start} onChange={(v) => updateExp(exp.id, { start: v })} placeholder="Jan 2021" />
            <Field label="End" value={exp.end} onChange={(v) => updateExp(exp.id, { end: v })} placeholder="Present" />
          </div>

          <label style={{
            display: "block", marginBottom: 7,
            fontSize: 10, fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.3)",
          }}>
            Highlights
          </label>
          {exp.bullets.map((b, i) => (
            <div
              key={i}
              className="rp-bullet-row"
              style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 6 }}
            >
              <span style={{ color: "rgba(139,92,246,0.6)", fontSize: 16, lineHeight: 1, userSelect: "none", paddingTop: 9 }}>·</span>
              <textarea
                className="rp-textarea"
                value={b}
                onChange={(e) => {
                  const bullets = [...exp.bullets];
                  bullets[i] = e.target.value;
                  updateExp(exp.id, { bullets });
                }}
                rows={2}
                placeholder="Led refactor that reduced load time by 40%"
                style={{ ...inputBase, flex: 1, resize: "none", lineHeight: 1.6 }}
              />
              <button
                className="rp-bullet-remove"
                onClick={() => updateExp(exp.id, { bullets: exp.bullets.filter((_, j) => j !== i) })}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "rgba(255,255,255,0.2)", fontSize: 13,
                  padding: "6px 2px", lineHeight: 1,
                }}
                title="Remove bullet"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={() => updateExp(exp.id, { bullets: [...exp.bullets, ""] })}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 11, fontWeight: 600,
              color: "rgba(167,139,250,0.6)",
              padding: "4px 0", letterSpacing: "0.02em", marginTop: 4,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#a78bfa")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(167,139,250,0.6)")}
          >
            + Add highlight
          </button>
        </Card>
      ))}
      <AddButton label="Add experience" onClick={addExp} />
    </div>
  );

  // ── Education ─────────────────────────────────────────────────────────────
  const addEdu = () => set({
    education: [...content.education, { id: uuid(), institution: "", degree: "", start: "", end: "", gpa: "" }],
  });
  const updateEdu = (id: string, patch: Partial<EducationItem>) =>
    set({ education: content.education.map((e) => e.id === id ? { ...e, ...patch } : e) });

  const EducationSection = (
    <div className="rp-section-panel">
      <SectionHeader title="Academic Background" count={content.education.length} />
      {content.education.map((edu) => (
        <Card key={edu.id} onRemove={() => set({ education: content.education.filter((e) => e.id !== edu.id) })}>
          <Field label="Institution" value={edu.institution} onChange={(v) => updateEdu(edu.id, { institution: v })} placeholder="MIT" />
          <Field label="Degree" value={edu.degree} onChange={(v) => updateEdu(edu.id, { degree: v })} placeholder="B.S. Computer Science" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <Field label="Start" value={edu.start} onChange={(v) => updateEdu(edu.id, { start: v })} placeholder="2015" />
            <Field label="End" value={edu.end} onChange={(v) => updateEdu(edu.id, { end: v })} placeholder="2019" />
            <Field label="GPA" value={edu.gpa} onChange={(v) => updateEdu(edu.id, { gpa: v })} placeholder="3.9" />
          </div>
        </Card>
      ))}
      <AddButton label="Add education" onClick={addEdu} />
    </div>
  );

  // ── Skills ────────────────────────────────────────────────────────────────
  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !content.skills.includes(s)) set({ skills: [...content.skills, s] });
    setSkillInput("");
  };

  const SkillsSection = (
    <div className="rp-section-panel">
      <SectionHeader title="Technical & Soft Skills" count={content.skills.length} />
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <input
          className="rp-input"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addSkill()}
          placeholder="Type a skill and press Enter…"
          style={{ ...inputBase, flex: 1, height: 36 }}
        />
        <button
          onClick={addSkill}
          style={{
            borderRadius: 7, padding: "0 14px", height: 36,
            fontSize: 12, fontWeight: 600,
            background: "#7c3aed", color: "white",
            border: "none", cursor: "pointer",
            letterSpacing: "0.02em",
            transition: "background 0.15s",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#6d28d9")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#7c3aed")}
        >
          Add
        </button>
      </div>

      {content.skills.length === 0 && (
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", textAlign: "center", padding: "20px 0" }}>
          No skills added yet
        </p>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        {content.skills.map((s) => (
          <span
            key={s}
            className="rp-skill-tag"
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              borderRadius: 6, padding: "5px 10px",
              fontSize: 12, fontWeight: 500,
              background: "rgba(139,92,246,0.1)",
              border: "1px solid rgba(139,92,246,0.2)",
              color: "#c4b5fd",
              letterSpacing: "0.01em",
            }}
          >
            {s}
            <button
              className="rp-skill-remove"
              onClick={() => set({ skills: content.skills.filter((x) => x !== s) })}
              style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", padding: 0, fontSize: 11, lineHeight: 1 }}
            >
              ✕
            </button>
          </span>
        ))}
      </div>
    </div>
  );

  // ── Projects ──────────────────────────────────────────────────────────────
  const addProject = () => set({
    projects: [...content.projects, { id: uuid(), name: "", description: "", url: "", tech: [] }],
  });
  const updateProject = (id: string, patch: Partial<ProjectItem>) =>
    set({ projects: content.projects.map((p) => p.id === id ? { ...p, ...patch } : p) });

  const ProjectsSection = (
    <div className="rp-section-panel">
      <SectionHeader title="Featured Projects" count={content.projects.length} />
      {content.projects.map((p) => (
        <Card key={p.id} onRemove={() => set({ projects: content.projects.filter((x) => x.id !== p.id) })}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Project Name" value={p.name} onChange={(v) => updateProject(p.id, { name: v })} placeholder="OpenResume" />
            <Field label="URL" value={p.url} onChange={(v) => updateProject(p.id, { url: v })} placeholder="github.com/..." />
          </div>
          <Field label="Description" value={p.description} onChange={(v) => updateProject(p.id, { description: v })} placeholder="What does it do, and what impact did it have?" multiline />
          <Field
            label="Tech Stack (comma separated)"
            value={p.tech.join(", ")}
            onChange={(v) => updateProject(p.id, { tech: v.split(",").map((t) => t.trim()).filter(Boolean) })}
            placeholder="React, TypeScript, Supabase"
          />
        </Card>
      ))}
      <AddButton label="Add project" onClick={addProject} />
    </div>
  );

  // ── Certifications ────────────────────────────────────────────────────────
  const addCert = () => set({
    certifications: [...content.certifications, { id: uuid(), name: "", issuer: "", date: "" }],
  });
  const updateCert = (id: string, patch: Partial<CertificationItem>) =>
    set({ certifications: content.certifications.map((c) => c.id === id ? { ...c, ...patch } : c) });

  const CertificationsSection = (
    <div className="rp-section-panel">
      <SectionHeader title="Credentials & Awards" count={content.certifications.length} />
      {content.certifications.map((c) => (
        <Card key={c.id} onRemove={() => set({ certifications: content.certifications.filter((x) => x.id !== c.id) })}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Certification" value={c.name} onChange={(v) => updateCert(c.id, { name: v })} placeholder="AWS Solutions Architect" />
            <Field label="Issuer" value={c.issuer} onChange={(v) => updateCert(c.id, { issuer: v })} placeholder="Amazon" />
          </div>
          <Field label="Date" value={c.date} onChange={(v) => updateCert(c.id, { date: v })} placeholder="2022" />
        </Card>
      ))}
      <AddButton label="Add certification" onClick={addCert} />
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
    <div style={{ fontFamily: "'DM Sans', 'Instrument Sans', sans-serif" }}>
      <style>{inputFocusStyle}</style>

      {/* ── Section nav ── */}
      <div style={{
        padding: "16px 16px 0",
        borderBottom: "1px solid rgba(255,255,255,0.055)",
        marginBottom: 0,
      }}>
        <div style={{ display: "flex", gap: 2, overflowX: "auto", paddingBottom: "1px", marginBottom: "-1px" }}>
          {SECTIONS.map((s) => {
            const isActive = active === s.key;
            return (
              <button
                key={s.key}
                onClick={() => setActive(s.key)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 12px 10px",
                  fontSize: 12, fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#c4b5fd" : "rgba(255,255,255,0.35)",
                  background: "none", border: "none", cursor: "pointer",
                  borderBottom: isActive ? "2px solid #7c3aed" : "2px solid transparent",
                  borderRadius: 0,
                  transition: "color 0.15s, border-color 0.15s",
                  whiteSpace: "nowrap",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
              >
                <span style={{ opacity: isActive ? 1 : 0.6 }}>{s.icon}</span>
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Active panel ── */}
      <div style={{ padding: "20px 18px 24px", overflowY: "auto" }}>
        {panels[active]}
      </div>
    </div>
  );
}
