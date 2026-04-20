// src/app/dashboard/[id]/components/templates/ClassicTemplate.tsx
import { ResumeContent } from "@/types/resume";

interface Props { content: ResumeContent; }

export function ClassicTemplate({ content }: Props) {
  const { personal, experience, education, skills, projects, certifications } = content;

  return (
    <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", background: "#fff", minHeight: "1123px", padding: "52px 56px", color: "#1a1a1a", fontSize: 13 }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 6px", letterSpacing: "0.03em", textTransform: "uppercase" }}>
          {personal.name || "Your Name"}
        </h1>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "4px 12px", fontSize: 11.5, color: "#444" }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>• {personal.phone}</span>}
          {personal.location && <span>• {personal.location}</span>}
          {personal.linkedin && <span>• {personal.linkedin}</span>}
          {personal.website && <span>• {personal.website}</span>}
        </div>
      </div>

      {personal.summary && (
        <ClassicSection title="Professional Summary">
          <p style={{ margin: 0, lineHeight: 1.7, textAlign: "justify" }}>{personal.summary}</p>
        </ClassicSection>
      )}

      {experience.length > 0 && (
        <ClassicSection title="Professional Experience">
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, fontSize: 13.5 }}>{exp.company}</span>
                <span style={{ fontSize: 11.5, color: "#555", fontStyle: "italic" }}>
                  {exp.start}{exp.end ? ` – ${exp.end}` : ""}
                </span>
              </div>
              <div style={{ fontStyle: "italic", color: "#444", marginBottom: 5 }}>{exp.role}</div>
              <ul style={{ margin: "0 0 0 18px", padding: 0, lineHeight: 1.65 }}>
                {exp.bullets.filter(Boolean).map((b, i) => (
                  <li key={i} style={{ marginBottom: 3 }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </ClassicSection>
      )}

      {education.length > 0 && (
        <ClassicSection title="Education">
          {education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700 }}>{edu.institution}</span>
                <span style={{ fontSize: 11.5, fontStyle: "italic", color: "#555" }}>{edu.start}{edu.end ? ` – ${edu.end}` : ""}</span>
              </div>
              <div style={{ color: "#444" }}>{edu.degree}{edu.gpa ? ` | GPA: ${edu.gpa}` : ""}</div>
            </div>
          ))}
        </ClassicSection>
      )}

      {skills.length > 0 && (
        <ClassicSection title="Skills">
          <p style={{ margin: 0, lineHeight: 1.8 }}>{skills.join(" • ")}</p>
        </ClassicSection>
      )}

      {projects.length > 0 && (
        <ClassicSection title="Projects">
          {projects.map((p) => (
            <div key={p.id} style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 700 }}>{p.name}{p.url ? ` — ${p.url}` : ""}</div>
              {p.description && <p style={{ margin: "3px 0", color: "#444", lineHeight: 1.6 }}>{p.description}</p>}
              {p.tech.length > 0 && <p style={{ margin: 0, fontSize: 11.5, fontStyle: "italic", color: "#666" }}>{p.tech.join(", ")}</p>}
            </div>
          ))}
        </ClassicSection>
      )}

      {certifications.length > 0 && (
        <ClassicSection title="Certifications">
          {certifications.map((c) => (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span>{c.name}{c.issuer ? ` — ${c.issuer}` : ""}</span>
              <span style={{ fontSize: 11.5, color: "#666", fontStyle: "italic" }}>{c.date}</span>
            </div>
          ))}
        </ClassicSection>
      )}
    </div>
  );
}

function ClassicSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <h2 style={{
        fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
        borderBottom: "1.5px solid #1a1a1a", paddingBottom: 4, margin: "0 0 12px",
      }}>
        {title}
      </h2>
      {children}
    </div>
  );
}