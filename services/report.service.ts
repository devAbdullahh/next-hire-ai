import { chatCompletion } from "@/lib/groq";
import { connectDB } from "@/lib/mongodb";
import { InterviewSession } from "@/models/InterviewSession";
import type { InterviewReport } from "@/types";
import {
  buildFeedbackSystemPrompt,
  buildFeedbackUserPrompt,
} from "./prompts/feedback";
import { formatResumeForPrompt } from "./resume.service";
import type { IResume } from "@/models/Resume";
import type { IInterviewSession } from "@/models/InterviewSession";
import mongoose from "mongoose";

export async function generateFinalReport(
  session: IInterviewSession,
  resume: IResume
): Promise<InterviewReport> {
  const transcript = session.messages
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n\n");

  const scoresSummary = session.scores
    .map(
      (s, i) =>
        `Q${i + 1}: score=${s.score}/10 — ${s.justification}`
    )
    .join("\n");

  const hasJob = !!session.jobDescriptionText?.trim();

  const content = await chatCompletion(
    [
      { role: "system", content: buildFeedbackSystemPrompt(hasJob) },
      {
        role: "user",
        content: buildFeedbackUserPrompt(
          formatResumeForPrompt(resume),
          transcript,
          scoresSummary || "No scored answers yet.",
          session.jobDescriptionText
        ),
      },
    ],
    { temperature: 0.5, jsonMode: true }
  );

  return JSON.parse(content) as InterviewReport;
}

export async function finalizeSession(
  sessionId: string,
  userId: string,
  resume: IResume
): Promise<{ session: IInterviewSession; report: InterviewReport }> {
  await connectDB();

  const session = await InterviewSession.findOne({
    _id: new mongoose.Types.ObjectId(sessionId),
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (!session) {
    throw new Error("Session not found");
  }

  const report = await generateFinalReport(session, resume);

  session.status = "completed";
  session.report = report as unknown as Record<string, unknown>;
  await session.save();

  return { session, report };
}
