"use client";

import { useId } from "react";

interface PlasmaWaveMarkProps {
  className?: string;
}

/** Closed ribbon bands — two parallel curves joined into one continuous thread. */
const THREADS = [
  {
    id: "a",
    d: "M-14 17 C6 9, 22 25, 40 15 S 72 7, 94 19 L94 23 C72 11, 40 21, 22 29 S6 13,-14 21 Z",
    gradient: ["#ff2d55", "#f0627a", "#ff4d6d"],
    className: "plasma-mark__thread--1",
  },
  {
    id: "b",
    d: "M-16 9 C4 21, 26 5, 46 17 S 78 27, 96 11 L96 15 C78 31, 46 21, 26 9 S4 25,-16 13 Z",
    gradient: ["#e11d48", "#fb7185", "#dc2626"],
    className: "plasma-mark__thread--2",
  },
  {
    id: "c",
    d: "M-12 25 C10 17, 30 31, 50 21 S 82 13, 96 25 L96 29 C82 17, 50 27, 30 35 S10 21,-12 29 Z",
    gradient: ["#b91c1c", "#f43f5e", "#ff6b6b"],
    className: "plasma-mark__thread--3",
  },
];

export function PlasmaWaveMark({ className = "" }: PlasmaWaveMarkProps) {
  const uid = useId().replace(/:/g, "");
  const filterId = `plasma-thread-soft-${uid}`;

  return (
    <div
      className={`plasma-mark relative h-9 w-16 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-[#080605] transition-colors group-hover:border-accent/35 ${className}`}
      aria-hidden
    >
      <svg
        className="plasma-mark__svg absolute inset-0 size-full"
        viewBox="0 0 80 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {THREADS.map((thread) => (
            <linearGradient
              key={thread.id}
              id={`plasma-thread-${thread.id}-${uid}`}
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="18"
              x2="80"
              y2="18"
            >
              <stop offset="0%" stopColor={thread.gradient[0]} stopOpacity="0.15" />
              <stop offset="22%" stopColor={thread.gradient[1]} stopOpacity="0.75" />
              <stop offset="50%" stopColor={thread.gradient[0]} stopOpacity="1" />
              <stop offset="78%" stopColor={thread.gradient[2]} stopOpacity="0.75" />
              <stop offset="100%" stopColor={thread.gradient[0]} stopOpacity="0.15" />
            </linearGradient>
          ))}
          <filter
            id={filterId}
            x="-15%"
            y="-15%"
            width="130%"
            height="130%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="0.35" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className="plasma-mark__threads" filter={`url(#${filterId})`}>
          {THREADS.map((thread) => (
            <g key={thread.id} className={`plasma-mark__thread ${thread.className}`}>
              <path
                d={thread.d}
                fill={`url(#plasma-thread-${thread.id}-${uid})`}
              />
            </g>
          ))}
        </g>
      </svg>

      <div className="plasma-mark__glow pointer-events-none absolute inset-0" />
      <div className="plasma-mark__vignette pointer-events-none absolute inset-0" />
    </div>
  );
}
