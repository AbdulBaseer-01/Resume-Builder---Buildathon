// src/app/dashboard/[id]/components/templates/ModernTemplate.tsx
import { ResumeContent } from "@/types/resume";

interface Props { content: ResumeContent; }

export function ModernTemplate({ content }: Props) {
  const { personal, experience, education, skills, projects, certifications } = content;

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", background: "#fff", minHeight: "1123px", padding: "48px 52px", color: "#1a1a1a", fontSize: 13 }}>
      {/* Header */}
      <div style={{ borderBottom: "2.5px solid #7c3aed", paddingBottom: 20, marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: "-0.02em", color: "#111" }}>
          {personal.name || "Your Name"}
        </h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", marginTop: 8, fontSize: 11.5, color: "#555" }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
          {personal.website && <span>{personal.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {personal.summary && (
        <Section title="Summary" accentColor="#7c3aed">
          <p style={{ margin: 0, lineHeight: 1.65, color: "#333" }}>{personal.summary}</p>
        </Section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <Section title="Experience" accentColor="#7c3aed">
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: 13.5 }}>{exp.role}</span>
                  {exp.company && <span style={{ color: "#555", marginLeft: 6 }}>— {exp.company}</span>}
                </div>
                <span style={{ fontSize: 11, color: "#888", whiteSpace: "nowrap" }}>
                  {exp.start}{exp.end ? ` – ${exp.end}` : ""}
                </span>
              </div>
              <ul style={{ margin: "6px 0 0 16px", padding: 0, lineHeight: 1.6 }}>
                {exp.bullets.filter(Boolean).map((b, i) => (
                  <li key={i} style={{ marginBottom: 3, color: "#333" }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <Section title="Education" accentColor="#7c3aed">
          {education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <span style={{ fontWeight: 700 }}>{edu.degree}</span>
                  {edu.institution && <span style={{ color: "#555", marginLeft: 6 }}>— {edu.institution}</span>}
                </div>
                <span style={{ fontSize: 11, color: "#888" }}>{edu.start}{edu.end ? ` – ${edu.end}` : ""}</span>
              </div>
              {edu.gpa && <p style={{ margin: "2px 0 0", fontSize: 11, color: "#777" }}>GPA: {edu.gpa}</p>}
            </div>
          ))}
        </Section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <Section title="Skills" accentColor="#7c3aed">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 8px" }}>
            {skills.map((s) => (
              <span key={s} style={{ background: "#f3f0ff", border: "1px solid #ddd6fe", borderRadius: 4, padding: "2px 8px", fontSize: 11, color: "#5b21b6", fontWeight: 600 }}>
                {s}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <Section title="Projects" accentColor="#7c3aed">
          {projects.map((p) => (
            <div key={p.id} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700 }}>{p.name}</span>
                {p.url && <span style={{ fontSize: 11, color: "#7c3aed" }}>{p.url}</span>}
              </div>
              {p.description && <p style={{ margin: "4px 0", color: "#444", lineHeight: 1.55 }}>{p.description}</p>}
              {p.tech.length > 0 && (
                <p style={{ margin: 0, fontSize: 11, color: "#888" }}>{p.tech.join(" · ")}</p>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <Section title="Certifications" accentColor="#7c3aed">
          {certifications.map((c) => (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontWeight: 600 }}>{c.name}{c.issuer ? ` — ${c.issuer}` : ""}</span>
              <span style={{ fontSize: 11, color: "#888" }}>{c.date}</span>
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({ title, accentColor, children }: { title: string; accentColor: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <h2 style={{ fontSize: 10.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: accentColor, margin: "0 0 10px" }}>
        {title}
      </h2>
      {children}
    </div>
  );
}