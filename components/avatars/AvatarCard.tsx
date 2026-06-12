import { InterviewerAvatarFace } from "@/components/interview/InterviewerAvatarFace";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { InterviewerAvatar } from "@/types";

interface AvatarCardProps {
  avatar: InterviewerAvatar;
  variant?: "gallery" | "carousel";
  selected?: boolean;
  onSelect?: () => void;
  onPreviewVoice?: () => void;
  previewing?: boolean;
}

export function AvatarCard({
  avatar,
  variant = "gallery",
  selected = false,
  onSelect,
  onPreviewVoice,
  previewing = false,
}: AvatarCardProps) {
  if (variant === "carousel") {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={`flex w-[108px] shrink-0 snap-start flex-col items-center justify-center rounded-[var(--radius-card)] border px-3 py-4 text-center transition-all sm:w-[116px] ${
          selected
            ? "border-2 border-accent bg-accent-soft/30 shadow-elevated"
            : "border-border bg-surface hover:border-accent/40 hover:shadow-card"
        }`}
      >
        <InterviewerAvatarFace avatar={avatar} size="xs" />
        <p className="mt-3 text-sm font-medium text-foreground">{avatar.name}</p>
      </button>
    );
  }

  return (
    <div className="flex h-full flex-col items-center rounded-[var(--radius-card)] border border-border bg-surface p-5 text-center">
      <InterviewerAvatarFace avatar={avatar} size="md" />
      <h3 className="mt-4 font-semibold text-foreground">{avatar.name}</h3>
      <p className="text-xs text-accent">{avatar.role}</p>
      <p className="mt-2 text-sm text-muted">{avatar.tagline}</p>
      <div className="mt-3 flex flex-wrap justify-center gap-1">
        {avatar.traits.map((t) => (
          <Badge key={t} variant="muted" className="text-[10px]">
            {t}
          </Badge>
        ))}
      </div>
      {onPreviewVoice && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-4"
          loading={previewing}
          onClick={onPreviewVoice}
        >
          Preview voice
        </Button>
      )}
    </div>
  );
}
