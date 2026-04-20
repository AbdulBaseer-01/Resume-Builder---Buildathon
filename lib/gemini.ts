// src/lib/gemini.ts
// All Gemini calls go through the /api/gemini route to keep the API key server-side.

import { ResumeContent } from "@/types/resume";

async function callGemini(payload: object): Promise<string> {
  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${err}`);
  }
  const data = await res.json();
  return data.text as string;
}

// ── 1. ATS Score & Feedback ───────────────────────────────────────────────────

export interface ATSResult {
  score: number;        // 0-100
  strengths: string[];
  improvements: string[];
  keywords: string[];   // missing keywords
}

export async function getATSScore(content: ResumeContent): Promise<ATSResult> {
  const prompt = `You are an expert ATS (Applicant Tracking System) analyzer.
Analyze the following resume JSON and return ONLY a JSON object (no markdown) with:
- "score": number 0-100
- "strengths": array of 3 short strings
- "improvements": array of 3-5 actionable short strings
- "keywords": array of 5 missing high-value keywords for this type of role

Resume:
${JSON.stringify(content, null, 2)}`;

  const raw = await callGemini({ prompt, json: true });
  try {
    return JSON.parse(raw) as ATSResult;
  } catch {
    return { score: 0, strengths: [], improvements: [raw], keywords: [] };
  }
}

// ── 2. AI Content Suggestions ─────────────────────────────────────────────────

export async function suggestSummary(
  name: string,
  role: string,
  skills: string[]
): Promise<string> {
  const prompt = `Write a compelling, concise professional summary (3-4 sentences) for a resume.
Name: ${name}
Target role: ${role}
Top skills: ${skills.slice(0, 8).join(", ")}
Return ONLY the summary text, no quotes, no preamble.`;

  return callGemini({ prompt });
}

export async function suggestBullets(
  role: string,
  company: string,
  existingBullets: string[]
): Promise<string[]> {
  const prompt = `Generate 4 strong, quantified resume bullet points for this work experience.
Role: ${role}
Company: ${company}
Existing bullets (for context): ${existingBullets.join(" | ")}
Return ONLY a JSON array of 4 strings. No markdown, no preamble.`;

  const raw = await callGemini({ prompt, json: true });
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [raw];
  }
}

export async function suggestSkills(
  role: string,
  existingSkills: string[]
): Promise<string[]> {
  const prompt = `Suggest 10 relevant technical and soft skills for this role that are missing from the list.
Target role: ${role}
Existing skills: ${existingSkills.join(", ")}
Return ONLY a JSON array of skill strings. No markdown, no preamble.`;

  const raw = await callGemini({ prompt, json: true });
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

// ── 3. Job Description Tailoring ──────────────────────────────────────────────

export interface TailoringResult {
  summaryRewrite: string;
  bulletRewrites: { original: string; improved: string }[];
  addKeywords: string[];
}

export async function tailorToJobDescription(
  content: ResumeContent,
  jobDescription: string
): Promise<TailoringResult> {
  const prompt = `You are an expert resume coach. Tailor the following resume to better match the job description.
Return ONLY a JSON object (no markdown) with:
- "summaryRewrite": rewritten summary optimized for this JD
- "bulletRewrites": array of {original, improved} objects for up to 5 experience bullets
- "addKeywords": array of 5 keywords from the JD to add to the resume

Job Description:
${jobDescription}

Resume:
${JSON.stringify(content, null, 2)}`;

  const raw = await callGemini({ prompt, json: true });
  try {
    return JSON.parse(raw) as TailoringResult;
  } catch {
    return { summaryRewrite: raw, bulletRewrites: [], addKeywords: [] };
  }
}

// ── 4. Grammar / Tone Improvement ────────────────────────────────────────────

export async function improveText(
  text: string,
  context: "summary" | "bullet" | "general"
): Promise<string> {
  const contextHint =
    context === "summary"
      ? "professional resume summary"
      : context === "bullet"
      ? "resume achievement bullet point (start with action verb, add metrics if possible)"
      : "resume section";

  const prompt = `Improve the following text for a ${contextHint}.
Fix grammar, strengthen word choice, make it more impactful.
Return ONLY the improved text, no quotes, no explanation.

Original: ${text}`;

  return callGemini({ prompt });
}