import { connectDB } from "@/lib/mongodb";
import { MAX_JOB_DESCRIPTION_LENGTH } from "@/lib/constants";
import { JobDescription, type IJobDescription } from "@/models/JobDescription";
import mongoose from "mongoose";

export function formatJobDescriptionForPrompt(jd: {
  title: string;
  company?: string;
  rawText: string;
}): string {
  const header = jd.company
    ? `Role: ${jd.title} at ${jd.company}`
    : `Role: ${jd.title}`;
  return `${header}\n\n${jd.rawText.slice(0, 6000)}`;
}

export function formatJobDescriptionLabel(jd: {
  title: string;
  company?: string;
}): string {
  return jd.company ? `${jd.title} · ${jd.company}` : jd.title;
}

export async function createJobDescription(
  userId: string,
  data: { title: string; company?: string; rawText: string }
): Promise<IJobDescription> {
  await connectDB();

  const rawText = data.rawText.trim();
  if (rawText.length < 50) {
    throw new Error("Job description is too short");
  }
  if (rawText.length > MAX_JOB_DESCRIPTION_LENGTH) {
    throw new Error(
      `Job description must be under ${MAX_JOB_DESCRIPTION_LENGTH} characters`
    );
  }
  if (!data.title.trim()) {
    throw new Error("Role title is required");
  }

  return JobDescription.create({
    userId: new mongoose.Types.ObjectId(userId),
    title: data.title.trim(),
    company: data.company?.trim() ?? "",
    rawText,
  });
}

export async function getJobDescriptionById(
  jobDescriptionId: string,
  userId: string
): Promise<IJobDescription | null> {
  await connectDB();
  return JobDescription.findOne({
    _id: new mongoose.Types.ObjectId(jobDescriptionId),
    userId: new mongoose.Types.ObjectId(userId),
  });
}

export async function listJobDescriptionsForUser(
  userId: string
): Promise<IJobDescription[]> {
  await connectDB();
  return JobDescription.find({
    userId: new mongoose.Types.ObjectId(userId),
  }).sort({ updatedAt: -1 });
}

export async function deleteJobDescription(
  jobDescriptionId: string,
  userId: string
): Promise<boolean> {
  await connectDB();
  const result = await JobDescription.deleteOne({
    _id: new mongoose.Types.ObjectId(jobDescriptionId),
    userId: new mongoose.Types.ObjectId(userId),
  });
  return result.deletedCount > 0;
}
