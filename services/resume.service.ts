import { chatCompletion, type ChatMessage } from "@/lib/groq";
import { GROQ_MODELS } from "@/lib/constants";
import { connectDB } from "@/lib/mongodb";
import { Resume, type IResume } from "@/models/Resume";
import type { ResumeStructured } from "@/types";
import mongoose from "mongoose";

async function extractPdfText(buffer: Buffer): Promise<string> {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return result.text?.trim() ?? "";
  } finally {
    await parser.destroy();
  }
}

function buildStructurePrompt(rawText: string): ChatMessage[] {
  return [
    {
      role: "system",
      content: `Extract structured data from the resume text. Return ONLY valid JSON:
{
  "skills": ["skill1", "skill2"],
  "experience": ["brief role/company bullet", ...],
  "projects": ["project description", ...]
}
Be accurate. Use only information present in the resume.`,
    },
    {
      role: "user",
      content: rawText.slice(0, 12000),
    },
  ];
}

export async function parseAndStructureResume(
  rawText: string
): Promise<ResumeStructured> {
  if (!rawText || rawText.length < 50) {
    throw new Error("Resume text is too short or empty");
  }

  const content = await chatCompletion(buildStructurePrompt(rawText), {
    model: GROQ_MODELS.fast,
    temperature: 0.2,
    jsonMode: true,
  });

  const parsed = JSON.parse(content) as Omit<ResumeStructured, "rawText">;

  return {
    skills: Array.isArray(parsed.skills) ? parsed.skills : [],
    experience: Array.isArray(parsed.experience) ? parsed.experience : [],
    projects: Array.isArray(parsed.projects) ? parsed.projects : [],
    rawText,
  };
}

export async function createResumeFromPdf(
  userId: string,
  fileName: string,
  buffer: Buffer
): Promise<IResume> {
  await connectDB();

  const rawText = await extractPdfText(buffer);
  const structured = await parseAndStructureResume(rawText);

  const resume = await Resume.create({
    userId: new mongoose.Types.ObjectId(userId),
    fileName,
    ...structured,
  });

  return resume;
}

export function formatResumeForPrompt(resume: IResume | ResumeStructured): string {
  const skills = resume.skills?.join(", ") || "N/A";
  const experience = resume.experience?.map((e, i) => `${i + 1}. ${e}`).join("\n") || "N/A";
  const projects = resume.projects?.map((p, i) => `${i + 1}. ${p}`).join("\n") || "N/A";

  return `Skills: ${skills}

Experience:
${experience}

Projects:
${projects}

Full text excerpt:
${resume.rawText.slice(0, 4000)}`;
}

export async function getResumeById(
  resumeId: string,
  userId: string
): Promise<IResume | null> {
  await connectDB();
  return Resume.findOne({
    _id: new mongoose.Types.ObjectId(resumeId),
    userId: new mongoose.Types.ObjectId(userId),
  });
}

export async function listResumesForUser(userId: string): Promise<IResume[]> {
  await connectDB();
  return Resume.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({
    createdAt: -1,
  });
}
