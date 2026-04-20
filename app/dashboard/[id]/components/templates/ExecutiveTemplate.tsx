// src/app/dashboard/[id]/components/templates/ExecutiveTemplate.tsx
import { ResumeContent } from "@/types/resume";

interface Props { content: ResumeContent; }

export function ExecutiveTemplate({ content }: Props) {
  const { personal, experience, education, skills, projects, certifications } = content;

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", background: "#fff", minHeight: "1123px", display: "flex", fontSize: 12 }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: "#1e293b", padding: "40px 22px", color: "#fff", flexShrink: 0 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 4px", lineHeight: 1.2, color: "#fff" }}>
            {personal.name || "Your Name"}
          </h1>
          <div style={{ width: 28, height: 2, background: "#38bdf8", marginBottom: 12 }} />
          {[personal.email, personal.phone, personal.location, personal.linkedin, personal.website].filter(Boolean).map((v, i) => (
            <p key={i} style={{ margin: "0 0 5px", fontSize: 10.5, color: "#94a3b8", wordBreak: "break-all" }}>{v}</p>
          ))}
        </div>

        {skills.length > 0 && (
          <SideSection title="Skills">
            {skills.map((s) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#38bdf8", flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: "#e2e8f0" }}>{s}</span>
              </div>
            ))}
          </SideSection>
        )}

        {education.length > 0 && (
          <SideSection title="Education">
            {education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: 12 }}>
                <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: 11, color: "#e2e8f0" }}>{edu.institution}</p>
                <p style={{ margin: "0 0 2px", fontSize: 10.5, color: "#94a3b8" }}>{edu.degree}</p>
                <p style={{ margin: 0, fontSize: 10, color: "#64748b" }}>{edu.start}{edu.end ? `–${edu.end}` : ""}{edu.gpa ? ` · GPA ${edu.gpa}` : ""}</p>
              </div>
            ))}
          </SideSection>
        )}

        {certifications.length > 0 && (
          <SideSection title="Certifications">
            {certifications.map((c) => (
              <div key={c.id} style={{ marginBottom: 8 }}>
                <p style={{ margin: "0 0 1px", fontSize: 11, fontWeight: 600, color: "#e2e8f0" }}>{c.name}</p>
                <p style={{ margin: 0, fontSize: 10, color: "#64748b" }}>{c.issuer}{c.date ? ` · ${c.date}` : ""}</p>
              </div>
            ))}
          </SideSection>
        )}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "40px 40px 40px 36px" }}>
        {personal.summary && (
          <MainSection title="Summary">
            <p style={{ margin: 0, lineHeight: 1.7, color: "#374151" }}>{personal.summary}</p>
          </MainSection>
        )}

        {experience.length > 0 && (
          <MainSection title="Experience">
            {experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: 13, color: "#111827" }}>{exp.role}</span>
                    {exp.company && <span style={{ fontSize: 12, color: "#6b7280", marginLeft: 6 }}>@ {exp.company}</span>}
                  </div>
                  <span style={{ fontSize: 11, color: "#9ca3af", whiteSpace: "nowrap" }}>
                    {exp.start}{exp.end ? ` – ${exp.end}` : ""}
                  </span>
                </div>
                <ul style={{ margin: "6px 0 0 16px", padding: 0, lineHeight: 1.65 }}>
                  {exp.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} style={{ marginBottom: 3, color: "#374151" }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </MainSection>
        )}

        {projects.length > 0 && (
          <MainSection title="Projects">
            {projects.map((p) => (
              <div key={p.id} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 700, color: "#111827" }}>{p.name}</span>
                  {p.url && <span style={{ fontSize: 10.5, color: "#38bdf8" }}>{p.url}</span>}
                </div>
                {p.description && <p style={{ margin: "3px 0", color: "#4b5563", lineHeight: 1.6 }}>{p.description}</p>}
                {p.tech.length > 0 && <p style={{ margin: 0, fontSize: 10.5, color: "#9ca3af" }}>{p.tech.join(" · ")}</p>}
              </div>
            ))}
          </MainSection>
        )}
      </div>
    </div>
  );
}

function SideSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <p style={{ margin: "0 0 10px", fontSize: 9.5, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#38bdf8" }}>{title}</p>
      {children}
    </div>
  );
}

function MainSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1e293b" }}>{title}</h2>
        <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
      </div>
      {children}
    </div>
  );
}