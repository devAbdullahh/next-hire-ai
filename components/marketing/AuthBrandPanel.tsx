import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { GradientMesh } from "./GradientMesh";
import { VoiceWavePreview } from "./VoiceWavePreview";
import { INTERVIEWER_AVATARS } from "@/lib/interviewer-avatars";

const highlights = ["Resume-driven", "AI avatars", "Scored reports"];

export function AuthBrandPanel() {
  const avatar = INTERVIEWER_AVATARS[0];

  return (
    <GradientMesh className="relative hidden items-center justify-center overflow-hidden border-r border-border px-8 py-6 lg:flex xl:px-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-1/3 size-56 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="relative z-10 w-full max-w-md space-y-5">
        <div className="animate-in space-y-4">
          <Badge variant="accent" className="gap-2">
            <span className="size-1.5 rounded-full bg-accent pulse-dot" />
            AI voice mock interviews
          </Badge>
          <h1 className="text-3xl font-bold leading-[1.12] tracking-tight text-foreground xl:text-[2.125rem]">
            Practice like it&apos;s real — with{" "}
            <span className="text-gradient">your resume & avatar</span>
          </h1>
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            Upload a resume, pick an interviewer, and run a live voice mock
            interview with scored feedback.
          </p>
          <div className="flex flex-wrap gap-2">
            {highlights.map((label) => (
              <span
                key={label}
                className="rounded-full border border-border bg-surface/60 px-2.5 py-1 text-xs text-muted"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="animate-in animate-in-delay-2">
          <div className="glow-border rounded-[var(--radius-card)] bg-surface p-1 shadow-elevated">
            <div className="overflow-hidden rounded-[calc(var(--radius-card)-4px)] bg-[#12100e]">
              <div className="grid grid-cols-2">
                <div className="flex flex-col items-center border-r border-border bg-[#1a1714] p-4">
                  <div
                    className={`relative size-14 overflow-hidden rounded-full border-2 ${avatar.theme.ring}`}
                  >
                    <Image
                      src={avatar.imageSrc}
                      alt={avatar.name}
                      width={56}
                      height={56}
                      className="size-full object-cover object-top"
                      unoptimized
                    />
                  </div>
                  <p className="mt-2.5 text-sm font-medium text-foreground">
                    {avatar.name}
                  </p>
                  <p className="text-[11px] text-accent">{avatar.role}</p>
                  <p className="mt-2.5 line-clamp-2 text-center text-[11px] leading-relaxed text-muted">
                    How does authentication work in web apps? Walk me through the
                    different types.
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center bg-[#141210] p-4">
                  <div className="flex size-14 items-center justify-center rounded-full border-2 border-border bg-surface-muted text-base font-semibold text-foreground/80">
                    You
                  </div>
                  <p className="mt-2.5 text-[11px] text-subtle">Your turn</p>
                  <div className="mt-3 w-full rounded-[10px] border border-border bg-surface px-3 py-2">
                    <VoiceWavePreview />
                    <p className="mt-1.5 text-center text-[11px] text-accent">
                      Listening…
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-border bg-surface-muted px-3 py-2.5">
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="px-2 py-0 text-[10px]">
                    Senior SWE · Acme
                  </Badge>
                  <Badge variant="muted" className="px-2 py-0 text-[10px]">
                    8 questions
                  </Badge>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-sm font-bold text-accent">7.6</span>
                  <Badge variant="success" className="px-2 py-0 text-[10px]">
                    Live
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GradientMesh>
  );
}
