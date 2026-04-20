"use client";
// src/app/dashboard/[id]/components/PreviewPanel.tsx

import { Resume } from "@/types/resume";
import { ModernTemplate } from "./templates/ModernTemplate";
import { ClassicTemplate } from "./templates/ClassicTemplate";
import { ExecutiveTemplate } from "./templates/ExecutiveTemplate";

interface Props {
  resume: Resume;
}

export function PreviewPanel({ resume }: Props) {
  return (
    <div
      className=" shadow-2xl overflow-hidden"
      style={{
        boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
        minHeight: "1123px",
      }}
    >
      {resume.template === "modern" && <ModernTemplate content={resume.content} />}
      {resume.template === "classic" && <ClassicTemplate content={resume.content} />}
      {resume.template === "executive" && <ExecutiveTemplate content={resume.content} />}
    </div>
  );
}