import Image from "next/image";
import type { InterviewerAvatar } from "@/types";

interface InterviewerAvatarFaceProps {
  avatar: InterviewerAvatar;
  size?: "xs" | "sm" | "md" | "lg";
  speaking?: boolean;
  className?: string;
}

const sizes = {
  xs: { box: "size-20", text: "text-lg", img: 80 },
  sm: { box: "size-16", text: "text-xl", img: 64 },
  md: { box: "size-24 sm:size-28", text: "text-3xl sm:text-4xl", img: 112 },
  lg: { box: "size-32", text: "text-4xl", img: 128 },
};

export function InterviewerAvatarFace({
  avatar,
  size = "md",
  speaking = false,
  className = "",
}: InterviewerAvatarFaceProps) {
  const dim = sizes[size];

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 bg-gradient-to-br ${avatar.theme.gradient} ${dim.box} ${
        speaking
          ? `${avatar.theme.ring} ${avatar.theme.glow}`
          : "border-border"
      } ${className}`}
    >
      {avatar.imageSrc ? (
        <Image
          src={avatar.imageSrc}
          alt={avatar.name}
          width={dim.img}
          height={dim.img}
          className="size-full object-cover object-top"
          unoptimized
        />
      ) : (
        <span className={`font-semibold text-foreground/90 ${dim.text}`}>
          {avatar.theme.initials}
        </span>
      )}
      {speaking && (
        <span className="absolute -bottom-1 left-1/2 flex -translate-x-1/2 translate-y-1 gap-0.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="voice-bar !h-3 !w-0.5"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </span>
      )}
    </div>
  );
}
