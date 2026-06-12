"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { formatDateTime } from "@/lib/format";
import { MAX_JOB_DESCRIPTION_LENGTH } from "@/lib/constants";
import type { JobDescriptionItem } from "@/types";

interface TargetRolesClientProps {
  initialJobDescriptions: JobDescriptionItem[];
}

export function TargetRolesClient({
  initialJobDescriptions,
}: TargetRolesClientProps) {
  const [items, setItems] = useState(initialJobDescriptions);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [detailItem, setDetailItem] = useState<JobDescriptionItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<JobDescriptionItem | null>(null);

  const remaining = MAX_JOB_DESCRIPTION_LENGTH - rawText.length;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch("/api/job-descriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, company: company || undefined, rawText }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error ?? "Failed to save");
        return;
      }

      const jd = json.data.jobDescription as JobDescriptionItem;
      setItems((prev) => [jd, ...prev]);
      setTitle("");
      setCompany("");
      setRawText("");
      setSuccess(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setError("");
    setDeletingId(id);
    try {
      const res = await fetch(`/api/job-descriptions/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) {
        setError(json.error ?? "Failed to delete");
        return;
      }
      setItems((prev) => prev.filter((j) => j.id !== id));
      setConfirmDelete(null);
      if (detailItem?.id === id) setDetailItem(null);
    } catch {
      setError("Could not delete job description");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Add target role</CardTitle>
          <CardDescription>
            Paste a job description from LinkedIn, Indeed, or a company careers page.
            The AI will cross-reference it with your resume during interviews and evaluate role fit.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="jd-title" className="text-sm font-medium text-foreground">
                Role title
              </label>
              <input
                id="jd-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Senior Full Stack Engineer"
                className="w-full rounded-[10px] border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="jd-company" className="text-sm font-medium text-foreground">
                Company (optional)
              </label>
              <input
                id="jd-company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Acme Corp"
                className="w-full rounded-[10px] border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="jd-text" className="text-sm font-medium text-foreground">
              Job description
            </label>
            <textarea
              id="jd-text"
              value={rawText}
              onChange={(e) => {
                setRawText(e.target.value);
                setSuccess(false);
              }}
              required
              minLength={50}
              maxLength={MAX_JOB_DESCRIPTION_LENGTH}
              rows={12}
              placeholder="Paste the full job posting here — requirements, responsibilities, tech stack, qualifications..."
              className="w-full resize-y rounded-[10px] border border-border bg-surface px-3.5 py-3 text-sm text-foreground outline-none placeholder:text-subtle focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            <p className={`text-xs ${remaining < 500 ? "text-accent" : "text-subtle"}`}>
              {remaining} characters remaining · minimum 50
            </p>
          </div>

          {error && <Alert variant="error">{error}</Alert>}
          {success && (
            <Alert variant="success">Target role saved. Select it when starting an interview.</Alert>
          )}

          <Button type="submit" loading={loading} disabled={rawText.length < 50 || !title.trim()}>
            Save target role
          </Button>
        </form>
      </Card>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Saved roles</h2>
        {items.length === 0 ? (
          <Card variant="muted" className="py-12 text-center">
            <p className="text-muted">No target roles yet. Paste a job description above.</p>
          </Card>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {items.map((jd) => (
              <li key={jd.id}>
                <Card className="flex h-full flex-col transition-shadow hover:shadow-elevated">
                  <CardHeader className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="line-clamp-2 text-base">{jd.title}</CardTitle>
                      <span className="shrink-0 rounded-lg bg-accent-soft p-2 text-accent">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="7" width="20" height="14" rx="2" />
                          <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                        </svg>
                      </span>
                    </div>
                    {jd.company && (
                      <Badge variant="muted" className="mt-2 w-fit">
                        {jd.company}
                      </Badge>
                    )}
                    <CardDescription className="mt-2 line-clamp-3">
                      {jd.rawText.slice(0, 180)}…
                    </CardDescription>
                    <p className="mt-2 text-xs text-subtle">
                      Added {formatDateTime(jd.createdAt)}
                    </p>
                  </CardHeader>
                  <div className="mt-auto flex flex-wrap gap-2 border-t border-border pt-4">
                    <Button variant="secondary" size="sm" onClick={() => setDetailItem(jd)}>
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfirmDelete(jd)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Modal
        open={!!detailItem}
        onClose={() => setDetailItem(null)}
        title={detailItem?.title ?? "Target role"}
        description={detailItem?.company || undefined}
        size="lg"
        footer={
          <Button variant="ghost" onClick={() => setDetailItem(null)}>
            Close
          </Button>
        }
      >
        {detailItem && (
          <pre className="custom-scrollbar max-h-[24rem] overflow-y-auto whitespace-pre-wrap rounded-[10px] bg-surface-muted p-4 text-sm text-muted">
            {detailItem.rawText}
          </pre>
        )}
      </Modal>

      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete target role?"
        description={confirmDelete ? `"${confirmDelete.title}" will be removed permanently.` : undefined}
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              loading={!!deletingId}
              onClick={() => confirmDelete && handleDelete(confirmDelete.id)}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted">
          Past interviews that used this role will keep their snapshot. Only the saved listing is removed.
        </p>
      </Modal>
    </div>
  );
}
