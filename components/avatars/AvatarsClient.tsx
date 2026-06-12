"use client";

import { useEffect, useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { AvatarCard } from "@/components/avatars/AvatarCard";
import { INTERVIEWER_AVATARS } from "@/lib/interviewer-avatars";
import { ensureVoicesLoaded, speakText, stopSpeaking } from "@/lib/speech";
import type { InterviewerAvatar } from "@/types";

export function AvatarsClient() {
  const [previewing, setPreviewing] = useState<string | null>(null);

  useEffect(() => {
    void ensureVoicesLoaded();
  }, []);

  async function previewVoice(avatar: InterviewerAvatar) {
    stopSpeaking();
    setPreviewing(avatar.id);
    await ensureVoicesLoaded();
    void speakText(avatar.sampleLine, {
      avatarId: avatar.id,
      onEnd: () => setPreviewing(null),
      onStart: () => setPreviewing(avatar.id),
    });
  }

  return (
    <div className="space-y-6">
      <Card variant="muted">
        <CardHeader className="mb-0">
          <CardTitle className="text-base">Meet the avatars</CardTitle>
          <CardDescription>
            Each avatar has a unique voice and interviewing style. You pick one
            when you start an interview — every session can use a different avatar.
          </CardDescription>
        </CardHeader>
      </Card>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {INTERVIEWER_AVATARS.map((avatar) => (
          <li key={avatar.id}>
            <AvatarCard
              avatar={avatar}
              previewing={previewing === avatar.id}
              onPreviewVoice={() => previewVoice(avatar)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
