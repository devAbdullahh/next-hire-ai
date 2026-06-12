"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { StartInterviewModal } from "@/components/interview/StartInterviewModal";
import { InterviewsList, type InterviewListItem } from "./InterviewsList";
import type { InterviewConfig, JobDescriptionItem } from "@/types";
import type { ResumeListItem } from "@/types/resume";

interface InterviewsClientProps {
  interviews: InterviewListItem[];
  initialResumes: ResumeListItem[];
  initialJobDescriptions: JobDescriptionItem[];
  interviewConfig: InterviewConfig;
}

export function InterviewsClient({
  interviews,
  initialResumes,
  initialJobDescriptions,
  interviewConfig,
}: InterviewsClientProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [resumes, setResumes] = useState(initialResumes);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {interviews.length > 0
            ? `${interviews.length} session${interviews.length !== 1 ? "s" : ""}`
            : "No sessions yet"}
        </p>
        <Button onClick={() => setModalOpen(true)}>Start new interview</Button>
      </div>

      <InterviewsList
        interviews={interviews}
        onStartNew={() => setModalOpen(true)}
      />

      <StartInterviewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        resumes={resumes}
        onResumeAdded={(resume) => setResumes((prev) => [resume, ...prev])}
        jobDescriptions={initialJobDescriptions}
        interviewConfig={interviewConfig}
      />
    </>
  );
}
