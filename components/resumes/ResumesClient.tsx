"use client";

import { useState } from "react";
import { ResumeUpload } from "@/components/resume/ResumeUpload";
import { StartInterviewModal } from "@/components/interview/StartInterviewModal";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import type { InterviewConfig, JobDescriptionItem } from "@/types";
import type { ResumeListItem } from "@/types/resume";

interface ResumesClientProps {
  initialResumes: ResumeListItem[];
  initialJobDescriptions: JobDescriptionItem[];
  interviewConfig: InterviewConfig;
}

export function ResumesClient({
  initialResumes,
  initialJobDescriptions,
  interviewConfig,
}: ResumesClientProps) {
  const [resumes, setResumes] = useState(initialResumes);
  const [startModalOpen, setStartModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadModalKey, setUploadModalKey] = useState(0);
  const [defaultResumeId, setDefaultResumeId] = useState<string | undefined>();
  const [detailResume, setDetailResume] = useState<ResumeListItem | null>(null);

  function openStartInterview(resumeId?: string) {
    setDefaultResumeId(resumeId);
    setStartModalOpen(true);
  }

  function openUploadModal() {
    setUploadModalKey((k) => k + 1);
    setUploadModalOpen(true);
  }

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-foreground">Library</h2>
          <Button onClick={openUploadModal}>Upload resume</Button>
        </div>
        {resumes.length === 0 ? (
          <Card variant="muted" className="py-12 text-center">
            <p className="text-muted">No resumes yet. Upload your first PDF to get started.</p>
            <Button className="mt-6" onClick={openUploadModal}>
              Upload resume
            </Button>
          </Card>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {resumes.map((r) => (
              <li key={r.id}>
                <Card className="flex h-full flex-col transition-shadow hover:shadow-elevated">
                  <CardHeader className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="line-clamp-1">{r.fileName}</CardTitle>
                      <span className="shrink-0 rounded-lg bg-accent-soft p-2 text-accent">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        </svg>
                      </span>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {r.skills.slice(0, 5).join(" · ") || "No skills extracted"}
                    </CardDescription>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {r.skills.slice(0, 3).map((s) => (
                        <Badge key={s} variant="muted">{s}</Badge>
                      ))}
                      {r.skills.length > 3 && (
                        <Badge variant="outline">+{r.skills.length - 3}</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <div className="mt-auto flex flex-wrap gap-2 border-t border-border pt-4">
                    <Button variant="secondary" size="sm" onClick={() => setDetailResume(r)}>
                      Details
                    </Button>
                    <Button size="sm" onClick={() => openStartInterview(r.id)}>
                      Start interview
                    </Button>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Modal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload resume"
        description="PDF only, up to 5MB. We extract skills, experience, and projects."
        size="lg"
        footer={
          <Button variant="ghost" onClick={() => setUploadModalOpen(false)}>
            Close
          </Button>
        }
      >
        {uploadModalOpen && (
          <ResumeUpload
            key={uploadModalKey}
            variant="inline"
            onUploaded={(resume) => {
              setResumes((prev) => [resume, ...prev]);
              setUploadModalOpen(false);
            }}
          />
        )}
      </Modal>

      <StartInterviewModal
        open={startModalOpen}
        onClose={() => {
          setStartModalOpen(false);
          setDefaultResumeId(undefined);
        }}
        resumes={resumes}
        onResumeAdded={(resume) => setResumes((prev) => [resume, ...prev])}
        jobDescriptions={initialJobDescriptions}
        interviewConfig={interviewConfig}
        defaultResumeId={defaultResumeId}
      />

      <Modal
        open={!!detailResume}
        onClose={() => setDetailResume(null)}
        title={detailResume?.fileName ?? "Resume"}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDetailResume(null)}>Close</Button>
            {detailResume && (
              <Button onClick={() => {
                openStartInterview(detailResume.id);
                setDetailResume(null);
              }}>
                Start interview
              </Button>
            )}
          </>
        }
      >
        {detailResume && (
          <div className="space-y-5">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-subtle">Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {detailResume.skills.map((s) => (
                  <Badge key={s} variant="muted">{s}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-subtle">Experience</p>
              <ul className="max-h-40 space-y-1.5 overflow-y-auto custom-scrollbar text-sm text-muted">
                {detailResume.experience.map((e, i) => (
                  <li key={i} className="rounded-lg bg-surface-muted px-3 py-2">{e}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-subtle">Projects</p>
              <ul className="max-h-32 space-y-1.5 overflow-y-auto custom-scrollbar text-sm text-muted">
                {detailResume.projects.map((p, i) => (
                  <li key={i} className="rounded-lg bg-surface-muted px-3 py-2">{p}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
