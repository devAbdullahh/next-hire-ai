"use client";

import { useRef } from "react";
import { AvatarCard } from "@/components/avatars/AvatarCard";
import { INTERVIEWER_AVATARS } from "@/lib/interviewer-avatars";
import type { InterviewerAvatarId } from "@/types";

interface AvatarCarouselProps {
  selectedId: InterviewerAvatarId;
  onSelect: (id: InterviewerAvatarId) => void;
}

export function AvatarCarousel({ selectedId, onSelect }: AvatarCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollBy(direction: -1 | 1) {
    scrollRef.current?.scrollBy({ left: direction * 128, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-foreground">Choose your avatar</p>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            className="flex size-8 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-colors hover:border-accent/40 hover:text-foreground"
            aria-label="Scroll avatars left"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            className="flex size-8 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-colors hover:border-accent/40 hover:text-foreground"
            aria-label="Scroll avatars right"
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto px-0.5 py-0.5 scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {INTERVIEWER_AVATARS.map((avatar) => (
          <AvatarCard
            key={avatar.id}
            avatar={avatar}
            variant="carousel"
            selected={selectedId === avatar.id}
            onSelect={() => onSelect(avatar.id)}
          />
        ))}
      </div>
    </div>
  );
}
