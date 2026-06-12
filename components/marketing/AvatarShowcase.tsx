"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { INTERVIEWER_AVATARS } from "@/lib/interviewer-avatars";
import type { InterviewerAvatar } from "@/types";

function MarqueeCard({
  avatar,
  floatDelay,
}: {
  avatar: InterviewerAvatar;
  floatDelay: string;
}) {
  return (
    <article
      className="avatar-showcase-card group relative w-[260px] shrink-0 sm:w-[280px]"
      style={{ animationDelay: floatDelay }}
    >
      <div
        className={`relative overflow-hidden rounded-[var(--radius-card)] border border-border/80 bg-surface/90 p-5 shadow-card backdrop-blur-sm transition-all duration-300 group-hover:border-accent/50 group-hover:shadow-elevated`}
      >
        <div
          className={`pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-gradient-to-br opacity-40 blur-2xl transition-opacity group-hover:opacity-70 ${avatar.theme.gradient}`}
          aria-hidden
        />

        <div className="relative flex flex-col items-center text-center">
          <div
            className={`relative size-20 overflow-hidden rounded-full border-2 bg-gradient-to-br shadow-lg transition-transform duration-300 group-hover:scale-105 ${avatar.theme.gradient} ${avatar.theme.ring}`}
          >
            <Image
              src={avatar.imageSrc}
              alt={avatar.name}
              width={80}
              height={80}
              className="size-full object-cover object-top"
              unoptimized
            />
            <span className="absolute bottom-1 right-1 flex size-5 items-center justify-center rounded-full border border-border bg-surface text-[10px] text-accent opacity-0 transition-opacity group-hover:opacity-100">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
              </svg>
            </span>
          </div>

          <h3 className="mt-4 text-base font-semibold text-foreground">{avatar.name}</h3>
          <p className="text-xs font-medium text-accent">{avatar.role}</p>
          <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-xs leading-relaxed text-muted">
            {avatar.tagline}
          </p>

          <div className="mt-3 flex flex-wrap justify-center gap-1">
            {avatar.traits.slice(0, 2).map((trait) => (
              <Badge key={trait} variant="muted" className="text-[10px]">
                {trait}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function MarqueeRow({
  avatars,
  reverse = false,
  speed = "slow",
}: {
  avatars: InterviewerAvatar[];
  reverse?: boolean;
  speed?: "slow" | "slower";
}) {
  const loop = [...avatars, ...avatars];

  return (
    <div className="avatar-marquee-mask relative flex overflow-hidden py-3">
      <div
        className={`avatar-marquee-track flex gap-5 ${reverse ? "avatar-marquee-track--reverse" : ""} ${speed === "slower" ? "avatar-marquee-track--slower" : ""}`}
      >
        {loop.map((avatar, i) => (
          <MarqueeCard
            key={`${avatar.id}-${i}`}
            avatar={avatar}
            floatDelay={`${(i % avatars.length) * 0.35}s`}
          />
        ))}
      </div>
    </div>
  );
}

export function AvatarShowcase() {
  const rowA = INTERVIEWER_AVATARS;
  const rowB = [...INTERVIEWER_AVATARS].reverse();

  return (
    <div className="avatar-showcase relative mt-12 w-full">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-64 w-[min(100%,48rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />

      <div className="relative z-[1] space-y-2">
        <MarqueeRow avatars={rowA} speed="slow" />
        <MarqueeRow avatars={rowB} reverse speed="slower" />
      </div>

      <p className="relative z-[1] mt-6 text-center text-xs text-subtle">
        Hover to pause · Pick any avatar when you start an interview
      </p>
    </div>
  );
}
