"use client";

import { useId } from "react";
import type { RadarAxis } from "@/lib/score-radar";

interface RadarChartProps {
  axes: RadarAxis[];
  size?: number;
  max?: number;
  showLabels?: boolean;
  showValues?: boolean;
  className?: string;
}

function polarPoint(
  cx: number,
  cy: number,
  radius: number,
  index: number,
  total: number
) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
    angle,
  };
}

export function RadarChart({
  axes,
  size = 220,
  max = 10,
  showLabels = true,
  showValues = true,
  className = "",
}: RadarChartProps) {
  const gradientId = useId();
  const n = axes.length;
  if (n < 3) return null;

  const pad = size * 0.22;
  const cx = pad + size / 2;
  const cy = pad + size / 2;
  const viewSize = size + pad * 2;
  const chartRadius = size * 0.32;
  const labelRadius = size * 0.44;

  const gridLevels = [0.25, 0.5, 0.75, 1];

  const dataPoints = axes.map((axis, i) => {
    const r = (Math.min(Math.max(axis.value, 0), max) / max) * chartRadius;
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      axis,
      i,
    };
  });

  const polygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${viewSize} ${viewSize}`}
      overflow="visible"
      className={className}
      role="img"
      aria-label={`Score breakdown: ${axes.map((a) => `${a.label} ${a.value}`).join(", ")}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0627a" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#f0627a" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {gridLevels.map((level) => {
        const r = chartRadius * level;
        const ring = Array.from({ length: n }, (_, i) => {
          const p = polarPoint(cx, cy, r, i, n);
          return `${p.x},${p.y}`;
        }).join(" ");
        return (
          <polygon
            key={level}
            points={ring}
            fill="none"
            stroke="#3f3a35"
            strokeWidth={1}
            opacity={level === 1 ? 0.9 : 0.5}
          />
        );
      })}

      {Array.from({ length: n }, (_, i) => {
        const end = polarPoint(cx, cy, chartRadius, i, n);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={end.x}
            y2={end.y}
            stroke="#3f3a35"
            strokeWidth={1}
            opacity={0.6}
          />
        );
      })}

      <polygon
        points={polygon}
        fill={`url(#${gradientId})`}
        stroke="#f0627a"
        strokeWidth={2}
        strokeLinejoin="round"
        className="transition-all duration-500 ease-out"
      />

      {dataPoints.map((p) => (
        <circle
          key={p.i}
          cx={p.x}
          cy={p.y}
          r={3.5}
          fill="#f0627a"
          stroke="#181614"
          strokeWidth={1.5}
        />
      ))}

      {showLabels &&
        axes.map((axis, i) => {
          const lp = polarPoint(cx, cy, labelRadius, i, n);
          const cos = Math.cos(lp.angle);
          const sin = Math.sin(lp.angle);
          const isTop = sin < -0.35;
          const isBottom = sin > 0.35;
          const textAnchor =
            cos > 0.35 ? "start" : cos < -0.35 ? "end" : "middle";
          const labelOffset = size * 0.03;
          const labelX =
            textAnchor === "start"
              ? lp.x + labelOffset
              : textAnchor === "end"
                ? lp.x - labelOffset
                : lp.x;
          const labelY = isTop
            ? lp.y - labelOffset
            : isBottom
              ? lp.y + labelOffset
              : lp.y;
          const valueY = isTop
            ? labelY + 11
            : isBottom
              ? labelY - 6
              : labelY + 10;

          return (
            <g key={axis.label}>
              <text
                x={labelX}
                y={labelY}
                textAnchor={textAnchor}
                dominantBaseline={
                  isTop ? "auto" : isBottom ? "hanging" : "middle"
                }
                className="fill-[#b5aea6] font-medium"
                style={{ fontSize: size < 160 ? 8 : 9 }}
              >
                {axis.label}
              </text>
              {showValues && (
                <text
                  x={labelX}
                  y={valueY}
                  textAnchor={textAnchor}
                  dominantBaseline="middle"
                  className="fill-[#f0627a] font-semibold"
                  style={{ fontSize: size < 160 ? 9 : 10 }}
                >
                  {axis.value}
                </text>
              )}
            </g>
          );
        })}
    </svg>
  );
}
