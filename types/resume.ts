
export type Template = "modern" | "classic" | "executive";

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  start: string;
  end: string;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  start: string;
  end: string;
  gpa: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  url: string;
  tech: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface ResumeContent {
  personal: PersonalInfo;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
}

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  template: Template;
  ats_score: number | null;
  content: ResumeContent;
  created_at: string;
  updated_at: string;
}

export const EMPTY_CONTENT: ResumeContent = {
  personal: {
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    summary: "",
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
};