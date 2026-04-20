// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import { Resume, ResumeContent, Template, EMPTY_CONTENT } from "@/types/resume";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Auth helpers ──────────────────────────────────────────────────────────────

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// ── Resume CRUD ───────────────────────────────────────────────────────────────

export async function fetchResumes(userId: string): Promise<Resume[]> {
  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data as Resume[];
}

export async function fetchResume(id: string): Promise<Resume> {
  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Resume;
}

export async function createResume(
  userId: string,
  title = "Untitled Resume",
  template: Template = "modern"
): Promise<Resume> {
  const { data, error } = await supabase
    .from("resumes")
    .insert({
      user_id: userId,
      title,
      template,
      content: EMPTY_CONTENT,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Resume;
}

export async function updateResume(
  id: string,
  patch: Partial<Pick<Resume, "title" | "template" | "content" | "ats_score">>
): Promise<Resume> {
  const { data, error } = await supabase
    .from("resumes")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Resume;
}

export async function deleteResume(id: string): Promise<void> {
  const { error } = await supabase.from("resumes").delete().eq("id", id);
  if (error) throw error;
}

// ── Convenience: save just the content blob ───────────────────────────────────

export async function saveResumeContent(
  id: string,
  content: ResumeContent
): Promise<void> {
  const { error } = await supabase
    .from("resumes")
    .update({ content })
    .eq("id", id);

  if (error) throw error;
}