import type { AnswerScore } from "@/types";

export interface RadarAxis {
  label: string;
  value: number;
  max?: number;
}

export const SCORE_RADAR_AXES: {
  key: keyof Pick<
    AnswerScore,
    "technicalCorrectness" | "depth" | "clarity" | "confidence"
  >;
  label: string;
}[] = [
  { key: "technicalCorrectness", label: "Technical" },
  { key: "depth", label: "Depth" },
  { key: "clarity", label: "Clarity" },
  { key: "confidence", label: "Communication" },
];

export function answerScoreToRadarAxes(score: AnswerScore): RadarAxis[] {
  return SCORE_RADAR_AXES.map(({ key, label }) => ({
    label,
    value: score[key] as number,
    max: 10,
  }));
}

export function averageScoresToRadarAxes(
  scores: AnswerScore[]
): RadarAxis[] | null {
  if (scores.length === 0) return null;

  return SCORE_RADAR_AXES.map(({ key, label }) => {
    const sum = scores.reduce((a, s) => a + (s[key] as number), 0);
    return {
      label,
      value: Math.round((sum / scores.length) * 10) / 10,
      max: 10,
    };
  });
}
