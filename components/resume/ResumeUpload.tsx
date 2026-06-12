"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";

interface ParsedResume {
  id: string;
  fileName: string;
  skills: string[];
  experience: string[];
  projects: string[];
}

interface ResumeUploadProps {
  onUploaded: (resume: ParsedResume) => void;
  variant?: "card" | "inline";
}

function ResumePreview({
  preview,
  onCancel,
  onConfirm,
  showActions = true,
}: {
  preview: ParsedResume;
  onCancel?: () => void;
  onConfirm?: () => void;
  showActions?: boolean;
}) {
  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-subtle">
          Skills
        </p>
        <div className="flex flex-wrap gap-1.5">
          {preview.skills.length > 0 ? (
            preview.skills.map((s) => (
              <Badge key={s} variant="muted">
                {s}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted">None detected</span>
          )}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-subtle">
          Experience
        </p>
        <ul className="space-y-1.5 text-sm text-muted">
          {preview.experience.slice(0, 5).map((e, i) => (
            <li key={i} className="rounded-lg bg-surface-muted px-3 py-2">
              {e}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-subtle">
          Projects
        </p>
        <ul className="space-y-1.5 text-sm text-muted">
          {preview.projects.slice(0, 4).map((p, i) => (
            <li key={i} className="rounded-lg bg-surface-muted px-3 py-2">
              {p}
            </li>
          ))}
        </ul>
      </div>
      {showActions && onCancel && onConfirm && (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={onConfirm}>
            Use this resume
          </Button>
        </div>
      )}
    </div>
  );
}

export function ResumeUpload({ onUploaded, variant = "card" }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<ParsedResume | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isInline = variant === "inline";

  async function handleUpload(uploadFile?: File) {
    const target = uploadFile ?? file;
    if (!target) return;
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", target);

    try {
      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error ?? "Upload failed");
        return;
      }
      setPreview(json.data.resume);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function confirmUpload() {
    if (preview) {
      onUploaded(preview);
      setPreview(null);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") {
      setFile(dropped);
      handleUpload(dropped);
    } else {
      setError("Please drop a PDF file.");
    }
  }

  const dropzone = (
  <>
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={`cursor-pointer rounded-[10px] border-2 border-dashed text-center transition-colors ${
        isInline ? "px-4 py-6" : "px-6 py-10"
      } ${
        dragOver
          ? "border-accent bg-accent-soft"
          : "border-border-strong hover:border-accent/50 hover:bg-surface-muted"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0] ?? null;
          setFile(f);
          if (f) handleUpload(f);
        }}
      />
      <span
        className={`mx-auto mb-2 flex items-center justify-center rounded-full bg-accent-soft text-accent ${
          isInline ? "size-9" : "mb-3 size-12"
        }`}
      >
        <svg
          width={isInline ? 18 : 24}
          height={isInline ? 18 : 24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
        </svg>
      </span>
      <p className={`font-medium text-foreground ${isInline ? "text-sm" : ""}`}>
        {file ? file.name : "Drop your PDF here or click to browse"}
      </p>
      <p className={`mt-1 text-muted ${isInline ? "text-xs" : "text-sm"}`}>
        application/pdf · max 5MB
      </p>
    </div>

    {error && (
      <Alert variant="error" className="mt-3">
        {error}
      </Alert>
    )}

    {file && !loading && !isInline && (
      <Button className="mt-4" onClick={() => handleUpload()} loading={loading}>
        Parse resume
      </Button>
    )}
    {loading && (
      <p className={`text-muted ${isInline ? "mt-2 text-xs" : "mt-4 text-sm"}`}>
        Extracting and structuring your resume…
      </p>
    )}
  </>
  );

  if (isInline) {
    if (preview) {
      return (
        <ResumePreview
          preview={preview}
          onCancel={() => setPreview(null)}
          onConfirm={confirmUpload}
        />
      );
    }
    return dropzone;
  }

  return (
    <>
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Upload resume</CardTitle>
          <CardDescription>
            PDF only, up to 5MB. We extract skills, experience, and projects — stored in MongoDB.
          </CardDescription>
        </CardHeader>
        {dropzone}
      </Card>

      <Modal
        open={!!preview}
        onClose={() => setPreview(null)}
        title="Resume parsed successfully"
        description={preview?.fileName}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setPreview(null)}>
              Cancel
            </Button>
            <Button onClick={confirmUpload}>Add to library</Button>
          </>
        }
      >
        {preview && <ResumePreview preview={preview} showActions={false} />}
      </Modal>
    </>
  );
}
